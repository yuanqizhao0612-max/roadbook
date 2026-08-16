// ============================================================
// 路书 · 真 LLM 调用层（DeepSeek 浏览器直连）
// 设计铁律：任何失败都返回 null → 调用方回退到本地 fixture，现场演示永不崩。
//
// DeepSeek API 原生支持 CORS（已实测），浏览器可直连，无需代理。
// Key 通过构建期环境变量 VITE_DEEPSEEK_KEY 注入；
// 也支持 localStorage 覆盖（roadbook_deepseek_key），便于演示即时点亮。
//
// 安全提示：key 在前端 bundle 中，仅用于参赛 demo；赛后务必轮换。
// ============================================================

const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions'
const DEFAULT_MODEL = 'deepseek-chat'

function resolveKey(): string {
  // 安全策略（2026-08-16 密钥泄露事故后）：
  // - 不再内置任何 key（内置 key 会随 bundle 公开，任何人可提取盗刷）
  // - 优先：构建期环境变量 VITE_DEEPSEEK_KEY（仅在本地私有构建时注入）
  // - 其次：localStorage（roadbook_deepseek_key）— 现场演示时通过控制台注入自己的 key
  // - 都没有 → 返回空串 → 调用走 fixture 回退，演示不崩但不耗真实 token
  const builtin = ((import.meta as any).env?.VITE_DEEPSEEK_KEY as string | undefined)?.trim() || ''
  if (builtin) return builtin
  try {
    const ls = localStorage.getItem('roadbook_deepseek_key')
    if (ls && ls.trim()) return ls.trim()
  } catch { /* ignore */ }
  return ''
}

/** 是否启用真实大模型（仅当存在 key 时才启用） */
export function llmEnabled(): boolean {
  return resolveKey().length > 0
}

export interface LlmMsg {
  role: 'user' | 'assistant' | 'system'
  content: string
}

/**
 * 调用真实大模型（DeepSeek 浏览器直连）。
 * @returns 模型回复文本；失败/超时返回 null（调用方应回退 fixture）。
 */
export async function callLLM(
  system: string,
  messages: LlmMsg[],
  opts: { timeoutMs?: number; maxTokens?: number } = {}
): Promise<string | null> {
  const key = resolveKey()
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
