import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import Icon from '../components/Icon'
import { offerThreeQuestionsForAudience } from '../data/fixtureTools'
import { pushTrace } from '../agents/base'

export default function Offer3QPage({ state, setState, goTo }: PageCtx) {
  const [saved, setSaved] = useState(state.offerChecklistSaved)
  const aud = state.profile?.audience || 'new_grad'
  const o = offerThreeQuestionsForAudience(aud)

  const complete = () => {
    setSaved(true)
    setState(s => {
      let next = { ...s, offerChecklistSaved: true, evidence: { ...s.evidence, checkin_created: true } }
      next = pushTrace(next, 'journey', 'offer_checklist_save', { questions: 3 })
      return next
    })
    goTo('my_roadbook')
  }

  const copyText = () => {
    navigator.clipboard?.writeText(o.copyable_text).catch(() => {})
  }

  return (
    <>
      <Header chapter="第 10 章 · 接 Offer 前，先确认 3 件事" title="这 3 个问题，比薪资更重要" subtitle="拿着这份清单去问 HR 或直属经理。" icon="question" />

      <div className="card-accent card mt-16">
        <div className="item-body" style={{ color: 'var(--ink)' }}>
          很多人入职后才发现「原来这份工作不是我想要的」——但其实只要提前问清这 3 件事，就能避免一半的后悔。
        </div>
      </div>

      {o.items.map(q => (
        <div key={q.no} className="card">
          <div className="flex gap-8 items-center mb-8">
            <span className="badge badge-accent" style={{ fontSize: 14 }}>{q.no}</span>
            <span className="item-title">{q.title}</span>
          </div>
          <div className="item-body mb-8">{q.why}</div>
          <div className="card-quote" style={{ margin: 0 }}>
            <div className="text-xs text-accent">建议这样问：</div>
            {q.suggested_question}
          </div>
        </div>
      ))}

      <div className="card">
        <div className="section-label">可以直接复制这段话</div>
        <div className="card-soft" style={{ fontFamily: 'monospace' }}>{o.copyable_text}</div>
        <button className="btn btn-sm btn-ghost w-full mt-8" onClick={copyText}><Icon name="copy" size={16} /> 复制</button>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={complete}>
          {saved ? '继续 →' : '记下了，生成我的第一本路书 →'}
        </button>
      </div>
    </>
  )
}

