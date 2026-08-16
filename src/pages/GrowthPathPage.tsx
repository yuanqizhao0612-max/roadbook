import { useState, useEffect, useRef, useCallback } from 'react'
import type { PageCtx } from './router'
import Header from '../components/Header'
import { callLLM } from '../services/llm'
import { getDecisionCards } from '../store/decisionCards'
import { pushTrace } from '../agents/base'
import { allFixtureCases } from '../data/fixtureCases'
import { AUDIENCE_META } from '../data/types'
import type { GrowthPathResult, OrdinaryCase } from '../data/types'

// ============================================================
// 路书 · 人生路径指引页（V0.9 新增 · 打破"看书循环"的教育闭环）
// 产品初衷：让用户不只是"看别人的故事"，还能得到"自己下一步该往哪走"的指引。
// 这是产品从"故事库"升级为"AI+教育"的关键一跳：
//   看别人的路 → 收藏认知 → 对照自己的处境 → 得到明确的下一步行动 + 该补的能力方向
// V0.9.3：输入上一页 InsightDistill 结果，职责分离——上一页讲"TA(过来人)"，本页只讲"你(用户)"。
// V0.9.9:2：LLM 输出不可信，parse 后必须归一化（类型强校验），
//   任何字段类型不对都 throw → 走错误态，绝不带病渲染（根治"梳理后白屏"）。
// ============================================================

// 安全类型工具：确保是数组；不是就返回 []
function asArr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

// 安全字符串：确保是 string；不是就返回 fallback（默认 ''）
function asStr(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

/**
 * 归一化 LLM 的原始输出为安全可渲染的 GrowthPathResult。
 * 关键：只保留类型正确的字段；数组字段里的每一项也逐字段清洗，
 * 绝不允许对象/字符串混进 .map() 渲染路径（那是白屏的根源）。
 */
function normalizeGrowthPath(raw: unknown): GrowthPathResult {
  if (!raw || typeof raw !== 'object') throw new Error('not an object')
  const r = raw as Record<string, unknown>

  const next_steps = asArr<Record<string, unknown>>(r.next_steps)
    .map(ns => ({
      title: asStr(ns?.title, ''),
      why: asStr(ns?.why, ''),
      how: asStr(ns?.how, ''),
      time_cost: asStr(ns?.time_cost, ''),
    }))
    .filter(s => s.title)
  const skills_to_build = asArr<Record<string, unknown>>(r.skills_to_build)
    .map(sg => ({
      skill: asStr(sg?.skill, ''),
      reason: asStr(sg?.reason, ''),
      how_start: asStr(sg?.how_start, ''),
      reference_cases: asArr(sg?.reference_cases).map(c => asStr(c)).filter(Boolean),
    }))
    .filter(s => s.skill)
  const seven_day_plan = asArr<Record<string, unknown>>(r.seven_day_plan)
    .map(step => ({
      day: asStr(step?.day, ''),
      action: asStr(step?.action, ''),
      note: asStr(step?.note, ''),
    }))
    .filter(s => s.action)

  // 核心两字段缺一不可，否则没有可看的内容 → 按错误处理
  if (next_steps.length === 0 && skills_to_build.length === 0) {
    throw new Error('no actionable fields')
  }

  // 兜底：漏 seven_day_plan 时用 next_steps 合成（保持原 V0.9.3 行为）
  let sdp = seven_day_plan
  if (sdp.length === 0 && next_steps.length > 0) {
    sdp = next_steps.map((ns, i) => ({
      day: `Day ${i + 1}`,
      action: ns.title,
      note: ns.how,
    }))
  }

  return {
    situation_summary: asStr(r.situation_summary),
    next_steps,
    skills_to_build,
    one_month_plan: asStr(r.one_month_plan),
    seven_day_plan: sdp,
    mindset_anchor: asStr(r.mindset_anchor),
  }
}

const PATH_SYSTEM = `你是"路书"人生图书馆的馆员，一位智慧的朋友。用户刚刚读完几个过来人的故事。现在 TA 想知道：我接下来具体该怎么做 / 我能从这些人身上学到什么。

模式说明：
- 如果用户写下了困惑（定制模式）：你结合 TA 的困惑 + 读过的书，给出一份贴合 TA 处境的个性化路径。
- 如果用户没有写困惑（学习模式）：TA 是专程来学习这些过来人的经验的——请从 TA 读过的书 / 收藏的认知卡里，提炼这些过来人值得学习的经验、方法、特质，以及他们遇到困境时是如何思考的，转化为 TA 本周就能借鉴的行动。
- 无论哪种模式，seven_day_plan 的每条 action 都必须直接取材于用户"读过的书"（写明书名/人物名），严禁万能模板。

你的职责边界（非常重要）：
- 你这一页只讲"用户本人接下来的行动"——具体动作、时间、能力、一周计划、一个月里程碑。
- 严禁重复、复述、改写上一页已经说过的任何观点。如果上一页说过"选工作前先确认三件事"，你绝不能再说一遍这句话或其同义改写。
- 上面所有页码以外的内容都不能引用上一页的结论作为你的输出，只能把相关的认知"翻译成用户本周能执行的动作"。

输出要求：
1. situation_summary：一句话描绘用户当下的处境（让 TA 感觉被理解）——这是现状扫描，不要给建议、不要复述上一页的解读。
2. next_steps：2-3 个具体的下一步动作。每个含 title（动作）/why（为什么有用，必须和上一页内容不重复）/how（怎么开始，具体到本周）/time_cost（需要多久）。要接地气，是普通人业余能做的。
3. skills_to_build：1-2 个值得补的能力方向。每个含 skill/reason/how_start/reference_cases（书名）。能力必须是真实世界里能练出来的，不是虚的"沟通力"。
4. one_month_plan：未来一个月，TA 可以做成的一件具体的事（这个月结束能拿出手的一个成果，要有可验证的完成标志）。
5. seven_day_plan：一个具体的 7 天行动计划，4-6 条（可含 Day 1–2 合并的条目）。每条含 day（如"Day 1"）/action（这几天具体做什么，直接可照着做）/note（为什么这么做）。
   - 最重要的要求：**每条 action 必须直接取材于用户"读过的书"**——比如"像《XXX》里的 TA 那样，先列出你纠结的三件事"，或"用《YYY》里学到的那个方法，做一遍 ZZZ"。必须在 action 里明确写出书名或人物名。
   - 禁止出现与读过的书无关的万能职业规划模板（如"梳理现状→找人聊→复盘"这种放谁身上都成立的废话）。
   - 如果用户没读过书，才允许给通用但具体的小行动。
6. mindset_anchor：一句在 TA 做决定时能拽住 TA 的话。

篇幅控制（重要）：
- action 一句话，不超过 40 字；note 一句话，不超过 25 字。
- next_steps 每条字段都要短：title ≤ 12 字，why ≤ 30 字，how ≤ 60 字。
- skills_to_build 的 how_start ≤ 50 字。
- 整体输出控制在 1000 字以内，宁可精炼，不要堆砌。

严格要求：
- 只输出 JSON，不要解释文字、不要 markdown 代码块。
- 所有内容必须口语化、接地气，像朋友聊天。
- 不要说教、不要空泛的"保持积极心态"。
- 七个字段都必须有值，数组字段不能为空数组。
- 中文输出。`

export default function GrowthPathPage({ state, setState, goTo }: PageCtx) {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<GrowthPathResult | null>(null)
  const [error, setError] = useState(false)

  const userProblem = state.evidence?.original_problem_reframe || ''
  const profile = state.profile
  const audience = profile?.audience ? AUDIENCE_META[profile.audience] : null
  const cards = getDecisionCards()
  const recentCards = cards.slice(-6)
  const displayCards = cards.slice(-5).reverse()

  // 用户主线读过的书（从 read_roadbook_entries 拿完整数据），这是 7 天计划必须引用的素材
  const readIds = state.growth.read_roadbook_entries || []
  const readBooks = readIds
    .map(id => allFixtureCases.find(ac => ac.id === id))
    .filter((c): c is OrdinaryCase => !!c)
    .slice(-3) // 最多拿最近 3 本
  const booksText = readBooks.length > 0
    ? readBooks.map(c => {
      const tl = (c.timeline_followups || []).slice(0, 3)
        .map(t => `· 选择${t.years_after}年后：${t.what_happened}（TA 的领悟：${t.what_i_realized}）`)
        .join('\n')
      const sk = (c.skills_learned || []).slice(0, 3)
        .map(s => `${s.skill_name}（${s.how_learned}）`)
        .join('、')
      return `《${c.title}》——${c.who}。TA 当时的选择：${c.one_line_choice}。结果：${c.outcome}。给后来人的话：${c.advice}${tl ? `\n时间轴：\n${tl}` : ''}${sk ? `\nTA 补过的能力：${sk}` : ''}`
    }).join('\n\n')
    : ''

  const cardsText = () => recentCards.length > 0
    ? recentCards.map((c, i) => `认知${i + 1}（来自《${c.source_case_title}》）：${c.insight}`).join('\n')
    : '（用户还没收藏任何认知卡）'

  const profileText = () => profile
    ? `人群：${audience?.label || profile.audience}（${profile.stage}）\n行业：${profile.industry}\n职能：${profile.function}\n关心：${profile.concerns.join('、')}\n最看重：${profile.priorities.join('、')}\n限制：${profile.limits.join('、')}`
    : '（用户未填写完整画像）'

  // V0.9.9：把「拼 prompt → 调 LLM → 解析」收敛成一个函数，
  // 首次加载(useEffect)与「再试一次」(retry)共用，避免 retry 里曾有的
  // setTimeout 僵尸代码把 loading 提前掐断、导致"一直没生成好"或空态白屏。
  // 新增 reqSeqRef 竞态保护：快速连点 retry 时，只有最后一次请求能写状态，
  // 彻底根治"多点几次结果错乱 / 白屏"。
  const aliveRef = useRef(true)
  const reqSeqRef = useRef(0)
  const [genKey, setGenKey] = useState(0)

  useEffect(() => {
    aliveRef.current = true
    return () => { aliveRef.current = false }
  }, [])

  const generatePath = useCallback(() => {
    // 有无困惑决定生成模式：有 → 定制化精准路径；无 → 学习模式（提炼过来人经验）
    const hasProblem = !!userProblem
    const hasMaterial = readBooks.length > 0 || recentCards.length > 0

    // 既无困惑、又没有任何读书/认知素材——没有可学习的对象，引导用户先逛书墙
    if (!hasProblem && !hasMaterial) {
      setLoading(false)
      setError(false)
      setResult(null)
      return
    }

    const seq = ++reqSeqRef.current
    const cText = cardsText()
    const pText = profileText()

    // 找到用户读过的书的技能数据，作为参考（保留原逻辑作为补充）
    const readCases = recentCards
      .map(c => allFixtureCases.find(ac => ac.id === c.source_case_id))
      .filter(Boolean)
    const skillsText = readCases.length > 0
      ? readCases.map(c => `${c!.who} 补过的能力：${(c!.skills_learned || []).map(s => s.skill_name).join('、') || '（无记录）'}`).join('\n')
      : ''

    // 上一页的精华提炼（必须避免重复的内容）
    const distill = state.lastDistill
    const lastPageText = distill
      ? `上一页馆员已经告诉用户这些内容（你严禁重复这些观点，只允许把它们"翻译成用户本周能执行的动作"）：
——认知翻转：${distill.mind_shifts.map(m => `${m.before} → ${m.after}`).join('；')}
——决策原则：${distill.decision_principles.join('；')}
——对用户处境的解读：${distill.for_your_situation}`
      : '（没有上一页内容，正常发挥）'

    const problemText = hasProblem
      ? `用户当下的困惑：${userProblem}`
      : `用户没有写下具体的困惑——这次 TA 是专程来学习这些过来人的经验的。请从 TA 读过的书（和收藏的认知卡）里，提炼这些过来人值得学习的经验、方法、特质，以及他们遇到困境时是怎么思考的，生成一份「学习路径」。situation_summary 请概括 TA 此刻的状态（正在向这些过来人学习什么）。`

    const userMsg = `${problemText}

用户的画像：
${pText}

${lastPageText}

用户从过来人故事里收藏的认知：
${cText}

用户这次读过的书（你的 7 天计划必须直接从这些书里取材，每天的行动都要能对应到某本书的具体情节或方法，严禁给出与这些书无关的万能模板）：
${booksText || '（用户没有读取记录）'}

这些过来人当时补过的能力（供你判断"这个用户接下来可能需要什么"）：
${skillsText || '（用户没有读过有技能记录的书）'}

请给出这一页（馆员路径指引）的输出：只讲用户本人的行动，与上一页内容完全不同。`

    setLoading(true)
    setError(false)
    setResult(null)
    callLLM(PATH_SYSTEM, [{ role: 'user', content: userMsg }], { timeoutMs: 30000, maxTokens: 2000 })
      .then(reply => {
        if (!aliveRef.current || seq !== reqSeqRef.current) return
        if (!reply) { setError(true); setLoading(false); return }
        try {
          const cleaned = reply.replace(/```json|```/g, '').trim()
          // 防 LLM 在 JSON 字符串值里输出裸换行导致解析截断
          const sanitized = cleaned.replace(/[\r\n]+/g, ' ')
          const parsed = normalizeGrowthPath(JSON.parse(sanitized))
          setResult(parsed)
        } catch {
          setError(true)
        }
        setLoading(false)
      })
      .catch(() => { if (aliveRef.current && seq === reqSeqRef.current) { setError(true); setLoading(false) } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genKey])

  // 首次进入自动生成
  useEffect(() => {
    generatePath()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genKey])

  const retry = () => {
    // 触发一次全新的生成（genKey 变化 → generatePath 重新执行）
    setGenKey(k => k + 1)
  }

  const proceed = () => {
    setState(s => pushTrace({ ...s, lastGrowthPath: result }, 'journey', 'growth_path_done', {
      has_result: !!result,
      next_steps_count: result?.next_steps?.length || 0,
      skills_count: result?.skills_to_build?.length || 0,
      seven_day_plan_count: result?.seven_day_plan?.length || 0,
    }))
    goTo('my_roadbook')
  }

  return (
    <>
      <Header
        chapter="你的下一步"
        title="馆员给你的路径指引"
        subtitle="别人的故事读完了，现在，回到你自己的路。"
        icon="compass"
      />

      {/* 用户处境回显 */}
      {userProblem && (
        <div className="card-soft mt-16">
          <div className="section-label">你最初写下的问题</div>
          <div className="item-body" style={{ color: 'var(--ink)', marginTop: 6, fontSize: 15, lineHeight: 1.6 }}>
            {userProblem}
          </div>
        </div>
      )}

      {/* 认知卡回显：你从这些书里带走的 */}
      {displayCards.length > 0 ? (
        <>
          <div className="section-label mt-16">你从这些书里带走的</div>
          <div className="card-soft" style={{ marginBottom: 8 }}>
            <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              这些是刚才那些过来人教会你的认知反转——它们会成为你做决定时的参考。
            </div>
          </div>
          {displayCards.map(card => (
            <div key={card.card_id} className="card card-accent" style={{ marginBottom: 12 }}>
              <div className="item-body" style={{ color: 'var(--ink)', fontSize: 15, lineHeight: 1.6 }}>
                {card.insight}
              </div>
              <div className="text-xs text-faint" style={{ marginTop: 8 }}>
                来自《{card.source_case_title}》
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="card-soft mt-16">
          <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            你可能没有收藏任何一张决策卡——没关系。<br/>
            有时候，光是看到"还有人也在这个问题上站过"，就已经是一种收获。
          </div>
        </div>
      )}

      {/* 加载态 */}
      {loading && (
        <div className="card-accent card mt-16">
          <div className="item-body" style={{ color: 'var(--accent-blue, #0071e3)', fontSize: 15, lineHeight: 1.7 }}>
            {userProblem
              ? <>馆员正在为你梳理<strong>下一步该怎么走</strong>……<br/></>
              : <>馆员正在从你读过的这些故事里，提炼<strong>值得你学习的东西</strong>……<br/></>}
            <span className="text-xs text-faint" style={{ marginTop: 8, display: 'block' }}>
              结合你读过的书、收藏的认知卡{userProblem ? '、你当下的处境' : ''}，给你一份能动手的路径——不是鸡汤。
            </span>
          </div>
        </div>
      )}

      {/* 错误态 */}
      {error && !loading && (
        <div className="card-soft mt-16">
          <div className="item-body" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            馆员这次没能完成路径梳理（网络或服务波动）。<br/>
            不过没关系——你读过的那些故事和收藏的认知卡，已经在你的脑子里了。
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-secondary btn-sm" onClick={retry}>再试一次</button>
          </div>
        </div>
      )}

      {/* 无困惑且无素材兜底：引导去书墙挑一本想学的 */}
      {!userProblem && !loading && !error && !result && (
        <div className="card-soft mt-16">
          <div className="item-body" style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            你还没有写下困惑，也还没有读过任何一本路书——馆员暂时没有素材可以为你生成学习路径。<br/>
            先去书墙挑一本想学的（名人、过来人样本都行），或者写下你眼下的困惑，会更精准。
          </div>
          <div className="btn-row" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-full" onClick={() => goTo('library_wall')}>
              去书墙挑一本 →
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => goTo('current_problem')}>
              写下我的困惑
            </button>
          </div>
        </div>
      )}

      {/* 结果 */}
      {result && !loading && (
        <>
          {/* 1. 处境画像 */}
          {result.situation_summary && (
            <>
              <div className="section-label mt-16">你现在在哪</div>
              <div className="card-accent card">
                <div className="item-body" style={{ color: 'var(--ink)', fontSize: 15, lineHeight: 1.7 }}>
                  {result.situation_summary}
                </div>
              </div>
            </>
          )}

          {/* 2. 下一步动作 */}
          {result.next_steps && result.next_steps.length > 0 && (
            <>
              <div className="section-label mt-16">接下来可以做的几件事</div>
              <div className="card-soft" style={{ marginBottom: 8 }}>
                <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  不是"你应该怎样"，而是"你本周就能开始做什么"。
                </div>
              </div>
              {result.next_steps.map((step, i) => (
                <div key={i} className="card" style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{
                      flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
                      background: 'var(--accent-blue, #0071e3)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 600,
                    }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div className="item-title" style={{ fontSize: 15 }}>{step.title}</div>
                      <div className="item-body" style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6, marginTop: 6 }}>
                        {step.why}
                      </div>
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                        <div className="text-xs" style={{ color: 'var(--accent-blue, #0071e3)', fontWeight: 600 }}>怎么开始</div>
                        <div className="item-body" style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.6, marginTop: 4 }}>
                          {step.how}
                        </div>
                      </div>
                      <div className="text-xs text-faint" style={{ marginTop: 8 }}>
                        大概需要：{step.time_cost}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* 2.5 七天行动计划（V0.9.3） */}
          {result.seven_day_plan && result.seven_day_plan.length > 0 && (
            <>
              <div className="section-label mt-16">先做这一周</div>
              <div className="card-soft" style={{ marginBottom: 8 }}>
                <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  人到迷茫的时候，最缺的不是方向，是"今天能动手的事"。这 7 天照着做就行。
                </div>
              </div>
              {result.seven_day_plan.map((step, i) => (
                <div key={i} className="card" style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span className="badge badge-accent" style={{ flexShrink: 0, minWidth: 62 }}>{step.day}</span>
                    <div style={{ flex: 1 }}>
                      <div className="item-body" style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.6, paddingTop: 2 }}>
                        {step.action}
                      </div>
                      {step.note && (
                        <div className="text-xs text-faint" style={{ marginTop: 4 }}>
                          {step.note}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-xs text-faint" style={{ marginTop: 4, marginBottom: 8 }}>
                这份 7 天计划下一页会带进你的第一本路书。
              </div>
            </>
          )}

          {/* 3. 该补的能力 */}
          {result.skills_to_build && result.skills_to_build.length > 0 && (
            <>
              <div className="section-label mt-16">如果深入，这几个能力值得补</div>
              <div className="card-soft" style={{ marginBottom: 8 }}>
                <div className="text-sm" style={{ color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  过来人在同一条路上补过的能力——不是课程清单，是真实世界里能练出来的。
                </div>
              </div>
              {result.skills_to_build.map((sg, i) => (
                <div key={i} className="card" style={{ marginBottom: 12 }}>
                  <div className="item-title" style={{ fontSize: 15 }}>{sg.skill}</div>
                  <div className="item-body" style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6, marginTop: 6 }}>
                    {sg.reason}
                  </div>
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
                    <div className="text-xs" style={{ color: 'var(--accent-blue, #0071e3)', fontWeight: 600 }}>怎么开始</div>
                    <div className="item-body" style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.6, marginTop: 4 }}>
                      {sg.how_start}
                    </div>
                  </div>
                  {sg.reference_cases && sg.reference_cases.length > 0 && (
                    <div className="text-xs text-faint" style={{ marginTop: 8 }}>
                      参考过来人：{sg.reference_cases.join('、')}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* 4. 一个月计划 */}
          {result.one_month_plan && (
            <>
              <div className="section-label mt-16">未来一个月，你可以做成一件事</div>
              <div className="card-accent card">
                <div className="item-body" style={{ color: 'var(--ink)', fontSize: 15, lineHeight: 1.7 }}>
                  {result.one_month_plan}
                </div>
              </div>
            </>
          )}

          {/* 5. 一句话锚点 */}
          {result.mindset_anchor && (
            <div className="card-accent card mt-16" style={{
              background: 'linear-gradient(135deg, rgba(0,113,227,0.06), rgba(0,113,227,0.02))',
            }}>
              <div className="item-body" style={{
                color: 'var(--ink)', fontSize: 16, lineHeight: 1.8,
                fontStyle: 'italic', textAlign: 'center',
              }}>
                "{result.mindset_anchor}"
              </div>
              <div className="text-xs text-faint" style={{ textAlign: 'center', marginTop: 8 }}>
                —— 馆员送你的一句话，做决定时可以拽住它
              </div>
            </div>
          )}
        </>
      )}

      {/* 底部 CTA（无困惑且无素材时由上方兜底卡引导，不重复展示） */}
      {(userProblem || loading || error || result) && (
        <div className="card-accent card mt-16">
          <div className="item-title" style={{ fontSize: 16 }}>这是馆员给你的路径，但它只是参考</div>
          <div className="item-body" style={{ color: 'var(--ink)', marginTop: 6, fontSize: 14, lineHeight: 1.6 }}>
            路还是要自己走。<br/>
            但你现在带过来的，不止是迷茫——还有过来人的故事、你自己收藏的认知、和这一份具体的下一步。
          </div>
        </div>
      )}

      {(userProblem || loading || error || result) && (
        <div style={{ marginTop: 16 }}>
          {result ? (
            <button className="btn btn-primary btn-full" onClick={proceed}>
              把这条路存进我的下一程 →
            </button>
          ) : (
            <button className="btn btn-primary btn-full" onClick={retry} disabled={loading}>
              {loading ? '馆员正在梳理……' : '路径还没生成好，再试一次 →'}
            </button>
          )}
        </div>
      )}

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-sm btn-full" onClick={() => goTo('write_entry_a')}>
          我也来写一页给后来人
        </button>
        <button className="btn btn-ghost btn-sm btn-full" onClick={() => goTo('library_wall')}>
          回书墙
        </button>
      </div>

      <div className="text-sm text-faint" style={{ marginTop: 14, textAlign: 'center', lineHeight: 1.6 }}>
        别人要跑好几个渠道才能攒到的答案，你在这里一站拿齐了。
      </div>
    </>
  )
}
