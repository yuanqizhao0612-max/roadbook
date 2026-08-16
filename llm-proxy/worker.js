// 路书 · LLM 代理（Cloudflare Worker 单文件版）
// ---------------------------------------------------------------
// 作用：服务端持有 DeepSeek Key，把前端的 {system, messages} 转发给 DeepSeek，
//       返回 { reply }。浏览器因 CORS 不能直接调 DeepSeek，必须走这个代理。
// 契约：与 roadbook/src/services/llm.ts 的 callLLM 完全对齐，应用无需改代码。
//
// 部署（约 1 分钟，免构建）：
//   1) 打开 dash.cloudflare.com → 左侧「Workers 和 Pages」→ 「创建」→ 选「Worker」
//   2) 取名（如 roadbook-llm）→ 在代码框粘贴本文件 → 「部署」
//   3) 部署后点「设置」→「变量」→ 添加变量名 DEEPSEEK_API_KEY，值填你的 key
//      （建议点「加密」保存；key 形如 sk-xxxx）
//   4) 部署完成会得到地址：https://roadbook-llm.<你的子域>.workers.dev
//   5) 在路书应用里打开浏览器控制台，执行：
//      localStorage.setItem('roadbook_llm_endpoint','https://roadbook-llm.<你的子域>.workers.dev')
//      然后整页硬刷新（Cmd/Ctrl+Shift+R），真 AI 即点亮。
// ---------------------------------------------------------------

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
        })
      })
      const data = await upstream.json()
      const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
        ? data.choices[0].message.content
        : null
      return new Response(JSON.stringify({ reply }), { status: 200, headers: cors })
    } catch (e) {
      return new Response(JSON.stringify({ reply: null, error: 'UPSTREAM_FAIL' }), { status: 200, headers: cors })
    }
  }
}
