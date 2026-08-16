# 路书 · 真 AI 接入运行手册（DeepSeek via CloudBase HTTP 访问）

> 目的：把「与前人聊聊」和「未来分岔」两个环节接上**真实大模型**，让参赛演示时「AI 是真的」成立。
> 设计铁律：任何失败（未配置 / 超时 / 调用失败）都自动回退到本地 fixture，**现场演示永不崩**。

---

## 一、现在已完成的代码改动

| 模块 | 文件 | 作用 |
|---|---|---|
| 网关云函数 | `cloudfunctions/api-llm/index.js` | DeepSeek 代理，CORS + 集成响应 + 双保险读密钥 + 25s 超时 + 轻量 IP 频率限制（best-effort，见下文说明） |
| 网关配置 | `cloudfunctions/api-llm/config.json` | `timeout:60` + `env.DEEPSEEK_API_KEY`（仅服务端，前端不接触） |
| 前端调用层 | `src/services/llm.ts` | `callLLM(system, messages)`；默认走云端代理 `CLOUDBASE_PROXY`，失败返回 null → fixture 回退 |
| 与前人聊聊 | `src/pages/CasePages.tsx` | grounded system prompt（仅限公开资料）→ 真 LLM；失败回退 `groundedReply` |
| 未来分岔 | `src/pages/ForkSimPage.tsx` | 基于用户画像生成「AI 实时生成·个性化」卡片；失败隐藏卡片 |
| 样本标注 | `src/components/BookShelf.tsx` + `LibraryHomePage.tsx` | 每本书标「演示样本」/「真实内测」徽章 + 顶部说明条 |
| 真实内测槽 | `src/data/realBetaCases.ts` | 空数组 + 模板，待填经授权脱敏的真实故事（`source_marker:'real_beta'`） |
| 类型 | `src/data/types.ts` | `SourceMarker` 增加 `'real_beta'` |

> **🔑 当前 Key 状态（2026-08-16 轮换 + 安全加固）**：DeepSeek Key **仅存于 `cloudfunctions/api-llm/config.json`（服务端）**，前端 bundle 已彻底移除硬编码（2026-08-16 泄露事故后重写 Git 历史清除残留）。**前端默认走云端代理 `https://<环境>.service.tcloudbase.com/api-llm`**，官方 Demo 开箱即得真 AI，无需任何配置。若自建 Cloudflare / Vercel 代理，记得在其变量里绑定自己的 Key 并 Deploy。

> **⚠️ 频率限制说明（best-effort）**：云函数内置了基于客户端 IP 的 60s 滑动窗口（默认每 IP 每分钟 30 次）。但腾讯云 HTTP 访问服务的云函数每次调用多为独立实例、实例内存不跨调用保持，因此该限制仅能挡住「同一实例突发」，并非跨实例强限制。真正的强防护靠两点：① Key 只在服务端、可即时轮换（怀疑被滥用时在 `config.json` 改 Key 并重部署即可）；② 如需硬限流，建议在 CloudBase 网关层配额度，或在函数内接入 CloudBase 数据库做共享计数。当前比赛演示窗口下，服务端密钥 + 可轮换已足够。

---

## 二、点亮真 AI（只需做一次）

### ⭐ 推荐：方案 B · 外部 Serverless 代理（不碰腾讯云控制台，约 1 分钟）

适用场景：**微信小程序云开发包月环境看不到「HTTP 访问服务」入口**（已实测微信侧环境就是没有）。
代理文件已备好，与云函数同款契约，应用**无需改代码**：
- `llm-proxy/worker-v2.js` —— Cloudflare Worker 单文件（**推荐**，带 15s 超时，粘贴即部署）
- `llm-proxy/vercel-api-llm.js` —— Vercel Edge Function（放到仓库 `api/llm.js`）

**Cloudflare 部署步骤：**
1. 打开 https://dash.cloudflare.com → 左侧「Workers 和 Pages」→「创建」→ 选「Worker」
2. 取名（如 `roadbook-llm`）→ 代码框**清空并粘贴 `worker-v2.js`** →「部署」
3. 部署后点「设置」→「变量」→ 添加变量 `DEEPSEEK_API_KEY`，值填你的 key（建议点「加密」）
4. 得到地址： `https://roadbook-llm.<你的子域>.workers.dev`
5. 在**已部署的路书页面**打开浏览器控制台（F12），执行：
   ```js
   localStorage.setItem('roadbook_llm_endpoint', 'https://roadbook-llm.<你的子域>.workers.dev')
   ```
   整页硬刷新（Cmd/Ctrl+Shift+R），真 AI 即刻点亮。

**Vercel 部署步骤（备选）：** 把 `vercel-api-llm.js` 内容放到 Git 仓库 `api/llm.js` → 导入 Vercel → 设置环境变量 `DEEPSEEK_API_KEY` → 部署 → 端点形如 `https://<项目>.vercel.app/api/llm` → 同样用上面第 5 步填进 `roadbook_llm_endpoint`。

> 代理只做「转发 + 持 Key + CORS」，任何失败都返回 `{reply:null}`，前端自动回退本地 fixture，演示永不崩。

### 方案 A · 腾讯云 CloudBase（仅当你的环境支持 HTTP 访问服务）

1. **准备 DeepSeek Key**：去 https://platform.deepseek.com 注册，开一个 API Key（格式 `sk-...`）。
2. **让环境在控制台可见**：`console.cloud.tencent.com` 用微信扫码后若**看不到环境**，说明是微信侧小程序云开发环境，需先在腾讯云「账号信息 → 登录方式」把「微信公众平台」关联绑定。
3. **确认有 HTTP 访问服务**：左侧菜单有「HTTP 访问服务」才继续；**包月套餐通常没有此入口**，需新建/升级为**按量计费环境**。
4. **部署云函数**：把 `cloudfunctions/api-llm/` 整个目录上传为云函数（函数名 `api-llm`）。
   - `config.json` 的 `env.DEEPSEEK_API_KEY` **已预填好你的 DeepSeek Key**，无需再填（密钥只存服务端，不进前端 bundle）。
   - 该函数用 Node 内置 `https`，**无需任何 npm 依赖**，可直接部署。
5. **开 HTTP 访问服务**：云开发控制台 → **HTTP 访问服务** → 新增路径 `/api-llm` → 指向函数 `api-llm` → 得到 `https://<环境ID>.service.tcloudbase.com/api-llm`。
6. **（可选）填前端 + 重新构建部署**：前端 `src/services/llm.ts` 已把该地址设为 `CLOUDBASE_PROXY` 默认值，**一般情况无需改 `.env` 即可直接用**。仅当你要用自有代理时才在 `.env` 写 `VITE_LLM_ENDPOINT=...` 后 `npm run build` 部署。

> 以上两种方案，最终都靠 `roadbook_llm_endpoint`（localStorage）或 `VITE_LLM_ENDPOINT`（构建期）点亮，应用逻辑一致。

完成后，聊路 / 分岔即走真实模型；未配置时自动 demo 模式，功能照常。

---

## 三、演示前自检清单

- [ ] 网关地址能从浏览器 `curl -X POST .../api-llm -d '{"system":"你是助手","messages":[{"role":"user","content":"你好"}]}'` 拿到 `{"reply":"..."}`
- [ ] （可选）若要换自有代理：前端 `.env` 的 `VITE_LLM_ENDPOINT` 已填且重新构建；默认云端代理无需此步
- [ ] 手机端硬刷新（Cmd/Ctrl+Shift+R）加载新包
- [ ] 断网 / 错 key 情况下，聊路仍能回退 fixture、不白屏（即「演示永不崩」）

---

## 四、填入真实内测故事（内容真实性收口）

编辑 `src/data/realBetaCases.ts`，按模板把内测用户的**匿名、已授权**故事填进数组。
填好后它们会自动出现在「路书库」书架，并显示绿色「真实内测」徽章，与灰色「演示样本」明确区分。

> 注意：真实故事必须脱敏、经本人授权；名人案例已带公开来源，普通人演示样本依旧标注「演示样本」。

---

## 五、常用命令

```bash
npm run dev        # 本地预览（demo 模式）
npm run build      # 构建（会先做 tsc 类型检查）
# 部署：用 CloudStudio / 云开发静态托管 发布 dist/
```
