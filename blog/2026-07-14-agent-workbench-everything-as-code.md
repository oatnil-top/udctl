---
title: "AI Doesn't Just Work Inside UnDercontrol — It Runs UnDercontrol Itself"
description: "The agent-workbench trend stops at the execution layer. UnDercontrol closes the gap with Everything as Code — tasks, boards, and skills are all Markdown + CLI, so one agent is both a worker and an admin that operates the platform itself."
authors: [lintao]
tags: [feature, agents]
date: 2026-07-14
image: https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-hero.png
---

The "agent workbench" idea is heating up. More and more people agree: an AI agent should act like a teammate — pick up tasks, report progress, leave durable output — not just answer questions in a chat box.

But there's a further question that rarely gets asked: **can the AI operate the platform itself?** Not just do work inside the system, but *run* it for you — tidy up boards, archive stale tasks, maintain tags, distill hard-won steps into a reusable capability.

![Not just a worker — an operator of the platform itself](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-hero.png)

<!-- truncate -->

UnDercontrol's answer comes from its core idea: **Everything as Code**. Because of it, AI here is both a teammate that does the work and an admin that keeps the system in order.

### The core: Everything as Code — the platform is the AI's control surface

In UnDercontrol, tasks, notes, boards, skills, custom fields — **all of it is plain Markdown + YAML frontmatter**, managed declaratively through one kubectl-style `ud` CLI:

```bash
# Creating or updating a task is just applying some text
cat <<'EOF' | ud apply -f -
---
title: Ship v1
status: in-progress
tags: [release, urgent]
metadata:
  priority: high
---
Pre-release checklist…
EOF
```

![Everything as Code — tasks, boards, skills, metadata are all Markdown + one CLI](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-eoc.png)

Here's the key: **the same abilities an AI agent uses to read and write code — run commands, read and write text — work unchanged on the whole platform.** It can create tasks, break out subtasks, change statuses, apply tags, build boards (a board is just a saved query), distill a repeated prompt into a new Skill, patch custom fields… Those management actions are themselves code.

In short: the AI isn't only a **worker** inside the platform — it can also be an **admin**, because managing the platform is itself programmable.

![An Engineering board — columns are saved queries the agent can build and reshape](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/app-board.png)

**Typical scenarios**

- "Archive everything marked done this week, then spin up a new board filtered by the `release` tag" — the agent just does it with `ud apply` / `ud patch`, no clicking around.
- "Save the debugging steps you just walked through as a Skill" — the agent turns the method from the conversation into a reusable Skill with `ud apply`, and the whole team can use it next time.

### Breaking it down: the UnDercontrol agent workbench

**Agents as teammates.** Write a requirement as a task, @mention an agent, and it claims the task, reads the description, notes, and links as context, writes code, runs tests, commits, and writes progress back into the notes. What it picks up isn't a black-box issue — it's **structured Markdown it can also edit itself**.

![Task detail — the agent reads the description and writes progress + commits back into the notes timeline](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/app-task.png)

**Daemon / runtime.** The agent runs on your own dev machine — a background **daemon** stays connected over SSE and streams the terminal output back in real time. This remote workspace has been in the works since April 2026; today daemon registration, SSE, multi-surface triggering, and session viewing are all in place — you can start and monitor from the web, the desktop app, the CLI, even your phone.

**Reusable skills.** A Skill is a reusable prompt template stored on the server and injected into any agent via `ud prompt`. And because everything is code, **an agent can write and revise Skills itself with `ud apply`** — the skill library is a programmable asset that compounds over time.

**Not tied to any one agent.** UnDercontrol is agent-agnostic: an Agent CLI command template plugs in Claude Code, Codex, Cursor, Hermes, or any terminal-based agent. Whichever you pick, it drives the same [AI agent CLI](/docs/cli-ai-integration/) — so you can swap models or tools without swapping workbenches.

**You own your data.** Tasks and notes are plain Markdown files with YAML frontmatter, defined by an open [JSON Schema](https://github.com/oatnil-top/ud-schemas) (MIT) — version them with Git, export anytime, and self-host (Docker Compose / K8s, SQLite / Postgres).

> **Not just tasks**: this Markdown editor and the everything-as-code foundation run through every surface of UnDercontrol — tasks, notes, even expenses and resources. The agent workbench isn't a separate module; it's a capability that grows out of that foundation.

### Why "AI can operate the platform itself" matters

In most tools, AI handles the **execution layer** (write code, run tests), while the **management layer** — tidying boards, archiving old tasks, maintaining a tag system, distilling experience into SOPs — still sits on humans.

When the platform itself is code, that line disappears: AI can share both execution and management. Your knowledge base is both **content** and a **programmable control surface**. You gain a teammate who does the work — and an admin who keeps the system in order.

![Most tools stop at execution; here AI shares the management layer too](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-layers.png)

### Wrapping up

The heart of an "agent workbench" is letting AI do the work reliably, leave durable output, and be directed. UnDercontrol goes one step further — via **Everything as Code**, it lets AI operate the platform itself:

- Tasks, boards, skills, and metadata are all plain Markdown + CLI-manageable code;
- so the same agent can both **work inside the platform** (write code, report progress) and **operate the platform itself** (build boards, archive, write Skills, maintain structure);
- all of it agent-agnostic, triggerable from any device, with your data your own.

In UnDercontrol, AI is both a teammate and an admin.

![Everything as Code — so AI can run the platform, not just work in it](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-cta.png)
