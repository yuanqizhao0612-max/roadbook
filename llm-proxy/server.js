// 路书 · 本地 LLM 代理（Node 单文件版，零依赖）
// ---------------------------------------------------------------
// 作用：本地持有 DeepSeek Key，把前端的 {system, messages} 转发给 DeepSeek 返回 {reply}。
//       浏览器因 CORS / 混合内容不能直接调 localhost 之外的 HTTP，本代理解决。
// 用法：
//   1) 终端：cd roadbook/llm-proxy
//   2) 终端：node server.js        （保持这个终端开着）
//   3) 浏览器打开路书（建议用 npm run dev 起的 http://localhost:5173，避免 HTTPS 混合内容拦截）
//   4) 控制台：localStorage.setItem('roadbook_llm_endpoint','http://localhost:8787')  → 硬刷新
// ---------------------------------------------------------------

import http from 'node:http'

const PORT = 8787
// 你的当前有效 Key（也可改成从环境变量读：process.env.DEEPSEEK_API_KEY）
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-REVOKED'
const UPSTREAM_TIMEOUT_MS = 20_000

const server = http.createServer((req, res) => {
  // CORS：允许任何前端源调用
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.writeHead(200)
    res.end(JSON.stringify({ reply: null, error: 'METHOD' }))
    return
  }

  let body = ''
  req.on('data', (chunk) => { body += chunk })
  req.on('end', () => {
    let payload
    try { payload = JSON.parse(body || '{}') }
    catch (e) {
      res.writeHead(200)
      res.end(JSON.stringify({ reply: null, error: 'BAD_BODY' }))
      return
    }

    const { system, messages } = payload || {}
    if (!system || !Array.isArray(messages)) {
      res.writeHead(200)
      res.end(JSON.stringify({ reply: null, error: 'BAD_PARAMS' }))
      return
    }

    const upstream = http.request(
      {
        hostname: 'api.deepseek.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        timeout: UPSTREAM_TIMEOUT_MS
      },
      (upRes) => {
        let data = ''
        upRes.on('data', (c) => { data += c })
        upRes.on('end', () => {
          try {
            const parsed = JSON.parse(data)
            const reply = parsed?.choices?.[0]?.message?.content ?? null
            console.log('[OK] DeepSeek 返回', (reply || '').slice(0, 40), '...')
            res.writeHead(200)
            res.end(JSON.stringify({ reply }))
          } catch (e) {
            console.log('[ERR] 解析上游响应失败', data.slice(0, 120))
            res.writeHead(200)
            res.end(JSON.stringify({ reply: null, error: 'UPSTREAM_FAIL' }))
          }
        })
      }
    )

    upstream.on('timeout', () => {
      upstream.destroy()
      console.log('[ERR] 上游超时')
      res.writeHead(200)
      res.end(JSON.stringify({ reply: null, error: 'UPSTREAM_TIMEOUT' }))
    })

    upstream.on('error', (e) => {
      console.log('[ERR] 上游错误', e.message)
      res.writeHead(200)
      res.end(JSON.stringify({ reply: null, error: 'UPSTREAM_FAIL' }))
    })

    upstream.write(JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: system }, ...messages],
      temperature: 0.7,
      max_tokens: 600
    }))
    upstream.end()
  })
})

server.listen(PORT, () => {
  console.log(`✅ 路书 LLM 代理已启动: http://localhost:${PORT}`)
  console.log(`   按 Ctrl+C 停止。DeepSeek Key: ${DEEPSEEK_API_KEY.slice(0, 6)}...`)
})
