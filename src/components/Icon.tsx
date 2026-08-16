import type { ReactNode } from 'react'

/**
 * 路书统一线性图标系统（UI Designer · Apple SF Symbols 质感）
 * - 24×24 视图，1.8 描边，currentColor 取色（自动跟随文字色/强调色）
 * - 传入已知图标名 → 渲染 SVG；传入 emoji 或未知值 → 原样回退（绝不报错）
 */
const PATHS: Record<string, ReactNode> = {
  // 书 / 阅读
  book: (
    <>
      <path d="M4 4.5C4 3.7 4.7 3 5.5 3H11v15.5c-1-.6-2.4-.6-3.5 0V4.5H4z" />
      <path d="M20 4.5c0-.8-.7-1.5-1.5-1.5H13v15.5c1-.6 2.4-.6 3.5 0V4.5H20z" />
    </>
  ),
  books: (
    <>
      <rect x="4" y="4" width="6" height="16" rx="1" />
      <rect x="14" y="4" width="6" height="16" rx="1" />
      <line x1="7" y1="8" x2="7" y2="8.01" />
      <line x1="17" y1="8" x2="17" y2="8.01" />
    </>
  ),
  // 导航 / 选择
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5.5-5.5 2 2-5.5 5.5-2z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  map: (
    <>
      <path d="M9 4l6 2 6-2v14l-6 2-6-2-6 2V6l6-2z" />
      <line x1="9" y1="6" x2="9" y2="20" />
      <line x1="15" y1="6" x2="15" y2="20" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h4a4 4 0 0 0 0-8H8" />
    </>
  ),
  // 疑问 / 思考
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.2a2.6 2.6 0 0 1 5 0c0 1.8-2.5 2.1-2.5 4" />
      <line x1="12" y1="17" x2="12" y2="17.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <line x1="16" y1="16" x2="21" y2="21" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.3 1 2.5h6c0-1.2.2-1.7 1-2.5A6 6 0 0 0 12 3z" />
    </>
  ),
  // 人 / 社群
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  student: (
    <>
      <path d="M12 4l9 4-9 4-9-4 9-4z" />
      <path d="M6 9.5V14c0 1.5 2.7 3 6 3s6-1.5 6-3V9.5" />
      <line x1="21" y1="8" x2="21" y2="14" />
    </>
  ),
  footprints: (
    <>
      <ellipse cx="9" cy="7" rx="2.2" ry="3" />
      <ellipse cx="15" cy="15" rx="2.2" ry="3" />
    </>
  ),
  wave: (
    <path d="M4 11c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  ),
  // 成长 / 能力
  star: (
    <path d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17l-5.3 2.8 1-5.8L3.5 9.2l5.9-.9z" />
  ),
  sparkle: (
    <path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-8 6-13 14-13 0 8-6 13-14 13z" />
      <path d="M5 19c4-4 7-7 10-9" />
    </>
  ),
  grad: (
    <path d="M12 3l9 4-9 4-9-4 9-4z" />
  ),
  // 任务 / 工具
  check: (
    <polyline points="4 12.5 9 17.5 20 6.5" />
  ),
  pen: (
    <>
      <path d="M4 20l4-1L18.5 8.5a2 2 0 0 0-3-3L5 16z" />
      <line x1="14" y1="6" x2="18" y2="10" />
    </>
  ),
  toolkit: (
    <>
      <rect x="3" y="8" width="18" height="11" rx="2" />
      <path d="M9 8V5h6v3" />
    </>
  ),
  ruler: (
    <>
      <rect x="3" y="7" width="18" height="10" rx="1" />
      <line x1="7" y1="7" x2="7" y2="11" />
      <line x1="11" y1="7" x2="11" y2="13" />
      <line x1="15" y1="7" x2="15" y2="11" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </>
  ),
  // 系统 / 导航控件
  robot: (
    <>
      <rect x="5" y="8" width="14" height="11" rx="2.5" />
      <line x1="9.5" y1="13" x2="9.5" y2="13.01" />
      <line x1="14.5" y1="13" x2="14.5" y2="13.01" />
      <path d="M12 8V5" />
      <circle cx="12" cy="4" r="1" />
    </>
  ),
  home: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12" y2="8.01" />
    </>
  ),
  menu: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  'arrow-left': (
    <polyline points="15 5 8 12 15 19" />
  ),
  'arrow-right': (
    <polyline points="9 5 16 12 9 19" />
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  // 复盘 / 周期
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <polyline points="20 3 20 8 15 8" />
    </>
  ),
  // 警示 / 坑
  alert: (
    <>
      <path d="M12 4L21 19H3L12 4z" />
      <line x1="12" y1="10" x2="12" y2="14" />
      <line x1="12" y1="17" x2="12" y2="17.01" />
    </>
  ),
  // 复制
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  // 山 / 下半场
  mountain: (
    <>
      <path d="M3 20L10 8l4 6 3-4 4 10H3z" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </>
  ),
  // 上升 / 往上走一步
  'trending-up': (
    <>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </>
  ),
}

export type IconName = keyof typeof PATHS | (string & {})

export default function Icon({
  name,
  size = 22,
  strokeWidth = 1.8,
  className,
  color,
}: {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
}) {
  const body = PATHS[name]
  if (!body) {
    // emoji 或未知值：原样回退，保证不破版
    return (
      <span className={className} style={{ fontSize: size, lineHeight: 1, display: 'inline-flex' }}>
        {name}
      </span>
    )
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {body}
    </svg>
  )
}
