// ============================================================
// 路书贡献流程 (V0.4.2)
// 写一页给后来的人 → 隐私清洗 → 写入本地 Store → 可被再次检索
// ============================================================
import type { AppState, RoadbookEntry, SourceMarker } from '../data/types'
import { loadLibrary, saveLibrary, uid, now } from '../store/store'
import { pushTrace } from './base'

export interface WriteEntryInput {
  stage: string
  age_range: string
  industry: string
  function: string
  problem: string
  choice: string
  reasons: string[]
  outcome_horizon: string
  outcome_summary: string
  outcome_satisfaction: string
  biggest_pitfall: string
  if_again: string
  advice: string
  visibility: 'anonymous_public' | 'private'
}

// ---------- 隐私清洗: 移除手机号/邮箱/精确地址/机密关键词 ----------
export function privacyScrub(text: string): string {
  let t = text
  t = t.replace(/1[3-9]\d{9}/g, '[手机号已移除]')
  t = t.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[邮箱已移除]')
  t = t.replace(/(\d{3,})栋?\s?\d{2,}号?/g, '[地址已移除]')
  t = t.replace(/(薪资|工资|月薪)[：: ]?[0-9kK万.]+/g, '$1[已省略]')
  return t.trim()
}

// ---------- 结构化生成条目 + 入库 ----------
export function submitEntry(state: AppState, input: WriteEntryInput): { state: AppState; entry: RoadbookEntry } {
  const marker: SourceMarker = 'user_contributed_local'
  const entry: RoadbookEntry = {
    entry_id: uid('roadbook_entry'),
    visibility: input.visibility,
    source_marker: marker,
    author_profile: {
      stage: input.stage,
      age_range: input.age_range,
      industry: input.industry,
      function: input.function
    },
    problem: { raw: privacyScrub(input.problem), tags: [] },
    choice: input.choice,
    reasons: input.reasons.map(r => privacyScrub(r)).slice(0, 3),
    outcome: {
      time_horizon: input.outcome_horizon,
      summary: privacyScrub(input.outcome_summary),
      satisfaction: input.outcome_satisfaction
    },
    biggest_pitfall: privacyScrub(input.biggest_pitfall),
    if_again: privacyScrub(input.if_again),
    advice_to_later_people: privacyScrub(input.advice),
    created_at: now(),
    source_type: 'user_contributed'
  }

  const lib = loadLibrary()
  saveLibrary([...lib, entry])

  const growth = {
    ...state.growth,
    authored_roadbook_entries: [...state.growth.authored_roadbook_entries, entry.entry_id]
  }
  const next = pushTrace({ ...state, growth }, 'journey', 'roadbook_entry_generate', {
    entry_id: entry.entry_id,
    visibility: entry.visibility,
    problem: input.problem.slice(0, 30)
  })
  return { state: next, entry }
}