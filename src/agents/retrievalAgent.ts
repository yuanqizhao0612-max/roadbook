// ============================================================
// Agent 02 · Experience Retrieval Agent
// 中文角色: "找到以前走过这道题的人"
// 职责: 路书库检索 / 相似排序 / 坑匹配 / source-grounded 对话 / survivorship guard
// V0.5: 按 audience 分层推送 —— 不同人群看到的样本与名人"完完全全不一样"
// ============================================================
import type { AppState, OrdinaryCase, RoadbookEntry, ChatTurn } from '../data/types'
import { allFixtureCases, notableCasesForAudience } from '../data/fixtureCases'
import { getMentorAnswers } from '../data/fixtureMentor'
import { loadLibrary } from '../store/store'
import { realBetaCases } from '../data/realBetaCases'
import { pushTrace } from './base'
import { callLLM, llmEnabled } from '../services/llm'

// ---------- 当前 audience（默认新人） ----------
function aud(state: AppState): string {
  return state.profile?.audience || 'new_grad'
}

// ---------- 场景语义匹配 ----------
// 关键词 → 场景标签：把用户写的问题文本映射到案例的场景维度（跨人群）
const SCENARIO_KEYWORDS: [RegExp, string][] = [
  [/做产品|产品参赛|独立产品|自己的产品|从0到1|从零(做|到)|产品化|做个(小)?(程序|项目|东西)/i, '做产品'],
  [/参赛|比赛|路演|答辩|大赛|初赛|复赛|决赛|提交作品|报名参赛/i, '参赛'],
  [/创业|自己(干|做|起)|开(公司|工作室)|startup|从零(开始)?创业/i, '创业'],
  [/副业|第二曲线|side\s|斜杠|下班后(做|搞)|业余(做|搞|卖)|赚(外快|点钱)/i, '副业'],
  [/方向(一直)?摇摆|不确定(自己)?(想)?方向|该(不)?(该)?(换|转)方向|要不要(换|转)方向|先验证|有没有人要|需求(验证|不确)|验证(一下|这个)?|不知道(想|要)什么|不知道喜欢什么|不知道适合什么/i, '方向验证'],
  [/转行|换行业|换行|跨行|沉没成本|浪费(积累|经验)/i, '转行'],
  [/offer|接\s?offer|要不要接|薪资|涨薪|跳槽|面试机会|离职|辞职|裸辞|要不要(走|离开)/i, '职业选择'],
  [/管理|带(人|团队)|带兵|专家路线/i, '管理or专家'],
  [/被优化|裁员|失业|被裁|35岁|边缘化|被(边缘|架空|排挤)/i, '职业风险'],
  [/生育|怀孕|回归家庭|带(孩子|娃)|宝妈/i, '家庭平衡'],
  [/公务员|考编|体制内|铁饭碗|考公/i, '体制内'],
  [/做内容|做自媒体|做(小红书|B站|抖音|公众号|视频号)|发(笔记|视频)|粉丝|流量|没人看|变现|涨粉/i, '做内容'],
  [/领导|老板|直属|上司|和(领导|老板)(关系|僵|不好)|被(批评|针对|打压)/i, '职场人际']
]

const STRONG_THRESHOLD = 4

export interface Scorable {
  scenario_tags?: string[]
  title: string
  one_line_choice: string
  why_similar?: string
  biggest_pitfall?: string
  audience?: string
}

function entryToScorable(e: RoadbookEntry): Scorable {
  return {
    scenario_tags: e.scenario_tags,
    title: e.problem.raw,
    one_line_choice: e.choice,
    why_similar: '',
    biggest_pitfall: e.biggest_pitfall,
    audience: e.author_profile.audience
  }
}

// 从用户填写/写下的文本中抽取场景标签
export function extractUserTags(state: AppState): { tags: Set<string>; text: string } {
  const p = state.profile
  const parts = [
    state.evidence?.original_problem_reframe || '',
    ...(p?.concerns || []),
    ...(p?.priorities || []),
    p?.industry || '',
    p?.function || '',
    p?.stage || ''
  ]
  const text = parts.join(' ')
  const tags = new Set<string>()
  for (const [re, tag] of SCENARIO_KEYWORDS) if (re.test(text)) tags.add(tag)
  return { tags, text }
}

function scoreScorable(c: Scorable, userTags: Set<string>, state: AppState): number {
  let s = 0
  const ct = c.scenario_tags || []
  for (const t of ct) if (userTags.has(t)) s += 3
  const txt = `${c.title} ${c.one_line_choice} ${c.why_similar || ''} ${c.biggest_pitfall || ''}`
  for (const t of userTags) if (txt.includes(t)) s += 1
  if (c.audience && c.audience === aud(state)) s += 2
  const p = state.profile
  if (p?.industry && txt.includes(p.industry)) s += 1
  if (p?.function && txt.includes(p.function)) s += 1
  return s
}

// 当前用户与案例库的整体匹配强度（供 UI 决定要不要诚实兜底）
export function scenarioMatchStrength(state: AppState): 'strong' | 'weak' {
  const { tags } = extractUserTags(state)
  const best = Math.max(
    0,
    ...allFixtureCases.filter(c => !c.notable).map(c => scoreScorable(c, tags, state))
  )
  return best >= STRONG_THRESHOLD ? 'strong' : 'weak'
}

// ---------- 统一检索入口: 真实内测 + Fixture 案例 + 用户贡献路书库 ----------
// 按 audience 优先在同年龄段池里匹配；只有同段候选不足时才跨段兜底。
// 这避免"不惑之年用户看到 24 岁案例"的错位体验。
export function searchLibrary(state: AppState, query?: { profile?: AppState['profile']; problem?: string; theme?: string }): RoadbookEntry[] {
  const audience = aud(state)
  const userEntries = loadLibrary().filter(e => e.visibility === 'anonymous_public')
  // 真实内测案例（经授权、已脱敏）：source_marker='real_beta'，UI 显示「真实内测」徽章
  const realBetaEntries: RoadbookEntry[] = realBetaCases.map(c => ({
    entry_id: c.id,
    visibility: 'anonymous_public' as const,
    source_marker: 'real_beta' as const,
    scenario_tags: c.scenario_tags,
    author_profile: {
      stage: c.who.split('｜')[0] || c.who,
      age_range: '',
      audience: c.audience,
      industry: c.case_profile ? `${c.case_profile.industry_from} → ${c.case_profile.industry_to}` : '',
      function: c.case_profile ? c.case_profile.role_from : ''
    },
    problem: { raw: c.title, tags: c.scenario_tags || [c.profile_tag] },
    choice: c.one_line_choice,
    reasons: [],
    outcome: { time_horizon: c.time_horizon, summary: c.outcome, satisfaction: c.satisfaction },
    biggest_pitfall: c.biggest_pitfall,
    if_again: c.if_again,
    advice_to_later_people: c.advice,
    created_at: '',
    source_type: 'fixture' as const,
    case_profile: c.case_profile
  }))
  // Fixture：所有普通人案例
  const allFixtureEntries: RoadbookEntry[] = allFixtureCases
    .filter(c => !c.notable)
    .map(c => ({
      entry_id: c.id,
      visibility: 'anonymous_public' as const,
      source_marker: c.source_marker,
      scenario_tags: c.scenario_tags,
      author_profile: {
        stage: c.who.split('｜')[0] || '',
        age_range: '',
        audience: c.audience,
        industry: c.case_profile ? `${c.case_profile.industry_from} → ${c.case_profile.industry_to}` : '',
        function: c.case_profile ? c.case_profile.role_from : ''
      },
      problem: { raw: c.title, tags: c.scenario_tags || [c.profile_tag] },
      choice: c.one_line_choice,
      reasons: [],
      outcome: { time_horizon: c.time_horizon, summary: c.outcome, satisfaction: c.satisfaction },
      biggest_pitfall: c.biggest_pitfall,
      if_again: c.if_again,
      advice_to_later_people: c.advice,
      created_at: '',
      source_type: 'fixture' as const,
      case_profile: c.case_profile
    }))

  // 按年龄段分池：同段优先，跨段兜底
  const sameAudience = allFixtureEntries.filter(e => e.author_profile.audience === audience)
  const crossAudience = allFixtureEntries.filter(e => e.author_profile.audience !== audience)
  const sameBeta = realBetaEntries.filter(e => e.author_profile.audience === audience)

  // 同段池 + 用户贡献；如果不够 4 条，补跨段
  const samePool = [...userEntries, ...sameBeta, ...sameAudience]
  if (samePool.length >= 6) {
    // 同段够用：只用同段池（但保留少量跨段最高分做参考，放在最后）
    return samePool
  }
  // 同段不够：同段在前，跨段兜底
  return [...samePool, ...crossAudience]
}

// ---------- 相似排序（跨人群 + 场景语义 + 诚实兜底） ----------
export function rankSimilarEntries(state: AppState, entries: RoadbookEntry[], limit = 3): { entry: RoadbookEntry; reason: string; score: number; weak: boolean }[] {
  const { tags } = extractUserTags(state)
  const scored = entries.map(e => {
    const sc = scoreScorable(entryToScorable(e), tags, state)
    const shared = (e.scenario_tags || []).filter(t => tags.has(t))
    return { entry: e, score: sc, shared }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map(s => ({
    entry: s.entry,
    score: s.score,
    weak: s.score < STRONG_THRESHOLD,
    reason: s.shared.length
      ? `都涉及「${s.shared.join(' · ')}」——TA 当时也在这个节骨眼上犹豫过。`
      : '这几页和你处境最接近，供参考；若都不贴切，也欢迎你写一页给后来的人。'
  }))
}

export interface RankedCase {
  case: OrdinaryCase
  score: number
  weak: boolean
  shared: string[]
  reason?: string
}

function rankCasesByScenario(cases: OrdinaryCase[], tags: Set<string>, state: AppState, limit = 4): RankedCase[] {
  return cases
    .map(c => {
      const sc = scoreScorable(c, tags, state)
      const shared = (c.scenario_tags || []).filter(t => tags.has(t))
      return { case: c, score: sc, weak: sc < STRONG_THRESHOLD, shared }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

// ---------- 三类案例入口（跨人群场景排序） ----------
export function getPeerCases(state: AppState): RankedCase[] {
  const { tags } = extractUserTags(state)
  const peers = allFixtureCases.filter(c => !c.notable && c.stage_tag === 'peer')
  return rankCasesByScenario(peers, tags, state)
}
export function getLookbackCases(state: AppState): RankedCase[] {
  const { tags } = extractUserTags(state)
  const lbs = allFixtureCases.filter(c => !c.notable && c.stage_tag === 'lookback')
  return rankCasesByScenario(lbs, tags, state)
}
export function getHistoricalCases(state: AppState): OrdinaryCase[] {
  return notableCasesForAudience(aud(state))
}

// ---------- 真 AI 接管核心匹配（LLM 语义排序 + 个性化解读） ----------
// 把用户真实写下的困惑 + 候选案例摘要喂给 LLM，让它做语义相关度判断并写口语化理由。
// 未配置网关（llmEnabled()=false）或无真实文本时，自动回退到上面的规则引擎（fixture-first 安全网）。

interface NormCase {
  id: string
  title: string
  choice: string
  who: string
  tags: string[]
  pitfall: string
  why: string
  outcome: string
}

async function llmPickRelevant(cands: NormCase[], userText: string): Promise<{ id: string; score: number; reason: string }[] | null> {
  if (!llmEnabled() || cands.length === 0) return null
  const list = cands.map((c, i) =>
    `${i + 1}. [id=${c.id}] 题目：${c.title}／选择：${c.choice}／标签：${(c.tags || []).join('、') || '无'}／最大的坑：${c.pitfall}／结果：${c.outcome}`
  ).join('\n')
  const system = `你是"路书"的内容匹配官。用户写下了一段真实的人生/职业困惑，下面是一批"过来人路书"的摘要。
你要做的是：仔细读用户困惑的核心矛盾（不是表面关键词，是背后的纠结），然后在候选里找出真正经历过类似处境的人——哪怕表面场景不同，只要内核挣扎相似就算相关。
请判断每条与用户困惑的语义相关度（0-10），并写一句口语化、个性化的理由，说明"为什么这一页和你有关"。
严格要求：
- 只输出一个 JSON 数组，不要 markdown 代码块、不要任何额外文字。
- 元素格式：{"id":"候选的id","score":数字0-10,"reason":"不超过26个字的口语化理由，说清哪里像"}
- 无关条目的 score 给 0-2；高度相关的给 8-10；从高到低排。
- 最多返回 6 条（最相关的在前），都不相关就返回空数组 []。
- 判断相关度时看"核心矛盾是否相似"，不要只看行业/岗位是否匹配。`
  const user = `用户困惑：\n${userText}\n\n路书候选：\n${list}`
  const reply = await callLLM(system, [{ role: 'user', content: user }], { timeoutMs: 30000 })
  if (!reply) return null
  try {
    const cleaned = reply.replace(/```json/gi, '').replace(/```/g, '').trim()
    const arr = JSON.parse(cleaned)
    if (!Array.isArray(arr)) return null
    return arr
      .filter((x: any) => x && typeof x.id === 'string')
      .map((x: any) => ({ id: x.id, score: Number(x.score) || 0, reason: String(x.reason || '') }))
  } catch {
    return null
  }
}

function userProblemText(state: AppState): string {
  const p = state.profile
  const profileText = p
    ? `${p.industry || ''} ${p.function || ''} ${(p.concerns || []).join(' ')} ${(p.priorities || []).join(' ')} ${p.stage || ''}`
    : ''
  return `${state.evidence?.original_problem_reframe || ''}\n${profileText}`.trim()
}

// 主链路（路书库 / 和我相似）：返回与 rankSimilarEntries 同形状，便于页面零改动渲染
export async function matchEntriesWithLLM(
  state: AppState,
  entries: RoadbookEntry[],
  limit = 4
): Promise<{ ranked: { entry: RoadbookEntry; reason: string; score: number; weak: boolean }[]; weak: boolean }> {
  const rule = rankSimilarEntries(state, entries, limit)
  const text = userProblemText(state)
  if (!llmEnabled() || text.length < 4) return { ranked: rule, weak: rule.every(x => x.weak) }
  const cands: NormCase[] = entries.map(e => ({
    id: e.entry_id,
    title: e.problem.raw,
    choice: e.choice,
    who: e.author_profile.stage || e.author_profile.industry || '',
    tags: e.scenario_tags || [],
    pitfall: e.biggest_pitfall,
    why: '',
    outcome: e.outcome.summary
  }))
  const picks = await llmPickRelevant(cands, text)
  if (!picks || picks.length === 0) return { ranked: rule, weak: true }
  const byId = new Map(picks.map(p => [p.id, p]))
  const ranked = entries
    .filter(e => byId.has(e.entry_id))
    .map(e => {
      const p = byId.get(e.entry_id)!
      return { entry: e, score: p.score, weak: p.score < STRONG_THRESHOLD, reason: p.reason }
    })
  // 补足：LLM 返回少于 limit 时，用规则结果补齐，避免书架空着
  if (ranked.length < limit) {
    const have = new Set(ranked.map(r => r.entry.entry_id))
    for (const r of rule) {
      if (!have.has(r.entry.entry_id)) {
        ranked.push(r)
        have.add(r.entry.entry_id)
      }
      if (ranked.length >= limit) break
    }
  }
  const weak = ranked.length === 0 || ranked.every(r => r.weak)
  return { ranked: ranked.slice(0, limit), weak }
}

// 同类案例入口（peer / lookback）：返回与 RankedCase 同形状
export async function matchCasesWithLLM(state: AppState, kind: 'peer' | 'lookback', limit = 4): Promise<RankedCase[]> {
  const stage = kind === 'peer' ? 'peer' : 'lookback'
  const all = allFixtureCases.filter(c => !c.notable && c.stage_tag === stage)
  const rule = rankCasesByScenario(all, extractUserTags(state).tags, state, limit)
  const text = userProblemText(state)
  if (!llmEnabled() || text.length < 4) return rule
  const cands: NormCase[] = all.map(c => ({
    id: c.id,
    title: c.title,
    choice: c.one_line_choice,
    who: c.who,
    tags: c.scenario_tags || [],
    pitfall: c.biggest_pitfall,
    why: c.why_similar,
    outcome: c.outcome
  }))
  const picks = await llmPickRelevant(cands, text)
  if (!picks || picks.length === 0) return rule.map(r => ({ ...r, weak: true }))
  const byId = new Map(picks.map(p => [p.id, p]))
  const userTags = extractUserTags(state).tags
  let ranked: RankedCase[] = all
    .filter(c => byId.has(c.id))
    .map(c => {
      const p = byId.get(c.id)!
      const shared = (c.scenario_tags || []).filter(t => userTags.has(t))
      return { case: c, score: p.score, weak: p.score < STRONG_THRESHOLD, shared, reason: p.reason }
    })
  if (ranked.length < limit) {
    const have = new Set(ranked.map(r => r.case.id))
    for (const r of rule) {
      if (!have.has(r.case.id)) {
        ranked.push(r)
        have.add(r.case.id)
      }
      if (ranked.length >= limit) break
    }
  }
  return ranked.slice(0, limit)
}

export function findCaseById(id: string): OrdinaryCase | undefined {
  return allFixtureCases.find(c => c.id === id)
}

// V0.6 时光机专用：只在有时间轴的样本池里做语义匹配
export async function matchTimelineCasesWithLLM(state: AppState, limit = 4): Promise<RankedCase[]> {
  const pool = allFixtureCases.filter(c => c.timeline_followups && c.timeline_followups.length > 0)
  const rule = rankCasesByScenario(pool, extractUserTags(state).tags, state, limit)
  const text = userProblemText(state)
  if (!llmEnabled() || text.length < 4) return rule
  const cands: NormCase[] = pool.map(c => ({
    id: c.id,
    title: c.title,
    choice: c.one_line_choice,
    who: c.who,
    tags: c.scenario_tags || [],
    pitfall: c.biggest_pitfall,
    why: c.why_similar,
    outcome: c.outcome
  }))
  const picks = await llmPickRelevant(cands, text)
  if (!picks || picks.length === 0) return rule.map(r => ({ ...r, weak: true }))
  const byId = new Map(picks.map(p => [p.id, p]))
  const userTags = extractUserTags(state).tags
  let ranked: RankedCase[] = pool
    .filter(c => byId.has(c.id))
    .map(c => {
      const p = byId.get(c.id)!
      const shared = (c.scenario_tags || []).filter(t => userTags.has(t))
      return { case: c, score: p.score, weak: p.score < STRONG_THRESHOLD, shared, reason: p.reason }
    })
  if (ranked.length < limit) {
    const have = new Set(ranked.map(r => r.case.id))
    for (const r of rule) {
      if (!have.has(r.case.id)) {
        ranked.push(r)
        have.add(r.case.id)
      }
      if (ranked.length >= limit) break
    }
  }
  return ranked.slice(0, limit)
}

// ---------- source-grounded 对话 (V0.5: 按选中的名人返回对应回答) ----------
export function groundedReply(state: AppState, question: string): { turn: ChatTurn; state: AppState } {
  const answers = getMentorAnswers(state.selectedEntry)
  const rule = answers.find(r => r.match.test(question)) || answers[answers.length - 1]
  const turn: ChatTurn = {
    role: 'mentor',
    text: rule.answer,
    source_chips: [rule.chip],
    answer_mode: rule.mode
  }
  const traces = pushTrace(state, 'retrieval', 'source_grounded_dialogue', {
    question: question.slice(0, 40),
    figure: state.selectedEntry || 'historical_luxun_001',
    mode: rule.mode
  })
  return { turn, state: traces }
}

// ---------- 反例 / 边界示例 (survivorship guard) ----------
export function counterExample(): string {
  return '同样选择"换方向"：有人因为新方向验证过、有退路，越换越好；也有人因为情绪逃离、没有真实体验，半年后回到原点——条件不同，结果完全不同。成功的人做了 A，不等于做 A 就会成功。'
}
