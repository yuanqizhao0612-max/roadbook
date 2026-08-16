// ============================================================
// 路书 · Fixture 方法卡 / Transfer Lab / Offer三问 / 工作选择尺 / 未来分岔
// V0.3 → V0.4.1 具体化升级后的所有"工具页"数据
// ============================================================
import type { FormulaCard, TransferScenario, OfferThreeQuestions,
  TradeoffQuestion, RulerFactor, ForkNode, ForkSimulation, AudienceType } from './types'

// ---------- 方法卡: 换成你可以怎么用 (V0.4.1 版) ----------
export const formulaCertaintyVsExploration: FormulaCard = {
  formula_id: 'formula_001',
  theme: 'certainty_vs_exploration',
  title: '别急着问"要不要换"，先确认自己是在逃离现在，还是已经走向新的方向',
  keep_one_sentence: '别急着问"要不要换"，先确认自己是在逃离现在，还是已经走向新的方向。',
  self_check_questions: [
    '你是不喜欢现在这家公司，还是不喜欢这类工作？',
    '你想去的新方向，真实做过至少一次吗？',
    '如果新方向不适合，你有没有退路？'
  ],
  today_action: '找一个你想去的岗位 JD，写下它最真实的 3 项日常工作。如果连日常工作都说不清，说明你现在还不是"准备转行"，而是"需要继续了解"。',
  come_back: '做完以后回来告诉路书：你写出的 3 项日常工作，是真实还是想象？',
  conceptual_model: {
    label: '思考框架（不是科学公式）',
    expression: '转向质量 ≈ 新方向清晰度 × 现实验证程度 × 可承受试错空间'
  },
  applicable_when: [
    '有一定探索空间，不用马上靠工资生存',
    '能获得真实的行业反馈',
    '新方向可以用低成本方式先验证'
  ],
  not_applicable_when: [
    '基本生存压力极高，这个月不接就没饭吃',
    '信息严重不足，却准备一次性押注',
    '只是一时情绪想逃离，并没有具体新方向'
  ],
  counterexample: '同样选择"换方向"，有人因为新方向已经验证过、有退路，越换越好；也有人因为只是情绪性逃离、没有真实体验，半年后又退回原点——条件不同，同样选择的结局完全不同。',
  source_case_ids: ['roadbook_entry_demo_001', 'roadbook_entry_demo_005', 'historical_luxun_001']
}

// ---------- Transfer Lab: 换一道题 (V0.3) ----------
export const transferScenarioOffer: TransferScenario = {
  id: 'transfer_001',
  prompt: '你已经在一家稳定公司工作两年。最近非常疲惫，也看到一个陌生但感兴趣的新行业。薪资可能下降 25%，目前只做过几次业余尝试。你会先做什么？',
  options: [
    { key: 'A', text: '直接辞职，全职转行' },
    { key: 'B', text: '继续忍耐，不再想转行' },
    { key: 'C', text: '先做 30 天现实验证，再决定' },
    { key: 'D', text: '不确定' }
  ],
  method_choices: [
    { key: 'clarity', text: '新方向清晰度' },
    { key: 'validation', text: '现实验证程度' },
    { key: 'space', text: '试错空间' },
    { key: 'pain', text: '当前痛苦程度' },
    { key: 'other', text: '其他' }
  ],
  verify_message: '你刚才没有直接问"要不要转行"，而是先检查"方向是否清晰、是否验证过、有没有试错空间"。这说明你已经开始把别人的经验变成自己的方法。'
}

// ---------- 工作选择尺 (V0.4.1) ----------
export const rulerFactors: RulerFactor[] = [
  { key: 'salary', label: '薪资与福利' },
  { key: 'industry', label: '行业发展' },
  { key: 'role', label: '岗位方向' },
  { key: 'growth', label: '学习成长' },
  { key: 'manager', label: '直属领导' },
  { key: 'platform', label: '公司平台' },
  { key: 'stability', label: '稳定性' },
  { key: 'optionality', label: '未来转向空间' }
]

export const tradeoffQuestions: TradeoffQuestion[] = [
  {
    id: 'q1',
    question: '如果工资少 15%，但行业明显更有发展，你愿意吗？',
    if_accept: { key: 'industry', delta: '行业更有发展' },
    if_give: { key: 'salary', delta: '少 15% 工资' }
  },
  {
    id: 'q2',
    question: '如果公司名气一般，但直属领导特别强，你愿意吗？',
    if_accept: { key: 'manager', delta: '直属领导很强' },
    if_give: { key: 'platform', delta: '公司名气一般' }
  },
  {
    id: 'q3',
    question: '如果工资高 20%，但岗位方向不是你以后想长期做的，你愿意吗？',
    if_accept: { key: 'salary', delta: '高 20% 工资' },
    if_give: { key: 'role', delta: '岗位方向不对口' }
  },
  {
    id: 'q4',
    question: '如果工作很稳定，但两年后可跳出去的空间很小，你愿意吗？',
    if_accept: { key: 'stability', delta: '工作很稳定' },
    if_give: { key: 'optionality', delta: '转向空间很小' }
  }
]

// ---------- Offer 三问 (V0.4.1 强化工具页) ----------
export const offerThreeQuestions: OfferThreeQuestions = {
  items: [
    {
      no: '01',
      title: '前 90 天，我具体做什么？',
      why: '不问岗位职责，只问前 3 个月的真实任务，判断这份工作是不是你想做的。',
      suggested_question: '"如果我入职，前 3 个月最重要的 2–3 个任务会是什么？"'
    },
    {
      no: '02',
      title: '谁会真正带我？',
      why: '成长速度往往取决于谁给你反馈、多久一次，而不是公司名气。',
      suggested_question: '"这个岗位平时主要由谁给反馈？大概多久会有一次正式或非正式的反馈？"'
    },
    {
      no: '03',
      title: '一年以后，我应该能独立做到什么？',
      why: '让你看清这条路的终点，而不是只盯着眼前的工资。',
      suggested_question: '"你们希望这个岗位一年以后能独立承担到什么程度？"'
    }
  ],
  copyable_text: '我想再了解三个信息：前 90 天重点任务、主要反馈人、一年后的独立能力要求。'
}

// ---------- Offer 三问: 而立转型版（30-40） ----------
const offerThreeQuestionsMid: OfferThreeQuestions = {
  items: [
    {
      no: '01',
      title: '这份新机会，跟我过去十年攒的东西能不能复利？',
      why: '30+ 最怕"假转型"——换了赛道却把积累全清零。先确认新机会能不能用上你已有的行业判断、人脉和靠谱执行力。',
      suggested_question: '"这个方向里，我过去做过的积累、认识的人，大概有多少能直接复用？"'
    },
    {
      no: '02',
      title: '如果接了，家庭和时间谁兜底？',
      why: '三十多岁的试错空间比二十五岁小很多。第二曲线得是"低耗、可远程、不裸辞"的验证，不是豪赌。',
      suggested_question: '"这个机会如果要做成，我每周大概要额外投入多少小时？会不会先压垮家庭或睡眠？"'
    },
    {
      no: '03',
      title: '一年后回看，它是我的第二曲线，还是又一个熟练陷阱？',
      why: '让你看清时间花下去，会走向"越走越宽"，还是只是把现有活干得更熟。',
      suggested_question: '"你们希望这个角色一年以后，是能独立产出新东西，还是只是把现有工作干得更熟练？"'
    }
  ],
  copyable_text: '我想再确认三件事：这份机会能不能复用我已有的积累、接了之后家庭和时间谁兜底、一年后它是我的第二曲线还是又一个熟练陷阱。'
}

// ---------- Offer 三问: 不惑规划版（40-50） ----------
const offerThreeQuestionsSenior: OfferThreeQuestions = {
  items: [
    {
      no: '01',
      title: '这个机会，能不能把我的经验变成不靠工资也成立的东西？',
      why: '40+ 最稳的再出发，是把"判断和经验"变成顾问、带教或轻事业，而不是再卖一遍时间。先确认它往这个方向走。',
      suggested_question: '"这个角色里，我积累的判断和方法，有没有可能变成可以独立交付、持续产生收入的东西？"'
    },
    {
      no: '02',
      title: '接了之后，我的精力和身体节奏扛不扛得住？',
      why: '体力恢复速度客观在下滑，选"降耗不减收"的路，比"高薪硬扛"更抗老。先确认节奏。',
      suggested_question: '"这个机会的工作节奏，是可持续的，还是会长期透支我的精力？"'
    },
    {
      no: '03',
      title: '五年后回看，它是我下半场的第一块基石，还是又一次为别人做嫁衣？',
      why: '让你看清这条路的终点——到底在积累"属于自己"的资产，还是只是把平台做得更大。',
      suggested_question: '"五年后，这个方向里"真正属于我自己的东西"（人脉、方法论、现金流）会有多少？"'
    }
  ],
  copyable_text: '我想再确认三件事：这份机会能不能把我的经验变成不靠工资也成立的东西、接了之后精力和身体节奏扛不扛得住、五年后它是我下半场的基石还是又为别人做嫁衣。'
}

export const offerThreeQuestionsByAudience: Record<AudienceType, OfferThreeQuestions> = {
  new_grad: offerThreeQuestions,
  mid_career: offerThreeQuestionsMid,
  senior: offerThreeQuestionsSenior,
}

export function offerThreeQuestionsForAudience(a: AudienceType = 'new_grad'): OfferThreeQuestions {
  return offerThreeQuestionsByAudience[a] ?? offerThreeQuestions
}

// ---------- 未来分岔模拟 (V0.4.1) ----------
export const forkSimulationFixture: ForkSimulation = {
  choice_name: '先工作',
  nodes: [
    {
      horizon: '6_months',
      label: '6 个月后',
      gain: [
        '进入真实职场，获得第一手职业反馈',
        '积累"干过什么"的履历证据',
        '收入和社保接续，基本盘稳定'
      ],
      ignore: [
        '可能忽略：你其实还不太清楚自己擅长什么、喜欢什么'
      ],
      next_fork: '下一次关键岔路：6 个月后，你判断这份工作是在"成长"还是只是"变熟练"。'
    },
    {
      horizon: '2_years',
      label: '2 年后',
      gain: [
        '可能已形成某个方向的专业能力',
        '有了可量化的成绩，跳槽底气更足'
      ],
      ignore: [
        '路径惯性开始增加：换方向的沉没成本变高',
        '如果没人给你反馈，可能原地熟练三年'
      ],
      next_fork: '未来转向还缺什么：作品证据、目标方向的人脉、一次真实转岗试水。'
    },
    {
      horizon: '5_years',
      label: '5 年后',
      gain: [
        '如果持续积累，可能形成"某一类问题的专家"职业资产',
        '如果中间主动补课（反馈系统 + 可迁移作品），会保留很多新选择'
      ],
      ignore: [
        '如果什么都不主动改变，可能出现"熟练但不成长"的惯性'
      ],
      next_fork: '方向级判断：5 年后你更可能成为"深耕型"还是"跨界型"？取决于中间有没有主动补能力。'
    }
  ],
  pivotability: {
    level: '中',
    reasons: [
      '能力重叠度：你的软技能（沟通 / 执行）可迁移，但行业硬知识还需要补',
      '现实验证程度：还没有真正体验过目标岗位的日常工作',
      '作品证据：还没有积累与目标方向直接相关的作品'
    ],
    disclaimer: '这不是未来成功概率，而是当前条件下"保留转向空间"的情景判断。'
  },
  if_changed: {
    '如果薪资再低 15% 呢？': '匹配度变化：会超出你可能接受的薪资底线，转向空间收紧——先确认底线，再谈选择。',
    '如果直属领导非常强呢？': '匹配度变化：学习成长权重被满足，工作选择尺里"直属领导"从低升到高，路径可转向度可能提升。',
    '如果我一年后还想转行呢？': '匹配度变化：路径可转向度下降——转行窗口越近，越需要现在就开始攒方向证据，而不是等一年后。'
  }
}

// ---------- 未来分岔: 再寻找版 ----------
export const forkSimulationSearch: ForkSimulation = {
  choice_name: '再寻找',
  nodes: [
    {
      horizon: '6_months',
      label: '6 个月后',
      gain: [
        '拥有更充分的方向探索时间',
        '如果探索有计划，可能拿到更匹配的机会'
      ],
      ignore: [
        '等待成本：没有收入积累，简历出现空窗'
      ],
      next_fork: '下一次关键岔路：你的"等待"是计划性探索，还是无计划焦虑？'
    },
    {
      horizon: '2_years',
      label: '2 年后',
      gain: [
        '如果成功进入匹配方向，起点比"先凑合"更高',
        '沉淀了方向判断能力，下一次选择更稳'
      ],
      ignore: [
        '经济压力可能迫使你降低标准',
        '如果一直"再看看"，可能错过职场起跑节奏'
      ],
      next_fork: '未来转向还缺什么：关键是探索期内是否积累了真实作品与访谈证据。'
    },
    {
      horizon: '5_years',
      label: '5 年后',
      gain: [
        '如果规划得好，可能形成"方向判断力 + 专业能力"双资产'
      ],
      ignore: [
        '如果探索期过长且空转，可能出现"高不成低不就"的惯性'
      ],
      next_fork: '方向级判断：关键是 6 个月探索期是否被过成"有产出的探索"。'
    }
  ],
  pivotability: {
    level: '高',
    reasons: [
      '探索窗口开放，行动自由度大',
      '尚未形成路径惯性，可塑性高'
    ],
    disclaimer: '这不是未来成功概率，而是当前条件下"保留转向空间"的情景判断。'
  },
  if_changed: {
    '如果薪资再低 15% 呢？': '匹配度变化：等待期收入压力上升，可承受探索时间缩短——需要更短周期、更高密度的验证。',
    '如果直属领导非常强呢？': '匹配度变化：出现强领导 + 好行业的机会时，"先工作"的吸引力上升，值得重新权衡。',
    '如果我一年后还想转行呢？': '匹配度变化：探索期补上的方向证据会直接降低一年后转行的成本。'
  }
}

// ---------- 未来分岔: 而立转型版（30-40） ----------
export const forkSimulationMid: ForkSimulation = {
  choice_name: '稳住主业 + 验证第二曲线',
  nodes: [
    {
      horizon: '2_years',
      label: '2 年后',
      gain: [
        '主业保底，副业/新方向完成第一次真实验证',
        '获得"随时能走"的底气，主业内耗明显减少'
      ],
      ignore: [
        '可能忽略：精力被两头拉扯，家庭和睡眠先亮红灯'
      ],
      next_fork: '下一次关键岔路：第二曲线是否跑通"陌生人愿意付费"——跑通再放大，没跑通就及时收。'
    },
    {
      horizon: '5_years',
      label: '5 年后',
      gain: [
        '若第二曲线成立，可能形成"主业 + 副业"双现金流',
        '管理 or 专家的选择基本定型，不再被"该带人了"带节奏'
      ],
      ignore: [
        '路径惯性：30+ 拖得越久，转型的体力与精力成本越高'
      ],
      next_fork: '未来转向还缺什么：可复制的方法论、愿意带你的人、一次"降耗不减收"的岗位重定。'
    },
    {
      horizon: '5_years',
      label: '10 年后（推演）',
      gain: [
        '40 岁前完成"第二曲线验证"的人，下半场选择空间明显更大'
      ],
      ignore: [
        '如果一直只观望不验证，40 岁时再启动成本会翻倍'
      ],
      next_fork: '方向级判断：你更想做"把一件事做深的人"，还是"带人把事做出来的人"？'
    }
  ],
  pivotability: {
    level: '中',
    reasons: [
      '已有 10 年积累可复用，不是从零开始',
      '家庭与精力约束上升，试错空间比 25 岁小',
      '验证方式应"低成本、保底"而非"裸辞豪赌"'
    ],
    disclaimer: '这不是未来成功概率，而是当前条件下"保留转向空间"的情景判断。'
  },
  if_changed: {
    '如果家庭需要你更多时间呢？': '匹配度变化：第二曲线必须"低耗、可远程"，否则会塌——先选能碎片时间做的方向。',
    '如果公司给你管理岗呢？': '匹配度变化：管理线打开，需重新权衡"专家 vs 管理"，别被职级自动推着走。',
    '如果精力明显跟不上了呢？': '匹配度变化：必须降耗，把验证压缩到每周固定几小时，而不是靠熬夜硬扛。'
  }
}

// ---------- 未来分岔: 不惑规划版（40-50） ----------
export const forkSimulationSenior: ForkSimulation = {
  choice_name: '规划人生下半场',
  nodes: [
    {
      horizon: '2_years',
      label: '2 年后',
      gain: [
        '把"经验"产品化：顾问 / 带教 / 轻创业有了第一笔收入',
        '精力分配从"硬扛"转向"可持续"，身体和家庭回血'
      ],
      ignore: [
        '可能忽略：身份从"高管/骨干"变成"自由人"的心理落差'
      ],
      next_fork: '下一次关键岔路：下半场你想要"被需要"（顾问/传承）还是"更自主"（轻事业）？'
    },
    {
      horizon: '5_years',
      label: '5 年后',
      gain: [
        '若经验成功产品化，形成不依赖工资、也不依赖孩子的现金流',
        '"带年轻人"带来新的成就感，替代纯职级快感'
      ],
      ignore: [
        '体力与恢复速度的客观下滑，需把节奏调到可持续'
      ],
      next_fork: '未来转向还缺什么：可交付的方法论、稳定的人脉入口、一个能自主安排时间的角色。'
    },
    {
      horizon: '5_years',
      label: '10 年后（推演）',
      gain: [
        '下半场越早规划，50 岁后越可能"有余裕"而非"被动退休"'
      ],
      ignore: [
        '如果一直把所有赌在孩子或单一工资上，抗风险能力较弱'
      ],
      next_fork: '方向级判断：你留给自己的"第二现金流"和"被需要感"，准备好了没有？'
    }
  ],
  pivotability: {
    level: '中',
    reasons: [
      '经验稀缺但体力有限，卖"判断"比卖"时间"更抗老',
      '家庭与财务约束强，需"低风险、控节奏"',
      '最稳的再出发，往往不是大张旗鼓，而是先种下一小条溪流'
    ],
    disclaimer: '这不是未来成功概率，而是当前条件下"保留转向空间"的情景判断。'
  },
  if_changed: {
    '如果积蓄不够支撑过渡呢？': '匹配度变化：先保主业、用业余把经验产品化，别一上来就断收入。',
    '如果孩子还需要大量支持呢？': '匹配度变化：下半场规划要"先托住自己再托孩子"，把自己稳住才托得住。',
    '如果身体先亮红灯呢？': '匹配度变化：一切重排——精力管理优先于职级与收入，选"降耗不减收"的路。'
  }
}