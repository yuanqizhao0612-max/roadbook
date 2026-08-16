import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import type { AskRoadResult, AppState } from '../data/types'
import { diagnoseQuestion } from '../agents/contextAgent'
import { askRoadFixtureReport } from '../data/fixtureSkills'
import { uid, now } from '../store/store'
import { pushTrace } from '../agents/base'

const SAMPLES = [
  '领导说我汇报总抓不到重点',
  '我想转行做产品，不知道该不该',
  '不知道自己适合做什么',
  '这份工作值不值得继续做下去',
]

export default function AskRoadPage({ state, setState, goTo }: PageCtx) {
  const [q, setQ] = useState('')

  const ask = (question?: string) => {
    const raw = question || q || SAMPLES[0]
    const diag = diagnoseQuestion(raw)
    // 用 fixture 作为基础 + 当前的 question 动态拼接
    const result: AskRoadResult = {
      ...askRoadFixtureReport,
      ask_id: uid('ask'),
      raw_question: raw,
      surface_problem: diag.surface_problem,
      deeper_theme: diag.deeper_theme,
      gap_types: diag.gap_types,
      plain_gap_lines: diag.plain_gap_lines,
      capability_gaps: diag.capability_gaps,
      evidence_gaps: diag.evidence_gaps,
      ts: now()
    }
    setState((s): AppState => {
      let next: AppState = { ...s, lastAsk: result, evidence: { ...s.evidence, ask_road_used: true, ask_question: raw, ask_gap_types: diag.gap_types } }
      next = pushTrace(next, 'context', 'ask_diagnose', { raw: raw.slice(0, 40), gaps: diag.gap_types })
      return next
    })
    goTo('ask_diagnosis')
  }

  return (
    <>
      <Header chapter="问路" title="你现在卡在哪道题上？" subtitle="路书会帮你诊断：你不是不会，而是缺了什么。" icon="map" />

      <div className="card mt-16">
        <textarea className="form-textarea" placeholder="用一句话说说你最近遇到的问题……" value={q} onChange={e => setQ(e.target.value)} rows={3} />
      </div>

      <div className="section-label">或者选一个常见的：</div>
      <div className="chip-group">
        {SAMPLES.map(s => (
          <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={() => ask()}>帮我诊断 →</button>
      </div>
    </>
  )
}

