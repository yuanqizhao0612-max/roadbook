// ============================================================
// Agent 03 · Learning Journey Agent
// 中文角色: "把经验变成你真正学会的能力"
// 职责: 工作选择尺推断 / 未来分岔模拟 / 学习路线 / Skill / 现实任务 / 打卡复盘 / 成长图谱
// ============================================================
import type { AppState, DecisionRuler, ForkSimulation, LearningSkill, RealWorldTask,
  RulerLevel, SkillStepKey } from '../data/types'
import { rulerFactors, forkSimulationFixture, forkSimulationSearch, forkSimulationMid, forkSimulationSenior } from '../data/fixtureTools'
import { skillFirstJob, skillGrowthVsPractice, skillKeepOptionality, skillReportFocus } from '../data/fixtureSkills'
import { taskOfferManagerInterview } from '../data/fixtureSkills'
import { upsertSkill, upsertTask, uid, now } from '../store/store'
import { pushTrace } from './base'

// ---------- 工作选择尺: 条件交换题 → 偏好推断 (V0.4.1) ----------
export interface RulerAnswer {
  qid: string
  score: number  // 1(很难接受) ~ 7(完全可以)
}

export function generateDecisionRuler(answers: RulerAnswer[]): DecisionRuler {
  // 基础分: 由交换题得出
  const base: Record<string, number> = {
    salary: 3, industry: 3, role: 3, growth: 3,
    manager: 3, platform: 3, stability: 3, optionality: 3
  }
  for (const a of answers) {
    switch (a.qid) {
      case 'q1':
        base.industry += a.score >= 5 ? 2 : (a.score >= 3 ? 1 : -1)
        base.salary += a.score >= 5 ? -1 : (a.score <= 2 ? 1 : 0)
        break
      case 'q2':
        base.manager += a.score >= 5 ? 2 : (a.score >= 3 ? 1 : -1)
        base.platform += a.score >= 5 ? -1 : (a.score <= 2 ? 1 : 0)
        break
      case 'q3':
        base.salary += a.score >= 5 ? 2 : (a.score >= 3 ? 1 : -1)
        base.role += a.score >= 5 ? -1 : (a.score <= 2 ? 1 : 0)
        break
      case 'q4':
        base.stability += a.score >= 5 ? 2 : (a.score >= 3 ? 1 : -1)
        base.optionality += a.score >= 5 ? -1 : (a.score <= 2 ? 1 : 0)
        break
    }
  }
  const sorted = rulerFactors
    .map(f => ({ ...f, weight: base[f.key] }))
    .sort((a, b) => b.weight - a.weight)
  const factors: { key: string; label: string; level: RulerLevel; rank: number }[] = sorted.map((f, idx) => ({
    key: f.key,
    label: f.label,
    level: levelOf(f.weight, idx, sorted.length),
    rank: idx + 1
  }))
  return {
    factors,
    disclaimer: '这是基于你当前选择生成的个人偏好模型，不是科学测评，也不是客观职业评分。',
    bottomLine: {
      salary_floor: '',
      city_limit: '',
      work_hours: '',
      risk_limit: ''
    }
  }
}

function levelOf(weight: number, idx: number, total: number): RulerLevel {
  if (weight >= 5) return '高'
  if (weight >= 4 || idx < total / 2) return '中'
  return '低'
}

// ---------- Offer 分析 (V0.4.1: 你在交换什么) ----------
export function generateOfferAnalysis(ruler: DecisionRuler): { match_items: string[]; trades: string[]; worth_it: string; missing_info: string[] } {
  const high = ruler.factors.filter(f => f.level === '高')
  const low = ruler.factors.filter(f => f.level === '低')
  return {
    match_items: high.slice(0, 3).map(f => `重视「${f.label}」`),
    trades: low.slice(0, 2).map(f => `你正在用部分「${f.label}」，交换更高权重的方向与成长。`),
    worth_it: `按你刚才表达的偏好，收入的一定程度波动仍在你愿意接受的区间，前提是「${high[0]?.label}」真的兑现。`,
    missing_info: ['前 90 天具体负责什么？', '谁给你反馈？', '一年后通常能独立做到什么？']
  }
}

// ---------- 未来分岔模拟 (V0.5: 按 audience 切换情景) ----------
export function simulateFork(choice: 'work' | 'search', audience?: string): ForkSimulation {
  if (audience === 'mid_career') return forkSimulationMid
  if (audience === 'senior') return forkSimulationSenior
  return choice === 'work' ? forkSimulationFixture : forkSimulationSearch
}

// ---------- 学习路线生成 (V0.4) ----------
// V0.9.3：优先基于路径指引页的 skills_to_build 动态生成（真正贴合用户的处境与困惑），
// 没有则回退内置 fixture（深度方法链/未走主线的用户仍可工作）。
export function generateLearningPlan(state: AppState): AppState {
  const guidance = state.lastGrowthPath?.skills_to_build
  if (guidance && guidance.length > 0) {
    const newSkills: LearningSkill[] = guidance.map((g, i) => {
      const skillId = `plan_skill_${Date.now().toString(36)}_${i + 1}`
      const priority: 'P0' | 'P1' | 'P2' = i === 0 ? 'P0' : (i <= 2 ? 'P1' : 'P2')
      const refText = g.reference_cases && g.reference_cases.length > 0
        ? `这些过来人补过这个能力：${g.reference_cases.join('、')}。`
        : ''
      return {
        skill_id: skillId,
        title: g.skill,
        category: '来自馆员的路径建议',
        why_for_user: g.reason,
        learning_objective: `学完后，你能在现实里做到：${g.how_start.replace(/[。；]/g, '，').slice(0, 40)}，并且能判断这条路适不适合自己。`,
        done_means: g.how_start,
        capability_tags: ['路径建议'],
        priority,
        estimated_minutes: 30,
        steps_data: {
          why: { title: '为什么先补这个', body: g.reason },
          experience_case: { title: '前人走过的路', body: `${refText}TA 们也是在你现在的处境里，先把"${g.skill}"补起来，后面的路才走顺了。` },
          method: { title: '怎么开始', body: g.how_start },
          boundary: { title: '适用边界', body: '这套练法对应你当下的问题。等处境变了、问题换了，方法也要跟着换，不要硬套。' },
          transfer_practice: { title: '换你的场景试试', body: `在你自己现在的处境里，找一件这周就能做的小事，用"${g.skill}"的思路试一次，看哪里卡住。` },
          apply_to_self: { title: '用在你的真实问题', body: `针对你写下的问题，用"${g.skill}"的方法写出一版你的做法。` },
          real_world_task: { title: '今天能做的一件小事', body: `从"${g.skill}"里挑最小的一步，今天完成它，并记下结果。` },
          reflection: { title: '回来复盘', body: '做完之后回答：我做了什么、它证明了什么、下一步是什么。路书会根据你的现实证据更新掌握度。' },
        },
        mastery: { status: 'not_started', progress: 0, evidence_count: 0 },
        source_problem_ids: [],
      }
    })
    const p0 = newSkills[0]
    const task: RealWorldTask = {
      task_id: uid('task'),
      skill_id: p0.skill_id,
      title: `这周完成「${p0.title}」的最小一步`,
      why: `这是馆员根据你的处境给的第一个现实动作。做完它，你就拿到了第一份"现实证据"，不再只是"看过别人的故事"。`,
      instruction: p0.done_means,
      expected_evidence: ['完成记录', '我的新判断'],
      due_window: '7_days',
      status: 'todo',
      user_record: { what_i_did: '', what_i_learned: '', what_changed: '', what_i_still_dont_know: '' },
      ai_reflection: ''
    }
    let next = state.growth
    for (const s of newSkills) next = upsertSkill(next, s)
    const growth = upsertTask(next, task)
    const withPlan = { ...state, growth, learningPlanGenerated: true }
    return pushTrace(withPlan, 'journey', 'skill_plan_from_guidance', {
      priority_skill_id: p0.skill_id,
      p1_skills: newSkills.filter(s => s.priority === 'P1').map(s => s.skill_id),
      real_world_task: task.task_id,
      source: 'growth_path_skills_to_build'
    })
  }

  // 回退：无路径指引时使用内置方案
  const p0: LearningSkill = { ...skillFirstJob, mastery: { status: 'in_progress', progress: 12, evidence_count: 0 } }
  const p1: LearningSkill[] = [skillGrowthVsPractice, skillKeepOptionality]
  const p2: LearningSkill[] = [skillReportFocus]
  let next = upsertSkill(state.growth, p0)
  for (const s of p1) next = upsertSkill(next, s)
  for (const s of p2) next = upsertSkill(next, s)
  const task: RealWorldTask = { ...taskOfferManagerInterview, task_id: uid('task') }
  const growth = upsertTask(next, task)
  const withPlan = { ...state, growth, learningPlanGenerated: true }
  return pushTrace(withPlan, 'journey', 'skill_plan_generate', {
    priority_skill_id: p0.skill_id,
    p1_skills: p1.map(s => s.skill_id),
    real_world_task: task.task_id
  })
}

// ---------- 从样本的 skills_learned 生成学习路线 (V0.5.1) ----------
// 把某条 OrdinaryCase 的 skills_learned 注入成 state.growth.skills
import type { SkillLearned } from '../data/types'

export function applyCaseSkillsToGrowth(state: AppState, skills: SkillLearned[], caseId: string): AppState {
  if (!skills || skills.length === 0) return state
  const newSkills: LearningSkill[] = skills.map((sl, i) => {
    const skillId = `case_${caseId}_skill_${i + 1}`
    return {
      skill_id: skillId,
      title: sl.skill_name,
      category: '来自前人的路书',
      why_for_user: sl.why_need,
      learning_objective: sl.what_can_do_after,
      done_means: sl.what_can_do_after,
      capability_tags: ['前人经验'],
      priority: i === 0 ? 'P0' : (i <= 2 ? 'P1' : 'P2'),
      estimated_minutes: 60,
      steps_data: {
        why: { title: '为什么需要学', body: sl.why_need },
        experience_case: { title: 'TA 的真实经历', body: `这是 ${caseId} 这位过来人在真实处境中学到的能力。` },
        method: { title: 'TA 怎么学的', body: sl.how_learned },
        boundary: { title: '适用边界', body: '这套方法来自一个具体的人的具体处境，你也需要结合自己的情况判断。' },
        transfer_practice: { title: '换你的场景试试', body: `想想你的处境里，哪里可以用同样的方法？` },
        apply_to_self: { title: '用在你的真实问题', body: sl.what_can_do_after },
        real_world_task: { title: '今天能做的一件小事', body: `用"${sl.skill_name}"的方法，今天做一件最小的事。` },
        reflection: { title: '回来复盘', body: '做完之后回来写下：我学到了什么？和我原来以为的有什么不同？' },
      },
      mastery: { status: 'not_started', progress: 0, evidence_count: 0 },
      source_problem_ids: [caseId],
    }
  })
  let next = state.growth
  for (const s of newSkills) next = upsertSkill(next, s)
  const withPlan = { ...state, growth: next, learningPlanGenerated: true }
  return pushTrace(withPlan, 'journey', 'case_skills_applied', {
    case_id: caseId,
    skill_count: newSkills.length,
    priority_skill_id: newSkills[0]?.skill_id,
  })
}

// ---------- Skill 进度更新 ----------
export function advanceSkillStep(state: AppState, skillId: string, step: SkillStepKey): AppState {
  const stepOrder: SkillStepKey[] = ['why', 'experience_case', 'method', 'boundary', 'transfer_practice', 'apply_to_self', 'real_world_task', 'reflection']
  const idx = stepOrder.indexOf(step)
  const progress = Math.min(100, Math.round(((idx + 1) / stepOrder.length) * 100))
  const skills = state.growth.skills.map(s =>
    s.skill_id === skillId
      ? { ...s, mastery: { ...s.mastery, status: progress >= 100 ? ('completed' as const) : ('in_progress' as const), progress } }
      : s
  )
  return { ...state, growth: { ...state.growth, skills } }
}

// ---------- 现实任务状态 ----------
export function setTaskStatus(state: AppState, taskId: string, status: RealWorldTask['status']): AppState {
  const tasks = state.growth.real_world_tasks.map(t => t.task_id === taskId ? { ...t, status } : t)
  return { ...state, growth: { ...state.growth, real_world_tasks: tasks } }
}

// ---------- 打卡复盘 (V0.4: 现实学习记录 → AI 复盘 → Mastery 更新) ----------
export interface CheckinInput {
  what_i_did: string
  what_i_learned: string
  what_changed: string
  what_i_still_dont_know: string
}

export function runCheckin(state: AppState, taskId: string, input: CheckinInput): AppState {
  const existing = state.growth.real_world_tasks.find(t => t.task_id === taskId)
  if (!existing) return state
  const masteryBefore = existing.mastery_before ?? 35
  const masteryAfter = Math.min(100, masteryBefore + 17)
  const skillId = existing.skill_id
  const tasks = state.growth.real_world_tasks.map(t => {
    if (t.task_id !== taskId) return t
    return {
      ...t,
      status: 'reviewed' as const,
      user_record: { ...input },
      ai_reflection: `你今天补上的不是"学习时长"，而是一条原本缺失的现实证据。"${input.what_i_learned || '你发现了以前不知道的信息'}" 正是这次任务的价值。`,
      mastery_before: masteryBefore,
      mastery_after: masteryAfter
    }
  })
  const skills = state.growth.skills.map(s =>
    s.skill_id === skillId
      ? { ...s, mastery: { status: 'in_progress' as const, progress: Math.max(s.mastery.progress, masteryAfter), evidence_count: s.mastery.evidence_count + 1 } }
      : s
  )
  let next: AppState = { ...state, growth: { ...state.growth, real_world_tasks: tasks, skills } }
  next = pushTrace(next, 'journey', 'checkin_reflect', {
    task_id: taskId,
    mastery_before: masteryBefore,
    mastery_after: masteryAfter,
    evidence: input.what_i_learned.slice(0, 30)
  })
  return next
}

// ---------- 成长图谱摘要 ----------
export function growthSnapshot(state: AppState) {
  const g = state.growth
  return {
    skills_done: g.skills.filter(s => s.mastery.status === 'completed').length,
    skills_in_progress: g.skills.filter(s => s.mastery.status === 'in_progress').length,
    tasks_done: g.real_world_tasks.filter(t => t.status === 'reviewed').length,
    tasks_doing: g.real_world_tasks.filter(t => t.status !== 'reviewed').length,
    methods: state.growth.methods_learned.length,
    entries_read: g.read_roadbook_entries.length,
    entries_written: g.authored_roadbook_entries.length
  }
}

// ---------- 问路 → 学习路线更新 (V0.4) ----------
export function applyAskToPlan(state: AppState, skillIds: string[], prioritySkillId: string, action: string): AppState {
  const pool: Record<string, LearningSkill> = {
    skill_first_job_value_001: skillFirstJob,
    skill_growth_vs_practice_002: skillGrowthVsPractice,
    skill_keep_optionality_003: skillKeepOptionality,
    skill_report_focus_004: skillReportFocus
  }
  let growth = state.growth
  for (const id of skillIds) {
    const s = pool[id]
    if (s && !growth.skills.find(x => x.skill_id === id)) {
      const personalized = { ...s, why_for_user: `来自你刚才的问题：「${state.lastAsk?.raw_question || '最近遇到的问题'}」。${s.why_for_user}` }
      growth = upsertSkill(growth, personalized)
    }
  }
  const next = pushTrace(
    { ...state, growth },
    'journey', 'learning_plan_update', {
      added_skills: skillIds,
      priority: prioritySkillId,
      immediate_action: action.slice(0, 30)
    }
  )
  return next
}