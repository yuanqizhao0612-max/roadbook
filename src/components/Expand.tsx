import { useState, type ReactNode } from 'react'

// Apple 风格的「点击展开」：默认收起，点击平滑展开。
// 用于把单屏放不下的细节内容折叠起来，保证每页一屏。
export default function Expand({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="expand">
      <button className={`expand-head ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span>{title}</span>
        <span className="chev">{open ? '收起' : '展开'}</span>
      </button>
      <div className={`expand-body ${open ? 'open' : ''}`}>
        <div className="expand-inner">{children}</div>
      </div>
    </div>
  )
}
