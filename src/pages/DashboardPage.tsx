import type { PageCtx } from './router'
import Header from '../components/Header'
import Icon from '../components/Icon'
import { growthSnapshot } from '../agents/journeyAgent'
import { pushTrace } from '../agents/base'

export default function DashboardPage({ state, setState, goTo }: PageCtx) {
  const snap = growthSnapshot(state)
  const g = state.growth
  const p0 = g.skills.find(s => s.priority === 'P0')

  // V0.9.2：完成态判断 —— P0 技能学完 或 现实任务有已完成复盘，视为「这一程走完了」
  const p0Done = p0 ? p0.mastery.status === 'completed' || p0.mastery.progress >= 100 : false
  const taskDone = snap.tasks_done > 0
  const journeyComplete = p0Done || taskDone

  const nextJourney = () => {
    setState(s => pushTrace(s, 'journey', 'dashboard_new_journey', {}))
    goTo('current_problem')
  }

  return (
    <>
      <Header chapter="我的下一程" title="你的下一步" icon="home" />

      {journeyComplete && (
        <div className="card-accent card mt-16" style={{ borderLeft: '3px solid var(--green, #07c160)' }}>
          <div className="text-green text-sm font-bold" style={{ marginBottom: 6 }}>这一程走完了</div>
          <div className="item-body" style={{ color: 'var(--ink)', lineHeight: 1.7 }}>
            你学了方法、补了能力、也在现实里做了一件事。<br/>
            这一程不是终点——你可以带着这些认知，开启下一程。
          </div>
        </div>
      )}

      <div className="card-accent card mt-16">
        <div className="item-body" style={{ color: 'var(--ink)' }}>
          {state.context?.summaryText || '你已经有了前人的路标，也有了你自己要走的方向。下一步做什么，就在下面。'}
        </div>
      </div>

      {/* 成长数字 */}
      <div className="card">
        <div className="section-label">你的成长图谱</div>
        <div className="flex justify-between" style={{ marginTop: 8 }}>
          <Stat label="学会方法" value={snap.methods} />
          <Stat label="学习技能" value={`${snap.skills_done}/${g.skills.length}`} />
          <Stat label="完成任务" value={snap.tasks_done} />
        </div>
        <div className="flex justify-between mt-16">
          <Stat label="读过路书" value={snap.entries_read} />
          <Stat label="写下路书" value={snap.entries_written} />
          <Stat label="做过选择" value={g.choices.length} />
        </div>
      </div>

      {/* 下一步行动 */}
      {p0 && (
        <div className="card">
          <div className="section-label">你接下来最该做的</div>
          <div className="item-title mb-8">{p0.title}</div>
          <div className="mastery-bar"><div className="mastery-fill" style={{ width: `${p0.mastery.progress}%` }} /></div>
          <div className="text-xs text-soft mt-8">{p0.mastery.progress}% · {p0.mastery.evidence_count} 条证据</div>
          <button className="btn btn-primary btn-sm mt-16 w-full" onClick={() => { setState(s => ({ ...s, currentSkillId: p0.skill_id })); goTo('skill_detail') }}>
            继续学 →
          </button>
        </div>
      )}

      {/* 快捷入口 */}
      <div className="section-label mt-16">常用入口</div>
      <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <QuickCard icon="map" title="问路" desc="遇到新问题，诊断缺口" onClick={() => goTo('ask_road')} />
        <QuickCard icon="books" title="路书库" desc="看看别人怎么走过" onClick={() => goTo('library_home')} />
        <QuickCard icon="pen" title="写一页给后来的人" desc="把你的经验留下" onClick={() => goTo('write_entry_a')} />
        <QuickCard icon="compass" title="学习路线" desc="看完整学习计划" onClick={() => goTo('learning_route')} />
      </div>

      {/* 完成态：三个毕业出口（打破"学完→回封面→循环"） */}
      {journeyComplete && (
        <>
          <div className="section-label mt-16">这一程结束了，接下来</div>
          <div style={{ marginTop: 4 }}>
            <button className="btn btn-primary btn-full" onClick={nextJourney}>
              重新梳理一个新困惑，开启下一程 →
            </button>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm btn-full" onClick={() => goTo('write_entry_a')}>
              去写一页给后来人
            </button>
            <button className="btn btn-ghost btn-sm btn-full" onClick={() => goTo('library_wall')}>
              回书墙继续翻
            </button>
          </div>
        </>
      )}

      {/* 未完成态：继续当前成长的常规出口 */}
      {!journeyComplete && (
        <div style={{ marginTop: 24 }}>
          <button className="btn btn-secondary btn-full" onClick={() => goTo('learning_route')}>
            继续我的学习路线 →
          </button>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button className="btn btn-ghost btn-sm btn-full" onClick={() => goTo('cover')}>
          回到封面
        </button>
      </div>
    </>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{value}</div>
      <div className="text-xs text-faint">{label}</div>
    </div>
  )
}

function QuickCard({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) {
  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer', marginBottom: 0 }}>
      <div style={{ marginBottom: 6 }}><Icon name={icon} size={24} /></div>
      <div className="text-sm font-bold mt-8">{title}</div>
      <div className="text-xs text-soft">{desc}</div>
    </div>
  )
}

