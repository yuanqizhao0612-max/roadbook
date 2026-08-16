// ============================================================
// 路书 · Fixture Learning Skills / 现实任务 / 问路
// V0.4 Learning Skill 8 Step 标准结构
// ============================================================
import type { LearningSkill, RealWorldTask, AskRoadResult, SkillStepData } from './types'

// ---------- Step 内容构造 ----------
function step(title: string, body: string, bullets?: string[]): SkillStepData {
  return { title, body, bullets }
}

// ---------- Skill 01: 判断第一份工作值不值得去 (完整可进入, P0) ----------
export const skillFirstJob: LearningSkill = {
  skill_id: 'skill_first_job_value_001',
  title: '判断第一份工作值不值得去',
  category: 'career_readiness',
  why_for_user: '你准备先进入职场，但目前仍容易把"公司名气 / 薪资"放在"学习密度 / 管理者 / 方向匹配"之前。',
  learning_objective: '完成后，你能拿一份真实 Offer，知道还缺哪些信息、应该向谁问、怎么比较，并能说清自己的交换条件。',
  done_means: '能拿一份真实 Offer 完成五维评估，说清"我在交换什么、值不值得交换、还缺什么信息"。',
  capability_tags: ['工作价值判断', '信息获取', '交换意识'],
  priority: 'P0',
  estimated_minutes: 30,
  source_problem_ids: ['problem_first_offer'],
  steps_data: {
    why: step('我为什么需要学它', '你目前最容易高估"公司名气"，低估"直属管理者与学习密度"。第一份工作的价值不在入职那一刻，而在一年后你手里多出了什么。'),
    experience_case: step('先看一页前人的路书', '23 岁的市场岗同学,只看了公司名气就入职,18 个月才发现成长慢、没人带。TA 最想提醒你:先确认三件事再签 Offer。', ['前 90 天做什么', '谁给我反馈', '一年后能独立做到什么']),
    method: step('学一个方法：First Job Value 框架', '判断一份工作值不值得去，不是看单项分，而是看 5 个维度怎么组合。', [
      '方向匹配：这份工作是不是你想做的方向',
      '学习密度：一年后我的能力增长多少',
      '管理者质量：谁带、怎么带、反馈频率',
      '保留选择权：两年后我还能不能转',
      '基本回报：薪资能覆盖我的底线'
    ]),
    boundary: step('知道方法的边界', '', [
      '适用：有一定选择空间，不急着救命钱',
      '不适用：基本生存压力极高，先解决现金流',
      '不能机械比较：薪资差可以通过发展空间补回来，但前提是你真的想要那个方向'
    ]),
    transfer_practice: step('换一道题练习', '假设你 27 岁，手里有一份"高薪 20% 但方向不对口"的 Offer 和一份"薪资持平但领导很强"的 Offer，你会先收集哪些信息再决定？'),
    apply_to_self: step('用在我的真实问题', '打开你的 Offer（或目标岗位 JD），用上面 5 个维度各写一句：这份工作在这些维度上，证据是什么？'),
    real_world_task: step('领取现实任务', '在 48 小时内向直属经理 / HR 确认 3 个关键信息。', [
      '前 90 天重点负责什么',
      '平时谁会给你反馈、多久一次',
      '新人一年后通常能独立做到什么'
    ]),
    reflection: step('回来复盘', '回来后回答：我实际问了什么、发现了什么、哪个判断变了、还缺什么证据。路书会根据你的现实证据更新掌握度。')
  },
  mastery: { status: 'not_started', progress: 0, evidence_count: 0 },
}

// ---------- Skill 02: 判断自己是在成长还是只是变熟练 (P1) ----------
export const skillGrowthVsPractice: LearningSkill = {
  skill_id: 'skill_growth_vs_practice_002',
  title: '判断自己是在成长，还是只是在变熟练',
  category: 'career_readiness',
  why_for_user: '进入职场后，最常见的假象是"忙 = 在进步"。你需要一套区分信号。',
  learning_objective: '完成后，你能区分"熟练度提升"和"能力增长"，并知道该怎么主动制造成长。',
  done_means: '能说出自己当前岗位的成长信号与熟练信号的差异，并制定一条主动成长路径。',
  capability_tags: ['自我评估', '成长策略'],
  priority: 'P1',
  estimated_minutes: 25,
  source_problem_ids: ['problem_growth'],
  steps_data: {
    why: step('我为什么需要学它', '很多人前两年"长"得很快，第三年开始原地转圈却不自知：每天驾轻就熟，但能力上限没有提高。'),
    experience_case: step('先看一页前人的路书', '27 岁产品经理回头看：第一份工作"很累"其实是没人教，不是行业问题。TA 把"累"误当成了"不适合"。'),
    method: step('学一个方法：成长三信号', '', [
      '反馈信号：最近有没有人指出你具体哪里不够好',
      '难度信号：最近做的事有没有超出你舒适区一点点',
      '作品信号：你最近有没有产出"以前做不出来"的东西'
    ]),
    boundary: step('知道方法的边界', '', [
      '适用：想判断自己是否在成长的职场人',
      '不适用：刚入职前 3 个月，先适应再谈成长',
      '不能机械套用：不同岗位成长周期不同，别用别人的节奏否定自己'
    ]),
    transfer_practice: step('换一道题练习', '假设你是运营，连续 3 个月做同样的活动页，数据稳定。你会用什么信号判断自己是在成长还是只是熟练？'),
    apply_to_self: step('用在我的真实问题', '写下你最近 30 天做的 3 件事，给每件标出是"熟练重复"还是"能力增加"。'),
    real_world_task: step('领取现实任务', '约一次与领导 / 资深同事的 15 分钟对话，问 TA：我这个阶段最该补的能力是什么？'),
    reflection: step('回来复盘', '回答：我听到的反馈是什么、我打算怎么补、我准备在什么时候再检查一次。')
  },
  mastery: { status: 'not_started', progress: 0, evidence_count: 0 },
}

// ---------- Skill 03: 为未来转向保留选择权 (P1) ----------
export const skillKeepOptionality: LearningSkill = {
  skill_id: 'skill_keep_optionality_003',
  title: '为未来转向保留选择权',
  category: 'career_readiness',
  why_for_user: '你担心"选了这条路就回不了头"。其实选择权是可以提前留存和积累的。',
  learning_objective: '完成后，你能在任何一份工作里持续积累可迁移资产，让未来转向成本更低。',
  done_means: '能说出自己当前岗位能积累哪些可迁移资产，并已启动其中一项。',
  capability_tags: ['可迁移能力', '选择权'],
  priority: 'P1',
  estimated_minutes: 20,
  source_problem_ids: ['problem_optionality'],
  steps_data: {
    why: step('我为什么需要学它', '25 岁先工作再探索的同学提醒：只积累岗位熟练度，等于把未来选择权全部押在当前岗位上。'),
    experience_case: step('先看一页前人的路书', '29 岁转行成功的同学：8 个月业余时间 + 3 个真实项目，低风险完成转向。关键是"边工作边攒证据"。'),
    method: step('学一个方法：可迁移资产三件套', '', [
      '作品证据：能展示你能力的产出物(不只写简历)',
      '方向人脉：目标领域的 3–5 个真实联系人',
      '验证记录：你对新方向的真实尝试记录'
    ]),
    boundary: step('知道方法的边界', '', [
      '适用：想在当前工作中保留转向可能的人',
      '不适用：已有清晰方向且不打算转的人',
      '注意：积累作品的前提是不影响本职质量和诚信'
    ]),
    transfer_practice: step('换一道题练习', '假设你 30 岁想从运营转产品，但现在工作很忙。你会如何设计"最小可迁移周"？'),
    apply_to_self: step('用在我的真实问题', '列出你当前岗位能产生的 3 种可迁移资产，标出哪一个最容易启动。'),
    real_world_task: step('领取现实任务', '本周用 2 小时，为你的目标方向产出一份最小作品（分析 / 作品 / 访谈笔记皆可）。'),
    reflection: step('回来复盘', '回答：作品做出来了吗、它证明了什么、下一件最小作品是什么。')
  },
  mastery: { status: 'not_started', progress: 0, evidence_count: 0 },
}

// ---------- Skill 04: 抓住汇报真正的重点 (问路示例 Skill) ----------
export const skillReportFocus: LearningSkill = {
  skill_id: 'skill_report_focus_004',
  title: '抓住汇报真正的重点',
  category: 'workplace_communication',
  why_for_user: '你收到反馈"汇报抓不到重点"。这不是要你更会说话，而是要先解决三件事：信息提炼、结构化表达、上级视角。',
  learning_objective: '完成后，你能在 30 秒内说清"这次汇报要对方做什么决定、需要什么信息"。',
  done_means: '能用"结论 → 依据 → 请求"三段式重组一次真实汇报。',
  capability_tags: ['信息提炼', '结论先行', '上级视角'],
  priority: 'P0',
  estimated_minutes: 25,
  source_problem_ids: ['problem_report'],
  steps_data: {
    why: step('我为什么需要学它', '汇报"抓不到重点"通常不是嘴笨，而是没想清楚三件事：什么值得说、先说哪句、对方要拿什么做判断。'),
    experience_case: step('先看一页前人的路书', '一位 28 岁运营同学，曾被领导三次打断汇报。后来她每次汇报前先写一行"我这次要 TA 做什么决定"，汇报质量立刻改变。'),
    method: step('学一个方法：汇报三段式', '结论先行，只说对方要的。', [
      '结论：一句话说清这件事现在是什么状态',
      '依据：最多 3 条事实支持（别堆过程）',
      '请求：明确你需要 TA 做什么决定或给什么资源'
    ]),
    boundary: step('知道方法的边界', '', [
      '适用：周报、方案评审、问题升级',
      '不适用：开放式头脑风暴（不需要三段式）',
      '注意：如果结论你自己都不确定，就把"不确定"也放进结论里'
    ]),
    transfer_practice: step('换一道题练习', '假设领导问"最近项目为什么慢"，给你 30 秒，你会先说哪一句？'),
    apply_to_self: step('用在我的真实问题', '把你最近一次汇报重新组织成"结论 → 依据 → 请求"三段，写下来。'),
    real_world_task: step('领取现实任务', '24 小时内,把下一次汇报的工具(周报/邮件/会议)用三段式重写一版,并观察对方的反应。'),
    reflection: step('回来复盘', '回答：对方是否更快抓住了重点、哪个部分仍然模糊、下次怎么改进。')
  },
  mastery: { status: 'not_started', progress: 0, evidence_count: 0 },
}

export const allSkills: LearningSkill[] = [
  skillFirstJob, skillGrowthVsPractice, skillKeepOptionality, skillReportFocus
]

// ---------- 现实任务 ----------
export const taskOfferManagerInterview: RealWorldTask = {
  task_id: 'task_offer_manager_interview_001',
  skill_id: 'skill_first_job_value_001',
  title: '48 小时内确认 Offer 的 3 个关键信息',
  why: '这是你目前最立即可执行、价值最高的现实动作：问清前 90 天做什么、谁给反馈、一年后能独立做到什么。',
  instruction: '向直属经理 / HR 提问：1) 前 90 天重点负责什么；2) 平时谁会给我反馈、多久一次；3) 新人一年后通常能独立做到什么。',
  expected_evidence: ['提问记录', '对方回答', '你的新判断'],
  due_window: '48_hours',
  status: 'todo',
  user_record: { what_i_did: '', what_i_learned: '', what_changed: '', what_i_still_dont_know: '' },
  ai_reflection: ''
}

export const allTasks: RealWorldTask[] = [taskOfferManagerInterview]

// ---------- 问路 Fixture (V0.4) ----------
export const askRoadFixtureReport: AskRoadResult = {
  ask_id: 'ask_001',
  raw_question: '领导说我汇报总抓不到重点',
  surface_problem: '汇报抓不到重点',
  deeper_theme: '向上沟通中的信息判断',
  gap_types: ['method_gap', 'skill_gap', 'experience_gap'],
  plain_gap_lines: [
    '你还没形成方法：知道一些道理，但每次还是凭感觉组织汇报',
    '你还没真正练过：缺少一次结构化的汇报练习机会',
    '你还没看清：缺少"对方到底要拿什么做判断"的上级视角'
  ],
  capability_gaps: ['信息提炼', '结论先行', '上级视角理解'],
  evidence_gaps: ['缺少一次结构化的汇报练习机会'],
  relevant_entries: ['roadbook_entry_demo_004'],
  relevant_method_ids: ['method_report_3part'],
  recommended_skill_ids: ['skill_report_focus_004', 'skill_growth_vs_practice_002'],
  priority_skill_id: 'skill_report_focus_004',
  immediate_action: '把下一次汇报先用"结论 → 依据 → 请求"三段式重写一版',
  ts: ''
}

// ---------- 七步行动 (V0.4.1 《我的第一本路书》行动版) ----------
export const sevenDayAction = [
  { day: 'Day 1–2', action: '找 2 位真实从业者聊工作日常', note: '问：前 90 天做什么、谁给反馈、一年后能独立做到什么' },
  { day: 'Day 3', action: '完成一次目标岗位真实任务', note: '哪怕是很小的任务，做出证据' },
  { day: 'Day 4', action: '用"我的工作选择尺"重新评估 Offer', note: '按你真正看重的高/中/低重新打分' },
  { day: 'Day 5–7', action: '补齐信息后再做最终判断', note: '用 Offer 三问清单，向 HR / 经理提问' }
]