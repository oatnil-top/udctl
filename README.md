# udctl

**udctl** (UnDercontrol) is a private workspace for people and AI agents: tasks, threads and knowledge live here; so do each agent's definition, skills and scheduling across your machines; and it works just as well for one person with no agents at all. One data source; web, desktop, mobile, CLI, and chat clients on top of it.

This repository is the source of the documentation site at **https://udctl.com** (English and 简体中文). The application itself is proprietary and free for personal use; its code is not in this repository.

## Start here

| I want to… | Go to |
|---|---|
| Try it without installing anything | https://ud.oatnil.com |
| Install the desktop app (macOS, Windows, Linux), the iOS beta, the Android APK, or the Chrome web clipper | https://udctl.com/download |
| Run it on my own machine or server | https://udctl.com/self-hosting |
| Use it from the terminal | https://udctl.com/docs/cli |
| Let Claude Code, Codex, or Cursor manage my tasks | https://udctl.com/docs/cli-ai-integration |
| Read what changed in each release | https://udctl.com/docs/release-notes |

### Self-host in one command

```bash
docker run -d -p 3000:8080 \
  -e HOST_DOMAIN=http://localhost:3000 \
  -e JWT_SECRET=change-me-to-a-random-string \
  -e ADMIN_EMAIL=admin@example.com \
  -e ADMIN_PASSWORD=changeme \
  -v undercontrol-data:/app/data \
  lintao0o0/undercontrol:latest
```

Frontend and backend ship in one image (amd64 and arm64). SQLite by default, PostgreSQL optional. A free 3-month Pro trial license is on the self-hosting page, and every environment variable is documented at https://udctl.com/configuration.

### CLI

```bash
npm install -g @oatnil/ud        # or: brew tap oatnil-top/ud && brew install ud
ud login
ud get tasks
```

The CLI is `ud`. Any terminal-based coding agent can drive it with the shell access it already has; the agent-facing setup instructions live at https://udctl.com/agent-setup/prompt.md and are served as plain markdown on purpose.

## What is in the box

- **Tasks and boards.** Everything is a task: a to-do, a document, a decision record, a blog draft. Boards are saved queries over the same data, so one task can sit on several boards without copies.
- **Notes.** Long-form markdown next to the tasks it belongs to, with code blocks, Mermaid diagrams, and bi-directional links.
- **Finance.** Multi-currency accounts, expenses, budgets, monthly rollups.
- **Files.** Attach anything to a task, expense, or note; store locally or on S3-compatible storage.
- **Agent team.** Define agents, hand work to them from a task comment or from chat, and get the result written back to the task. Scheduled jobs run agents on a timer. Alfred, the Telegram butler, is one of those agents.
- **Everything as code.** Tasks, notes, agents, and skills round-trip through `ud apply` as markdown with YAML frontmatter. Schemas: https://github.com/oatnil-top/ud-schemas
- **Self-hosted.** Your data stays on hardware you control. Nothing phones home.

## Documentation map

- `docs/` is written for machines first: plain markdown, stable URLs, facts stated flatly. AI agents fetch these pages as text.
- `src/pages/` holds the pages written for people: the homepage, download, self-hosting, configuration reference, pricing.
- `blog/` is dated release and design writing; posts keep the wording of their day, including the old product name.
- `i18n/zh-Hans/` mirrors every doc page in Simplified Chinese. When you change an English page, change its mirror in the same commit.
- `static/agent-setup/prompt.md` is the onboarding prompt an agent follows to connect itself to a workspace.

## Working on this site

```bash
npm install
npm start            # http://localhost:3000, English
npm start -- --locale zh-Hans
npm run build        # builds both locales into build/
```

Docusaurus 3. Pushing to `main` deploys through Cloudflare Workers Builds, so a push is a release; run `npm run build` first. Contributions that fix a wrong fact, a broken command, or a stale screenshot are welcome as pull requests; open an issue for anything about the application itself.

## 中文

udctl（UnDercontrol）是人与 AI agent 共用的私密工作空间：任务、对话和知识都存在这里，agent 的定义、技能和跨机器的编排也在这里，一个人不用 agent 照样能用；一份数据，Web、桌面、手机、命令行和聊天软件都是它的入口。本仓库是文档站 https://udctl.com 的源码，中英双语。应用本体为闭源软件，个人使用免费。

- 在线试用：https://ud.oatnil.com
- 下载（macOS / Windows / Linux 桌面版、iOS 公测、Android APK、Chrome 网页剪藏）：https://udctl.com/zh-Hans/download
- 私有部署：https://udctl.com/zh-Hans/self-hosting
- 命令行与 AI 代理接入：https://udctl.com/zh-Hans/docs/cli 、https://udctl.com/zh-Hans/docs/cli-ai-integration

## Links

- Site: https://udctl.com (https://oatnil.com redirects here)
- Web app: https://ud.oatnil.com
- JSON Schemas: https://github.com/oatnil-top/ud-schemas
- Web clipper (Chrome): https://github.com/oatnil-top/ud-chrome-extension
- Discussions: https://github.com/oatnil-top/udctl/discussions
