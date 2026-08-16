// ============================================================
// 真实内测案例槽（Real Beta Cases）
// ------------------------------------------------------------
// 这里是「真实内测用户」的故事存放处——与 fixture 演示样本的区别：
//   - source_marker 固定为 'real_beta'
//   - UI 书架会显示绿色「真实内测」徽章，评委可一眼识别这是真用户
//   - 必须是经用户本人授权、已脱敏的内容，绝不虚构
//
// ⚠️ 当前为空数组：请把你内测用户的匿名故事按下方模板填进来。
//    每条需完整符合 OrdinaryCase 结构（参考 src/data/fixtureCases.ts 的普通人案例）。
//    填好后，它们会自动出现在「路书库」书架，并带「真实内测」徽章。
// ============================================================
import type { OrdinaryCase } from './types'

export const realBetaCases: OrdinaryCase[] = [
  // ── 模板（取消注释并替换为真实脱敏故事）──
  // {
  //   id: 'real_beta_001',
  //   source_marker: 'real_beta',
  //   audience: 'new_grad',                 // new_grad | mid_career | senior
  //   title: '保研失利后，要不要直接工作',
  //   who: '23岁 | 待业 | 普通本科',
  //   one_line_choice: '先工作，用业余时间验证另一个方向',
  //   biggest_pitfall: '把"没想清楚"当成"没机会"',
  //   why_similar: '当时也卡在"继续读书还是直接工作"的路口',
  //   time_horizon: '18_months',
  //   outcome: '工作后反而更清楚自己要什么，半年内转到了想做的方向',
  //   satisfaction: 'satisfied',
  //   if_again: '会更早去聊真实的前辈，而不是自己闷头想',
  //   advice: '方向不是想出来的，是撞出来的。先动起来。',
  //   stage_tag: 'peer',
  //   profile_tag: '保研失利',
  //   // case_profile: { ... }  // 可选：脉脉式坐标卡（脱敏）
  //   // sources: [ ... ]        // 真实用户无需公开来源；留空即可
  // },
]
