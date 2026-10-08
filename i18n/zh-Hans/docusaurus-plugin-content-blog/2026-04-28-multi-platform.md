---
title: "随时随地访问 — Web、桌面、CLI 全平台覆盖"
description: UnDercontrol 提供四种官方客户端 — Web、Electron 桌面端、CLI、Chrome 扩展 — 共享同一个可自部署的数据源。开放 API，构建你自己的客户端。
authors: [lintao]
tags: [feature, platform, self-hosted]
date: 2026-04-28
---

在选择生产力工具时，一个常见的困境是：Web 端功能强大但离线无法使用，桌面端体验好但数据被锁在本地，CLI 工具对开发者友好但缺少可视化界面。问题的本质是缺少一个统一的数据真实来源（Single Source of Truth）——每个平台各自为政，数据散落在不同角落。UnDercontrol 的答案是：四种形态，一个数据源。而这个数据源完全由你掌控——支持自部署，数据存储在你自己的服务器或本地磁盘，不经过任何第三方，隐私与安全由你自己定义。

![Single Source of Truth 架构](https://dl.udctl.com/features/blog/multi-platform/slide-sst.png)

<!-- truncate -->

### Web 应用 — 远程访问，零安装

UnDercontrol 的 Web 端基于 Vite + React + TypeScript 构建，是整个平台的基础界面。打开浏览器即可访问，无需安装任何软件。

核心能力：
- 完整的任务、预算、支出管理
- Tiptap 富文本编辑器（代码块、Mermaid 图表、表格、清单）
- AI 聊天集成（支持 Claude、OpenAI 等多种 Provider）
- SSE 实时通知，多标签页同步更新
- 响应式设计，移动端同样可用
- 中英双语界面

Web 端同时也是 Electron 桌面端的渲染层——同一套代码，零重复。

**典型场景**
- 出门在外，用手机浏览器快速查看任务进展、审批支出
- 团队成员无需安装任何软件，打开链接即可协作
- 作为所有客户端的数据汇聚点——CLI 推送的文档、桌面端创建的任务、扩展剪藏的网页，全部在 Web 端统一查看和管理

![UnDercontrol Web 应用 Dashboard](https://dl.udctl.com/features/blog/multi-platform/web-app-dashboard.png)

### Electron 桌面端 — 离线优先，本地数据

桌面端不仅仅是把 Web 应用套了一层壳。它内嵌了完整的 Go 后端和 SQLite 数据库，开箱即用，无需配置服务器。

**内嵌后端架构**
- 应用启动时自动拉起 Go 后端进程
- 动态端口分配，避免冲突
- 数据存储在 `~/Library/Application Support/UnDercontrol/`（macOS）
- 完全离线可用——断网也不影响使用

**远程后端模式**
- 桌面端同样支持配置连接远程服务器，与 Web 端共享同一个数据源
- 在设置中切换 API 地址即可，无需重装

**Daemon 模式**
- 后台守护进程，通过 SSE 监听任务队列
- 接收并自动执行远程派发的任务——非常适合与 AI Agent 配合使用

**桌面专属功能**
- 系统托盘（Windows）— 最小化到托盘，快速访问
- `.md` 文件关联 — 双击 Markdown 文件直接在 UnDercontrol 中打开
- 多窗口编辑 — 同时打开多个编辑器窗口、任务窗口、便签窗口
- 工作区管理 — 本地终端窗口，执行命令

**构建目标**
- macOS — DMG 安装包，Universal Binary（x64 + ARM64）
- Windows — NSIS 安装包（x64）
- Linux — AppImage（x64）

**典型场景**
- 飞机上、高铁上没有网络，照常创建任务、编辑文档，联网后自动同步
- 在家用桌面端连接公司服务器，和 Web 端看到的数据完全一致
- 通过 Daemon 接收远程派发的 AI 任务，本地机器自动执行

![UnDercontrol 任务详情页](https://dl.udctl.com/features/blog/multi-platform/web-app-task-detail.png)

### CLI 工具 — kubectl 风格，AI Agent 友好

`ud` CLI 是为开发者和自动化场景设计的终端工具，采用 kubectl 风格的动词-资源命令体系。

**交互式 TUI**

直接运行 `ud` 进入全屏 TUI 界面，用键盘浏览和管理任务。

![多平台架构 — Single Source of Truth](https://dl.udctl.com/features/blog/multi-platform/slide-sst.png)

**一行命令完成操作**

```bash
ud get task                          # 列出任务
ud describe task abc123              # 查看详情
ud apply -f task.md                  # 从文件创建/更新
ud task query "status:todo tag:api"  # 查询过滤
ud task nl "上周完成的任务"            # 自然语言查询
```

**AI Agent 集成**

`ud prompt <skill-name>` 输出技能文档，让 AI Agent（Claude Code、Codex、OpenCode 等）学会使用 ud CLI 操作任务。结构化的命令输出和 Markdown 格式的输入，天然适合 AI Agent 读写。

**典型场景**
- CI/CD Pipeline 中自动将发布说明推送到 ud，团队在 Web 端直接查看，不用翻 Git log
- 代码仓库里的技术文档（架构设计、API 规范、运维手册）通过脚本同步到 ud，非开发人员也能在 Web 端阅读，不用访问代码仓库
- AI Agent 在编码过程中自动将进度、决策记录写入任务笔记，团队实时可见
- 运维脚本定期采集巡检结果，`ud apply` 写入任务，形成可追溯的运维日志

### Chrome 扩展 — 一键剪藏

Chrome 扩展让你把任何网页变成 UnDercontrol 中的任务。

- **一键保存** — 捕获完整网页快照（HTML + 所有嵌入资源）
- **Markdown 提取** — 自动提取页面正文为干净的 Markdown
- **离线模式** — 无需登录，直接保存到本地磁盘
- **远程模式** — 登录后直接创建为 UnDercontrol 任务，快照作为附件上传

**典型场景**
- 调研竞品时，一键保存产品页面为任务，稍后在 Web 端整理对比
- 看到一篇技术文章，剪藏为 Markdown 存入 ud，团队共享阅读
- 收到客户反馈的网页截图，直接剪藏为 Bug 任务，附带完整上下文

### SSE 实时同步

所有连接到同一后端的客户端——无论是 Web 标签页、桌面应用还是另一台设备——通过 SSE（Server-Sent Events）实时同步。

- 任务状态变更、新评论、附件上传，所有事件实时推送
- Daemon SSE Hub 专门用于向桌面端 Daemon 派发命令
- 工作区会话状态在桌面端和后端之间自动协调

![四种官方客户端](https://dl.udctl.com/features/blog/multi-platform/slide-clients.png)

### 同一套代码，一致的体验

UnDercontrol 的多平台策略不是"每个平台写一套"，而是：

- **Web 应用**是唯一的前端代码库
- **Electron** 直接加载 Web 构建产物，零代码重复
- **CLI** 共享同一套 API 和数据模型
- **Chrome 扩展**使用相同的 API 端点

| 能力 | Web | 桌面端 | CLI | 扩展 |
|------|-----|--------|-----|------|
| 远程 API 访问 | ✅ | ✅ | ✅ | ✅ |
| 内嵌后端 | ❌ | ✅（可切换远程） | ❌ | ❌ |
| 离线模式 | ❌ | ✅ | ❌ | ✅ |
| 系统托盘 | ❌ | ✅ | ❌ | ❌ |
| TUI 界面 | ❌ | ❌ | ✅ | ❌ |
| 后台 Daemon | ❌ | ✅ | ❌ | ❌ |
| 网页剪藏 | ❌ | ❌ | ❌ | ✅ |
| 实时 SSE | ✅ | ✅ | ❌ | ❌ |
| AI Agent 友好 | ✅ | ✅ | ✅ | ❌ |

![能力对比表](https://dl.udctl.com/features/blog/multi-platform/slide-capabilities.png)

不止于此——开放的 API 让你构建任何你想要的客户端。

### 更多可能 — 自定义客户端

四种官方客户端之外，UnDercontrol 开放了完整的 RESTful API。在个人设置中生成 API Key，配合 Swagger 文档，你可以用任何语言构建自己的客户端——Python 脚本、自动化 Bot、内部工具集成，甚至是你自己的移动端 App。

- **API Key 认证** — 在 Profile → API Key 中生成，Bearer Token 方式调用
- **权限范围可控** — 按模块（任务、支出、预算、文件、AI）独立授权
- **Swagger 文档** — `https://your-server/swagger/index.html` 查看所有端点
- **X-UD-Channel 审计** — 自定义 Channel 标识，追踪每个请求来源
- **CI/CD 友好** — 环境变量配置，无缝接入自动化流水线

![构建自定义客户端](https://dl.udctl.com/features/blog/multi-platform/slide-custom.png)

**典型场景**
- 用 Python 写一个 Slack Bot，团队在 Slack 中 `/task` 即可创建和查询 ud 任务
- 内部管理后台通过 API 将工单系统与 ud 打通，双向同步状态
- 移动端原生 App 调用相同 API，实现手机端的个性化体验
- 监控系统告警自动创建 ud 任务，附带上下文信息，值班人员在 Web 端处理

---

不同的场景，选择最适合的工具形态——数据始终同步，体验始终一致。
