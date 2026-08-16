import type { PageCtx } from './router'
import Header from '../components/Header'
import type { TraceEvent } from '../data/types'

const AGENT_LABEL = {
  context: 'Context & Theme Agent',
  retrieval: 'Experience Retrieval Agent',
  journey: 'Learning Journey Agent',
}
const AGENT_CLASS = {
  context: 'ctx',
  retrieval: 'ret',
  journey: 'jrn',
}

export default function AgentTracePage({ state, goTo }: PageCtx) {
  const traces = [...state.trace].reverse()

  return (
    <>
      <Header chapter="给评委看的" title="3-Agent 数据流协作" subtitle="本页面所有结果均由以下三个 Agent 协作生成。" icon="robot" />

      <div className="card-accent card mt-16">
        <div className="item-body" style={{ color: 'var(--ink)' }}>
          本项目采用 Fixture-first 实现，所有 Agent 为本地规则引擎，离线可完整演示。<br/>
          生产版可接入 Live LLM 增强（Context 润色 / 问路 NLU / Skill 个性化 / AI 复盘），失败时 fallback 到 Fixture。
        </div>
      </div>

      <div className="card">
        <div className="section-label">三个 Agent 的分工</div>
        <div className="mb-8">
          <div className="text-sm font-bold" style={{ color: 'var(--blue)' }}>① Context & Theme Agent</div>
          <div className="text-xs text-soft">理解你现在遇到的题：基本信息采集、Context 摘要、问题解析、缺口诊断、Profile 读取</div>
        </div>
        <div className="mb-8">
          <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>② Experience Retrieval Agent</div>
          <div className="text-xs text-soft">找到以前走过这道题的人：路书库检索、相似排序、坑匹配、source-grounded 对话、survivorship guard</div>
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: 'var(--green)' }}>③ Learning Journey Agent</div>
          <div className="text-xs text-soft">把经验变成你真正学会的能力：工作选择尺、未来分岔、学习路线、Skill、现实任务、复盘、成长图谱</div>
        </div>
      </div>

      <div className="section-label mt-16">Trace 记录（{traces.length} 条 · 最新在前）</div>
      {traces.length === 0 ? (
        <div className="card-soft text-sm text-faint">还没有 Trace。继续使用应用，Agent 协作记录会出现在这里。</div>
      ) : (
        <div className="trace-list">
          {traces.map((t, i) => (
            <TraceItem key={i} t={t} />
          ))}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-secondary btn-full" onClick={() => goTo('about')}>关于路书 →</button>
      </div>
    </>
  )
}

function TraceItem({ t }: { t: TraceEvent }) {
  const cls = AGENT_CLASS[t.agent]
  return (
    <div className={`trace-item ${cls}`}>
      <div className="trace-head">
        <div className="flex items-center gap-8">
          <span className={`trace-agent ${cls}`}>{AGENT_LABEL[t.agent]}</span>
          <span className="trace-node">→ {NODE_LABEL[t.node] || t.node}</span>
        </div>
        <span className="trace-time">{new Date(t.ts).toLocaleTimeString()}</span>
      </div>
      {Object.keys(t.data).length > 0 && (
        <div className="trace-data">{formatTraceData(t.data)}</div>
      )}
    </div>
  )
}

// 技术键名 → 中文标签（让评委页读起来像"人话"而非机器字段）
const KEY_LABEL: Record<string, string> = {
  raw: '原始输入', gaps: '缺口类型', gap_types: '缺口类型',
  peer_count: '相似前人数量', top: '主要考量', chatted: '是否已对话',
  figure: '参考人物', questions: '已确认问题数', formula_id: '方法编号',
  transfer_choice: '迁移选择', skill: '能力', step: '步骤',
  task_id: '任务编号', entry_id: '路书条目', reason: '入选理由',
  choice: '选择', pivot: '可转向程度', problem: '当前问题',
  audience: '人群', profile_summary: '画像摘要', node: '节点',
}

const keyLabel = (k: string) => (KEY_LABEL[k] ? KEY_LABEL[k] : k)

// 节点名 → 中文（覆盖英文 node）
const NODE_LABEL: Record<string, string> = {
  ask_diagnose: '问路·诊断', basic_profile_capture: '采集基本信息',
  current_problem_capture: '记录当前问题', not_alone_enter: '进入「你不是第一个」',
  library_entry_open: '打开路书库条目', historical_case_done: '查看历史人物案例',
  source_grounded_dialogue: '与前人对话（带来源）', formula_unlock: '解锁方法卡',
  ruler_generate: '生成工作选择尺', fork_simulate: '模拟未来分岔',
  offer_checklist_save: '保存 Offer 三问', skill_plan_generate: '生成学习路线',
  skill_step_complete: '完成能力步骤', task_accept: '接受现实任务',
  checkin_reflect: '打卡复盘', enter_dashboard: '进入我的下一程',
  roadbook_entry_generate: '生成我的路书',
}

// 值翻译：把英文代码/编号翻成可读中文
const GAP_LABEL: Record<string, string> = {
  knowledge_gap: '信息不足（还在靠猜补）',
  method_gap: '缺方法（凭感觉做）',
  experience_gap: '缺真实情境经验',
  validation_gap: '缺现实验证',
  skill_gap: '需要刻意练习',
}
const FIGURE_NAME: Record<string, string> = {
  luxun: '鲁迅', leijun: '雷军', rowling: 'JK罗琳',
  chushiye: '褚时健', kazuo: '稻盛和夫', sushi: '苏轼',
}
const CHOICE_LABEL: Record<string, string> = {
  work: '先工作', search: '再寻找一段时间',
}
// 编号前缀 → 中文前缀
const ID_PREFIX: Record<string, string> = {
  roadbook_entry_: '路书条目', formula_: '方法', skill_: '能力', task_: '任务',
  notable_: '名人', historical_: '历史人物',
}

function valueLabel(v: unknown): string {
  if (typeof v !== 'string') return String(v)
  if (GAP_LABEL[v]) return GAP_LABEL[v]
  if (CHOICE_LABEL[v]) return CHOICE_LABEL[v]
  // 历史人物 id：historical_luxun_001 / notable_leijun_001 → 鲁迅
  const figMatch = v.match(/(?:historical|notable)_([a-z]+)_\d+/)
  if (figMatch && FIGURE_NAME[figMatch[1]]) return FIGURE_NAME[figMatch[1]]
  // 编号前缀剥离：roadbook_entry_demo_001 → 路书条目 demo_001
  for (const [pre, zh] of Object.entries(ID_PREFIX)) {
    if (v.startsWith(pre)) return zh + ' ' + v.slice(pre.length)
  }
  return v
}

// 递归可读化：保留中文，避免 JSON.stringify 把中文转成 \uXXXX 乱码
function formatTraceData(data: Record<string, unknown>): string {
  const lines: string[] = []
  const walk = (val: unknown, indent: number) => {
    const pad = '  '.repeat(indent)
    if (Array.isArray(val)) {
      if (val.length === 0) { lines.push(`${pad}(空)`); return }
      val.forEach(item => walk(item, indent))
    } else if (val && typeof val === 'object') {
      Object.entries(val as Record<string, unknown>).forEach(([k, v]) => {
        if (v && typeof v === 'object') {
          lines.push(`${pad}${keyLabel(k)}:`)
          walk(v, indent + 1)
        } else {
          lines.push(`${pad}${keyLabel(k)}: ${valueLabel(v)}`)
        }
      })
    } else {
      lines.push(`${pad}${valueLabel(val)}`)
    }
  }
  walk(data, 0)
  return lines.join('\n')
}

