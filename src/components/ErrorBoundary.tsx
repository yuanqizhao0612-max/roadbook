import { Component, type ReactNode } from 'react'

// ============================================================
// 路书 · 全局错误边界（V0.9.9:2 新增）
// 产品铁律：任何页面/组件渲染崩溃都绝不允许"白屏"——
// 必须fallback 到可见的友好错误卡 + 回封面按钮，现场演示永不崩。
// ============================================================

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    // 演示环境：把错误留在控制台便于排障，用户侧永远看到兜底 UI
    console.error('[Roadbook ErrorBoundary]', error)
  }

  handleReset = () => {
    this.setState({ hasError: false })
    try {
      // 回到封面（重新开始安全路径），不清 localStorage 数据
      location.hash = '#/cover'
    } catch { /* ignore */ }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            background: 'var(--bg, #f5f6f8)',
          }}
        >
          <div
            className="card-accent card"
            style={{ maxWidth: 420, width: '100%', padding: 28, textAlign: 'center' }}
          >
            <div className="item-title" style={{ fontSize: 18, marginBottom: 8 }}>
              这里刚才走神了一下
            </div>
            <div
              className="item-body"
              style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}
            >
              你读过的书、收藏的认知卡都还在，没有丢失。<br/>
              回到封面可以重新出发。
            </div>
            <button className="btn btn-primary btn-full" onClick={this.handleReset}>
              回到封面 →
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}