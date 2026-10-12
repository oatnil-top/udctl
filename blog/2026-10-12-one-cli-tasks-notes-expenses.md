---
title: "One CLI for Self-Hosted Tasks, Notes and Expenses"
description: "One ud command creates a task, records an expense and links the two on a self-hosted server, compared with running Vikunja plus Firefly III or Actual Budget."
authors: [lintao]
tags: [guide, self-hosting]
date: 2026-10-12
---

In self-hosting setups, tasks and money usually live in two systems: a board like Vikunja for tasks, Firefly III or Actual Budget for finances. Each is deployed, backed up and logged into separately, and the data in one knows nothing about the other.

udctl (UnDercontrol) is a self-hostable workspace for tasks, notes and expenses, with a kubectl-style CLI (`ud`) and AI coding agents you dispatch from a task comment. Below, one `ud` command creates a task, records an expense, and references that expense from a note on the task.


<!-- truncate -->

## One verb, three kinds of data

The water heater needs fixing, so start with a task. A task is a Markdown file with frontmatter:

```
$ ud apply -f task.md
Task created: 90898588-e72f-4759-b089-640bb72713b6
Title: Fix water heater
Status: todo
Tags: home
```

Expenses need an account. Accounts and expenses are YAML resources, and they are applied the same way:

```yaml
apiVersion: ud/v1
kind: Account
spec:
  name: Household Checking
  balance:
    amount: 3200.00
    currency: USD
  off_budget: false
  notes: Joint account for rent and utilities
```

```
$ ud apply -f acct.yaml
Account created: Household Checking (c7770501)
```

The thermostat was replaced, so record the expense:

```yaml
apiVersion: ud/v1
kind: Expense
spec:
  title: Replace water heater thermostat
  amount:
    amount: 64.90
    currency: USD
  description: Part from the hardware store, installed myself
  account_id: c7770501-bff1-4abf-9026-933385f4f369
  occurred_at: "2026-10-11"
```

```
$ ud apply -f exp.yaml
Expense created: Replace water heater thermostat (93eb83e1)
$ ud describe expense 93eb83e1
ID:          93eb83e1-ab7d-4056-9b5c-ab48dc0b1b01
Title:       Replace water heater thermostat
Amount:      64.90 USD
Account:     c7770501-bff1-4abf-9026-933385f4f369
Occurred:    2026-10-11 00:00
...
Description:
Part from the hardware store, installed myself
```

Finally, write a note on the task that links the expense. In the web and desktop apps an `expense://` link shows up as a clickable expense badge:

```
$ cat <<'EOF' | ud apply -f -
---
task_id: 90898588
---
Thermostat was dead. Replaced it, water is hot again.
Cost: [thermostat](expense://93eb83e1-ab7d-4056-9b5c-ab48dc0b1b01)
EOF
Note created: 60b84e7f
$ ud describe task 90898588
ID:          90898588-e72f-4759-b089-640bb72713b6
Title:       Fix water heater
Status:      todo
Tags:        home
...
Description:
Water runs lukewarm. Check the thermostat first.

Notes:
---
[60b84e7f] 2026-10-12 15:16
Thermostat was dead. Replaced it, water is hot again.
Cost: [thermostat](expense://93eb83e1-ab7d-4056-9b5c-ab48dc0b1b01)
---
```

Tasks, notes, expenses and accounts sit on one server under one login. Task descriptions, notes and expense descriptions share the same Markdown editor.

Every resource exports to a file you can edit and apply back:

```
$ ud get expense 93eb83e1 -o apply
apiVersion: ud/v1
kind: Expense
metadata:
  id: 93eb83e1-ab7d-4056-9b5c-ab48dc0b1b01
spec:
  amount:
    amount: 64.90
    currency: USD
  title: "Replace water heater thermostat"
  description: "Part from the hardware store, installed myself"
  account_id: c7770501-bff1-4abf-9026-933385f4f369
  occurred_at: 2026-10-11
```

## Typical scenarios

- Home repairs, renewals and purchases. The task says what needs doing, the expense says what it cost, and the note connects them. At the end of the year, one task shows everything spent on that job.
- An AI coding agent in your terminal does the bookkeeping. Claude Code, Codex, OpenCode, or any agent that can run a shell command reads the text of a receipt and writes an expense with `ud apply`. No plugin needed.
- One server for a household or a small team. Tasks, accounts, expenses and budgets can be shared with a group; these are the resources with a `share` action in `ud api-resources`.

## Compared with Vikunja + Firefly III / Actual Budget

Each of these projects goes further in its own area: Vikunja has Gantt charts, Firefly III does double-entry bookkeeping, Actual Budget has bank sync. The difference is how many systems you run:

| | Vikunja + Firefly III or Actual Budget | udctl |
|---|---|---|
| Deployment | Two services, each with its own database and backups | One server |
| Tasks | Vikunja: list, kanban, Gantt and table views | Tasks and kanban boards (a board is a saved query) |
| Finances | Firefly III: double-entry bookkeeping, REST JSON API. Actual Budget: local-first envelope budgeting with a self-hostable sync server | Accounts, expenses, incomes, budgets |
| Command line | Vikunja's `veans` (officially labeled experimental; a task CLI for scripts and coding agents). Actual's `@actual-app/cli` (accounts, transactions, queries and more). Firefly III through its REST API | One `ud`, with the same verbs for tasks, notes, expenses and accounts |
| Linking tasks and money | Paste a web link to the other system into a description | An `expense://` link in a note, shown as a clickable expense badge |
| License | Vikunja and Firefly III: AGPL-3.0. Actual Budget: MIT | Proprietary; free for individuals and teams of up to 3, larger teams pay by team size |

Which one:

- If you need professional bookkeeping features such as double-entry accounts, bank sync or a YNAB migration, or open source matters to you, pick Firefly III or Actual Budget; if your task side needs Gantt charts, pick Vikunja.
- If you want one server and one command line for tasks, notes and everyday expenses, with each able to reference the others, pick udctl.

## Get started

```bash
brew tap oatnil-top/ud
# The next line is only needed on Homebrew 6 and newer
brew trust oatnil-top/ud
brew install ud
```

Or `npm install -g @oatnil/ud`. Server deployment is covered in [Self-hosting](https://udctl.com/self-hosting). `ud cook expense` and `ud cook account` print ready-to-copy templates for creating accounts and recording expenses.

## Competitor fact ledger (checked 2026-10-12)

| Statement | Source |
|---|---|
| Vikunja describes itself as open-source task management with list, kanban, Gantt and table views; self-hostable; paid Vikunja Cloud also offered | https://vikunja.io/ |
| Vikunja is licensed AGPL-3.0 | https://vikunja.io/ ; GitHub go-vikunja/vikunja license field |
| Vikunja's bundled `vikunja` CLI is for server administration (doctor, dump, migrate, user, etc.), not task management | https://vikunja.io/docs/cli/ |
| `veans`: in the official docs, labeled experimental, a task CLI for terminals, scripts and coding agents, released alongside the main binary | https://vikunja.io/docs/veans/ |
| Vikunja has a REST API (v1; a v2 since 2.4.0) | https://vikunja.io/docs/api-documentation/ |
| Firefly III: personal finances manager, fully self-hosted, double-entry bookkeeping, REST JSON API, AGPL-3.0 | https://github.com/firefly-iii/firefly-iii README and license field |
| Actual Budget: local-first personal finance app, envelope budgeting, self-hostable sync server, MIT | https://actualbudget.org/ ; GitHub actualbudget/actual |
| Actual's `@actual-app/cli`: manages accounts, transactions, budgets and more, supports ActualQL queries, needs Node.js 22+, connects to a running sync server | https://actualbudget.org/docs/api/cli/ |
| Actual supports bank sync and migration from YNAB | https://actualbudget.org/ |
