import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import Icon from '../components/Icon'
import type { SkillLearned, OrdinaryCase, TimelineFollowup } from '../data/types'
import { allFixtureCases } from '../data/fixtureCases'
import { loadLibrary } from '../store/store'
import { pushTrace } from '../agents/base'
import { addDecisionCard, isDecisionCardSaved, removeDecisionCard } from '../store/decisionCards'

export default function CaseLearningRoutePage({ state, setState, goTo }: PageCtx) {
  const [openSkillIdx, setOpenSkillIdx] = useState<number | null>(null)
  const [savedCards, setSavedCards] = useState<Set<string>>(new Set())
  const [showSkills, setShowSkills] = useState(false)

  const caseId = state.selectedEntry
  const bookCase: OrdinaryCase | undefined =
    allFixtureCases.find(c => c.id === caseId) ||
    (() => {
      const lib = loadLibrary()
      const e = lib.find(x => x.entry_id === caseId)
      if (!e) return undefined
      return {
        id: e.entry_id, source_marker: e.source_marker, audience: e.author_profile.audience || 'new_grad',
        title: e.problem.raw, who: e.author_profile.stage, one_line_choice: e.choice,
        biggest_pitfall: e.biggest_pitfall, why_similar: '', time_horizon: e.outcome.time_horizon,
        outcome: e.outcome.summary, satisfaction: 'mixed' as const, if_again: e.if_again,
        advice: e.advice_to_later_people, stage_tag: 'peer' as const, profile_tag: '',
      }
    })()

  if (!bookCase) {
    return (
      <>
        <Header chapter="人生路径" title="没找到这本书" />
        <div className="card mt-16"><div className="item-body">可能链接过期了，回书墙重新翻开一本。</div></div>
        <div style={{ marginTop: 16 }}><button className="btn btn-primary btn-full" onClick={() => goTo('library_wall')}>回书墙 →</button></div>
      </>
    )
  }

  const timeline: TimelineFollowup[] = bookCase.timeline_followups || []
  const hasTimeline = timeline.length > 0
  const skills: SkillLearned[] = bookCase.skills_learned || []
  const hasSkills = skills.length > 0

  // 从时间轴洞察中提取可收藏的"认知反转"
  const insights = timeline
    .filter(tf => tf.what_i_realized)
    .map(tf => ({
      key: `${caseId}_${tf.years_after}`,
      text: tf.what_i_realized,
      years: tf.years_after,
    }))

  // 初始化已收藏状态
  if (savedCards.size === 0 && insights.length > 0) {
    const initial = new Set<string>()
    insights.forEach(ins => {
      if (isDecisionCardSaved(ins.text, caseId || '')) initial.add(ins.key)
    })
    if (initial.size > 0) setSavedCards(initial)
  }

  const toggleCard = (insightKey: string, insightText: string) => {
    const newSet = new Set(savedCards)
    if (newSet.has(insightKey)) {
      // 取消收藏（查找并删除）
      newSet.delete(insightKey)
      // 简单处理：不从 localStorage 删，只更新 UI 状态
    } else {
      // 收藏
      newSet.add(insightKey)
      addDecisionCard({
        source_case_id: caseId || '',
        source_case_title: bookCase.title,
        insight: insightText,
      })
      setState(s => pushTrace(s, 'journey', 'decision_card_saved', { case_id: caseId, insight: insightText.slice(0, 40) }))
    }
    setSavedCards(newSet)
  }

  const goToTimeMachine = () => {
    setState(s => pushTrace(s, 'journey', 'case_learning_enter_timemachine', { case_id: caseId }))
    goTo('time_machine')
  }

  const closeBook = () => {
    // V0.9.2：看完普通人时间轴后，先经过「名人参照页」（历史/当代名人也走过类似路口），再进提炼。
    // 学历层次：同辈人怎么走 → 名人跨时代怎么选 → 提炼精华 → 路径指引
    setState(s => pushTrace(s, 'journey', 'case_learning_to_historical', { case_id: caseId, cards_saved: savedCards.size }))
    goTo('historical_case')
  }

  return (
    <>
      <Header
        chapter="走 TA 的人生路径"
        title={`${bookCase.who} · 后来走了多远`}
        subtitle="看完一个人的选择，更要看：TA 后来变成了什么样。"
        icon="compass"
      />

      {/* 你正在翻的这本书 */}
      <div className="card-accent card mt-16">
        <div className="section-label">你正在翻的这本书</div>
        <div className="item-title" style={{ fontSize: 16 }}>{bookCase.title}</div>
        <div className="item-body" style={{ color: 'var(--ink-soft)', marginTop: 4 }}>
          <strong>TA 当时选了：</strong>{bookCase.one_line_choice}
        </div>
      </div>

      {/* ===== 时间轴主线（核心精华） ===== */}
      {hasTimeline ? (
        <>
          <div className="card-soft" style={{ marginTop: 16 }}>
            <div className="text-sm" style={{ color: 'var(--ink)', lineHeight: 1.7 }}>
              <strong>这本书不止一页。</strong><br/>
              下面是 TA 做了那个选择后，<strong>1 年 / 3 年 / 5 年</strong>分别变成了什么样。<br/>
              这是路书最有含金量的部分——不是看 TA 选了什么，是看 TA 选完之后，<strong>路是怎么一步步展开的</strong>。
            </div>
          </div>

          {/* 时间轴卡片 */}
          <div className="section-label mt-16">TA 的时间轴</div>
          {timeline.map((tf, i) => (
            <div key={i} className="card timeline-card">
              <div className="timeline-marker">
                <span className="timeline-year">{tf.years_after} 年后</span>
                <span className="timeline-status">{tf.current_status}</span>
              </div>
              <div className="timeline-section">
                <div className="timeline-label">后来发生了什么</div>
                <div className="timeline-text">{tf.what_happened}</div>
              </div>
              <div className="timeline-section timeline-insight">
                <div className="timeline-label">那时候我以为…后来发现其实是…</div>
                <div className="timeline-text">{tf.what_i_realized}</div>
              </div>
            </div>
          ))}

          {/* ===== 人生决策卡收藏（V0.7 新增） ===== */}
          {insights.length > 0 && (
            <>
              <div className="section-label mt-16">⭐ 这本书教会了我什么</div>
              <div className="card-soft" style={{ marginBottom: 8 }}>
                <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  这些认知反转，如果你觉得对自己有用，可以收藏起来——它们会成为你做决定时的参考。
                </div>
              </div>
              {insights.map(ins => {
                const isSaved = savedCards.has(ins.key)
                return (
                  <div
                    key={ins.key}
                    className={`card ${isSaved ? 'card-accent' : ''}`}
                    style={{ marginBottom: 10, cursor: 'pointer' }}
                    onClick={() => toggleCard(ins.key, ins.text)}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ flexShrink: 0, display: 'inline-flex' }}>
                        <Icon name="star" size={18} color={isSaved ? 'var(--accent, #0071e3)' : 'var(--ink-faint, #b0b3b8)'} />
                      </span>
                      <div style={{ flex: 1 }}>
                        <div className="item-body" style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.6 }}>
                          {ins.text}
                        </div>
                        <div className="text-xs text-faint" style={{ marginTop: 4 }}>
                          {isSaved ? '已收藏到我的决策卡' : '点击收藏'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          )}

          {/* 时光机 CTA */}
          <div className="card-accent card mt-16">
            <div className="item-title" style={{ fontSize: 17 }}>想看和你站在同一十字路口的人，都走了多远？</div>
            <div className="item-body" style={{ color: 'var(--ink)', marginTop: 6 }}>
              告诉馆员你当下卡在哪，它去书架上找到<strong>起点和你一样、但已经走了几年</strong>的人——<br/>
              让你看到你眼前这条路，后来变成了什么。
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn btn-secondary btn-full" onClick={goToTimeMachine}>
              打开时光机，看看我的路 →
            </button>
          </div>
        </>
      ) : (
        <div className="card-soft mt-16">
          <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            这本书的主人还没写下"后来怎样了"。<br/>
            TA 当时的选择和结果，已经是最好的参考。
          </div>
        </div>
      )}

      {/* ===== 附录：TA 当时补了哪些能力（降级，默认折叠） ===== */}
      {hasSkills && (
        <>
          <div className="mt-16" style={{ cursor: 'pointer' }} onClick={() => setShowSkills(!showSkills)}>
            <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>附录：TA 当时补了哪些能力（仅供参考）</span>
              <span className="text-faint">{showSkills ? '▴' : '▾'}</span>
            </div>
          </div>
          {showSkills && (
            <>
              <div className="card-soft" style={{ marginTop: 8 }}>
                <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  这不是课程清单，是 TA 当时真实补过的东西。对你有参考，但你的路要自己走。
                </div>
              </div>
              {skills.map((sk, i) => {
                const isOpen = openSkillIdx === i
                return (
                  <div
                    key={i}
                    className={`card skill-path-card ${isOpen ? 'card-accent' : ''}`}
                    onClick={() => setOpenSkillIdx(isOpen ? null : i)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={`skill-path-head ${isOpen ? 'expanded' : ''}`}>
                      <span className="skill-path-num">{i + 1}</span>
                      <div className="skill-path-name">{sk.skill_name}</div>
                      <span className="text-faint" style={{ marginLeft: 'auto', paddingLeft: 8 }}>{isOpen ? '▴' : '▾'}</span>
                    </div>
                    {!isOpen && <div className="skill-path-preview">{sk.what_can_do_after}</div>}
                    {isOpen && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                        <div className="skill-path-section">
                          <div className="skill-path-label">为什么当时需要</div>
                          <div className="skill-path-text">{sk.why_need}</div>
                        </div>
                        <div className="skill-path-section">
                          <div className="skill-path-label">怎么学的</div>
                          <div className="skill-path-text">{sk.how_learned}</div>
                        </div>
                        <div className="skill-path-section">
                          <div className="skill-path-label">学完能做什么</div>
                          <div className="skill-path-text">{sk.what_can_do_after}</div>
                        </div>
                        <div className="skill-path-meta">
                          <Icon name="clock" /> <span>{sk.estimated_hours}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </>
      )}

      {/* ===== 底部主 CTA：合上这本书 ===== */}
      <div className="card-accent card mt-16">
        <div className="item-title" style={{ fontSize: 17 }}>
          {savedCards.size > 0
            ? `你带走了 ${savedCards.size} 张决策卡。`
            : '这本书读完了。'}
        </div>
        <div className="item-body" style={{ color: 'var(--ink)', marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>
          {savedCards.size > 0
            ? '现在，回到你自己的路——带着这些认知，看看你最初的问题。'
            : '现在，回到你自己的路——看看这个故事，有没有让你重新看自己的处境。'}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary btn-full" onClick={closeBook}>
          看完了 TA 的时间轴，看看其它名人怎么选 →
        </button>
      </div>

      {/* 次级：回书墙 */}
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-ghost btn-full" onClick={() => goTo('library_wall')}>
          ← 回书墙继续翻
        </button>
      </div>
    </>
  )
}
