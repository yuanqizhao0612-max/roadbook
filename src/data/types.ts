// ============================================================
// 路书 · 数据层类型定义 (Schemas)
// V0.3 → V0.4 → V0.4.1 → V0.4.2
// ============================================================

// ---------- 基础 ----------
export type ID = string

// V0.5 人群分层（首页第一步选择，决定后续推送样本与经验分析）
export type AudienceType = 'new_grad' | 'mid_career' | 'senior'

export const AUDIENCE_META: Record<AudienceType, { label: string; tagline: string; ageBand: string }> = {
  new_grad: { label: '职场新人', tagline: '刚起步，想找对第一个方向', ageBand: '在校 ～ 工作 3 年' },
  mid_career: { label: '而立转型', tagline: '30-40，想二次选择或往上走', ageBand: '30 - 40 岁' },
  senior: { label: '不惑规划', tagline: '40-50，想规划人生下半场', ageBand: '40 - 50 岁' }
}

// V0.8 人生图书馆分类体系（事业 / 生活 / 人际关系 三大区）
// 一级分类 → 二级细分；首页选年龄段后，书墙按分类浏览
export type LifeCategory = 'career' | 'life' | 'relationship'

export interface CategoryMeta {
  key: LifeCategory
  label: string
  icon: string          // 展示用图标名
  tagline: string       // 一句话定位
  subcategories: { key: string; label: string; desc: string }[]
}

export const LIFE_CATEGORIES: CategoryMeta[] = [
  {
    key: 'career',
    label: '事业',
    icon: 'briefcase',
    tagline: '选什么工作、怎么往上走、要不要赌一把',
    subcategories: [
      { key: 'employment',  label: '上班族',   desc: '选 Offer、转岗、晋升、被边缘化、专业 vs 管理' },
      { key: 'entrepreneur', label: '创业 / 独立', desc: '要不要开始、副业起步、参赛做产品、经验变现' },
      { key: 'transition',  label: '转行 / 转方向', desc: '跨行业、跨职能、体制内外、年龄转型' },
    ],
  },
  {
    key: 'life',
    label: '生活',
    icon: 'leaf',
    tagline: '和上班无关、但决定你这辈子过得怎样的那些事',
    subcategories: [
      { key: 'health',      label: '健康 / 精力', desc: '身体信号、可持续节奏、精力管理' },
      { key: 'money',       label: '理财 / 钱',   desc: '收入结构、储蓄、买房、第二现金流' },
      { key: 'family',      label: '家庭 / 亲情', desc: '父母、伴侣、育儿、回不回老家' },
      { key: 'self_growth', label: '自我成长',    desc: '读书、爱好、身份认同、内心建设' },
    ],
  },
  {
    key: 'relationship',
    label: '人际关系',
    icon: 'people',
    tagline: '和领导、同事、朋友、家人的关系，怎么处理不内耗',
    subcategories: [
      { key: 'at_work',    label: '职场关系', desc: '直属领导、向上管理、同事相处、被针对' },
      { key: 'intimate',   label: '亲密关系', desc: '恋爱、婚姻、分手、和伴侣的边界' },
      { key: 'friends',    label: '朋友 / 社交', desc: '交友、圈层、孤独、人脉衰减' },
    ],
  },
]

export function getSubcategoryLabel(cat: LifeCategory, sub: string): string {
  const c = LIFE_CATEGORIES.find(x => x.key === cat)
  if (!c) return sub
  const s = c.subcategories.find(x => x.key === sub)
  return s ? s.label : sub
}

// V0.4.2 内测数据标记
export type SourceMarker = 'demo_fixture' | 'real_beta' | 'user_contributed_local' | 'user_contributed_verified'

// ---------- 基本信息 Profile (V0.4.2 / V0.5) ----------
export interface BasicProfile {
  audience: AudienceType   // V0.5 人群分层（首页第一步）
  stage: string            // 在校 / 毕业1年内 / 工作1-3年 ...
  industry: string         // 行业
  function: string         // 职能/岗位
  concerns: string[]       // 最近最关心(最多2)
  priorities: string[]     // 最看重(最多3)
  limits: string[]         // 最大限制(可多选)
  city: string             // 选填
  updatedAt: string
}

// ---------- Context 摘要 ----------
export interface ContextSummary {
  stage: string
  hasOffer: boolean
  directionClarity: 'clear' | 'unclear'
  explorationMonths: number
  biggestWorry: string
  mostValue: string
  summaryText: string   // "被理解"的摘要
}

// ---------- Source Pack (V0.3) ----------
export interface SourceRef {
  source_id: string
  title: string
  publisher_or_author: string
  url_or_bibliography: string
  date: string
  source_type: 'primary' | 'reputable_secondary'
  supported_claims: string[]
}

export interface CaseSummary {
  stage: string
  problem: string
  constraints: string[]
  resources: string[]
  choice: string
  outcome: string
  reflection: string
}

export interface SourcePack {
  mentor_id: ID
  display_name: string
  model_type: 'historical_public_sources'
  life_theme_tags: string[]
  case_summary: CaseSummary
  sources: SourceRef[]
  safe_paraphrases: string[]
  verified_quotes: { text: string; source_id: string }[]
  forbidden_claims: string[]
}

// ---------- 职业坐标卡 (V0.4.2 实用化增强) ----------
// 脉脉式可对照坐标：让用户能"按图索骥"对照自己的处境
export interface CaseProfile {
  education: string        // 学历：普通本科（传媒类）/ 985本科 ...
  company_from: string     // 上家公司（脱敏化名）：某电商大厂
  company_type: string     // 公司类型：大厂 / 创业公司 / 国企 / 外企 / 体制内 / 乙方
  role_from: string        // 原岗位：市场运营（执行）
  industry_from: string    // 原行业：快消/电商
  role_to: string          // 转去岗位：品牌策略
  industry_to: string      // 转去行业：新能源汽车
  salary_from: string      // 转前薪资（大概，税前/月）：8k
  salary_to: string        // 转后薪资（大概）：13k
  switch_direction: string // 具体换了哪个方向（不是"换职能"，而是"换职能里的层次+行业"）
  why_more_match: string   // 为什么这个行业/方向更匹配 TA
  industry_diff_note: string // 同一岗位在不同行业的区别（主要用于品牌/市场类）
  // 匹配标签（与用户填写词表一致的词汇，用于"按我的处境对照"高亮）
  match_industries?: string[]
  match_functions?: string[]
}

// ---------- 普通人案例 (T2) ----------
export interface OrdinaryCase {
  id: ID
  source_marker: SourceMarker
  audience: AudienceType   // V0.5 适用人群
  title: string
  who: string          // "23岁 | 市场岗 | 普通本科"
  one_line_choice: string  // "先工作，18个月后换方向"
  biggest_pitfall: string  // 最值得避开的坑 (V0.4.2 一级字段)
  why_similar: string  // 为什么和你有关
  time_horizon: string // 结果时间跨度: 18_months ...
  outcome: string
  satisfaction: 'satisfied' | 'unsatisfied' | 'mixed'
  if_again: string
  advice: string
  stage_tag: 'peer' | 'lookback' | 'historical' // 和我差不多 / 走过3-5年 / 历史人物
  profile_tag: string
  scenario_tags?: string[]    // 场景标签（做产品/创业/参赛/转行...），用于跨人群语义匹配
  case_profile?: CaseProfile  // 脉脉式职业坐标（演示样本·示意）
  sources?: SourceRef[]       // 名人/历史人物案例的公开来源（必须含来源、不虚构）
  notable?: boolean           // 是否为历史/当代名人（跨时代参照）
  skills_learned?: SkillLearned[]  // V0.5.1 这个过来人后来学了哪些技能（求解者路径核心出口）
  timeline_followups?: TimelineFollowup[]  // V0.6 选择后的时间轴切片（时光机核心数据）
  life_category?: LifeCategory          // V0.8 一级分类（事业/生活/人际关系）
  life_subcategory?: string             // V0.8 二级分类（employment/entrepreneur/health/...）
}

// V0.6 时间轴后续切片——"这个过来人做了选择后，1年/3年/5年变成了什么样"
export interface TimelineFollowup {
  years_after: number            // 几年后（1 / 3 / 5）
  what_happened: string          // 后来发生了什么（具体事件，不是感悟）
  what_i_realized: string        // 那时候我以为最重要的是X，后来发现其实是Y（核心洞察）
  current_status: string         // TA 现在的状态（在哪、做什么、过得怎样）
}

// V0.5.1 学习路径项（每个样本可以有多条）
export interface SkillLearned {
  skill_name: string         // 技能名，如"汇报结构化"
  why_need: string           // 为什么当时需要学（场景驱动）
  how_learned: string        // 怎么学的（真实路径）
  what_can_do_after: string  // 学完能做什么（可验证的能力）
  estimated_hours: string    // 大概花了多久（口语化，如"2 周业余"）
}

// ---------- 方法卡 Formula Card (V0.3) ----------
export interface FormulaCard {
  formula_id: ID
  theme: string
  title: string
  keep_one_sentence: string   // 先记住一句
  self_check_questions: string[]  // 判断自己的3个问题
  today_action: string        // 今天能做的一件事
  come_back: string           // 做完以后回来告诉路书
  conceptual_model: {
    label: string
    expression: string
  }
  applicable_when: string[]
  not_applicable_when: string[]
  counterexample: string
  source_case_ids: ID[]
}

// ---------- 工作选择尺 (V0.4.1) ----------
export type RulerLevel = '高' | '中' | '低'

export interface RulerFactor {
  key: string
  label: string
}

export interface TradeoffQuestion {
  id: string
  question: string
  if_accept: { key: string; delta: string }  // 交换到的
  if_give: { key: string; delta: string }    // 付出的
}

export interface OfferAnalysis {
  match_items: string[]      // 对你真正重要的
  trades: string[]           // 你正在交换什么
  worth_it: string           // 值不值得交换(条件语言)
  missing_info: string[]     // 还缺什么信息
}

export interface HardBottomLine {
  salary_floor: string       // 薪资底线
  city_limit: string         // 城市限制
  work_hours: string         // 工作时间
  risk_limit: string         // 风险底线
}

export interface DecisionRuler {
  factors: { key: string; label: string; level: RulerLevel; rank: number }[]
  disclaimer: string
  bottomLine: HardBottomLine
}

// ---------- 未来分岔模拟 (V0.4.1) ----------
export interface ForkNode {
  horizon: '6_months' | '2_years' | '5_years'
  label: string
  gain: string[]       // 最可能获得
  ignore: string[]     // 最容易忽略
  next_fork: string    // 下一次关键岔路
}

export interface ForkSimulation {
  choice_name: string
  nodes: ForkNode[]
  pivotability: {
    level: '高' | '中' | '低'
    reasons: string[]
    disclaimer: string
  }
  if_changed: Record<string, string>  // 条件 → 结论
}

// ---------- Transfer Lab (V0.3) ----------
export interface TransferScenario {
  id: ID
  prompt: string
  options: { key: string; text: string }[]
  method_choices: { key: string; text: string }[]
  verify_message: string
}

// ---------- Scenario Learning: Offer 三问 (V0.4.1) ----------
export interface OfferThreeQuestions {
  items: {
    no: string
    title: string
    why: string
    suggested_question: string
  }[]
  copyable_text: string
}

// ---------- Learning Skill (V0.4) ----------
export type SkillStepKey =
  | 'why' | 'experience_case' | 'method' | 'boundary'
  | 'transfer_practice' | 'apply_to_self' | 'real_world_task' | 'reflection'

export interface MasteryState {
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number   // 0-100
  evidence_count: number
}

export interface LearningSkill {
  skill_id: ID
  title: string
  category: string
  why_for_user: string
  learning_objective: string
  done_means: string    // 学完以后现实里会多会什么 (V0.4.1)
  capability_tags: string[]
  priority: 'P0' | 'P1' | 'P2'
  estimated_minutes: number
  steps_data: Record<SkillStepKey, SkillStepData>
  mastery: MasteryState
  source_problem_ids: ID[]
}

export interface SkillStepData {
  title: string
  body: string
  bullets?: string[]
}

// ---------- Real World Task (V0.4) ----------
export interface RealWorldTask {
  task_id: ID
  skill_id: ID
  title: string
  why: string
  instruction: string
  expected_evidence: string[]
  due_window: string
  status: 'todo' | 'done_pending_review' | 'reviewed'
  user_record: {
    what_i_did: string
    what_i_learned: string
    what_changed: string
    what_i_still_dont_know: string
  }
  ai_reflection: string
  mastery_before?: number
  mastery_after?: number
}

// ---------- 问路 Ask Road (V0.4) ----------
export type GapType = 'knowledge_gap' | 'method_gap' | 'experience_gap' | 'validation_gap' | 'skill_gap'

export interface AskRoadResult {
  ask_id: ID
  raw_question: string
  surface_problem: string
  deeper_theme: string
  gap_types: GapType[]
  plain_gap_lines: string[]   // 口语化缺口描述 (V0.4.1)
  capability_gaps: string[]
  evidence_gaps: string[]
  relevant_entries: ID[]
  relevant_method_ids: ID[]
  recommended_skill_ids: ID[]
  priority_skill_id: ID
  immediate_action: string
  ts: string
}

// ---------- Roadbook Entry (V0.4.2) ----------
export interface RoadbookEntry {
  entry_id: ID
  visibility: 'anonymous_public' | 'private'
  source_marker: SourceMarker
  scenario_tags?: string[]    // 场景标签（做产品/创业/参赛...），用于跨人群语义匹配
  notable?: boolean           // 是否为历史/当代名人（书墙角标 + 名人图书馆分流）
  author_profile: {
    stage: string
    age_range: string
    audience?: AudienceType
    industry: string
    function: string
    city?: string
  }
  problem: {
    raw: string
    tags: string[]
  }
  choice: string
  reasons: string[]
  outcome: {
    time_horizon: string
    summary: string
    satisfaction: string
  }
  biggest_pitfall: string
  if_again: string
  advice_to_later_people: string
  created_at: string
  source_type: 'user_contributed' | 'fixture'
  case_profile?: CaseProfile  // 脉脉式职业坐标（演示样本·示意）
}

// ---------- Personal Growth Graph (V0.4) ----------
export interface GrowthGraph {
  user_id: string
  version: string
  profile: BasicProfile | null
  context_summary: ContextSummary | null
  life_themes: string[]
  problems: { id: ID; text: string; ts: string }[]
  methods_learned: ID[]
  skills: LearningSkill[]
  real_world_tasks: RealWorldTask[]
  choices: { id: ID; label: string; ts: string }[]
  outcomes: string[]
  reflections: string[]
  authored_roadbook_entries: ID[]
  read_roadbook_entries: ID[]
  capability_states: { name: string; evidence: string[]; level: RulerLevel }[]
  learning_plan: {
    generated: boolean
    priority_skill_id: ID | null
    p1_skill_ids: ID[]
    p2_skill_ids: ID[]
    ts: string
  }
}

// ---------- 学习证据 (V0.3) ----------
export interface LearningEvidence {
  life_theme: string
  selected_entry_id: ID
  entered_roadbook_library: boolean
  method_questions_used: string[]
  formula_understood: boolean
  transfer_choice: string
  transfer_method_used: string[]
  transfer_pass: boolean
  original_problem_reframe: string
  first_choice: string
  final_choice: string
  capability_gaps: string[]
  scenario_pre_priorities: string[]
  scenario_post_priorities: string[]
  checkin_created: boolean
  mastery_before: number
  mastery_after: number
  ask_road_used: boolean
  ask_question: string
  ask_gap_types: GapType[]
  ask_generated_skills: ID[]
  growth_graph_updated: boolean
  contributed_roadbook: boolean
}

// ---------- Agent Trace (V0.4) ----------
export interface TraceEvent {
  agent: 'context' | 'retrieval' | 'journey'
  node: string
  data: Record<string, unknown>
  ts: string
}

// ---------- 递进式内容生成（V0.9.3） ----------
// 三步生成链路共享类型：
//   InsightDistill（关于书主人的认知）→ GrowthPath（关于用户的行动，含7天计划）→ 学习计划
export interface DistillMindShift {
  before: string    // 原来以为
  after: string     // 后来明白
}

export interface DistillResult {
  mind_shifts: DistillMindShift[]       // 认知翻转（TA 的念头怎么变了）
  decision_principles: string[]          // 决策原则（可带走的做决定智慧）
  for_your_situation: string             // 对用户处境意味着什么（直接对用户说）
}

export interface NextStep {
  title: string        // 动作标题
  why: string          // 为什么这一步对你有用
  how: string          // 怎么开始（具体到本周能做什么）
  time_cost: string    // 大概需要多久
}

export interface SkillGuidance {
  skill: string            // 能力名称
  reason: string           // 为什么这个能力对你接下来的路有用
  how_start: string        // 怎么开始补这个能力（真实可复制的起点）
  reference_cases: string[] // 哪些过来人补过这个能力（书名）
}

export interface SevenDayStep {
  day: string        // 如 "Day 1" / "Day 5–7"
  action: string     // 今天/这几天具体做什么
  note: string       // 为什么这么做 / 怎么做更有效
}

export interface GrowthPathResult {
  situation_summary: string            // 你现在在哪（一句话画像）
  next_steps: NextStep[]               // 接下来可以做的探索动作
  skills_to_build: SkillGuidance[]     // 如果深入，需要补的能力方向
  one_month_plan: string               // 未来一个月可以做成的具体一件事
  seven_day_plan: SevenDayStep[]       // 7天行动计划（对标"我的第一本路书"页）
  mindset_anchor: string               // 送用户的一句话
}

// ---------- 书状态 ----------
export type BookPageId =
  | 'cover'
  | 'age_select'
  | 'intent_gate'
  | 'library_wall'
  | 'profile_0'
  | 'profile_1' | 'profile_reflection'
  | 'current_problem'
  | 'not_alone'
  | 'library'
  | 'peer_cases'
  | 'lookback_case'
  | 'historical_case'
  | 'method_use'
  | 'decision_ruler'
  | 'fork_sim'
  | 'offer_3q'
  | 'my_roadbook'
  | 'learning_route'
  | 'case_learning_route'
  | 'time_machine'
  | 'insight_distill'
  | 'reflection_close'
  | 'growth_path'
  | 'skill_detail'
  | 'real_world_task'
  | 'checkin'
  | 'dashboard'
  | 'ask_road'
  | 'ask_diagnosis'
  | 'library_home'
  | 'pitfall_library'
  | 'write_entry_a' | 'write_entry_b'
  | 'submit_success'
  | 'agent_trace'
  | 'about'

export interface BookMeta {
  chapter: string
  pageLabel: string // "第 3 页"
  icon: string
}

// ---------- 对话 (V0.3/ V0.4.1) ----------
export interface ChatTurn {
  role: 'user' | 'mentor'
  text: string
  source_chips?: string[]
  answer_mode?: 'grounded' | 'limited'
}

// ---------- 全局应用状态 ----------
export interface AppState {
  version: string
  page: BookPageId
  pageHistory: BookPageId[]
  profile: BasicProfile | null
  context: ContextSummary | null
  selectedEntry: ID | null
  formulaUnlocked: boolean
  transferDone: boolean
  ruler: DecisionRuler | null
  rulerConsent: boolean
  forkResult: ForkSimulation | null
  offerChecklistSaved: boolean
  chatTurns: ChatTurn[]
  mentorSkipped: boolean
  learningPlanGenerated: boolean
  currentSkillId: ID | null
  currentTaskId: ID | null
  lastAsk: AskRoadResult | null
  lastDistill: DistillResult | null        // V0.9.3 上一页精华提炼结果（传给路径指引）
  lastGrowthPath: GrowthPathResult | null  // V0.9.3 路径指引结果（传给学习计划/7天行动）
  evidence: LearningEvidence
  trace: TraceEvent[]
  growth: GrowthGraph
  demoUser: boolean
  resetCount: number
}