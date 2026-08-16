import type { PageCtx } from './router'
import Header from '../components/Header'
import { pushTrace } from '../agents/base'
import { AUDIENCE_META } from '../data/types'

export default function IntentGatePage({ state, setState, goTo }: PageCtx) {
  const audience = state.profile?.audience || 'new_grad'
  const audLabel = AUDIENCE_META[audience].label

  const chooseProblem = () => {
    setState(s => pushTrace(s, 'context', 'intent_gate_problem', { audience }))
    goTo('current_problem')
  }
  const chooseBrowse = () => {
    setState(s => pushTrace(s, 'context', 'intent_gate_browse', { audience }))
    goTo('library_wall')
  }
  const chooseShare = () => {
    setState(s => pushTrace(s, 'context', 'intent_gate_share', { audience }))
    goTo('write_entry_a')
  }

  return (
    <>
      <Header
        chapter={`${audLabel} · 人生图书馆`}
        title="你来这里，想——"
        subtitle="迷茫的人找答案，过来人留经验，两边随时能切换"
        icon="route"
      />

      <div className="intent-gate">
        {/* 求解者路径 — 主推：直接找答案 */}
        <button className="intent-card" onClick={chooseProblem}>
          <div className="intent-card-eyebrow">我有件事卡住了</div>
          <div className="intent-card-title">想直接找答案 <span className="intent-card-badge">推荐</span></div>
          <div className="intent-card-body">
            不用再问遍家人朋友、翻好几本书、刷一晚上短视频——馆员会先听你说困惑，
            再从书架上找到<strong>真正走过这条路的人</strong>，把他的选择和结果摆到你面前。
            <br />
            看完别人的路，馆员还能帮你把<strong>下一步该做什么、该补什么能力</strong>一次理清。
          </div>
          <div className="intent-card-arrow">告诉馆员我的困惑 →</div>
        </button>

        {/* 自己逛逛书墙 */}
        <button className="intent-card" onClick={chooseBrowse}>
          <div className="intent-card-eyebrow">我想自己逛逛书墙</div>
          <div className="intent-card-title">看看同龄人都在经历什么</div>
          <div className="intent-card-body">
            还不确定自己卡在哪，先翻翻和你同龄段的人写下的真实经历——有人选对了，有人走弯了，但他们都把过程留了下来。
          </div>
          <div className="intent-card-arrow">去书墙看看 →</div>
        </button>

        {/* 分享者路径 */}
        <button className="intent-card" onClick={chooseShare}>
          <div className="intent-card-eyebrow">我是过来人</div>
          <div className="intent-card-title">想把我走过的路留下来</div>
          <div className="intent-card-body">
            把你当时的选择、后来的结果、踩过的坑写给后来的人。
            <br />
            <strong>你的经验，会成为下一个人翻到的参考。</strong>
          </div>
          <div className="intent-card-arrow">写一本我的 →</div>
        </button>
      </div>

      <div className="card-soft mt-16">
        <div className="text-sm text-faint">
          不管从哪个入口进来，你都在同一座图书馆里。<br/>
          找答案的人，翻完别人的书也可能想写自己的；分享的人，写完也能翻翻别人的。
        </div>
      </div>
    </>
  )
}