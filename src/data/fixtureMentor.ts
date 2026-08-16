// ============================================================
// 路书 · 鲁迅 Source Pack (V0.3 要求: 独立 Source Pack + 证据边界)
// 口语化 V0.4.1 版本。所有引用含来源，禁止虚构引语。
// ============================================================
import type { SourcePack } from './types'

export const luxunSourcePack: SourcePack = {
  mentor_id: 'historical_luxun_001',
  display_name: '年轻的鲁迅',
  model_type: 'historical_public_sources',
  life_theme_tags: ['certainty_vs_exploration', 'direction_change'],
  case_summary: {
    stage: '二十岁出头，在异国求学，已经投入了一段时间学医。',
    problem: '逐渐意识到自己真正想要解决的问题，可能不只是"治一个人的病"，而是"怎么影响更多人的想法"。',
    constraints: [
      '时代的动荡与信息环境受限',
      '已经投入的学医时间与家庭期望',
      '对"新方向能否走通"缺乏现实验证'
    ],
    resources: [
      '已经具备的基础学习能力',
      '对文字和思想表达有真实的兴趣与积累',
      '有通过写作影响他人的可能路径'
    ],
    choice: '没有继续沿着已经学了很久的医学道路走下去，转向了以写作为主的方向。',
    outcome: '后来他的写作影响了非常多人。需要区分：这是公开史料确认的结果；至于"当年每一步的选择是否最优"，属于后人分析，不是本人自述。',
    reflection: '这段经历留给后人可学习的是判断方法：已经走了一段的路，要不要因为发现了更重要的东西而改变——以及改变之前，如何确认自己不是在情绪性逃离。'
  },
  sources: [
    {
      source_id: 'src_luxun_001',
      title: '《呐喊·自序》（鲁迅自述学医与弃医经过）',
      publisher_or_author: '鲁迅',
      url_or_bibliography: '《呐喊》1923 年集子中的自序',
      date: '1923',
      source_type: 'primary',
      supported_claims: [
        '鲁迅早年赴日本学医',
        '自述因"幻灯片事件"等经历改变想法',
        '放弃学医转向文艺事业'
      ]
    },
    {
      source_id: 'src_luxun_002',
      title: '《鲁迅年谱》等公开史料整理',
      publisher_or_author: '学术界公开整理',
      url_or_bibliography: '公开出版史料',
      date: '综合',
      source_type: 'reputable_secondary',
      supported_claims: [
        '弃医从文是公开记载的人生转折',
        '学界对其动机有不同解读，不存在唯一确定性结论'
      ]
    }
  ],
  safe_paraphrases: [
    '他一开始学医，后来慢慢发现自己真正想解决的问题可能不只是"治一个人的病"。',
    '他最后没有沿着已经学了很久的医学继续走。',
    '公开记载显示他做过这次方向上的重大改变。',
    '关于这次改变对他一生的影响，有公开史料支撑。'
  ],
  verified_quotes: [
    {
      text: '（鲁迅自述，大意）写作与文艺对他而言，是想从精神上影响国民。具体原句请以《呐喊·自序》原文为准。',
      source_id: 'src_luxun_001'
    }
  ],
  forbidden_claims: [
    '不得虚构鲁迅对你的个人建议',
    '不得断言"鲁迅当年选择必然正确"',
    '不得把鲁迅的成功反推为"换方向=成功"',
    '不得模拟鲁迅对用户私人问题的个人背书'
  ]
}

// ---------- 与"这页路书"聊天的参考答案规则 (V0.4.1: 2-3句, 最多反问1句) ----------
export interface MentorAnswer {
  match: RegExp
  answer: string
  chip: string
  mode: 'grounded' | 'limited'
}

export const mentorAnswers: MentorAnswer[] = [
  {
    match: /怕|担心|不怕|选错|后悔/i,
    answer: '当时最怕的是：已经花了很多年走的路，万一换错，是不是就白费了。但后来想明白一件事——真正的问题不是"换不换"，而是"我是不是真的有了更想走的方向"。基于公开史料，我能确认的是他做过这次改变，至于他当时内心最害怕什么，没有直接记录，不能编造。',
    chip: '《呐喊·自序》',
    mode: 'grounded'
  },
  {
    match: /冲动|一时|怎么判断|怎么确认|不是冲动/i,
    answer: '公开资料显示，他不是突然拍脑袋做的决定，而是长期观察和思考后才动手。用今天的话说：他没有在情绪最上头的时候行动，而是等自己对"新方向"有了持续的兴趣和确认。史料能确认的部分是这些；具体的心路细节，我不能替你补全。',
    chip: '公开史料整理',
    mode: 'grounded'
  },
  {
    match: /照搬|换成我|一样|适合我|我的情况/i,
    answer: '不能照搬。你和 TA 的时代、资源、身份完全不同：他没有你今天的经济压力，你也不会有他当年的时代压迫感。能带走的只有一条：换方向之前，先确认自己是在逃离现在，还是已经走向新的方向。这是路书从这段经历里提炼的方法，不是 TA 给你的答案。',
    chip: '路书方法提炼',
    mode: 'grounded'
  },
  {
    match: /.*/,
    answer: '基于现有公开资料，我能确认的是：他做过一次"已经投入很多后再改变方向"的选择。至于你问的具体细节，如果史料没有直接记载，我不会替你编。更值得带走的，是这页路书提炼的判断方法——你现在也站在类似的路口。',
    chip: '现有公开资料',
    mode: 'limited'
  }
]

// ---------- 分人群名人对话答案 (V0.5: 按 audience 选中的名人返回对应回答) ----------
// 规则：只基于公开来源，不虚构个人建议；拿"方法"不拿"结论"。
export const figureAnswers: Record<string, MentorAnswer[]> = {
  historical_luxun_001: mentorAnswers,
  notable_leijun_001: [
    { match: /怕|担心|不敢|赌|风险/i, answer: '公开资料显示，雷军 40 岁创办小米前已有金山、天使投资的二十多年积累——他不是"凭空赌一把"，是带着积累再出发。所以对你来说，关键不是"敢不敢赌"，而是"你手里有没有已经攒了很久的东西可以复用"。史料能确认他做过这次中年再创业，具体的内心戏我不替你编。', chip: '小米招股书', mode: 'grounded' },
    { match: /成功|为什么|怎么做到的|方法/i, answer: '能公开确认的是：他选择在精力仍旺时主动重写剧本，而不是等被推着变；其公开表述反复强调"顺势而为"和长期投入。值得带走的只有方法：再出发之前，先确认你是在逃离现在的累，还是已经有了更想做的方向。', chip: '《一往无前》', mode: 'grounded' },
    { match: /.*/, answer: '基于公开资料，我能确认的是：雷军 40 岁后仍完成了一次重大再创业。至于你问的细节，史料没有直接记载的我不替你编。更值得带走的，是这页路书提炼的判断方法——你现在也站在类似的路口。', chip: '公开资料', mode: 'limited' }
  ],
  notable_rowling_001: [
    { match: /晚|来不及|年龄|35|40|老了/i, answer: '公开资料显示，罗琳出版第一本《哈利波特》时约 32 岁，此前曾靠救济金生活、被拒稿多次。所以"是不是晚了"这件事，她的经历给的答案是：晚不代表没机会，但前提是那件你真正想做的事，有没有在低谷里继续做。具体心路我不替你补全。', chip: '公开传记', mode: 'grounded' },
    { match: /低谷|困难|坚持|没钱|救济/i, answer: '能确认的是：她不是在"条件好了才做"，而是在条件最差时也没停笔。值得带走的是：别用"已经晚了"给自己设限，真正要问的是——那件你想做的事，今天有没有为它花哪怕半小时。', chip: '罗琳访谈', mode: 'grounded' },
    { match: /.*/, answer: '基于公开资料，我能确认的是：罗琳在 30 多岁、单亲、领救济的低谷里写出了后来全球畅销的作品。细节没记载的我不编。更该带走的，是"低谷里也不停笔"这件事本身。', chip: '公开资料', mode: 'limited' }
  ],
  notable_chushiye_001: [
    { match: /老|年纪|歇|退休|晚了/i, answer: '公开传记记载，褚时健古稀之年开始种植"褚橙"，多年后做成知名品牌。所以"是不是该歇了"这件事，他的经历说：只要身体和脑子还在，下半场照样能开新局——但他付出的是实打实的十年耕耘，不是一句口号。', chip: '《褚时健传》', mode: 'grounded' },
    { match: /低谷|失败|重来|再创业/i, answer: '能确认的是：他没有把"遭遇"当成终点，而是当成另一段事的起点。值得带走的是：40+ 的再出发不一定要大张旗鼓，先问自己手里还有什么别人替代不了的经验，把它种下去，时间会给你结果。', chip: '公开报道', mode: 'grounded' },
    { match: /.*/, answer: '基于公开资料，我能确认的是：褚时健在人生最低谷之后，用农业重新证明了自己。细节我不替你编。更该带走的，是"触底不认终"的判断。', chip: '公开资料', mode: 'limited' }
  ],
  notable_kazuo_001: [
    { match: /老|经验|用了|值钱|收山/i, answer: '公开资料显示，稻盛和夫 78 岁出任破产日航 CEO 主导重建。所以"年纪大了就该歇"这件事，他的例子说：经验越老越值钱，关键是你愿不愿意在别人需要时被用。他不是靠体力赢，是靠几十年沉淀的方法与心法。', chip: '《活法》', mode: 'grounded' },
    { match: /方法|心法|哲学|怎么带/i, answer: '能确认的是：他把"阿米巴经营"与人生哲学带进日航改造，重建后重新上市为公开记载。值得带走的是：40+ 最大的资产不是体力，是"踩过坑后形成的判断"——把它变成可教给别人的方法，就是下半场最稳的依靠。', chip: '日航重建报道', mode: 'grounded' },
    { match: /.*/, answer: '基于公开资料，我能确认的是：稻盛和夫在 78 岁仍完成一次重大企业重建。细节我不编。更该带走的，是"经验可以越老越被需要"这件事。', chip: '公开资料', mode: 'limited' }
  ],
  notable_sushi_001: [
    { match: /贬|低谷|边缘|看轻|否定/i, answer: '公开史料记载，苏轼中年屡遭贬谪，却在黄州写出了《赤壁赋》等通透文字。所以"被边缘、被看轻"这件事，他的经历说：外在的起落管不了，但怎么看待起落，是自己能练的。', chip: '《宋史·苏轼传》', mode: 'grounded' },
    { match: /心态|稳|内功|境界/i, answer: '能确认的是：他没把逆境当成终点，而是当成认识自己的契机。值得带走的是：40+ 的心法，很多时候不是"赢"，是"稳"——练习把外界的评判和自己的价值分开，是下半场最重要的内功。', chip: '《赤壁赋》', mode: 'grounded' },
    { match: /.*/, answer: '基于公开史料，我能确认的是：苏轼在中年低谷里写出了影响深远的文字。细节我不编。更该带走的，是"逆境可成契机"的判断。', chip: '公开史料', mode: 'limited' }
  ]
}

export function getMentorAnswers(figureId?: string | null): MentorAnswer[] {
  if (figureId && figureAnswers[figureId]) return figureAnswers[figureId]
  return mentorAnswers
}

// ---------- 书页元数据 (V0.4.1 章节/页码) ----------
export const bookChapters: Record<string, { chapter: string; page: string; icon: string }> = {
  cover: { chapter: '封面', page: '封面', icon: 'book' },
  age_select: { chapter: '选一段路', page: '第 1 页', icon: 'compass' },
  library_wall: { chapter: '路书库', page: '第 1 页', icon: 'books' },
  profile_0: { chapter: '第 1 章 · 先选一选，让路书认识你', page: '第 1 页', icon: 'compass' },
  profile_1: { chapter: '第 1 章 · 你真正在意什么', page: '第 2 页', icon: 'wave' },
  profile_reflection: { chapter: '第 1 章', page: '小结', icon: 'sparkle' },
  current_problem: { chapter: '第 2 章 · 你现在走到哪里了', page: '第 1 页', icon: 'pin' },
  not_alone: { chapter: '第 3 章 · 这一页，很多人也写过', page: '第 1 页', icon: 'footprints' },
  library: { chapter: '第 3 章', page: '第 2 页', icon: 'books' },
  peer_cases: { chapter: '第 4 章 · 先看看和你差不多的人', page: '第 1 页', icon: 'student' },
  lookback_case: { chapter: '第 5 章 · 再看看走过以后的人', page: '第 1 页', icon: 'clock' },
  historical_case: { chapter: '第 6 章 · 历史上，也有人换过方向', page: '第 1 页', icon: 'pen' },
  method_use: { chapter: '第 7 章 · 这件事，换成你可以怎么用', page: '第 1 页', icon: 'toolkit' },
  decision_ruler: { chapter: '第 8 章 · 我的工作选择尺', page: '第 1 页', icon: 'ruler' },
  fork_sim: { chapter: '第 9 章 · 如果这样选，未来可能怎么展开', page: '第 1 页', icon: 'leaf' },
  offer_3q: { chapter: '第 10 章 · 接 Offer 前，先确认 3 件事', page: '第 1 页', icon: 'question' },
  my_roadbook: { chapter: '第 11 章 · 我的第一本路书', page: '第 1 页', icon: 'route' },
  learning_route: { chapter: '下一章 · 我接下来最该学什么', page: '第 1 页', icon: 'compass' },
  skill_detail: { chapter: 'Learning Skill', page: 'Skill 详情', icon: 'target' },
  real_world_task: { chapter: '现实任务', page: '领取任务', icon: 'check' },
  checkin: { chapter: '回来复盘', page: 'Check-in', icon: '🔄' },
  dashboard: { chapter: '我的下一程', page: '首页', icon: 'home' },
  ask_road: { chapter: '问路', page: '第 1 页', icon: 'map' },
  ask_diagnosis: { chapter: '问路 · 先看看这道题', page: '诊断', icon: 'search' },
  library_home: { chapter: '路书库', page: '第 1 页', icon: 'books' },
  pitfall_library: { chapter: '路书库 · 前面的人踩过哪些坑', page: '第 1 页', icon: '🕳️' },
  write_entry_a: { chapter: '写一页给后来的人', page: '1 / 2 · 当时的你', icon: 'pen' },
  write_entry_b: { chapter: '写一页给后来的人', page: '2 / 2 · 为什么 & 后来', icon: 'pen' },
  submit_success: { chapter: '写一页给后来的人', page: '提交成功', icon: 'sparkle' },
  agent_trace: { chapter: '给评委看的', page: '3-Agent Trace', icon: 'robot' },
  about: { chapter: '关于路书', page: '版本', icon: 'info' }
}