// ============================================================
// 路书 · 本地 7 天计划合成器（V0.9.5）
// 为什么存在：GrowthPathPage 的 LLM 可能失败，用户也可能从目录直达
// 「我的第一本路书」，此时 lastGrowthPath 为空。过去会回退到一版
// 与用户毫无关系的固定「接 Offer」模板 → 千人一面（评审 bug）。
// 本合成器用「用户真实画像 + 真实读过的书」本地规则生成个性化一周，
// 每条行动都绑定某本书/某人物；素材不足时返回 null，由页面引导
// 用户先去生成路径，绝不输出与用户无关的固定模板。
// ============================================================
import type { BasicProfile, OrdinaryCase, SevenDayStep } from '../data/types'

export interface LocalSevenDayInput {
  profile: BasicProfile | null
  /** 用户主线读过的书（来自 read_roadbook_entries 反查 allFixtureCases） */
  readBooks: OrdinaryCase[]
  /** 用户写下的困惑（evidence.original_problem_reframe） */
  problem: string
}

/** 从某些书的 advice 里挑一句可执行的提醒（优先名人/历史人物） */
function pickAdvice(books: OrdinaryCase[]): string | null {
  const notable = books.find(b => b.notable)
  const src = notable || books[0]
  if (src?.advice) return src.advice
  return null
}

/**
 * 本地规则合成 7 天计划（4-6 条，每条引用具体书名/人物）。
 * 素材不足（没读过书且没有画像）时返回 null。
 */
export function buildLocalSevenDayPlan(input: LocalSevenDayInput): SevenDayStep[] | null {
  const { profile, readBooks, problem } = input
  const books = (readBooks || []).slice(-3)

  // 一条素材都没有 → 无法个性化 → 返回 null（由页面引导去生成）
  if (books.length === 0 && !profile) return null

  // 没有书但有画像：给「画像向」的通用但具体的小行动（仍不用 Offer 模板）
  if (books.length === 0 && profile) {
    const stage = profile.stage || '当前阶段'
    const concern = profile.concerns?.[0] || '当下的选择'
    const priority = profile.priorities?.[0] || '成长'
    return [
      { day: 'Day 1', action: `写下你卡在「${concern}」上的具体一件事：是信息不够、选项不明，还是不敢选？`, note: '把问题写细，才有办法下手——这是你这一周的地基。' },
      { day: 'Day 2', action: `约 1 位比你先走一段路的人聊 20 分钟，问 TA 在「${stage}」时最想重来的一件事。`, note: '真实的人比任何攻略都具体。' },
      { day: 'Day 3', action: `找出这个选择里你最看重的「${priority}」——它最近一次被满足/被辜负是什么时候？`, note: '看清自己在交换什么，才不会被一时情绪带走。' },
      { day: 'Day 4', action: '把选项 A、B 各写 3 条「一年后的证据」，再决定要不要继续深挖。', note: '把想象变成纸面证据，减少内耗。' },
      { day: 'Day 5–7', action: '去补一个最影响决定的真实信息（问人 / 查资料 / 做最小实验），然后做第一版判断。', note: '判断不是一次做完的，先有第一版，再迭代。' },
    ]
  }

  // 有书：每条行动绑定具体书/人物（核心个性化）
  const steps: SevenDayStep[] = []
  const b1 = books[0]
  const b2 = books[1] || b1
  const b3 = books[2] || b2
  const advice = pickAdvice(books)

  steps.push({
    day: 'Day 1',
    action: `重读《${b1.title}》里「${b1.who}」的选择：${b1.one_line_choice}。找出 TA 最关键的判断依据，写下你自己的同款问题。`,
    note: '先回到你刚读的故事里找坐标，再回到自己身上。',
  })

  steps.push({
    day: 'Day 2',
    action: `像《${b2.title}》的${b2.who}那样，列出你目前 3 个选择各自的"一年后"长什么样（写出来，别只在脑子里想）。`,
    note: `${b2.who ? 'TA 当年也是先想清楚"要什么"，才没被眼前的噪音带走。' : '把未来写下来，选择才看得清。'}`,
  })

  if (b3 !== b2) {
    steps.push({
      day: 'Day 3',
      action: `从《${b3.title}》里挑 1 条${b3.who ? b3.who + '的' : ''}做法/方法，用在你这件事上：具体是哪一步、谁来陪你验证？`,
      note: '把书里的方法翻译成你的一个动作，书才没白读。',
    })
  }

  if (advice) {
    steps.push({
      day: 'Day 4',
      action: `重温《${b1.title}》给后来人的提醒：「${advice.length > 40 ? advice.slice(0, 40) + '…' : advice}」。对照你现在做的事，哪一条你正在犯？`,
      note: '前人踩过的坑，提醒一次就够了。',
    })
  }

  const concern = profile?.concerns?.[0]
  steps.push({
    day: 'Day 5',
    action: concern
      ? `像《${b1.title}》的${b1.who}那样，围绕「${concern}」向 1 位真实从业者/过来人问 1 个具体问题（写下来再问，别泛泛聊）。`
      : `像《${b1.title}》的${b1.who}那样，把你这周的收获整理成 3 句话，发给你信任的一个人，问 TA 的意见。`,
    note: '书给方法，人给反馈——两个都拿到，判断才稳。',
  })

  steps.push({
    day: 'Day 6–7',
    action: `学《${b1.title}》的${b1.who}收个尾：哪些行动让你离「${profile?.priorities?.[0] || '你在乎的事'}」更近了？定下下周的 1 个具体动作。`,
    note: '一周收尾不是结束，是下一周的开始。',
  })

  return steps.slice(0, 6)
}