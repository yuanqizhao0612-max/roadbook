import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import type { SkillStepKey } from '../data/types'
import { advanceSkillStep } from '../agents/journeyAgent'
import { pushTrace } from '../agents/base'

const STEPS: { key: SkillStepKey; label: string }[] = [
  { key: 'why', label: '我为什么需要学它' },
  { key: 'experience_case', label: '先看一页前人的路书' },
  { key: 'method', label: '学一个方法' },
  { key: 'boundary', label: '知道方法的边界' },
  { key: 'transfer_practice', label: '换一道题练习' },
  { key: 'apply_to_self', label: '用在我的真实问题' },
  { key: 'real_world_task', label: '领取现实任务' },
  { key: 'reflection', label: '回来复盘' },
]

export default function SkillDetailPage({ state, setState, goTo }: PageCtx) {
  const skill = state.growth.skills.find(s => s.skill_id === state.currentSkillId)
  const [activeStep, setActiveStep] = useState<SkillStepKey | null>(null)
  if (!skill) return <div className="card">Skill 未找到</div>

  const stepIdx = STEPS.findIndex(s => s.key === activeStep)
  const stepOrderIdx = STEPS.findIndex(s => s.key === activeStep)

  const completeStep = (key: SkillStepKey) => {
    setState(s => advanceSkillStep(s, skill.skill_id, key))
    setState(s => pushTrace(s, 'journey', 'skill_step_complete', { skill: skill.skill_id, step: key }))
    if (key === 'real_world_task') {
      const t = state.growth.real_world_tasks.find(t => t.skill_id === skill.skill_id)
      if (t) {
        setState(s => ({ ...s, currentTaskId: t.task_id }))
        goTo('real_world_task')
      }
    } else if (key === 'reflection') {
      goTo('dashboard')
    } else {
      const nextIdx = stepOrderIdx + 1
      if (nextIdx < STEPS.length) setActiveStep(STEPS[nextIdx].key)
    }
  }

  const sd = activeStep ? skill.steps_data[activeStep] : null

  return (
    <>
      <Header chapter={`Learning Skill · ${skill.priority}`} title={skill.title} icon="target" />

      <div className="card-accent card mt-16">
        <div className="section-label">学完以后</div>
        <div className="item-body" style={{ color: 'var(--ink)' }}>{skill.done_means}</div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-8">
          <span className="text-sm font-bold">掌握度</span>
          <span className="text-accent font-bold">{skill.mastery.progress}%</span>
        </div>
        <div className="mastery-bar"><div className="mastery-fill" style={{ width: `${skill.mastery.progress}%` }} /></div>
        <div className="text-xs text-faint mt-8">{skill.mastery.evidence_count} 条现实证据</div>
      </div>

      <div className="section-label mt-16">8 个学习步骤</div>
      {STEPS.map((s, i) => {
        const stepProgress = Math.round(((i + 1) / STEPS.length) * 100)
        const done = skill.mastery.progress >= stepProgress
        const isActive = activeStep === s.key
        return (
          <div key={s.key} className={`card ${isActive ? 'card-accent' : ''}`} onClick={() => setActiveStep(s.key)} style={{ cursor: 'pointer' }}>
            <div className="flex items-center gap-12">
              <span className={`badge ${done ? 'badge-user' : 'badge-demo'}`} style={{ minWidth: 24 }}>{done ? '✓' : i + 1}</span>
              <div className="flex-1">
                <div className="text-sm font-bold">{s.label}</div>
              </div>
              <span className="text-faint">{isActive ? '▴' : '›'}</span>
            </div>
            {isActive && sd && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                <div className="item-body mb-8">{sd.body || sd.title}</div>
                {sd.bullets && sd.bullets.map((b, bi) => (
                  <div key={bi} className="item-body" style={{ paddingLeft: 8 }}>• {b}</div>
                ))}
                <button className="btn btn-primary btn-sm mt-16" onClick={(e) => { e.stopPropagation(); completeStep(s.key) }}>
                  {s.key === 'reflection' ? '完成复盘 ✓' : '这一步学完了 →'}
                </button>
              </div>
            )}
          </div>
        )
      })}

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-secondary btn-full" onClick={() => goTo('learning_route')}>← 返回学习路线</button>
      </div>
    </>
  )
}

