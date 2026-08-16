import type { PageCtx } from './router'
import Header from '../components/Header'
import { pushTrace } from '../agents/base'

export default function LearningRoutePage({ state, setState, goTo }: PageCtx) {
  const g = state.growth
  const p0 = g.skills.find(s => s.priority === 'P0')
  const p1 = g.skills.filter(s => s.priority === 'P1')
  const p2 = g.skills.filter(s => s.priority === 'P2')
  const task = g.real_world_tasks[0]

  const enterSkill = (skillId: string) => {
    setState(s => ({ ...s, currentSkillId: skillId }))
    goTo('skill_detail')
  }

  return (
    <>
      <Header chapter="下一章 · 我接下来最该学什么" title="你的学习路线" subtitle={'不是"学完一门课"，而是"在现实里能多做什么"。'} icon="compass" />

      <div className="card-accent card mt-16">
        <div className="item-body" style={{ color: 'var(--ink)' }}>
          路书根据你现在的问题，帮你挑出了<strong>最该先学的</strong>——不是最多，而是最关键。
        </div>
      </div>

      {p0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-8">
            <span className="badge badge-accent">P0 · 最先学</span>
            <span className="text-xs text-faint">{p0.estimated_minutes} 分钟</span>
          </div>
          <div className="item-title mb-8">{p0.title}</div>
          <div className="item-body mb-16">{p0.why_for_user}</div>
          <div className="mastery-bar"><div className="mastery-fill" style={{ width: `${p0.mastery.progress}%` }} /></div>
          <div className="text-xs text-soft mt-8">学完以后：{p0.done_means}</div>
          <button className="btn btn-primary btn-full mt-16" onClick={() => enterSkill(p0.skill_id)}>开始学 →</button>
        </div>
      )}

      {p1.length > 0 && (
        <>
          <div className="section-label mt-16">下一阶段（P1）</div>
          {p1.map(s => (
            <div key={s.skill_id} className="card" onClick={() => enterSkill(s.skill_id)} style={{ cursor: 'pointer' }}>
              <div className="flex justify-between items-center">
                <div className="item-title" style={{ fontSize: 15 }}>{s.title}</div>
                <span className="text-accent">›</span>
              </div>
              <div className="item-meta">{s.estimated_minutes} 分钟 · {s.done_means}</div>
            </div>
          ))}
        </>
      )}

      {p2.length > 0 && (
        <>
          <div className="section-label mt-16">30-90 天后再看（P2）</div>
          {p2.map(s => (
            <div key={s.skill_id} className="card" onClick={() => enterSkill(s.skill_id)} style={{ cursor: 'pointer' }}>
              <div className="item-title" style={{ fontSize: 15 }}>{s.title}</div>
              <div className="item-meta">{s.done_means}</div>
            </div>
          ))}
        </>
      )}

      {task && (
        <>
          <div className="section-label mt-16">你已经有一个现实任务</div>
          <div className="card-accent card">
            <div className="item-title">{task.title}</div>
            <div className="item-body">{task.why}</div>
            <button className="btn btn-secondary btn-sm mt-8" onClick={() => { setState(s => ({ ...s, currentTaskId: task.task_id })); goTo('real_world_task') }}>看看怎么做 →</button>
          </div>
        </>
      )}

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={() => {
          setState(s => pushTrace(s, 'journey', 'enter_dashboard', {}))
          goTo('dashboard')
        }}>去我的下一程首页 →</button>
      </div>
    </>
  )
}

