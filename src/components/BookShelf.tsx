import { useState } from 'react'
import type { RoadbookEntry } from '../data/types'
import Icon from './Icon'

const SAT_LABEL: Record<string, string> = {
  satisfied: '结果满意',
  unsatisfied: '结果不太满意',
  mixed: '喜忧参半'
}

// 4 本路书摆在架上；每本 = 一个样本；点开原地看详情
export default function BookShelf({ entries, onOpen, reasons }: { entries: RoadbookEntry[]; onOpen?: (e: RoadbookEntry) => void; reasons?: Record<string, string> }) {
  const [open, setOpen] = useState<RoadbookEntry | null>(null)
  const books = entries.slice(0, 4)

  const handleOpen = (e: RoadbookEntry) => {
    setOpen(e)
    onOpen?.(e)
  }

  return (
    <>
      <div className="book-shelf">
        {books.map((b, i) => (
          <button key={b.entry_id} className="book-card" onClick={() => handleOpen(b)} style={{ ['--i' as any]: i }}>
            <span className="book-spine" />
            <span className="book-cover">
              <span className={`book-badge ${b.source_marker === 'real_beta' ? 'book-badge-real' : 'book-badge-demo'}`}>
                {b.source_marker === 'real_beta' ? '真实内测' : '演示样本'}
              </span>
              <span className="book-index">{i + 1}</span>
              <span className="book-title">{b.problem.raw}</span>
              <span className="book-author">{b.author_profile.stage || b.author_profile.industry || '同路人'}</span>
              {reasons && reasons[b.entry_id] && <span className="book-reason">{reasons[b.entry_id]}</span>}
              <span className="book-open-hint">翻开看 →</span>
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div className="book-overlay" onClick={() => setOpen(null)}>
          <div className="book-detail" onClick={e => e.stopPropagation()}>
            <button className="book-detail-close" onClick={() => setOpen(null)} aria-label="关闭">
              <Icon name="close" />
            </button>
            <div className="book-detail-head">
              <div className="book-detail-tag">
                一本路书 · 一个走过的人
                <span className={`book-badge ${open.source_marker === 'real_beta' ? 'book-badge-real' : 'book-badge-demo'}`}>
                  {open.source_marker === 'real_beta' ? '真实内测' : '演示样本'}
                </span>
              </div>
              <h2 className="book-detail-title">{open.problem.raw}</h2>
              <div className="book-detail-meta">{open.author_profile.stage}{open.author_profile.industry ? ` · ${open.author_profile.industry}` : ''}{open.author_profile.function ? ` · ${open.author_profile.function}` : ''}</div>
            </div>

            <div className="book-detail-body">
              <Section title="他最后怎么选的">
                <p>{open.choice}</p>
                {open.reasons.length > 0 && (
                  <ul className="bd-reasons">
                    {open.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                )}
              </Section>

              {open.case_profile && (
                <Section title="他的坐标（脱敏示意）">
                  <div className="bd-coord">
                    <span>{open.case_profile.role_from} · {open.case_profile.industry_from}</span>
                    <span className="bd-arrow">→</span>
                    <span>{open.case_profile.industry_to}（{open.case_profile.salary_from} → {open.case_profile.salary_to}）</span>
                  </div>
                </Section>
              )}

              <Section title="后来怎么样">
                <p>{open.outcome.summary}</p>
                <div className="bd-tags">
                  <span className="bd-tag">{open.outcome.time_horizon}</span>
                  <span className="bd-tag bd-tag-sat">{SAT_LABEL[open.outcome.satisfaction] || open.outcome.satisfaction}</span>
                </div>
              </Section>

              <Section title="最值得避开的坑">
                <p className="bd-pitfall">{open.biggest_pitfall}</p>
              </Section>

              <Section title="如果重来一次">
                <p>{open.if_again}</p>
              </Section>

              <Section title="想对后来的人说">
                <p className="bd-advice">{open.advice_to_later_people}</p>
              </Section>
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
