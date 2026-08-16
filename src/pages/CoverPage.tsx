import type { PageCtx } from './router'

export default function CoverPage({ state, goTo }: PageCtx) {
  const hasProgress = state.profile !== null
  return (
    <div className="cover-page">
      {/* ── 上半：深色区（书名 + 右上文案 + 公路插画）── */}
      <div className="bc-dark">
        {/* 左侧：竖排大书名 */}
        <div className="bc-title-v">路书</div>

        {/* 右侧内容区 */}
        <div className="bc-top-right">
          <div className="bc-tag">AI 人生图书馆 · 每个人都是一本书</div>
          <p className="bc-subtitle">
            一座每个人都是一本书的<br />人生图书馆。
          </p>
        </div>

        {/* 底部：公路插画（白线 + 山脉剪影） */}
        <div className="bc-road-wrap">
          <svg className="bc-road-svg" viewBox="0 0 400 140" preserveAspectRatio="xMidYMax meet">
            {/* 远山（细线） */}
            <path d="M0,85 Q50,60 100,72 T200,55 T300,68 T400,50" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <path d="M0,95 Q80,75 160,88 T280,65 T400,78" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
            {/* 近山（稍粗） */}
            <path d="M0,105 Q60,82 130,95 T250,75 T340,92 T400,80" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
            {/* 主公路（白色粗线，S弯） */}
            <path d="M-10,135 Q40,132 80,120 Q130,100 180,108 Q240,118 280,100 Q330,78 380,88 T420,75"
              fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
            {/* 公路虚线（车道分隔） */}
            <path d="M-10,138 Q40,135 80,123 Q130,103 180,111 Q240,121 280,103 Q330,81 380,91 T420,78"
              fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" strokeDasharray="6 8" strokeLinecap="round" />
            {/* 车灯（小橙点） */}
            <circle cx="175" cy="110" r="1.8" fill="#e87a3a" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.35;0.9" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="275" cy="102" r="1.5" fill="#e87a3a" opacity="0.7">
              <animate attributeName="opacity" values="0.7;0.25;0.7" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>

      {/* ── 下半：白色区（金句 + 说明 + 按钮）── */}
      <div className="bc-light">
        <blockquote className="bc-quote">
          你不是第一个走到这里的人。<br/>翻开别人的故事，也写下你自己的那一页。
        </blockquote>

        <div className="bc-desc">
          <span className="bc-em">路书</span>是一座人生图书馆——前人走过的路都在这里，成功的、失败的，都是你可以翻阅的参考。
        </div>

        <button className="btn btn-cover" onClick={() => goTo('age_select')}>
          {hasProgress ? '继续翻阅 →' : '翻开第一页 →'}
        </button>
        {hasProgress && (
          <button
            className="btn btn-sm btn-cover-alt w-full"
            onClick={() => goTo('dashboard')}
          >
            直接看「我的下一程」
          </button>
        )}

        <div className="bc-footer">
          <span>每位读者都是作者 · 书架永远在变厚 · 3 个 AI 智能体帮你找到最相关的那本</span>
        </div>

        <div className="bc-version">内测版 V0.9.9 · 演示样本</div>
      </div>
    </div>
  )
}
