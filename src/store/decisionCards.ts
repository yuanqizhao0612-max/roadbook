// ============================================================
// 路书 · 人生决策卡 + 反思存储层 (V0.7)
// 用户从前人时间轴中收藏的"认知反转"卡片 + 看完故事后的反思
// 独立 store，不影响主 state 和 library store
// ============================================================

const DECISION_CARDS_KEY = 'roadbook_v0.7.0_decision_cards'
const REFLECTIONS_KEY = 'roadbook_v0.7.0_reflections'

export interface DecisionCard {
  card_id: string
  source_case_id: string       // 来自哪本书
  source_case_title: string    // 书名（冗余，方便展示）
  insight: string              // 认知反转原文（"那时候我以为…后来发现其实是…"）
  user_note?: string           // 用户自己加的备注
  created_at: number
}

export interface UserReflection {
  reflection_id: string
  original_problem: string     // 最初的困惑
  current_thought: string      // 看完后的想法
  source_case_ids: string[]    // 参考了哪些书
  created_at: number
}

// ---------- 人生决策卡 ----------

export function getDecisionCards(): DecisionCard[] {
  try {
    const raw = localStorage.getItem(DECISION_CARDS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DecisionCard[]
  } catch {
    return []
  }
}

export function addDecisionCard(card: Omit<DecisionCard, 'card_id' | 'created_at'>): DecisionCard {
  const cards = getDecisionCards()
  // 去重：同一 insight 不重复收藏
  if (cards.some(c => c.insight === card.insight && c.source_case_id === card.source_case_id)) {
    return cards.find(c => c.insight === card.insight && c.source_case_id === card.source_case_id)!
  }
  const newCard: DecisionCard = {
    ...card,
    card_id: `dcard_${Date.now().toString(36)}`,
    created_at: Date.now(),
  }
  cards.push(newCard)
  try {
    localStorage.setItem(DECISION_CARDS_KEY, JSON.stringify(cards))
  } catch (e) {
    console.warn('[路书] 决策卡保存失败', e)
  }
  return newCard
}

export function removeDecisionCard(cardId: string): void {
  const cards = getDecisionCards().filter(c => c.card_id !== cardId)
  try {
    localStorage.setItem(DECISION_CARDS_KEY, JSON.stringify(cards))
  } catch (e) {
    console.warn('[路书] 决策卡删除失败', e)
  }
}

export function isDecisionCardSaved(insight: string, caseId: string): boolean {
  return getDecisionCards().some(c => c.insight === insight && c.source_case_id === caseId)
}

// ---------- 用户反思 ----------

export function getReflections(): UserReflection[] {
  try {
    const raw = localStorage.getItem(REFLECTIONS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as UserReflection[]
  } catch {
    return []
  }
}

export function addReflection(reflection: Omit<UserReflection, 'reflection_id' | 'created_at'>): UserReflection {
  const reflections = getReflections()
  const newRef: UserReflection = {
    ...reflection,
    reflection_id: `refl_${Date.now().toString(36)}`,
    created_at: Date.now(),
  }
  reflections.push(newRef)
  try {
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections))
  } catch (e) {
    console.warn('[路书] 反思保存失败', e)
  }
  return newRef
}
