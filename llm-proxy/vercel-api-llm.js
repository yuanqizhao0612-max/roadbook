// 路书 · LLM 代理（Vercel Edge Function 版）
// ---------------------------------------------------------------
// 与 worker.js 同款契约，仅部署平台不同。把本文件放到一个 Git 仓库的 api/ 目录下
// （即 api/llm.js），导入 Vercel 项目，设置环境变量 DEEPSEEK_API_KEY，部署即可。
// 部署后端点形如：https://<你的项目>.vercel.app/api/llm
// 然后在路书应用控制台执行：
//   localStorage.setItem('roadbook_llm_endpoint','https://<你的项目>.vercel.app/api/llm')
// 整页硬刷新即点亮真 AI。
// ---------------------------------------------------------------
export const config = { runtime: 'edge' }

export default async function handler(request) {
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

  const key = process.env.DEEPSEEK_API_KEY
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
