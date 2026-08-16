// ============================================================
// 路书 · Agent 共享类型与 Trace 记录
// 3-Agent 数据流协作: Context → Retrieval → Journey
// 每个 Agent 输出结构化数据, 通过 Trace 记录整条链路
// ============================================================
import type { AppState, TraceEvent } from '../data/types'

export type AgentName = 'context' | 'retrieval' | 'journey'

export function pushTrace(state: AppState, agent: AgentName, node: string, data: Record<string, unknown>): AppState {
  const evt: TraceEvent = {
    agent,
    node,
    data,
    ts: new Date().toISOString()
  }
  return { ...state, trace: [...state.trace.slice(-60), evt] }
}

// ---------- Fixture 模式的"心智模型"说明 ----------
// 本项目为比赛 Demo, 采用 Fixture-first 实现:
// 所有 Agent 均为本地规则引擎, 可直接离线运行, 无 API Key 也可完整演示。
// 生产版可在此层接入 Live LLM 增强(Context 摘要润色 / 问路自然语言理解 / Skill 个性化 / AI 复盘),
// 且 Live 失败时必须 fallback 到 Fixture 结果。

export interface AgentContext {
  state: AppState
  setState: (updater: (s: AppState) => AppState) => void
}