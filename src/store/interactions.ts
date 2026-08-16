// ============================================================
// 路书 · 书本互动数据层 (翻阅次数 + 后来人留言)
// 独立 store，不影响主 state 和 library store
// ============================================================

const INTERACTIONS_KEY = 'roadbook_v0.5.0_book_interactions'

export interface BookComment {
  id: string
  text: string         // "这句话救了我" / "我也是这么过来的"
  author_stage: string // "30岁 · 互联网"（脱敏）
  ts: string
}

export interface BookInteractions {
  // entry_id → 翻阅次数（含模拟基线）
  reads: Record<string, number>
  // entry_id → 留言列表
  comments: Record<string, BookComment[]>
}

// 模拟基线：给每本书一个合理的"已有人翻过"数字，让初期不显得空
// 用 entry_id 的字符 hash 生成稳定的伪随机数
function baselineReads(entryId: string): number {
  let h = 0
  for (let i = 0; i < entryId.length; i++) {
    h = ((h << 5) - h) + entryId.charCodeAt(i)
    h |= 0
  }
  return 30 + Math.abs(h) % 180 // 30-210 之间
}

export function loadInteractions(): BookInteractions {
  try {
    const raw = localStorage.getItem(INTERACTIONS_KEY)
    if (!raw) return { reads: {}, comments: {} }
    return JSON.parse(raw) as BookInteractions
  } catch {
    return { reads: {}, comments: {} }
  }
}

export function saveInteractions(data: BookInteractions): void {
  try {
    localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('[路书] 互动数据保存失败', e)
  }
}

// 获取某本书的翻阅次数（真实翻过 + 模拟基线）
export function getReads(entryId: string): number {
  const data = loadInteractions()
  const real = data.reads[entryId] || 0
  return baselineReads(entryId) + real
}

// 记录一次翻阅
export function recordRead(entryId: string): void {
  const data = loadInteractions()
  data.reads[entryId] = (data.reads[entryId] || 0) + 1
  saveInteractions(data)
}

// 获取某本书的留言
export function getComments(entryId: string): BookComment[] {
  const data = loadInteractions()
  return data.comments[entryId] || []
}

// 添加留言
export function addComment(entryId: string, text: string, authorStage: string): BookComment {
  const data = loadInteractions()
  const comment: BookComment = {
    id: `cmt_${Date.now().toString(36)}`,
    text,
    author_stage: authorStage,
    ts: new Date().toISOString(),
  }
  if (!data.comments[entryId]) data.comments[entryId] = []
  data.comments[entryId].push(comment)
  saveInteractions(data)
  return comment
}
