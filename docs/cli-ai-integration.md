---
title: AI Agent CLI — Let Claude Code, Cursor & Codex Manage Your Tasks
description: Use the ud AI agent CLI to let Claude Code, Cursor, and Codex manage your tasks, notes, and expenses from the terminal.
sidebar_label: AI Agent CLI
sidebar_position: 6
---

# The AI Agent CLI

`ud` is the udctl command-line tool, and it is built to be driven by AI coding
agents as much as by you. It ships with **built-in skills** — self-describing command
references an agent loads on demand — so your agents can read tasks, record progress,
upload files, and close work without you hand-maintaining a prompt file.

## What is an AI agent CLI?

An AI agent CLI is a command-line tool designed to be driven by AI coding agents rather
than only by humans. It differs from an ordinary CLI in three ways: its commands are
**self-describing**, so an agent can discover how to use them at runtime instead of being
told; its output is **machine-readable**, so an agent can parse results rather than guess
at formatting; and its operations are **safe and idempotent**, so re-running a command
after an interrupted session does not corrupt state.

`ud` is one. Its commands follow a kubectl-style `verb resource` shape, it carries its own
agent-facing reference (`ud describe skill ud-cli`), and its write path is a single
declarative `ud apply` that creates or updates depending on whether an `id` is present.

## Give your AI agents a shared task board

Claude Code, Codex, Cursor, and any other terminal-based agent can all talk to the same
workspace. Instead of pasting context between chat windows, each agent reads the task,
does the work, and writes progress back where you — and the next agent — can see it.

Quickstart:

```bash
# 1. install (Node.js 18+)
npm install -g @oatnil/ud
# 2. sign in to your server or the hosted workspace
ud login
# 3. confirm you can see your tasks
ud get task
```

Then, in your agent's session, have it run:

```bash
# 4. the agent loads the full command reference itself
ud describe skill ud-cli
```

That is the whole setup. The CLI also checks the machine for you and names the exact next
command for anything still missing:

```bash
# human-readable checklist
ud config onboarding
# for agents: next_command / requires_human per check
ud config onboarding --json
```

For a from-scratch, agent-driven setup (install, sign-in, skill file), have your agent
fetch and follow [https://udctl.com/agent-setup/prompt.md](https://udctl.com/agent-setup/prompt.md) —
that page is the single source of truth for the setup flow, and this section deliberately
does not restate it.

## Built-in skills: the CLI teaches the agent itself

The CLI carries its own agent-facing reference as a built-in skill named `ud-cli`. An agent
loads the full command reference and usage patterns by running:

```bash
ud describe skill ud-cli
```

This is the mechanism `ud --help` points agents to — its footer reads:

```
AI Agents: run "ud describe skill ud-cli" to load full command reference and usage patterns.
```

Because the skill is served by the CLI/backend, it always matches your installed version —
there is nothing to regenerate when you update.

### Discovering skills

Skills are group-scoped capability definitions. List them and read any one:

```bash
# List all available skills
ud get skills

# Show a skill's full content (the prompt an agent consumes)
ud describe skill ud-cli
ud describe skill ud-pm
```

Beyond `ud-cli`, other built-in skills teach specific workflows (e.g. `ud-pm` for kanban
review, `ud-common` for everyday task queries, `spawn-workspace` for launching agent
sessions).

### Discovering recipes

For per-resource, copy-pasteable command recipes, use `ud cook`:

```bash
ud cook task
ud cook note
ud cook board
```

### What the `ud-cli` skill teaches

**Task management**
- Creating and updating tasks with `ud apply -f -` (no `id` = create, `id` = update)
- Viewing and querying tasks (`ud describe task`, `ud get task`, `ud query`)
- Marking tasks done by applying `status: done`
- Linking tasks and subtasks with `ud link task`

**Progress tracking**
- Adding notes by applying a document with `task_id` in the frontmatter
- Including commit hashes for traceability
- Documenting decisions and blockers
- Remembering task IDs across a session

**File operations**
- Uploading files with `ud upload resource`
- Attaching files to tasks
- Downloading resources via presigned URLs
- Parsing `resource://` URIs from task descriptions

**Entity lookup**
- Retrieving any entity by UUID with `ud get entity`
- Accessing presigned download URLs for file resources

## Human-in-the-loop by @mention

Agents work on their own, but you stay the review gate. Comments on a task are the channel:
**@mention an agent in a task comment and it wakes up** — udctl starts a workspace
session for it on the machine running your daemon, and the agent picks the task up with the
description, notes, and links as context.

It reports back the same way. Progress goes into the task's notes (commits included), the
conclusion goes into the comment thread, and the task moves to `pending` when the agent
considers it done — waiting for you, not auto-closing. Agents can @mention each other too,
so a lead can delegate a subtask to a member, and the delegation chain never grants an agent
broader access than you have.

Two details worth knowing: a mention only wakes an agent from a **comment** (a mention
written into a note does not), and mentions are not queued — if the target machine's daemon
is offline, the delivery is dropped rather than held.

## Example agent workflow

Here's what a typical AI-assisted development session looks like:

```
You:    "Work on task abc-123"
AI:     [runs: ud describe task abc-123]
        "I see this task is about adding user authentication.
         I'll track progress on task abc-123 for this session."

You:    "Implement it"
AI:     [implements the feature]
        [runs: cat <<'EOF' | ud apply -f -
                ---
                task_id: abc-123
                ---
                Implemented JWT auth middleware. Commit: def456
                EOF]
        "Done. I've added auth middleware and recorded progress.
         Should I mark this task as done?"

You:    "Yes, and attach the architecture diagram"
AI:     [runs: cat <<'EOF' | ud apply -f -
                ---
                id: abc-123
                status: done
                ---
                EOF]
        [runs: ud upload resource ./auth-flow.png -t todolist -e abc-123]
        "Task completed and diagram attached."
```

## Best practices

### Per-project vs global setup

**Per-project** (recommended): Put the instruction (or skill file) in your project's
`.claude/` directory so the agent only manages tasks when working in that project.

**Global**: Put it in your home directory (`~/.claude/`) to apply across all projects.

### Multi-context setup

If you use multiple ud contexts (personal/work), the agent operates on whichever context is
currently active:

```bash
# Set the work context before an AI session
ud config use-context work

# The agent now operates on your work tasks
```

You can also pin a single command to a context with the global `--context` flag, e.g.
`ud --context work get task`.

## Troubleshooting

### AI not using the CLI

**Problem:** The agent doesn't use `ud` commands.

**Solutions:**
1. Run `ud config onboarding` — it checks the sign-in, the server, and whether an
   instruction file exists, and names the next command for whatever is missing.
2. Verify the skill loads: `ud describe skill ud-cli`.

### AI using the wrong context

**Problem:** The agent operates on the wrong account/server.

**Solution:** Switch context before starting the session:

```bash
ud config use-context <correct-context>
```

### Outdated skill file

**Problem:** You saved the skill to a file and it's missing newer commands.

**Solution:** Prefer loading the skill live with `ud describe skill ud-cli`. If you keep a
file, regenerate it after CLI updates:

```bash
ud describe skill ud-cli > .claude/skills/ud-cli/SKILL.md
```

## FAQ

### Can Claude Code manage my tasks?

Yes. Install `ud` with `npm install -g @oatnil/ud`, run `ud login`, and tell Claude Code to
run `ud describe skill ud-cli` — that one command loads the full command reference into its
session. From then on it can read task descriptions, create and update tasks, write progress
notes, and attach files, all through the same terminal it already uses for your code.

### What CLI works with OpenAI Codex?

`ud` does. It is a plain command-line tool with no editor plugin and no vendor lock-in, so
any terminal-based agent — Codex, Claude Code, Cursor, OpenCode — can drive it with the
shell access it already has. udctl treats the agent CLI as configuration: you point
it at whichever command you run, and the same task board serves all of them.

### How do AI agents learn CLI commands?

Through the CLI itself, at runtime. `ud describe skill ud-cli` returns the full agent-facing
reference — commands, file formats, and usage patterns — and `ud cook <resource>` returns
copy-pasteable recipes for a single resource type. Because the reference is served by the
tool rather than copied into a prompt file, it always matches the version you have
installed, so there is nothing to regenerate after an upgrade.

### Can I run this self-hosted?

Yes. udctl is self-hostable: deploy with Docker Compose or Kubernetes, using SQLite
for a single user or PostgreSQL for a team, and point the CLI at your own server with
`ud login --api-url https://your-server`. Your tasks, notes, and files stay on infrastructure
you control. See the [Self-Deployment Guide](./self-deployment.md) for the deployment
options.
