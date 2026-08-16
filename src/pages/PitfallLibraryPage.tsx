import type { PageCtx } from './router'
import Header from '../components/Header'
import { pitfallTags, allFixtureCases } from '../data/fixtureCases'
import { loadLibrary } from '../store/store'

export default function PitfallLibraryPage({ state, goTo }: PageCtx) {
  const userEntries = loadLibrary()
  const findCase = (id: string) => allFixtureCases.find(c => c.id === id)
  const findUser = (id: string) => userEntries.find(e => e.entry_id === id)

  return (
    <>
      <Header chapter="路书库 · 前面的人踩过哪些坑" title="这些坑，前人替你踩过了" icon="alert" />

      <div className="card-accent card mt-16">
        <div className="item-body" style={{ color: 'var(--ink)' }}>
          下面这些坑不是猜测，是走过的人真实留下的提醒。点开看看他们怎么踩的、怎么避的。
        </div>
      </div>

      {pitfallTags.map(p => (
        <div key={p.tag} className="card">
          <div className="flex items-center gap-8 mb-8">
            <span className="badge badge-pitfall">⚠ {p.tag}</span>
            <span className="text-xs text-faint">{p.entryIds.length} 页路书提到</span>
          </div>
          {p.entryIds.map(id => {
            const c = findCase(id)
            const u = !c ? findUser(id) : null
            if (c) {
              return (
                <div key={id} className="card-soft" style={{ marginBottom: 8 }}>
                  <div className="text-sm font-bold">{c.title}</div>
                  <div className="text-xs text-soft mt-8">{c.biggest_pitfall}</div>
                  <div className="text-xs text-accent mt-8">→ {c.advice}</div>
                </div>
              )
            }
            if (u) {
              return (
                <div key={id} className="card-soft" style={{ marginBottom: 8 }}>
                  <div className="text-sm font-bold">{u.problem.raw}</div>
                  <div className="text-xs text-soft mt-8">{u.biggest_pitfall}</div>
                  <div className="text-xs text-accent mt-8">→ {u.advice_to_later_people}</div>
                </div>
              )
            }
            return null
          })}
        </div>
      ))}

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-secondary btn-full" onClick={() => goTo('library_home')}>← 返回路书库</button>
      </div>
    </>
  )
}

