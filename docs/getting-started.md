---
sidebar_position: 0.5
title: Getting Started
description: From zero to your first card and your first agent job in udctl — pick where it runs, sign in, create a card, install the ud CLI, and hand a task to your AI agent.
---

# Getting Started

This page takes you from nothing to a working udctl: a running server, a signed-in
account, your first card, the `ud` CLI, and a first job done by your own AI agent.
Each step names what you should see when it worked.

## 1. Pick where udctl runs

udctl always talks to a server. Pick one of three:

| Option | Best for | What you get |
| --- | --- | --- |
| **A. Desktop app** | One person on a Mac, Windows or Linux machine | The app carries its own backend and signs you in on first launch. Agents run on this machine. |
| **B. Docker** | Your own server, NAS or VPS, or a machine without a desktop | One container with the web app and backend, opened in a browser. |
| **C. Try in the browser** | A quick look before installing anything | [app.udctl.com](https://app.udctl.com), backed by a **test server** we run. Do not keep real work there. |

### Option A: desktop app

1. Download the installer for your platform from the [Download page](/download).
2. Open it. The app starts its own backend on `http://localhost:24816` and signs you in;
   there is no account to create.
3. Your sign-in password is generated per install. You only need it to sign in from
   somewhere else (a browser, the CLI on another machine); it is shown under
   **Profile → Password**.

Continue with [step 2](#2-the-first-run-wizard).

### Option B: Docker

Needs Docker on the machine. Generate a secret once and keep it for the life of the
instance (it also encrypts stored settings, see
[Set JWT_SECRET before the first start](./self-deployment.md#jwt-secret)):

```bash
openssl rand -base64 48
```

Start the container, pasting that value as `JWT_SECRET`:

```bash
docker run -d --name undercontrol \
  -p 3000:8080 \
  -e HOST_DOMAIN=http://localhost:3000 \
  -e JWT_SECRET=<paste-the-value-here> \
  -v undercontrol-data:/app/data \
  lintao0o0/undercontrol:latest
```

Check that it is ready:

```bash
docker logs undercontrol
```

The log ends with a ready banner that says where to go and how to sign in:

```text
  UnDercontrol 0.163.0-020cec4 is ready

  --> Open http://localhost:3000 to get started

      Login as:  personal@undercontrol.local
                 default password: personal123 (set PERSONAL_TIER_PASSWORD to change it)
```

Open `http://localhost:3000`, click **Log in**, and sign in with the email and password
from the banner. If the container exits instead, the same log shows a
`STARTUP FAILED` block naming what to fix. Port 3000 taken? Change both `-p 3000:8080`
and `HOST_DOMAIN` to another port.

Other ways to run your own server (npm, Homebrew, Kubernetes, PostgreSQL, S3) are in
the [Self-Deployment Guide](./self-deployment.md).

### Option C: try in the browser

Open [app.udctl.com](https://app.udctl.com). The sign-in page offers
**Visitor (No signup)** to look around, and **Register here** for an account on the
test server. Data there is for trying the product only.

## 2. The first-run wizard

After the first sign-in a short wizard opens with three steps:

1. **Language**: English or Chinese.
2. **Machine**: explains that agents run on a machine of your own, links the desktop
   app, and has a **Paste to your agent** box with setup instructions for your AI
   agent. [Steps 4 and 5](#4-install-the-ud-cli-and-sign-in) below do the same by hand.
3. **Alfred**: your resident assistant, who hands work to agents. He needs a machine
   to run on (the desktop app, or the `ud` daemon), so on a plain server you can skip
   this step for now.

Every step can be skipped; **Finish** closes the wizard. You land on the task explorer
with a **Welcome to UnDercontrol!** card already in it.

## 3. Create your first card

1. Open **Kanban** in the left sidebar.
2. Click **Add task** at the bottom of a column.
3. Type a title, for example `My first card`, and click **Create Task**.

The card appears on the board right away. Cards hold markdown, so the same card can be a
to-do, a document or a meeting note.

## 4. Install the ud CLI and sign in

`ud` is the command-line client. Your AI agent uses it too, so set it up even if you
prefer the web app. It needs Node.js 18 or newer:

```bash
npm install -g @oatnil/ud
ud --version
```

Sign in, using the address of your server from step 1:

```bash
ud login --api-url http://localhost:3000 -n personal
```

It asks for your email and password. Replace the URL with yours:

| You picked | `--api-url` |
| --- | --- |
| Docker (Option B) | `http://localhost:3000`, or the address you gave in `HOST_DOMAIN` |
| Test server (Option C) | `https://api.oatnil.com` (register at app.udctl.com first) |
| Desktop app (Option A) | Usually not needed: the app installs the CLI and signs it in for you (context `personal`) the first time you open a workspace. By hand, it is `http://localhost:24816` with the password from **Profile → Password**. |

Check who you are and list your cards:

```bash
ud whoami
ud get task
```

You should see the cards from step 3. Create one from the terminal:

```bash
cat <<'EOF' | ud apply -f -
---
title: Try the ud CLI
---
Created from the terminal.
EOF
```

`ud get task` now lists it, and it shows up in the web app too. More commands:
[CLI Reference](./cli.md).

## 5. Hand your first job to an agent

udctl works with the AI coding agent you already use (Claude Code, Codex, Cursor and
others): the agent reads and writes your cards through `ud`.

First give the agent the `ud` instructions, in the project folder you open it in. For
Claude Code:

```bash
mkdir -p .claude/skills/ud-cli
{ printf -- '---\nname: ud-cli\ndescription: Manage tasks and record progress via notes using the ud CLI.\n---\n\n'; ud describe skill ud-cli -o content; } > .claude/skills/ud-cli/SKILL.md
```

Other agents load instructions from other paths (`AGENTS.md`, `.cursor/rules/`, and so
on); `ud config onboarding` lists them.

Then start the agent in that folder and ask for something real, for example:

```text
Use the ud CLI to look at my tasks, then create a card titled "Plan my week"
with a three-item checklist in its body. Tell me the new card's id.
```

The agent runs `ud get task`, creates the card with `ud apply`, and reports its id. The
card is in the web app straight away.

## Where to go next

- [AI agent integration](./cli-ai-integration.md): what agents can do with `ud`.
- [Cookbook](./cookbook/index.md): short recipes for common jobs.
- [Query Syntax](./query-syntax.md) and [Saved Queries](./saved-queries.md): find and
  organise cards.
- [Self-Deployment Guide](./self-deployment.md) and the
  [Configuration reference](/configuration): run your own server for real.
- [Download](./download.md): every app and channel in one list.
