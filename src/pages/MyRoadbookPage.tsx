import type { PageCtx } from './router'
import Header from '../components/Header'
import { generateLearningPlan } from '../agents/journeyAgent'
import { buildLocalSevenDayPlan } from '../agents/localSevenDay'
import { pushTrace } from '../agents/base'
import { allFixtureCases } from '../data/fixtureCases'
import type { OrdinaryCase, SevenDayStep } from '../data/types'

export default function MyRoadbookPage({ state, setState, goTo }: PageCtx) {
  const ctx = state.context
  const profile = state.profile

  // 用户主线读过的书（真实素材，本地合成 7 天计划的原料）
  const readIds = state.growth.read_roadbook_entries || []
  const readBooks: OrdinaryCase[] = readIds
    .map(id => allFixtureCases.find(ac => ac.id === id))
    .filter((c): c is OrdinaryCase => !!c)
    .slice(-3)

  // V0.9.5 三级取值：LLM 个性化 → 本地个性化合成 → 引导卡片（绝不静默回退固定 Offer 模板）
  const llmPlan = state.lastGrowthPath?.seven_day_plan && state.lastGrowthPath.seven_day_plan.length > 0
    ? state.lastGrowthPath.seven_day_plan
    : null
  const localPlan: SevenDayStep[] | null = llmPlan
    ? null
    : buildLocalSevenDayPlan({
        profile,
        readBooks,
        problem: state.evidence?.original_problem_reframe || '',
      })

  const sevenDayPlan: SevenDayStep[] | null = llmPlan || localPlan

  const generatePlan = () => {
    setState(s => generateLearningPlan(s))
    goTo('learning_route')
  }

  return (
    <>
      <Header chapter="第 11 章 · 我的第一本路书" title="你已经写完了第一本" subtitle="这是基于你刚才走过的一切，路书帮你生成的。" icon="route" />

      <div className="card-accent card mt-16">
        <div className="item-title" style={{ fontSize: 18 }}>致现在的你</div>
        <div className="item-body" style={{ color: 'var(--ink)', lineHeight: 1.7 }}>
          你刚才做的事，比刷 100 篇攻略更有价值：<br/>
          你看了别人的真实选择，学了一个能用一辈子的判断方法，<br/>
          还测出了自己真正看重的，而不是嘴上说的。
        </div>
      </div>

      <div className="card">
        <div className="section-label">你的个人摘要</div>
        <div className="item-body">
          <strong>阶段：</strong>{profile?.stage}<br/>
          <strong>最关心：</strong>{profile?.concerns?.join('、')}<br/>
          <strong>最看重：</strong>{state.ruler ? state.ruler.factors.slice(0, 3).map(f => f.label).join(' > ') : profile?.priorities?.join('、')}<br/>
          <strong>现在的题：</strong>{state.evidence.original_problem_reframe || profile?.concerns?.[0] || '我接下来该往哪走'}
        </div>
      </div>

      <div className="card-quote">
        <div className="section-label" style={{ color: 'var(--accent)' }}>路书给你的提醒</div>
        {ctx?.summaryText || '你已经开始了——这就比大多数人强。'}
      </div>

      <div className="card">
        <div className="section-label">接下来 7 天的行动</div>
        <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 4 }}>
          馆员根据你的处境和刚才读的那本书，帮你排好了这一周。
        </div>
        {sevenDayPlan ? (
          sevenDayPlan.map((a, i) => (
            <div key={i} className="flex gap-12 items-center" style={{ padding: '10px 0', borderBottom: i < sevenDayPlan.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <span className="badge badge-accent" style={{ minWidth: 60 }}>{a.day}</span>
              <div>
                <div className="text-sm font-bold">{a.action}</div>
                <div className="text-xs text-soft">{a.note}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="card-soft" style={{ marginTop: 8 }}>
            <div className="item-body" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              馆员还没为你排这一周——需要回到路径指引页，结合你读过的书和处境来生成。
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-secondary btn-full" onClick={() => goTo('growth_path')}>
                去拿我的个性化一周 →
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card-soft">
        <div className="text-sm text-soft">
          这不是结束。<br/>
          接下来路书会帮你回答一个问题：<br/>
          <strong className="text-accent">「我接下来最该学什么」</strong>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={generatePlan}>看看我接下来最该学什么 →</button>
      </div>
    </>
  )
}

