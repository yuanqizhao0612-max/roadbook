import { useState } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import { simulateFork } from '../agents/journeyAgent'
import type { ForkSimulation, AppState } from '../data/types'
import { pushTrace } from '../agents/base'
import Expand from '../components/Expand'
import { callLLM } from '../services/llm'

export default function ForkSimPage({ state, setState, goTo }: PageCtx) {
  const [choice, setChoice] = useState<'work' | 'search' | null>(null)
  const [sim, setSim] = useState<ForkSimulation | null>(null)
  const [aiNote, setAiNote] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  // V0.9.6：Offer 三问不是所有用户的必经之路——只有明确选了「要不要接 Offer」才走
  const hasOfferConcern = state.profile?.concerns.includes('要不要接 Offer') ?? false

  const runSim = async (c: 'work' | 'search') => {
    setChoice(c)
    const result = simulateFork(c, state.profile?.audience)
    setSim(result)
    setState(s => ({ ...s, forkResult: result }))
    // 真 AI 个性化增强（可选；失败则隐藏卡片，结构化时间线仍由 fixture 保稳）
    setAiLoading(true)
    setAiNote(null)
    const p = state.profile
    const sys = '你是路书 AI，专注"未来分岔"的个性化提示。基于用户画像和所选路径，用温和、克制、像前辈提醒的语气，给出一段 80 字内的个性化提示：点出这条路上最容易忽略的一件事，以及下一步最该留意的关键岔路。不要预测未来，不要替用户做决定。'
    const messages = [{
      role: 'user' as const,
      content: `用户画像：人群=${p?.audience || '未知'}，阶段=${p?.stage || '未知'}，行业=${p?.industry || '未知'}，职能=${p?.function || '未知'}，最关心=${p?.concerns?.join('、') || '未知'}，最看重=${p?.priorities?.join('、') || '未知'}。
所选路径：${c === 'work' ? '先工作' : '再寻找一段时间'}。
请基于以上内容，输出个性化提示。`
    }]
    const reply = await callLLM(sys, messages)
    setAiLoading(false)
    if (reply) setAiNote(reply)
  }

  const complete = () => {
    if (!sim) return
    setState((s): AppState => {
      let next: AppState = { ...s, forkResult: sim, evidence: { ...s.evidence, final_choice: choice || 'work' },
        growth: { ...s.growth, choices: [...s.growth.choices, { id: `choice_${Date.now()}`, label: sim.choice_name, ts: new Date().toISOString() }] } }
      next = pushTrace(next, 'journey', 'fork_simulate', { choice: choice, pivot: sim.pivotability.level })
      return next
    })
    goTo(hasOfferConcern ? 'offer_3q' : 'my_roadbook')
  }

  return (
    <>
      <Header chapter="第 9 章 · 如果这样选，未来可能怎么展开" title="未来分岔模拟" subtitle="不是预测未来，而是帮你看见「现在看不到的忽略项」。" icon="leaf" />

      {!sim && (
        <div className="card mt-16">
          <div className="item-title mb-16">你想模拟哪条路？</div>
          <div className="btn-row" style={{ flexDirection: 'column' }}>
            <button className="btn btn-primary" onClick={() => runSim('work')}>先工作 →</button>
            <button className="btn btn-secondary" onClick={() => runSim('search')}>再寻找一段时间 →</button>
          </div>
        </div>
      )}

      {sim && (
        <>
          <div className="card-accent card mt-16">
            <div className="item-title">{sim.choice_name} · 可能的展开</div>
          </div>

          <div className="card">
            <div className="timeline">
              {sim.nodes.map(n => (
                <div key={n.horizon} className="timeline-node">
                  <div className="timeline-label">{n.label}</div>
                  <div className="timeline-section-title text-green">最可能获得</div>
                  {n.gain.map((g, i) => <div key={i} className="timeline-text">✓ {g}</div>)}
                  <div className="timeline-section-title text-red mt-8">最容易忽略</div>
                  {n.ignore.map((g, i) => <div key={i} className="timeline-text">⚠ {g}</div>)}
                  <div className="timeline-text mt-8" style={{ color: 'var(--accent)' }}>
                    <strong>下一次关键岔路：</strong>{n.next_fork}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {aiLoading && (
            <div className="card card-ai-note">
              <div className="chat-loading"><span className="chat-loading-dot" /> AI 正在结合你的处境生成个性化提示…</div>
            </div>
          )}
          {aiNote && (
            <div className="card card-ai-note">
              <div className="section-label"><span className="badge badge-ai">AI 实时生成 · 个性化</span></div>
              <div className="item-body">{aiNote}</div>
            </div>
          )}

          <div className="card">
            <div className="section-label">路径可转向度：<span className={`badge ${sim.pivotability.level === '高' ? 'badge-user' : sim.pivotability.level === '中' ? 'badge-accent' : 'badge-pitfall'}`}>{sim.pivotability.level}</span></div>
            {sim.pivotability.reasons.map((r, i) => <div key={i} className="item-body">• {r}</div>)}
            <div className="card-soft mt-8" style={{ margin: '8px 0 0' }}>
              <div className="text-xs text-faint">{sim.pivotability.disclaimer}</div>
            </div>
          </div>

          <Expand title="如果条件变了（情景推演）">
            {Object.entries(sim.if_changed).map(([cond, result]) => (
              <div key={cond} className="mb-8">
                <div className="text-sm font-bold text-accent">{cond}</div>
                <div className="item-body">{result}</div>
              </div>
            ))}
          </Expand>

          <div className="btn-row mt-16">
            <button className="btn btn-secondary" onClick={() => setSim(null)}>换一条</button>
            <button className="btn btn-primary" onClick={complete}>{hasOfferConcern ? '接 Offer 前先确认 3 件事 →' : '生成我的第一本路书 →'}</button>
          </div>
        </>
      )}
    </>
  )
}

