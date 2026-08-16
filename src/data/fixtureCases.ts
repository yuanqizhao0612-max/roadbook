// ============================================================
// 路书 · Fixture 案例数据 (V0.5 人群分层)
// 职场新人(new_grad) / 而立转型(mid_career) / 不惑规划(senior)
// 普通人案例优先；历史/当代名人只作"跨时代参照"，均含来源、不虚构。
// ============================================================
import type { OrdinaryCase, CaseProfile, SourceRef } from './types'
import { skillsLearnedMap } from './skillsLearned'
import { timelineFollowupsMap } from './timelineFollowups'
import { famousCases } from './famousCases'

function cp(p: CaseProfile): CaseProfile { return p }

// ============================================================
// 职场新人（在校 ～ 工作 3 年）
// ============================================================

// ---------- 和我差不多的人 (现实参照) ----------
export const peerCases: OrdinaryCase[] = [
  {
    id: 'roadbook_entry_demo_001', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '23 岁 | 市场岗 | 拿到普通 Offer',
    who: '23 岁，普通本科，市场岗',
    one_line_choice: '先工作，18 个月后换方向',
    biggest_pitfall: '没确认直属领导是谁，只看了公司名气',
    why_similar: '和你一样：手里已经有一个机会，但心里还是没底，不确定这是不是自己真正想做的方向。',
    time_horizon: '18_months',
    outcome: '入职后发现成长速度远低于预期，直属领导几乎没人管。18 个月后自己补足作品，跳去更匹配的行业。',
    satisfaction: 'mixed',
    if_again: '如果重来，我会在入职前去问清楚：带我的领导是谁，前 90 天到底做什么。',
    advice: '别只看公司名气。先确认三件事：前 90 天做什么、谁给我反馈、一年后我能独立做到什么。',
    stage_tag: 'peer',
    profile_tag: 'offer_choice',
    case_profile: cp({
      education: '普通本科（二本 · 传媒类）',
      company_from: '某电商大厂（零售电商，化名）',
      company_type: '大厂',
      role_from: '市场运营（执行方向）',
      industry_from: '快消 / 电商',
      role_to: '品牌策略',
      industry_to: '新能源汽车',
      salary_from: '税前 8k / 月',
      salary_to: '税前 13k / 月',
      switch_direction: '从「执行型市场投放」转去「策略型品牌建设」——不是换职能，是换职能里的层次 + 行业。',
      why_more_match: '新能源汽车的品牌更看重「讲清楚一个新技术故事」，而不是单纯投流拿量；TA 更想做「能被记住的内容」，而不是每天盯 ROI 表格。',
      industry_diff_note: '快消/电商的品牌岗重「投放 + 转化」，KPI 是 GMV，节奏快像打仗；新能源/硬科技的品牌岗重「认知 + 信任」，KPI 是「让人愿意相信你」，要能讲清技术故事。同一叫「品牌」，每天干的活差很多。'
    })
  },
  {
    id: 'roadbook_entry_demo_002', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '24 岁 | 品牌岗 | 继续找了 2 个月',
    who: '24 岁，品牌岗',
    one_line_choice: '最后去了更匹配的行业',
    biggest_pitfall: '等待期没有计划，以为"继续等"就是探索',
    why_similar: '你也担心太早答应会错过更适合自己的方向——TA 选择了再等，但代价是等待必须真的有计划。',
    time_horizon: '3_months',
    outcome: '两个月里做了 3 次真实行业访谈 + 1 份目标岗位作品，最后被更匹配的公司录用。',
    satisfaction: 'satisfied',
    if_again: '如果重来，我会更早开始访谈，而不是前 3 周光焦虑。',
    advice: '"再等等"不是探索。探索 = 每天有具体动作：访谈、作品、真实体验，缺一不可。',
    stage_tag: 'peer',
    profile_tag: 'offer_choice',
    case_profile: cp({
      education: '普通一本（广告学）',
      company_from: '某 4A 广告公司（乙方，化名）',
      company_type: '乙方 agency',
      role_from: '品牌策划（乙方执行）',
      industry_from: '广告 / 营销服务',
      role_to: '品牌经理（甲方）',
      industry_to: '消费科技（智能硬件）',
      salary_from: '税前 9k / 月',
      salary_to: '税前 15k / 月',
      switch_direction: '从「乙方给所有人做方案」转去「甲方只对自己品牌负责」——同样的品牌能力，但能 own 一个产品。',
      why_more_match: 'TA 更想看自己做的决策带来什么结果，而不是交完方案就结束；甲方品牌能直接拿到用户反馈。',
      industry_diff_note: '乙方品牌岗是「服务多个客户、什么行业都沾一点但都不深」；甲方品牌岗是「只吃透一个行业、对自己品牌的生死负责」。想练深度选甲方，想见多识广选乙方。'
    })
  },
  {
    id: 'roadbook_entry_demo_003', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '25 岁 | 普通本科 | 先工作再探索',
    who: '25 岁，普通本科',
    one_line_choice: '一边工作，一边用一年积累作品完成转向',
    biggest_pitfall: '只积累岗位熟练度，没有提前建立目标方向证据',
    why_similar: '你愿意先进入职场积累，同时保留探索空间——TA 的方法是一边工作一边给新方向攒证据。',
    time_horizon: '12_months',
    outcome: '白天完成本职，晚上每周 3 晚做新方向的真实项目，一年后带着作品集转岗成功。',
    satisfaction: 'satisfied',
    if_again: '如果重来，我会更早把"公司名气"从第一位放下来。',
    advice: '工作不是牢笼。真正重要的问题是：我有没有用业余时间给未来的自己攒证据。',
    stage_tag: 'peer',
    profile_tag: 'offer_choice',
    case_profile: cp({
      education: '普通本科（理工科）',
      company_from: '某 SaaS 创业公司（化名）',
      company_type: '创业公司',
      role_from: '用户运营',
      industry_from: '企业服务（toB SaaS）',
      role_to: '内容 / 社区运营',
      industry_to: '知识付费 / 教育',
      salary_from: '税前 10k / 月',
      salary_to: '税前 12k / 月（转岗后半年涨到 14k）',
      switch_direction: '从「帮销售维护客户」转去「用内容吸引想要学习的人」——更贴近 TA 想做的「帮人成长」的事。',
      why_more_match: 'toB 运营像「售后客服」，TA 想做的是「让人主动来找我」，所以转去教育内容。',
      industry_diff_note: 'toB 运营重「续费 + 客情」，toC 内容运营重「涨粉 + 互动」。一个对内稳，一个对外热闹。'
    })
  }
]

// ---------- 走过 3-5 年的人 (后来回看) ----------
export const lookbackCases: OrdinaryCase[] = [
  {
    id: 'roadbook_entry_demo_004', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '27 岁 | 回头看第一份工作',
    who: '27 岁，产品经理，工作 5 年',
    one_line_choice: '第一份工作干了 11 个月就换了',
    biggest_pitfall: '把"很累"误当成"不适合"，其实只是没人教',
    why_similar: '你正在担心"这条路适不适合我"。回看的人告诉你：当时判断"适合与否"的方法，比选择本身更重要。',
    time_horizon: '5_years',
    outcome: '换到第二份工作后才发现，第一份的累是因为没反馈机制，不是行业问题。现在回头看：如果当时会提问，可能不用换。',
    satisfaction: 'mixed',
    if_again: '如果重来，我会在离职前先做 3 次"向上确认"：我对标的是谁、差在哪、怎么补。',
    advice: '判断一份工作值不值得留，先问三个问题：我在成长还是在变熟练？谁给我反馈？一年后我能独立做到什么？',
    stage_tag: 'lookback',
    profile_tag: 'first_job_retrospect',
    case_profile: cp({
      education: '985 本科（信息管理）',
      company_from: '某本地生活大厂（化名）',
      company_type: '大厂',
      role_from: '产品助理',
      industry_from: '本地生活 / 互联网',
      role_to: '产品经理',
      industry_to: '企业协作工具（toB）',
      salary_from: '税前 12k / 月',
      salary_to: '税前 20k / 月',
      switch_direction: '从「大厂里一颗螺丝」转去「小团队里能 own 一条线」——同一职能，但责任范围完全不同。',
      why_more_match: '大厂里 TA 的活太碎，学不到「从 0 想清楚一件事」；toB 小团队逼着 TA 独立做决策。',
      industry_diff_note: '大厂产品重「在已有大盘里优化转化率」；创业公司产品重「从 0 搭一个能用的东西」。一个练精细，一个练全面。'
    })
  },
  {
    id: 'roadbook_entry_demo_005', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '29 岁 | 转行成功的人回头看',
    who: '29 岁，运营转数据分析，工作 6 年',
    one_line_choice: '用了 8 个月业余时间低风险转行',
    biggest_pitfall: '一开始就想"辞职全职学"，差点断掉现金流',
    why_similar: '你和 TA 一样面临"要不要放掉已有积累换方向"。TA 的答案是：先验证，再切换。',
    time_horizon: '18_months',
    outcome: '8 个月业余学习 + 3 个真实项目 + 1 次内部转岗试水，第 9 个月正式转岗，薪资持平原地转。',
    satisfaction: 'satisfied',
    if_again: '如果重来，我会更早开始做真实项目，而不是先刷完课程。',
    advice: '转行不是"辞职-学习-找新工作"三段式。是"上班养活自己，业余攒证据，低风险切换"。',
    stage_tag: 'lookback',
    profile_tag: 'career_transition',
    case_profile: cp({
      education: '普通一本（社会学）',
      company_from: '某内容平台（社区运营，化名）',
      company_type: '中厂',
      role_from: '社区运营',
      industry_from: '内容 / 社区',
      role_to: '数据分析师',
      industry_to: '同一家公司（内部转岗）',
      salary_from: '税前 13k / 月',
      salary_to: '转岗后持平 13k，1 年后 17k',
      switch_direction: '从「凭感觉做活动」转去「用数据看活动到底有没有用」——不是换行业，是给同一份工作换了一套更硬的本领。',
      why_more_match: '运营做到后面容易「重复自己」，数据能力让 TA 从「做执行」变成「判断做什么」；而且内部转岗保留了现金流。',
      industry_diff_note: '这里没换行业，所以不算品牌岗的例子；但说明「转行」不一定要换公司——同一家公司内部转岗，性价比最高、风险最低。'
    })
  }
]

// ============================================================
// 而立转型（30-40 岁）
// ============================================================
export const midCareerCases: OrdinaryCase[] = [
  {
    id: 'roadbook_entry_mid_001', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '33 岁 | 产品经理 | 管理还是专家',
    who: '33 岁，互联网产品经理，工作 10 年',
    one_line_choice: '没硬转管理，先走"窄而深"的专家路线',
    biggest_pitfall: '30 岁出头被"到了年纪该带人"的暗示推着走',
    why_similar: '你也卡在"是不是该往上走管理"的岔路口。TA 的经历说：管理不是唯一上进路径，先想清楚自己擅长"把事做深"还是"带人把事做出来"。',
    time_horizon: '24_months',
    outcome: '选了专家线，两年后成为某业务线唯一懂核心链路的人，薪资反超同年限管理岗，且不用背团队 KPI。',
    satisfaction: 'satisfied',
    if_again: '如果重来，我会更早和上级聊清"专家线到底能走到哪、有没有对等回报"。',
    advice: '30+ 不要被"该带人了"带节奏。专家线和管理线都能到高处，关键是哪条线你真的做得好、也愿意做。',
    stage_tag: 'lookback',
    profile_tag: 'expert_vs_manager',
    case_profile: cp({
      education: '985 本科（软件工程）',
      company_from: '某大厂（业务产品，化名）',
      company_type: '大厂',
      role_from: '高级产品经理',
      industry_from: '互联网',
      role_to: '业务线专家（P 序列）',
      industry_to: '同一家大厂',
      salary_from: '税前 32k / 月',
      salary_to: '税前 48k / 月',
      switch_direction: '从「被推着去带 5 人小团队」转去「把一条业务链路吃透做深」——同一职级，不同活法。',
      why_more_match: 'TA 发现自己一开周会就累、一做深度方案就兴奋，所以专家线更贴合天性。',
      industry_diff_note: '管理线重「通过别人拿结果、背团队指标」；专家线重「自己是最终答案、靠深度被需要」。30+ 选错线，内耗会比 25 岁时大得多。'
    })
  },
  {
    id: 'roadbook_entry_mid_002', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '36 岁 | 运营 | 副业跑通了第二曲线',
    who: '36 岁，内容运营，工作 12 年',
    one_line_choice: '用两年把副业做成能覆盖 40% 开支的"第二条腿"',
    biggest_pitfall: '前半年把副业当发泄，没当成生意，白忙',
    why_similar: '你也想"给自己留条后路"，但怕副业只是自我感动。TA 的做法是：先验证能赚到第一笔陌生人的钱，再加大投入。',
    time_horizon: '24_months',
    outcome: '副业从接小单到做付费专栏，第 2 年稳定月入约等于主业四成，主业反而更敢拒绝无意义的内耗。',
    satisfaction: 'satisfied',
    if_again: '会更早定"副业赚到 X 元才算验证通过"的硬指标，而不是凭感觉坚持。',
    advice: '30+ 的第二曲线不是"离职去追梦"，是"主业保底、副业验证、跑通再放大"。先有收入证据，再谈身份转变。',
    stage_tag: 'lookback',
    profile_tag: 'second_curve',
    case_profile: cp({
      education: '普通一本（新闻）',
      company_from: '某内容平台（化名）',
      company_type: '中厂',
      role_from: '内容运营专家',
      industry_from: '内容 / 社区',
      role_to: '知识付费主理人（副业）',
      industry_to: '自媒体 / 知识付费',
      salary_from: '税前 22k / 月',
      salary_to: '主业持平 + 副业月均 9k（第 2 年）',
      switch_direction: '从「只靠一份工资」转去「主业 + 副业双现金流」——不是换行，是给自己加一条安全带。',
      why_more_match: 'TA 担心 35+ 被优化，副业验证后才有了"随时能走"的底气。',
      industry_diff_note: '副业和主业是两套能力：主业重「在组织里协作拿结果」，副业重「独自对用户负责、自己定价」。想练独立生存能力，副业是最好的低成本的练手。'
    })
  },
  {
    id: 'roadbook_entry_mid_003', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '38 岁 | 工程师 | 被优化后重新定位',
    who: '38 岁，后端工程师，工作 15 年',
    one_line_choice: '没硬刚"继续写代码"，转去"带技术 + 做方案"',
    biggest_pitfall: '把"被裁"当成能力否定，沉了三个月才动',
    why_similar: '你也可能担心"35+ 这道坎"。TA 的经历说：被优化常常是结构问题不是你的问题，关键是别用情绪代替重新定位。',
    time_horizon: '12_months',
    outcome: '用 4 个月把经验打包成"技术 + 业务方案"能力，去了一家想补短板的中型公司做技术负责人，薪资没降、话语权更高。',
    satisfaction: 'mixed',
    if_again: '如果重来，被约谈当天就开始更新作品和对外联络，不给自己空白期。',
    advice: '35+ 不是终点。纯写代码会被更便宜的人替代，但"懂业务 + 能带队落地"的经验很难被替代。重新定位，不是重头再来。',
    stage_tag: 'lookback',
    profile_tag: 'career_transition',
    case_profile: cp({
      education: '211 本科（计算机）',
      company_from: '某大厂（化名）',
      company_type: '大厂',
      role_from: '资深后端工程师',
      industry_from: '互联网',
      role_to: '技术负责人',
      industry_to: '中型科技公司（toB）',
      salary_from: '税前 38k / 月',
      salary_to: '税前 40k / 月（含团队管理职责）',
      switch_direction: '从「个人贡献者写代码」转去「带人 + 定技术方案」——同样的工程背景，但价值从"写"变成"让对的事被做出来"。',
      why_more_match: '纯编码岗 38 岁性价比被压，但踩过坑、能避坑的经验在中小公司是稀缺资源。',
      industry_diff_note: '大厂重「单点极致、有人兜底」；中小公司重「你要能兜底、一个人顶半条线」。35+ 去中小公司，卖的是"稳"，不是"快"。'
    })
  },
  {
    id: 'roadbook_entry_mid_004', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '35 岁 | 市场 | 生育后回归职场',
    who: '35 岁，品牌市场，工作 10 年（中断 1.5 年）',
    one_line_choice: '没急着回原岗，先以"项目制"重新接入',
    biggest_pitfall: '一上来就投全职，被"空窗期"问到没信心',
    why_similar: '你也可能在家庭与事业之间重启。TA 的经历说：回归不一定要一步到位，先用项目证明"我还能打"，再谈全职。',
    time_horizon: '18_months',
    outcome: '先做 3 个月项目顾问，产出被认可后转全职，薪资比中断前还高 10%，且争取到弹性安排。',
    satisfaction: 'satisfied',
    if_again: '会更早用作品和案例说话，而不是在简历空窗上解释自己。',
    advice: '重启职场，作品比解释更有力。先接一个能写进案例的小项目，比海投十份简历更有用。',
    stage_tag: 'lookback',
    profile_tag: 'restart',
    case_profile: cp({
      education: '普通一本（市场营销）',
      company_from: '某快消大厂（化名）',
      company_type: '大厂',
      role_from: '品牌经理',
      industry_from: '快消',
      role_to: '品牌顾问 → 全职',
      industry_to: '消费科技',
      salary_from: '税前 20k / 月（中断前）',
      salary_to: '税前 22k / 月（回归后）',
      switch_direction: '从「全职妈妈空白期」转去「项目制顾问再转正」——绕开空窗质疑，用产出说话。',
      why_more_match: 'TA 不想一上来背全职 KPI，项目制让她先找回节奏、也向市场证明价值。',
      industry_diff_note: '回归职场，"证明还能打"比"解释为什么空窗"重要。项目制是低姿态、高证据的重启方式。'
    })
  }
]

// ============================================================
// 不惑规划（40-50 岁）
// ============================================================
export const seniorCases: OrdinaryCase[] = [
  {
    id: 'roadbook_entry_sen_001', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '43 岁 | 中层管理 | 继续拼还是退一步',
    who: '43 岁，制造业中层，工作 20 年',
    one_line_choice: '没急流勇退，也没死扛，先"降耗不减收"',
    biggest_pitfall: '把"还能拼"当成"必须拼"，身体先亮了红灯',
    why_similar: '你也站在"人生下半场怎么过"的路口。TA 的经历说：40+ 不是退，是换一种更可持续的打法。',
    time_horizon: '36_months',
    outcome: '从"连轴转的管理岗"转到"带教 + 战略"的顾问型角色，收入持平但精力留给身体和家庭，反而走得更远。',
    satisfaction: 'satisfied',
    if_again: '如果重来，会在 40 岁就把"精力管理"和"钱"放在同一权重，而不是只盯职级。',
    advice: '40+ 的选择题，答案往往不是"拼 or 不拼"，而是"怎么拼得动、拼得久"。把精力当资产管。',
    stage_tag: 'lookback',
    profile_tag: 'second_half',
    case_profile: cp({
      education: '普通本科（机械）',
      company_from: '某制造集团（化名）',
      company_type: '国企/大型制造',
      role_from: '工厂厂长',
      industry_from: '制造业',
      role_to: '运营顾问（带教型）',
      industry_to: '同一集团内转岗',
      salary_from: '税前 35k / 月',
      salary_to: '税前 34k / 月（精力成本大降）',
      switch_direction: '从「自己冲在一线救火」转去「培养人、定打法」——同样的资历，换了一种可持续的用法的。',
      why_more_match: 'TA 体检出问题后才意识到：靠硬扛换来的职级，代价是健康和陪伴家人的时间。',
      industry_diff_note: '40+ 在制造业，"自己干"会越来越贵（身体、时间）；"让人能干"才越老越值钱。把经验变成可复制的方法，是下半场的核心资产。'
    })
  },
  {
    id: 'roadbook_entry_sen_002', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '46 岁 | 创业者 | 公司卖掉后空了',
    who: '46 岁，连续创业者，第一次创业变现',
    one_line_choice: '没马上再创业，先用一年想清楚"下半场为谁干"',
    biggest_pitfall: '以为"不创业就失落"，没给自己缓冲期',
    why_similar: '你也可能经历"阶段性成功后的空虚"。TA 的经历说：40+ 再出发，动力要从"证明自己"转向"这件事值不值得"。',
    time_horizon: '24_months',
    outcome: '用一年做天使+带年轻人，第 2 年以"合伙人 + 导师"身份加入一家小公司，不求控股只求参与感。',
    satisfaction: 'mixed',
    if_again: '会更早接受"成功之后也需要重新找意义"，而不是硬撑忙碌感。',
    advice: '40+ 的"再出发"不必再赌上身家。把经验当筹码、把时间当本金，做"参与但不必全控"的事，反而更轻松。',
    stage_tag: 'lookback',
    profile_tag: 'second_half',
    case_profile: cp({
      education: '985 本科（电子）',
      company_from: '自创公司（已并购，化名）',
      company_type: '创业公司',
      role_from: '创始人 / CEO',
      industry_from: '智能硬件',
      role_to: '天使 + 合伙人（导师型）',
      industry_to: '早期投资 / 创业服务',
      salary_from: '变现后财务自由',
      salary_to: '不再领高薪，靠投资与顾问费',
      switch_direction: '从「自己当老大」转去「帮别人当老大」——身份变了，但经验还在场。',
      why_more_match: 'TA 发现再创一次业的心力不够，但"帮年轻人少走弯路"让他重新有成就感。',
      industry_diff_note: '40+ 创业，"控盘"的快感会下降，"传承"的满足会上升。把角色从发动机换成教练，是很多人下半场的自然落点。'
    })
  },
  {
    id: 'roadbook_entry_sen_003', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '48 岁 | 外企 | 裁员后用积蓄过渡做顾问',
    who: '48 岁，外企市场总监，工作 25 年',
    one_line_choice: '没急着找下一份全职，先用积蓄 + 人脉做轻顾问',
    biggest_pitfall: '一开始降薪海投，越投越怀疑自己',
    why_similar: '你也担心"这个年纪是不是没人要了"。TA 的经历说：外企光环会随年龄褪色，但 25 年踩坑攒下的判断力不会。',
    time_horizon: '18_months',
    outcome: '做轻咨询 1 年，只接熟悉的行业，月入约为原薪六成但零通勤零内耗；同时把经验写成方法论课，开辟新收入。',
    satisfaction: 'satisfied',
    if_again: '会更早接受"下半场收入可以少一点、但要更自主"。',
    advice: '40+ 找工作，别和 30 岁比时薪。比的是"单位精力换来的自由和控制感"。把经验产品化，比卖时间更抗老。',
    stage_tag: 'lookback',
    profile_tag: 'second_half',
    case_profile: cp({
      education: '海外硕士（MBA）',
      company_from: '某外资 500 强（化名）',
      company_type: '外企',
      role_from: '市场总监',
      industry_from: '快消 / 外企',
      role_to: '独立顾问',
      industry_to: '同行业轻咨询',
      salary_from: '税前 55k / 月',
      salary_to: '顾问月均约 33k（自由支配时间）',
      switch_direction: '从「大平台高管」转去「自己的小作坊」——收入降了，但时间和选择权回到自己手里。',
      why_more_match: 'TA 不想再为别人的 KPI 熬夜，想把 25 年经验变成"只接想接的活"。',
      industry_diff_note: '外企高管 48 岁再求职很被动（性价比被质疑），但"以顾问身份卖经验"反而稀缺。把头衔换成可交付的方法，路就宽了。'
    })
  },
  {
    id: 'roadbook_entry_sen_004', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '45 岁 | 国企 | 为下一代规划 vs 自己',
    who: '45 岁，体制内科级，工作 22 年',
    one_line_choice: '没全为娃牺牲，先稳住自己的"第二现金流"',
    biggest_pitfall: '差点把全部精力扑在孩子升学，忘了自己也会老',
    why_similar: '你也在"为孩子"和"为自己"之间拉扯。TA 的经历说：父母的下半场，先把自己托住，才托得住孩子。',
    time_horizon: '30_months',
    outcome: '用业余把爱好（书法 + 社群）做成小规模付费社群，月入补家用；同时把陪伴孩子变成"一起学"，关系反而更好。',
    satisfaction: 'satisfied',
    if_again: '会更早告诉自己：为孩子最好的方式，是让他看到你也在认真生活。',
    advice: '40+ 的父母，最稳的规划不是替孩子铺路，是让自己有一条不依赖工资、也不依赖孩子的收入与状态。',
    stage_tag: 'lookback',
    profile_tag: 'family_plan',
    case_profile: cp({
      education: '普通一本（中文）',
      company_from: '某事业单位（化名）',
      company_type: '体制内',
      role_from: '科级管理',
      industry_from: '体制内',
      role_to: '兴趣社群主理人（业余）',
      industry_to: '文创 / 教育',
      salary_from: '税前 15k / 月（稳定）',
      salary_to: '主业持平 + 社群月均 4k',
      switch_direction: '从「只为娃活」转去「自己也有一条小溪流」——不是换工作，是找回自己的支点。',
      why_more_match: 'TA 发现越把所有赌在孩子身上，自己越焦虑、亲子越紧绷；有自己的事反而松弛。',
      industry_diff_note: '体制内 45 岁往上空间有限，但"经验 + 兴趣产品化"是低风险的下半场补充。先小做，再决定是否放大。'
    })
  }
]

// ============================================================
// 历史 / 当代名人（跨时代参照，必须含来源、不虚构）
// 按 audience 推送：新人→鲁迅；而立→雷军 / JK·罗琳；不惑→褚时健 / 稻盛和夫 / 苏轼
// ============================================================
export const notableFigureCases: OrdinaryCase[] = [
  {
    id: 'historical_luxun_001', audience: 'new_grad',
    source_marker: 'demo_fixture', notable: true,
    title: '鲁迅年轻时，其实也换过一次很大的方向',
    who: '二十岁出头的鲁迅，一开始学医',
    one_line_choice: '学了医，后来决定不沿着已经学了很久的路走下去',
    biggest_pitfall: '如果只把"学了很久"当作不能放弃的理由，就可能错过更重要的东西',
    why_similar: '你是刚毕业或工作几年的普通人，当然不能直接拿鲁迅比。但你们遇到的结构是一样的：已经走了一段的路，要不要因为发现了更重要的东西而改变。',
    time_horizon: 'historical',
    outcome: '他后来用文字影响了非常多人的想法。但注意：这是多年后的结果，不代表他当年的选择每一步都正确。',
    satisfaction: 'mixed',
    if_again: '历史无法假设。所以这页的重点不是"他成功了所以换方向是对的"，而是他当时的判断方法。',
    advice: '换方向之前，先确认三件事：是不是不喜欢这类事本身；新方向是否有过一次真实体验；如果真的不适合，有没有退路。',
    stage_tag: 'historical',
    profile_tag: 'direction_change',
    sources: [
      { source_id: 'src_luxun_001', title: '《呐喊·自序》（鲁迅自述学医与弃医经过）', publisher_or_author: '鲁迅', url_or_bibliography: '《呐喊》1923 年集子中的自序', date: '1923', source_type: 'primary', supported_claims: ['鲁迅早年赴日本学医', '自述因"幻灯片事件"等经历改变想法', '放弃学医转向文艺事业'] },
      { source_id: 'src_luxun_002', title: '《鲁迅年谱》等公开史料整理', publisher_or_author: '学术界公开整理', url_or_bibliography: '公开出版史料', date: '综合', source_type: 'reputable_secondary', supported_claims: ['弃医从文是公开记载的人生转折', '学界对其动机有不同解读，不存在唯一确定性结论'] }
    ]
  },
  {
    id: 'notable_leijun_001', audience: 'mid_career',
    source_marker: 'demo_fixture', notable: true,
    title: '雷军：40 岁创办小米，把自己归零重来',
    who: '雷军，40 岁创办小米（2010），此前已是金山CEO、天使投资人',
    one_line_choice: '在"已经很成功"的年纪，选择再创业、从零做手机',
    biggest_pitfall: '把"之前的成功"当护身符，反而更容易低估从零开始的难',
    why_similar: '你 30+ 也在想"要不要赌一把大的"。雷军的故事不是"成功学"，而是：人在中点，也可以主动重写剧本——但他前提是已经积累了几十年，不是凭空出发。',
    time_horizon: 'historical',
    outcome: '小米 2010 年成立，2018 年港交所上市，成为世界级手机与 IoT 公司。公开资料显示这是他 40 岁后的二次创业。',
    satisfaction: 'satisfied',
    if_again: '（历史人物无法假设）值得带走的是：他选择在精力仍旺时主动变，而不是等被推着变。',
    advice: '30+ 想"再选一次"，关键是先确认：你是在逃离现在的累，还是真的有了更想做的方向？雷军是后者，且带着前 20 年的积累。',
    stage_tag: 'historical',
    profile_tag: 'second_curve',
    sources: [
      { source_id: 'src_leijun_001', title: '小米集团招股书及公开年报', publisher_or_author: 'Xiaomi Inc.', url_or_bibliography: '港交所披露易 / 小米官网投资者关系', date: '2018', source_type: 'primary', supported_claims: ['小米于 2010 年成立', '雷军为创始人、董事长兼 CEO', '2018 年于香港上市'] },
      { source_id: 'src_leijun_002', title: '雷军公开演讲与传记（如《一往无前》）', publisher_or_author: '公开出版 / 雷军公开演讲', url_or_bibliography: '中信出版《一往无前》等', date: '综合', source_type: 'reputable_secondary', supported_claims: ['雷军 40 岁创办小米前有金山、天使投资经历', '其公开表述强调"顺势而为"与长期投入'] }
    ]
  },
  {
    id: 'notable_rowling_001', audience: 'mid_career',
    source_marker: 'demo_fixture', notable: true,
    title: 'J.K. 罗琳：30 多岁、单亲、领救济，才写出哈利波特',
    who: '罗琳，约 32 岁出版《哈利波特》第一本，此前经历离婚与失业',
    one_line_choice: '在最难的低谷，把写作这件"不被看好"的事坚持下来',
    biggest_pitfall: '把"现在处境差"误读成"这辈子就到这了"',
    why_similar: '你也可能在 30+ 觉得"是不是已经晚了"。罗琳的故事说：晚不代表没机会，但前提是那件你真正想做的事，有没有在低谷里继续做。',
    time_horizon: 'historical',
    outcome: '《哈利波特》1997 年出版，日后成为全球畅销书与电影系列。公开资料显示她曾靠救济金生活、被拒稿多次。',
    satisfaction: 'satisfied',
    if_again: '（历史人物无法假设）值得带走的是：她不是在"条件好了才做"，而是在条件最差时也没停笔。',
    advice: '30+ 别用"已经晚了"给自己设限。真正要问的是：那件你真正想做的事，今天有没有为它花哪怕半小时。',
    stage_tag: 'historical',
    profile_tag: 'restart',
    sources: [
      { source_id: 'src_rowling_001', title: '《哈利波特与魔法石》初版信息', publisher_or_author: 'J.K. Rowling / Bloomsbury', url_or_bibliography: '1997 年英国首版', date: '1997', source_type: 'primary', supported_claims: ['第一本于 1997 年出版', '作者时为成年、初为人母'] },
      { source_id: 'src_rowling_002', title: '罗琳公开访谈与传记（如《J.K. Rowling: A Biography》）', publisher_or_author: '公开出版 / BBC 等访谈', url_or_bibliography: '公开传记与访谈整理', date: '综合', source_type: 'reputable_secondary', supported_claims: ['曾靠救济金生活', '早期被多家出版社拒绝', '出版时约 32 岁'] }
    ]
  },
  {
    id: 'notable_chushiye_001', audience: 'senior',
    source_marker: 'demo_fixture', notable: true,
    title: '褚时健：74 岁种橙子，把"下半场"种活了',
    who: '褚时健，曾执掌红塔集团，古稀之年再创业种"褚橙"',
    one_line_choice: '在人生最低谷之后，用农业重新证明自己',
    biggest_pitfall: '把"年纪大了"当借口，反而错过了还能做事的窗口',
    why_similar: '你 40+ 也在想"是不是该歇了"。褚时健的故事不是鸡汤，而是：只要身体和脑子还在，下半场照样能开出新局——但他付出的是实打实的十年耕耘。',
    time_horizon: 'historical',
    outcome: '褚橙成为知名农产品品牌。公开资料显示他 70 多岁开始种植、多年后规模化。这是长期主义的公开案例。',
    satisfaction: 'satisfied',
    if_again: '（历史人物无法假设）值得带走的是：他没有把"遭遇"当成终点，而是当成另一段事的起点。',
    advice: '40+ 的"再出发"不一定要大张旗鼓。先问：我手里还有什么别人替代不了的经验？把它种下去，时间会给你结果。',
    stage_tag: 'historical',
    profile_tag: 'second_half',
    sources: [
      { source_id: 'src_chushiye_001', title: '《褚时健传》等公开传记', publisher_or_author: '公开出版传记', url_or_bibliography: '中信出版社等公开出版', date: '综合', source_type: 'reputable_secondary', supported_claims: ['曾执掌红塔集团', '古稀之年开始种植冰糖橙（"褚橙"）', '晚年成为农业创业公开案例'] },
      { source_id: 'src_chushiye_002', title: '公开报道与访谈整理', publisher_or_author: '媒体公开报道', url_or_bibliography: '主流媒体公开报道', date: '综合', source_type: 'reputable_secondary', supported_claims: ['褚橙为长期耕耘成果', '其经历常被引为"触底反弹"案例'] }
    ]
  },
  {
    id: 'notable_kazuo_001', audience: 'senior',
    source_marker: 'demo_fixture', notable: true,
    title: '稻盛和夫：78 岁临危受命，重建日航',
    who: '稻盛和夫，京瓷与 KDDI 创始人，78 岁出任破产日航 CEO',
    one_line_choice: '在很多人准备收山的年纪，接下"几乎不可能"的任务',
    biggest_pitfall: '把"年纪大了就该歇"当成理所当然，反而浪费了最值钱的经验',
    why_similar: '你 40+ 也在盘算"还能不能再来一次"。稻盛的例子说：经验越老越值钱，关键是你愿不愿意在别人需要时被用。',
    time_horizon: 'historical',
    outcome: '日航在破产重建后重新上市。公开资料显示他 78 岁接手、以"阿米巴经营"与哲学改造企业。',
    satisfaction: 'satisfied',
    if_again: '（历史人物无法假设）值得带走的是：他不是靠体力赢，是靠几十年沉淀的方法与心法。',
    advice: '40+ 最大的资产不是体力，是"踩过坑后形成的判断"。把你的判断变成可教给别人的方法，就是下半场最稳的依靠。',
    stage_tag: 'historical',
    profile_tag: 'second_half',
    sources: [
      { source_id: 'src_kazuo_001', title: '《活法》《稻盛和夫自传》', publisher_or_author: '稻盛和夫', url_or_bibliography: 'Sunmark / 东方出版社等公开出版', date: '综合', source_type: 'primary', supported_claims: ['创办京瓷、KDDI', '78 岁出任破产日本航空 CEO 主导重建'] },
      { source_id: 'src_kazuo_002', title: '日航重建公开报道', publisher_or_author: '公开媒体报道', url_or_bibliography: '主流财经媒体公开报道', date: '综合', source_type: 'reputable_secondary', supported_claims: ['日航破产保护后在其主导下重建', '重建后重新上市为公开记载'] }
    ]
  },
  {
    id: 'notable_sushi_001', audience: 'senior',
    source_marker: 'demo_fixture', notable: true,
    title: '苏轼：44 岁被贬黄州，写出一生最通透的文字',
    who: '苏轼，北宋文人，中年屡遭贬谪',
    one_line_choice: '在被命运按下低谷时，把困境活成了境界',
    biggest_pitfall: '把"被否定"等同于"我没用了"，困在情绪里',
    why_similar: '你 40+ 也可能遇到"被边缘、被看轻"。苏轼的经历说：外在的起落管不了，但怎么看待起落，是自己能练的。',
    time_horizon: 'historical',
    outcome: '黄州时期写成《赤壁赋》《念奴娇·赤壁怀古》等。公开史料记载其中年屡贬、却文学与人格影响深远。',
    satisfaction: 'mixed',
    if_again: '（历史人物无法假设）值得带走的是：他没把逆境当成终点，而是当成认识自己的契机。',
    advice: '40+ 的心法，很多时候不是"赢"，是"稳"。练习把外界的评判和自己的价值分开，是下半场最重要的内功。',
    stage_tag: 'historical',
    profile_tag: 'second_half',
    sources: [
      { source_id: 'src_sushi_001', title: '《苏轼文集》《赤壁赋》', publisher_or_author: '苏轼', url_or_bibliography: '《东坡七集》等', date: '北宋', source_type: 'primary', supported_claims: ['黄州时期作《赤壁赋》等', '中年屡遭贬谪'] },
      { source_id: 'src_sushi_002', title: '《宋史·苏轼传》等公开史料', publisher_or_author: '脱脱等撰《宋史》', url_or_bibliography: '公开出版二十四史', date: '元', source_type: 'reputable_secondary', supported_claims: ['苏轼仕途起伏、多次被贬', '文学与人格影响为公开记载'] }
    ]
  }
]

// ============================================================
// 不同职业背景路书页（新人向，扩写同岗不同行业）
// ============================================================
export const backgroundVarietyEntries: OrdinaryCase[] = [
  {
    id: 'roadbook_entry_demo_006', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '26 岁 | 程序员 | 被大厂 Offer 诱惑',
    who: '26 岁，后端开发',
    one_line_choice: '放弃大厂，选了成长密度更高的小团队',
    biggest_pitfall: '只看薪资涨幅，没评估学习密度',
    why_similar: '职业不同，但"高薪 vs 成长"的权衡和你现在很像。',
    time_horizon: '12_months',
    outcome: '小团队一年后独立带一个模块，技术成长明显快于预期；薪资 2 年后追平。',
    satisfaction: 'satisfied',
    if_again: '还是会选小团队，但会提前谈清楚股权和晋升机制。',
    advice: '薪资是可谈判的，学习密度是稀缺的。先算"一年后我值多少钱"。',
    stage_tag: 'lookback',
    profile_tag: 'offer_choice',
    case_profile: cp({
      education: '211 本科（计算机）',
      company_from: '某大厂（外包岗，化名）',
      company_type: '大厂（外包）',
      role_from: '后端开发',
      industry_from: '互联网',
      role_to: '后端开发（核心岗）',
      industry_to: 'AI 应用创业公司',
      salary_from: '税前 18k / 月（大厂外包）',
      salary_to: '税前 16k / 月（2 年后股权 + 涨薪到 30k）',
      switch_direction: '从「大厂名头 + 高薪但边缘」转去「小团队核心 + 成长快」——典型的「薪资 vs 成长」权衡。',
      why_more_match: '大厂外包岗学不到核心，简历光环 2 年后就没了；小团队让他 1 年独当一面。',
      industry_diff_note: '不属品牌岗，但同样是「高薪 vs 成长」：大厂边缘岗 vs 小团队核心岗，前者安稳但容易被替代，后者苦但不可替代。'
    })
  },
  {
    id: 'roadbook_entry_demo_007', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '28 岁 | 公务员 | 想出来又不敢',
    who: '28 岁，体制内',
    one_line_choice: '没裸辞，用 1 年业余时间试水自由职业',
    biggest_pitfall: '以为"稳定"是一条不能回头的路',
    why_similar: '你担心"换了就回不去"。TA 的做法是先留退路再验证，值得参考。',
    time_horizon: '15_months',
    outcome: '业余接单 12 个月后证明收入可达 60%，才正式谈离职。全程没有空窗焦虑。',
    satisfaction: 'satisfied',
    if_again: '会更早开始接第一单，而不是犹豫半年。',
    advice: '很多人不是没能力转，是不允许自己"边上班边试"。先留一根安全带再探索，心理压力完全不同。',
    stage_tag: 'lookback',
    profile_tag: 'career_transition',
    case_profile: cp({
      education: '普通一本（法学）',
      company_from: '某区直机关（化名）',
      company_type: '体制内',
      role_from: '综合管理',
      industry_from: '体制内',
      role_to: '自由职业（自媒体 + 咨询）',
      industry_to: '知识付费 / 自媒体',
      salary_from: '税前 9k / 月（稳定）',
      salary_to: '业余接单月均 6k，证明可达原收入 60% 后离职',
      switch_direction: '从「稳定但看不到成长」转去「不确定但能用自己的脑子」——先留退路验证。',
      why_more_match: 'TA 不是讨厌稳定，是讨厌「每天做的事 5 年后还是一样」；用 1 年证明自己能活，才走。',
      industry_diff_note: '体制内重「流程 + 稳妥」，自由职业重「自我驱动 + 收入波动」。适合「想清楚自己能扛波动」的人。'
    })
  },
  {
    id: 'roadbook_entry_demo_008', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '22 岁 | 应届生 | 家里催着考编',
    who: '22 岁，应届生',
    one_line_choice: '先接了 Offer，同时报考考证保留选择权',
    biggest_pitfall: '把家人的期望当成了自己的选择',
    why_similar: '你也在被"应该怎么做"影响判断。TA 的选择是：都保留，先不急着二选一。',
    time_horizon: '6_months',
    outcome: '入职半年后发现实际工作比自己想象的好，考编计划自然淡出。',
    satisfaction: 'mixed',
    if_again: '会和家人更早沟通自己的真实想法，而不是拖延回避。',
    advice: '"选 A 还是选 B"往往是假问题。真正的问题是你敢不敢同时准备，等证据说话。',
    stage_tag: 'peer',
    profile_tag: 'expectation_conflict',
    case_profile: cp({
      education: '双非本科（汉语言）',
      company_from: '某地方国企（校招，化名）',
      company_type: '国企',
      role_from: '行政管培',
      industry_from: '国企 / 传统',
      role_to: '留任（考编计划淡出）',
      industry_to: '同一家国企',
      salary_from: '税前 6k / 月',
      salary_to: '转正 7k / 月',
      switch_direction: '从「被家人推着考编」转去「先干着、让证据说话」——没真换方向，是放下执念。',
      why_more_match: '入职后发现实际工作比想象的好，不需要用考编证明自己。',
      industry_diff_note: '不属品牌岗。'
    })
  },
  {
    id: 'roadbook_entry_demo_009', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '26 岁 | 品牌岗 | 从快消跳到新能源',
    who: '26 岁，品牌岗',
    one_line_choice: '没换职能，是换了个"品牌岗完全不一样"的行业',
    biggest_pitfall: '以为所有公司的"品牌岗"长得一样，没先问清每天到底干啥',
    why_similar: '你也纠结"品牌岗到底去哪个行业更好"。TA 的经历正好回答：同样叫品牌，不同行业每天干的活差很大。',
    time_horizon: '14_months',
    outcome: '在快消美妆做了 2 年品牌专员，跳到新能源汽车做品牌策略，薪资涨了 60%，但最关键是"做的事终于对胃口"。',
    satisfaction: 'satisfied',
    if_again: '会更早去问目标行业品牌岗的日常工作，而不是只看 JD 标题。',
    advice: '选行业别只看"品牌"两个字。先搞清：这个行业的品牌，KPI 是什么、每天在和谁说话、靠什么被看见。',
    stage_tag: 'lookback',
    profile_tag: 'function_industry_fit',
    case_profile: cp({
      education: '普通一本（市场营销）',
      company_from: '某快消大厂（美妆线，化名）',
      company_type: '大厂',
      role_from: '品牌专员',
      industry_from: '快消（美妆）',
      role_to: '品牌策略',
      industry_to: '新能源汽车',
      salary_from: '税前 10k / 月',
      salary_to: '税前 16k / 月',
      switch_direction: '从「快消美妆品牌（重投放种草）」转去「新能源品牌（重认知信任）」——同一叫品牌，做的事完全不同。',
      why_more_match: '快消品牌每天盯 ROI、种草笔记数量；TA 更想做「让人真正相信一个新技术」的事，而不是冲 GMV。新能源让他从"冲数据"变成"讲清楚一件事"。',
      industry_diff_note: '同一「品牌岗」三种典型活法：①快消/美妆 = 重投放、重转化，KPI 是 GMV，节奏快像打仗；②新能源/硬科技 = 重认知、重信任，KPI 是「让人愿意相信你」，要能讲清技术故事；③互联网/APP = 重增长、重口碑，KPI 是新增和留存。想练「前端冲业绩」去①，想练「战略讲故事」去②，想练「数据增长」去③。'
    })
  }
]

// ============================================================
// 做产品 / 创业 / 参赛（跨人群场景样本，按 scenario_tags 检索，不绑定某一档人群）
// 用途：接住"独立做产品、参赛、方向摇摆、先验证还是 all-in"这类库里原本没有的场景
// ============================================================
export const productBuilderCases: OrdinaryCase[] = [
  {
    id: 'roadbook_entry_pb_001', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '24 岁 | 独立做产品参赛 | 方向一直摇摆',
    who: '24 岁，连续产品尝试者',
    one_line_choice: '先不做大，用 2 周做一个能演示的最小版本去验证',
    biggest_pitfall: '在"要做哪个方向"上空想了 3 周，没做过一个能给人看的东西',
    why_similar: '你也卡在"到底做哪个、会不会没人要"。TA 的经验和你一样：方向不是想出来的，是先做一个最小的给人看、再调。',
    time_horizon: '3_months',
    outcome: '两周做出一个粗糙但能跑的 demo，找了 8 个目标用户聊，砍掉一半功能，留下大家真的点开用的那块——方向反而清楚了。',
    satisfaction: 'mixed',
    if_again: '会更早把"想做什么"变成"做一个最小的让人用"，用真实反馈代替脑内推演。',
    advice: '别在脑子里把方向想定再动手。先做一个最小可演示版本，找 5-10 个真实目标用户看反应，方向会在反馈里自己显形。',
    stage_tag: 'peer',
    profile_tag: 'product_direction',
    scenario_tags: ['做产品', '参赛', '方向验证', '创业'],
    case_profile: cp({
      education: '普通一本（设计/计算机类）',
      company_from: '某创业公司（化名）',
      company_type: '创业公司',
      role_from: '产品助理',
      industry_from: '互联网/科技',
      role_to: '独立产品人',
      industry_to: '独立产品',
      salary_from: '税前 9k / 月',
      salary_to: '参赛获奖 + 后续融资意向',
      switch_direction: '从「在公司里做别人定的需求」转去「自己定一个最小产品去验证」——同样的 product sense，但第一次 own 一个东西。',
      why_more_match: 'TA 更想确认"我选的方向有没有人真要"，而不是在简历上多一行经历。',
      industry_diff_note: '在公司做产品重「在已有大盘里完成 KPI」；自己参赛做产品重「从 0 想清楚一件事、让陌生人愿意用」。一个练执行，一个练判断。'
    })
  },
  {
    id: 'roadbook_entry_pb_002', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '31 岁 | 边上班边做产品 | 要不要辞职 all-in',
    who: '31 岁，互联网运营，业余做工具类产品',
    one_line_choice: '先不辞职，用业余时间验证到"有陌生人愿意付费"再放大',
    biggest_pitfall: '前三个月把副业当兴趣，没设"验证通过"的硬指标',
    why_similar: '你也在"要不要全职投入做产品"。TA 的答案是：先有收入证据，再谈身份转变——和路书一直说的"先验证"一致。',
    time_horizon: '12_months',
    outcome: '业余做出一个付费小工具，第 10 个月稳定有陌生人按月付费，才认真考虑投入更多。',
    satisfaction: 'satisfied',
    if_again: '会一上来就定"赚到第一笔陌生人的钱才算验证过"，而不是凭手感坚持。',
    advice: '做产品最危险的是"自我感动"。先验证有没有陌生人愿意为你花时间或花钱，有了证据再决定要不要 all-in。',
    stage_tag: 'peer',
    profile_tag: 'product_validate',
    scenario_tags: ['做产品', '创业', '副业', '方向验证']
  },
  {
    id: 'roadbook_entry_pb_003', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '26 岁 | 产品参赛前 | 怕做不出来也怕没人看',
    who: '26 岁，设计师，第一次带作品参赛',
    one_line_choice: '把"怕做不完"拆成每周一个可提交的小节点',
    biggest_pitfall: '前期纠结完美方案，迟迟不开工，越拖越慌',
    why_similar: '你参赛/做产品前也自我怀疑。TA 的做法是把大目标切成每周能交差的小块，用"先完成再完美"扛过焦虑。',
    time_horizon: '6_months',
    outcome: '按周提交，评委中期反馈帮她调了方向，最终作品比一开始想的更贴题。',
    satisfaction: 'satisfied',
    if_again: '会更早把方案丢出去让人拍砖，而不是闷头做到"自认为完美"。',
    advice: '别等"准备好了"才出手。先交一版能看的，用外部反馈代替内心戏——参赛和做产品都是被反馈推着变好的。',
    stage_tag: 'peer',
    profile_tag: 'product_fear',
    scenario_tags: ['做产品', '参赛', '方向验证']
  },
  {
    id: 'roadbook_entry_pb_004', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '34 岁 | 独立产品跑通后 | 回头看那次摇摆',
    who: '34 岁，former 大厂，现独立产品人',
    one_line_choice: '当年没辞职，用业余时间把产品跑通了才离开',
    biggest_pitfall: '差点因为"别人都全职创业"的焦虑而裸辞',
    why_similar: '你也在权衡要不要全职做产品。TA 回头看：幸好先验证了，没在没证据时赌上身家。',
    time_horizon: '2_years',
    outcome: '业余做的产品在 14 个月后有了稳定付费用户，才离职专心做；比裸辞稳得多。',
    satisfaction: 'satisfied',
    if_again: '还是会先验证再放大，但会更早开始，不被"别人都 all-in"的叙事带节奏。',
    advice: '做产品不是"敢不敢赌"，是"有没有先验证"。别人全职不代表你该裸辞；让陌生人的付费成为你的底气。',
    stage_tag: 'lookback',
    profile_tag: 'product_launched',
    scenario_tags: ['做产品', '创业', '副业', '方向验证'],
    case_profile: cp({
      education: '985 本科（计算机）',
      company_from: '某大厂（化名）',
      company_type: '大厂',
      role_from: '高级运营',
      industry_from: '互联网/科技',
      role_to: '独立产品人',
      industry_to: '独立产品',
      salary_from: '税前 28k / 月',
      salary_to: '产品收入 + 主业离职后更自由',
      switch_direction: '从「在平台里做增长」转去「自己做一个小产品验证需求」——同样的用户理解，但从执行者变成 owner。',
      why_more_match: 'TA 更想确认"这件事离开大厂平台还有没有人买账"，而不是单纯想当老板。',
      industry_diff_note: '在大厂做产品，需求是平台给的、资源是平台给的；自己做产品，需求和资源都要自己找。前者练"把给定题做漂亮"，后者练"找对题"。'
    })
  },
  {
    id: 'roadbook_entry_pb_005', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '41 岁 | 把经验做成产品 | 下半场的第二曲线',
    who: '41 岁，前管理者，把行业经验做成付费内容产品',
    one_line_choice: '不离职，先把"经验产品化"做成一个低成本的副项目',
    biggest_pitfall: '一开始想做太大，团队、资金都跟不上',
    why_similar: '你也想把积累做成产品。TA 的落点：经验产品化先从最小的可卖单元开始，别一上来就搭大班子。',
    time_horizon: '2_years',
    outcome: '从一个小专栏做起，两年后变成稳定现金流的轻产品，主业反而更敢做长期判断。',
    satisfaction: 'satisfied',
    if_again: '会更早定义"第一个能卖的东西"长什么样，而不是先想平台、团队。',
    advice: '40+ 把经验变产品，比卖时间更抗老。但别一上来做重——先找一个最小可卖单元，跑通再放大。',
    stage_tag: 'lookback',
    profile_tag: 'product_expertise',
    scenario_tags: ['做产品', '创业', '副业']
  }
]

// ============================================================
// V0.8 生活类样本（健康 / 理财 / 家庭 / 自我成长）
// 填补"事业之外"的内容空白：上班之外的那些人生大事
// ============================================================
export const lifeDomainCases: OrdinaryCase[] = [
  // ---------- 健康 / 精力 ----------
  {
    id: 'roadbook_entry_life_001', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '34 岁 | 体检报告亮红灯后才学会的一件事',
    who: '34 岁，互联网产品经理，连续三年体检指标变差',
    one_line_choice: '没换工作，先把"精力"当成和"业绩"一样重要的指标来管',
    biggest_pitfall: '把身体报警当"忍一忍就过去了"，直到被医生吓到才动',
    why_similar: '你也知道该注意身体，但总觉得"等忙完这阵再说"。TA 的教训是：身体不会等你忙完。',
    time_horizon: '8_months',
    outcome: '指标异常后没辞职，但重新排了优先级——每天 30 分钟运动雷打不动，推掉无意义的加班会议。8 个月后指标回来一半，工作时辰反而更高效。',
    satisfaction: 'satisfied',
    if_again: '会更早在 30 岁就把"精力管理"写进 OKR，而不是等体检报告来提醒我。',
    advice: '别等身体亮红灯才管它。把"每天睡 7 小时 + 动 30 分钟"当成和"完成项目"一样硬的指标——这事不能等"有空"。',
    stage_tag: 'peer',
    profile_tag: 'health_wake_up',
    scenario_tags: ['健康', '精力管理'],
    life_category: 'life',
    life_subcategory: 'health',
  },
  {
    id: 'roadbook_entry_life_002', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '45 岁 | 终于明白"拼得动"比"拼得狠"更重要',
    who: '45 岁，制造业中层，工作 20 年',
    one_line_choice: '不是退下来，是换一种能打得更久的打法',
    biggest_pitfall: '把"还能熬夜"当成勋章，没意识到可持续才是真正的竞争力',
    why_similar: '你也还在硬扛。TA 的复盘：40+ 的胜负不在"今晚多拼"，在"十年后还能不能在场上"。',
    time_horizon: '18_months',
    outcome: '从一线救火转为带教 + 定战略，收入没降但精力留给了身体和家庭。两年后同龄人开始掉队，TA 反而越走越稳。',
    satisfaction: 'satisfied',
    if_again: '会更早把"能打多久"放在"能打多狠"前面。',
    advice: '40+ 的核心资产不是"今晚能熬几点"，是"十年后还在不在场上"。把精力当资产管，别当耗材用。',
    stage_tag: 'lookback',
    profile_tag: 'sustainable_pace',
    scenario_tags: ['健康', '精力管理'],
    life_category: 'life',
    life_subcategory: 'health',
  },
  // ---------- 理财 / 钱 ----------
  {
    id: 'roadbook_entry_life_003', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '26 岁 | 工资刚过万，该怎么开始管钱',
    who: '26 岁，工作三年，月薪刚破万，从没认真管过钱',
    one_line_choice: '别等"赚多了再管"，先建立"先存后花"的系统',
    biggest_pitfall: '以为"等我赚多了自然就会理财了"——结果是赚多花多，永远没开始',
    why_similar: '你也觉得工资不够高、理财"还早"。TA 的经验：理财不是等有钱才开始，是建立"先付钱给自己"的习惯。',
    time_horizon: '12_months',
    outcome: '每月发工资当天自动转 20% 进单独账户，一年下来攒了 5 万——第一次有了"不是月光"的安全感。',
    satisfaction: 'satisfied',
    if_again: '会更早认清：理财第一步不是"学投资"，是"先存下钱"——金额不重要，习惯重要。',
    advice: '别等"赚多了再理财"。现在就设一个自动转账：发工资当天转 10-20% 到一个不碰的账户。一年后你会感谢自己。',
    stage_tag: 'peer',
    profile_tag: 'money_start',
    scenario_tags: ['理财', '储蓄'],
    life_category: 'life',
    life_subcategory: 'money',
  },
  {
    id: 'roadbook_entry_life_004', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '36 岁 | 要不要用全部积蓄买房',
    who: '36 岁，双职工家庭，手握 200 万首付犹豫要不要上车',
    one_line_choice: '不是"买不买"，是"买了之后还能不能喘气"',
    biggest_pitfall: '只算月供，没算"月供之后还剩多少缓冲"——买了之后任何意外都会变成危机',
    why_similar: '你也在纠结要不要买房。TA 的复盘：买房最大的风险不是房价跌，是"现金流紧到一点容错都没有"。',
    time_horizon: '18_months',
    outcome: '没买最大的那套，选了小一档、留出 6 个月的生活备用金。一年后遇到一方短暂失业，因为有缓冲没崩盘。',
    satisfaction: 'satisfied',
    if_again: '会把"月供之后剩多少"看得比"月供多少"更重要。',
    advice: '买房前先算一笔账：月供之后你还剩多少？剩下的够你撑 6 个月吗？如果不够，不是不能买，是还不能买这套。',
    stage_tag: 'lookback',
    profile_tag: 'house_decision',
    scenario_tags: ['理财', '买房', '家庭'],
    life_category: 'life',
    life_subcategory: 'money',
  },
  // ---------- 家庭 / 亲情 ----------
  {
    id: 'roadbook_entry_life_005', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '32 岁 | 父母老了，该接到身边还是让他们留在老家',
    who: '32 岁，一线城市工作，父母在老家身体开始走下坡',
    one_line_choice: '别替父母做决定，先去问他们真正想要什么样的晚年',
    biggest_pitfall: '把"我觉得为你好"当成"你该接受"，没问父母自己想怎么过',
    why_similar: '你也在纠结父母养老。TA 的复盘：最难的不是"接不接"，是"你有没有真的问过他们想怎么过"。',
    time_horizon: '12_months',
    outcome: '没硬接父母来北京，而是回去了三次长聊，发现父母其实更想留在老家——但要的是"你在意我"，不是"你带我走"。最后请了本地阿姨+周末视频，反而关系更好。',
    satisfaction: 'mixed',
    if_again: '会更早停止"我以为为你好"，真正去问、去听。',
    advice: '父母养老没有标准答案。但有一个问所有人该先问的："你自己想怎么过？"——别替 TA 们答。',
    stage_tag: 'peer',
    profile_tag: 'parents_care',
    scenario_tags: ['家庭', '父母'],
    life_category: 'life',
    life_subcategory: 'family',
  },
  {
    id: 'roadbook_entry_life_006', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '50 岁 | 孩子上大学后，突然不知道自己为谁活了',
    who: '50 岁，母亲，全职带娃 18 年，孩子离家后陷入空虚',
    one_line_choice: '不是"找点事做"，是重新问自己"除了妈妈这个身份，我还是谁"',
    biggest_pitfall: '急着用"忙"填满空虚，没给自己时间面对"我是谁"这个问题',
    why_similar: '你也在经历身份转变的空虚。TA 的复盘：空巢不是危机，是一次迟到的"找回自己"的机会——但前提是你敢面对。',
    time_horizon: '18_months',
    outcome: '前半年很难受，后来报名了社区大学的写作课，发现自己一直想写东西。18 个月后开了自己的公众号，重新有了"不只是谁的母亲"的身份。',
    satisfaction: 'satisfied',
    if_again: '会更早允许自己"难受一阵子"，而不是马上假装充实。',
    advice: '孩子离家后的空虚不是病，是一次迟到的自我追问。给自己半年时间，别急着用"忙"盖过去——慢慢问自己：除了已经扮演的角色，我还想成为谁。',
    stage_tag: 'lookback',
    profile_tag: 'empty_nest',
    scenario_tags: ['家庭', '自我成长', '身份转变'],
    life_category: 'life',
    life_subcategory: 'family',
  },
  // ---------- 自我成长 ----------
  {
    id: 'roadbook_entry_life_007', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '24 岁 | 工作后慢慢忘了自己喜欢什么',
    who: '24 岁，工作两年，感觉每天都在"完成任务"，没在做自己',
    one_line_choice: '不是辞职去找热爱，是每周给自己留两小时"无人观看的时间"',
    biggest_pitfall: '把"工作无聊"等同于"我不行"，其实只是没给自己留喘息的空间',
    why_similar: '你也觉得工作后越来越不像自己。TA 的经验：不用立刻辞职，但每周必须有"没人看你、没人评价"的两小时——那是你重新认识自己的地方。',
    time_horizon: '6_months',
    outcome: '每周三晚雷打不动去画画，不为卖、不为晒。半年后发现自己画画时那个状态，才是"真正的我"——工作反而更有底气了。',
    satisfaction: 'satisfied',
    if_again: '会更早停止"等辞职了再做喜欢的事"，现在就给自己的生活留一块飞地。',
    advice: '别等"有空了再做喜欢的事"——你永远不会有空。现在就每周留两小时给自己，不为赚钱、不为展示，只为了记得"我是谁"。',
    stage_tag: 'peer',
    profile_tag: 'self_rediscover',
    scenario_tags: ['自我成长', '爱好'],
    life_category: 'life',
    life_subcategory: 'self_growth',
  },
  {
    id: 'roadbook_entry_life_008', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '38 岁 | 终于开始问自己"我到底想过怎样的一生"',
    who: '38 岁，事业有成，但凌晨三点常常睡不着问自己"这是我要的吗"',
    one_line_choice: '不是推翻一切，是开始给"内心的声音"留出时间和认真',
    biggest_pitfall: '把"中年危机"当成矫情，用更忙的工作盖过去——结果越忙越空',
    why_similar: '你也在深夜问自己这个问题。TA 的复盘：这种追问不是矫情，是你内心在提醒你"停下来听听"。',
    time_horizon: '12_months',
    outcome: '没辞职，但每天早起 30 分钟写"晨间日记"——不写工作，只写"我今天想为什么而活"。一年后做了一个重要决定：从一线退半步，换了一种节奏，反而更接近自己想要的。',
    satisfaction: 'mixed',
    if_again: '会更早把"我到底想要什么"当成正经问题来对待，而不是用忙碌逃避。',
    advice: '人到中年常常在深夜问自己"这是我要的吗"——别用忙碌盖过去。给自己留时间认真回答这个问题，哪怕答案让你 uncomfortable。',
    stage_tag: 'lookback',
    profile_tag: 'midlife_question',
    scenario_tags: ['自我成长', '人生意义'],
    life_category: 'life',
    life_subcategory: 'self_growth',
  },
]

// ============================================================
// V0.8 人际关系类样本（职场关系 / 亲密关系 / 朋友社交）
// 填补"怎么处理和人的关系"这个维度的空白
// ============================================================
export const relationshipDomainCases: OrdinaryCase[] = [
  // ---------- 职场关系 ----------
  {
    id: 'roadbook_entry_rel_001', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '25 岁 | 第一次被领导当众批评后不知道怎么面对',
    who: '25 岁，新人，入职半年第一次在周会上被领导点名批评',
    one_line_choice: '别躲、也别硬刚，先搞清楚"批评的是事还是人"',
    biggest_pitfall: '把"事没做好"放大成"我不行"，从此见到领导就躲',
    why_similar: '你也怕被批评、不知道怎么和领导相处。TA 的复盘：批评后怎么处理，比批评本身更影响你和领导的关系。',
    time_horizon: '3_months',
    outcome: '第二天主动找领导单独聊了 10 分钟："我想确认一下，您说的是这件事的处理方式有问题，还是觉得我不适合这块？"领导愣了一下，说是前者。后来反而建立了信任——领导开始愿意给 TA 反馈。',
    satisfaction: 'satisfied',
    if_again: '会更早分清"批评事"和"否定人"——大多数批评只是针对事，别自己放大。',
    advice: '被批评后别躲。第二天主动找领导确认一句话："您说的是这件事的处理方式，还是觉得我不适合？"——答案通常会出乎意料，而且你主动问这件事本身，就是在建立信任。',
    stage_tag: 'peer',
    profile_tag: 'criticism_handling',
    scenario_tags: ['职场关系', '向上管理'],
    life_category: 'relationship',
    life_subcategory: 'at_work',
  },
  {
    id: 'roadbook_entry_rel_002', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '33 岁 | 同事成了我领导，关系突然变了',
    who: '33 岁，互联网运营，平级同事被提拔成了自己的直属领导',
    one_line_choice: '别装作"没变化"，主动重新定义你们现在的关系',
    biggest_pitfall: '用"还是朋友"的旧模式相处，结果在关键节点被误判',
    why_similar: '你也遇到过身份转变后关系尴尬。TA 的复盘：与其装作没变，不如主动把新关系聊清楚。',
    time_horizon: '4_months',
    outcome: '约对方喝了一次咖啡，直接说："我们以前是平级，现在你是领导，我不想再用旧模式让你为难，你看我们怎么配合最好。"对方明显松了口气——原来 TA 也在纠结怎么处理。之后合作反而比平级时更顺。',
    satisfaction: 'satisfied',
    if_again: '会更早主动把"关系变了"这件事摊开聊，而不是各自揣测。',
    advice: '同事变领导，别装作没变化。主动约一次聊清楚："我们以前是平级，现在不一样了，我不想让你为难，你看怎么配合最好。"——大多数时候对方也在等这件事。',
    stage_tag: 'peer',
    profile_tag: 'peer_becomes_boss',
    scenario_tags: ['职场关系', '向上管理'],
    life_category: 'relationship',
    life_subcategory: 'at_work',
  },
  // ---------- 亲密关系 ----------
  {
    id: 'roadbook_entry_rel_003', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '31 岁 | 和伴侣因为"谁为家付出更多"吵了三年',
    who: '31 岁，已婚，双职工，孩子两岁，和伴侣一直在吵"谁付出更多"',
    one_line_choice: '别再比"谁更累"，先承认一件事：你们都在用不同的方式付出',
    biggest_pitfall: '把"我的累你看不见"当成"你不爱我"，其实是两人都在各自硬扛',
    why_similar: '你也在亲密关系里为"付出不对等"纠结。TA 的复盘：问题不是付出多少，是两人都在等对方先看见自己。',
    time_horizon: '6_months',
    outcome: '一次大吵后，TA 主动说了一句："我知道你也很累，是我一直没说出口。"对方哭了——原来对方一直在等这句。之后两人开始每周留 30 分钟"只说感受不算账"，关系慢慢回来了。',
    satisfaction: 'mixed',
    if_again: '会更早停止"比谁更累"的比赛，先承认对方也在付出。',
    advice: '亲密关系里"谁付出更多"是个陷阱——你们都在付出，只是方式不同、对方看不到。先说一句"我知道你也很累"，比吵十年都管用。',
    stage_tag: 'peer',
    profile_tag: 'partnership_balance',
    scenario_tags: ['亲密关系', '婚姻', '家庭'],
    life_category: 'relationship',
    life_subcategory: 'intimate',
  },
  {
    id: 'roadbook_entry_rel_004', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '27 岁 | 分手后一直走不出来',
    who: '27 岁，工作四年，和相恋三年的对象分手半年还是很难受',
    one_line_choice: '不是"赶紧找下一个"，是允许自己难过、但同时别让难过变成全部生活',
    biggest_pitfall: '逼自己"赶紧放下"，结果越逼越放不下；或者用新关系盖旧伤口',
    why_similar: '你也在经历分手后的难受。TA 的复盘：走不出来不是因为你弱，是因为你真的在意过——允许自己难受，但别让难受变成你唯一的身份。',
    time_horizon: '8_months',
    outcome: '没急着相亲，也没逼自己"放下"。而是做了两件事：每周和朋友吃一次饭（保证不孤立），每天给自己设一个"难过时段"（晚上 9-10 点可以想 TA，其他时间尽量做别的）。8 个月后想起 TA 时不再是痛，而是淡淡的怀念。',
    satisfaction: 'mixed',
    if_again: '会更早允许自己难过，但同时给难过一个"时段"，不让它吞掉整个生活。',
    advice: '分手后走不出来不是你的错。允许自己难过，但给难过设一个时段——其他时间尽量做别的、见别人。时间不会让你忘了 TA，但会让你想起 TA 时不再那么痛。',
    stage_tag: 'peer',
    profile_tag: 'breakup_recovery',
    scenario_tags: ['亲密关系', '分手'],
    life_category: 'relationship',
    life_subcategory: 'intimate',
  },
  // ---------- 朋友 / 社交 ----------
  {
    id: 'roadbook_entry_rel_005', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '35 岁 | 发现朋友越来越少，是不是我出了问题',
    who: '35 岁，中层管理，工作家庭两头烧，发现已经很久没联系朋友',
    one_line_choice: '不是"你出了问题"，是 30+ 的友谊本来就需要主动维护',
    biggest_pitfall: '把"没人找我"理解成"没人在意我"，其实大家都在各自的漩涡里',
    why_similar: '你也觉得朋友越来越少。TA 的复盘：30+ 的友谊不会像 20 多岁自动维持，需要你主动——但主动一次就够维持很久。',
    time_horizon: '6_months',
    outcome: '逼自己每周主动联系一个老朋友，只发一句"最近怎么样"。半年后发现：大多数人都很开心收到消息——大家都在等对方先开口。朋友没变少，只是都太忙了。',
    satisfaction: 'satisfied',
    if_again: '会更早停止"为什么没人找我"的内耗，主动迈第一步。',
    advice: '30+ 朋友变少不是你的问题，是大家都在各自的漩涡里。别等"别人来找我"——你主动发一句"最近怎么样"，大多数人都很开心。友谊 30+ 后靠的是主动维护，不是自动发生。',
    stage_tag: 'peer',
    profile_tag: 'friendship_maintain',
    scenario_tags: ['朋友', '社交', '孤独'],
    life_category: 'relationship',
    life_subcategory: 'friends',
  },
  {
    id: 'roadbook_entry_rel_006', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '48 岁 | 配偶去世后，怎么重新学会一个人',
    who: '48 岁，丧偶两年，孩子上大学，独自生活',
    one_line_choice: '不是"走出来"，是慢慢学会带着 TA 的那份一起活下去',
    biggest_pitfall: '身边的人都在劝"走出来"，但越被催越觉得"我不该还难过"',
    why_similar: '你也可能在经历重大的失去。TA 的经历说：不要让别人定义你"该多久走出来"——有些人有些事，不是走出来的，是学会带着它走的。',
    time_horizon: '2_years',
    outcome: '第一年很慢，每周逼自己出门一次、见一个人。第二年加入了社区的合唱团，不是为了开心，是为了"重新习惯人和声音"。两年后想起 TA 时还是会哭，但已经有了重新生活的力气。',
    satisfaction: 'mixed',
    if_again: '会更早停止"我应该走出来"的自我审判——没有应该，只有你自己的节奏。',
    advice: '失去重要的人后，别让任何人（包括自己）催你"走出来"。有些人不是走出来的，是学会带着一起走的。给自己时间，慢慢来——只要每周还在出门一次、见一个人，你就在重新活。',
    stage_tag: 'lookback',
    profile_tag: 'grief_recovery',
    scenario_tags: ['亲密关系', '失去', '自我成长'],
    life_category: 'relationship',
    life_subcategory: 'intimate',
  },
]

// ============================================================
// 高频真实困惑（跨人群 · 覆盖库里原本缺失的常见场景）
// 用途：接住"副业怎么开始/自己做内容没人看/被边缘化想走/想转行怕沉没成本/
//       要不要考公离开互联网/内容做了不变现/和领导关系僵了"等真实痛点
// 设计原则：普通人 > 成功学；混合结局(mixed)占比 ≥ 40%；口语化、不说教
// ============================================================
export const commonDilemmaCases: OrdinaryCase[] = [
  // ---------- 副业 / 第二曲线起步 ----------
  {
    id: 'roadbook_entry_cd_001', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '30 岁 | 想做副业但不知道卖什么',
    who: '30 岁，大厂运营，想做副业三年了一直没动手',
    one_line_choice: '别想"卖什么"，先列"我已经被人愿意花钱问的事"',
    biggest_pitfall: '把"找副业"当成找项目，列了 20 个方向一个都没动手',
    why_similar: '你也想做副业但卡在"不知道做什么"。TA 的转折是：不找项目，先把自己被同事朋友问过的"小问题"列出来。',
    time_horizon: '4_months',
    outcome: '发现同事一直来找自己改简历/咨询跳槽——把这件事做成 99 元的付费咨询，第一个月就有 7 个人付费，没辞职。',
    satisfaction: 'satisfied',
    if_again: '会更早停止"找风口"，先问自己：朋友私下找我帮过什么忙、他们愿意为此付费吗。',
    advice: '"做什么副业"是假问题。真问题是：你已经有什么能力，是别人愿意付费但你还免费给的？先把那个卖起来。',
    stage_tag: 'peer',
    profile_tag: 'side_hustle_start',
    scenario_tags: ['副业', '方向验证', '职业选择']
  },
  {
    id: 'roadbook_entry_cd_002', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '34 岁 | 副业做了一年还没赚到钱要不要放弃',
    who: '34 岁，主业稳定，副业做了一个知识星球',
    one_line_choice: '不是放弃，是设一个"3 个月不见钱就收"的硬截止线',
    biggest_pitfall: '"再坚持一下"和"真的没跑通"分不清——用情怀骗了自己一年',
    why_similar: '你也在纠结副业要不要继续。TA 的做法：不是因为没赚钱就放弃，而是给坚持一个明确的验证标准。',
    time_horizon: '3_months',
    outcome: '设了"3 个月内要么做到 50 个付费用户、要么关掉"的死线。最后做了 31 个，差一点，但看清了问题不在内容在获客——果断收掉，把精力转去另一个方向反而起来了。',
    satisfaction: 'mixed',
    if_again: '会更早定"什么叫成了、什么叫没成"，而不是用"再试试"无限延期。',
    advice: '副业不怕关，怕的是"既不放大也不关掉"地吊着。给自己定一个具体的数字目标和截止日，到时候用数据说话。',
    stage_tag: 'lookback',
    profile_tag: 'side_hustle_pivot',
    scenario_tags: ['副业', '方向验证']
  },
  // ---------- 做内容 / 自媒体 ----------
  {
    id: 'roadbook_entry_cd_003', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '27 岁 | 做了半年内容没人看要不要放弃',
    who: '27 岁，上班族，下班做小红书',
    one_line_choice: '不是内容不行，是还没找到"一个人愿意为你停下来"的那个点',
    biggest_pitfall: '把"没人看"当成"我不行"，其实是选题一直在安全区里打转',
    why_similar: '你也做了内容但没起色。TA 的复盘：问题不在坚持，在选题一直在"我觉得有意思但别人不一定在意"的区域。',
    time_horizon: '6_months',
    outcome: '前半年发 40 条没过 100 赞。停下来把自己最纠结的一件事（该不该从国企辞职）写成一条真实的长内容，那条爆了——不是技巧变了，是终于说了别人也想说但没说的话。',
    satisfaction: 'satisfied',
    if_again: '会更早停止模仿爆款，先问自己：我最真实、最纠结的那件事，是不是也是别人的事？',
    advice: '没人看通常不是"你不行"，是"你还没说别人真正在意的话"。把你最真实的纠结写出来——那是别人也在想但说不出口的。',
    stage_tag: 'peer',
    profile_tag: 'content_no_views',
    scenario_tags: ['副业', '方向验证']
  },
  {
    id: 'roadbook_entry_cd_004', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '32 岁 | 内容有流量了但不知道怎么变现',
    who: '32 岁，B站 2 万粉，不知道怎么赚钱',
    one_line_choice: '先别想"怎么变现"，先问"粉丝为什么愿意为你花钱"',
    biggest_pitfall: '急于接广告和带货，伤了原本信任的内容调性',
    why_similar: '你也卡在"做了内容但不知道怎么赚钱"。TA 的教训：急着变现反而把好不容易建立的信任败掉了。',
    time_horizon: '8_months',
    outcome: '试过接广告、带货，粉丝掉了一波。后来做了一次"付费社群"测试——300 元/年，原本以为没人买，结果 80 个人进了。发现粉丝愿意为"更深度的陪伴"付费，不是为产品。',
    satisfaction: 'mixed',
    if_again: '会一开始就问粉丝：你愿意为什么样的"更深一层"付费？而不是自己猜变现模式。',
    advice: '变现不是"加一个商业模式"，是"问粉丝愿意为什么花钱"。先做最小付费测试（哪怕 9 元），看谁买单、为什么买单。',
    stage_tag: 'lookback',
    profile_tag: 'content_monetize',
    scenario_tags: ['副业', '创业']
  },
  // ---------- 职场困境 ----------
  {
    id: 'roadbook_entry_cd_005', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '35 岁 | 被领导边缘化了要不要主动走',
    who: '35 岁，互联网中层，核心项目被换掉',
    one_line_choice: '别赌气走，先把手里的牌打完再决定',
    biggest_pitfall: '把"被边缘化"理解成"该走了"，情绪化裸辞反而让自己被动',
    why_similar: '你也感觉在公司被挤到边缘。TA 的经验：这时候最该做的不是赌气辞职，是把还能拿到的资源（时间、人脉、学习机会）用足。',
    time_horizon: '6_months',
    outcome: '被换掉核心项目后没有立刻辞职，用那半年时间把一个一直想考的证书考了，同时悄悄看外部机会。最后拿到一个平薪但更有成长空间的 offer 才走，没被动。',
    satisfaction: 'satisfied',
    if_again: '会更早认清"被边缘化"不等于"该立刻走"——走不走是你的选择，不是被逼的。',
    advice: '被边缘化不可怕，可怕的是赌气裸辞。先问自己：我现在还能从这份工作里拿走什么？拿完了再走，是你主动选，不是被赶。',
    stage_tag: 'lookback',
    profile_tag: 'workplace_marginalized',
    scenario_tags: ['职业选择', '职业风险', '管理or专家']
  },
  {
    id: 'roadbook_entry_cd_006', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '33 岁 | 和直属领导关系僵了怎么办',
    who: '33 岁，外企市场，和直属领导冷战三个月',
    one_line_choice: '不要试图"修复关系"，要先搞清楚自己到底想留下还是想走',
    biggest_pitfall: '花了三个月在"怎么让领导重新喜欢我"上，其实真正的问题是这份工作还要不要',
    why_similar: '你也和领导关系出了问题。TA 的复盘：纠结"怎么修复关系"是绕路——先回答"我到底还想不想在这里"。',
    time_horizon: '4_months',
    outcome: '停下来想清楚：留下的理由（业务有成长）大于离开的理由（关系僵）。于是不修复关系，专注把业绩做出来——业绩说话比关系说话管用，半年后领导主动修复了关系。',
    satisfaction: 'mixed',
    if_again: '会更早认清：职场关系僵了不是终点，关键是你的业绩有没有依赖这段关系。如果不依赖，就不用修。',
    advice: '和领导关系僵，先别急着修。先问：我的成长和晋升，有多依赖这段关系？如果不依赖，专注业绩；如果依赖，再考虑修或走。',
    stage_tag: 'peer',
    profile_tag: 'boss_relationship',
    scenario_tags: ['职业选择', '管理or专家']
  },
  // ---------- 转行 / 沉没成本 ----------
  {
    id: 'roadbook_entry_cd_007', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '29 岁 | 做了 5 年研发想转产品但怕浪费积累',
    who: '29 岁，后端工程师，想转产品经理',
    one_line_choice: '不是"浪费积累"，是把积累用在新的位置上',
    biggest_pitfall: '"沉没成本"思维——觉得换轨道等于前 5 年白干了',
    why_similar: '你也想转方向但舍不得已经积累的东西。TA 的转折：意识到转行不是"扔掉过去"，是"换一个让过去更值钱的位置"。',
    time_horizon: '9_months',
    outcome: '没辞职，在公司内部转岗到产品。发现做研发时懂的技术反而成了最大优势——和开发沟通不用翻译，比纯产品经理更高效。两年后升到高级产品经理。',
    satisfaction: 'satisfied',
    if_again: '会更早认清：转行最大的资本不是"新方向的能力"，是"旧方向的积累在新位置上有多稀缺"。',
    advice: '想转行怕浪费积累？换个问法：你现在的积累，在哪个新位置上会让你比别人更稀缺？找那个位置转，不是扔掉过去。',
    stage_tag: 'lookback',
    profile_tag: 'career_pivot_fear',
    scenario_tags: ['转行', '方向验证', '职业选择']
  },
  // ---------- 考公 / 体制内外选择 ----------
  {
    id: 'roadbook_entry_cd_008', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '25 岁 | 在互联网累但怕出去更惨要不要考公',
    who: '25 岁，大厂程序员，身体和精神都快撑不住',
    one_line_choice: '不是"互联网 vs 考公"，是"你到底在逃什么"',
    biggest_pitfall: '把"想离开"误当成"想考公"——逃离一个东西不等于选择另一个东西',
    why_similar: '你也在互联网和考公之间纠结。TA 的经验：先分清你是真的想去体制内，还是只是太累了想逃。',
    time_horizon: '5_months',
    outcome: '没立刻考公，先休假两个月。休假时发现自己其实喜欢做技术，只是受不了当前团队的节奏。换了一家有规模但更健康节奏的公司，问题解决了大半。',
    satisfaction: 'satisfied',
    if_again: '会更早问自己：我是不喜欢这份工作，还是不喜欢现在的状态？这两件事解法完全不同。',
    advice: '想离开当前工作时，先问：我是真的想"去"那个新选择，还是只是想"逃"现在这个？逃离式选择最容易后悔。',
    stage_tag: 'peer',
    profile_tag: 'internet_vs_stable',
    scenario_tags: ['职业选择', '体制内', '职业风险']
  },
  // ---------- 创业 / 要不要开始 ----------
  {
    id: 'roadbook_entry_cd_009', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '37 岁 | 有积蓄想创业但怕亏光',
    who: '37 岁，互联网总监，有 200 万积蓄想出来创业',
    one_line_choice: '先定"亏多少就收"的红线，再谈要不要开始',
    biggest_pitfall: '"准备好了再开始"——永远准备不完，勇气在等待里耗光',
    why_similar: '你也想创业但怕亏。TA 的做法：不是消除风险，是先给自己画一条亏了也不会伤筋动骨的红线。',
    time_horizon: '18_months',
    outcome: '定了一条"最多亏 40 万，到了就无条件收"的红线。创业第一年确实亏了 35 万，但因为有红线，心态不崩，按计划调整模式。第二年转正，现在稳定盈利。',
    satisfaction: 'satisfied',
    if_again: '会更早定那条线——有了底线，反而更敢做决策。',
    advice: '想创业怕亏？先给自己定一条"最多亏多少"的红线。有了底线，你会发现决策不再被恐惧绑架。',
    stage_tag: 'lookback',
    profile_tag: 'startup_fear',
    scenario_tags: ['创业', '副业', '职业选择']
  },
  // ---------- 自我认同 / 不确定想要什么 ----------
  {
    id: 'roadbook_entry_cd_010', audience: 'new_grad',
    source_marker: 'demo_fixture',
    title: '26 岁 | 不知道自己到底想要什么',
    who: '26 岁，工作三年，说不清喜欢什么讨厌什么',
    one_line_choice: '不知道要什么的时候，先用排除法删掉"确定不要的"',
    biggest_pitfall: '把"还没找到热爱"当成"我有问题"，其实大多数人都是先排除再发现',
    why_similar: '你也说不清自己想要什么。TA 的经验：找不到答案不是问题，先列出"确定不要的"，剩下的就是可能想要的。',
    time_horizon: '6_months',
    outcome: '花两个月列出"确定不想做的事"（不想做销售、不想去传统行业、不想做执行型岗位）。在这些约束下，反而看清了真正想试的方向——不是"找到了热爱"，是"排除了不喜欢"。',
    satisfaction: 'mixed',
    if_again: '会更早停止逼自己回答"我热爱什么"，换成"我确定不要什么"——后者容易答，答完之后前者就浮现了。',
    advice: '不知道想要什么很正常。先用排除法：写下三件你确定不想做的事。剩下的，就是你该去试的方向。',
    stage_tag: 'peer',
    profile_tag: 'no_clear_direction',
    scenario_tags: ['方向验证', '职业选择', '转行']
  }
]

// ============================================================
// 高年龄段补充（mid_career 37-40 / senior 50+）
// 目的：让"而立转型"高端（37-40）和"不惑规划"高端（50+）也有足够样本
// 避免 38-40 岁用户选了而立转型后看到的全是 30-35 岁的人
// ============================================================
export const olderCareerCases: OrdinaryCase[] = [
  // ---------- mid_career 高端（37-40岁）----------
  {
    id: 'roadbook_entry_oc_001', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '39 岁 | 高管 | 要不要离开舒适区赌最后一把',
    who: '39 岁，消费品品牌总监，年薪百万但感觉在重复',
    one_line_choice: '不是"离开舒适区"，是先搞清楚你在舒适区里还有没有在长',
    biggest_pitfall: '把"腻了"当成了"该走了"——舒适区里的成长停止才是真信号',
    why_similar: '你也在高处但感觉在原地踏步。TA 的复盘：先分清是"真的没东西长了"还是"只是腻了"——这两件事解法完全不同。',
    time_horizon: '9_months',
    outcome: '没辞职，先在公司内部申请了一个从 0 到 1 的新业务线。发现自己不是腻了工作，是腻了"重复"——换到新业务后反而进入近五年最高效的状态。',
    satisfaction: 'satisfied',
    if_again: '会更早问自己：我是在"舒适区里不再成长"，还是只是"对熟悉的东西腻了"？前者该走，后者换个新战场就行。',
    advice: '离开舒适区之前先问：你在舒适区里还有没有在长？如果还在长，不用走；如果已经不长，先试试能不能在公司内部换一个新战场。',
    stage_tag: 'lookback',
    profile_tag: 'comfort_zone_leave',
    scenario_tags: ['职业选择', '方向验证', '管理or专家']
  },
  {
    id: 'roadbook_entry_oc_002', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '40 岁 | 互联网总监 | 要不要接受降职去更有未来的赛道',
    who: '40 岁，互联网大厂总监，被邀去 AI 创业公司做高级专家（降半级）',
    one_line_choice: '不是"降不降职"，是"40 岁后你的溢价来自哪里"',
    biggest_pitfall: '死守职级面子，错过了一次进入新赛道早期窗口的机会',
    why_similar: '你也在纠结要不要为了新方向接受降职。TA 的判断框架：40 岁以后的溢价不在职级，在"你是不是站在下一条曲线的早期"。',
    time_horizon: '18_months',
    outcome: '接受了降半级的 offer 去做 AI 产品。第一年确实从管理者变回执行者不适应，但因为是早期核心成员，公司起来后反而比在大厂升得更快——18 个月后带独立业务线。',
    satisfaction: 'satisfied',
    if_again: '会更早放下"我已经这个级别了"的面子。40 岁后真正的资产不是职级，是你站在哪条曲线的什么位置。',
    advice: '40 岁前的溢价是"你能管多大的事"，40 岁后的溢价是"你是不是站在下一条曲线的早期"。如果新方向值得，降职不是后退，是换一条更快上升的轨道。',
    stage_tag: 'lookback',
    profile_tag: 'demotion_for_growth',
    scenario_tags: ['转行', '职业选择', '方向验证']
  },
  {
    id: 'roadbook_entry_oc_003', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '38 岁 | 中层 | 上不去也下不去怎么破局',
    who: '38 岁，互联网中层，连续三年晋升失败',
    one_line_choice: '别在外面找答案，先搞清楚"上面为什么不要你"',
    biggest_pitfall: '把晋升失败归结为"没背景/没运气"，回避了真实的反馈',
    why_similar: '你也卡在中层上不去。TA 的复盘：真正的答案不在"怎么努力"，在"上面到底要什么样的人"——敢不敢去问。',
    time_horizon: '12_months',
    outcome: '鼓起勇气直接问了自己的+2（老板的老板）："我距离下一个级别还差什么？"得到的答案出乎意料——不是能力问题，是他一直在做"自己擅长的事"而不是"组织当下最缺的事"。调整方向后第二年晋升成功。',
    satisfaction: 'satisfied',
    if_again: '会每年都主动问+2 一次"我距离下一个级别差什么"——最难的不是听答案，是敢问。',
    advice: '中层上不去，别猜原因，去问。问你的+2（不是直属）：我距离下一级还差什么？答案通常会出乎意料——但前提是你敢问、听完不改口。',
    stage_tag: 'lookback',
    profile_tag: 'middle_management_stuck',
    scenario_tags: ['职业选择', '管理or专家', '职业风险']
  },
  {
    id: 'roadbook_entry_oc_004', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '37 岁 | 要不要为了家庭离开一线城市',
    who: '37 岁，上海工作 12 年，父母身体不好想回老家',
    one_line_choice: '不是"回不回"，是"回去之后用什么活"',
    biggest_pitfall: '以为"回去就行"，没提前想清楚二线城市的收入落差和社交断裂',
    why_similar: '你也在纠结要不要离开大城市回家。TA 的经验：回去最难的不是收入降了，是原有的人脉和职业身份突然失效——要先准备好"回去以后用什么立身"。',
    time_horizon: '15_months',
    outcome: '没立刻回去，先用半年时间把工作转成远程，同时测试了老家有没有自己能接的活。回去后主业远程+本地接一些咨询项目，收入比上海少 40% 但生活成本也降了一半，时间多了反而能照顾家人。',
    satisfaction: 'mixed',
    if_again: '会更早开始测试"远程工作"的可能性，而不是在"回"和"不回"之间二选一。',
    advice: '离开一线城市前先想清楚三件事：① 回去用什么赚钱 ② 社交圈子怎么重建 ③ 能不能先把现有工作转成远程。别在"尽孝"和"事业"之间二选一，找一个两者都能照顾的中间态。',
    stage_tag: 'lookback',
    profile_tag: 'leave_tier1',
    scenario_tags: ['职业选择', '方向验证', '家庭平衡']
  },
  {
    id: 'roadbook_entry_oc_005', audience: 'mid_career',
    source_marker: 'demo_fixture',
    title: '40 岁 | 女性 | 生完二胎回职场发现自己没了位置',
    who: '40 岁，外企市场，休了 1 年产假回来发现团队重组了自己被边缘化',
    one_line_choice: '别等公司主动给你安排，先用 3 个月重新定义你能贡献什么',
    biggest_pitfall: '沉浸在"我为了家庭牺牲了"的委屈里，等着被看见',
    why_similar: '你也在生育后回来发现位置变了。TA 的经验：公司不会等你——与其等被安排，不如主动去找"现在组织最需要、而你能做"的那个位置。',
    time_horizon: '6_months',
    outcome: '没等老板安排，主动找了一次长谈，提出自己可以接一个"大家都不想碰但很重要"的跨部门项目。3 个月做出来后反而比休假前更重要——因为证明了自己能处理复杂局面。',
    satisfaction: 'satisfied',
    if_again: '会更早停止等被看见。生育回来最大的误区是以为"我还是原来的我"，其实组织已经变了——要主动重新定义自己的价值。',
    advice: '生育回职场别等安排。主动找一个"组织现在最需要、而你有能力做"的事，用 3 个月重新证明自己。委屈等不来机会，行动才能。',
    stage_tag: 'lookback',
    profile_tag: 'return_from_leave',
    scenario_tags: ['职业选择', '家庭平衡', '职业风险']
  },
  // ---------- senior 高端（50+岁）----------
  {
    id: 'roadbook_entry_oc_006', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '52 岁 | 高管 | 公司被收购后要不要留下',
    who: '52 岁，被收购公司的副总裁，面临"留下融入新文化 vs 拿钱走"的选择',
    one_line_choice: '不是"留不留"，是"50 岁后你最想用剩下的时间做什么"',
    biggest_pitfall: '被"这么多钱够花了"迷惑，没想清楚离开后每天要干什么',
    why_similar: '你也在面临"拿钱走还是留下"的选择。TA 的复盘：50 岁后的选择不该由钱决定（通常已经够了），该由"你接下来 10 年想做什么"决定。',
    time_horizon: '18_months',
    outcome: '拿了收购的钱离开。前 6 个月很轻松，之后开始空虚——发现"自由"没有目标就变成"漂浮"。后来去做了一个行业公益项目，找回了"被需要"的感觉。',
    satisfaction: 'mixed',
    if_again: '会在离开前就想清楚"接下来 3 年我想做什么"，而不是离开后再想。50 岁后最大的风险不是钱不够，是意义感断了。',
    advice: '50+ 岁做选择，先问自己：接下来 10 年我最想用什么方式被需要？钱够用之后，真正的问题是"你每天起来为什么"——先想清楚再走。',
    stage_tag: 'lookback',
    profile_tag: 'post_acquisition',
    scenario_tags: ['职业选择', '职业风险', '方向验证']
  },
  {
    id: 'roadbook_entry_oc_007', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '55 岁 | 顾问 | 靠人脉吃饭还能吃几年',
    who: '55 岁，独立顾问，收入 80% 来自老关系介绍',
    one_line_choice: '别靠"过去的面子"吃饭，把经验变成不依赖关系的"产品"',
    biggest_pitfall: '以为"老客户一直会找我"，没意识到人脉的价值随时间衰减',
    why_similar: '你也在靠积累吃饭但开始不安。TA 的复盘：55 岁后最大的风险不是没能力，是"靠关系"的模式会随着你淡出而失效——要趁还有影响力时把经验产品化。',
    time_horizon: '2_years',
    outcome: '用一年时间把过去 20 年的咨询方法论做成一套可购买的线上课程+诊断工具。第二年 60% 的收入来自"不依赖关系"的产品——不再怕老关系断了。',
    satisfaction: 'satisfied',
    if_again: '会更早开始把"靠人"转为"靠产品"。55 岁后最该做的一件事：让你的经验能独立卖出去，不靠任何人的面子。',
    advice: '50+ 岁靠顾问费吃饭的，现在就做一件事：把你的经验变成一个不依赖关系就能卖的东西（课程/工具/诊断包）。人脉会随时间衰减，产品不会。',
    stage_tag: 'lookback',
    profile_tag: 'expertise_productize',
    scenario_tags: ['职业选择', '副业', '方向验证']
  },
  {
    id: 'roadbook_entry_oc_008', audience: 'senior',
    source_marker: 'demo_fixture',
    title: '58 岁 | 退休前 5 年 | 要不要再去折腾一次',
    who: '58 岁，国企副处，离退休还有 5 年，心里一直想做一件自己的事',
    one_line_choice: '不是"退休后再做"，是"退休前就开始"——但要用最安全的方式',
    biggest_pitfall: '"等退休再说"的计划，90% 退休后也不会执行',
    why_similar: '你也在"等退休后做自己想做的事"。TA 的经验：等退休等于永远不做——趁现在还有资源和社交网络，用最小风险的方式开始。',
    time_horizon: '2_years',
    outcome: '没等退休，用业余时间开始做一直想做的"行业老兵电台"播客。退休时已经有了一批忠实听众和稳定的赞助，退休后直接变成第二事业，反而比工作时还忙。',
    satisfaction: 'satisfied',
    if_again: '会更早开始。"等退休"是最大的陷阱——退休后没有同事、没有社交、没有压力，反而更难开始一件事。',
    advice: '想做一件事别说"等退休"。退休前 5 年是最好的窗口：你还有收入、还有人脉、还有惯性。用业余时间从最小的版本开始，别等。',
    stage_tag: 'lookback',
    profile_tag: 'pre_retirement_start',
    scenario_tags: ['方向验证', '副业', '职业选择']
  }
]

// ============================================================
// 聚合与导出
// ============================================================
export const historicalCases: OrdinaryCase[] = [...notableFigureCases] // 兼容旧引用

export const allFixtureCases: OrdinaryCase[] = [
  ...peerCases,
  ...lookbackCases,
  ...midCareerCases,
  ...seniorCases,
  ...productBuilderCases,
  ...commonDilemmaCases,
  ...olderCareerCases,
  ...lifeDomainCases,
  ...relationshipDomainCases,
  ...notableFigureCases,
  ...famousCases,
  ...backgroundVarietyEntries
]

// ---------- 对照匹配标签（用与用户填写词表一致的词汇） ----------
const MATCH_MAP: Record<string, { industries: string[]; functions: string[] }> = {
  roadbook_entry_demo_001: { industries: ['互联网/科技', '制造业', '消费品'], functions: ['市场', '运营'] },
  roadbook_entry_demo_002: { industries: ['消费品', '文化传媒'], functions: ['市场'] },
  roadbook_entry_demo_003: { industries: ['互联网/科技', '教育'], functions: ['运营'] },
  roadbook_entry_demo_004: { industries: ['互联网/科技'], functions: ['产品'] },
  roadbook_entry_demo_005: { industries: ['互联网/科技'], functions: ['运营', '研发'] },
  roadbook_entry_demo_006: { industries: ['互联网/科技', '制造业'], functions: ['研发'] },
  roadbook_entry_demo_007: { industries: ['公务员/体制内', '教育'], functions: ['职能/行政'] },
  roadbook_entry_demo_008: { industries: ['公务员/体制内'], functions: ['职能/行政'] },
  roadbook_entry_demo_009: { industries: ['消费品', '制造业'], functions: ['市场'] },
  roadbook_entry_mid_001: { industries: ['互联网/科技'], functions: ['产品'] },
  roadbook_entry_mid_002: { industries: ['互联网/科技', '文化传媒'], functions: ['运营', '市场'] },
  roadbook_entry_mid_003: { industries: ['互联网/科技', '制造业'], functions: ['研发'] },
  roadbook_entry_mid_004: { industries: ['消费品'], functions: ['市场'] },
  roadbook_entry_sen_001: { industries: ['制造业'], functions: ['职能/行政'] },
  roadbook_entry_sen_002: { industries: ['制造业', '互联网/科技'], functions: ['产品'] },
  roadbook_entry_sen_003: { industries: ['消费品'], functions: ['市场'] },
  roadbook_entry_sen_004: { industries: ['公务员/体制内'], functions: ['职能/行政'] }
}
// ---------- 场景语义标签（用于跨人群检索匹配） ----------
const SCENARIO_TAG_MAP: Record<string, string[]> = {
  roadbook_entry_demo_001: ['职业选择', '转行', '方向验证'],
  roadbook_entry_demo_002: ['职业选择', '方向验证'],
  roadbook_entry_demo_003: ['职业选择', '方向验证', '转行'],
  roadbook_entry_demo_004: ['职业选择', '方向验证'],
  roadbook_entry_demo_005: ['体制内', '方向验证', '副业'],
  roadbook_entry_demo_006: ['体制内', '家庭平衡'],
  roadbook_entry_demo_007: ['转行', '职业选择'],
  roadbook_entry_demo_008: ['职业选择', '方向验证'],
  roadbook_entry_demo_009: ['转行', '职业选择'],
  roadbook_entry_mid_001: ['管理or专家', '职业选择'],
  roadbook_entry_mid_002: ['职业选择', '转行'],
  roadbook_entry_mid_003: ['转行', '方向验证'],
  roadbook_entry_mid_004: ['副业', '创业', '职业选择'],
  roadbook_entry_sen_001: ['管理or专家', '职业选择'],
  roadbook_entry_sen_002: ['创业', '方向验证'],
  roadbook_entry_sen_003: ['职业风险', '副业', '创业'],
  roadbook_entry_sen_004: ['家庭平衡', '体制内']
}

// ---------- V0.8 人生分类映射（事业 career / 生活 life / 人际关系 relationship） ----------
// cat = 一级；sub = 二级（对应 LIFE_CATEGORIES.subcategories.key）
const LIFE_CATEGORY_MAP: Record<string, { cat: 'career' | 'life' | 'relationship'; sub: string }> = {
  // ── 事业 · 上班族 ──
  roadbook_entry_demo_001: { cat: 'career', sub: 'employment' },
  roadbook_entry_demo_002: { cat: 'career', sub: 'employment' },
  roadbook_entry_demo_003: { cat: 'career', sub: 'employment' },
  roadbook_entry_demo_004: { cat: 'career', sub: 'employment' },
  roadbook_entry_demo_005: { cat: 'career', sub: 'transition' },
  roadbook_entry_demo_006: { cat: 'career', sub: 'employment' },
  roadbook_entry_demo_008: { cat: 'career', sub: 'employment' },
  roadbook_entry_demo_009: { cat: 'career', sub: 'transition' },
  roadbook_entry_mid_001: { cat: 'career', sub: 'employment' },  // 专家 vs 管理
  roadbook_entry_mid_003: { cat: 'career', sub: 'employment' },  // 被优化重新定位
  roadbook_entry_mid_004: { cat: 'career', sub: 'employment' },  // 生育后回归职场（也含 family，主归就业）
  roadbook_entry_sen_001: { cat: 'career', sub: 'employment' },
  roadbook_entry_sen_003: { cat: 'career', sub: 'employment' },
  roadbook_entry_oc_001: { cat: 'career', sub: 'employment' },
  roadbook_entry_oc_002: { cat: 'career', sub: 'transition' },
  roadbook_entry_oc_003: { cat: 'career', sub: 'employment' },
  roadbook_entry_oc_005: { cat: 'career', sub: 'employment' },
  roadbook_entry_oc_006: { cat: 'career', sub: 'employment' },
  roadbook_entry_oc_007: { cat: 'career', sub: 'employment' },
  roadbook_entry_cd_005: { cat: 'career', sub: 'employment' },  // 被领导边缘化
  roadbook_entry_cd_006: { cat: 'relationship', sub: 'at_work' }, // 和直属领导关系僵
  roadbook_entry_cd_007: { cat: 'career', sub: 'transition' },
  roadbook_entry_cd_008: { cat: 'career', sub: 'employment' },  // 互联网 vs 考公
  roadbook_entry_cd_010: { cat: 'career', sub: 'employment' },  // 不知道想要什么

  // ── 事业 · 创业 / 独立 ──
  roadbook_entry_mid_002: { cat: 'career', sub: 'entrepreneur' }, // 副业第二曲线
  roadbook_entry_sen_002: { cat: 'career', sub: 'entrepreneur' }, // 创业卖掉后
  roadbook_entry_pb_001: { cat: 'career', sub: 'entrepreneur' },
  roadbook_entry_pb_002: { cat: 'career', sub: 'entrepreneur' },
  roadbook_entry_pb_003: { cat: 'career', sub: 'entrepreneur' },
  roadbook_entry_pb_004: { cat: 'career', sub: 'entrepreneur' },
  roadbook_entry_pb_005: { cat: 'career', sub: 'entrepreneur' },
  roadbook_entry_cd_001: { cat: 'career', sub: 'entrepreneur' },
  roadbook_entry_cd_002: { cat: 'career', sub: 'entrepreneur' },
  roadbook_entry_cd_009: { cat: 'career', sub: 'entrepreneur' },

  // ── 事业 · 转行 / 转方向 ──
  roadbook_entry_demo_007: { cat: 'career', sub: 'transition' }, // 体制内想出来

  // ── 生活 · 家庭 / 亲情 ──
  roadbook_entry_sen_004: { cat: 'life', sub: 'family' },  // 为下一代 vs 自己
  roadbook_entry_oc_004: { cat: 'life', sub: 'family' },   // 为家庭离开一线城市

  // ── 生活 · 自我成长（部分跨入） ──
  roadbook_entry_cd_003: { cat: 'life', sub: 'self_growth' },  // 做内容没人看（也归自我成长）
  roadbook_entry_cd_004: { cat: 'career', sub: 'entrepreneur' }, // 内容变现归创业

  // ── 名人（保留原 audience，按主题归类） ──
  historical_luxun_001: { cat: 'career', sub: 'transition' },
  notable_leijun_001:   { cat: 'career', sub: 'entrepreneur' },
  notable_rowling_001:  { cat: 'life', sub: 'self_growth' },
  notable_chushiye_001: { cat: 'career', sub: 'entrepreneur' },
  notable_kazuo_001:    { cat: 'career', sub: 'entrepreneur' },
  notable_sushi_001:    { cat: 'life', sub: 'self_growth' },
}

for (const c of allFixtureCases) {
  const m = MATCH_MAP[c.id]
  if (c.case_profile && m) {
    c.case_profile.match_industries = m.industries
    c.case_profile.match_functions = m.functions
  }
  const st = SCENARIO_TAG_MAP[c.id]
  if (st) c.scenario_tags = st
  // V0.5.1 注入技能路径
  if (skillsLearnedMap[c.id]) {
    c.skills_learned = skillsLearnedMap[c.id]
  }
  // V0.6 注入时间轴后续
  if (timelineFollowupsMap[c.id]) {
    c.timeline_followups = timelineFollowupsMap[c.id]
  }
  // V0.8 注入人生分类标签
  const lc = LIFE_CATEGORY_MAP[c.id]
  if (lc) {
    c.life_category = lc.cat
    c.life_subcategory = lc.sub
  }
}

// ---------- 坑标签聚合 ----------
export const pitfallTags: { tag: string; entryIds: string[] }[] = [
  { tag: '只看薪资', entryIds: ['roadbook_entry_demo_001', 'roadbook_entry_demo_006'] },
  { tag: '没问直属领导', entryIds: ['roadbook_entry_demo_001', 'roadbook_entry_demo_002'] },
  { tag: '等待没有计划', entryIds: ['roadbook_entry_demo_002'] },
  { tag: '没做真实岗位体验', entryIds: ['historical_luxun_001', 'roadbook_entry_demo_005', 'notable_rowling_001'] },
  { tag: '把熟练误认为成长', entryIds: ['roadbook_entry_demo_003', 'roadbook_entry_demo_004'] },
  { tag: '过早放弃已有积累', entryIds: ['roadbook_entry_demo_005', 'roadbook_entry_demo_009', 'roadbook_entry_mid_003'] },
  { tag: '被"该带人了"带节奏', entryIds: ['roadbook_entry_mid_001'] },
  { tag: '把低谷当终点', entryIds: ['notable_rowling_001', 'notable_sushi_001', 'roadbook_entry_sen_002'] },
  { tag: '只盯职级忽略精力', entryIds: ['roadbook_entry_sen_001', 'roadbook_entry_sen_003'] }
]

// ---------- 路书库首页: 和我相似的3页（按 audience 在检索时再过滤） ----------
export const similarEntriesForDemo = ['roadbook_entry_demo_001', 'roadbook_entry_demo_002', 'roadbook_entry_demo_003']

// 按 audience 取"和我差不多 + 走过的人"
export function ordinaryCasesForAudience(audience: string): OrdinaryCase[] {
  return allFixtureCases.filter(c => !c.notable && c.audience === audience)
}
// 按 audience 取"历史/当代名人"
export function notableCasesForAudience(audience: string): OrdinaryCase[] {
  return allFixtureCases.filter(c => c.notable && c.audience === audience)
}

export type { ID } from './types'
import type { ID as IDType } from './types'
export { IDType }
