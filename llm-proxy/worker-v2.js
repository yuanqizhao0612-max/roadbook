// 路书 · LLM 代理（Cloudflare Worker 单文件版）v2 — 带超时
// ---------------------------------------------------------------
// 作用：服务端持有 DeepSeek Key，把前端的 {system, messages} 转发给 DeepSeek，
//       返回 { reply }。浏览器因 CORS 不能直接调 DeepSeek，必须走这个代理。
// v2 修复：上游 fetch 加 15s AbortController 超时，避免 Worker 永久挂起。
//
// 部署：
//   1) dash.cloudflare.com → Workers → 选你的 roadbook-llm Worker
//   2) 点「Edit code」→ 全选删除 → 粘贴本文件 → 「Deploy」
//   3) Settings → Variables → DEEPSEEK_API_KEY = sk-...（Secret）
//   4) 再次 Deploy（改代码后必须重部署）
// ---------------------------------------------------------------

const UPSTREAM_TIMEOUT_MS = 15_000

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ reply: null, error: 'METHOD' }), { status: 200, headers: cors })
    }

    const key = env.DEEPSEEK_API_KEY
    if (!key) {
      return new Response(JSON.stringify({ reply: null, error: 'NO_KEY' }), { status: 200, headers: cors })
    }

    let payload
    try {
      payload = await request.json()
    } catch (e) {
      return new Response(JSON.stringify({ reply: null, error: 'BAD_BODY' }), { status: 200, headers: cors })
    }

    const { system, messages } = payload || {}
    if (!system || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ reply: null, error: 'BAD_PARAMS' }), { status: 200, headers: cors })
    }

    // ---- 调 DeepSeek（带超时） ----
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), UPSTREAM_TIMEOUT_MS)
    try {
      const upstream = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'system', content: system }, ...messages],
          temperature: 0.7,
          max_tokens: 600
        }),
        signal: ctrl.signal
      })
      clearTimeout(timer)

      const data = await upstream.json()
      const reply =
        data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
          ? data.choices[0].message.content
          : null
      return new Response(JSON.stringify({ reply }), { status: 200, headers: cors })
    } catch (e) {
      clearTimeout(timer)
      const errMsg = e instanceof DOMException && e.name === 'AbortError'
        ? 'UPSTREAM_TIMEOUT'
        : 'UPSTREAM_FAIL'
      return new Response(JSON.stringify({ reply: null, error: errMsg }), { status: 200, headers: cors })
    }
  }
}
