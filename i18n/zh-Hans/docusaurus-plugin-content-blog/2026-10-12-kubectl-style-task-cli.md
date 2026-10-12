---
title: "kubectl 风格的任务 CLI:用 get、describe、apply 管任务"
description: "ud 用 kubectl 那套动词管任务:get、describe、apply、patch、delete。v0.163.0 实跑一遍,再和 Taskwarrior 对照。"
authors: [lintao]
tags: [guide]
date: 2026-10-12
---

kubectl 用惯了,管任务时也会想要同一套动作:`get` 看列表,`describe` 看全貌,改完一个文件 `apply` 回去。udctl(UnDercontrol)是一个可自托管的工作台,用来管理任务、笔记和开销,带 kubectl 风格的命令行(`ud`),还能在任务评论里直接派活给 AI 编程 agent。`ud` 的动词就是照 kubectl 设计的。这篇只讲这条命令行,以及它和 Taskwarrior 这个老牌任务 CLI 的区别。


<!-- truncate -->

## 动词对照

| 你在 kubectl 里做的事 | kubectl | ud |
|---|---|---|
| 列出资源 | `kubectl get pods -l app=web` | `ud get task -l infra` |
| 看一个资源的全部信息 | `kubectl describe pod web-1` | `ud describe task b1b36c4b` |
| 从文件声明式地创建或更新 | `kubectl apply -f pod.yaml` | `ud apply -f task.md` |
| 改单个字段 | `kubectl patch` | `ud patch task <id> --set ...` |
| 导出成可回写的格式 | `kubectl get pod web-1 -o yaml` | `ud get task <id> -o apply` |
| 删除 | `kubectl delete` | `ud delete task <id>` |
| 有哪些资源类型 | `kubectl api-resources` | `ud api-resources` |
| 切换集群 | `kubectl config use-context` | `ud config use-context` |

任务文件是 Markdown 加一段 frontmatter,frontmatter 放标题、状态、标签,正文就是任务描述。

## 实跑一遍

先写一个任务文件:

```markdown
---
title: Rotate the staging TLS certificate
status: todo
tags: [infra, kctl-demo]
---
Cert expires on the 30th. Renew via the ACME job, then reload ingress.
```

`apply` 它。文件里没有 `id`,所以是新建:

```
$ ud apply -f t1.md
Task created: b1b36c4b-d972-44b4-8ee0-58c65fcd4fba
Title: Rotate the staging TLS certificate
Status: todo
Tags: infra, kctl-demo
```

再建一个,然后按标签列出来:

```
$ ud get task -l kctl-demo
ID        STATUS       TITLE                                     TAGS
--        ------       -----                                     ----
b99b24e7  in-progress  Add retry to the webhook sender           backend, kctl-demo
b1b36c4b  todo         Rotate the staging TLS certificate        infra, kctl-demo
```

ID 可以只写前缀,唯一就行。`describe` 看全貌:

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

只改一个字段用 `patch`,不碰其他内容。字段值会校验,写错直接报错,不会悄悄存进去:

```
$ ud patch task b1b36c4b --set ud.priority=high
Error: failed to set "ud.priority": API error: ud.priority must be one of [P0 P1 P2 P3]
$ ud patch task b1b36c4b --set ud.priority=P1
metadata "ud.priority"=P1 set on task b1b36c4b
```

改多处时走「导出、编辑、回写」,和 `kubectl get -o yaml` 后再 `apply` 是一个路数:

```
$ ud get task b1b36c4b -o apply > cert.md
$ sed -i "" "s/^status: todo/status: in-progress/" cert.md
$ ud apply -f cert.md
Task updated: b1b36c4b-d972-44b4-8ee0-58c65fcd4fba
Title: Rotate the staging TLS certificate
Status: in-progress
Tags: infra, kctl-demo
```

`-o apply` 导出的就是开头那种 Markdown 文件,带上了 `id`,所以这次 `apply` 是更新。

按条件查用 `ud query`,语法接近 SQL 的 WHERE:

```
$ ud query "tags CONTAINS 'kctl-demo' AND ud.priority = 'P1'"
ID        STATUS       TITLE                                     TAGS
--        ------       -----                                     ----
b1b36c4b  in-progress  Rotate the staging TLS certificate        infra, kctl-demo

Showing 1 tasks
```

进展记录也是 `apply`。frontmatter 里写 `task_id`,这份文件就成了那张任务上的一条笔记:

```
$ cat <<'EOF' | ud apply -f -
---
task_id: b1b36c4b
---
Renewed via ACME, ingress reloaded on staging-2.
EOF
Note created: 91fade3f
```

## 整个目录拉成本地文件夹

`apply` 一次处理一个文件。想直接在本地文件夹里改一批任务,用 `ud pull` 和 `ud push`,用法接近 `git clone` 加 `git push`。

服务器上的任务可以放在虚拟路径下,比如 `/Infra/`。`ud pull` 把这个路径拉成当前目录,一张任务一个 `.md` 文件,文件名就是任务标题,笔记放在 `notes/` 下:

```
$ mkdir infra && cd infra
$ ud pull /Infra/
  ✓ created: Add retry to the webhook sender.md (task, 0 notes)
  ✓ created: Rotate the staging TLS certificate.md (task, 1 notes)
  created a starter .udignore (edit freely; it syncs with the vault)
Initialized tracking root at .../infra (bound to /Infra/, layout: vault)
Pulled 2 tasks (1 notes), 0 resources.
```

文件里只多一行 `ud-id`,其余就是标题以外的 frontmatter 和正文:

```
$ cat "Rotate the staging TLS certificate.md"
---
ud-id: ca67878b-0652-4ae5-900e-0206a9dd70b0
status: todo
tags: [infra, pull-demo]
---
Cert expires on the 30th. Renew via the ACME job, then reload ingress.
```

在本地改一个文件、新建一个文件,然后推回去。新文件变成新任务,改过的文件更新原任务:

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

别人在网页上改了任务,再跑一次 `ud pull`,只下载变过的那几张:

```
$ ud pull
  ✓ updated: Add retry to the webhook sender.md (task, 0 notes)
Pulled 1 tasks (0 notes), 0 resources.
```

两边都改了同一张任务时,`ud push` 默认跳过它,先 pull 再处理。本地删掉一个任务文件,push 时服务器上那张任务是软删除,能用 `ud restore task` 找回。

这样一个本地文件夹也成了数据源:用 VS Code、Vim 之类的编辑器直接改,`git commit` 留历史,默认的 vault 布局按 Obsidian 的习惯组织文件,也可以当 Obsidian 库打开。已有一个 Obsidian 库,想反过来发到服务器,用 `ud init /Notes/` 绑定路径后 `ud push`。

## 不只是任务

`ud api-resources` 列出这些动词能作用的资源。下面是前几行:

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

开销、账户、预算、看板用的是同一套 `get`、`describe`、`apply`。任务正文、笔记、开销备注用的也是同一个 Markdown 编辑器,在网页端和桌面端打开是同一份内容。

## 典型场景

- 终端里的 AI 编程 agent 读写任务。Claude Code、Codex、OpenCode 或任何能跑 shell 的 agent,用 `ud describe` 读需求,干完用 `ud apply` 写一条笔记。输入输出都是纯文本,不需要专门的插件。
- CI 里记录发版。流水线跑完,用 `ud apply -f -` 把这次的变更摘要写成一条笔记,挂在对应的发版任务上。
- 任务文件放进 git。`ud pull` 拉下来的文件夹或 `-o apply` 导出的文件都可以提交、diff、code review,改完再 `ud push` 或 `apply` 回去。
- 多环境切换。个人实例、团队实例、本地测试实例各配一个 context,命令里用 `--context` 指明,和 kubectl 管多个集群一样。

## 和 Taskwarrior 比

Taskwarrior 是常被拿来回答「有什么命令行任务工具」的那一个。两者都在终端里用,模型不同。

| | Taskwarrior 3 | ud(udctl) |
|---|---|---|
| 命令形状 | `task <过滤条件> <命令> <修改>`,例如 `task 12 modify due:eom`、`task +home list` | `ud <动词> <资源> <id>`,例如 `ud describe task b1b36c4b` |
| 改任务的方式 | 命令参数逐个改字段;JSON 可 `task import` 导入、`task export` 导出 | 单字段 `patch`;整份文件 `apply`,导出即可回写 |
| 数据放在哪 | 本机 `taskchampion.sqlite3` | 你自己部署的服务器上,CLI 是客户端;`ud pull` 可把一个路径拉成本地 Markdown 文件夹 |
| 多设备 | `task sync`,同步到 TaskChampion 同步服务器或 AWS S3、Google Cloud Storage | 所有客户端连同一个服务器,无需同步步骤 |
| 其他入口 | 命令行;第三方另有各种界面 | 同一份数据还有网页、桌面、iOS 客户端和看板 |
| 许可 | MIT 开源 | 闭源;个人和 3 人以内团队免费,更大团队按规模收费 |

Taskwarrior 的事实取自其官方文档:taskwarrior.org/docs/upgrade-3、/docs/sync、/docs/examples、/docs/commands,2026-10-12 核对。

怎么选:

- 只在一台或几台自己的机器上管个人待办,想要离线、无服务器、开源,选 Taskwarrior。它有一套完整的过滤语法和多种内置报表。
- 想要 kubectl 那套声明式工作流,要和别人共享看板,要让 AI agent 在同一份数据上读写,或者想把任务、笔记、记账放在一处,选 ud。代价是要有一个后端:桌面客户端自带一个跑在本机,多人用就自己部署服务器。

## 上手

```bash
brew tap oatnil-top/ud
# 下一行只在 Homebrew 6 及以上需要
brew trust oatnil-top/ud
brew install ud
```

或者 `npm install -g @oatnil/ud`。服务器的部署方式见 [自托管](https://udctl.com/self-hosting)。装好后跑 `ud find`,它会列出每种查找方式适合什么、漏掉什么。
