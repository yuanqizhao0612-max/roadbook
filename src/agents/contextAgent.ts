// ============================================================
// Agent 01 · Context & Theme Agent
// 中文角色: "理解你现在遇到的题"
// 职责: 基本信息采集 / Context 摘要 / 表面问题抽象 / 缺口诊断 / Growth 读取
// ============================================================
import type { AppState, BasicProfile, ContextSummary } from '../data/types'
import { pushTrace } from './base'

// ---------- 基本信息 → 生成"被理解"的摘要 ----------
import { AUDIENCE_META } from '../data/types'

export function generateProfileReflection(profile: BasicProfile | null, state: AppState): ContextSummary {
  const sum: ContextSummary = {
    stage: profile?.stage || '毕业 1 年内',
    hasOffer: profile?.concerns.includes('要不要接 Offer') ?? false,
    directionClarity: 'unclear',
    explorationMonths: 3,
    biggestWorry: profile?.limits.join('、') || '方向不清晰',
    mostValue: (profile?.priorities || ['成长']).slice(0, 2).join('、'),
    summaryText: ''
  }
  const audienceLabel = profile?.audience ? AUDIENCE_META[profile.audience].label : '职场新人'
  const priorities = profile?.priorities || []
  const hasGrowth = priorities.includes('成长')
  const hasSalary = priorities.includes('薪资')
  const hasStability = priorities.includes('稳定')
  const hasIndustry = priorities.includes('行业')

  // 规则引擎生成口语化摘要（开头按人群共情）
  const parts: string[] = []
  if (audienceLabel === '而立转型') {
    parts.push('30 到 40 这十年，最难的不是"没机会"，是"已经有一定积累，要不要为了更对的路重新选一次"。')
  } else if (audienceLabel === '不惑规划') {
    parts.push('到了 40 往上，题变了：不再是"我能不能上"，而是"下半场我想怎么过、还能留下什么"。')
  } else {
    parts.push('刚起步这个阶段，最怕的不是选错，是连"自己想选什么"都还来不及看清就被推着走。')
  }

  if (hasGrowth && hasIndustry && hasSalary) {
    parts.push('你现在最在意的是成长和行业方向，但也不能完全忽略收入。')
  } else if (hasGrowth && hasSalary) {
    parts.push('你在成长和收入之间摇摆，希望两头都兼顾。')
  } else if (hasStability && hasGrowth) {
    parts.push('你既想要稳定，又不甘心放弃成长——这正是你现在纠结的根源。')
  } else if (hasIndustry) {
    parts.push('你对行业方向看得很重，希望能走在有发展的赛道上。')
  } else {
    parts.push('你对眼下的方向还在摸索，但已经开始认真思考"什么对自己重要"。')
  }

  if (profile?.concerns.includes('要不要接 Offer')) {
    parts.push('你不是没有机会，而是不确定第一步是否会把自己带进不适合的方向。')
  }
  if (profile?.concerns.includes('该不该转行/换方向') || profile?.concerns.includes('要不要二次转型')) {
    parts.push('你想换，但怕"已经投入的这些年"白费——路书后面会带你看看同样走过这道坎的人。')
  }
  const limit = profile?.limits || []
  if (limit.includes('收入压力')) parts.push('你有现实收入压力，做选择时不能太理想化。')
  if (limit.includes('风险承受有限')) parts.push('你不太能承受"一步走错"的高风险。')
  if (limit.includes('家庭与精力')) parts.push('你还要顾家庭和健康，选择不能只算职场账。')

  sum.summaryText = parts.join('')
  return sum
}

// ---------- Context 摘要写入 state(growth 同步) ----------
export function saveContext(state: AppState, summary: ContextSummary): AppState {
  const next = pushTrace(
    { ...state, context: summary, growth: { ...state.growth, context_summary: summary } },
    'context', 'context_summary_generate', {
      stage: summary.stage,
      has_offer: summary.hasOffer,
      most_value: summary.mostValue
    }
  )
  return next
}

// ---------- 基本信息 3 页流写入 (V0.4.2) ----------
export function captureBasicProfile(state: AppState, profile: BasicProfile): AppState {
  const withTrace = pushTrace(state, 'context', 'basic_profile_capture', {
    stage: profile.stage,
    industry: profile.industry,
    function: profile.function,
    concerns: profile.concerns,
    priorities: profile.priorities,
    limits: profile.limits
  })
  return pushTrace(
    { ...withTrace, profile, growth: { ...withTrace.growth, profile } },
    'context', 'profile_incremental_update', { profile_complete: true }
  )
}

// ---------- 问路: 问题解析 + Gap 诊断 (V0.4) ----------
export type RuleGap = 'knowledge_gap' | 'method_gap' | 'experience_gap' | 'validation_gap' | 'skill_gap'

export interface QuestionDiagnosis {
  surface_problem: string
  deeper_theme: string
  gap_types: RuleGap[]
  plain_gap_lines: string[]
  capability_gaps: string[]
  evidence_gaps: string[]
}

const gapLineMap: Record<RuleGap, string> = {
  knowledge_gap: '你还没看清：有些信息还不够，靠猜的在补',
  method_gap: '你还没形成方法：知道一些道理，但每次还是凭感觉',
  experience_gap: '你还没真正试过：缺少真实情境的经验',
  validation_gap: '你还没验证过：有想法，但缺现实证据',
  skill_gap: '你还没练熟：需要一次具体的练习来掌握'
}

const capabilityMap: Record<RuleGap, string[]> = {
  knowledge_gap: ['信息获取', '行业认知'],
  method_gap: ['结构化方法', '判断框架'],
  experience_gap: ['真实情境经验'],
  validation_gap: ['现实验证', '证据收集'],
  skill_gap: ['刻意练习', '反馈利用']
}

const keywordRules: { re: RegExp; gaps: RuleGap[]; theme: string; caps: string[] }[] = [
  { re: /汇报|沟通|表达|汇报|说不清|卡壳/i, gaps: ['method_gap', 'skill_gap', 'experience_gap'], theme: '向上沟通中的信息判断', caps: ['信息提炼', '结论先行', '上级视角理解'] },
  { re: /转行|换行|转岗|换方向|不喜欢现在/i, gaps: ['validation_gap', 'experience_gap', 'method_gap'], theme: '职业方向的现实验证', caps: ['方向清晰度', '现实验证', '试错空间'] },
  { re: /带人|管理|下属|团队/i, gaps: ['method_gap', 'experience_gap', 'skill_gap'], theme: '第一次做管理', caps: ['目标对齐', '反馈机制', '授权'] },
  { re: /没竞争力|该学什么|不知道学|焦虑/i, gaps: ['knowledge_gap', 'skill_gap'], theme: '能力盘点与学习规划', caps: ['能力盘点', '学习路径'] },
  { re: /offer|入职|接不接|第一份工作|要不要去/i, gaps: ['validation_gap', 'experience_gap'], theme: '第一份工作的价值判断', caps: ['工作价值判断', '信息获取'] }
]

// V0.4.1 口语化输出抑制术语
export function diagnoseQuestion(raw: string): QuestionDiagnosis {
  const rule = keywordRules.find(r => r.re.test(raw))
  const gaps: RuleGap[] = rule ? rule.gaps : ['method_gap', 'experience_gap']
  const theme = rule ? rule.theme : '不确定的具体人生课题'
  const caps = rule ? rule.caps : ['问题定义', '信息收集']
  return {
    surface_problem: raw.trim(),
    deeper_theme: theme,
    gap_types: gaps,
    plain_gap_lines: gaps.map(g => gapLineMap[g]),
    capability_gaps: caps,
    evidence_gaps: gaps.includes('validation_gap') ? ['缺少一次真实世界的验证'] : ['缺少一次真实的练习']
  }
}