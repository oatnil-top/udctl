---
title: "A kubectl-Style CLI for Tasks: get, describe, apply"
description: "ud manages tasks with kubectl verbs: get, describe, apply, patch, delete. A full run on v0.163.0, and how it compares with Taskwarrior."
authors: [lintao]
tags: [guide]
date: 2026-10-12
---

After enough hours in kubectl, you start wanting the same moves for your tasks: `get` for a list, `describe` for the full picture, edit a file and `apply` it back. udctl (UnDercontrol) is a self-hostable workspace for tasks, notes and expenses, with a kubectl-style CLI (`ud`) and AI coding agents you dispatch from a task comment. The verbs in `ud` were modeled on kubectl. This post covers that CLI and how it differs from Taskwarrior.


<!-- truncate -->

## Verb mapping

| What you do in kubectl | kubectl | ud |
|---|---|---|
| List resources | `kubectl get pods -l app=web` | `ud get task -l infra` |
| See everything about one resource | `kubectl describe pod web-1` | `ud describe task b1b36c4b` |
| Create or update declaratively from a file | `kubectl apply -f pod.yaml` | `ud apply -f task.md` |
| Change one field | `kubectl patch` | `ud patch task <id> --set ...` |
| Export in a re-appliable format | `kubectl get pod web-1 -o yaml` | `ud get task <id> -o apply` |
| Delete | `kubectl delete` | `ud delete task <id>` |
| List resource types | `kubectl api-resources` | `ud api-resources` |
| Switch clusters | `kubectl config use-context` | `ud config use-context` |

A task file is Markdown with a frontmatter block. The frontmatter holds the title, status and tags; the body is the task description.

## A full run

Write a task file:

```markdown
---
title: Rotate the staging TLS certificate
status: todo
tags: [infra, kctl-demo]
---
Cert expires on the 30th. Renew via the ACME job, then reload ingress.
```

`apply` it. The file has no `id`, so this creates a task:

```
$ ud apply -f t1.md
Task created: b1b36c4b-d972-44b4-8ee0-58c65fcd4fba
Title: Rotate the staging TLS certificate
Status: todo
Tags: infra, kctl-demo
```

Create a second one, then list by tag:

```
$ ud get task -l kctl-demo
ID        STATUS       TITLE                                     TAGS
--        ------       -----                                     ----
b99b24e7  in-progress  Add retry to the webhook sender           backend, kctl-demo
b1b36c4b  todo         Rotate the staging TLS certificate        infra, kctl-demo
```

An ID can be shortened to any unique prefix. `describe` shows the full task:

```
$ ud describe task b1b36c4b
ID:          b1b36c4b-d972-44b4-8ee0-58c65fcd4fba
Title:       Rotate the staging TLS certificate
Status:      todo
Tags:        infra, kctl-demo
Created:     2026-10-12 15:13
Updated:     2026-10-12 15:13
...
Description:
Cert expires on the 30th. Renew via the ACME job, then reload ingress.
```

To change one field and leave the rest alone, use `patch`. Values are validated, so a bad one fails loudly instead of being stored:

```
$ ud patch task b1b36c4b --set ud.priority=high
Error: failed to set "ud.priority": API error: ud.priority must be one of [P0 P1 P2 P3]
$ ud patch task b1b36c4b --set ud.priority=P1
metadata "ud.priority"=P1 set on task b1b36c4b
```

For several changes, export, edit and apply back, the same loop as `kubectl get -o yaml` followed by `apply`:

```
$ ud get task b1b36c4b -o apply > cert.md
$ sed -i "" "s/^status: todo/status: in-progress/" cert.md
$ ud apply -f cert.md
Task updated: b1b36c4b-d972-44b4-8ee0-58c65fcd4fba
Title: Rotate the staging TLS certificate
Status: in-progress
Tags: infra, kctl-demo
```

`-o apply` exports the same kind of Markdown file you started with, now including the `id`, so this `apply` is an update.

Filter with `ud query`, whose syntax reads like a SQL WHERE clause:

```
$ ud query "tags CONTAINS 'kctl-demo' AND ud.priority = 'P1'"
ID        STATUS       TITLE                                     TAGS
--        ------       -----                                     ----
b1b36c4b  in-progress  Rotate the staging TLS certificate        infra, kctl-demo

Showing 1 tasks
```

Progress notes go through `apply` too. Put `task_id` in the frontmatter and the file becomes a note on that task:

```
$ cat <<'EOF' | ud apply -f -
---
task_id: b1b36c4b
---
Renewed via ACME, ingress reloaded on staging-2.
EOF
Note created: 91fade3f
```

## Pull a whole folder

`apply` handles one file at a time. To edit a batch of tasks in a local folder, use `ud pull` and `ud push`, which work much like `git clone` and `git push`.

Tasks on the server can live under a virtual path such as `/Infra/`. `ud pull` checks that path out into the current directory: one `.md` file per task, named after the task title, with notes under `notes/`:

```
$ mkdir infra && cd infra
$ ud pull /Infra/
  ✓ created: Add retry to the webhook sender.md (task, 0 notes)
  ✓ created: Rotate the staging TLS certificate.md (task, 1 notes)
  created a starter .udignore (edit freely; it syncs with the vault)
Initialized tracking root at .../infra (bound to /Infra/, layout: vault)
Pulled 2 tasks (1 notes), 0 resources.
```

The only line ud adds to a file is `ud-id`; the rest is the frontmatter and the task body:

```
$ cat "Rotate the staging TLS certificate.md"
---
ud-id: ca67878b-0652-4ae5-900e-0206a9dd70b0
status: todo
tags: [infra, pull-demo]
---
Cert expires on the 30th. Renew via the ACME job, then reload ingress.
```

Edit one file, create another, and push. The new file becomes a new task and the edited file updates the existing one:

```
$ sed -i "" "s/^status: todo/status: in-progress/" "Rotate the staging TLS certificate.md"
$ printf -- "---\nstatus: todo\ntags: [infra, pull-demo]\n---\nList every cron job on staging and who owns it.\n" > "Audit the staging cron jobs.md"
$ ud push --yes
Will push 2 changes:
  + new:      Audit the staging cron jobs.md (task)
  ● modified: Rotate the staging TLS certificate.md (task)
  ✓ created task: Audit the staging cron jobs (id: 262ebefe)
  ✓ updated task: Rotate the staging TLS certificate
Pushed 2 changes.
```

When someone changes a task in the web app, another `ud pull` downloads only what changed:

```
$ ud pull
  ✓ updated: Add retry to the webhook sender.md (task, 0 notes)
Pulled 1 tasks (0 notes), 0 resources.
```

If the same task changed on both sides, `ud push` skips it by default; pull first, then resolve it. Deleting a task file locally soft-deletes the task on push, and `ud restore task` brings it back.

That makes a local folder a data source too. Edit the files in VS Code or Vim, keep history with `git commit`, or open the folder as an Obsidian vault, since the default vault layout follows Obsidian's conventions. To go the other way and publish an existing Obsidian vault, bind it with `ud init /Notes/` and run `ud push`.

## Not just tasks

`ud api-resources` lists what these verbs work on. The first few rows:

```
$ ud api-resources
NAME                SHORTNAMES                  ACTIONS
task                tasks,t                     get,describe,apply,delete,annotate,bind,unbind,link,unlink,share,unshare,grep,move
note                -                           get,apply,delete
comment             comments                    get,describe,apply,delete,patch
board               boards                      get,describe,apply,query,delete
budget              budgets,b                   get,describe,apply,share,unshare
expense             expenses,e                  get,describe,apply,share,unshare
account             accounts,a                  get,describe,apply,share,unshare
...
```

Expenses, accounts, budgets and boards use the same `get`, `describe` and `apply`. Task descriptions, notes and expense descriptions share one Markdown editor, and the web and desktop apps show the same content.

## Typical scenarios

- AI coding agents in your terminal read and write tasks. Claude Code, Codex, OpenCode, or any agent that can run a shell command reads requirements with `ud describe` and writes a note with `ud apply` when it is done. Input and output are plain text, so no plugin is needed.
- CI records a release. When the pipeline finishes, `ud apply -f -` writes the change summary as a note on the release task.
- Task files live in git. A folder from `ud pull`, or files exported with `-o apply`, can be committed, diffed and reviewed, then sent back with `ud push` or `apply`.
- Several environments. Give your personal instance, team instance and local test instance a context each and name it with `--context`, the way kubectl handles several clusters.

## Compared with Taskwarrior

Taskwarrior is a frequent answer when people ask for a command-line task manager. Both live in the terminal; their models differ.

| | Taskwarrior 3 | ud (udctl) |
|---|---|---|
| Command shape | `task <filter> <command> <mods>`, e.g. `task 12 modify due:eom`, `task +home list` | `ud <verb> <resource> <id>`, e.g. `ud describe task b1b36c4b` |
| How you edit | Field by field through command arguments; JSON via `task import` and `task export` | One field with `patch`; a whole file with `apply`, and exports apply back as-is |
| Where data lives | `taskchampion.sqlite3` on your machine | On a backend you run; the CLI is a client, and `ud pull` can check a path out as a local Markdown folder |
| Several devices | `task sync` to a TaskChampion sync server, AWS S3 or Google Cloud Storage | Every client talks to the same server; there is no sync step |
| Other ways in | Command line; third-party interfaces exist | The same data in web, desktop and iOS apps, plus kanban boards |
| License | MIT, open source | Proprietary; free for individuals and teams of up to 3, larger teams pay by team size |

Taskwarrior facts come from its official docs (taskwarrior.org/docs/upgrade-3, /docs/sync, /docs/examples, /docs/commands), checked 2026-10-12.

Which one:

- For personal todos on one or a few of your own machines, offline, with no server and an open-source license, pick Taskwarrior. It has a full filter language and many built-in reports.
- For the kubectl declarative workflow, boards shared with other people, AI agents reading and writing the same data, or tasks, notes and expenses in one place, pick ud. You need a backend for it: the desktop app runs one on your machine, and for a team you deploy a server.

## Get started

```bash
brew tap oatnil-top/ud
# The next line is only needed on Homebrew 6 and newer
brew trust oatnil-top/ud
brew install ud
```

Or `npm install -g @oatnil/ud`. Server deployment is covered in [Self-hosting](https://udctl.com/self-hosting). After installing, run `ud find`: it lists each way to look things up, what it is good for and what it leaves out.
