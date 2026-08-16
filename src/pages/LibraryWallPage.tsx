import { useState, useMemo, useEffect } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import Icon from '../components/Icon'
import type { OrdinaryCase, RoadbookEntry, AudienceType, LifeCategory } from '../data/types'
import { AUDIENCE_META, LIFE_CATEGORIES, getSubcategoryLabel } from '../data/types'
import { ordinaryCasesForAudience, notableCasesForAudience, allFixtureCases as allFixtureCasesRaw } from '../data/fixtureCases'
import { loadLibrary } from '../store/store'
import { getReads, recordRead, getComments, addComment, type BookComment } from '../store/interactions'

type CatFilter = LifeCategory | 'all' | 'notable'
type SubFilter = string  // 二级分类 key 或 'all'

export default function LibraryWallPage({ state, setState, goTo }: PageCtx) {
  const audience: AudienceType = state.profile?.audience || 'new_grad'
  const [open, setOpen] = useState<RoadbookEntry | null>(null)
  const [comments, setComments] = useState<BookComment[]>([])
  const [commentDraft, setCommentDraft] = useState('')
  const [showCommentInput, setShowCommentInput] = useState(false)

  // V0.8 分类筛选状态
  const [catFilter, setCatFilter] = useState<CatFilter>('all')
  const [subFilter, setSubFilter] = useState<SubFilter>('all')

  // 普通人 + 名人 + 用户贡献
  const allBooks: RoadbookEntry[] = useMemo(() => {
    const ordinary = ordinaryCasesForAudience(audience).map(toBookEntry)
    const notable = notableCasesForAudience(audience).map(toBookEntry)
    const userEntries = loadLibrary()
      .filter(e => e.visibility === 'anonymous_public')
      .map(e => e as RoadbookEntry)
    return [...ordinary, ...notable, ...userEntries]
  }, [audience])

  // 按分类过滤
  const filteredBooks = useMemo(() => {
    // 名人库：直接看 notable 标记（不分生活子类）
    if (catFilter === 'notable') return allBooks.filter(b => b.notable)
    if (catFilter === 'all') return allBooks
    // 从原始 case 取 life_category / life_subcategory
    return allBooks.filter(b => {
      const sourceCase = allFixtureCasesRaw.find(c => c.id === b.entry_id)
      const cat = sourceCase?.life_category
      const sub = sourceCase?.life_subcategory
      if (!cat) return false
      if (cat !== catFilter) return false
      if (subFilter !== 'all' && sub !== subFilter) return false
      return true
    })
  }, [allBooks, catFilter, subFilter])

  // 每个一级分类有多少本书（用于 tab 上显示数字）
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allBooks.length, career: 0, life: 0, relationship: 0, notable: 0 }
    for (const b of allBooks) {
      if (b.notable) counts.notable = (counts.notable || 0) + 1
      const sourceCase = allFixtureCasesRaw.find(c => c.id === b.entry_id)
      if (sourceCase?.life_category) {
        counts[sourceCase.life_category] = (counts[sourceCase.life_category] || 0) + 1
      }
    }
    return counts
  }, [allBooks])

  const audMeta = AUDIENCE_META[audience]
  const userStage = state.profile ? `${state.profile.stage || audMeta.label}` : audMeta.label

  // 打开详情时：记录翻阅 + 加载留言
  useEffect(() => {
    if (open) {
      recordRead(open.entry_id)
      setComments(getComments(open.entry_id))
      setShowCommentInput(false)
      setCommentDraft('')
    }
  }, [open])

  const submitComment = () => {
    if (!open || !commentDraft.trim()) return
    const cmt = addComment(open.entry_id, commentDraft.trim(), userStage)
    setComments(prev => [...prev, cmt])
    setCommentDraft('')
    setShowCommentInput(false)
  }

  // 切换一级分类时重置二级
  const switchCat = (c: CatFilter) => {
    setCatFilter(c)
    setSubFilter('all')
  }

  // 当前一级分类的 meta（用于二级 tab）
  const currentCatMeta = catFilter !== 'all' ? LIFE_CATEGORIES.find(c => c.key === catFilter) : null

  return (
    <>
      <Header
        chapter={`${audMeta.label} · 人生图书馆`}
        title="前人走过的路，都在这里"
        subtitle={`${allBooks.length} 本路书 · 按主题浏览过来人的故事`}
        icon="books"
      />

      <div className="library-note">
        每个人都是一本书。有的选对了，有的走弯了——<br/>
        他们把过程留了下来。你可以翻阅，也可以续写你自己的那一本。
      </div>

      {/* ===== V0.8 一级分类 tab ===== */}
      <div className="cat-tabs">
        <button
          className={`cat-tab ${catFilter === 'all' ? 'active' : ''}`}
          onClick={() => switchCat('all')}
        >
          全部 <span className="cat-count-badge">{catCounts.all}</span>
        </button>
        <button
          className={`cat-tab ${catFilter === 'notable' ? 'active' : ''}`}
          onClick={() => switchCat('notable')}
        >
          名人 <span className="cat-count-badge">{catCounts.notable || 0}</span>
        </button>
        {LIFE_CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`cat-tab ${catFilter === cat.key ? 'active' : ''}`}
            onClick={() => switchCat(cat.key)}
          >
            {cat.label} <span className="cat-count-badge">{catCounts[cat.key] || 0}</span>
          </button>
        ))}
      </div>

      {/* 当前分类提示 */}
      {catFilter === 'notable' ? (
        <div className="cat-section-head">
          <div className="cat-section-title">名人 / 历史人物</div>
          <div className="cat-section-tagline">曾国藩、巴菲特、邓亚萍……他们真实走过的路，是最值得参照的样本</div>
        </div>
      ) : currentCatMeta && (
        <div className="cat-section-head">
          <div className="cat-section-title">{currentCatMeta.label}</div>
          <div className="cat-section-tagline">{currentCatMeta.tagline}</div>
        </div>
      )}

      {/* ===== 二级分类 tab（只在选了具体一级分类时显示） ===== */}
      {currentCatMeta && (
        <div className="cat-subtabs">
          <button
            className={`cat-subtab ${subFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSubFilter('all')}
          >
            全部{currentCatMeta.label}
          </button>
          {currentCatMeta.subcategories.map(sub => {
            const count = allBooks.filter(b => {
              const sc = allFixtureCasesRaw.find(c => c.id === b.entry_id)
              return sc?.life_category === catFilter && sc?.life_subcategory === sub.key
            }).length
            return (
              <button
                key={sub.key}
                className={`cat-subtab ${subFilter === sub.key ? 'active' : ''}`}
                onClick={() => setSubFilter(sub.key)}
              >
                {sub.label} {count > 0 && `· ${count}`}
              </button>
            )
          })}
        </div>
      )}

      {/* 书墙网格（按分类过滤后） */}
      <div className="wall-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((b, i) => {
            const sourceCase = allFixtureCasesRaw.find(c => c.id === b.entry_id)
            const subLabel = sourceCase?.life_subcategory ? getSubcategoryLabel(sourceCase.life_category!, sourceCase.life_subcategory) : ''
            return (
              <button
                key={b.entry_id}
                className="wall-book"
                onClick={() => setOpen(b)}
                style={{ ['--i' as any]: i }}
              >
                {b.notable ? (
                  <span className="wall-book-badge wall-badge-notable">名人</span>
                ) : (
                  <span className={`wall-book-badge ${b.source_marker === 'real_beta' ? 'wall-badge-real' : (b.source_marker === 'user_contributed_local' || b.source_marker === 'user_contributed_verified') ? 'wall-badge-user' : 'wall-badge-demo'}`}>
                    {b.source_marker === 'real_beta' ? '真实' : (b.source_marker === 'user_contributed_local' || b.source_marker === 'user_contributed_verified') ? '用户' : '样本'}
                  </span>
                )}
                {subLabel && (
                  <span className="wall-book-sub" style={{
                    fontSize: 10, color: 'var(--accent, #0071e3)', fontWeight: 600,
                    marginBottom: 4, letterSpacing: 0.2,
                  }}>{subLabel}</span>
                )}
                <span className="wall-book-title">{b.problem.raw}</span>
                <span className="wall-book-author">{b.author_profile.stage || audMeta.label}</span>
                <span className="wall-book-reads">{getReads(b.entry_id)} 人翻过</span>
                <span className="wall-book-hint">翻开 →</span>
              </button>
            )
          })
        ) : (
          <div className="card-soft" style={{ gridColumn: '1 / -1', marginTop: 16, padding: 24, textAlign: 'center' }}>
            <div className="item-body" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
              这个分类下暂时还没有书。<br/>
              <span className="text-faint">也许你正是第一个该写这本的人 →</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 12 }}
              onClick={() => goTo('write_entry_a')}
            >
              写一本给后来人 →
            </button>
          </div>
        )}
      </div>

      {/* 底部双入口：求解者 + 分享者 */}
      <div className="wall-cta card-accent card mt-16">
        <div className="item-title" style={{ fontSize: 18, marginBottom: 8 }}>
          逛完了？
        </div>
        <div className="item-body" style={{ color: 'var(--ink-soft)', fontSize: 15 }}>
          一句话就行——你最近真正卡在哪件事？<br/>
          馆员会拿着你说的这句话，去书架上帮你找最相关的过来人。
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={() => goTo('current_problem')}>
          说说我最近卡在哪件事 →
        </button>
      </div>

      <div style={{ marginTop: 10 }}>
        <button className="btn btn-ghost btn-full" onClick={() => goTo('write_entry_a')}>
          我是过来人，来写一本我的 →
        </button>
      </div>

      {/* 故事详情 overlay */}
      {open && (
        <div className="book-overlay" onClick={() => setOpen(null)}>
          <div className="book-detail" onClick={e => e.stopPropagation()}>
            <button className="book-detail-close" onClick={() => setOpen(null)} aria-label="关闭">
              <Icon name="close" />
            </button>
            <div className="book-detail-head">
              <div className="book-detail-tag">
                一本路书 · 一个走过的人
                {open.notable ? (
                  <span className="book-badge book-badge-notable">名人 / 历史人物</span>
                ) : (
                  <span className={`book-badge ${open.source_marker === 'real_beta' ? 'book-badge-real' : (open.source_marker === 'user_contributed_local' || open.source_marker === 'user_contributed_verified') ? 'book-badge-real' : 'book-badge-demo'}`}>
                    {open.source_marker === 'real_beta' ? '真实内测' : (open.source_marker === 'user_contributed_local' || open.source_marker === 'user_contributed_verified') ? '用户写下' : '演示样本'}
                  </span>
                )}
              </div>
              <h2 className="book-detail-title">{open.problem.raw}</h2>
              <div className="book-detail-meta">
                {open.author_profile.stage}{open.author_profile.industry ? ` · ${open.author_profile.industry}` : ''}
              </div>
              <div className="book-detail-reads">
                {getReads(open.entry_id)} 位和你同龄段的人翻过这本书
              </div>
            </div>
            <div className="book-detail-body">
              <Section title="他最后怎么选的">
                <p>{open.choice}</p>
                {open.reasons.length > 0 && (
                  <ul className="bd-reasons">{open.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
                )}
              </Section>
              {open.case_profile && (
                <Section title="他的坐标（脱敏示意）">
                  <div className="bd-coord">
                    <span>{open.case_profile.role_from} · {open.case_profile.industry_from}</span>
                    <span className="bd-arrow">→</span>
                    <span>{open.case_profile.industry_to}</span>
                  </div>
                </Section>
              )}
              <Section title="后来怎么样">
                <p>{open.outcome.summary}</p>
              </Section>
              <Section title="最值得避开的坑">
                <p className="bd-pitfall">{open.biggest_pitfall}</p>
              </Section>
              <Section title="想对后来的人说">
                <p className="bd-advice">{open.advice_to_later_people}</p>
              </Section>

              {/* 后来人留言区 */}
              <div className="bd-section">
                <div className="bd-section-title">后来人留言</div>
                <div className="bd-section-body">
                  {comments.length === 0 ? (
                    <div className="text-sm text-faint" style={{ padding: '8px 0' }}>
                      还没有后来人留言。<br/>
                      如果你读完这本书有想说的话——"这句话救了我"、"我也是这么过来的"、"我想补充一句"——都可以写下来。
                    </div>
                  ) : (
                    <div className="comment-list">
                      {comments.map(c => (
                        <div key={c.id} className="comment-item">
                          <div className="comment-text">{c.text}</div>
                          <div className="comment-meta">{c.author_stage} · 留下于 {new Date(c.ts).toLocaleDateString('zh-CN')}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showCommentInput ? (
                    <div style={{ marginTop: 12 }}>
                      <textarea
                        className="form-textarea"
                        placeholder="写下你想对这本书/这个人说的话……"
                        value={commentDraft}
                        onChange={e => setCommentDraft(e.target.value)}
                        rows={2}
                        maxLength={120}
                      />
                      <div className="btn-row" style={{ marginTop: 8 }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => { setShowCommentInput(false); setCommentDraft('') }}>取消</button>
                        <button className="btn btn-sm btn-primary" onClick={submitComment} disabled={!commentDraft.trim()}>留下留言</button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn btn-sm btn-secondary" style={{ marginTop: 8 }} onClick={() => setShowCommentInput(true)}>
                      我也想说一句 →
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* 底部：跳转路径（区分有无时间轴） */}
            <div className="book-detail-write">
              {open.entry_id && (() => {
                // 检查这本书有没有 timeline_followups（时间轴）
                const sourceCase = allFixtureCasesRaw.find(c => c.id === open.entry_id)
                const hasTimeline = sourceCase?.timeline_followups && sourceCase.timeline_followups.length > 0
                return hasTimeline ? (
                  <>
                    <button
                      className="btn btn-primary btn-full"
                      onClick={() => { setState(s => ({ ...s, selectedEntry: open.entry_id })); goTo('case_learning_route') }}
                    >
                      看看 TA 后来变成了什么样 →
                    </button>
                    <div className="text-xs text-faint" style={{ textAlign: 'center', marginTop: 8 }}>
                      1 年 / 3 年 / 5 年后的完整人生走向——这才是这本书最精华的部分
                    </div>
                  </>
                ) : (
                  <>
                    {/* 没时间轴的书：直接跳精华提炼，跳过空白的路径页 */}
                    <button
                      className="btn btn-primary btn-full"
                      onClick={() => { setState(s => ({ ...s, selectedEntry: open.entry_id })); goTo('insight_distill') }}
                    >
                      让馆员帮我提炼可带走的东西 →
                    </button>
                    <div className="text-xs text-faint" style={{ textAlign: 'center', marginTop: 8 }}>
                      TA 还没写下"后来怎样了"，馆员基于这个故事帮你提炼认知精华
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bd-section">
      <div className="bd-section-title">{title}</div>
      <div className="bd-section-body">{children}</div>
    </div>
  )
}

const TIME_MAP: Record<string, string> = {
  '3_months': '3 个月', '6_months': '半年', '18_months': '18 个月',
  '1_year': '1 年', '2_years': '2 年', 'more': '更久'
}

function toBookEntry(c: OrdinaryCase): RoadbookEntry {
  return {
    entry_id: c.id,
    visibility: 'anonymous_public',
    source_marker: c.source_marker,
    author_profile: { stage: c.who, age_range: '', industry: '', function: '' },
    problem: { raw: c.title, tags: [] },
    choice: c.one_line_choice,
    reasons: [],
    outcome: { time_horizon: TIME_MAP[c.time_horizon] || c.time_horizon, summary: c.outcome, satisfaction: c.satisfaction },
    biggest_pitfall: c.biggest_pitfall,
    if_again: c.if_again,
    advice_to_later_people: c.advice,
    created_at: '',
    source_type: 'fixture',
    case_profile: c.case_profile,
    notable: c.notable,
  }
}
