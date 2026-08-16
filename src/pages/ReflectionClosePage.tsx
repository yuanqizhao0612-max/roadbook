import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import { getDecisionCards, addReflection } from '../store/decisionCards'
import { pushTrace } from '../agents/base'

export default function ReflectionClosePage({ state, setState, goTo }: PageCtx) {
  const [thought, setThought] = useState('')
  const [saved, setSaved] = useState(false)

  const originalProblem = state.evidence?.original_problem_reframe || ''
  const cards = getDecisionCards()
  // 只展示最近几条（最近一次阅读的卡片）
  const recentCards = cards.slice(-5).reverse()

  const saveThought = () => {
    if (!thought.trim()) return
    addReflection({
      original_problem: originalProblem,
      current_thought: thought.trim(),
      source_case_ids: recentCards.map(c => c.source_case_id),
    })
    setState(s => pushTrace(s, 'journey', 'reflection_saved', { thought_length: thought.length }))
    setSaved(true)
  }

  return (
    <>
      <Header
        chapter="合上这本书"
        title="回到你最初的问题"
        subtitle="看完别人的路，现在你怎么看自己的？"
        icon="compass"
      />

      {/* 回望起点：用户最初的困惑 */}
      {originalProblem && (
        <div className="card-soft mt-16">
          <div className="section-label">你最初写下的问题</div>
          <div className="item-body" style={{ color: 'var(--ink)', marginTop: 6, fontSize: 16, lineHeight: 1.6 }}>
            {originalProblem}
          </div>
        </div>
      )}

      {/* 沉淀：你从这些书里带走的 */}
      {recentCards.length > 0 ? (
        <>
          <div className="section-label mt-16">你从这些书里带走的</div>
          <div className="card-soft" style={{ marginBottom: 8 }}>
            <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              这些是刚才那些过来人教会你的认知反转——它们会成为你做决定时的参考。
            </div>
          </div>
          {recentCards.map(card => (
            <div key={card.card_id} className="card card-accent" style={{ marginBottom: 12 }}>
              <div className="item-body" style={{ color: 'var(--ink)', fontSize: 15, lineHeight: 1.6 }}>
                {card.insight}
              </div>
              <div className="text-xs text-faint" style={{ marginTop: 8 }}>
                来自《{card.source_case_title}》
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="card-soft mt-16">
          <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            你可能没有收藏任何一张决策卡——没关系。<br/>
            有时候，光是看到"还有人也在这个问题上站过"，就已经是一种收获。
          </div>
        </div>
      )}

      {/* 写下你现在的想法 */}
      <div className="section-label mt-16">写下你现在的想法</div>
      <div className="card">
        {!saved ? (
          <>
            <textarea
              className="form-textarea"
              placeholder="看完这些人的故事，你现在怎么看这个问题？（可选）"
              value={thought}
              onChange={e => setThought(e.target.value)}
              rows={3}
            />
            {thought.trim() && (
              <button className="btn btn-secondary btn-sm mt-8" onClick={saveThought}>
                记下这个想法 →
              </button>
            )}
          </>
        ) : (
          <div className="item-body" style={{ color: 'var(--accent-blue, #0071e3)', fontSize: 15 }}>
            ✓ 已记下。以后回头看，你会发现自己已经不在原来的地方了。
          </div>
        )}
      </div>

      {/* 双 CTA */}
      <div className="card-accent card mt-16">
        <div className="item-title" style={{ fontSize: 17 }}>这本书看完了，但你自己的路才刚开始</div>
        <div className="item-body" style={{ color: 'var(--ink)', marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>
          带着你从这些书里带走的认知，馆员可以帮你梳理<strong>下一步具体该怎么走</strong>——不是鸡汤，是能动手的行动。
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary btn-full" onClick={() => {
          setState(s => pushTrace(s, 'journey', 'close_to_growth_path', {}))
          goTo('growth_path')
        }}>
          让馆员帮我梳理下一步 →
        </button>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-full" onClick={() => {
          setState(s => pushTrace(s, 'journey', 'close_to_write', {}))
          goTo('write_entry_a')
        }}>
          写一页给后来人
        </button>
        <button className="btn btn-ghost btn-full" onClick={() => {
          setState(s => pushTrace(s, 'journey', 'close_to_library', {}))
          goTo('library_wall')
        }}>
          回书墙
        </button>
      </div>
    </>
  )
}
