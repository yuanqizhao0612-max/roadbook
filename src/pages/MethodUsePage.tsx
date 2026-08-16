import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import { formulaCertaintyVsExploration, transferScenarioOffer } from '../data/fixtureTools'
import { counterExample } from '../agents/retrievalAgent'
import { pushTrace } from '../agents/base'
import Expand from '../components/Expand'

export default function MethodUsePage({ state, setState, goTo }: PageCtx) {
  const f = formulaCertaintyVsExploration
  const sc = transferScenarioOffer
  const [choice, setChoice] = useState('')
  const [methods, setMethods] = useState<string[]>([])

  const toggleMethod = (key: string) => {
    setMethods(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key])
  }

  const pass = choice === 'C' || methods.length >= 2

  const complete = () => {
    setState(s => {
      let next = { ...s, formulaUnlocked: true, transferDone: true,
        evidence: { ...s.evidence, formula_understood: true, transfer_choice: choice, transfer_method_used: methods, transfer_pass: pass },
        growth: { ...s.growth, methods_learned: [...new Set([...s.growth.methods_learned, f.formula_id])] }
      }
      next = pushTrace(next, 'journey', 'formula_unlock', { formula_id: f.formula_id, transfer_choice: choice })
      return next
    })
    goTo('decision_ruler')
  }

  return (
    <>
      <Header chapter="这件事，换成你可以怎么用" title={f.title} icon="toolkit" />

      <div className="card-accent card mt-16">
        <div className="section-label">先记住一句</div>
        <div className="item-body" style={{ fontSize: 16, color: 'var(--ink)' }}>{f.keep_one_sentence}</div>
      </div>

      <div className="card">
        <div className="section-label">判断自己的 3 个问题</div>
        {f.self_check_questions.map((q, i) => (
          <div key={i} className="item-body mb-8">{i + 1}. {q}</div>
        ))}
      </div>

      <div className="card">
        <div className="section-label">今天就能做的一件事</div>
        <div className="item-body">{f.today_action}</div>
      </div>

      <Expand title="什么时候用 · 适用 / 不适用">
        <div className="text-green text-sm mb-8">✓ 适用</div>
        {f.applicable_when.map((x, i) => <div key={i} className="item-body">{x}</div>)}
        <div className="text-red text-sm mt-16 mb-8">✗ 不适用</div>
        {f.not_applicable_when.map((x, i) => <div key={i} className="item-body">{x}</div>)}
        <div className="card" style={{ marginTop: 12, boxShadow: 'none' }}>
          <div className="section-label">{f.conceptual_model.label}</div>
          <div className="item-body" style={{ fontFamily: 'monospace', background: 'var(--surface-2)', padding: '12px', borderRadius: '8px' }}>
            {f.conceptual_model.expression}
          </div>
        </div>
      </Expand>

      <Expand title="换一道题练练（迁移练习）">
        <div className="item-body mb-16">{sc.prompt}</div>
        <div className="form-label">你会先做什么？</div>
        <div className="chip-group mb-16">
          {sc.options.map(o => (
            <button key={o.key} className={`chip ${choice === o.key ? 'active' : ''}`} onClick={() => setChoice(o.key)}>{o.key}. {o.text}</button>
          ))}
        </div>
        <div className="form-label">你在用哪个判断方法？（可多选）</div>
        <div className="chip-group">
          {sc.method_choices.map(m => (
            <button key={m.key} className={`chip ${methods.includes(m.key) ? 'active' : ''}`} onClick={() => toggleMethod(m.key)}>{m.text}</button>
          ))}
        </div>
        {choice && (
          <div className="card-accent card" style={{ marginTop: 12 }}>
            <div className="item-body" style={{ color: 'var(--ink)' }}>{sc.verify_message}</div>
          </div>
        )}
      </Expand>

      <div className="card-quote">
        <div className="section-label" style={{ color: 'var(--red)' }}>别忘了这条</div>
        {f.counterexample}
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={complete}>解锁我的工作选择尺 →</button>
      </div>
    </>
  )
}

