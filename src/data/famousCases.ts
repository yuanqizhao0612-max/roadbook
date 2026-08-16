// ============================================================
// 路书 · 名人 / 历史人物路书库（V0.9.4 名人先行战略）
// 8 位跨时代高共鸣人物，覆盖三人群：
//   新人(new_grad): 曾国藩 / 海伦·凯勒
//   而立(mid_career): 任正非 / 邓亚萍 / 村上春树 / 王阳明 / 乔布斯
//   不惑(senior): 巴菲特
// 每位均自带 timeline_followups(3) + skills_learned(3) + sources(2)，
// 直接支撑「时光机」与「个性化 7 天行动」，不依赖外部注入表。
// 定位：历史/当代名人只作"跨时代参照"，均含来源、不虚构。
// ============================================================
import type { OrdinaryCase } from './types'

export const famousCases: OrdinaryCase[] = [
  // ===================== 职场新人 =====================
  {
    id: 'famous_zengguofan_001',
    audience: 'new_grad',
    source_marker: 'demo_fixture',
    notable: true,
    title: '曾国藩：考秀才考了 7 次，最后成了晚清第一名臣',
    who: '曾国藩，湖南湘乡农家子弟，科举路上起步极慢',
    one_line_choice: '起点很低、考了 7 次才中秀才，却把"慢"和"笨功夫"走成了路',
    biggest_pitfall: '把"起步慢、资质平平"误读成"这辈子也就这样了"',
    why_similar: '你刚毕业，觉得自己背景普通、不如别人聪明。曾国藩恰恰是用"最笨的方法"走到顶的——他的故事不是鸡汤，是一套可复制的方法。',
    time_horizon: 'historical',
    outcome: '中秀才后一路中举人、进士，入翰林；后组建湘军平定太平天国，与李鸿章、左宗棠等并称"晚清中兴名臣"，谥号"文正"。',
    satisfaction: 'satisfied',
    if_again: '（历史人物无法假设）值得带走的是：他不靠天赋，靠"每日写日记复盘、一件事做到底"的笨功夫。',
    advice: '起点低不可怕，可怕的是因为慢就放弃。把一件小事做到底、每天复盘，比聪明但飘着的人走得更远。',
    stage_tag: 'historical',
    profile_tag: 'slow_starter',
    scenario_tags: ['职业选择', '方向验证', '自我成长', '起点低'],
    life_category: 'life',
    life_subcategory: 'self_growth',
    sources: [
      { source_id: 'src_zgf_001', title: '《曾国藩家书》《曾国藩全集》', publisher_or_author: '曾国藩', url_or_bibliography: '岳麓书社等公开出版', date: '清', source_type: 'primary', supported_claims: ['科举屡挫后中进士入翰林', '以日记自省、治军治家均有系统方法'] },
      { source_id: 'src_zgf_002', title: '《曾国藩传》（唐浩明）等公开传记与史料', publisher_or_author: '公开出版 / 学术界整理', url_or_bibliography: '公开出版传记', date: '综合', source_type: 'reputable_secondary', supported_claims: ['考秀才七次方中', '组建湘军、平定太平天国为公开记载'] }
    ],
    skills_learned: [
      { skill_name: '每日复盘日记', why_need: '管不住自己、容易三天打鱼', how_learned: '用最便宜的本子，每天睡前写"今日三省"（做了什么、哪里不对、明天改什么）', what_can_do_after: '能持续自我观察，把模糊的"我要变好"变成可追踪的小改进', estimated_hours: '坚持一生（每天 15 分钟）' },
      { skill_name: '笨功夫拆解目标', why_need: '大事不会做、容易畏难', how_learned: '把模糊目标拆成"今天就能做"的最小一步，做完再拆下一步', what_can_do_after: '能把任何大目标变成每天可执行的小动作，不再被规模吓退', estimated_hours: '长期（方法一旦学会即可用）' },
      { skill_name: '主动结交良师', why_need: '入京城后需要有人指路', how_learned: '给前辈写请教信、逢人便问"我哪里可以更好"', what_can_do_after: '能建立起自己的贵人网络，少走弯路', estimated_hours: '持续（社交型，无终点）' }
    ],
    timeline_followups: [
      { years_after: 1, what_happened: '23 岁中举人，结束长达数年的科考苦读', what_i_realized: '原来"慢"不是缺陷，是把基础打扎实的过程——后来者往往摔得更少', current_status: '已取得举人功名，准备进京会试' },
      { years_after: 3, what_happened: '中进士、点翰林，正式进入京城士大夫圈子', what_i_realized: '笨功夫在更高阶的竞争里反而稳：别人靠聪明，他靠"不偷懒"', current_status: '翰林院任职，开启仕途' },
      { years_after: 7, what_happened: '组建湘军、屡败屡战，最终平定太平天国', what_i_realized: '真正决定成败的不是聪明，是能不能在反复失败之后还一次次站起来', current_status: '封侯拜相，成为晚清中枢重臣' }
    ]
  },
  {
    id: 'famous_keller_001',
    audience: 'new_grad',
    source_marker: 'demo_fixture',
    notable: true,
    title: '海伦·凯勒：又聋又盲，却考进哈佛、写下 14 本书',
    who: '海伦·凯勒，19 个月大因大病失去视力与听力',
    one_line_choice: '在几乎全黑全静的世界里，靠一位老师和"一个字母一个字母"的触摸，活成了作家与社会运动者',
    biggest_pitfall: '把"天生条件差"当成"我能做的事的天花板"',
    why_similar: '你总觉得"条件不够"——学历、资源、背景。海伦的故事说：限制真实存在，但它框不住你想成为谁。',
    time_horizon: 'historical',
    outcome: '在老师安妮·沙利文帮助下学会读写与说话，1904 年从拉德克利夫学院（哈佛女性学院）毕业，成为首位获文学士学位的聋盲人士；一生著述 14 本，推动残障权益与妇女参政。',
    satisfaction: 'satisfied',
    if_again: '值得带走的是：她不是"战胜了残疾"，而是找到了和限制共处的方式。',
    advice: '你抱怨的"不够"，多半没到她的量级。先问：在现有条件下，我今天能为想做的事做什么？',
    stage_tag: 'historical',
    profile_tag: 'overcome_limit',
    scenario_tags: ['自我成长', '克服限制', '起点低', '学习'],
    life_category: 'life',
    life_subcategory: 'self_growth',
    sources: [
      { source_id: 'src_keller_001', title: '《我的一生》(The Story of My Life)', publisher_or_author: 'Helen Keller', url_or_bibliography: '1903 年初版（公开域）', date: '1903', source_type: 'primary', supported_claims: ['自幼聋盲', '在沙利文帮助下学会读写说话', '毕业于拉德克利夫学院'] },
      { source_id: 'src_keller_002', title: '拉德克利夫学院 / 海伦·凯勒国际公开档案', publisher_or_author: 'Harvard Radcliffe / 公开档案', url_or_bibliography: '公开教育机构档案与传记', date: '综合', source_type: 'reputable_secondary', supported_claims: ['首位聋盲文学士', '毕生投身残障权益与写作'] }
    ],
    skills_learned: [
      { skill_name: '把不可能拆成可触碰的小步', why_need: '大目标太吓人，一动就瘫痪', how_learned: '从"在手心拼一个单词"开始，确认"沟通的门"能被打开', what_can_do_after: '能启动任何看似不可能的事——先做出最小的一步', estimated_hours: '一生（方法可立即用）' },
      { skill_name: '找一位真正的导师', why_need: '自己摸黑效率极低', how_learned: '珍视沙利文式的陪伴，把"被带着走"变成"自己会走"', what_can_do_after: '能借助他人经验加速突破瓶颈', estimated_hours: '长期' },
      { skill_name: '用写作把经历变力量', why_need: '痛苦需要出口，也渴望被理解', how_learned: '写自传与文章，把个人遭遇写成公共议题', what_can_do_after: '能影响他人，也借表达治愈自己', estimated_hours: '持续' }
    ],
    timeline_followups: [
      { years_after: 1, what_happened: '7 岁沙利文老师到来，在手上拼写"water"，第一次明白"字"连接世界', what_i_realized: '沟通的门一旦打开，孤立感就开始消散', current_status: '初步掌握手语拼写，能表达基本需求' },
      { years_after: 3, what_happened: '学会说话（触摸喉咙感受振动），能与人面对面对话', what_i_realized: '聋盲不等于与世隔绝，只是换了一种连接方式', current_status: '进入正规学校，成绩追上同龄人' },
      { years_after: 5, what_happened: '升入大学、出版著作，成为演说家与社会运动者', what_i_realized: '真正的障碍是"认命"，不是身体', current_status: '哈佛体系毕业，开启公共写作与倡导生涯' }
    ]
  },

  // ===================== 而立转型 =====================
  {
    id: 'famous_renzhengfei_001',
    audience: 'mid_career',
    source_marker: 'demo_fixture',
    notable: true,
    title: '任正非：43 岁被辞退、负债，才创办华为',
    who: '任正非，43 岁前在国企做技术管理，中年遭遇职场滑铁卢',
    one_line_choice: '在中年被辞退、一度走投无路时，凑 2.1 万元创办华为，从代理交换机起步',
    biggest_pitfall: '把"中年被否定"当成职业终点',
    why_similar: '你 30+ 怕"被优化""没机会"。任正非 43 岁才真正开始——他的前提是几十年的技术与管理积累，加上绝境里的定力。',
    time_horizon: 'historical',
    outcome: '华为从代理交换机的小公司，成长为全球最大通信设备商之一；任正非的"冬天论""长期主义"成为被广泛引用的管理思想。',
    satisfaction: 'satisfied',
    if_again: '值得带走的是：他在最难的年纪没认命，而是把积累押在了一件长期的事上。',
    advice: '30+ 的"再出发"不必是豪赌。先盘点你手里真正值钱的经验，再决定押在哪。',
    stage_tag: 'historical',
    profile_tag: 'second_curve',
    scenario_tags: ['创业', '职业风险', '二次曲线', '被优化'],
    life_category: 'career',
    life_subcategory: 'entrepreneur',
    sources: [
      { source_id: 'src_rzf_001', title: '华为官网历史与历年财报', publisher_or_author: 'Huawei', url_or_bibliography: 'huawei.com 投资者关系', date: '综合', source_type: 'primary', supported_claims: ['1987 年创办华为', '由代理交换机起步', '成长为全球通信设备商'] },
      { source_id: 'src_rzf_002', title: '《任正非传》及公开讲话（如《华为的冬天》）', publisher_or_author: '公开出版 / 任正非', url_or_bibliography: '公开出版与官方发言', date: '综合', source_type: 'reputable_secondary', supported_claims: ['中年职场受挫后创业', '强调长期主义与危机意识'] }
    ],
    skills_learned: [
      { skill_name: '从代理到自研的跃迁', why_need: '纯代理没有护城河，随时被取代', how_learned: '把利润持续投入研发，从"卖别人的"变成"做自己的"', what_can_do_after: '能掌握核心技术与定价权，不再被上游卡脖子', estimated_hours: '数年（组织级投入）' },
      { skill_name: '危机预警与现金流管理', why_need: '曾一度濒临破产', how_learned: '写《华为的冬天》式自检，顺境时也预留过冬粮', what_can_do_after: '能提前识别风险、守住现金流底线', estimated_hours: '持续' },
      { skill_name: '力出一孔的聚焦战略', why_need: '资源有限，什么都想做就等于什么都不行', how_learned: '只做通信主航道，砍掉无关业务', what_can_do_after: '能在一点上击穿，形成压倒性优势', estimated_hours: '长期' }
    ],
    timeline_followups: [
      { years_after: 1, what_happened: '1988 年代理香港交换机，靠服务和渠道活下来', what_i_realized: '活下去比理想重要——先有收入，才有明天', current_status: '勉强盈利的小型代理商' },
      { years_after: 3, what_happened: '开始自研交换机，从代理商转型为制造商', what_i_realized: '没有自己的技术，永远被卡脖子', current_status: '有了自研产品，国内初步铺开' },
      { years_after: 5, what_happened: '自研成功、国内站稳，写下《华为的冬天》预警危机', what_i_realized: '真正的风险不是现在难，是顺境时忘了准备过冬', current_status: '成为国内主要通信设备供应商' }
    ]
  },
  {
    id: 'famous_dengyaping_001',
    audience: 'mid_career',
    source_marker: 'demo_fixture',
    notable: true,
    title: '邓亚萍：退役后从零学英语，拿下剑桥博士',
    who: '邓亚萍，乒乓球大满贯得主，20 多岁退役时几乎不会英语',
    one_line_choice: '在运动生涯巅峰退役后，从字母表重新学起，一路读到剑桥博士',
    biggest_pitfall: '把"一个身份的成功"当成"全部能力"，退役后不会重新归零',
    why_similar: '你 30+ 可能正经历"身份转换"——不再是原来的角色。邓亚萍说：冠军也是可以重新当新生的。',
    time_horizon: 'historical',
    outcome: '清华本科 → 诺丁汉硕士 → 剑桥博士（土地经济学），后任职国际奥委会委员、全国政协委员等，完成从运动员到学者与治理者的转型。',
    satisfaction: 'satisfied',
    if_again: '值得带走的是：她把赛场上的专注，原封不动搬到了书桌上。',
    advice: '转型最难的不是学新东西，是放下"我以前很厉害"的包袱，甘心当新手。',
    stage_tag: 'historical',
    profile_tag: 'restart',
    scenario_tags: ['转型', '自我成长', '身份转换', '学习'],
    life_category: 'life',
    life_subcategory: 'self_growth',
    sources: [
      { source_id: 'src_dyp_001', title: '剑桥大学公开校友资料', publisher_or_author: 'University of Cambridge', url_or_bibliography: 'cam.ac.uk 公开档案', date: '综合', source_type: 'primary', supported_claims: ['获剑桥土地经济学博士', '曾任运动员后转型学者'] },
      { source_id: 'src_dyp_002', title: '邓亚萍公开访谈与自述', publisher_or_author: '公开访谈', url_or_bibliography: '央视 / 公开演讲整理', date: '综合', source_type: 'reputable_secondary', supported_claims: ['退役后从零学英语', '清华—诺丁汉—剑桥求学路径'] }
    ],
    skills_learned: [
      { skill_name: '归零学习法', why_need: '退役后一切归零，连英语都要从头学', how_learned: '接受自己从最基础开始，每天泡自习室', what_can_do_after: '能快速在任何新领域重建能力', estimated_hours: '数年' },
      { skill_name: '把赛场专注迁移到书桌', why_need: '冠军的优势要复用，不能丢', how_learned: '用训练纪律对付学习：固定时段、刻意练习', what_can_do_after: '能跨领域也做到顶尖', estimated_hours: '长期' },
      { skill_name: '用英语打开国际门', why_need: '想进国际体育治理舞台', how_learned: '死磕口语与学术写作，敢在英文场合发言', what_can_do_after: '能参与全球议题、不再被语言挡在门外', estimated_hours: '持续' }
    ],
    timeline_followups: [
      { years_after: 1, what_happened: '退役进清华，从音标重新开始，每天泡自习室', what_i_realized: '冠军也会是差生，但差生靠方法能追上', current_status: '英语从零到能读简单文献' },
      { years_after: 3, what_happened: '清华毕业、赴诺丁汉读硕，英语已能公开演讲', what_i_realized: '语言是门，门后是整个世界', current_status: '硕士在读，进入国际视野' },
      { years_after: 5, what_happened: '剑桥博士毕业，进入国际体育治理', what_i_realized: '运动员的终点不是退役，是换个场继续拼', current_status: '博士 + 国际组织任职' }
    ]
  },
  {
    id: 'famous_murakami_001',
    audience: 'mid_career',
    source_marker: 'demo_fixture',
    notable: true,
    title: '村上春树：30 岁还在开酒吧，才动笔写第一本小说',
    who: '村上春树，30 岁前经营爵士酒吧，毫无文学背景',
    one_line_choice: '在棒球场的一念之间决定写小说，白天开店、凌晨写作，第一本就获奖',
    biggest_pitfall: '把"已经 30 了、不是干这行的"当成不动手的理由',
    why_similar: '你 30+ 想做点"真正想做"的事，却总觉晚了。村上 30 岁才起步，且起步时完全是外行。',
    time_horizon: 'historical',
    outcome: '《且听风吟》获群像新人奖出道，其后《挪威的森林》等成为世界级畅销作家；并坚持每天跑步 30 余年，写作与长跑互为支撑。',
    satisfaction: 'satisfied',
    if_again: '值得带走的是：他不是"天赋型"，是"决定做就每天做"型。',
    advice: '晚起步不可怕。可怕的是一边羡慕一边不动。今晚就为想做的事花一小时。',
    stage_tag: 'historical',
    profile_tag: 'late_bloom',
    scenario_tags: ['自我成长', '大器晚成', '写作', '副业'],
    life_category: 'life',
    life_subcategory: 'self_growth',
    sources: [
      { source_id: 'src_murakami_001', title: '《我的职业是小说家》', publisher_or_author: '村上春树', url_or_bibliography: '公开出版自传性随笔', date: '综合', source_type: 'primary', supported_claims: ['30 岁前后才动笔写作', '坚持每日长跑与固定写作时段'] },
      { source_id: 'src_murakami_002', title: '村上春树公开访谈与年谱', publisher_or_author: '公开出版 / 访谈', url_or_bibliography: '公开资料', date: '综合', source_type: 'reputable_secondary', supported_claims: ['《且听风吟》获群像新人奖出道', '《挪威的森林》等全球畅销'] }
    ],
    skills_learned: [
      { skill_name: '把想做的事排进每天固定时段', why_need: '开店没时间，总说"以后再说"', how_learned: '凌晨 4 点起床写，写完再开店', what_can_do_after: '能稳定产出，不再被日常吞掉', estimated_hours: '一生（每天 3-4 小时）' },
      { skill_name: '先写完再谈完美', why_need: '怕写不好，于是永远不动手', how_learned: '初稿不顾质量，先让它存在', what_can_do_after: '能克服"启动恐惧"', estimated_hours: '长期' },
      { skill_name: '用跑步维持创作体力', why_need: '写作极耗神，容易垮', how_learned: '每天 10 公里，把身体当器械练', what_can_do_after: '能长期可持续地创作', estimated_hours: '持续' }
    ],
    timeline_followups: [
      { years_after: 1, what_happened: '1979 年《且听风吟》写完并获奖，决定关店专职写作', what_i_realized: '想做的事，先做完第一件再说', current_status: '出道作家，准备辞职' },
      { years_after: 3, what_happened: '几本长篇陆续出版，确立作家身份', what_i_realized: '持续输出比一鸣惊人更重要', current_status: '职业作家，读者稳定' },
      { years_after: 5, what_happened: '《挪威的森林》爆红全球；开始每天跑步', what_i_realized: '创作是马拉松，身体和节奏才是可持续的本钱', current_status: '世界级畅销作家' }
    ]
  },
  {
    id: 'famous_wangyangming_001',
    audience: 'mid_career',
    source_marker: 'demo_fixture',
    notable: true,
    title: '王阳明：被贬到蛮荒之地，悟出"知行合一"',
    who: '王阳明，明代官员、思想家，34 岁因得罪权宦被贬贵州龙场',
    one_line_choice: '在最绝望的贬谪里，反而想通了"知和行本是一件事"',
    biggest_pitfall: '把"被贬 / 被否定"当成人生失败，困在委屈里',
    why_similar: '你 30+ 可能正经历"被排挤、被低估"。王阳明被扔到谷底时，反而完成了最重要的思想突破。',
    time_horizon: 'historical',
    outcome: '龙场悟道后提出"心即理""知行合一"，后平定宁王之乱、广收门徒讲学，被后世誉为"孔孟之后第一人"之评的思想家。',
    satisfaction: 'satisfied',
    if_again: '值得带走的是：环境的谷底，往往是思想的起点。',
    advice: '当你觉得"被埋没"，先问：我能在这段处境里想通什么、练出什么？',
    stage_tag: 'historical',
    profile_tag: 'insight',
    scenario_tags: ['自我成长', '逆境', '知行合一', '被低估'],
    life_category: 'life',
    life_subcategory: 'self_growth',
    sources: [
      { source_id: 'src_wym_001', title: '《传习录》《王阳明全集》', publisher_or_author: '王守仁', url_or_bibliography: '公开出版文集', date: '明', source_type: 'primary', supported_claims: ['龙场悟道', '提出心即理、知行合一', '平定宁王之乱'] },
      { source_id: 'src_wym_002', title: '钱穆《阳明学述要》等研究', publisher_or_author: '学术界公开研究', url_or_bibliography: '公开出版', date: '综合', source_type: 'reputable_secondary', supported_claims: ['龙场之贬促成思想转折', '知行合一为后世核心命题'] }
    ],
    skills_learned: [
      { skill_name: '在逆境里做思想实验', why_need: '被贬无事可做，容易陷在委屈', how_learned: '静坐格物，把处境当问题来想', what_can_do_after: '能把委屈变成洞见', estimated_hours: '长期' },
      { skill_name: '知行合一的日课', why_need: '懂很多道理却做不到', how_learned: '每天挑一件小事真去做到', what_can_do_after: '能戒掉空想，让认知落地', estimated_hours: '持续' },
      { skill_name: '把困境当修炼场', why_need: '环境差，容易自弃', how_learned: '在谷底仍读书讲学不辍', what_can_do_after: '能练出逆商与定力', estimated_hours: '一生' }
    ],
    timeline_followups: [
      { years_after: 1, what_happened: '1508 年于龙场悟"圣人之道，吾性自足"', what_i_realized: '答案不在外面，在自己心里', current_status: '思想体系成形，开始授徒' },
      { years_after: 3, what_happened: '任庐陵知县，把"知行合一"用于理政，民风化善', what_i_realized: '道理不落到事上，等于没懂', current_status: '地方官，口碑渐起' },
      { years_after: 5, what_happened: '平宁王之乱、广收门徒讲学', what_i_realized: '真正的力量，是知和行不再分家', current_status: '一代宗师，门人云集' }
    ]
  },
  {
    id: 'famous_jobs_001',
    audience: 'mid_career',
    source_marker: 'demo_fixture',
    notable: true,
    title: '乔布斯：被自己创办的公司赶走，12 年后杀回来',
    who: '史蒂夫·乔布斯，苹果联合创始人，30 岁被董事会踢出自己创办的公司',
    one_line_choice: '被赶走后没沉沦，用 NeXT 和皮克斯继续打磨，最终回归重塑苹果',
    biggest_pitfall: '把"被自己人否定"当成自我价值的否定',
    why_similar: '你 30+ 可能正经历"被排挤、被边缘"。乔布斯被自己公司开除，却说那是"最好的事"。',
    time_horizon: 'historical',
    outcome: '离开苹果后创办 NeXT、收购皮克斯（《玩具总动员》）；1997 年回归苹果，推出 iMac / iPod / iPhone，重塑整个行业。',
    satisfaction: 'satisfied',
    if_again: '值得带走的是：他没用"受害者"身份过日子，而是把离开当成重新学管理、学产品的机会。',
    advice: '被否定时，别急着证明"我对"，先问：这段离开能让我长出什么新本事？',
    stage_tag: 'historical',
    profile_tag: 'comeback',
    scenario_tags: ['创业', '被优化', '二次曲线', '产品'],
    life_category: 'career',
    life_subcategory: 'entrepreneur',
    sources: [
      { source_id: 'src_jobs_001', title: '史蒂夫·乔布斯 2005 斯坦福毕业演讲', publisher_or_author: 'Steve Jobs', url_or_bibliography: 'Stanford 公开视频 / 文字稿', date: '2005', source_type: 'primary', supported_claims: ['30 岁被苹果开除', '称被开除是"最好的事"', '后回归苹果'] },
      { source_id: 'src_jobs_002', title: 'Walter Isaacson《史蒂夫·乔布斯传》', publisher_or_author: 'Walter Isaacson', url_or_bibliography: '公开出版传记', date: '2011', source_type: 'reputable_secondary', supported_claims: ['创办 NeXT 与收购皮克斯', '1997 年回归并重启苹果'] }
    ],
    skills_learned: [
      { skill_name: '把开除当休学', why_need: '被自己人否定，容易崩', how_learned: '用离开换来的自由度去学产品与管理', what_can_do_after: '能把打击变成成长期', estimated_hours: '数年' },
      { skill_name: '极简聚焦（少即是多）', why_need: '回归前苹果产品线混乱', how_learned: '把产品线砍到只剩几条', what_can_do_after: '能集中资源出爆款', estimated_hours: '长期' },
      { skill_name: '用故事卖产品', why_need: '技术再好，用户无感', how_learned: '学皮克斯的叙事，把产品讲成意义', what_can_do_after: '能让用户为意义买单', estimated_hours: '持续' }
    ],
    timeline_followups: [
      { years_after: 1, what_happened: '1986 年卖股份创办 NeXT，同时买下皮克斯', what_i_realized: '被赶走不是结束，是解脱', current_status: '两家新公司起步' },
      { years_after: 3, what_happened: '1995 年皮克斯《玩具总动员》大获成功', what_i_realized: '离开苹果反而找回了做产品的纯粹', current_status: '证明自己还能做对的事' },
      { years_after: 5, what_happened: '1997 年回归苹果，砍产品线、推 iMac，开启复兴', what_i_realized: '真正的回归，是先把自己变成更好的产品人', current_status: '重返苹果核心，开启黄金时代' }
    ]
  },

  // ===================== 不惑规划 =====================
  {
    id: 'famous_buffett_001',
    audience: 'senior',
    source_marker: 'demo_fixture',
    notable: true,
    title: '巴菲特：把"慢慢变富"做成了一生的事',
    who: '沃伦·巴菲特，11 岁买第一只股票，师承价值投资鼻祖格雷厄姆',
    one_line_choice: '不追风口、不赌短线，用"好生意 + 长期持有"滚出巨大雪球',
    biggest_pitfall: '把"慢"误读成"错过"，总想抓住每一个热点',
    why_similar: '你 40+ 在想"下半场怎么稳"。巴菲特说：人生和财富一样，靠的是不犯大错 + 时间复利。',
    time_horizon: 'historical',
    outcome: '通过伯克希尔·哈撒韦成为长期价值投资的标杆，多次位列全球顶级富豪；以"能力圈""护城河""长期主义"理念影响数代投资者。',
    satisfaction: 'satisfied',
    if_again: '值得带走的是：他赢在"活得久、错得少"，不是赢在某一把。',
    advice: '40+ 最大的优势是时间。别再追热点，把精力放在"能滚十年"的事上。',
    stage_tag: 'historical',
    profile_tag: 'long_term',
    scenario_tags: ['理财', '长期主义', '职业风险', '第二现金流'],
    life_category: 'life',
    life_subcategory: 'money',
    sources: [
      { source_id: 'src_buffett_001', title: '巴菲特致股东信（伯克希尔官网）', publisher_or_author: 'Warren Buffett', url_or_bibliography: 'berkshirehathaway.com 公开信件', date: '历年', source_type: 'primary', supported_claims: ['强调能力圈与长期持有', '反对杠杆与宏观预测'] },
      { source_id: 'src_buffett_002', title: '本杰明·格雷厄姆《聪明的投资者》及公开传记', publisher_or_author: 'Benjamin Graham / 公开出版', url_or_bibliography: '公开出版', date: '综合', source_type: 'reputable_secondary', supported_claims: ['师承价值投资', '伯克希尔为长期投资标杆'] }
    ],
    skills_learned: [
      { skill_name: '能力圈自检', why_need: '怕踩坑、怕跟风', how_learned: '只投自己看得懂的生意，看不懂的一律不碰', what_can_do_after: '能避开市场上大多数陷阱', estimated_hours: '长期' },
      { skill_name: '长期持有好生意', why_need: '追涨杀跌，辛苦白费', how_learned: '买有"护城河"的企业并长期持有', what_can_do_after: '能让时间替你赚钱', estimated_hours: '持续' },
      { skill_name: '每年读 500 页财报', why_need: '投资是认知的变现', how_learned: '海量阅读 + 做笔记，形成独立判断', what_can_do_after: '能不依赖小道消息做决策', estimated_hours: '一生' }
    ],
    timeline_followups: [
      { years_after: 1, what_happened: '持续阅读财报、扩大能力圈', what_i_realized: '投资是认知的变现，先长脑子再出手', current_status: '早期合伙人阶段，复利刚启动' },
      { years_after: 3, what_happened: '买入喜诗糖果、可口可乐等"好生意"长期持有', what_i_realized: '好生意自己会长大，不必频繁操作', current_status: '组合趋于稳健' },
      { years_after: 5, what_happened: '伯克希尔成为投资帝国；坚持不杠杆、不预测宏观', what_i_realized: '真正的风险是犯大错，而不是慢', current_status: '长期主义标杆，影响数代人' }
    ]
  }
]
