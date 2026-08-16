import { useEffect, useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import type { OrdinaryCase, TimelineFollowup } from '../data/types'
import { allFixtureCases } from '../data/fixtureCases'
import { pushTrace } from '../agents/base'
import { llmEnabled } from '../services/llm'
import { matchTimelineCasesWithLLM, type RankedCase } from '../agents/retrievalAgent'

// 只取有时间轴的样本——这是时光机的核心数据池
const timelinePool: OrdinaryCase[] = allFixtureCases.filter(c => c.timeline_followups && c.timeline_followups.length > 0)

export default function TimeMachinePage({ state, setState, goTo }: PageCtx) {
  const [matched, setMatched] = useState<RankedCase[]>([])
  const [matching, setMatching] = useState(true)

  useEffect(() => {
    let alive = true
    let guard: ReturnType<typeof setTimeout> | undefined

    // 先用规则引擎立即给一个结果（matchTimelineCasesWithLLM 内部也有兜底，但先展示）
    guard = setTimeout(() => { if (alive) setMatching(false) }, 12000)

    matchTimelineCasesWithLLM(state, 4)
      .then(res => { if (alive) { setMatched(res); setMatching(false) } })
      .catch(() => { if (alive) setMatching(false) })
      .finally(() => { if (guard) clearTimeout(guard) })

    return () => { alive = false; if (guard) clearTimeout(guard) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const bestScore = matched.length > 0 ? Math.max(...matched.map(m => m.score)) : 0
  const hasRelevant = bestScore >= 4
  const top = matched.filter(m => !m.weak).slice(0, 3)
  const display = top.length > 0 ? top : matched.slice(0, 3)

  const enterTimeline = (caseId: string) => {
    setState(s => ({ ...s, selectedEntry: caseId }))
    setState(s => pushTrace(s, 'journey', 'time_machine_enter_timeline', { case_id: caseId, score: bestScore }))
    goTo('case_learning_route')
  }

  return (
    <>
      <Header
        chapter="时光机"
        title="和你站在同一十字路口的人"
        subtitle="他们做了选择后，后来变成了什么样——这就是你眼前这条路的走向。"
        icon="compass"
      />

      {matching && (
        <div className="card-accent card mt-16">
          <div className="item-body" style={{ color: 'var(--accent-blue, #0071e3)', fontSize: 15 }}>
            馆员正在书架间穿梭，找那些<strong>起点和你一样、但已经走了几年</strong>的人……
          </div>
        </div>
      )}

      {/* 用户当前困惑回顾 */}
      {state.evidence?.original_problem_reframe && (
        <div className="card-soft mt-16">
          <div className="section-label">你当下卡在</div>
          <div className="item-body" style={{ color: 'var(--ink)', marginTop: 4 }}>
            {state.evidence.original_problem_reframe}
          </div>
        </div>
      )}

      {/* 时间轴展示 */}
      {!matching && display.length > 0 && (
        <>
          <div className="card-accent card mt-16">
            <div className="item-body" style={{ color: 'var(--ink)', fontSize: 15 }}>
              {hasRelevant ? (
                <>馆员找到了几个<strong>和你站在同一个十字路口的人</strong>——他们当年做的选择，后来变成了下面的样子。</>
              ) : (
                <>馆员找到了几个起点和你有点像的人——虽然不完全一样，但他们的后来，可能对你有参考。</>
              )}
            </div>
          </div>

          {/* 每个匹配样本的时间轴预览 */}
          {display.map(({ case: c, reason }) => {
            const timeline = c.timeline_followups || []
            return (
              <div key={c.id} className="card mt-16 timeline-match-card">
                <div className="timeline-match-head">
                  <div className="item-title" style={{ fontSize: 16 }}>{c.title}</div>
                  <div className="item-meta">{c.who}</div>
                </div>
                {reason && <div className="text-sm" style={{ color: 'var(--accent-blue, #0071e3)', marginTop: 4 }}>{reason}</div>}

                <div className="text-sm" style={{ color: 'var(--ink-soft)', marginTop: 8 }}>
                  <strong>TA 当时的选择：</strong>{c.one_line_choice}
                </div>

                {/* 时间轴预览（只显示核心洞察） */}
                <div className="timeline-preview-list">
                  {timeline.map((tf: TimelineFollowup, ti: number) => (
                    <div key={ti} className="timeline-preview-item">
                      <span className="timeline-preview-year">{tf.years_after}年后</span>
                      <span className="timeline-preview-insight">{tf.what_i_realized}</span>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary btn-sm btn-full mt-16" onClick={() => enterTimeline(c.id)}>
                  看 TA 完整的人生路径 →
                </button>
              </div>
            )
          })}

          {/* 深度入口 */}
          <div className="card-soft mt-16">
            <div className="text-sm" style={{ color: 'var(--ink)', lineHeight: 1.7 }}>
              <strong>这是路书最有含金量的部分。</strong><br/>
              不是看他们选了什么，是看他们选完之后，路是怎么一步步展开的。<br/>
              这就是你眼前这条路，几年后可能的走向。
            </div>
          </div>
        </>
      )}

      {/* 空态 */}
      {!matching && display.length === 0 && (
        <>
          <div className="card-soft mt-16">
            <div className="text-sm" style={{ color: 'var(--ink)', lineHeight: 1.7 }}>
              馆员翻遍了书架，暂时还没找到<strong>起点和你完全一样、又已经走了几年</strong>的人。<br/>
              这说明——你可能就是走在最前面那个人。<br/>
              你的故事，后来的人会需要。
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-primary btn-full" onClick={() => goTo('write_entry_a')}>
              我来写下我的第一页 →
            </button>
          </div>
        </>
      )}

      {/* 想更精准 */}
      {!matching && (
        <>
          <div className="card-soft mt-16" style={{ cursor: 'pointer' }} onClick={() => goTo('current_problem')}>
            <div className="text-sm" style={{ color: 'var(--ink)', lineHeight: 1.7 }}>
              <strong>觉得匹配得不准？</strong><br/>
              告诉馆员你当下真正卡在哪件事，它会更精准地找同一十字路口的人。
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="text-accent text-sm font-bold">更精准地描述我的困境 →</span>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-ghost btn-full" onClick={() => goTo('case_learning_route')}>
              ← 返回
            </button>
          </div>
        </>
      )}
    </>
  )
}
