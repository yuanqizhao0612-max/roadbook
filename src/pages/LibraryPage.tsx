import { useEffect, useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import BookShelf from '../components/BookShelf'
import type { AppState, RoadbookEntry } from '../data/types'
import { searchLibrary, rankSimilarEntries, matchEntriesWithLLM } from '../agents/retrievalAgent'
import { llmEnabled } from '../services/llm'
import { pushTrace } from '../agents/base'

export default function LibraryPage({ state, setState, goTo }: PageCtx) {
  const entries = searchLibrary(state, { profile: state.profile })
  const [ranked, setRanked] = useState(() => rankSimilarEntries(state, entries, 4))
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const [matching, setMatching] = useState(false)
  const allWeak = ranked.length === 0 || ranked.every(r => r.weak)

  useEffect(() => {
    let alive = true
    let guard: ReturnType<typeof setTimeout> | undefined
    if (llmEnabled()) {
      setMatching(true)
      guard = setTimeout(() => { if (alive) setMatching(false) }, 10000)
      matchEntriesWithLLM(state, entries, 4)
        .then(res => {
          if (!alive) return
          setRanked(res.ranked)
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

  const onOpen = (entry: RoadbookEntry) => {
    setState((s): AppState => {
      let next: AppState = {
        ...s,
        selectedEntry: entry.entry_id,
        evidence: { ...s.evidence, selected_entry_id: entry.entry_id, entered_roadbook_library: true },
        growth: { ...s.growth, read_roadbook_entries: [...new Set([...s.growth.read_roadbook_entries, entry.entry_id])] }
      }
      next = pushTrace(next, 'retrieval', 'library_entry_open', { entry_id: entry.entry_id })
      return next
    })
  }

  return (
    <>
      <Header
        chapter="第 3 章 · 路书库"
        title="前人的路，摆在这排书架上"
        subtitle={allWeak
          ? (matching ? 'AI 正在为你匹配更相关的过来人…' : '暂时没有完全相似的过来人，下面是和你处境最接近的几页。')
          : '每一本，都是一个走过的人写下的样本。点开哪本，就看哪本的具体经历。'}
        icon="books"
      />
      {allWeak && !matching && (
        <div className="match-weak-note">
          没有完全踩过这道题的过来人。下面这几页是按你的处境排的「最接近」，仅供参考；
          如果都不贴切，欢迎你写一页给后来的人。
        </div>
      )}
      <div className="mt-16">
        <BookShelf entries={ranked.map(r => r.entry)} onOpen={onOpen} reasons={reasons} />
      </div>
      <div style={{ marginTop: 20 }}>
        <button className="btn btn-secondary btn-full" onClick={() => goTo('library_home')}>浏览完整路书库</button>
      </div>
    </>
  )
}
