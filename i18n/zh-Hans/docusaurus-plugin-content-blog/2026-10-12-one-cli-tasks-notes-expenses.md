---
title: "一个 CLI 管自托管的任务、笔记和记账"
description: "同一个 ud 命令建任务、记开销、在笔记里把两者连起来,和 Vikunja 加 Firefly III 或 Actual Budget 的组合对照。"
authors: [lintao]
tags: [guide, self-hosting]
date: 2026-10-12
---

自托管圈子里,任务和记账通常是两套系统:任务用 Vikunja 这类看板,记账用 Firefly III 或 Actual Budget。两套各自部署、各自备份、各自登录,数据之间没有关联。

udctl(UnDercontrol)是一个可自托管的工作台,用来管理任务、笔记和开销,带 kubectl 风格的命令行(`ud`),还能在任务评论里直接派活给 AI 编程 agent。下面用同一个 `ud` 命令走一遍:建任务、记一笔开销、在任务笔记里引用这笔开销。


<!-- truncate -->

## 同一个动词,三种数据

修热水器,先建一张任务。任务是 Markdown 文件加 frontmatter:

```
$ ud apply -f task.md
Task created: 90898588-e72f-4759-b089-640bb72713b6
Title: Fix water heater
Status: todo
Tags: home
```

记账先要有账户。账户和开销是 YAML 资源,同样 `apply`:

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

换了恒温器,记一笔开销:

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

最后在任务上写一条笔记,把这笔开销链进去。`expense://` 链接在网页端和桌面端显示成可点击的开销徽标:

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

任务、笔记、开销、账户都在同一个服务器、同一个账号下。任务正文、笔记和开销备注用的是同一个 Markdown 编辑器。

任何资源都能导出成可回写的文件,改完再 `apply`:

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

## 典型场景

- 家里的维修、续费、采购:任务记要做什么,开销记花了多少,笔记把两者连起来。年底翻一张任务就能看到这件事前后花的钱。
- 终端里的 AI 编程 agent 帮你记账。Claude Code、Codex、OpenCode 或任何能跑 shell 的 agent,读一张收据的文字后用 `ud apply` 写一条开销,不需要专门的插件。
- 一个服务器给一家人或一个小团队。任务、账户、开销、预算都能共享给组,对应 `ud api-resources` 里带 `share` 动作的资源。

## 和 Vikunja + Firefly III / Actual Budget 的组合比

这三个项目在各自领域做得更专:Vikunja 有甘特图,Firefly III 是复式记账,Actual Budget 有银行同步。差别在要维护几套系统:

| | Vikunja + Firefly III 或 Actual Budget | udctl |
|---|---|---|
| 部署 | 两套服务,各自数据库、各自备份 | 一个服务器 |
| 任务 | Vikunja:列表、看板、甘特图、表格四种视图 | 任务、看板(看板是保存的查询) |
| 记账 | Firefly III:复式记账,REST JSON API;Actual Budget:本地优先的信封预算,自托管同步服务 | 账户、开销、收入、预算 |
| 命令行 | Vikunja 的 `veans`(官方标注实验性,面向脚本和编程 agent 的任务 CLI);Actual 的 `@actual-app/cli`(账户、交易、查询等);Firefly III 走 REST API | 一个 `ud`,任务、笔记、开销、账户同一套动词 |
| 任务和账目互相引用 | 在一边的描述里贴另一边的网页链接 | 笔记里用 `expense://` 链接,显示为可点击的开销徽标 |
| 许可 | Vikunja、Firefly III 为 AGPL-3.0;Actual Budget 为 MIT | 闭源;个人和 3 人以内团队免费,更大团队按规模收费 |

怎么选:

- 需要复式记账、银行同步、YNAB 迁移这类专业记账功能,或者看重开源,选 Firefly III 或 Actual Budget;任务那边要甘特图,选 Vikunja。
- 想用一个服务器、一个命令行管任务、笔记和日常开销,并且希望它们能互相引用,选 udctl。

## 上手

```bash
brew tap oatnil-top/ud
# 下一行只在 Homebrew 6 及以上需要
brew trust oatnil-top/ud
brew install ud
```

或者 `npm install -g @oatnil/ud`。服务器部署见 [自托管](https://udctl.com/self-hosting)。`ud cook expense` 和 `ud cook account` 会打印可直接复制的建账、记账模板。

## 竞品事实账(2026-10-12 核对)

| 陈述 | 来源 |
|---|---|
| Vikunja 自述 open-source task management,列表、看板、甘特、表格四种视图,可自托管,另有付费 Vikunja Cloud | https://vikunja.io/ |
| Vikunja 许可 AGPL-3.0 | https://vikunja.io/ ;GitHub go-vikunja/vikunja license 字段 |
| Vikunja 自带 `vikunja` CLI 是服务器管理用(doctor、dump、migrate、user 等),不管理任务 | https://vikunja.io/docs/cli/ |
| `veans`:官方文档收录、标注 experimental,面向终端、脚本和编程 agent 的任务 CLI,随主程序发布 | https://vikunja.io/docs/veans/ |
| Vikunja 有 REST API(v1;2.4.0 起另有 v2) | https://vikunja.io/docs/api-documentation/ |
| Firefly III:personal finances manager,完全自托管,复式记账,REST JSON API,AGPL-3.0 | https://github.com/firefly-iii/firefly-iii README 与 license 字段 |
| Actual Budget:local-first personal finance app,信封预算,可自托管同步服务,MIT | https://actualbudget.org/ ;GitHub actualbudget/actual |
| Actual 的 `@actual-app/cli`:管理账户、交易、预算等并支持 ActualQL 查询,需 Node.js 22+,连运行中的同步服务器 | https://actualbudget.org/docs/api/cli/ |
| Actual 支持银行同步、从 YNAB 迁移 | https://actualbudget.org/ |
