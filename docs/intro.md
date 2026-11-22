---
sidebar_position: 1
sidebar_label: What is udctl?
title: "What is udctl? A private workspace for you and your AI agents"
description: udctl (UnDercontrol) is a self-hostable workspace for tasks, notes and expenses, with a kubectl-style CLI (ud) and AI coding agents you dispatch from a task comment.
---

# What is udctl?

udctl (UnDercontrol) is a self-hostable workspace for tasks, notes and expenses, with a kubectl-style CLI (`ud`) and AI coding agents you dispatch from a task comment. On your own hardware.

It is a private workspace that you and your AI agents share. One place holds what usually ends up split across an issue tracker like Jira, a Markdown vault like Obsidian, a personal ledger, and a console for running agents.

## What it does

| Area | What you get |
| --- | --- |
| Task management | Tasks, kanban boards, a backlog and sprints |
| Knowledge base | Markdown cards and notes, two-way links between cards, a graph view |
| AI agents | Hand a task to Claude Code, Codex or another terminal agent from a comment; the session runs on your machine |
| CLI | `ud`, a kubectl-style command for everything in the workspace |
| File sync | `ud pull` and `ud push` keep a folder of local Markdown files in step with the workspace, in both directions |
| Finance | Accounts, budgets, expenses and income, with totals kept per currency |
| Calendar | A calendar with time slots, and a Gantt view for each board |

## The `ud` CLI

The command-line tool is called `ud`, and it works the way `kubectl` does: a verb, a resource type, an id.

```bash
# List tasks
ud get tasks
# Show one task
ud describe task <id>
# Create or update a task from a file
ud apply -f task.md
# Delete a task (it goes to the recycle bin)
ud delete task <id>
```

The full command set is in the [CLI guide](./cli.md).

## Built for AI agents

Any agent that can run a shell command can use `ud`, so Claude Code, Codex and Cursor work against the same data you do:

- An agent reads a task's requirements with `ud describe task`.
- An agent updates the task's status when the work moves.
- An agent records its progress as notes on the task.
- Different agents share one set of tasks and one knowledge base.

[AI agent CLI](./cli-ai-integration.md) covers the setup, and [Workspace Terminal](./workspace-terminal.md) covers running an agent session next to the task it is working on.

## Install

```bash
# requires Node.js 18+
npm install -g @oatnil/ud
ud --help
```

The CLI runs on macOS, Linux and Windows, on x64 and arm64. Homebrew, the desktop app, the web app and the mobile apps are listed on the [download page](./download.md).

## Why we built it

We built udctl so that an AI agent keeps what a teammate keeps: the context of a task, the notes written along the way, and the progress so far. When Claude Code and Codex share tasks and record progress in one workspace, you stop re-explaining the background at the start of every session.

## Where to go next

- [Getting Started](./getting-started.md): from zero to your first card and your first agent job
- [Self-Deployment Guide](./self-deployment.md): run udctl with Docker Compose, Kubernetes or a single binary
- [How udctl compares](/compare/): [vs Beads](/compare/beads/), [vs Taskwarrior + Vikunja](/compare/taskwarrior-vikunja/), [vs Vibe Kanban](/compare/vibe-kanban/)
- [FAQ](/faq/)
