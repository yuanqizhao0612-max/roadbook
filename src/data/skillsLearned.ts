// ============================================================
// 路书 · 过来人技能路径数据 (V0.5.1)
// 每条样本对应的"TA 后来学了什么"，驱动求解者路径的核心出口
// 设计原则：
//   - 技能必须具体、可验证（不是"沟通能力"这种虚的）
//   - why_need 必须和故事情节关联
//   - how_learned 必须是普通人可复制的真实路径
// ============================================================
import type { SkillLearned } from './types'

// key = OrdinaryCase.id，value = 这个过来人后来学的技能
export const skillsLearnedMap: Record<string, SkillLearned[]> = {
  // ========== 职场新人 ==========
  roadbook_entry_demo_001: [
    {
      skill_name: '面试时反向提问',
      why_need: '入职后发现直属领导没人管，如果面试时会提问，就能提前判断这份工作值不值得',
      how_learned: '看了 3 篇脉脉面试复盘帖 + 自己整理了一份"反向提问清单"，每次面试都带着问',
      what_can_do_after: '能在面试 15 分钟内判断出：这个领导的风格、前 90 天做什么、一年后能不能独立',
      estimated_hours: '业余 2 天'
    },
    {
      skill_name: '90 天入职规划',
      why_need: '入职后才发现成长速度远低于预期，如果一开始就有规划，能更早识别问题',
      how_learned: '读了一本关于"入职前 90 天"的书 + 结合自己踩坑写了模板',
      what_can_do_after: '入职第一周就能画出：我要学什么、谁会给我反馈、第 90 天要交什么',
      estimated_hours: '业余 1 周'
    }
  ],
  roadbook_entry_demo_002: [
    {
      skill_name: '行业访谈（cold reach）',
      why_need: '等待期需要做真实的行业访谈来验证方向，不会约人就只能空焦虑',
      how_learned: '在脉脉/即刻上找 5 个目标岗位的人，直接私信约 30 分钟语音，准备了 8 个问题清单',
      what_can_do_after: '能在 1 个月内约到 5-8 个目标行业的人聊真实情况',
      estimated_hours: '业余 2-3 周'
    },
    {
      skill_name: '目标岗位作品制作',
      why_need: '面试时需要拿出"我做过类似的事"的证据，而不是空谈意向',
      how_learned: '拆解目标岗位的 3 个真实案例 + 自己动手做了一个 mini 项目',
      what_can_do_after: '能独立产出一个目标岗位级别的交付物（方案/作品/分析）',
      estimated_hours: '业余 1-2 周'
    }
  ],
  roadbook_entry_demo_003: [
    {
      skill_name: '业余时间项目管理',
      why_need: '一边工作一边给新方向攒证据，如果不善用业余时间，半年也攒不出东西',
      how_learned: '用 Trello 做了一个周计划板 + 每周固定 3 晚各 2 小时',
      what_can_do_after: '能在不影响主业的情况下，每周稳定产出 10+ 小时的副线成果',
      estimated_hours: '坚持 3 个月形成习惯'
    },
    {
      skill_name: '内容社区运营',
      why_need: '转去教育内容方向，需要懂怎么用内容吸引人',
      how_learned: '在小红书/公众号做了一个 mini 账号实操 + 复盘数据',
      what_can_do_after: '能独立策划一个内容选题、写出会被转发的文案、看懂基础数据',
      estimated_hours: '业余 1-2 个月'
    }
  ],
  roadbook_entry_demo_004: [
    {
      skill_name: '向上管理（反馈机制）',
      why_need: '第一份工作累是因为没人教、没反馈机制，如果会主动要反馈，可能不用换',
      how_learned: '读了一本向上管理的书 + 每两周主动约直属领导 15 分钟同步',
      what_can_do_after: '能让领导清楚你在做什么、卡在哪、需要什么支持',
      estimated_hours: '业余 1 周 + 持续练习'
    },
    {
      skill_name: '职业判断框架',
      why_need: '判断"适合不适合"需要方法，不能凭感觉',
      how_learned: '总结了 3 个判断问题：在成长还是在变熟练？谁给我反馈？一年后我能独立做什么？',
      what_can_do_after: '能在 1 个月内用统一框架判断任何一份工作值不值得留',
      estimated_hours: '业余 3 天'
    }
  ],
  roadbook_entry_demo_005: [
    {
      skill_name: '业余低风险转行',
      why_need: '转行不是辞职-学习-找工作三段式，要学会"边上班边验证"',
      how_learned: '把转行拆成：先学基础课 → 做 3 个真实项目 → 内部转岗试水',
      what_can_do_after: '能在不辞职的情况下，用 6-9 个月业余时间完成方向切换',
      estimated_hours: '业余 8 个月'
    },
    {
      skill_name: '数据分析实操',
      why_need: '从运营转数据，需要拿得出手的项目证据',
      how_learned: 'SQL 基础课 + 用公司公开数据做了 2 个分析案例',
      what_can_do_after: '能独立完成一个数据分析任务：取数→分析→出结论',
      estimated_hours: '业余 3-4 个月'
    }
  ],

  // ========== 而立转型 ==========
  roadbook_entry_mid_001: [
    {
      skill_name: '专家线 vs 管理线判断',
      why_need: '30+ 被推着带人，但需要判断自己更适合"做深"还是"带人"',
      how_learned: '做了一个简单的自我观察：一开周会就累、一做深度方案就兴奋→天然偏专家',
      what_can_do_after: '能用一周的自我观察数据判断自己适合专家线还是管理线',
      estimated_hours: '业余 1 周'
    },
    {
      skill_name: '深度业务精通',
      why_need: '选了专家线就要把一条业务链路吃透',
      how_learned: '主动请缨 own 一条核心链路 + 把上下游逻辑画成图谱',
      what_can_do_after: '能成为某条业务链路里唯一懂全貌的人',
      estimated_hours: '持续 12-18 个月'
    }
  ],
  roadbook_entry_mid_002: [
    {
      skill_name: '副业最小验证法',
      why_need: '副业前半年当发泄白忙了，需要学会"先验证再投入"',
      how_learned: '定了硬指标：副业赚到第一笔陌生人的钱才算验证通过',
      what_can_do_after: '能用 1-3 个月低成本验证一个副业方向值不值得做',
      estimated_hours: '业余 1 个月验证期'
    },
    {
      skill_name: '付费内容产品化',
      why_need: '副业要从接小单升级到有稳定收入的专栏',
      how_learned: '从免费分享→9 元体验课→99 元专栏，逐步验证付费意愿',
      what_can_do_after: '能把一个零散能力打包成可销售的付费产品',
      estimated_hours: '业余 6-12 个月迭代'
    }
  ],
  roadbook_entry_mid_003: [
    {
      skill_name: '经验重新定位',
      why_need: '35+ 被优化后纯写代码会被更便宜的人替代，需要重新定义价值',
      how_learned: '把过去经验打包成"技术 + 业务方案"的能力组合',
      what_can_do_after: '能在面试中讲清楚：你不只是写代码，是能带队落地业务的人',
      estimated_hours: '业余 1-2 个月'
    },
    {
      skill_name: '技术方案写作',
      why_need: '去中小公司做技术负责人需要拿出成体系的方案能力',
      how_learned: '把过去做的项目提炼成 3 份完整的技术方案文档',
      what_can_do_after: '能独立写一份完整的"技术选型 + 落地路径 + 风险预案"方案',
      estimated_hours: '业余 2-4 周'
    }
  ],
  roadbook_entry_mid_004: [
    {
      skill_name: '项目制重启',
      why_need: '生育后回归不想一步到位，需要用项目制证明自己还能打',
      how_learned: '主动找公司谈"先做 3 个月项目顾问"的合作模式',
      what_can_do_after: '能用项目制方式低成本、低姿态地重启职业',
      estimated_hours: '谈判 1-2 周 + 项目期 3 个月'
    },
    {
      skill_name: '案例化沟通',
      why_need: '空窗期不需要解释，需要用作品和案例说话',
      how_learned: '把这 3 个月项目的成果整理成可展示的案例集',
      what_can_do_after: '能用具体案例替代"解释空窗"，在面试中占据主动',
      estimated_hours: '业余 2 周'
    }
  ],

  // ========== 不惑规划 ==========
  roadbook_entry_sen_001: [
    {
      skill_name: '精力管理',
      why_need: '体检出问题后才意识到：靠硬扛换来的职级代价是健康',
      how_learned: '读了精力管理相关书 + 做了睡眠/运动/饮食三项量化跟踪',
      what_can_do_after: '能把精力当资产管，而不是无限透支',
      estimated_hours: '业余 1 个月建立习惯'
    },
    {
      skill_name: '经验方法论化',
      why_need: '从"自己干"转去"培养人、定打法"，需要把经验变成可教的方法',
      how_learned: '把自己 20 年管理经验提炼成 5 个可复用的方法论卡片',
      what_can_do_after: '能把隐性经验变成别人能学会、能用上的显性方法',
      estimated_hours: '业余 2-3 个月'
    }
  ],
  roadbook_entry_sen_002: [
    {
      skill_name: '天使投资入门',
      why_need: '卖掉公司后想做"参与但不全控"的事，需要懂早期投资',
      how_learned: '跟投了 2 个熟人项目 + 读了早期投资相关书',
      what_can_do_after: '能判断一个早期项目值不值得参与、用什么方式参与',
      estimated_hours: '业余 3-6 个月'
    },
    {
      skill_name: '导师式参与',
      why_need: '下半场不想再当老大，想"帮别人当老大"',
      how_learned: '以"合伙人 + 导师"身份加入小公司，只参与战略不参与日常',
      what_can_do_after: '能找到适合"经验贡献但不全职"的参与方式',
      estimated_hours: '探索 6-12 个月'
    }
  ],
  roadbook_entry_sen_003: [
    {
      skill_name: '经验产品化',
      why_need: '外企光环会褪色，但 25 年经验可以变成不依赖头衔的产品',
      how_learned: '把咨询经验写成方法论课 + 做成诊断工具',
      what_can_do_after: '能把经验打包成可独立销售的课程/工具/诊断包',
      estimated_hours: '业余 6-12 个月'
    },
    {
      skill_name: '轻咨询定价',
      why_need: '做顾问需要学会只接熟悉行业的活、合理定价',
      how_learned: '先做 3 个免费/低价案例验证价值，再定正式报价',
      what_can_do_after: '能给自己的咨询服务定一个有底气、市场也接受的价格',
      estimated_hours: '业余 1-2 个月'
    }
  ],
  roadbook_entry_sen_004: [
    {
      skill_name: '兴趣社群运营',
      why_need: '体制内空间有限，需要用兴趣+社群开辟第二现金流',
      how_learned: '从身边 5 个同好开始，做小规模付费社群',
      what_can_do_after: '能把一个兴趣变成有稳定收入的小社群',
      estimated_hours: '业余持续运营'
    },
    {
      skill_name: '亲子共学设计',
      why_need: '想同时兼顾孩子和自己的成长',
      how_learned: '把"陪伴孩子"改造成"和孩子一起学某件事"',
      what_can_do_after: '能把亲子时间变成双方都有成长的时间',
      estimated_hours: '日常融入'
    }
  ],

  // ========== 做产品/参赛 ==========
  roadbook_entry_pb_001: [
    {
      skill_name: '最小可演示版本（Demo）制作',
      why_need: '在方向上空想 3 周不如做一个能给人看的粗糙版本',
      how_learned: '用 2 周做一个能跑的 demo + 找 8 个目标用户看反应',
      what_can_do_after: '能在 1-2 周内把"想法"变成"能给人用的东西"',
      estimated_hours: '集中 2 周'
    },
    {
      skill_name: '用户访谈验证',
      why_need: '方向不是想出来的，是问出来的',
      how_learned: '准备了访谈提纲 + 找 5-10 个真实目标用户聊',
      what_can_do_after: '能在 1 周内从真实用户那里得到"值不值得做"的判断',
      estimated_hours: '业余 1 周'
    }
  ],
  roadbook_entry_pb_002: [
    {
      skill_name: '副业付费验证法',
      why_need: '做产品最危险的是自我感动，需要硬指标',
      how_learned: '定"赚到第一笔陌生人的钱才算验证通过"',
      what_can_do_after: '能用"有没有陌生人为你付费"来判断产品方向值不值得继续',
      estimated_hours: '业余 1-3 个月'
    }
  ],
  roadbook_entry_pb_003: [
    {
      skill_name: '参赛/项目周计划拆解',
      why_need: '怕做不完是因为目标太大，需要切成每周可交付的小块',
      how_learned: '把大目标拆成每周一个可提交节点 + 用甘特图管理',
      what_can_do_after: '能把任何"怕做不完"的大目标拆成每周可执行的计划',
      estimated_hours: '业余 1 天搭建'
    }
  ],
  roadbook_entry_pb_004: [
    {
      skill_name: '业余产品验证',
      why_need: '不辞职做产品需要学会"边上班边验证"',
      how_learned: '14 个月业余做产品 → 有稳定付费用户才离职',
      what_can_do_after: '能在主业之外独立跑通一个有付费用户的小产品',
      estimated_hours: '业余 12-14 个月'
    }
  ],
  roadbook_entry_pb_005: [
    {
      skill_name: '经验最小可卖单元',
      why_need: '40+ 把经验变产品，别一上来做重，先找最小可卖的东西',
      how_learned: '从一个付费专栏做起 → 跑通再放大',
      what_can_do_after: '能把行业经验提炼成一个有人愿意付费的最小产品',
      estimated_hours: '业余 1-3 个月验证'
    }
  ],

  // ========== 高频真实困惑 ==========
  roadbook_entry_cd_001: [
    {
      skill_name: '可售能力盘点',
      why_need: '想做副业但不知道卖什么——其实你已经被人免费问过了',
      how_learned: '列"同事朋友私下找我帮过什么忙"的清单',
      what_can_do_after: '能在 1 天内列出自己"已经被需要但还没收费"的能力',
      estimated_hours: '业余 1 天'
    }
  ],
  roadbook_entry_cd_002: [
    {
      skill_name: '副业硬指标验证',
      why_need: '"再坚持一下"和"真的没跑通"分不清',
      how_learned: '设"3 个月不见钱就收"的死线 + 具体数字目标',
      what_can_do_after: '能给任何尝试设定明确的"成功/失败"标准',
      estimated_hours: '业余 1 天定指标'
    }
  ],
  roadbook_entry_cd_003: [
    {
      skill_name: '真实选题法',
      why_need: '没人看通常不是你不行，是还没说别人真正在意的话',
      how_learned: '把自己最纠结的事写成长内容——那是别人也在想但说不出口的',
      what_can_do_after: '能找到"自己最真实、别人也在意"的选题',
      estimated_hours: '业余 1-2 周'
    }
  ],
  roadbook_entry_cd_004: [
    {
      skill_name: '最小付费测试',
      why_need: '变现不是加商业模式，是问粉丝愿意为什么花钱',
      how_learned: '做一次 9-300 元的付费测试，看谁买单、为什么买单',
      what_can_do_after: '能用最小成本测试粉丝的真实付费意愿',
      estimated_hours: '业余 1-2 周'
    }
  ],
  roadbook_entry_cd_005: [
    {
      skill_name: '被边缘化应对',
      why_need: '被换掉核心项目不等于该走——先把手里牌打完',
      how_learned: '用那半年时间考证 + 悄悄看外部机会',
      what_can_do_after: '能在不利局面下把现有资源用到极致',
      estimated_hours: '业余 3-6 个月'
    }
  ],
  roadbook_entry_cd_006: [
    {
      skill_name: '职场关系依赖度判断',
      why_need: '和领导关系僵了，先判断"我的成长有多依赖这段关系"',
      how_learned: '画一张"我的晋升路径依赖谁"的图',
      what_can_do_after: '能在一周内判断：关系僵了是该修、该走、还是该无视',
      estimated_hours: '业余 3 天'
    }
  ],
  roadbook_entry_cd_007: [
    {
      skill_name: '积累迁移评估',
      why_need: '转行怕浪费积累？需要判断"旧积累在新位置有多稀缺"',
      how_learned: '画一张"我现有的能力在哪些新位置上比别人更稀缺"的图',
      what_can_do_after: '能找到让过去积累更值钱的转行方向',
      estimated_hours: '业余 1 周'
    }
  ],
  roadbook_entry_cd_008: [
    {
      skill_name: '逃离 vs 选择判断',
      why_need: '想离开当前工作时，先分清是"想去那个"还是"想逃这个"',
      how_learned: '休假 / 暂停一下，问自己："如果现在这份不累，我还想走吗？"',
      what_can_do_after: '能分辨自己是逃离式选择还是主动选择',
      estimated_hours: '几天自我观察'
    }
  ],
  roadbook_entry_cd_009: [
    {
      skill_name: '创业红线设定',
      why_need: '想创业怕亏——有了底线反而更敢做决策',
      how_learned: '定一条"最多亏多少就无条件收"的红线',
      what_can_do_after: '能给创业/冒险设定一个"亏了也不伤筋动骨"的止损线',
      estimated_hours: '业余 1 天'
    }
  ],
  roadbook_entry_cd_010: [
    {
      skill_name: '排除法方向探索',
      why_need: '不知道想要什么时，先用排除法删掉"确定不要的"',
      how_learned: '列"确定不想做的 3 件事" → 剩下的就是可能方向',
      what_can_do_after: '能在 1 周内从"完全不知道"收敛到 2-3 个可试方向',
      estimated_hours: '业余 1 周'
    }
  ],

  // ========== 高年龄段补充 ==========
  roadbook_entry_oc_001: [
    {
      skill_name: '舒适区成长诊断',
      why_need: '分不清是"腻了"还是"不长"——前者换心情，后者换战场',
      how_learned: '问自己："过去 6 个月我学到了什么新东西？"',
      what_can_do_after: '能判断自己在当前岗位是否还有成长空间',
      estimated_hours: '业余 1 天'
    }
  ],
  roadbook_entry_oc_002: [
    {
      skill_name: '曲线位置评估',
      why_need: '40+ 的溢价不在职级，在"你是不是站在下一条曲线的早期"',
      how_learned: '判断目标方向是不是一条正在上升的曲线 + 你能站在哪个位置',
      what_can_do_after: '能判断一个新机会是不是值得"降职换赛道"',
      estimated_hours: '业余 1-2 周'
    }
  ],
  roadbook_entry_oc_003: [
    {
      skill_name: '向上反馈获取',
      why_need: '中层上不去别猜原因，去问 +2',
      how_learned: '鼓起勇气约+2（老板的老板）15 分钟："我距离下一级差什么？"',
      what_can_do_after: '能从组织高层拿到真实的晋升反馈',
      estimated_hours: '一次 15 分钟谈话'
    }
  ],
  roadbook_entry_oc_004: [
    {
      skill_name: '远程工作谈判',
      why_need: '想兼顾家庭和事业，需要学会把工作转成远程',
      how_learned: '提前半年和公司谈"部分远程"的可能性 + 用产出证明可行性',
      what_can_do_after: '能把一份现场工作改造成部分远程模式',
      estimated_hours: '谈判 1-2 周 + 过渡期'
    }
  ],
  roadbook_entry_oc_005: [
    {
      skill_name: '产后职场主动重塑',
      why_need: '生育回来发现位置变了——别等公司安排',
      how_learned: '主动找一个"大家都不想碰但很重要"的跨部门项目',
      what_can_do_after: '能在 3 个月内重新证明自己的价值',
      estimated_hours: '集中 3 个月'
    }
  ],
  roadbook_entry_oc_006: [
    {
      skill_name: '后半生意义规划',
      why_need: '50+ 拿钱走后最大的风险不是钱不够，是意义感断了',
      how_learned: '在离开前就想清楚"接下来 10 年我想用什么方式被需要"',
      what_can_do_after: '能在任何重大转变前先定义"我接下来为什么而活"',
      estimated_hours: '数月深思'
    }
  ],
  roadbook_entry_oc_007: [
    {
      skill_name: '经验独立产品化',
      why_need: '55+ 靠人脉吃饭会随时间衰减，要变成不依赖关系的产品',
      how_learned: '把方法论做成线上课程 + 诊断工具',
      what_can_do_after: '能让经验"不靠任何人的面子"也能卖出去',
      estimated_hours: '业余 12-18 个月'
    }
  ],
  roadbook_entry_oc_008: [
    {
      skill_name: '退休前启动法',
      why_need: '"等退休再做"等于永远不做——趁还有资源和惯性时开始',
      how_learned: '用业余时间从最小版本开始（如播客、小专栏）',
      what_can_do_after: '能在退休前就把"想做的事"跑起来',
      estimated_hours: '退休前 2-5 年业余'
    }
  ],
}

// 给某些补充样本也加上（demo_006-009 等）
skillsLearnedMap['roadbook_entry_demo_006'] = [
  {
    skill_name: '学习密度评估',
    why_need: '选 offer 不能只看薪资，要算"一年后我值多少钱"',
    how_learned: '面试时问清楚：前 90 天学什么、半年后独立做什么、一年后能 own 什么',
    what_can_do_after: '能在面试时判断一份工作的学习密度',
    estimated_hours: '业余 1 天'
  }
]
skillsLearnedMap['roadbook_entry_demo_007'] = [
  {
    skill_name: '业余试水方法论',
    why_need: '想离开稳定岗位但不敢裸辞——需要学会"边上班边验证"',
    how_learned: '业余接单 12 个月，证明收入可达 60% 才正式谈离职',
    what_can_do_after: '能在不辞职的情况下验证自由职业的可行性',
    estimated_hours: '业余 6-12 个月'
  }
]
skillsLearnedMap['roadbook_entry_demo_008'] = [
  {
    skill_name: '期望管理（家人/自己）',
    why_need: '被家人催着考编——需要分清"家人的期望"和"自己的选择"',
    how_learned: '和家人坦诚沟通自己的真实想法 + 同时保留两条路',
    what_can_do_after: '能在"家人期望"和"自我选择"之间找到平衡',
    estimated_hours: '几次坦诚对话'
  }
]
skillsLearnedMap['roadbook_entry_demo_009'] = [
  {
    skill_name: '行业差异调研',
    why_need: '同样叫品牌岗，不同行业每天干的活差很大',
    how_learned: '面试前找目标行业 3 个人问清楚：KPI 是什么、每天和谁说话、靠什么被看见',
    what_can_do_after: '能在入职前搞清目标岗位的真实日常',
    estimated_hours: '业余 1 周'
  }
]
// ---------- 历史 / 当代名人（跨时代参照，支撑个性化 7 天行动） ----------
skillsLearnedMap['historical_luxun_001'] = [
  { skill_name: '在两条路之间做判断实验', why_need: '学了很久想换方向，怕浪费', how_learned: '先小试（写文章、翻译）验证自己是不是真喜欢，再决定弃医', what_can_do_after: '能低成本验证"换方向"是不是对的', estimated_hours: '数月' },
  { skill_name: '用写作把想法变成影响', why_need: '想唤醒更多人', how_learned: '写小说与杂文，把个人判断变成公共讨论', what_can_do_after: '能把私下想法变成可被讨论的公共议题', estimated_hours: '长期' },
  { skill_name: '先确认再放弃已有积累', why_need: '怕"学了很久"成为枷锁', how_learned: '问自己"是不喜欢这类事本身，还是暂时还不会"', what_can_do_after: '能区分"真该换"和"一时挫败"', estimated_hours: '一次性想清楚' }
]
skillsLearnedMap['notable_leijun_001'] = [
  { skill_name: '顺势而为的赛道判断', why_need: '40 岁再创业要选对方向', how_learned: '读趋势 + 结合自身前 20 年积累', what_can_do_after: '能选到能滚雪球的赛道', estimated_hours: '持续' },
  { skill_name: '社区驱动冷启动', why_need: '没资源没人信', how_learned: '先做 MIUI 攒一批信你的用户', what_can_do_after: '能零预算起量', estimated_hours: '长期' },
  { skill_name: '长期投入而非赚快钱', why_need: '容易被短期利润带偏', how_learned: '把利润再投入产品与生态', what_can_do_after: '能建立壁垒', estimated_hours: '持续' }
]
skillsLearnedMap['notable_rowling_001'] = [
  { skill_name: '在最低谷保留日常创作习惯', why_need: '容易被处境压垮', how_learned: '每天固定写一点，不让外界打断节奏', what_can_do_after: '能在最差条件下也不停笔', estimated_hours: '长期' },
  { skill_name: '把拒稿当数据而非否定', why_need: '被拒易放弃', how_learned: '收集反馈继续投下一家', what_can_do_after: '提高命中率', estimated_hours: '持续' },
  { skill_name: '用世界观承载个人处境', why_need: '痛苦需要出口', how_learned: '把经历写进故事', what_can_do_after: '既治愈自己也引发共鸣', estimated_hours: '长期' }
]
skillsLearnedMap['notable_chushiye_001'] = [
  { skill_name: '把工业经验迁移到新领域', why_need: '跨界从头', how_learned: '把做企业的精细管理用到农业', what_can_do_after: '能降维改造旧行业', estimated_hours: '数年' },
  { skill_name: '十年树木的长期耕耘', why_need: '农业想快', how_learned: '接受慢周期，死磕种植与品控', what_can_do_after: '让时间给出结果', estimated_hours: '十年' },
  { skill_name: '用品质标准建品牌', why_need: '农产品同质化', how_learned: '死磕糖酸比与口感一致性', what_can_do_after: '能形成溢价与口碑', estimated_hours: '持续' }
]
skillsLearnedMap['notable_kazuo_001'] = [
  { skill_name: '把哲学变成可执行的经营', why_need: '空喊文化没用', how_learned: '阿米巴经营 + 单位时间核算，让每人都算账', what_can_do_after: '能把价值观落地为动作', estimated_hours: '长期' },
  { skill_name: '用长期主义穿越周期', why_need: '易被短期波动带偏', how_learned: '把目标锚定 10 年', what_can_do_after: '不被噪音左右', estimated_hours: '持续' },
  { skill_name: '把判断变成可教的方法', why_need: '经验只自己用太浪费', how_learned: '写书 + 授课，沉淀方法论', what_can_do_after: '让经验杠杆化', estimated_hours: '长期' }
]
skillsLearnedMap['notable_sushi_001'] = [
  { skill_name: '把贬谪当自由创作的留白', why_need: '被边缘易消沉', how_learned: '在困局里读书写作', what_can_do_after: '把委屈变成作品', estimated_hours: '长期' },
  { skill_name: '把外界评判与自我价值分开', why_need: '易被否定击垮', how_learned: '写日记自省，练"不动心"', what_can_do_after: '内心更稳', estimated_hours: '持续' },
  { skill_name: '用山水与日常安顿情绪', why_need: '情绪耗人', how_learned: '寄情自然与炊事', what_can_do_after: '低谷也能过得有滋味', estimated_hours: '一生' }
]
