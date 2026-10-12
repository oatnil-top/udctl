---
title: udctl vs Taskwarrior + Vikunja
description: People who want tasks on the command line and a kanban board on the web often pair Taskwarrior for the terminal with Vikunja for the browser. udctl provides both from one server.
---

{/* English text from ud note b1ece8c0 on card bb621041 (master-approved 2026-10-12, card 85ecfe87); zh twin in i18n/zh-Hans/docusaurus-plugin-content-pages/compare/. Fix wording on the card, not here. */}

# udctl vs Taskwarrior + Vikunja

People who want tasks on the command line and a kanban board on the web often pair Taskwarrior for the terminal with Vikunja for the browser. udctl provides both from one server.

udctl (UnDercontrol) is a self-hostable workspace for tasks, notes and expenses, with a kubectl-style CLI (`ud`) and AI coding agents you dispatch from a task comment.

## Facts side by side

| | Taskwarrior 3 | Vikunja | udctl |
|---|---|---|---|
| Form | Command line `task` | Self-hosted web app with list, kanban, Gantt and table views; paid hosted Vikunja Cloud also offered | Command line `ud`, plus web, desktop and iOS apps |
| Command line | `task <filter> <command> <mods>`, e.g. `task 12 modify due:eom` | The bundled `vikunja` command administers the server (backups, migrations, users); the task CLI is `veans`, officially labeled experimental | `ud get / describe / apply / patch / delete` |
| Where data lives | `taskchampion.sqlite3` on your machine | The Vikunja server you deploy | The udctl server you deploy |
| Several devices and people | `task sync` to a TaskChampion sync server, AWS S3 or Google Cloud Storage; the sync server can be configured for multiple users | Multiple accounts on the server | Every client talks to the same server; shared with groups that have admin and member roles |
| How AI coding agents connect | The agent runs `task` commands | `veans` targets coding agents: `veans prime` prints a system prompt that teaches the workflow, and agents move claimed tasks to "In Review" | Agents call `ud` commands; you can also @mention an agent in a task comment to open a terminal on your machine and start Claude Code, Codex, OpenCode or another agent |
| Using both | Taskwarrior and Vikunja keep separate data | Same | Command line and web read the same data |
| License and price | MIT, open source | AGPL-3.0, open source; self-hosting is free, Cloud is paid | Proprietary; free for individuals and teams of up to 3, larger teams pay by team size |

## Which one

- Terminal only, single user, offline, open source: pick Taskwarrior.
- Web board only, with Gantt charts, open source: pick Vikunja.
- Command line and web on the same tasks, plus notes and expenses on the same server: pick udctl.

## Sources
- Taskwarrior: https://taskwarrior.org/docs/upgrade-3/ (taskchampion.sqlite3), /docs/sync/ (sync backends, multiple users), /docs/examples/ (command examples), /docs/ (MIT)
- Vikunja: https://vikunja.io/ (four views, AGPLv3, Cloud), /docs/cli/ (server administration commands), /docs/veans/ (experimental agent CLI)
