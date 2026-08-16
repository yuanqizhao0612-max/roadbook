import type { PageCtx } from './router'
import Header from '../components/Header'
import { allSkills } from '../data/fixtureSkills'
import { applyAskToPlan } from '../agents/journeyAgent'

export default function AskDiagnosisPage({ state, setState, goTo }: PageCtx) {
  const ask = state.lastAsk
  if (!ask) return <div className="card">请先提问</div>

  const recommendedSkills = allSkills.filter(s => ask.recommended_skill_ids.includes(s.skill_id))
  const prioritySkill = recommendedSkills.find(s => s.skill_id === ask.priority_skill_id) || recommendedSkills[0]

  const accept = () => {
    setState(s => applyAskToPlan(s, ask.recommended_skill_ids, ask.priority_skill_id, ask.immediate_action))
    setState(s => ({ ...s, currentSkillId: ask.priority_skill_id }))
    goTo('skill_detail')
  }

  return (
    <>
      <Header chapter="问路 · 先看看这道题" title="你遇到的不是一道题，而是这几道缺口" icon="search" />

      <div className="card-quote mt-16">
        <div className="section-label" style={{ color: 'var(--accent)' }}>你问的</div>
        「{ask.raw_question}」
      </div>

      <div className="card">
        <div className="section-label">这道题背后其实是</div>
        <div className="item-body mb-16">{ask.deeper_theme}</div>
        <div className="section-label">你目前缺的</div>
        {ask.plain_gap_lines.map((g, i) => (
          <div key={i} className="item-body" style={{ marginBottom: 6 }}>• {g}</div>
        ))}
      </div>

      <div className="card">
        <div className="section-label">能力缺口</div>
        <div className="chip-group">
          {ask.capability_gaps.map(c => <span key={c} className="badge badge-accent">{c}</span>)}
        </div>
      </div>

      {recommendedSkills.length > 0 && (
        <>
          <div className="section-label mt-16">路书推荐你先学（最多 3 个）</div>
          {recommendedSkills.map(s => (
            <div key={s.skill_id} className={`card ${s.skill_id === ask.priority_skill_id ? 'card-accent' : ''}`}>
              <div className="flex justify-between items-center mb-8">
                <span className="item-title" style={{ fontSize: 15 }}>{s.title}</span>
                {s.skill_id === ask.priority_skill_id && <span className="badge badge-accent">最优先</span>}
              </div>
              <div className="item-body">{s.why_for_user}</div>
            </div>
          ))}
        </>
      )}

      <div className="card-accent card">
        <div className="section-label">你现在就能做的一件事</div>
        <div className="item-body" style={{ color: 'var(--ink)', fontWeight: 600 }}>{ask.immediate_action}</div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={accept}>把推荐加入学习路线 →</button>
      </div>
      <button className="btn btn-secondary btn-full mt-8" onClick={() => goTo('dashboard')}>回首页</button>
    </>
  )
}

