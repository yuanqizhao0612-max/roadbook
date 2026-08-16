import { useEffect, useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import BookShelf from '../components/BookShelf'
import type { RoadbookEntry, OrdinaryCase } from '../data/types'
import { searchLibrary, rankSimilarEntries, matchEntriesWithLLM } from '../agents/retrievalAgent'
import { llmEnabled } from '../services/llm'
import { pitfallTags, backgroundVarietyEntries, allFixtureCases } from '../data/fixtureCases'
import { loadLibrary } from '../store/store'

export default function LibraryHomePage({ state, goTo }: PageCtx) {
  const userEntries = loadLibrary().filter(e => e.visibility === 'anonymous_public')
  const allEntries = searchLibrary(state, { profile: state.profile })
  const [similar, setSimilar] = useState(() => rankSimilarEntries(state, allEntries, 4))
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const [matching, setMatching] = useState(false)
  const recentBooks = [...userEntries, ...allFixtureCases.slice(-4).map(toBookEntry)].slice(-4)
  const varietyBooks = backgroundVarietyEntries.map(toBookEntry)

  useEffect(() => {
    let alive = true
    let guard: ReturnType<typeof setTimeout> | undefined
    if (llmEnabled()) {
      setMatching(true)
      guard = setTimeout(() => { if (alive) setMatching(false) }, 10000)
      matchEntriesWithLLM(state, allEntries, 4)
        .then(res => {
          if (!alive) return
          setSimilar(res.ranked)
          const r: Record<string, string> = {}
          res.ranked.forEach(x => { if (x.reason) r[x.entry.entry_id] = x.reason })
          setReasons(r)
          setMatching(false)
        })
        .catch(() => { if (alive) setMatching(false) })
        .finally(() => clearTimeout(guard))
    }
    return () => { alive = false; clearTimeout(guard) }
  }, [])

  return (
    <>
      <Header chapter="人生图书馆" title="前人走过的路，都在这里" icon="books" />

      <div className="library-note">
        每本书都标注了来源：<strong>演示样本</strong>为示意画像，<strong>真实内测</strong>为经授权的匿名故事，<strong>用户</strong>是像你一样的人写的。每个人都是一本书。
      </div>

      {/* 和我相似的（四本书架） */}
      <div className="section-label mt-16">馆员推荐 · 和我相似的</div>
      {matching && (
        <div className="match-weak-note">馆员正在为你匹配更相关的过来人…</div>
      )}
      {(similar.length === 0 || similar.every(s => s.weak)) && !matching && (
        <div className="match-weak-note">
          暂时没有完全相似的过来人。下面这几页和你处境最接近，供参考；
          如果都不贴切，也欢迎你写一页，给后来的人留条线索。
        </div>
      )}
      <BookShelf entries={similar.map(s => s.entry)} reasons={reasons} />

      {/* 最近写下的（四本书架） */}
      <div className="section-label mt-16">最近写下的</div>
      <BookShelf entries={recentBooks} />

      {/* 不同背景的路书（四本书架） */}
      <div className="section-label mt-16">不同背景的路书</div>
      <BookShelf entries={varietyBooks} />

      {/* 值得避开的坑 */}
      <div className="section-label mt-16">最值得避开的坑</div>
      <div className="card" onClick={() => goTo('pitfall_library')} style={{ cursor: 'pointer' }}>
        <div className="chip-group">
          {pitfallTags.slice(0, 4).map(p => (
            <span key={p.tag} className="badge badge-pitfall">⚠ {p.tag}</span>
          ))}
        </div>
        <div className="text-xs text-accent mt-8">看看这些坑怎么避 →</div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary btn-full" onClick={() => goTo('write_entry_a')}>续写我的那一本 →</button>
      </div>
    </>
  )
}

const TIME_MAP: Record<string, string> = {
  '3_months': '3 个月', '6_months': '半年', '18_months': '18 个月',
  '1_year': '1 年', '2_years': '2 年', 'more': '更久'
}

// 把普通人演示样本（OrdinaryCase）映射成书架需要的 RoadbookEntry
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
  }
}
