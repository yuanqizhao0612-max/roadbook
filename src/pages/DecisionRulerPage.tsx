import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import type { AppState } from '../data/types'
import { tradeoffQuestions } from '../data/fixtureTools'
import { generateDecisionRuler, generateOfferAnalysis, type RulerAnswer } from '../agents/journeyAgent'
import { pushTrace } from '../agents/base'
import Expand from '../components/Expand'

export default function DecisionRulerPage({ state, setState, goTo }: PageCtx) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResult, setShowResult] = useState(false)

  const setScore = (qid: string, score: number) => setAnswers(prev => ({ ...prev, [qid]: score }))

  const allAnswered = tradeoffQuestions.every(q => answers[q.id])
  const ruler = showResult ? generateDecisionRuler(tradeoffQuestions.map(q => ({ qid: q.id, score: answers[q.id] || 4 }))) : null
  const offer = ruler ? generateOfferAnalysis(ruler) : null

  const complete = () => {
    const r = generateDecisionRuler(tradeoffQuestions.map(q => ({ qid: q.id, score: answers[q.id] || 4 })))
    setState((s): AppState => {
      let next: AppState = { ...s, ruler: r, rulerConsent: true, evidence: { ...s.evidence, scenario_post_priorities: r.factors.map(f => f.label) } }
      next = pushTrace(next, 'journey', 'ruler_generate', { top: r.factors.slice(0, 3).map(f => f.label) })
      return next
    })
    goTo('fork_sim')
  }

  if (showResult && ruler && offer) {
    return (
      <>
        <Header chapter="第 8 章 · 我的工作选择尺" title="这是你的工作选择尺" subtitle="基于你刚才的交换题，推断出来的个人偏好。" icon="ruler" />

        <div className="card-accent card mt-16">
          <div className="item-body" style={{ color: 'var(--ink)', fontSize: 14 }}>{ruler.disclaimer}</div>
        </div>

        <div className="card">
          <div className="section-label">你最看重的（按排序）</div>
          {ruler.factors.map(f => (
            <div key={f.key} className="flex justify-between items-center" style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
              <span className="text-sm">{f.rank}. {f.label}</span>
              <span className={`badge ${f.level === '高' ? 'badge-accent' : 'badge-demo'}`}>{f.level}</span>
            </div>
          ))}
        </div>

        <Expand title="这说明什么 · 你的交换与缺口">
          <div className="item-body mb-16"><strong>对你真正重要的：</strong></div>
          {offer.match_items.map((m, i) => <div key={i} className="item-body">✓ {m}</div>)}
          <div className="item-body mt-16 mb-8"><strong>你正在交换什么：</strong></div>
          {offer.trades.map((t, i) => <div key={i} className="item-body">→ {t}</div>)}
          <div className="divider" />
          <div className="item-body">{offer.worth_it}</div>
          <div className="card-soft" style={{ marginTop: 12 }}>
            <div className="text-sm text-soft">还有信息没确认：<strong>{offer.missing_info.join('、')}</strong></div>
          </div>
        </Expand>

        <div style={{ marginTop: 24 }}>
          <button className="btn btn-primary btn-full" onClick={complete}>看看如果这样选，未来会怎样 →</button>
        </div>
      </>
    )
  }

  return (
    <>
      <Header chapter="第 8 章 · 我的工作选择尺" title="几道交换题，测出你真正看重什么" subtitle="没有标准答案，选你真实的反应。不用想太多。" icon="ruler" />

      <div className="mt-16">
        {tradeoffQuestions.map((q, qi) => (
          <div key={q.id} className="card">
            <div className="item-title">{qi + 1}. {q.question}</div>
            <div className="scale-7">
              {[1, 2, 3, 4, 5, 6, 7].map(n => (
                <button key={n} className={`dot ${answers[q.id] === n ? 'active' : ''}`} onClick={() => setScore(q.id, n)}>{n}</button>
              ))}
            </div>
            <div className="scale-labels">
              <span>1 很难接受</span>
              <span>7 完全可以</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" disabled={!allAnswered} onClick={() => setShowResult(true)}>
          {allAnswered ? '生成我的工作选择尺 →' : '答完 4 道题再继续'}
        </button>
      </div>
    </>
  )
}

