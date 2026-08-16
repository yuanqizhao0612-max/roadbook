import { useEffect, useRef, useState, useCallback } from 'react'
import type { AppState, BookPageId } from './data/types'
import { loadState, saveState, initialState } from './store/store'
import { bookChapters } from './data/fixtureMentor'
import { renderPage } from './pages/router'
import Icon from './components/Icon'

const FLIP_MS = 480

export default function App() {
  const [state, setStateRaw] = useState<AppState>(() => {
    // SSR guard
    if (typeof window === 'undefined') return initialState()
    return loadState()
  })
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state }, [state])

  // 翻页过渡：记录“正在翻走的那一页”的快照，过渡期间叠在顶层转走
  const prevRef = useRef<AppState | null>(null)
  const [trans, setTrans] = useState<{ dir: 'forward' | 'back' } | null>(null)
  const [transKey, setTransKey] = useState(0)
  const [tocOpen, setTocOpen] = useState(false)
  const transTimer = useRef<number | undefined>(undefined)

  // 包装 setState：自动持久化
  const setState = useCallback((updater: (s: AppState) => AppState) => {
    setStateRaw(prev => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }, [])

  const startTransition = useCallback((dir: 'forward' | 'back') => {
    prevRef.current = stateRef.current
    setTrans({ dir })
    setTransKey(k => k + 1)
    window.clearTimeout(transTimer.current)
    transTimer.current = window.setTimeout(() => setTrans(null), FLIP_MS)
  }, [])

  const resetScroll = useCallback(() => {
    window.scrollTo?.(0, 0)
    requestAnimationFrame(() => {
      document.querySelectorAll('.book-page').forEach(el => {
        ;(el as HTMLElement).scrollTop = 0
      })
    })
  }, [])

  // 页面跳转（带动画方向）
  // dir='forward' 压栈（正常翻页）；dir='replace' 替换当前位置（目录跳转，不压栈）；dir='back' 出栈
  const goTo = useCallback((page: BookPageId, dir: 'forward' | 'back' | 'replace' = 'forward') => {
    setStateRaw(prev => {
      let history: BookPageId[]
      if (dir === 'forward') {
        history = [...prev.pageHistory.slice(-20), prev.page]
      } else if (dir === 'replace') {
        // 目录跳转：把当前页压入历史栈，再跳到目标页
        // 这样按返回可以一步步回到封面，不会丢失历史
        const base = prev.pageHistory.length > 0 ? [...prev.pageHistory, prev.page] : [prev.page]
        history = base.slice(-20)
      } else { // back
        history = prev.pageHistory.slice(0, -1)
      }
      const next: AppState = {
        ...prev,
        page,
        pageHistory: history.length ? history : (dir === 'back' ? [page] : [...history, page])
      }
      return next
    })
    startTransition(dir === 'replace' ? 'forward' : dir)
    resetScroll()
  }, [startTransition, resetScroll])

  const back = useCallback(() => {
    setStateRaw(prev => {
      if (prev.pageHistory.length <= 1) return prev
      const history = prev.pageHistory.slice(0, -1)
      const prevPage = history[history.length - 1]
      return { ...prev, page: prevPage, pageHistory: history }
    })
    startTransition('back')
    resetScroll()
  }, [startTransition, resetScroll])

  // 触摸滑动翻页（仅记录起点，由页面内滚动条自行处理纵向）
  const startX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (tocOpen) return
    if (startX.current === null) return
    const dx = e.changedTouches[0].clientX - startX.current
    startX.current = null
    if (Math.abs(dx) > 80 && dx > 0) {
      // 向右滑 = 上一页
      back()
    }
  }

  const meta = bookChapters[state.page] || { chapter: '', page: '', icon: '' }
  const isCover = state.page === 'cover'

  // 正在翻走的那页（用过渡前的快照状态渲染）
  const transDir = trans?.dir ?? null
  const turning = transDir && prevRef.current
    ? renderPage({ state: prevRef.current, setState, goTo, back })
    : null

  return (
    <div className="book-app" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="book-stage">
        {/* 当前页：在底下被翻出来的那页 */}
        <div className="book-page book-page-current">
          <div className="page-content scroll-pad">
            {renderPage({ state, setState, goTo, back })}
          </div>
        </div>
        {/* 正在翻走的那页（仅过渡期间存在，叠在顶层绕书脊转走） */}
        {turning && transDir && (
          <div
            key={transKey}
            className={`book-page book-page-turning turn-${transDir}`}
          >
            <div className="page-content scroll-pad">{turning}</div>
            <div className="page-curl" />
          </div>
        )}
      </div>

      {!isCover && (
        <>
          <div className="book-topbar">
            <button className="book-corner book-corner-left" onClick={back} aria-label="翻回上一页">
              <Icon name="arrow-left" size={20} className="corner-glyph" />
            </button>
            <div className="book-corner-right">
              <button className="book-corner" onClick={() => goTo('cover')} aria-label="回到首页">
                <Icon name="home" size={19} className="corner-glyph" />
              </button>
              <button className="book-corner" onClick={() => goTo('agent_trace')} aria-label="Agent 协作轨迹">
                <Icon name="robot" size={18} className="corner-glyph" />
              </button>
              <button className="book-corner" onClick={() => setTocOpen(o => !o)} aria-label="打开目录">
                <Icon name="menu" size={20} className="corner-glyph" />
              </button>
            </div>
          </div>
          <div className="book-footer">
            <span className="bf-brand">路书 · ROADBOOK</span>
            <span className="bf-chapter">{meta.chapter || meta.page}</span>
          </div>
        </>
      )}

      <TocDrawer open={tocOpen} onClose={() => setTocOpen(false)} goTo={goTo} current={state.page} showOffer3Q={state.profile?.concerns.includes('要不要接 Offer') ?? false} />
    </div>
  )
}

// ---------- 目录抽屉（≡ 打开） ----------
const TOC: { group: string; items: { page: BookPageId; label: string; icon: string }[] }[] = [
  { group: '开始', items: [
    { page: 'profile_0', label: '先选一选 · 你是谁、现在在哪', icon: 'compass' },
    { page: 'profile_1', label: '你关心什么、看重什么', icon: 'wave' }
  ]},
  { group: '理解你的题', items: [
    { page: 'current_problem', label: '你现在走到哪里了', icon: 'pin' },
    { page: 'not_alone', label: '这一页，很多人也写过', icon: 'footprints' },
    { page: 'library', label: '路书库', icon: 'books' }
  ]},
  { group: '看前人怎么走', items: [
    { page: 'peer_cases', label: '和你差不多的人', icon: 'student' },
    { page: 'lookback_case', label: '走过以后的人', icon: 'clock' },
    { page: 'historical_case', label: '历史上，也有人换过方向', icon: 'pen' }
  ]},
  { group: '把经验变能力', items: [
    { page: 'method_use', label: '换成你可以怎么用', icon: 'toolkit' },
    { page: 'decision_ruler', label: '我的工作选择尺', icon: 'ruler' },
    { page: 'fork_sim', label: '如果这样选，未来怎么展开', icon: 'leaf' },
    { page: 'offer_3q', label: '接 Offer 前，先确认 3 件事', icon: 'question' }
  ]},
  { group: '我的路书', items: [
    { page: 'my_roadbook', label: '我的第一本路书', icon: 'route' },
    { page: 'learning_route', label: '我接下来最该学什么', icon: 'compass' },
    { page: 'dashboard', label: '我的下一程', icon: 'home' }
  ]},
  { group: '更多', items: [
    { page: 'ask_road', label: '问路 · 遇到新问题', icon: 'map' },
    { page: 'library_home', label: '路书库首页', icon: 'books' },
    { page: 'agent_trace', label: '3-Agent 数据流协作', icon: 'robot' },
    { page: 'about', label: '关于路书', icon: 'info' }
  ]}
]

function TocDrawer({ open, onClose, goTo, current, showOffer3Q }: {
  open: boolean
  onClose: () => void
  goTo: (page: BookPageId, dir?: 'forward' | 'back' | 'replace') => void
  current: BookPageId
  showOffer3Q: boolean
}) {
  if (!open) return null
  return (
    <>
      <div className="toc-backdrop" onClick={onClose} />
      <div className="toc-panel" onTouchEnd={e => e.stopPropagation()}>
        <div className="toc-head">
          <div className="toc-title">目录</div>
          <button className="book-corner toc-close" onClick={onClose} aria-label="关闭目录"><Icon name="close" size={16} /></button>
        </div>
        <div className="toc-body">
          {TOC.map(g => (
            <div className="toc-group" key={g.group}>
              <div className="toc-group-label">{g.group}</div>
              {g.items
                .filter(it => it.page !== 'offer_3q' || showOffer3Q)
                .map(it => (
                  <div
                    key={it.page}
                    className={`toc-item ${current === it.page ? 'active' : ''}`}
                    onClick={() => { goTo(it.page, 'replace'); onClose() }}
                  >
                    <Icon name={it.icon} size={18} className="ti-icon" />
                    <span className="ti-text">{it.label}</span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
