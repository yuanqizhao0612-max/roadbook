import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import { loadLibrary } from '../store/store'
import type { WriteEntryInput } from '../agents/contributionAgent'
import { submitEntry, privacyScrub } from '../agents/contributionAgent'

export default function WriteEntryPages({ state, setState, goTo }: PageCtx) {
  const [draft, setDraft] = useState<Partial<WriteEntryInput>>({
    stage: state.profile?.stage || '',
    industry: state.profile?.industry || '',
    function: state.profile?.function || '',
    visibility: 'anonymous_public',
  })
  const [submittedEntryId, setSubmittedEntryId] = useState<string | null>(null)
  const page = state.page

  const upd = (patch: Partial<WriteEntryInput>) => setDraft(prev => ({ ...prev, ...patch }))

  // 第 1 / 2 页：当时的你 + 问题 + 最后怎么选
  if (page === 'write_entry_a') {
    return (
      <>
        <Header chapter="续写我的一本 · 1/2" title="先说一下当时的你，和那件事" subtitle="不用真实姓名，描述就行。你写下的会成为图书馆里的一本新书。" icon="pen" />
        <div className="card mt-16">
          <div className="form-group">
            <div className="form-label">当时的年龄</div>
            <input className="form-input" placeholder="比如 23 岁" value={draft.age_range || ''} onChange={e => upd({ age_range: e.target.value })} />
          </div>
          <div className="form-group">
            <div className="form-label">当时的阶段</div>
            <input className="form-input" placeholder="比如 刚毕业 / 工作 2 年" value={draft.stage || ''} onChange={e => upd({ stage: e.target.value })} />
          </div>
          <div className="form-group">
            <div className="form-label">行业 / 岗位</div>
            <input className="form-input" placeholder="比如 互联网 / 市场岗" value={`${draft.industry || ''} / ${draft.function || ''}`} onChange={e => {
              const [ind, fn] = e.target.value.split('/')
              upd({ industry: (ind || '').trim(), function: (fn || '').trim() })
            }} />
          </div>
        </div>
        <div className="card">
          <div className="form-group">
            <div className="form-label">当时遇到的是什么问题？（一句话）</div>
            <textarea className="form-textarea" placeholder="比如：我拿到一个 Offer，但不确定要不要接……" value={draft.problem || ''} onChange={e => upd({ problem: e.target.value })} rows={3} />
          </div>
          <div className="form-group">
            <div className="form-label">你最后是怎么选的？</div>
            <textarea className="form-textarea" placeholder="比如：我最后接了这份 Offer，干了 18 个月……" value={draft.choice || ''} onChange={e => upd({ choice: e.target.value })} rows={3} />
          </div>
        </div>
        <BottomBar
          label="下一步 →"
          disabled={!draft.age_range || !draft.stage || !draft.problem || !draft.choice}
          onClick={() => goTo('write_entry_b')}
        />
      </>
    )
  }

  // 第 2 / 2 页：为什么 + 后来怎样 + 坑 + 重来 + 给后来的人 + 可见性
  if (page === 'write_entry_b') {
    return (
      <>
        <Header chapter="续写我的一本 · 2/2" title="为什么这么选，后来怎样" icon="pen" />
        <div className="card mt-16">
          <div className="form-group">
            <div className="form-label">当时为什么这么选？（每行一条，最多 3 条）</div>
            <textarea className="form-textarea" placeholder={"比如：\n1. 当时收入压力大\n2. 觉得大公司名气好"} value={(draft.reasons || []).join('\n')} onChange={e => upd({ reasons: e.target.value.split('\n').filter(Boolean).slice(0, 3) })} rows={4} />
          </div>
          <div className="form-group">
            <div className="form-label">过了多久看到结果？</div>
            <div className="chip-group">
              {['3 个月', '半年', '1 年', '2 年', '更久'].map(t => (
                <button key={t} className={`chip ${draft.outcome_horizon === t ? 'active' : ''}`} onClick={() => upd({ outcome_horizon: t })}>{t}</button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <div className="form-label">后来怎么样了？</div>
            <textarea className="form-textarea" placeholder="比如：成长很慢，后来跳槽了……" value={draft.outcome_summary || ''} onChange={e => upd({ outcome_summary: e.target.value })} rows={3} />
          </div>
          <div className="form-group">
            <div className="form-label">你现在怎么看？</div>
            <div className="chip-group">
              {['总体满意', '有得有失', '不太满意'].map(t => (
                <button key={t} className={`chip ${draft.outcome_satisfaction === t ? 'active' : ''}`} onClick={() => upd({ outcome_satisfaction: t })}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="form-group">
            <div className="form-label">你踩过最大的坑是什么？（给后来的人最有价值的一条）</div>
            <textarea className="form-textarea" placeholder="比如：只看了公司名气，没确认直属领导是谁……" value={draft.biggest_pitfall || ''} onChange={e => upd({ biggest_pitfall: e.target.value })} rows={3} />
          </div>
          <div className="form-group">
            <div className="form-label">如果重来一次，你会怎么做？</div>
            <textarea className="form-textarea" placeholder="比如：我会在入职前去问清楚……" value={draft.if_again || ''} onChange={e => upd({ if_again: e.target.value })} rows={3} />
          </div>
          <div className="form-group">
            <div className="form-label">给后来的人一句话</div>
            <textarea className="form-textarea" placeholder="比如：先确认三件事再签 Offer……" value={draft.advice || ''} onChange={e => upd({ advice: e.target.value })} rows={3} />
          </div>
        </div>

        <div className="card-accent card">
          <div className="section-label">这一页怎么被看到？</div>
          <div className="check-list">
            <button className={`check-item ${draft.visibility === 'anonymous_public' ? 'active' : ''}`} onClick={() => upd({ visibility: 'anonymous_public' })}>
              <span className="check-box">{draft.visibility === 'anonymous_public' ? '✓' : ''}</span>
              <div>
                <div className="font-bold">匿名公开</div>
                <div className="text-xs text-soft">后来的人能在路书库里检索到（不显示你的身份）</div>
              </div>
            </button>
            <button className={`check-item ${draft.visibility === 'private' ? 'active' : ''}`} onClick={() => upd({ visibility: 'private' })}>
              <span className="check-box">{draft.visibility === 'private' ? '✓' : ''}</span>
              <div>
                <div className="font-bold">仅自己可见</div>
                <div className="text-xs text-soft">不会进入路书库</div>
              </div>
            </button>
          </div>
          <div className="card-soft" style={{ marginTop: 12 }}>
            <div className="section-label">隐私清洗预览</div>
            <div className="text-xs text-soft">问题：{privacyScrub(draft.problem || '')}<br />结果：{privacyScrub(draft.outcome_summary || '')}</div>
          </div>
        </div>

        <BottomBar
          label="提交这一页 →"
          disabled={!draft.biggest_pitfall || !draft.advice || !draft.outcome_summary}
          onClick={() => {
            const result = submitEntry(state, draft as WriteEntryInput)
            setState(() => result.state)
            setSubmittedEntryId(result.entry.entry_id)
            goTo('submit_success')
          }}
        />
      </>
    )
  }

  // 提交成功（含预览）
  if (page === 'submit_success') {
    const userLib = loadLibrary()
    const entry = userLib.find(e => e.entry_id === submittedEntryId) || userLib[userLib.length - 1]
    return (
      <>
        <Header chapter="续写我的一本" title="你的这本书已经上架了" icon="sparkle" />
        <div className="card-accent card mt-16">
          <div className="item-title" style={{ fontSize: 18 }}>谢谢你。</div>
          <div className="item-body" style={{ color: 'var(--ink)' }}>
            你的这本书已经上架了——后来的人翻开图书馆时，会看到你走过的路。<br />
            <strong>这就是图书馆的意义：你留下的，会成为别人的参考。书架永远在变厚。</strong>
          </div>
        </div>
        {entry && (
          <div className="card">
            <div className="section-label">这一页的样子（后来的人会看到）</div>
            <div className="flex justify-between items-center mb-8">
              <div className="item-title">{entry.problem.raw}</div>
              <span className="badge badge-user">真人写下</span>
            </div>
            <div className="item-meta">{entry.author_profile.stage}{entry.author_profile.industry ? ` · ${entry.author_profile.industry}` : ''}</div>
            <div className="card-quote">
              <div className="section-label" style={{ color: 'var(--red)' }}>踩过最大的坑</div>
              {entry.biggest_pitfall}
            </div>
            <div className="card-quote"><strong>给后来的人：</strong>{entry.advice_to_later_people}</div>
          </div>
        )}
        <div className="btn-row mt-16">
          <button className="btn btn-secondary" onClick={() => goTo('library_home')}>回路书库</button>
          <button className="btn btn-primary" onClick={() => goTo('dashboard')}>回我的下一程</button>
        </div>
      </>
    )
  }

  return null
}

function BottomBar({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <div style={{ marginTop: 24 }}>
      <button className="btn btn-primary btn-full" onClick={onClick} disabled={!!disabled}>{label}</button>
    </div>
  )
}
