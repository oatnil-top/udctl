---
title: udctl vs Beads
description: Beads and udctl both give AI coding agents task data they can read and write, from different starting points.
---

{/* English text from ud note 48f1b63c on card bb621041 (master-approved 2026-10-12, card 85ecfe87); zh twin in i18n/zh-Hans/docusaurus-plugin-content-pages/compare/. Fix wording on the card, not here. */}

# udctl vs Beads

Beads and udctl both give AI coding agents task data they can read and write, from different starting points. Beads keeps the issue database inside the code repository as long-term memory for the agent. udctl is a self-hosted server where people and agents work on the same tasks, boards and notes.

udctl (UnDercontrol) is a self-hostable workspace for tasks, notes and expenses, with a kubectl-style CLI (`ud`) and AI coding agents you dispatch from a task comment.

## Facts side by side

| | Beads | udctl |
|---|---|---|
| Form | Command line `bd`; the README lists no built-in web UI, community UIs exist | Command line `ud`, plus web, desktop and iOS apps |
| Where data lives | A `.beads/` directory in the repository, stored in Dolt (a version-controlled SQL database) | On the server you deploy |
| Several machines and people | Sync through a git remote with `bd dolt push` / `bd dolt pull`; an experimental HTTP backend, `bd serve`; server mode supports multiple concurrent writers | Every client talks to the same server; tasks are shared with groups that have admin and member roles |
| How AI coding agents connect | `bd setup` writes integrations for Claude Code, Codex CLI, Cursor and others; the agent runs `bd create`, `bd ready`, `bd close` and so on | Agents call `ud` commands to read and write tasks. You can also @mention an agent in a task comment: the desktop app or `ud daemon` opens a terminal on your machine and starts Claude Code, Codex, OpenCode or another agent on that task |
| Beyond tasks | Dependencies (`bd dep add`), memories (`bd remember`) | Notes, expenses, accounts and budgets through the same CLI |
| License and price | MIT, open source, free | Proprietary; free for individuals and teams of up to 3, larger teams pay by team size |

## Which one

- If the tasks belong to one repository, you want them versioned with the code, they are mainly for the agent itself, and you don't want to run a server, pick Beads.
- If tasks span several repositories or live outside any repository, teammates need to see boards and comment from the web or a phone, and you want to hand a task to an agent from a comment, pick udctl.

## Sources
- Beads README and license field: https://github.com/steveyegge/beads (MIT; Dolt storage; `bd` commands; `bd dolt push/pull`; `bd serve` labeled experimental; agents supported by `bd setup`)
