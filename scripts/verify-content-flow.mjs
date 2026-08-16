// 验证 V0.9.4 递进式内容生成：InsightDistill → GrowthPath（含读过的书素材绑定）
// 用法: node scripts/verify-content-flow.mjs
const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions'
// 用法: DEEPSEEK_KEY=sk-xxx node scripts/verify-content-flow.mjs（禁止硬编码 key）
const KEY = process.env.DEEPSEEK_KEY || ''

async function call(system, userMsg) {
  const res = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMsg }
      ],
      temperature: 0.6,
      max_tokens: 2000
    })
  })
  if (!res.ok) throw new Error('HTTP ' + res.status)
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? null
}

// ---------- 输入：一个具体用户 + 一本书 ----------
const userProblem = '我今年 26 岁，在广告公司做了 2 年策划，现在很迷茫：要不要转去做产品经理？又怕转晚了、又怕现在不动以后更难。'

const distillSystem = `你是"路书"的人生图书馆馆员。你的任务：基于用户当下的困惑 + 一本"过来人之书"的完整时间轴，提炼出真正有含金量的人生精华。

你的输出分三块，每一块的"职责"完全不同，必须严格遵守，禁止任何两块表达同一个意思、同一个观点、甚至近似措辞：

【第一块 mind_shifts】只讲"认知层面的翻转"——这个过来人"那时候以为 X，后来发现其实是 Y"。这是 TA 内心观念的变化，不是方法、不是建议、不是人生道理。2-3 条。
示例格式：
[
  {"before": "我那时候以为，第一份工作选公司名气大的肯定没错", "after": "后来发现，直属管理者比公司名气重要十倍"},
  {"before": "我那时候以为，多加班多干活就是成长", "after": "后来发现，没有反馈的忙只是熟练，不是成长"}
]
注意：这里的 before/after 必须是"观念对观念"的翻转，不要写成"建议"。

【第二块 decision_principles】只讲"可带走、可复用的决策原则"——从 TA 的经历里能抽出来的"下次遇到类似的事，可以按什么标准来判断"的操作智慧。这是方法/标准，不是观念、不是感受。2-3 条，每条一句话，像朋友给的实在建议。
示例格式：
["选工作前先确认三件事：前90天做什么、谁给反馈、一年后能独立做到什么", "一份工作值不值得，看一年后你手里多了什么，而不是入职那一刻的光鲜"]

【第三块 for_your_situation】只讲"结合用户当下的处境，直接对 TA 说的那番话"——把这本书和用户的具体困惑挂钩，指出一个具体的切入点。是"你接下来可以往哪想、往哪试"，不是复述书主人的观念或原则。一段话，不超过 150 字。

三条铁律：
1. 三块内容严禁重复：严禁出现相同或近似的句子、观点、举例。如果你发现要写的和上一块的意思一样，就必须换一个角度、换一层内容。
2. 判断标准：第一块是"TA 的念头怎么变了"(观念)，第二块是"下次遇到事按什么标准判断"(方法)，第三块是"你，现在，该怎么办"(你的处境与切入点)。
3. 只输出 JSON：{"mind_shifts": [...], "decision_principles": [...], "for_your_situation": "..."}，不要任何解释文字、不要 markdown 代码块标记。
- 认知翻转要来自时间轴里真实出现过的内容，不要编造。
- 语气要像一个智慧但不说教的朋友。
- 中文输出。`

const bookTimeline = `
这本书的主人: 29岁 | 4年广告策划 | 普通本科
TA 当时面对的问题: 要不要转产品经理
TA 的选择: 用8个月业余时间边上班边准备，转了
最值得避开的坑: 看课程看到爽、不动手，以为学会就是会了
时间轴:
【1年后】发生了：转岗到产品岗，从0开始跟一个项目；那时TA以为：转岗成功=问题解决，但其实只是开始；现状：每天写PRD、跟开发吵架、经常加班
【3年后】发生了：第一次独立负责一个模块，数据有了起色；那时TA以为：多学工具（Axure/数据分析）就是竞争力；现状：升了产品经理，带一个小项目
【5年后】发生了：发现真正拉开差距的是"判断力"，不是工具；那时TA以为：产品经理就是画原型写文档；现状：开始带人，面试别人时吃惊地发现"会画原型的人很多，会想问题的人很少"`

const distillUser = `用户当下的困惑：${userProblem}

这本书的主人：29岁 | 4年广告策划 | 普通本科
TA 当时面对的问题：要不要转产品经理
TA 的选择：用8个月业余时间边上班边准备，转了
最值得避开的坑：看课程看到爽、不动手，以为学会就是会了

时间轴：
${bookTimeline}`

console.log('======== 第 1 步：InsightDistill（这本书教会了你什么） ========')
const distillReply = await call(distillSystem, distillUser)
console.log(distillReply)

// 解析；distill
let distill = null
try {
  const cleaned = distillReply.replace(/```json|```/g, '').trim().replace(/[\r\n]+/g, ' ')
  distill = JSON.parse(cleaned)
} catch (e) {
  console.error('DISTILL PARSE FAIL', e.message)
  process.exit(1)
}

// 手工检查重复：三块内容重合度
const allText = [
  ...distill.mind_shifts.map(m => m.before + m.after),
  ...distill.decision_principles,
  distill.for_your_situation
].join('')
const sentences = [
  ...distill.mind_shifts.map(m => `${m.before} ${m.after}`),
  ...distill.decision_principles,
  distill.for_your_situation
]
// 简单重叠检测：任意两块共享 8 字以上片段则标记
function overlap(a, b) {
  for (let i = 0; i <= a.length - 8; i++) {
    const frag = a.slice(i, i + 8)
    if (b.includes(frag)) return frag
  }
  return null
}
console.log('\n----- 重复检测 -----')
let dupFound = false
for (let i = 0; i < sentences.length; i++) {
  for (let j = i + 1; j < sentences.length; j++) {
    const o = overlap(sentences[i], sentences[j])
    if (o) { dupFound = true; console.log(`⚠️ 疑似重复 [${i} vs ${j}]: 共享片段 "${o}"`) }
  }
}
if (!dupFound) console.log('✅ 三块内容无 8 字以上重复片段')

// ---------- 第 2 步：GrowthPath ----------
const pathSystem = `你是"路书"人生图书馆的馆员，一位智慧的朋友。用户刚刚读完几个过来人的故事，馆员在上一页已经给 TA 提炼了精华（认知翻转、决策原则、对 TA 处境的解读）。现在 TA 想知道：我下一步具体该怎么做。

你的职责边界（非常重要）：
- 上一页讲的是"别人（过来人）的认知、原则和处境解读"——那是关于 TA 们的事。
- 你这一页只讲"用户本人接下来的行动"——具体动作、时间、能力、一周计划、一个月里程碑。
- 严禁重复、复述、改写上一页已经说过的任何观点。如果上一页说过"选工作前先确认三件事"，你绝不能再说一遍这句话或其同义改写。
- 上面所有页码以外的内容都不能引用上一页的结论作为你的输出，只能把相关的认知"翻译成用户本周能执行的动作"。

输出要求：
1. situation_summary：一句话描绘用户当下的处境（让 TA 感觉被理解）——这是现状扫描，不要给建议、不要复述上一页的解读。
2. next_steps：2-3 个具体的下一步动作。每个含 title（动作）/why（为什么有用，必须和上一页内容不重复）/how（怎么开始，具体到本周）/time_cost（需要多久）。要接地气，是普通人业余能做的。
3. skills_to_build：1-2 个值得补的能力方向。每个含 skill/reason/how_start/reference_cases（书名）。能力必须是真实世界里能练出来的，不是虚的"沟通力"。
4. one_month_plan：未来一个月，TA 可以做成的一件具体的事（这个月结束能拿出手的一个成果，要有可验证的完成标志）。
5. seven_day_plan：一个具体的 7 天行动计划，4-6 条（可含 Day 1–2 合并的条目）。每条含 day（如"Day 1"）/action（这几天具体做什么，直接可照着做）/note（为什么这么做）。
   - 最重要的要求：**每条 action 必须直接取材于用户"读过的书"**——比如"像《XXX》里的 TA 那样，先列出你纠结的三件事"，或"用《YYY》里学到的那个方法，做一遍 ZZZ"。必须在 action 里明确写出书名或人物名。
   - 禁止出现与读过的书无关的万能职业规划模板（如"梳理现状→找人聊→复盘"这种放谁身上都成立的废话）。
   - 如果用户没读过书，才允许给通用但具体的小行动。
6. mindset_anchor：一句在 TA 做决定时能拽住 TA 的话。

篇幅控制（重要）：
- action 一句话，不超过 40 字；note 一句话，不超过 25 字。
- next_steps 每条字段都要短：title ≤ 12 字，why ≤ 30 字，how ≤ 60 字。
- skills_to_build 的 how_start ≤ 50 字。
- 整体输出控制在 1000 字以内，宁可精炼，不要堆砌。

严格要求：
- 只输出 JSON，不要解释文字、不要 markdown 代码块。
- 所有内容必须口语化、接地气，像朋友聊天。
- 不要说教、不要空泛的"保持积极心态"。
- 七个字段都必须有值，数组字段不能为空数组。
- 中文输出。`

const lastPageText = `上一页馆员已经告诉用户这些内容（你严禁重复这些观点，只允许把它们"翻译成用户本周能执行的动作"）：
——认知翻转：${distill.mind_shifts.map(m => `${m.before} → ${m.after}`).join('；')}
——决策原则：${distill.decision_principles.join('；')}
——对用户处境的解读：${distill.for_your_situation}`

const pathUser = `用户当下的困惑：${userProblem}

用户的画像：
人群：职场新人（工作1-3年）
行业：广告/营销
职能：策划
关心：转行、成长
最看重：方向匹配、学习密度
限制：时间有限、担心转晚了

${lastPageText}

用户从过来人故事里收藏的认知：
认知1（来自《29岁广告策划转产品》）：原来以为：转岗成功=问题解决；现在觉得：转岗成功只是开始。

用户这次读过的书（你的 7 天计划必须直接从这些书里取材，每天的行动都要能对应到某本书的具体情节或方法，严禁给出与这些书无关的万能模板）：
《29岁广告策划转产品》——29岁 | 4年广告策划 | 普通本科。TA 当时的选择：用8个月业余时间边上班边准备，转了。结果：转岗成功不是终点，判断力才是核心竞争力。给后来人的话：看课程看到爽、不动手，以为学会就是会了——这是最大的坑。
时间轴：
· 选择1年后：转岗到产品岗，从0开始跟一个项目（TA 的领悟：转岗成功=问题解决，但其实只是开始）
· 选择3年后：第一次独立负责一个模块，数据有了起色（TA 的领悟：多学工具就是竞争力，其实判断力才是）
· 选择5年后：发现真正拉开差距的是"判断力"，不是工具（TA 的领悟：会画原型的人很多，会想问题的人很少）
TA 补过的能力：需求分析与判断力（边上班边用真实项目练）、数据驱动决策（跟项目学）、原型与文档表达（从0跟项目）

这些过来人当时补过的能力（供你判断"这个用户接下来可能需要什么"）：
29岁广告策划 补过的能力：需求分析与判断力、数据驱动决策、原型与文档表达

请给出这一页（馆员路径指引）的输出：只讲用户本人的行动，与上一页内容完全不同。`

console.log('\n\n======== 第 2 步：GrowthPath（馆员给你的路径指引） ========')
const pathReply = await call(pathSystem, pathUser)
console.log(pathReply)

// 检查七字段 + 重复
let path = null
try {
  const cleaned = pathReply.replace(/```json|```/g, '').trim().replace(/[\r\n]+/g, ' ')
  path = JSON.parse(cleaned)
  const fields = ['situation_summary', 'next_steps', 'skills_to_build', 'one_month_plan', 'seven_day_plan', 'mindset_anchor']
  console.log('\n----- 字段完整性 -----')
  for (const f of fields) {
    const v = path[f]
    const ok = Array.isArray(v) ? v.length > 0 : !!v
    console.log(`${ok ? '✅' : '❌'} ${f}: ${Array.isArray(v) ? v.length + ' 条' : (v || '(空)').slice(0, 30)}`)
  }
  console.log('\n----- 跨页重复检测（上一页 vs 这一页）-----')
  const prevText = [...distill.mind_shifts.map(m => m.before + m.after), ...distill.decision_principles, distill.for_your_situation].join('')
  const pathText = [
    path.situation_summary,
    ...(path.next_steps || []).map(s => `${s.title}${s.why}${s.how}`),
    ...(path.skills_to_build || []).map(s => `${s.skill}${s.reason}${s.how_start}`),
    path.one_month_plan,
    ...(path.seven_day_plan || []).map(s => s.action + s.note)
  ].join('')
  const o = overlap(prevText, pathText)
  console.log(o ? `⚠️ 跨页重复片段: "${o}"` : '✅ 跨页无 8 字以上重复')
  console.log('\n----- 7天行动计划 -----')
  let cited = 0
  for (const s of path.seven_day_plan || []) {
    console.log(`  ${s.day}: ${s.action} (${s.note || ''})`)
    // 检查是否引用了书名/人物
    if (/《[^》]+》|29岁|产品经理/.test(s.action)) cited++
  }
  console.log(`\n----- 7天计划引用书检查: ${cited}/${(path.seven_day_plan || []).length} 条引用了具体书/人物 -----`)
  if (cited < (path.seven_day_plan || []).length) {
    console.log('⚠️ 存在未引用读过的书的万能模板条目')
  } else {
    console.log('✅ 全部条目都取材于用户读过的书')
  }
  // 检查与上一页的重复
  const prev7Text = [...distill.mind_shifts.map(m => m.before + m.after), ...distill.decision_principles, distill.for_your_situation].join('')
  const sevenDayText = (path.seven_day_plan || []).map(s => s.action + s.note).join('')
  const o2 = overlap(prev7Text, sevenDayText)
  console.log(o2 ? `⚠️ 7天计划与上一页重复: "${o2}"` : '✅ 7天计划与上一页无重复')
} catch (e) {
  console.error('PATH PARSE FAIL', e.message)
}