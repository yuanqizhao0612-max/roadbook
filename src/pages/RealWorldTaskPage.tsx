import type { PageCtx } from './router'
import Header from '../components/Header'
import { setTaskStatus } from '../agents/journeyAgent'
import { pushTrace } from '../agents/base'

export default function RealWorldTaskPage({ state, setState, goTo }: PageCtx) {
  const task = state.growth.real_world_tasks.find(t => t.task_id === state.currentTaskId)
  if (!task) return <div className="card">任务未找到</div>

  const accept = () => {
    setState(s => setTaskStatus(s, task.task_id, 'done_pending_review'))
    setState(s => pushTrace(s, 'journey', 'task_accept', { task_id: task.task_id }))
  }

  const startCheckin = () => {
    goTo('checkin')
  }

  return (
    <>
      <Header chapter="现实任务" title={task.title} icon="check" />

      <div className="card-accent card mt-16">
        <div className="section-label">为什么做这件事</div>
        <div className="item-body" style={{ color: 'var(--ink)' }}>{task.why}</div>
      </div>

      <div className="card">
        <div className="section-label">具体怎么做</div>
        <div className="item-body mb-16">{task.instruction}</div>
        <div className="section-label">需要收集的证据</div>
        {task.expected_evidence.map((e, i) => (
          <div key={i} className="item-body">• {e}</div>
        ))}
      </div>

      <div className="card-soft">
        <div className="text-sm text-soft">
          <strong>时间窗口：</strong>{task.due_window === '48_hours' ? '48 小时内' : task.due_window}<br/>
          <strong>当前状态：</strong>{task.status === 'todo' ? '待领取' : task.status === 'done_pending_review' ? '待复盘' : '已完成'}
        </div>
      </div>

      {task.status === 'todo' && (
        <div style={{ marginTop: 24 }}>
          <button className="btn btn-primary btn-full" onClick={accept}>领任务，准备去做 →</button>
        </div>
      )}
      {task.status === 'done_pending_review' && (
        <div style={{ marginTop: 24 }}>
          <button className="btn btn-primary btn-full" onClick={startCheckin}>做完了，回来复盘 →</button>
        </div>
      )}
      {task.status === 'reviewed' && (
        <>
          <div className="card mt-16">
            <div className="section-label">你记录的</div>
            <div className="item-body mb-8"><strong>做了什么：</strong>{task.user_record.what_i_did || '—'}</div>
            <div className="item-body mb-8"><strong>学到了什么：</strong>{task.user_record.what_i_learned || '—'}</div>
            <div className="item-body mb-8"><strong>什么变了：</strong>{task.user_record.what_changed || '—'}</div>
          </div>
          <div className="card-quote">
            <div className="section-label" style={{ color: 'var(--accent)' }}>路书的复盘</div>
            {task.ai_reflection}
          </div>
          <div style={{ marginTop: 24 }}>
            <button className="btn btn-secondary btn-full" onClick={() => goTo('dashboard')}>回到我的下一程 →</button>
          </div>
        </>
      )}
    </>
  )
}

