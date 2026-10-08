---
title: "让 Claude 规划任务，Codex 去执行"
description: "把两份 AI 订阅编成一个团队：planner 拆解需求写验收标准，@提及自动委派，executor 写代码提交，你只管审核。Agent Teams 让 lead 自动认识自己的花名册。"
authors: [lintao]
tags: [feature, agents]
date: 2026-07-19
image: https://dl.udctl.com/features/blog/claude-plans-codex-executes/concept-hero.png
---

很多人已经在这么用 AI 了：在 Claude Code 里把方案讨论清楚，再把结论复制到 Codex 里执行。理由也很实际——两家的订阅都买了，Claude 擅长规划，Codex 干活不占 Claude 的额度，两份订阅都物尽其用。唯一的问题是：中间那个"复制粘贴"的角色，是你自己。

**在 UnDercontrol 里，这条流水线是开箱即用的**：Claude 负责规划，Codex 负责执行，任务系统就是它们之间共享的白板——你只需要在关键节点审核。

![Claude 规划、Codex 执行 — 任务是 AI 团队共享的白板](https://dl.udctl.com/features/blog/claude-plans-codex-executes/concept-hero.png)

<!-- truncate -->

### 五步跑通

1. **配两个 agent。** Claude Code、Codex、OpenCode 都是内置的 Agent CLI 模板，选一下就行（也支持任意自定义命令）。给 planner 配 Claude Code，给 executor 配 Codex。嫌配置麻烦？连这一步都可以外包——系统内置了 **Agent Creator**，@一下它、说清你要的组合，它帮你把 agent 建好。
2. **把需求丢给 planner。** 任务写得糙一点没关系，@planner 一下。守护进程会在你的开发机上拉起 Claude Code 会话：读描述、澄清需求、拆成带验收标准的子任务。
3. **planner 委派给 executor。** 在子任务上 @executor —— agent 之间的 @提及 会自动为对方拉起新的 workspace session，委派链还保留你的权限范围。
4. **Codex 执行。** 每个会话领一个子任务：写代码、跑测试、提交 commit、把进度写回备注，完成后置为 `pending`。
5. **你只在两个点介入。** 确认拆解、审核产出。

![从一句需求到待审核的 commit — 一条流水线](https://dl.udctl.com/features/blog/claude-plans-codex-executes/concept-flow.png)

整个协作过程就发生在任务上——描述是 spec，评论是对话，备注是进度日志。下面是一个真实的任务详情：左边是 planner 拆解后的验收标准，右边是三方的评论线程：

![任务详情 — planner 拆解 spec，executor 汇报 commit，全程留痕](https://dl.udctl.com/features/blog/claude-plans-codex-executes/app-task.png)

### 编队：Agent Teams

不想每次手动指挥两个 agent？把它们编成一个 **Team**。

一个 Team 有一个 **lead** 和若干 **成员**，每个成员带一条"什么活路由给它"的分工提示（delegation hint）。当 lead 的会话启动时，它的花名册会自动注入到提示词里——**lead 天生就知道自己手下有谁、谁擅长什么、怎么委派**。

![Agent Teams — lead + 成员分工提示，花名册自动注入 lead 的会话](https://dl.udctl.com/features/blog/claude-plans-codex-executes/app-teams.png)

于是"Claude 规划、Codex 执行"变成一句话的事：@一下 dev-team 的 lead，剩下的它自己安排。团队还可以嵌套——某个成员自己也可以是另一个 Team 的 lead，层级自然生长，而每个 agent 只需要认识自己的直属下属。

### 全程可观测

开一个看板盯全局：拆了多少、执行到哪、几个待审核，一眼看清。每个 agent 会话的终端输出也会实时流回 Web 端——在电脑上、甚至手机上都能看。

![AI 团队交付看板 — Planning / Executing / Pending Review / Done](https://dl.udctl.com/features/blog/claude-plans-codex-executes/app-board.png)

### 典型场景

- **睡前排产，醒来验收。** 晚上把三个需求丢给 planner，早上收到拆好的子任务和几个 `pending` 的实现，每个都带独立 commit。
- **大重构切片。** Claude 出迁移方案拆成 20 个小任务，Codex 逐个执行，哪步出问题回滚哪步。
- **Bug 分诊流水线。** planner 复现、定位、写清 root cause，再委派修复——执行方拿到的是"改哪里、为什么、怎么验证"。

### 组合是你定的

Claude + Codex 只是一种搭配。UnDercontrol 不绑定任何 AI 工具——Claude Code、Codex、OpenCode 或任意终端 agent 都能当 lead 或成员，因为它们都通过同一个 [AI Agent CLI](/zh-Hans/docs/cli-ai-integration/) 接上那块共享任务板；角色由 prompt 和 skill 决定，工具由 Agent CLI 配置决定。手里有哪些订阅、哪个模型擅长什么，编排权都在你。

顺带一提：agent 写回的进度和你手写的内容在同一套 Markdown 体系里——任务、备注、评论、账目，所有文本面共用同一个编辑体验。

---

想试试？[下载 UnDercontrol](https://oatnil.com/docs/download)，跑起守护进程，建一个 Team，然后 @lead 你的第一个任务。
