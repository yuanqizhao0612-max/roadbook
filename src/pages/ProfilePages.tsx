import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import type { BasicProfile, AudienceType } from '../data/types'
import { AUDIENCE_META } from '../data/types'
import { captureBasicProfile, generateProfileReflection, saveContext } from '../agents/contextAgent'

const INDUSTRIES = ['互联网/科技', '金融', '教育', '制造业', '消费品', '医疗健康', '文化传媒', '公务员/体制内', '还在探索']
const FUNCTIONS = ['产品', '研发', '设计', '运营', '市场', '销售', '职能/行政', '还在探索']

// 分人群的词表
const STAGES: Record<AudienceType, string[]> = {
  new_grad: ['在校', '毕业 1 年内', '工作 1-3 年', '工作 3-5 年'],
  mid_career: ['工作 5-8 年', '工作 8-10 年', '工作 10 年以上'],
  senior: ['工作 15-20 年', '工作 20 年以上', '已财富自由 / 半退休']
}
const CONCERNS: Record<AudienceType, string[]> = {
  new_grad: ['要不要接 Offer', '该不该转行/换方向', '怎么判断现在这份工作值不值得', '不知道自己适合什么'],
  mid_career: ['要不要二次转型', '该走管理还是专家', '要不要做副业/第二曲线', '家庭与事业怎么平衡'],
  senior: ['职业下半场怎么过', '要不要急流勇退/降耗', '为下一代还是为自己', '健康精力怎么安排']
}
const PRIORITIES: Record<AudienceType, string[]> = {
  new_grad: ['成长', '薪资', '行业方向', '稳定性', '工作生活平衡', '直属领导', '公司平台'],
  mid_career: ['成长', '收入', '行业前景', '自主权', '工作生活平衡', '家庭', '稳定性'],
  senior: ['自主权', '健康', '稳定现金流', '传承/被需要', '家庭', '时间自由']
}
const LIMITS: Record<AudienceType, string[]> = {
  new_grad: ['收入压力', '风险承受有限', '时间不够', '家人期望', '方向不清晰'],
  mid_career: ['家庭与精力', '收入不能断', '风险承受有限', '时间不够', '已有积累舍不得'],
  senior: ['家庭与精力', '积蓄有限', '健康', '不想再从头来', '为下一代让路']
}

export default function ProfilePages({ state, setState, goTo }: PageCtx) {
  const page = state.page
  const [draft, setDraft] = useState<BasicProfile>(
    state.profile || {
      audience: 'new_grad', stage: '', industry: '', function: '', concerns: [], priorities: [], limits: [], city: '', updatedAt: ''
    }
  )

  const toggleArr = (key: 'concerns' | 'priorities' | 'limits', val: string, max?: number) => {
    setDraft(prev => {
      const arr = prev[key]
      const exists = arr.includes(val)
      let next: string[]
      if (exists) next = arr.filter(x => x !== val)
      else if (max && arr.length >= max) next = [...arr.slice(1), val]
      else next = [...arr, val]
      return { ...prev, [key]: next }
    })
  }

  const a: AudienceType = draft.audience || 'new_grad'

  // ------- 第 1 页（合 0+1）：你是谁 + 你现在的情况 -------
  if (page === 'profile_0') {
    return (
      <>
        <Header chapter="告诉我更多 · 让分析更准" title="说说你的情况，路书才能给你更对的人" subtitle="只需要 30 秒——路书会用这些帮你匹配更精准的前人经验。" />
        {/* 人群 */}
        <div className="form-group mt-16">
          <div className="form-label">你正处在哪段人生？</div>
          <div className="audience-list">
            {(Object.keys(AUDIENCE_META) as AudienceType[]).map(x => (
              <button key={x} className={`audience-card ${draft.audience === x ? 'active' : ''}`} onClick={() => setDraft({ ...draft, audience: x })}>
                <div className="audience-label">{AUDIENCE_META[x].label}</div>
                <div className="audience-age">{AUDIENCE_META[x].ageBand}</div>
                <div className="audience-tag">{AUDIENCE_META[x].tagline}</div>
              </button>
            ))}
          </div>
        </div>
        {/* 阶段 */}
        <div className="form-group">
          <div className="form-label">你现在的阶段？</div>
          <div className="chip-group">
            {STAGES[a].map(s => (
              <button key={s} className={`chip ${draft.stage === s ? 'active' : ''}`} onClick={() => setDraft({ ...draft, stage: s })}>{s}</button>
            ))}
          </div>
        </div>
        {/* 行业 */}
        <div className="form-group">
          <div className="form-label">你所在 / 感兴趣的行业？</div>
          <div className="chip-group">
            {INDUSTRIES.map(s => (
              <button key={s} className={`chip ${draft.industry === s ? 'active' : ''}`} onClick={() => setDraft({ ...draft, industry: s })}>{s}</button>
            ))}
          </div>
        </div>
        <BottomBar label="下一步" disabled={!draft.stage || !draft.industry} onClick={() => {
          setState(s => ({ ...s, profile: { ...draft, updatedAt: new Date().toISOString() } }))
          goTo('profile_1')
        }} />
      </>
    )
  }

  // ------- 第 2 页（合 2+3）：你关心什么 + 你看重什么 -------
  if (page === 'profile_1') {
    return (
      <>
        <Header chapter="再选一选 · 你真正在意什么" title="你最关心的事、最看重的、最大的限制" subtitle="这几个选完，路书就能帮你做更深的分析了。" />
        <div className="form-group mt-16">
          <div className="form-label">你最近最关心的事（最多 2 个）</div>
          <div className="check-list">
            {CONCERNS[a].map(c => (
              <button key={c} className={`check-item ${draft.concerns.includes(c) ? 'active' : ''}`} onClick={() => toggleArr('concerns', c, 2)}>
                <span className="check-box">{draft.concerns.includes(c) ? '✓' : ''}</span>
                <span>{c}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">对你来说最重要的是什么（最多 3 个）</div>
          <div className="chip-group">
            {PRIORITIES[a].map(p => (
              <button key={p} className={`chip ${draft.priorities.includes(p) ? 'active' : ''}`} onClick={() => toggleArr('priorities', p, 3)}>{p}</button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <div className="form-label">你目前最大的限制（可多选）</div>
          <div className="chip-group">
            {LIMITS[a].map(l => (
              <button key={l} className={`chip ${draft.limits.includes(l) ? 'active' : ''}`} onClick={() => toggleArr('limits', l)}>{l}</button>
            ))}
          </div>
        </div>
        <BottomBar label="生成我的路书摘要" disabled={draft.concerns.length === 0 || draft.priorities.length === 0} onClick={() => {
          const profile = { ...draft, updatedAt: new Date().toISOString() }
          let next = captureBasicProfile(state, profile)
          const summary = generateProfileReflection(profile, next)
          next = saveContext(next, summary)
          setState(() => next)
          goTo('profile_reflection')
        }} />
      </>
    )
  }

  // ------- Profile Reflection（小结，不变） -------
  if (page === 'profile_reflection') {
    const summary = state.context
    const audLabel = state.profile ? AUDIENCE_META[state.profile.audience].label : '职场新人'
    return (
      <>
        <Header chapter="小结" title="路书读到了你" icon="sparkle" />
        <div className="card-accent card mt-16">
          <div className="item-body" style={{ color: 'var(--ink)' }}>
            {summary?.summaryText || '你已经开始认真思考"什么对自己重要"——这正是打开这本书的最好时机。'}
          </div>
        </div>
        <div className="card">
          <div className="section-label">你现在的样子</div>
          <div className="item-body">
            <strong>人群：</strong>{audLabel}<br/>
            <strong>阶段：</strong>{state.profile?.stage}<br/>
            <strong>行业：</strong>{state.profile?.industry}<br/>
            <strong>最关心：</strong>{state.profile?.concerns.join('、')}<br/>
            <strong>最看重：</strong>{state.profile?.priorities.join('、')}
          </div>
        </div>
        <div className="card-soft">
          <div className="text-sm text-faint">现在路书更懂你了。接下来你可以：<strong className="text-accent">规划你的下一程</strong>。</div>
        </div>
        <BottomBar label="看看我的下一程 →" onClick={() => goTo('dashboard')} />
      </>
    )
  }

  return null
}


function BottomBar({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <div style={{ marginTop: 24 }}>
      <button className="btn btn-primary btn-full" onClick={onClick} disabled={disabled}>{label}</button>
      {disabled && <div className="text-xs text-faint text-center mt-8">把上面的选项补一下再继续</div>}
    </div>
  )
}
