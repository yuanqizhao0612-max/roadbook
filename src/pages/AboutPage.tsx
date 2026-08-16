import type { PageCtx } from './router'
import Header from '../components/Header'
import { initialState } from '../store/store'

export default function AboutPage({ state, setState, goTo }: PageCtx) {
  const reset = () => {
    if (!confirm('确定重置全部进度吗？所有数据会被清空。')) return
    setState(() => initialState())
    goTo('cover')
  }

  return (
    <>
      <Header chapter="关于路书" title="路书 V0.9.9" icon="info" />

      <div className="card-accent card mt-16">
        <div className="item-title">你不是第一个走到这里的人</div>
        <div className="item-body" style={{ color: 'var(--ink)' }}>
          路书是一本属于你的数字人生书。它帮你看到走过这条路的人留下了什么，把他们可学习的判断方法变成你自己的能力。
        </div>
      </div>

      <div className="card">
        <div className="section-label">版本能力</div>
        <div className="item-body">
          <strong>V0.3</strong> · 前人经验学习引擎：Case → Formula → Boundary → Transfer → Practice<br/>
          <strong>V0.4</strong> · 问路成长系统：Learning Journey + 问路 + 成长图谱<br/>
          <strong>V0.4.1</strong> · 真实反馈体验重构：全口语化 + 工作选择尺 + 未来分岔 + 7 天行动<br/>
          <strong>V0.5</strong> · AI 人生图书馆：名人/历史人物路书库 + 同龄人路书 + 写一页给后来的人<br/>
          <strong>V0.9</strong> · 7 天行动个性化生成 + 未来分岔按画像分流 + 全站线性图标统一
        </div>
      </div>

      <div className="card">
        <div className="section-label">技术说明</div>
        <div className="item-body">
          · Fixture-first 实现，无 API Key 完整可演示<br/>
          · 3-Agent 架构（Context / Retrieval / Journey）<br/>
          · localStorage 持久化，刷新恢复状态<br/>
          · 用户贡献路书写入本地 → 可被再次检索（数据闭环）<br/>
          · 预留 Live LLM 增强接口（含 fallback）
        </div>
      </div>

      <div className="card">
        <div className="section-label">数据标记</div>
        <div className="chip-group">
          <span className="badge badge-demo">演示样本</span>
          <span className="badge badge-user">真人写下</span>
        </div>
        <div className="text-xs text-soft mt-8">所有历史人物案例均基于公开史料，引用含来源，禁止虚构。</div>
      </div>

      <div className="card-soft">
        <div className="text-sm text-soft">已记录 {state.trace.length} 条 Agent Trace。</div>
      </div>

      <div className="btn-row mt-16">
        <button className="btn btn-secondary" onClick={() => goTo('agent_trace')}>看 Trace</button>
        <button className="btn btn-ghost text-red" onClick={reset}>重置进度</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary btn-full" onClick={() => goTo('cover')}>回到封面 →</button>
      </div>
    </>
  )
}

