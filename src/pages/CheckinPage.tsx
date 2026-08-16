import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import { runCheckin, type CheckinInput } from '../agents/journeyAgent'

export default function CheckinPage({ state, setState, goTo }: PageCtx) {
  const task = state.growth.real_world_tasks.find(t => t.task_id === state.currentTaskId)
  const [input, setInput] = useState<CheckinInput>({
    what_i_did: '', what_i_learned: '', what_changed: '', what_i_still_dont_know: ''
  })

  if (!task) return <div className="card">任务未找到</div>

  const submit = () => {
    setState(s => runCheckin(s, task.task_id, input))
    goTo('real_world_task')
  }

  const field = (key: keyof CheckinInput, label: string, placeholder: string) => (
    <div className="form-group">
      <div className="form-label">{label}</div>
      <textarea className="form-textarea" placeholder={placeholder} value={input[key]} onChange={e => setInput({ ...input, [key]: e.target.value })} rows={3} />
    </div>
  )

  return (
    <>
      <Header chapter="回来复盘 · Check-in" title="你今天补上的不是学习时长，是一条现实证据" icon="refresh" />

      <div className="card-accent card mt-16">
        <div className="item-title">{task.title}</div>
        <div className="item-body">如实记录——不需要写得多漂亮，写出真实情况最有价值。</div>
      </div>

      {field('what_i_did', '你实际做了什么？', '比如：我问了 HR 前 90 天会做什么……')}
      {field('what_i_learned', '你发现/学到了什么？', '比如：原来前 3 个月主要做数据分析，不是我以为的策划')}
      {field('what_changed', '你的哪个判断变了？', '比如：我之前以为这份工作偏执行，现在发现其实是成长型岗位')}
      {field('what_i_still_dont_know', '你现在还不确定什么？', '比如：还不确定直属领导多久给一次反馈')}

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={submit} disabled={!input.what_i_did && !input.what_i_learned}>
          提交复盘 →
        </button>
      </div>
    </>
  )
}

