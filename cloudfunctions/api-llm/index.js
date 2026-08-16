// ============================================================
// 路书 · api-llm 云函数（HTTP 访问服务直接绑定）
// 职责：把前端传来的「系统提示词 + 对话历史」转发给 DeepSeek，
//       返回 { reply }。任何异常都返回 { reply: null }，
//       让前端优雅回退到本地 fixture，演示永不崩。
// 部署：云开发控制台 → HTTP 访问服务 → 新增路径 /api-llm → 指向本函数
// 密钥：在 config.json 的 env.DEEPSEEK_API_KEY 填入，或用环境变量注入。
// 安全：① 密钥只存服务端，前端永不接触；② 轻量 IP 频率限制防公开 Demo 被白嫖。
// ============================================================
const https = require('https')
const fs = require('fs')
const path = require('path')

// 双保险读密钥：微信云开发 config.json 的 env 不保证注入 process.env
function getKey() {
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'))
    if (cfg.env && cfg.env.DEEPSEEK_API_KEY) return cfg.env.DEEPSEEK_API_KEY
  } catch (e) { /* ignore */ }
  return ''
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

function resp(statusCode, bodyObj) {
  // 集成响应格式：HTTP 访问服务会据此设置状态码/头/体
  return { statusCode, headers: CORS, body: JSON.stringify(bodyObj) }
}

// ------------------------------------------------------------
// 轻量频率限制（best-effort，按客户端 IP 的 60s 滑动窗口）
// 说明：函数实例级内存统计，能挡住「同一实例被单客户端猛刷」；
// 跨实例/冷启动不完全精确，作为公开 Demo 的第一道低成本防线。
// 真正的强限制可后续接入 CloudBase 数据库或网关层配额。
// ------------------------------------------------------------
const RATE = { windowMs: 60 * 1000, max: 30 } // 每 IP 每分钟最多 30 次
const _hits = new Map() // ip -> [timestamp, ...]

function getClientIp(headers) {
  const h = {}
  for (const k in (headers || {})) h[String(k).toLowerCase()] = headers[k]
  return h['x-forwarded-for']?.split(',')[0]?.trim()
    || h['x-real-ip']?.trim()
    || h['x-client-ip']?.trim()
    || 'unknown'
}

function rateLimited(ip) {
  const now = Date.now()
  const arr = (_hits.get(ip) || []).filter(t => now - t < RATE.windowMs)
  arr.push(now)
  _hits.set(ip, arr)
  // 周期性清理，避免内存无限增长
  if (_hits.size > 2000) {
    for (const [k, v] of _hits) {
      if (v[v.length - 1] < now - RATE.windowMs) _hits.delete(k)
    }
  }
  return arr.length > RATE.max
}

function postJSON(url, data, timeoutMs) {
  return new Promise((resolve, reject) => {
    const u = new URL(url)
    const payload = JSON.stringify(data)
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getKey()}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let buf = ''
      res.on('data', d => { buf += d })
      res.on('end', () => {
        try { resolve(JSON.parse(buf)) } catch (e) { reject(e) }
      })
    })
    req.on('error', reject)
    req.setTimeout(timeoutMs || 25000, () => req.destroy(new Error('TIMEOUT')))
    req.write(payload)
    req.end()
  })
}

exports.main = async (event) => {
  const method = (event.httpMethod || (event.headers && (event.headers['x-method'] || event.headers['X-Method'])) || '').toUpperCase()
  if (method === 'OPTIONS') return resp(204, {})

  // 频率限制（仅对真实请求生效，预检放行）
  const ip = getClientIp(event.headers)
  if (rateLimited(ip)) {
    return resp(200, { reply: null, error: 'RATE_LIMITED' })
  }

  const key = getKey()
  if (!key) return resp(200, { reply: null, error: 'NO_KEY' })

  let payload = {}
  try {
    payload = typeof event.body === 'string' ? JSON.parse(event.body) : (event.body || {})
  } catch (e) {
    return resp(200, { reply: null, error: 'BAD_BODY' })
  }

  const { system, messages } = payload
  if (!system || !Array.isArray(messages)) {
    return resp(200, { reply: null, error: 'BAD_PARAMS' })
  }

  try {
    const data = await postJSON('https://api.deepseek.com/v1/chat/completions', {
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: system }, ...messages],
      temperature: 0.7,
      max_tokens: 600
    }, 25000)
    const reply =
      data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
    return resp(200, { reply: reply || null })
  } catch (e) {
    return resp(200, { reply: null, error: 'UPSTREAM_FAIL' })
  }
}
