import { useState, useEffect } from 'react'
import type { PageCtx } from './router'
import Icon from '../components/Icon'
import type { OrdinaryCase, ChatTurn, CaseProfile, BasicProfile, SourceRef } from '../data/types'
import { getPeerCases, getLookbackCases, getHistoricalCases, findCaseById, groundedReply, matchCasesWithLLM, type RankedCase } from '../agents/retrievalAgent'
import { pushTrace } from '../agents/base'
import { callLLM, llmEnabled, type LlmMsg } from '../services/llm'

function horizonLabel(h: string): string {
  return ({
    '18_months': '18 个月后低风险切换',
    '3_months': '3 个月内找到更匹配',
    '12_months': '用 1 年业余时间转向',
    '5_years': '5 年后回头看',
    '15_months': '用 1 年试水再走',
    '6_months': '半年后放下执念',
    '14_months': '14 个月后跳行业',
    historical: '跨时代的参照'
  } as Record<string, string>)[h] || h
}

const SATISFACTION_MAP: Record<string, { label: string; color: string }> = {
  satisfied: { label: '总体满意', color: 'var(--green)' },
  unsatisfied: { label: '不太满意', color: 'var(--red)' },
  mixed: { label: '有得有失', color: 'var(--accent)' }
}

// 「与前人聊聊」真人化身的固定开场白（同时作为 LLM 对话的首条 assistant 上下文）
const MENTOR_INTRO = '你好。关于这段经历，我能确认的是公开资料记载的部分。你问吧——如果资料没有记载，我会直说。'

// 基于选中案例的公开事实，构建"来源约束"系统提示词：只回答资料支撑的内容，禁止编造
function buildMentorSystem(c: OrdinaryCase): string {
  const src = (c.sources || []).map(s => `${s.title}（${s.publisher_or_author}）`).join('；') || '（暂无公开来源记录）'
  return `你是"路书"里的一页真实前人经验的数字化身，代表【${c.who}】。
以下是从公开资料中可确认的事实，你只能基于这些来回答，禁止编造、禁止虚构任何细节：

- 当时遇到的题：${c.why_similar}
- TA 的选择：${c.one_line_choice}
- 后来怎样：${c.outcome}
- 给后来的人：${c.advice}
- 公开来源：${src}

对话规则：
1. 只回答公开资料能支撑的内容；资料没写到的，要直说"这部分公开资料没写"。
2. 语气像一位温和、谦逊的前辈在和晚辈聊天，不要说教、不要替对方做决定。
3. 每次回答不超过 120 字。
4. 你不是算命先生，不预测未来，只分享已知的经历与判断方法。`
}

export default function CasePages({ state, setState, goTo, back }: PageCtx) {
  const page = state.page

  if (page === 'peer_cases') {
    const nextLabel = state.profile?.audience === 'new_grad'
      ? '再看看走过几年的人 →'
      : state.profile?.audience === 'mid_career' ? '看看这阶段过来人的经验 →' : '看看这阶段过来人的经验 →'
    return <CaseListPage ctx={{ state, setState, goTo, back }} chapter="先看看和你差不多的人" kind="peer" nextPage="lookback_case" nextLabel={nextLabel} />
  }
  if (page === 'lookback_case') {
    const chapter = state.profile?.audience === 'new_grad'
      ? '再看看走过以后的人'
      : state.profile?.audience === 'mid_career' ? '30+ 过来人的真实转弯' : '40+ 过来人的人生下半场'
    return <CaseListPage ctx={{ state, setState, goTo, back }} chapter={chapter} kind="lookback" nextPage="historical_case" nextLabel="看看历史与当代名人也经历过 →" />
  }
  if (page === 'historical_case') {
    return <HistoricalCasePage ctx={{ state, setState, goTo, back }} />
  }
  return null
}

interface CtxProps { ctx: PageCtx }

function CaseListPage({ ctx, chapter, kind, nextPage, nextLabel }: { ctx: PageCtx; chapter: string; kind: 'peer' | 'lookback'; nextPage: any; nextLabel: string }) {
  const { state, setState, goTo } = ctx
  const [selected, setSelected] = useState<string | null>(null)
  const ruleCases = kind === 'peer' ? getPeerCases(state) : getLookbackCases(state)
  const [cases, setCases] = useState<RankedCase[]>(ruleCases)
  const [matching, setMatching] = useState(false)

  useEffect(() => {
    let alive = true
    let guard: ReturnType<typeof setTimeout> | undefined
    if (llmEnabled()) {
      setMatching(true)
      guard = setTimeout(() => { if (alive) setMatching(false) }, 10000)
      matchCasesWithLLM(state, kind, 4)
        .then(r => { if (alive) { setCases(r); setMatching(false) } })
        .catch(() => { if (alive) setMatching(false) })
        .finally(() => clearTimeout(guard))
    }
    return () => { alive = false; clearTimeout(guard) }
  }, [])

  const openDetail = (c: OrdinaryCase) => {
    setSelected(c.id)
    setState(s => ({
      ...s,
      selectedEntry: c.id,
      evidence: { ...s.evidence, selected_entry_id: c.id },
      growth: { ...s.growth, read_roadbook_entries: [...new Set([...s.growth.read_roadbook_entries, c.id])] }
    }))
  }

  const allWeak = cases.length === 0 || cases.every(x => x.weak)

  return (
    <>
      <div className="page-header">
        <div className="page-chapter">{chapter}</div>
        <div className="page-title">这页路书，有人也写过</div>
      </div>

      {matching && (
        <div className="match-weak-note">AI 正在为你匹配更相关的过来人…</div>
      )}
      {allWeak && !matching && (
        <div className="match-weak-note">
          暂时没有完全踩过这道题的过来人。下面这几页是按你的处境排的「最接近」，仅供参考——
          如果都不贴切，也欢迎你写一页，给后来的人留条线索。
        </div>
      )}

      <div className="mt-8">
        {cases.map(({ case: c, shared, reason }) => (
          <div key={c.id} className="card" onClick={() => openDetail(c)} style={{ cursor: 'pointer' }}>
            <div className="item-title">{c.title}</div>
            <div className="item-meta">
              {c.case_profile
                ? `${c.case_profile.role_from}·${c.case_profile.industry_from} → ${c.case_profile.industry_to}`
                : c.who}
            </div>
            <div className="item-body mb-8">「{c.one_line_choice}」</div>
            {(reason || shared.length > 0) && (
              <div className="case-why">为什么相关：{reason ? reason : `都涉及「${shared.join(' · ')}」`}</div>
            )}
            <div className="flex gap-8 items-center">
              <span className="badge badge-pitfall"><Icon name="info" size={13} className="inline-icon" /> {c.biggest_pitfall}</span>
              <span style={{ color: SATISFACTION_MAP[c.satisfaction].color, fontSize: 12, fontWeight: 600 }}>
                {SATISFACTION_MAP[c.satisfaction].label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selected && (() => {
        const c = findCaseById(selected)
        if (!c) return null
        return (
          <div style={{ marginTop: 20 }}>
            {c.case_profile && <CaseProfileCard p={c.case_profile} horizon={c.time_horizon} profile={state.profile} />}
            <div className="card-accent card">
              <div className="item-title">为什么和你有关</div>
              <div className="item-body">{c.why_similar}</div>
            </div>
            <div className="card">
              <div className="section-label">后来怎样</div>
              <div className="item-body">{c.outcome}</div>
            </div>
            <div className="card">
              <div className="section-label">如果重来，TA 会怎么做</div>
              <div className="item-body">{c.if_again}</div>
            </div>
            <div className="card-quote">
              <strong>给后来的人：</strong>{c.advice}
            </div>
            <div style={{ marginTop: 20 }}>
              <button className="btn btn-primary btn-full" onClick={() => goTo(nextPage)}>{nextLabel}</button>
            </div>
          </div>
        )
      })()}

      <div style={{ marginTop: 20 }}>
        <button className="btn btn-secondary btn-full" onClick={() => goTo(nextPage)}>{nextLabel}</button>
      </div>
    </>
  )
}

function HistoricalCasePage({ ctx }: CtxProps) {
  const { state, setState, goTo } = ctx
  const figures = getHistoricalCases(state)
  const [selectedId, setSelectedId] = useState<string>(figures[0]?.id || '')
  const [showChat, setShowChat] = useState(false)
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const c: OrdinaryCase | undefined = figures.find(f => f.id === selectedId) || figures[0]
  if (!c) return null

  const selectFigure = (id: string) => {
    setSelectedId(id)
    setShowChat(false)
    setTurns([])
    setLoading(false)
    setState(s => ({ ...s, selectedEntry: id }))
  }

  const sendQuestion = async () => {
    if (!input.trim() || turns.length >= 6 || loading) return
    const userTurn: ChatTurn = { role: 'user', text: input }
    // 组装对话历史（含固定开场白）+ 用户最新一句，交给真 LLM
    const historyMsgs: LlmMsg[] = turns.map(t => ({ role: t.role === 'user' ? 'user' : 'assistant', content: t.text }))
    const messages: LlmMsg[] = [
      { role: 'assistant', content: MENTOR_INTRO },
      ...historyMsgs,
      { role: 'user', content: input }
    ]
    setLoading(true)
    const reply = await callLLM(buildMentorSystem(c), messages)
    setLoading(false)

    let turn: ChatTurn
    let nextState = state
    if (reply) {
      // 真 AI 回复（来源约束：仅限公开资料支撑）
      turn = { role: 'mentor', text: reply, source_chips: ['AI 实时生成'], answer_mode: 'grounded' }
      nextState = pushTrace(state, 'retrieval', 'ai_realtime_reply', { figure: c.id, question: input.slice(0, 40) })
    } else {
      // 兜底：本地 fixture 规则回答（未配置网关 / 调用失败 / 超时）
      const r = groundedReply(state, input)
      turn = r.turn
      nextState = r.state
    }
    setState(() => nextState)
    setTurns(prev => [...prev, userTurn, turn])
    setInput('')
  }

  const finishHistorical = () => {
    setState(s => pushTrace(s, 'retrieval', 'historical_case_done', { figure: c.id, chatted: turns.length > 0 }))
    // V0.9.2：名人页作为主流程「提炼前」的跨时代参照——看完名人后回主流程进行精华提炼。
    // 工作尺等深度方法链保留为次级入口（method_use 仍可达）。
    goTo('insight_distill')
  }

  const goDeeper = () => {
    setState(s => pushTrace(s, 'retrieval', 'historical_case_to_method', { figure: c.id }))
    goTo('method_use')
  }

  return (
    <>
      <div className="page-header">
        <div className="page-chapter">历史与当代名人，也走过类似的路口</div>
        <div className="page-title">这页路书，借他们的光</div>
      </div>

      {/* 名人切换（按人群） */}
      <div className="figure-tabs">
        {figures.map(f => (
          <button key={f.id} className={`figure-tab ${f.id === selectedId ? 'active' : ''}`} onClick={() => selectFigure(f.id)}>
            {f.who.split('，')[0]}
          </button>
        ))}
      </div>

      <div className="card mt-16 card-accent">
        <div className="item-title" style={{ fontSize: 18 }}>{c.title}</div>
        <div className="item-meta">{c.who}</div>
      </div>

      <div className="card">
        <div className="section-label">TA 当时遇到的题</div>
        <div className="item-body">{c.why_similar}</div>
      </div>

      <div className="card">
        <div className="section-label">TA 的选择</div>
        <div className="item-body mb-8">{c.one_line_choice}</div>
        <div className="section-label">后来怎样</div>
        <div className="item-body">{c.outcome}</div>
      </div>

      <div className="card-quote">
        <div className="section-label" style={{ color: 'var(--accent)' }}>这页路书想留给你的</div>
        {c.advice}
      </div>

      {/* 来源（必须含来源、不虚构） */}
      {c.sources && c.sources.length > 0 && (
        <SourceList sources={c.sources} />
      )}

      <div className="card-soft">
        <div className="text-sm text-soft">
          <Icon name="info" size={14} className="inline-icon" /> 注意：名人的结果是多年后的，<strong>不代表当年每一步都最优</strong>。<br/>
          路书只提炼「判断方法」，不会把 TA 的成功反推成"换方向=成功"。
        </div>
      </div>

      {/* 与前人聊聊 */}
      {!showChat ? (
        <div className="card mt-16" style={{ textAlign: 'center' }}>
          <div className="item-title">想和这页路书聊聊吗？</div>
          <div className="item-body mb-16">最多聊 2-3 轮，TA 只会回答公开资料能支撑的部分。</div>
          <div className="btn-row">
            <button className="btn btn-secondary" onClick={finishHistorical}>跳过，去提炼精华</button>
            <button className="btn btn-primary" onClick={() => setShowChat(true)}>聊聊看</button>
          </div>
        </div>
      ) : (
        <div className="card mt-16">
          <div className="section-label">与{c.who.split('，')[0]}聊聊（可选）</div>
          <div className="chat-bubble mentor">
            你好。关于这段经历，我能确认的是公开资料记载的部分。你问吧——如果资料没有记载，我会直说。
            {c.sources && <div className="source-chip">{c.sources[0].publisher_or_author}</div>}
          </div>
          {turns.map((t, i) => (
            <div key={i} className={`chat-bubble ${t.role}`}>
              {t.text}
              {t.source_chips && <div className="source-chip">{t.source_chips[0]}</div>}
            </div>
          ))}
          {turns.length >= 6 && (
            <div className="card-soft text-sm text-faint">已经聊了几轮了。继续往下翻，看看这页路书怎么变成你能用的方法。</div>
          )}
          {loading && (
            <div className="chat-loading">
              <span className="chat-loading-dot" /> 正在向前人请教…
            </div>
          )}
          <div className="form-group mt-16">
            <input className="form-input" placeholder="比如：你当时怕不怕选错？" value={input} disabled={loading} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && sendQuestion()} />
          </div>
          <div className="btn-row">
            <button className="btn btn-sm btn-secondary" onClick={finishHistorical}>聊完了，去提炼精华 →</button>
            <button className="btn btn-sm btn-primary" onClick={sendQuestion} disabled={turns.length >= 6 || loading}>问一句</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button className="btn btn-primary btn-full" onClick={finishHistorical}>让馆员提炼这本路书的精华 →</button>
      </div>

      {/* 次级深度入口：工作尺方法链（保留原第6章→第7章链路） */}
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-ghost btn-full" onClick={goDeeper}>
          还想学一套判断方法（工作选择尺）→
        </button>
      </div>
    </>
  )
}

function SourceList({ sources }: { sources: SourceRef[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card">
      <button className="section-label link-btn" onClick={() => setOpen(o => !o)} style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
        <span><Icon name="books" size={15} className="inline-icon" /> 公开来源（{sources.length}）</span>
        <span>{open ? '收起' : '展开'}</span>
      </button>
      {open && (
        <div className="mt-8">
          {sources.map(s => (
            <div key={s.source_id} className="source-item">
              <div className="source-title">{s.title}</div>
              <div className="source-meta">{s.publisher_or_author} · {s.date} · {s.source_type === 'primary' ? '一手来源' : '公开二手整理'}</div>
              <div className="source-claims">{s.supported_claims.join('；')}</div>
            </div>
          ))}
          <div className="coord-disclaimer">引用均来自公开出版/史料，路书不做任何虚构揣测。</div>
        </div>
      )}
    </div>
  )
}

// 计算"按我的处境对照"：用户填了行业/职能，就高亮最相关段落
function computeMatch(p: CaseProfile, profile: BasicProfile | null) {
  const matchedIndustry = !!profile?.industry && (p.match_industries || []).includes(profile.industry)
  const matchedFunction = !!profile?.function && (p.match_functions || []).includes(profile.function)
  const caresSwitch = !!profile?.concerns?.includes('该不该转行/换方向') || !!profile?.concerns?.includes('要不要二次转型')
  const hasDiff = !!p.industry_diff_note && !p.industry_diff_note.startsWith('不属')
  const relevant = matchedIndustry || matchedFunction || caresSwitch
  const hlSwitch = relevant
  const hlDiff = relevant && hasDiff && (matchedFunction || caresSwitch)
  const hlWhy = relevant && matchedIndustry
  const focus: string[] = []
  if (hlSwitch) focus.push('换个方向，具体换了什么（不是泛泛"换行业"，而是换职能里的哪一层 + 哪个行业）')
  if (hlDiff) focus.push('同一岗位在不同行业的区别（你正纠结的事，这里讲透了）')
  if (hlWhy) focus.push('为什么这个行业更匹配 TA（对照你想去的方向）')
  return { relevant, hlSwitch, hlDiff, hlWhy, focus, matchedIndustry, matchedFunction }
}

function CaseProfileCard({ p, horizon, profile }: { p: CaseProfile; horizon: string; profile: BasicProfile | null }) {
  const showDiff = p.industry_diff_note && !p.industry_diff_note.startsWith('不属')
  const m = computeMatch(p, profile)
  return (
    <div className="coord">
      {m.relevant && (
        <div className="coord-context">
          <div className="ctx-label"><Icon name="search" size={13} className="inline-icon" /> 按你的处境对照</div>
          <div className="ctx-situation">
            {profile?.stage || '你'} · {profile?.industry || '行业未填'} · {profile?.function || '岗位未填'}
            ，这张路书和你高度相关
          </div>
          {m.focus.length > 0 && (
            <ul className="ctx-focus">
              {m.focus.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          )}
        </div>
      )}

      <div className="coord-head">
        <div className="section-label">职业坐标（演示样本 · 示意）</div>
        <span className="badge badge-demo">示意</span>
      </div>
      <div className="coord-row">
        <div className="coord-k">学历</div>
        <div className="coord-v">{p.education}</div>
      </div>
      <div className="coord-row">
        <div className="coord-k">上家</div>
        <div className="coord-v">{p.company_from}（{p.company_type}）</div>
      </div>
      <div className="coord-row">
        <div className="coord-k">原岗位</div>
        <div className="coord-v">{p.role_from} · {p.industry_from}</div>
      </div>
      <div className="coord-row">
        <div className="coord-k">转去</div>
        <div className="coord-v">{p.role_to}<span className="arrow">→</span>{p.industry_to}</div>
      </div>
      <div className="coord-row coord-salary">
        <div className="coord-k">薪资</div>
        <div className="coord-v">{p.salary_from}<span className="arrow">→</span>{p.salary_to}</div>
      </div>
      <div className="coord-row">
        <div className="coord-k">关键</div>
        <div className="coord-v">{horizonLabel(horizon)}</div>
      </div>

      <div className={`coord-block ${m.hlSwitch ? 'hl' : ''}`}>
        <div className="coord-switch">
          <div className="section-label">换个方向，具体换了什么？</div>
          <div className="item-body">{p.switch_direction}</div>
        </div>
      </div>

      <div className={`coord-block ${m.hlWhy ? 'hl' : ''}`}>
        <div className="coord-note">
          <div className="section-label">为什么这个行业更匹配 TA？</div>
          {p.why_more_match}
        </div>
      </div>

      {showDiff && (
        <div className={`coord-block ${m.hlDiff ? 'hl' : ''}`}>
          <div className="coord-note">
            <div className="section-label">同一岗位，在不同行业的区别</div>
            {p.industry_diff_note}
          </div>
        </div>
      )}

      <div className="coord-disclaimer">坐标为示意性复合画像，非真实个人</div>
    </div>
  )
}
