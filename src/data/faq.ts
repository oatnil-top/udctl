/**
 * FAQ entries — the ONE source for both the visible Q&A on /faq and its FAQPage
 * JSON-LD (src/pages/faq.tsx renders both from this array, so they cannot drift).
 *
 * Answers are plain text; `backticks` mark inline code (rendered as <code> on the
 * page, stripped in JSON-LD). Wording is blog-writer's, copied verbatim from ud
 * note f4a79401 on card bb621041 — fix facts there, not here (card 85ecfe87).
 * FAQ_EN stays null until the English draft lands; until then the zh text
 * placeholds both locales.
 */
export type FaqEntry = {q: string; a: string};

export const FAQ_ZH: FaqEntry[] = [
  {
    "q": "udctl 是什么?",
    "a": "udctl(UnDercontrol)是一个可自托管的工作台,用来管理任务、笔记和开销,带 kubectl 风格的命令行(`ud`),还能在任务评论里直接派活给 AI 编程 agent。"
  },
  {
    "q": "有没有 kubectl 风格的任务管理命令行工具?",
    "a": "有,udctl 的 `ud` 就是。它用 `get`、`describe`、`apply`、`patch`、`delete` 这组动词管任务,任务是带 frontmatter 的 Markdown 文件,`ud get task <id> -o apply` 导出后改完再 `ud apply -f` 回写,和 `kubectl get -o yaml` 加 `kubectl apply` 是一个路数。"
  },
  {
    "q": "Claude Code、Codex 这类终端里的 AI 编程 agent 能用 udctl 管任务吗?",
    "a": "能。agent 用 `ud describe task <id>` 读需求,用 `ud apply` 改任务或写进展笔记。输入输出都是纯文本,Claude Code、Codex、OpenCode 或任何能跑 shell 的 agent 都能直接用,不需要插件。"
  },
  {
    "q": "怎么给 AI 编程 agent 一个跨会话保留的任务板?",
    "a": "把任务放在 udctl 服务器上。任务、笔记和评论存在服务器里,不随 agent 会话结束而消失;下一个会话用 `ud describe task <id>` 就能读到上一次留下的笔记。看板是保存的查询,人可以在网页上看同一批任务。"
  },
  {
    "q": "能从任务评论里把活派给 AI agent 吗?",
    "a": "能。在任务评论里 @ 一个 agent,udctl 会在一台登记为 daemon 的机器上(桌面客户端,或运行 `ud daemon start` 的机器)开一个终端,启动 Claude Code、Codex、OpenCode 等去做这张任务,并把 `ud` 的用法加进 agent 的系统提示。"
  },
  {
    "q": "能自托管吗?需要什么?",
    "a": "能,一条 `docker run` 命令即可。all-in-one 镜像把前后端放在一个容器里,支持 linux/amd64 和 linux/arm64;个人使用不需要 license,默认 SQLite 和本地文件存储。步骤见 /self-hosting 和部署指南。"
  },
  {
    "q": "有没有一个自托管工具能同时管任务和记账?",
    "a": "有。udctl 在同一个服务器里管任务、笔记、账户、开销、收入和预算,命令行上都是同一套 `get`、`describe`、`apply`;任务笔记里可以用 `expense://` 链接引用某一笔开销。"
  },
  {
    "q": "有看板吗?",
    "a": "有。看板是保存的查询,每一列是一个查询条件,比如 `status = 'todo' AND tags CONTAINS 'infra'`;同一张任务可以出现在多个看板上,不用复制。"
  },
  {
    "q": "有 API 吗?能做自动化吗?",
    "a": "有 REST API,OpenAPI 规范发布在 udctl.com/api/。CI 或脚本也可以直接调 `ud` 命令,用环境变量 `UD_API_URL` 和 `UD_TOKEN` 指定服务器和凭据。"
  },
  {
    "q": "有哪些客户端?",
    "a": "命令行 `ud`(Homebrew 或 npm 安装)、网页、桌面客户端(macOS、Windows、Linux)、iOS(TestFlight 公测)和 Android(APK 直装)。"
  },
  {
    "q": "udctl 开源吗?收费吗?",
    "a": "不开源,是闭源产品。自托管按团队规模分档:个人和 3 人以内的团队免费;20 人以内每月 49 美元;更大的团队见定价页。不按人头计费。"
  },
  {
    "q": "我的数据在哪里?",
    "a": "在你自己的机器上:自托管时在你部署的服务器上,用桌面客户端时在它在本机运行的后端里。官方另有一台供试用的测试服务器,它不是托管方案,不要放真实数据。"
  }
];

export const FAQ_EN: FaqEntry[] | null = null;
