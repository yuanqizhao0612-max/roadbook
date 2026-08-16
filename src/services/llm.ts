// ============================================================
// 路书 · 真 LLM 调用层
// 设计铁律：任何失败都返回 null → 调用方回退到本地 fixture，现场演示永不崩。
//
// 调用策略（安全优先）：
//   1. 若浏览器 localStorage 注入了 key（roadbook_deepseek_key）→ 直连 DeepSeek（演示者自用）
//   2. 否则 → 走云函数代理（roadbook_llm_proxy，默认云端 api-llm）
//      key 在云端 config.json，浏览器永不接触 key，评委/公网均可安全体验真 AI
//   3. 全部失败 → 返回 null → fixture 回退
//
// 前端绝不内置任何 key（内置 key 会随 bundle 公开 → 被盗刷，2026-08-16 事故）
// ============================================================

const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions'
const DEFAULT_MODEL = 'deepseek-chat'

// 云端代理端点（腾讯云 CloudBase 部署的 api-llm 云函数，HTTP 访问服务路径 /api-llm）
const CLOUDBASE_PROXY = 'https://cloud1-d4g2xd1xsd3a55120.service.tcloudbase.com/api-llm'

function resolveKey(): string {
  // 仅用于演示者本机：构建期环境变量 VITE_DEEPSEEK_KEY（私有构建）或 localStorage 注入
  const builtin = ((import.meta as any).env?.VITE_DEEPSEEK_KEY as string | undefined)?.trim() || ''
  if (builtin) return builtin
  try {
    const ls = localStorage.getItem('roadbook_deepseek_key')
    if (ls && ls.trim()) return ls.trim()
  } catch { /* ignore */ }
  return ''
}

function resolveProxy(): string | null {
  // 默认走云端代理；可用环境变量 / localStorage 覆盖或关闭（设为 'off'）
  const env = ((import.meta as any).env?.VITE_LLM_PROXY as string | undefined)?.trim()
  if (env) return env === 'off' ? null : env
  try {
    const ls = localStorage.getItem('roadbook_llm_proxy')
    if (ls && ls.trim()) return ls.trim() === 'off' ? null : ls.trim()
  } catch { /* ignore */ }
  return CLOUDBASE_PROXY
}

/** 是否启用真实大模型（代理或本地 key 任一可用即启用） */
export function llmEnabled(): boolean {
  return resolveKey().length > 0 || resolveProxy() !== null
}

export interface LlmMsg {
  role: 'user' | 'assistant' | 'system'
  content: string
}

async function callDirect(key: string, system: string, messages: LlmMsg[], opts: { timeoutMs?: number; maxTokens?: number }): Promise<string | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 12000)
  try {
    const res = await fetch(DEEPSEEK_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [{ role: 'system', content: system }, ...messages],
        temperature: 0.7,
        max_tokens: opts.maxTokens ?? 600
      }),
      signal: ctrl.signal
    })
    if (!res.ok) return null
    const data = await res.json()
    const reply = data?.choices?.[0]?.message?.content ?? null
    return reply && reply.length > 0 ? reply : null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

async function callViaProxy(proxy: string, system: string, messages: LlmMsg[], opts: { timeoutMs?: number; maxTokens?: number }): Promise<string | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs ?? 30000)
  try {
    const res = await fetch(proxy, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, messages }),
      signal: ctrl.signal
    })
    let data: any
    try { data = await res.json() } catch { return null }
    // 兼容 HTTP 访问服务「集成响应」包裹：{ statusCode, headers, body: '{"reply":...}' }
    if (data && typeof data.body === 'string' && typeof data.statusCode === 'number') {
      try { data = JSON.parse(data.body) } catch { /* ignore */ }
    }
    if (data && typeof data.reply === 'string' && data.reply.length > 0) return data.reply
    return null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

/**
 * 调用真实大模型。
 * @returns 模型回复文本；失败/超时返回 null（调用方应回退 fixture）。
 */
export async function callLLM(
  system: string,
  messages: LlmMsg[],
  opts: { timeoutMs?: number; maxTokens?: number } = {}
): Promise<string | null> {
  // 1) 本地有 key → 直连（演示者自用）
  const localKey = resolveKey()
  if (localKey) {
    const r = await callDirect(localKey, system, messages, opts)
    if (r !== null) return r
  }
  // 2) 走云端代理（评委/公网，key 在云端）
  const proxy = resolveProxy()
  if (proxy) {
    const r = await callViaProxy(proxy, system, messages, opts)
    if (r !== null) return r
  }
  // 3) 全部失败 → fixture 回退
  return null
}
