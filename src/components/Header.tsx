import Icon from './Icon'

/**
 * 路书统一页头（UI Designer）
 * 所有页面共用，保证章节徽标、标题、图标风格一致。
 * icon 传图标名（见 Icon.tsx）；不传则不显示图标。
 */
export default function Header({
  chapter,
  title,
  subtitle,
  icon,
}: {
  chapter: string
  title: string
  subtitle?: string
  icon?: string
}) {
  return (
    <div className="page-header">
      {chapter && <div className="page-chapter">{chapter}</div>}
      <div className="page-title">
        {icon && <Icon name={icon} size={20} className="page-icon" />}
        <span>{title}</span>
      </div>
      {subtitle && <div className="page-subtitle">{subtitle}</div>}
    </div>
  )
}
