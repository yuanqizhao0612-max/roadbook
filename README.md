# 路书 Roadbook

> 把"走过的人生"变成后来人**可学习、可练习、可验证**的方法——让每个迷茫的人，都读到"走过的人"写的路书。

**世界人工智能开源大赛（GOAI）· 无界应用赛道（AI+教育）参赛作品** | Apache-2.0 License | 可运行 Demo：https://4b441fc3a92f4864b857aebbb469da0f.app.workbuddy.link

---

## 一、这是什么

路书是「个性化成长学习」AI Agent 应用：围绕用户的真实处境，跑通 **理解 → 检索 → 迁移 → 验证** 的教育闭环。

- 用户讲出自己的阶段与困惑（应届生/转行/管理/关系/长期投入）
- 系统在"路书库"中检索相似的前人经历（**14 位跨时代名人 / 历史人物** + 真实内测样本）
- 馆员提炼前人的认知翻转、决策原则、可迁移方法（带来源、不虚构）
- 生成本人**本周就能开始**的 7 天行动路书，并可存进"我的第一本路书"持续打卡

**它不是什么**：不是泛聊天机器人、不是单点问答、不是内容生成器——而是一个跑通教育闭环的 3-Agent 应用。

### V0.9.9 关键能力

- **书墙分类筛选**：「全部 / 名人 / 事业 / 生活 / 人际关系」一键筛选，名人 tab 直达 14 位跨时代人物库
- **路径生成 · 学习模式**：即使没写困惑，只要读过样本/名人路书，馆员也会自动从读过的书里提炼「值得学习的经验、方法、特质、困境思考方式」生成学习路径；写困惑则输出更贴合境况的定制路径
- **白屏根治**：LLM 输出经强类型归一化（脏数据安全落入错误态）+ 全局 ErrorBoundary，现场演示绝不白屏
- **真实 AI 增强**：DeepSeek 驱动「与前人聊聊」「未来分岔」「路径指引」，失败自动回退本地 fixture，演示永不崩
- **Fixture-first**：无需 API Key 即可完整体验全部功能

## 二、技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vite 5 + React 18 + TypeScript 5（87 模块）（SPA，移动优先） |
| 智能内核 | 3-Agent 规则引擎（Context & Theme / Experience Retrieval / Learning Journey），Fixture-first 可扩展 |
| 持久化 | 浏览器 localStorage（用户贡献即时入库，数据闭环） |
| 真 AI | DeepSeek（经 CloudBase HTTP 访问服务 / Cloudflare Worker / Vercel Edge 网关代理，带 CORS + 超时 + 回退） |
| 部署 | 任意静态托管（当前：CloudBase 静态托管，公网可访问） |

## 三、本地运行

```bash
npm install
npm run dev        # 本地预览（demo 模式，无需任何 Key）
npm run build      # 构建（先 tsc -b 类型检查，再 vite build）→ 输出 dist/
npm run preview    # 预览构建产物
```

无任何外部依赖即可完整演示：人工智能内核为规则引擎 + 内置数据，未配置 LLM 时自动 demo 模式。

## 四、点亮真实 AI（可选，DeepSeek）

「与前人聊聊」「未来分岔」「路径指引」三个环节可接入真实大模型，让演示时"AI 是真的"。

**设计铁律：任何失败（未配置 / 超时 / 调用失败）都自动回退到本地 fixture，现场演示永不崩。**

### 方案 B（推荐）· 外部 Serverless 代理（约 1 分钟，不碰腾讯云控制台）

1. 打开 https://dash.cloudflare.com → Workers 和 Pages → 创建 Worker
2. 清空代码框，粘贴 [`llm-proxy/worker-v2.js`](./llm-proxy/worker-v2.js) → 部署
3. 设置 → 变量 → 添加 `DEEPSEEK_API_KEY`（值填你的 Key，建议加密）
4. 得到 `https://roadbook-llm.<你的子域>.workers.dev`
5. 在已部署的路书页面打开控制台（F12）执行：
   ```js
   localStorage.setItem('roadbook_llm_endpoint', 'https://roadbook-llm.<你的子域>.workers.dev')
   ```
   硬刷新（Cmd/Ctrl+Shift+R）即点亮。

备选：`llm-proxy/vercel-api-llm.js` → Vercel Edge Function（放仓库 `api/llm.js`）；或方案 A 走腾讯云 CloudBase HTTP 访问服务（详见 [路书_真AI接入运行手册.md](./路书_真AI接入运行手册.md)）。

### 前端调用层

- `src/services/llm.ts`：`callLLM(system, messages)` 统一调用，失败返回 `null`
- 构建期可用 `.env` 的 `VITE_LLM_ENDPOINT`（见 `.env.example`），或运行时 `roadbook_llm_endpoint`（localStorage，优先）

## 五、项目结构

```
src/
├── agents/          # 3-Agent 智能内核（context/retrieval/journey + localSevenDay）
├── pages/           # 33 个页面（22 个真实场景 + 子系统页），router.tsx 路由
├── components/      # 通用组件（Icon 图标库 / BookShelf / ErrorBoundary 等）
├── data/            # 名人案例 / 样本 / 技能 / 时间轴 / 类型定义（fixture-first）
├── services/llm.ts  # 真实大模型调用层（失败回退 fixture）
├── store/           # 全局状态（用户画像、路径结果、版本号）
└── styles/          # 全局样式（设计令牌，禁硬编码色值）
cloudfunctions/api-llm/   # 腾讯云网关云函数（DeepSeek 代理，双保险读密钥）
llm-proxy/                # Cloudflare Worker / Vercel Edge 代理（同一契约）
scripts/verify-content-flow.mjs  # 内容流校验脚本
```

## 六、内容与合规

- **来源清晰**：名人/历史人物案例均标注公开来源（`sources[2]`：一手文献 + 公开传记/史料），**绝不虚构**；学术界有争议处如实标注（如鲁迅弃医从文动机）
- **隐私保护**：用户贡献自动脱敏（手机号/邮箱/薪资），可自主选择公开粒度；贡献即授权"匿名化入库供后人检索"，可随时撤回
- **边界声明**：路书不替用户做决定、不预测命运，只做情景推演；不进入医疗/法律/金融投顾等需资质领域
- **演示与真实**：书架明确标注「演示样本 / 真实内测」徽章；真实故事须脱敏并经本人授权（`src/data/realBetaCases.ts`）

## 七、工程纪律

- **P0 门禁**：禁 emoji 功能图标（统一 Icon.tsx 图标库）、禁紫粉渐变、禁硬编码色值（CSS 变量令牌）
- **构建红线**：`npm run build` 必须 TS 零错误（86+ 模块）才能发布
- **部署验证**：部署后核对线上 bundle hash 与本地一致
- **白屏零容忍**：所有 LLM 输出必须经类型归一化 + 全局 ErrorBoundary（见 `src/components/ErrorBoundary.tsx`）

## 八、部署

构建后的 `dist/` 可部署到任意静态托管：

- **当前线上**：CloudBase 静态托管 → https://4b441fc3a92f4864b857aebbb469da0f.app.workbuddy.link
- 或 CloudStudio / GitHub Pages / Vercel / Netlify 等，无需服务端

## 九、常见命令速查

```bash
npm run dev        # 本地开发
npm run build      # 类型检查 + 构建
npm run preview    # 预览构建产物
node scripts/verify-content-flow.mjs   # 内容数据完整性校验
```

## 十、License

[Apache-2.0](./LICENSE)，欢迎 Fork / 二次开发 / 用于教育场景共建。