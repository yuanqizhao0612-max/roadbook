// ============================================================
// 路书 · 应用 Store (localStorage 持久化)
// V0.4.2: 用户贡献路书可写入本地 Store → 路书库可再次检索 → 数据闭环
// ============================================================
import type { AppState, RoadbookEntry, LearningSkill, RealWorldTask, GrowthGraph, BasicProfile, LearningEvidence } from '../data/types'

const STORAGE_KEY = 'roadbook_v0.5.0_state'
const LIBRARY_KEY = 'roadbook_v0.5.0_library'

// ---------- 初始成长图谱 ----------
export function emptyGrowth(): GrowthGraph {
  return {
    user_id: 'demo_user',
    version: 'v0.9.9',
    profile: null,
    context_summary: null,
    life_themes: [],
    problems: [],
    methods_learned: [],
    skills: [],
    real_world_tasks: [],
    choices: [],
    outcomes: [],
    reflections: [],
    authored_roadbook_entries: [],
    read_roadbook_entries: [],
    capability_states: [],
    learning_plan: { generated: false, priority_skill_id: null, p1_skill_ids: [], p2_skill_ids: [], ts: '' }
  }
}

export function emptyEvidence(): LearningEvidence {
  return {
    life_theme: 'certainty_vs_exploration',
    selected_entry_id: '',
    entered_roadbook_library: false,
    method_questions_used: [],
    formula_understood: false,
    transfer_choice: '',
    transfer_method_used: [],
    transfer_pass: false,
    original_problem_reframe: '',
    first_choice: '',
    final_choice: '',
    capability_gaps: [],
    scenario_pre_priorities: [],
    scenario_post_priorities: [],
    checkin_created: false,
    mastery_before: 0,
    mastery_after: 0,
    ask_road_used: false,
    ask_question: '',
    ask_gap_types: [],
    ask_generated_skills: [],
    growth_graph_updated: false,
    contributed_roadbook: false
  }
}

export function initialState(): AppState {
  return {
    version: 'v0.9.9',
    page: 'cover',
    pageHistory: ['cover'],
    profile: null,
    context: null,
    selectedEntry: null,
    formulaUnlocked: false,
    transferDone: false,
    ruler: null,
    rulerConsent: false,
    forkResult: null,
    offerChecklistSaved: false,
    chatTurns: [],
    mentorSkipped: false,
    learningPlanGenerated: false,
    currentSkillId: null,
    currentTaskId: null,
    lastAsk: null,
    lastDistill: null,
    lastGrowthPath: null,
    evidence: emptyEvidence(),
    trace: [],
    growth: emptyGrowth(),
    demoUser: true,
    resetCount: 0
  }
}

// ---------- 读写 ----------
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    const base = initialState()
    return {
      ...base,
      ...parsed,
      evidence: { ...base.evidence, ...(parsed.evidence || {}) },
      growth: mergeGrowth(base.growth, parsed.growth)
    }
  } catch {
    return initialState()
  }
}

function mergeGrowth(base: GrowthGraph, incoming?: Partial<GrowthGraph>): GrowthGraph {
  if (!incoming) return base
  return {
    ...base,
    ...incoming,
    learning_plan: { ...base.learning_plan, ...(incoming.learning_plan || {}) }
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('[路书] state 保存失败', e)
  }
}

// ---------- 路书库 (独立 store：Fixture + 用户贡献) ----------
export function loadLibrary(): RoadbookEntry[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY)
    if (!raw) return []
    return JSON.parse(raw) as RoadbookEntry[]
  } catch {
    return []
  }
}

export function saveLibrary(entries: RoadbookEntry[]): void {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(entries))
  } catch (e) {
    console.warn('[路书] 路书库保存失败', e)
  }
}

// ---------- 工具函数 ----------
export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`
}

export function now(): string {
  return new Date().toISOString()
}

// ---------- Skill 状态更新 ----------
export function upsertSkill(growth: GrowthGraph, skill: LearningSkill): GrowthGraph {
  const idx = growth.skills.findIndex(s => s.skill_id === skill.skill_id)
  const skills = [...growth.skills]
  if (idx >= 0) skills[idx] = skill
  else skills.push(skill)
  return { ...growth, skills }
}

export function upsertTask(growth: GrowthGraph, task: RealWorldTask): GrowthGraph {
  const idx = growth.real_world_tasks.findIndex(t => t.task_id === task.task_id)
  const tasks = [...growth.real_world_tasks]
  if (idx >= 0) tasks[idx] = task
  else tasks.push(task)
  return { ...growth, real_world_tasks: tasks }
}

export function updateProfile(state: AppState, profile: BasicProfile): AppState {
  return {
    ...state,
    profile,
    growth: { ...state.growth, profile }
  }
}