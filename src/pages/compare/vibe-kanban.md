---
title: udctl vs Vibe Kanban
description: Vibe Kanban and udctl both put a kanban board next to AI coding agents.
---

{/* English text from ud note f29b5dad on card bb621041 (master-approved 2026-10-12, card 85ecfe87); zh twin in i18n/zh-Hans/docusaurus-plugin-content-pages/compare/. Fix wording on the card, not here. */}

# udctl vs Vibe Kanban

Vibe Kanban and udctl both put a kanban board next to AI coding agents. Vibe Kanban is a web app that runs on your machine and gives each agent workspace its own git worktree and branch. udctl is a self-hosted server whose tasks, comments and boards are the same data in the web, desktop, iOS and command-line clients.

udctl (UnDercontrol) is a self-hostable workspace for tasks, notes and expenses, with a kubectl-style CLI (`ud`) and AI coding agents you dispatch from a task comment.

## Project status

bloop, the company behind Vibe Kanban, announced its shutdown on 2026-04-10. The hosted remote services stayed up for 30 days and were then retired, removing remote kanban issues, comments, projects and organisations; local workspaces keep working. The project continues as community-maintained open source, and its GitHub repository had commits as recently as 2026-09-19.

## Facts side by side

| | Vibe Kanban | udctl |
|---|---|---|
| Form | Started with `npx vibe-kanban`; a local backend plus web UI, with the backend listening on 127.0.0.1 by default | Command line `ud`, plus web, desktop and iOS apps |
| Where data lives | Your machine; per the announcement, hosted remote services were retired after 30 days | On the server you deploy |
| Remote use | The README covers deploying remotely over SSH with a tunnel for the web UI, and a guide to self-hosting a Cloud instance | The server is remote by design; every client connects to it |
| Several people | The README mentions planning "either privately or with your team" and assigning issues on a board; it does not describe accounts or permissions | Tasks are shared with groups that have admin and member roles |
| How AI coding agents connect | Supports Claude Code, Codex, Gemini CLI, GitHub Copilot, Amp, Cursor, OpenCode, Droid, CCR and Qwen Code; one git worktree and branch per workspace; includes an MCP server | Agents call `ud` commands to read and write tasks. You can also @mention an agent in a task comment: the desktop app or `ud daemon` opens a terminal on your machine and starts Claude Code, Codex, OpenCode or another agent on that task |
| Beyond tasks | Not listed in the README | Notes, expenses, accounts and budgets through the same CLI |
| License and price | Apache-2.0, open source, free | Proprietary; free for individuals and teams of up to 3, larger teams pay by team size |

## Which one

- If you run several agents in parallel on your own machine, want each task isolated in its own worktree and branch, and are fine with a community-maintained pace, pick Vibe Kanban.
- If you need an always-on server shared by several people, boards and comments you can read on a phone, and notes and expenses next to your tasks, pick udctl. Teams that relied on Vibe Kanban's remote boards can deploy udctl on their own machine to cover that part.

## Sources
- Vibe Kanban README and license field: https://github.com/BloopAI/vibe-kanban (npx launch; HOST defaults to 127.0.0.1; supported agents; worktrees; MCP; SSH remote and self-hosting guide; Apache-2.0; "Vibe Kanban is sunsetting")
- Shutdown announcement, 2026-04-10: https://www.vibekanban.com/blog/shutdown
- Latest push: GitHub API pushed_at = 2026-09-19T06:52:48Z
