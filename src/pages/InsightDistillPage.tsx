import { useState, useEffect } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import Icon from '../components/Icon'
import type { OrdinaryCase, DistillResult } from '../data/types'
import { allFixtureCases } from '../data/fixtureCases'
import { loadLibrary } from '../store/store'
import { callLLM } from '../services/llm'
import { addDecisionCard } from '../store/decisionCards'
import { pushTrace } from '../agents/base'

// 精华提炼：一次 LLM 调用，输出三块"职责完全不同"的精华（V0.9.3 防重复强化版）
// V0.9.9:2：LLM 输出不可信，parse 后必须归一化（类型强校验），杜绝白屏。
function asArr<T>(v: unknown): T[] { return Array.isArray(v) ? (v as T[]) : [] }
function asStr(v: unknown): string { return typeof v === 'string' ? v : '' }
function normalizeDistill(raw: unknown): DistillResult {
  if (!raw || typeof raw !== 'object') throw new Error('not an object')
  const r = raw as Record<string, unknown>
  const mind_shifts = asArr<Record<string, unknown>>(r.mind_shifts)
    .map(m => ({ before: asStr(m?.before), after: asStr(m?.after) }))
    .filter(m => m.before || m.after)
  const decision_principles = asArr(r.decision_principles).map(p => asStr(p)).filter(Boolean)
  if (mind_shifts.length === 0 && decision_principles.length === 0) throw new Error('no content')
  return { mind_shifts, decision_principles, for_your_situation: asStr(r.for_your_situation) }
}

const DISTILL_SYSTEM = `你是"路书"的人生图书馆馆员。你的任务：基于用户当下的困惑 + 一本"过来人之书"的完整时间轴，提炼出真正有含金量的人生精华。

你的输出分三块，每一块的"职责"完全不同，必须严格遵守，禁止任何两块表达同一个意思、同一个观点、甚至近似措辞：

【第一块 mind_shifts】只讲"认知层面的翻转"——这个过来人"那时候以为 X，后来发现其实是 Y"。这是 TA 内心观念的变化，不是方法、不是建议、不是人生道理。2-3 条。
示例格式：
[
  {"before": "我那时候以为，第一份工作选公司名气大的肯定没错", "after": "后来发现，直属管理者比公司名气重要十倍"},
  {"before": "我那时候以为，多加班多干活就是成长", "after": "后来发现，没有反馈的忙只是熟练，不是成长"}
]
注意：这里的 before/after 必须是"观念对观念"的翻转，不要写成"建议"。

【第二块 decision_principles】只讲"可带走、可复用的决策原则"——从 TA 的经历里能抽出来的"下次遇到类似的事，可以按什么标准来判断"的操作智慧。这是方法/标准，不是观念、不是感受。2-3 条，每条一句话，像朋友给的实在建议。
示例格式：
["选工作前先确认三件事：前90天做什么、谁给反馈、一年后能独立做到什么", "一份工作值不值得，看一年后你手里多了什么，而不是入职那一刻的光鲜"]

【第三块 for_your_situation】只讲"结合用户当下的处境，直接对 TA 说的那番话"——把这本书和用户的具体困惑挂钩，指出一个具体的切入点。是"你接下来可以往哪想、往哪试"，不是复述书主人的观念或原则。一段话，不超过 150 字。

三条铁律：
1. 三块内容严禁重复：严禁出现相同或近似的句子、观点、举例。如果你发现要写的和上一块的意思一样，就必须换一个角度、换一层内容。
2. 判断标准：第一块是"TA 的念头怎么变了"(观念)，第二块是"下次遇到事按什么标准判断"(方法)，第三块是"你，现在，该怎么办"(你的处境与切入点)。
3. 只输出 JSON：{"mind_shifts": [...], "decision_principles": [...], "for_your_situation": "..."}，不要任何解释文字、不要 markdown 代码块标记。
- 认知翻转要来自时间轴里真实出现过的内容，不要编造。
- 语气要像一个智慧但不说教的朋友。
- 中文输出。`

export default function InsightDistillPage({ state, setState, goTo }: PageCtx) {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<DistillResult | null>(null)
  const [error, setError] = useState(false)
  const [savedShifts, setSavedShifts] = useState<Set<number>>(new Set())

  const caseId = state.selectedEntry
  const userProblem = state.evidence?.original_problem_reframe || '（用户未填写困惑）'

  const bookCase: OrdinaryCase | undefined =
    allFixtureCases.find(c => c.id === caseId) ||
    (() => {
      const lib = loadLibrary()
      const e = lib.find(x => x.entry_id === caseId)
      if (!e) return undefined
      return {
        id: e.entry_id, source_marker: e.source_marker, audience: e.author_profile.audience || 'new_grad',
        title: e.problem.raw, who: e.author_profile.stage, one_line_choice: e.choice,
        biggest_pitfall: e.biggest_pitfall, why_similar: '', time_horizon: e.outcome.time_horizon,
        outcome: e.outcome.summary, satisfaction: 'mixed' as const, if_again: e.if_again,
        advice: e.advice_to_later_people, stage_tag: 'peer' as const, profile_tag: '',
      }
    })()

  useEffect(() => {
    let alive = true
    if (!bookCase) { if (alive) { setLoading(false); setError(true) } return }

    const timeline = bookCase.timeline_followups || []
    const timelineText = timeline.length > 0
      ? timeline.map(tf => `【${tf.years_after}年后】发生了：${tf.what_happened}；那时TA以为：${tf.what_i_realized}；现状：${tf.current_status}`).join('\n')
      : `选择：${bookCase.one_line_choice}\n结果：${bookCase.outcome}\n如果重来：${bookCase.if_again}\n给后来人的话：${bookCase.advice}`

    const userMsg = `用户当下的困惑：${userProblem}\n\n这本书的主人：${bookCase.who}\nTA 当时面对的问题：${bookCase.title}\nTA 的选择：${bookCase.one_line_choice}\n最值得避开的坑：${bookCase.biggest_pitfall}\n\n时间轴：\n${timelineText}`

    setLoading(true)
    callLLM(DISTILL_SYSTEM, [{ role: 'user', content: userMsg }], { timeoutMs: 55000, maxTokens: 900 })
      .then(reply => {
        if (!alive) return
        if (!reply) { setError(true); setLoading(false); return }
        try {
          const cleaned = reply.replace(/```json|```/g, '').trim()
          // 防 LLM 在 JSON 字符串值里输出裸换行导致解析截断
          const sanitized = cleaned.replace(/[\r\n]+/g, ' ')
          const parsed = normalizeDistill(JSON.parse(sanitized))
          setResult(parsed)
        } catch {
          setError(true)
        }
        setLoading(false)
      })
      .catch(() => { if (alive) { setError(true); setLoading(false) } })

    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveShift = (idx: number, before: string, after: string) => {
    if (!bookCase) return
    const insight = `原来以为：${before}\n现在觉得：${after}`
    addDecisionCard({
      source_case_id: caseId || '',
      source_case_title: bookCase.title,
      insight,
    })
    setState(s => pushTrace(s, 'journey', 'insight_distill_save_shift', { case_id: caseId, idx }))
    setSavedShifts(prev => new Set([...prev, idx]))
  }

  const proceed = () => {
    setState(s => pushTrace({ ...s, lastDistill: result }, 'journey', 'insight_distill_proceed', {
      case_id: caseId,
      saved_count: savedShifts.size,
      has_result: !!result,
    }))
    goTo('growth_path')
  }

  if (!bookCase) {
    return (
      <>
        <Header chapter="精华提炼" title="没找到这本书" />
        <div className="card mt-16"><div className="item-body">可能链接过期了。</div></div>
        <div style={{ marginTop: 16 }}><button className="btn btn-primary btn-full" onClick={() => goTo('library_wall')}>回书墙 →</button></div>
      </>
    )
  }

  return (
    <>
      <Header
        chapter="合上这本书之前"
        title="这本书教会了你什么"
        subtitle="馆员把 TA 的旅程，提炼成了你能带走的东西。"
        icon="compass"
      />

      <div className="card-accent card mt-16">
        <div className="section-label">你正在消化的这本书</div>
        <div className="item-title" style={{ fontSize: 16 }}>{bookCase.title}</div>
        <div className="item-body" style={{ color: 'var(--ink-soft)', marginTop: 4 }}>
          {bookCase.who} · 选了"{bookCase.one_line_choice}"
        </div>
      </div>

      {loading && (
        <div className="card-accent card mt-16">
          <div className="item-body" style={{ color: 'var(--accent-blue, #0071e3)', fontSize: 15, lineHeight: 1.7 }}>
            馆员正在<strong>提炼这本路书的精华</strong>……<br/>
            <span className="text-xs text-faint" style={{ marginTop: 8, display: 'block' }}>
              把 TA 几年的人生，提炼成你真正能带走的东西——这不是技能清单，是认知层面的精华。
            </span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="card-soft mt-16">
          <div className="item-body" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            馆员这次没能完成提炼（网络或服务波动）。<br/>
            不过没关系——你刚才看到的时间轴本身，已经是这本书最精华的部分。<br/>
            如果有哪一句"那时候我以为…后来发现…"打到了你，你可以直接收藏它。
          </div>
        </div>
      )}

      {result && !loading && (
        <>
          {/* 认知翻转 */}
          {result.mind_shifts && result.mind_shifts.length > 0 && (
            <>
              <div className="section-label mt-16">TA 想通的几件事</div>
              <div className="card-soft" style={{ marginBottom: 8 }}>
                <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  这是这个过来人几年里最重要的认知翻转。如果对你有用，点星标收藏。
                </div>
              </div>
              {result.mind_shifts.map((shift, i) => {
                const saved = savedShifts.has(i)
                return (
                  <div
                    key={i}
                    className={`card ${saved ? 'card-accent' : ''}`}
                    style={{ marginBottom: 12, cursor: 'pointer' }}
                    onClick={() => !saved && saveShift(i, shift.before, shift.after)}
                  >
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ flexShrink: 0, display: 'inline-flex', marginTop: 2 }}>
                        <Icon
                          name="star"
                          size={18}
                          color={saved ? 'var(--accent, #0071e3)' : 'var(--ink-faint, #9a9aa0)'}
                        />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 8 }}>
                          <span className="text-xs text-faint">原来以为</span>
                          <div className="item-body" style={{ color: 'var(--ink-soft)', fontSize: 14, textDecoration: 'line-through', opacity: 0.7 }}>
                            {shift.before}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs" style={{ color: 'var(--accent-blue, #0071e3)' }}>后来明白</span>
                          <div className="item-body" style={{ color: 'var(--ink)', fontSize: 15, fontWeight: 500, lineHeight: 1.6 }}>
                            {shift.after}
                          </div>
                        </div>
                        <div className="text-xs text-faint" style={{ marginTop: 6 }}>
                          {saved ? '已收藏到我的决策卡' : '点星标收藏，带到下一步'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {/* 决策原则 */}
          {result.decision_principles && result.decision_principles.length > 0 && (
            <>
              <div className="section-label mt-16">TA 的经历告诉你的几条原则</div>
              {result.decision_principles.map((p, i) => (
                <div key={i} className="card-soft" style={{ marginBottom: 8, paddingLeft: 16, borderLeft: '3px solid var(--accent-blue, #0071e3)' }}>
                  <div className="item-body" style={{ color: 'var(--ink)', fontSize: 15, lineHeight: 1.7, paddingTop: 4, paddingBottom: 4 }}>
                    {p}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* 对你的处境 */}
          {result.for_your_situation && (
            <>
              <div className="section-label mt-16">这对你的处境意味着什么</div>
              <div className="card-accent card">
                <div className="item-body" style={{ color: 'var(--ink)', fontSize: 15, lineHeight: 1.8 }}>
                  {result.for_your_situation}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* 底部 CTA */}
      <div className="card-accent card mt-16">
        <div className="item-title" style={{ fontSize: 16 }}>
          {savedShifts.size > 0
            ? `你带走了 ${savedShifts.size} 张认知卡。`
            : '这本书看完了。'}
        </div>
        <div className="item-body" style={{ color: 'var(--ink)', marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>
          接下来馆员会把"这本书的道理"放下，专门帮你把<b>你自己这条路</b>理清楚：这周做什么、这个月做成什么、该补什么能力。
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary btn-full" onClick={proceed}>
          让馆员帮我梳理下一步 →
        </button>
      </div>

      <div style={{ marginTop: 12 }}>
        <button className="btn btn-ghost btn-full" onClick={() => goTo('library_wall')}>
          ← 回书墙继续翻
        </button>
      </div>
    </>
  )
}
