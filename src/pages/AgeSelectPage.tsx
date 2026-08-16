import type { PageCtx } from './router'
import Header from '../components/Header'
import Icon from '../components/Icon'
import type { AudienceType } from '../data/types'
import { AUDIENCE_META } from '../data/types'

export default function AgeSelectPage({ setState, goTo }: PageCtx) {
  const pick = (audience: AudienceType) => {
    setState(s => ({
      ...s,
      profile: {
        ...(s.profile || { stage: '', industry: '', function: '', concerns: [], priorities: [], limits: [], city: '', updatedAt: '' }),
        audience,
        updatedAt: new Date().toISOString(),
      },
    }))
    goTo('intent_gate')
  }

  const cards: { key: AudienceType; icon: string; hook: string }[] = [
    { key: 'new_grad', icon: 'leaf', hook: '刚起步，想找对第一个方向' },
    { key: 'mid_career', icon: 'trending-up', hook: '想二次选择，或往上走一步' },
    { key: 'senior', icon: 'mountain', hook: '想规划人生的下半场' },
  ]

  return (
    <>
      <Header
        chapter="走进图书馆"
        title="你正处在哪段人生？"
        subtitle="选一个，先逛逛和你同年龄段的人写下的路书——每个人都是一本书。"
      />
      <div className="age-select-list mt-16">
        {cards.map(c => (
          <button
            key={c.key}
            className="age-select-card"
            onClick={() => pick(c.key)}
          >
            <span className="age-select-icon">
              <Icon name={c.icon} size={26} strokeWidth={1.8} />
            </span>
            <div className="age-select-body">
              <div className="age-select-label">{AUDIENCE_META[c.key].label}</div>
              <div className="age-select-age">{AUDIENCE_META[c.key].ageBand}</div>
              <div className="age-select-hook">{c.hook}</div>
            </div>
            <div className="age-select-arrow">→</div>
          </button>
        ))}
      </div>
      <div className="card-soft mt-16">
        <div className="text-sm text-faint">
          选完就可以直接逛图书馆了。<br/>
          看完别人的书，你也可以写下自己的那一本——成功或失败，都是后来的人想翻的参考。
        </div>
      </div>
    </>
  )
}
