// ============================================================
// 路书 · 过来人时间轴数据 (V0.6 · 时光机核心)
// 每条样本的"做了选择后，1年/3年/5年变成了什么样"
// 设计原则（来自产品顾问诊断）：
//   - 一本书只有一页叫文章，一本书要有厚度
//   - 真正有含金量的是"那时候我以为最重要的是X，后来发现其实是Y"
//   - 不是横断面切片，是完整人生走向
// ============================================================
import type { TimelineFollowup } from './types'

// key = OrdinaryCase.id，value = TA 选择后的时间轴
export const timelineFollowupsMap: Record<string, TimelineFollowup[]> = {
  // ========== 职场新人 ==========
  roadbook_entry_demo_001: [
    {
      years_after: 1,
      what_happened: '入职后直属领导真的没人管，半年内换了 2 个项目，走了很多弯路',
      what_i_realized: '选 offer 时我只看了工资和公司名，没人告诉我"你的直属领导决定你第一年的成长速度"',
      current_status: '还在第一家公司，但已经开始骑驴找马'
    },
    {
      years_after: 3,
      what_happened: '跳去了一家创业公司做核心成员，因为第一年的弯路反而学会了独立推进项目',
      what_i_realized: '那段"没人管"的时间，逼我学会了自我管理——这是我后来最大的竞争力',
      current_status: '创业公司核心成员，年收入是第一份工作的 2.5 倍'
    },
    {
      years_after: 5,
      what_happened: '开始带小团队，才发现选人比选公司更重要',
      what_i_realized: '当年纠结的是"去大公司还是小公司"，5 年后发现真正重要的是"跟对人还是跟错人"',
      current_status: '带 5 人小团队，开始有自己的行业判断'
    }
  ],
  roadbook_entry_demo_003: [
    {
      years_after: 1,
      what_happened: '业余时间真的把教育内容账号做起来了，但主业也被影响了',
      what_i_realized: '我以为"两边都要"是对的，后来发现精力是有限的，必须有一边让步',
      current_status: '主业勉强保住，副线账号有了第一批付费用户'
    },
    {
      years_after: 3,
      what_happened: '副线收入超过了主业，正式辞职转方向',
      what_i_realized: '当年纠结"要不要辞职"，3 年后发现答案一直在变——关键是小步验证，而不是一次性赌',
      current_status: '全职做教育内容，收入是辞职前主业的 1.5 倍'
    }
  ],
  roadbook_entry_demo_005: [
    {
      years_after: 1,
      what_happened: '业余学了 SQL 和数据分析，开始在公司内部转数据相关项目',
      what_i_realized: '转行不是辞职-学习-找工作的三段式，是"边上班边攒证据"的渐进过程',
      current_status: '还在原公司，但已经拿到数据分析相关的内部项目'
    },
    {
      years_after: 3,
      what_happened: '正式拿到数据分析师的 offer，薪资比运营岗高 40%',
      what_i_realized: '当年怕"积累浪费"，后来发现运营的经验让我的数据分析更贴近业务——这是纯技术的人没有的优势',
      current_status: '中型公司数据分析师，偶尔接数据分析的私单'
    }
  ],

  // ========== 而立转型 ==========
  roadbook_entry_mid_001: [
    {
      years_after: 1,
      what_happened: '选了专家线，主动 own 了一条核心业务链路',
      what_i_realized: '30+ 不是必须带人——我更喜欢"做深一件事"，而不是"管一群人"',
      current_status: '专家线骨干，成为某条业务链路唯一懂全貌的人'
    },
    {
      years_after: 3,
      what_happened: '因为深度业务理解，被猎头挖去更大平台做资深专家',
      what_i_realized: '当年纠结"管理还是专家"，3 年后发现真正的溢价来自"深度业务理解"，不是头衔',
      current_status: '大平台资深专家，收入比 30 岁那年翻倍'
    }
  ],
  roadbook_entry_mid_002: [
    {
      years_after: 1,
      what_happened: '副业前半年真的白忙了，后来定了"赚到第一笔陌生人的钱才算验证通过"的硬指标',
      what_i_realized: '"坚持"和"真的跑通"是两件事——半年没见钱，其实是在自我感动',
      current_status: '副业有了第一笔陌生人付费，开始做付费专栏'
    },
    {
      years_after: 3,
      what_happened: '副业收入稳定到主业 60%，开始考虑要不要全职',
      what_i_realized: '当年纠结"副业能不能做起来"，3 年后发现真正的风险不是"做不起来"，是"一直用业余心态对待"',
      current_status: '主业还在，副业有稳定付费用户'
    }
  ],
  roadbook_entry_mid_003: [
    {
      years_after: 1,
      what_happened: '被优化后没急着投简历，而是把过去经验打包成"技术+业务方案"的能力组合',
      what_i_realized: '35+ 写代码拼不过更便宜的人，但"能带队落地业务"的组合能力反而更值钱',
      current_status: '拿到中小公司技术负责人的 offer'
    },
    {
      years_after: 3,
      what_happened: '在小公司有了自己的技术团队，开始参与业务决策',
      what_i_realized: '当年以为是"被淘汰"，3 年后发现那是职业生涯的第二次起飞——被迫重新定义自己的价值',
      current_status: '技术负责人，带 8 人团队'
    }
  ],

  // ========== 不惑规划 ==========
  roadbook_entry_sen_001: [
    {
      years_after: 1,
      what_happened: '体检出问题后开始认真做精力管理，半年内指标全恢复正常',
      what_i_realized: '40+ 的职场竞争，拼到最后不是能力，是身体和精力的存量',
      current_status: '还在高管位置，但学会了"不透支"地工作'
    },
    {
      years_after: 3,
      what_happened: '开始把管理经验沉淀成方法论，带出了 3 个能独当一面的中层',
      what_i_realized: '40+ 真正的成就感不是"自己干"，是"培养出能替代你的人"',
      current_status: '高管，但日常开始往后退，给年轻人腾位置'
    },
    {
      years_after: 5,
      what_happened: '身体、团队、方法论都稳定了，开始考虑下半场做什么',
      what_i_realized: '当年以为是"要不要继续拼"，5 年后发现真正的命题是"下半场用什么方式被需要"',
      current_status: '半退休状态，开始做行业导师'
    }
  ],
  roadbook_entry_sen_003: [
    {
      years_after: 1,
      what_happened: '把咨询经验写成方法论课，开始做诊断工具',
      what_i_realized: '外企光环会褪色，但 25 年经验可以变成不依赖头衔的产品',
      current_status: '离职后第一年，方法论课有了第一批学员'
    },
    {
      years_after: 3,
      what_happened: '课程和诊断工具跑通，有了稳定的被动收入',
      what_i_realized: '当年纠结"离开外企会不会贬值"，3 年后发现离开的是头衔，带走的才是真本事',
      current_status: '独立顾问，收入是外企时期的 80%，但时间自由'
    }
  ],

  // ========== 高频真实困惑 ==========
  roadbook_entry_cd_001: [
    {
      years_after: 1,
      what_happened: '列了"同事朋友私下找我帮过什么忙"的清单，发现自己在 PPT 和汇报上被问得最多',
      what_i_realized: '想做副业但不知道卖什么——其实你已经被人免费问过了',
      current_status: '副业起步中，开始做付费的 PPT 咨询'
    },
    {
      years_after: 3,
      what_happened: 'PPT 咨询做成了付费社群，有了稳定的小额收入',
      what_i_realized: '当年纠结"做什么副业"，3 年后发现答案一直在你身边——别人已经在为你的某个能力付费了',
      current_status: '主业还在，副业收入覆盖了家庭日常开销'
    }
  ],
  roadbook_entry_cd_005: [
    {
      years_after: 1,
      what_happened: '没赌气走，用那半年考了证 + 悄悄看了外部机会',
      what_i_realized: '被边缘化不等于该走——先把手里剩余的牌打完，离开也要带着筹码走',
      current_status: '拿到新 offer，但条件比想象中好'
    },
    {
      years_after: 3,
      what_happened: '在新公司站稳脚跟，回头看那次边缘化反而是一次被迫的清醒',
      what_i_realized: '当年以为是"被针对"，3 年后发现那是一次提醒——提醒我别把安全感全押在一个位置上',
      current_status: '新公司中层，比边缘化前更稳'
    }
  ],
  roadbook_entry_cd_008: [
    {
      years_after: 1,
      what_happened: '休假两周，问自己"如果现在这份不累，我还想走吗"——答案是"还是想走"',
      what_i_realized: '想离开当前工作时，要先分清是"想去那个"还是"想逃这个"——两种走的后果完全不同',
      current_status: '确认是真想转方向，开始业余准备考公'
    },
    {
      years_after: 3,
      what_happened: '考上了，但发现体制内和自己想象的不一样',
      what_i_realized: '当年以为"考公是逃离互联网的解药"，3 年后发现没有一份工作是"逃离"——只是换了一种难法',
      current_status: '体制内，适应中，开始想清楚自己到底要什么'
    }
  ],

  // ========== 做产品/参赛 ==========
  roadbook_entry_pb_001: [
    {
      years_after: 1,
      what_happened: '做了能跑的 demo，找 8 个目标用户看了反应',
      what_i_realized: '在方向上空想 3 周，不如做一个能给人看的粗糙版本——demo 是最诚实的验证',
      current_status: '产品方向跑通，开始正式做'
    },
    {
      years_after: 3,
      what_happened: '产品有了稳定付费用户',
      what_i_realized: '当年纠结"方向对不对"，3 年后发现方向是用 demo 试出来的，不是想出来的',
      current_status: '全职做自己的产品'
    }
  ],
  roadbook_entry_pb_004: [
    {
      years_after: 1,
      what_happened: '业余 14 个月做产品，有了第一批稳定付费用户才离职',
      what_i_realized: '不辞职做产品需要学会"边上班边验证"——业余跑通比全职赌更安全',
      current_status: '刚离职，全职做产品'
    },
    {
      years_after: 3,
      what_happened: '产品收入稳定，超过打工时期的工资',
      what_i_realized: '当年以为"业余做不出东西"，3 年后发现业余反而逼我把每一步都想清楚——全职反而容易自我感动',
      current_status: '一人公司老板，收入是打工时期的 1.5 倍'
    }
  ],

  // ========== 高年龄段补充 ==========
  roadbook_entry_oc_001: [
    {
      years_after: 1,
      what_happened: '问了自己"过去 6 个月学到了什么新东西"——答不上来',
      what_i_realized: '分不清是"腻了"还是"不长"——前者换心情，后者换战场',
      current_status: '确认是该换战场，开始看新机会'
    },
    {
      years_after: 3,
      what_happened: '换到了一条正在上升的曲线，降了一级但站到了更早的位置',
      what_i_realized: '40+ 的溢价不在职级，在"你是不是站在下一条曲线的早期"',
      current_status: '新赛道中层，但增长速度比原岗位快'
    }
  ],
  roadbook_entry_oc_006: [
    {
      years_after: 1,
      what_happened: '拿钱走后花了一年想清楚"接下来 10 年我想用什么方式被需要"',
      what_i_realized: '50+ 离开后最大的风险不是钱不够，是意义感断了',
      current_status: '想清楚了，开始做行业导师'
    },
    {
      years_after: 3,
      what_happened: '做导师有了固定的学生，也有了新的成就感来源',
      what_i_realized: '当年以为"离开了就没价值了"，3 年后发现下半场的价值是"经验变成别人的路标"',
      current_status: '行业导师，半退休，比打工时更满足'
    }
  ],
  // ---------- 历史 / 当代名人（跨时代参照，支撑时光机） ----------
  historical_luxun_001: [
    { years_after: 1, what_happened: '弃医从文后开始翻译与创作，1918 年发表《狂人日记》', what_i_realized: '医学救一人，文艺能唤醒一群人', current_status: '新文学阵营核心写作者' },
    { years_after: 3, what_happened: '《呐喊》出版，成为青年的精神偶像', what_i_realized: '当年的"换方向"不是逃离，是找到一个更能影响人的位置', current_status: '影响一代青年' },
    { years_after: 5, what_happened: '持续以杂文与论战形成"批判—启蒙"传统', what_i_realized: '真正重要的不是"走没走对路"，是"有没有把想说的说清楚"', current_status: '现代文学奠基人之一' }
  ],
  notable_leijun_001: [
    { years_after: 1, what_happened: '2010 年小米成立，先做 MIUI 社区而非直接造手机', what_i_realized: '不是先造产品，是先攒一群信你的人', current_status: '初创，社区冷启动' },
    { years_after: 3, what_happened: '小米手机 1 引爆，互联网模式跑通', what_i_realized: '顺势而为 + 长期投入，比单点聪明更重要', current_status: '国产手机新势力' },
    { years_after: 5, what_happened: '2018 年港交所上市，生态成型', what_i_realized: '40 岁再出发，前提是前 20 年积累，不是凭空出发', current_status: '世界级手机与 IoT 公司' }
  ],
  notable_rowling_001: [
    { years_after: 1, what_happened: '边领救济金边写完第一本，被多家出版社拒稿', what_i_realized: '低谷里"还在写"比"写得好"更重要', current_status: '稿子辗转于出版社之间' },
    { years_after: 3, what_happened: '1997 年《魔法石》出版，开始被看见', what_i_realized: '晚不是问题，停才是', current_status: '新晋作家' },
    { years_after: 5, what_happened: '系列全球爆红，从领救济到跻身富豪', what_i_realized: '她不是"条件好了才做"，是条件最差时也没停笔', current_status: '全球畅销书作家' }
  ],
  notable_chushiye_001: [
    { years_after: 1, what_happened: '古稀之年种下第一批橙子，从零学农业', what_i_realized: '年纪大不是借口，是另一种起点', current_status: '橙园起步' },
    { years_after: 3, what_happened: '摸索出种植与品控标准，口碑渐起', what_i_realized: '把工业管理的精细用到了农业', current_status: '"褚橙"雏形' },
    { years_after: 5, what_happened: '规模化、成品牌，晚年再创业成功', what_i_realized: '下半场照样能开花，关键是有没有种下去', current_status: '知名农产品品牌' }
  ],
  notable_kazuo_001: [
    { years_after: 1, what_happened: '78 岁接手日航，用"阿米巴经营"重构核算', what_i_realized: '企业救不救得活，先看账清不清', current_status: '日航重组启动' },
    { years_after: 3, what_happened: '扭亏为盈，重新上市', what_i_realized: '他赢在几十年沉淀的方法与心法，不是体力', current_status: '日航重生' },
    { years_after: 5, what_happened: '写下《活法》等，经营哲学影响全球', what_i_realized: '经验越老越值钱，关键是愿不愿意被用', current_status: '被誉为"经营之圣"' }
  ],
  notable_sushi_001: [
    { years_after: 1, what_happened: '黄州躬耕东坡，写成《赤壁赋》', what_i_realized: '外在起落管不了，怎么看起落是自己能练的', current_status: '黄州贬谪中' },
    { years_after: 3, what_happened: '文学与人格影响扩大，名篇迭出', what_i_realized: '低谷成了境界的养分', current_status: '文名日盛' },
    { years_after: 5, what_happened: '屡贬屡起，成为文化符号', what_i_realized: '把逆境当认识自己的契机，而非终点', current_status: '千古文豪' }
  ]
}
