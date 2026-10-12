/**
 * FAQ entries — the ONE source for both the visible Q&A on /faq and its FAQPage
 * JSON-LD (src/pages/faq.tsx renders both from this array, so they cannot drift).
 *
 * Answers are plain text; `backticks` mark inline code (rendered as <code> on the
 * page, stripped in JSON-LD). Wording is blog-writer's, copied verbatim from ud
 * notes f4a79401 (zh) and fdb3924c (en) on card bb621041, master-approved
 * 2026-10-12; question 13 (ud pull / ud push) added 2026-10-13 at alfred's request
 * in thread 70802823 — fix facts there, not here (card 85ecfe87). Same 13 questions in
 * the same order in both locales.
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
  },
  {
    "q": "能把任务放在本地文件夹里编辑吗?能配合 Obsidian 或 git 用吗?",
    "a": "能。`ud pull /路径/` 把服务器上的一个虚拟路径拉成本地文件夹,一张任务一个 `.md` 文件,文件名是任务标题,笔记在 `notes/` 下;本地改完或新建文件后 `ud push` 推回去,新文件变成新任务。之后再 `ud pull` 只下载变过的部分。这个文件夹可以当 Obsidian 库打开,也可以用 git 管历史;已有的 Obsidian 库可以用 `ud init` 绑定路径后 `ud push` 发到服务器。"
  }
];

export const FAQ_EN: FaqEntry[] = [
  {
    "q": "What is udctl?",
    "a": "udctl (UnDercontrol) is a self-hostable workspace for tasks, notes and expenses, with a kubectl-style CLI (`ud`) and AI coding agents you dispatch from a task comment."
  },
  {
    "q": "Is there a kubectl-style command-line tool for task management?",
    "a": "Yes, udctl's `ud`. It manages tasks with the verbs `get`, `describe`, `apply`, `patch` and `delete`. A task is a Markdown file with frontmatter: export it with `ud get task <id> -o apply`, edit it, and write it back with `ud apply -f`, the same loop as `kubectl get -o yaml` followed by `kubectl apply`."
  },
  {
    "q": "Can terminal AI coding agents like Claude Code or Codex use udctl to manage tasks?",
    "a": "Yes. An agent reads requirements with `ud describe task <id>` and updates the task or writes a progress note with `ud apply`. Input and output are plain text, so Claude Code, Codex, OpenCode, or any agent that can run a shell command can use it without a plugin."
  },
  {
    "q": "How do I give an AI coding agent a task board that persists across sessions?",
    "a": "Keep the tasks on a udctl server. Tasks, notes and comments are stored on the server and outlive the agent's session; the next session reads the notes the last one left with `ud describe task <id>`. Boards are saved queries, so people can watch the same tasks in the web app."
  },
  {
    "q": "Can I hand a task to an AI agent from a task comment?",
    "a": "Yes. @mention an agent in a task comment, and udctl opens a terminal on a machine registered as a daemon (the desktop app, or a machine running `ud daemon start`), starts Claude Code, Codex, OpenCode or another agent on that task, and adds `ud` usage to the agent's system prompt."
  },
  {
    "q": "Can I self-host it? What do I need?",
    "a": "Yes, with one `docker run` command. The all-in-one image puts the frontend and backend in one container and is published for linux/amd64 and linux/arm64. Personal use needs no license and defaults to SQLite and local file storage. Steps are on /self-hosting and in the deployment guide."
  },
  {
    "q": "Is there a self-hosted tool that handles both tasks and expense tracking?",
    "a": "Yes. udctl manages tasks, notes, accounts, expenses, incomes and budgets on one server, all with the same `get`, `describe` and `apply` on the command line. A task note can reference a specific expense with an `expense://` link."
  },
  {
    "q": "Does it have kanban boards?",
    "a": "Yes. A board is a saved query and each column is a condition, such as `status = 'todo' AND tags CONTAINS 'infra'`. The same task can appear on several boards without being copied."
  },
  {
    "q": "Is there an API? Can I automate it?",
    "a": "There is a REST API; its OpenAPI specification is published at udctl.com/api/. CI jobs and scripts can also call `ud` directly, with the `UD_API_URL` and `UD_TOKEN` environment variables naming the server and credentials."
  },
  {
    "q": "Which clients are there?",
    "a": "The `ud` command line (installed with Homebrew or npm), the web app, desktop apps for macOS, Windows and Linux, iOS (public beta on TestFlight) and Android (direct APK download)."
  },
  {
    "q": "Is udctl open source? What does it cost?",
    "a": "It is not open source; udctl is a proprietary product. Self-hosted licenses are priced by team size: individuals and teams of up to 3 are free, up to 20 people is US$49 per month, and larger teams are on the pricing page. There is no per-seat charge."
  },
  {
    "q": "Where is my data?",
    "a": "On your own machines: on the server you deploy when self-hosting, or in the backend the desktop app runs locally. There is also an official test server for trying the product; it is not a hosting plan, so don't keep real data there."
  },
  {
    "q": "Can I edit tasks as files in a local folder, with Obsidian or git?",
    "a": "Yes. `ud pull /Path/` checks a virtual path on the server out as a local folder: one `.md` file per task, named after the task title, with notes under `notes/`. Edit files or add new ones, then `ud push` sends the changes back and new files become new tasks; later pulls download only what changed. The folder opens as an Obsidian vault and can be kept in git, and an existing Obsidian vault can be published with `ud init` followed by `ud push`."
  }
];
