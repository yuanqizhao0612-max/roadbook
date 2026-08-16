import { useEffect, useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import { pushTrace } from '../agents/base'
import { searchLibrary, rankSimilarEntries, matchEntriesWithLLM } from '../agents/retrievalAgent'
import type { RoadbookEntry } from '../data/types'
import { llmEnabled } from '../services/llm'

interface MatchedEntry {
  entry: RoadbookEntry
  reason: string
  score: number
  weak: boolean
}

// 分数阈值：LLM 打分 ≥6 才算"真有相关样本"，否则进入诚实空书架
const RELEVANT_THRESHOLD = 6

export default function NotAlonePage({ state, setState, goTo }: PageCtx) {
  // 初次：用规则引擎在全量候选池上立即渲染
  const pool = searchLibrary(state)
  const [matched, setMatched] = useState<MatchedEntry[]>(() => rankSimilarEntries(state, pool, 4))
  const [matching, setMatching] = useState(false)
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    let guard: ReturnType<typeof setTimeout> | undefined
    if (llmEnabled()) {
      setMatching(true)
      guard = setTimeout(() => { if (alive) setMatching(false) }, 12000)
      matchEntriesWithLLM(state, pool, 4)
        .then(res => { if (alive) { setMatched(res.ranked); setMatching(false) } })
        .catch(() => { if (alive) setMatching(false) })
        .finally(() => { if (guard) clearTimeout(guard) })
    }
    return () => { alive = false; if (guard) clearTimeout(guard) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // LLM 打分体系下判断"有没有真相关的"
  const bestScore = matched.length > 0 ? Math.max(...matched.map(m => m.score)) : 0
  const hasRelevant = bestScore >= RELEVANT_THRESHOLD
  const top = matched.slice(0, 3)

  const openCase = (entry: RoadbookEntry) => {
    setState(s => ({
      ...pushTrace(s, 'retrieval', 'not_alone_open_case', { entry_id: entry.entry_id, best_score: bestScore }),
      selectedEntry: entry.entry_id,
    }))
    goTo('case_learning_route')
  }
  const openTop = () => {
    if (top.length === 0) return
    const entry = top[0].entry
    setState(s => ({
      ...pushTrace(s, 'retrieval', 'not_alone_open_top', { entry_id: entry.entry_id, best_score: bestScore }),
      selectedEntry: entry.entry_id,
    }))
    goTo('case_learning_route')
  }
  const enter = () => {
    setState(s => pushTrace(s, 'retrieval', 'not_alone_enter_library', { match_count: matched.length, best_score: bestScore }))
    goTo('library')
  }
  const goWrite = () => {
    setState(s => pushTrace(s, 'retrieval', 'not_alone_go_write', { reason: 'no_relevant_match' }))
    goTo('write_entry_a')
  }

  return (
    <>
      <Header chapter="AI 馆员正在帮你找书" title="你不是第一个走到这里的人" icon="footprints" />
      {matching && (
        <div className="card-accent card mt-16" style={{ borderColor: 'var(--accent-blue, #0071e3)' }}>
          <div className="item-body" style={{ color: 'var(--accent-blue, #0071e3)', fontSize: 15, lineHeight: 1.7 }}>
            馆员正在帮你把原本要问遍身边人、翻好几本书才能凑齐的答案，一次找齐——
            <br />
            对照你刚才写的困惑，挑出最相关的几本……
          </div>
        </div>
      )}

      {/* 场景 A：有真相关样本 */}
      {hasRelevant && !matching && (
        <>
          <div className="card-accent card mt-16">
            <div className="item-body" style={{ color: 'var(--ink)', fontSize: 16 }}>
              馆员从书架上找到了几本——<strong>有人也遇到过你说的这件事</strong>，他们把自己的选择和结果写了下来。
            </div>
          </div>
          <div className="card">
            <div className="section-label">馆员推荐 · 和你最相关的几本（点开就能读）</div>
            {top.map(({ entry: e, reason }, i) => (
              <div
                key={e.entry_id}
                className="match-list-card"
                style={{
                  borderBottom: i < top.length - 1 ? '1px solid var(--line)' : 'none',
                  background: hoverIdx === i ? 'var(--surface-2, #e8e8ed)' : 'transparent',
                }}
                onClick={() => openCase(e)}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <div className="item-title">{e.problem.raw}</div>
                <div className="item-meta">{e.author_profile.stage || e.author_profile.industry}</div>
                <div className="text-sm text-soft">{e.choice}</div>
                {reason && <div className="text-sm" style={{ color: 'var(--accent-blue, #0071e3)', marginTop: 4 }}>{reason}</div>}
              </div>
            ))}
          </div>
          <div className="card-soft">
            <div className="text-sm text-faint">
              这些都是真实的普通人——不是成功学案例，也不是历史伟人。<br/>
              他们有的选对了，有的走弯了，但他们都把过程留了下来。
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <button className="btn btn-primary btn-full" onClick={openTop}>翻开这本最像的 →</button>
          </div>
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-ghost btn-full" onClick={enter}>想看更多 → 路书库</button>
          </div>
        </>
      )}

      {/* 场景 B：诚实空书架——库里真没有贴切的 */}
      {!hasRelevant && !matching && (
        <>
          <div className="card-accent card mt-16">
            <div className="item-body" style={{ color: 'var(--ink)', fontSize: 16 }}>
              馆员翻遍了书架，说实话：<strong>目前还没有人写过和你这件事完全一样的那一页</strong>。
            </div>
          </div>
          <div className="match-weak-note">
            这不一定是坏事——它可能意味着你正在走一条还少有人记录的路。<br/><br/>
            下面这几本是馆员找到的、和你处境最接近的，但<strong>可能不完全贴切</strong>。看完如果你觉得"不过如此"，那恰恰说明：<strong>这件事需要你来写第一本。</strong>
          </div>
          {/* 仍然展示最接近的几条，但明确标注"仅供参考" */}
          {top.length > 0 && (
            <div className="card">
              <div className="section-label">库里最接近的几页（仅供参考）</div>
              {top.map(({ entry: e, reason }, i) => (
                <div key={e.entry_id} className="mb-8" style={{ paddingBottom: 10, borderBottom: i < top.length - 1 ? '1px solid var(--line)' : 'none', opacity: 0.85 }}>
                  <div className="item-title">{e.problem.raw}</div>
                  <div className="item-meta">{e.author_profile.stage || e.author_profile.industry}</div>
                  <div className="text-sm text-soft">{e.choice}</div>
                  {reason && <div className="text-sm" style={{ color: 'var(--text-faint, #888)', marginTop: 4 }}>{reason}</div>}
                </div>
              ))}
            </div>
          )}
          <div className="card-soft" style={{ marginTop: 16 }}>
            <div className="text-sm" style={{ color: 'var(--ink)', lineHeight: 1.7 }}>
              <strong>如果你正走在这条路上——</strong><br/>
              把你现在的选择和顾虑写下来，哪怕只有几句话。<br/>
              也许下一个走到这里的人，会因为你的那一页，少走半年弯路。
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-primary btn-full" onClick={goWrite}>我来写第一页 →</button>
          </div>
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-ghost btn-full" onClick={enter}>还是先翻翻路书库 →</button>
          </div>
        </>
      )}
    </>
  )
}