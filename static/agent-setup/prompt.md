These are official instructions from udctl to connect your AI coding agent to a
udctl workspace — tasks, documents, files and personal finance, driven from the
terminal by the `ud` CLI. Once connected you can read the user's tasks, record progress
as notes, attach files, and open follow-up work without leaving the terminal.

Start by orienting the user, then complete the rest yourself by running the commands
directly. The only command you hand to the user is `ud login` — it prompts for a
password — so wait for them to report back on that one. Never invent credentials, and
never ask the user to tell you their password.

- Orient the user and ask which server they use
- Install the ud CLI
- Run the onboarding check and follow it until it passes

---

## Orient the user

Before running anything, tell the user in a sentence or two what udctl is and what
you're about to set up — connecting their agent to a udctl workspace so you can read
and update their tasks, notes, files and finance from the terminal. Then ask the two
questions that decide how the rest goes, and wait for the answers:

1. **Which server?** udctl runs on a server the user controls, so this is the one
   thing you cannot work out on your own — ask, and use the answer everywhere below.
   - **Their own server** — the normal case. A machine or VPS they host, or the
     udctl desktop app, which runs a backend on their own machine at
     `http://localhost:8888`. Ask them for the URL. Guide:
     `https://udctl.com/self-hosting`.
   - **Or, just trying it out** — if they have no server yet, they can point at
     `https://api.oatnil.com`. Tell them plainly what it is: a **test server** we run so
     people can try udctl, not a hosting plan, so real work does not belong on it.

   Do not pick for them, and do not fall back to our test server when the answer is
   unclear — ask again instead.
2. **Do they already have an account?** On their own server, the first account is created
   when the server starts — the self-hosting guide covers it. On the test server, they sign
   up at `https://app.udctl.com`.

Once you have both answers, work through the steps below.

## Install the ud CLI

npm is the recommended channel. The Homebrew tap (`brew tap oatnil-top/ud && brew install ud`) also works; the install script is retired.

```
npm install -g @oatnil/ud
ud --version
```

If a global install is not possible, every `ud` command below also works as
`npx @oatnil/ud <command>`.

## Run the onboarding check

The CLI carries its own onboarding checklist, so these instructions don't have to —
what to configure, in what order, and the exact next command for anything missing all
come from the tool itself and always match the installed version:

```
ud config onboarding --json
```

It never prompts. Read the report and act on each check whose `state` is `"action"`:

- Run its `next_command` yourself — **unless** `requires_human` is `true`. That marks
  the step only the user can do (above all `ud login`, which prompts for their
  password): show the user that exact command, wait for them to run it and report
  back, then re-run the check. The password must never pass through you.
- The `hint` on each check carries the details — for example, which file the agent
  instruction goes in for your agent, or what to do when the server URL is wrong.
- Loop "run → act → re-run" until the command exits 0 (`"ok": true`). That is the
  whole setup.

If your installed CLI doesn't know the command (older version), upgrade first:
`npm update -g @oatnil/ud`.

Once done, tell the user:

```
┌─ udctl Setup Complete ────────────────────────┐
│  ✓ CLI      ud <version>                             │
│  ✓ Context  <context name> → <api url>               │
│  ✓ Skill    <path the skill check reports>           │
│                                                      │
│  ⚡ Ask me to work on a task to get started          │
└──────────────────────────────────────────────────────┘
```

---

## Before your first write

The skill file the onboarding check had you install is the full reference. Three rules
that matter most:

- `ud apply` **replaces** the whole record. Read it back first
  (`ud describe task <id> -o apply`) so you don't drop fields.
- Never invent IDs — list first, then act on a real one. Tasks, notes and comments accept
  an 8-character prefix; every other resource needs the full UUID.
- Deleting is not undoable. Ask before `ud delete`.

## Resources

- CLI reference: `https://udctl.com/docs/cli`
- AI agent integration: `https://udctl.com/docs/cli-ai-integration`
- Self-hosting: `https://udctl.com/self-hosting`
- Portable skill for agentskills.io-compatible agents:
  `https://raw.githubusercontent.com/oatnil-top/ud-schemas/main/skills/ud-integration/SKILL.md`

These instructions are published at `https://udctl.com/agent-setup/prompt.md` so you can
re-verify their authenticity at any time.
