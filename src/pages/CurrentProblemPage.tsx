import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import type { AppState } from '../data/types'
import { pushTrace } from '../agents/base'

const SAMPLE_QUESTIONS = [
  '我手里有个 Offer，不确定要不要接',
  '我想转行，但不知道该不该',
  '领导说我汇报抓不到重点',
  '不知道自己适不适合现在的方向',
]

export default function CurrentProblemPage({ state, setState, goTo }: PageCtx) {
  const [text, setText] = useState(state.evidence.original_problem_reframe || '')

  const submit = (val: string) => {
    const final = val || '我手里有个 Offer，不确定要不要接'
    setState((s): AppState => {
      let next: AppState = { ...s, evidence: { ...s.evidence, original_problem_reframe: final } }
      next = { ...next, growth: { ...next.growth, problems: [...next.growth.problems, { id: `prob_${Date.now()}`, text: final, ts: new Date().toISOString() }] } }
      next = pushTrace(next, 'context', 'current_problem_capture', { problem: final.slice(0, 40) })
      return next
    })
    goTo('not_alone')
  }

  return (
    <>
      <Header chapter="和馆员说说你的处境" title="你最近真正卡住的是哪件事？" subtitle="馆员会拿着你说的这句话，去书架上帮你找最相关的过来人。" icon="pin" />
      <div className="card mt-16">
        <textarea
          className="form-textarea"
          placeholder="比如：我拿到一个互联网市场岗 Offer，薪资还行，但不确定是不是自己想做的方向……"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
        />
      </div>
      <div className="section-label">或者选一个最常见的：</div>
      <div className="chip-group">
        {SAMPLE_QUESTIONS.map(q => (
          <button key={q} className="chip" onClick={() => setText(q)}>{q}</button>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={() => submit(text)}>看看有没有人走过这条路 →</button>
      </div>
    </>
  )
}

