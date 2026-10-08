---
title: "AI 不只是在 UnDercontrol 里干活，它还能操控 UnDercontrol 本身"
description: "「Agent 工作台」大多止步于执行层。UnDercontrol 用 Everything as Code 补上另一半——任务、看板、技能全是 Markdown + CLI，同一个 Agent 既是工人，也是能操控平台本身的管理员。"
authors: [lintao]
tags: [feature, agents]
date: 2026-07-14
image: https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-hero.png
---

「Agent 工作台」这个概念正在升温。越来越多人认同：AI 代理应该像队友一样领任务、报进度、沉淀产出，而不只是聊天框里一问一答的工具。

但有个更进一步的问题很少被谈到——**AI 到底能不能操控平台本身？** 不只是在系统里干活，而是帮你打理这个系统：整理看板、归档旧任务、维护标签、把经验沉淀成可复用的能力。

![Not just a worker — an operator of the platform itself](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-hero.png)

<!-- truncate -->

UnDercontrol 的答案来自它的底层理念：**一切皆代码（Everything as Code）**。正因如此，AI 在这里既是干活的队友，也能当打理系统的管理员。

### 核心：Everything as Code —— 平台本身就是 AI 的操作面

在 UnDercontrol 里，任务、笔记、看板、技能、自定义字段……**全都是纯 Markdown + YAML frontmatter**，通过同一个 kubectl 风格的 `ud` CLI 声明式管理：

```bash
# 建/改一个任务，就是 apply 一段文本
cat <<'EOF' | ud apply -f -
---
title: 发布 v1
status: in-progress
tags: [release, urgent]
metadata:
  priority: high
---
发布前检查清单……
EOF
```

![Everything as Code — tasks, boards, skills, metadata are all Markdown + one CLI](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-eoc.png)

关键在于：**AI Agent 用来读写代码的那套能力（跑命令、读写文本），原封不动就能读写整个平台。** 它能建任务、拆子任务、改状态、打标签、建看板（看板就是保存的查询）、把一段重复的提示词沉淀成新的 Skill、patch 自定义字段……这些管理动作本身，也是代码。

一句话：AI 不只是平台里的一个「**工人**」，它还能当「**管理员**」——因为管理这件事本身就是可编程的。

![An Engineering board — columns are saved queries the agent can build and reshape](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/app-board.png)

**典型场景**

- 「把这周所有 done 的任务归档，再按标签给 `release` 建一个新看板」——Agent 自己用 `ud apply` / `ud patch` 就做了，不用你点来点去。
- 「你刚才那套排查步骤，存成一个 Skill」——Agent 把对话里的方法 `ud apply` 成可复用技能，下次全队都能用。

### 把它拆开看：UnDercontrol 的 Agent 工作台

**Agent 即队友。** 你把需求写成任务、@提及一个 Agent，它自动领取，读取任务描述、Notes、Links 作为上下文，编写代码、运行测试、提交 commit，并把进度写回 Notes。它领到的不是一个黑盒 issue，而是**它自己也能增删改的结构化 Markdown**。

![Task detail — the agent reads the description and writes progress + commits back into the notes timeline](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/app-task.png)

**守护进程 / 运行时。** Agent 跑在你自己的开发机上（一个后台 **daemon** 通过 SSE 保持连接、实时回传终端输出）。这套远程工作区从 2026 年 4 月起就在打磨，如今 daemon 注册、SSE、多端触发、会话查看都已落地——发起和监控可以来自 Web、桌面应用、CLI，甚至手机。

**可复用的技能（Skills）。** Skill 是存在服务器上的可复用 prompt 模板，通过 `ud prompt` 注入给任意 Agent。而因为一切皆代码，**Agent 能用 `ud apply` 自己写、自己改 Skill**——技能库本身也是可编程的资产，越用越厚。

**不绑定单一 Agent。** UnDercontrol 是 agent-agnostic 的：通过 Agent CLI 命令模板接入 Claude Code、Codex、Cursor、Hermes 或任意终端智能体。不管你选哪个，它们驱动的都是同一个 [AI Agent CLI](/zh-Hans/docs/cli-ai-integration/)——所以换模型、换工具，不用换工作台。

**数据自主。** 任务和笔记就是带 YAML frontmatter 的纯 Markdown 文件，格式定义为开放的 [JSON Schema](https://github.com/oatnil-top/ud-schemas)（MIT）——可以用 Git 管版本、随时导出，也支持自托管（Docker Compose / K8s，SQLite / Postgres）。

> **不只是任务**：这套 Markdown 编辑器和「一切皆代码」的底座贯穿 UnDercontrol 的所有界面——任务、笔记，甚至账单和资源。Agent 工作台不是一个独立模块，而是这个底座长出来的能力。

### 为什么「AI 能操控平台本身」重要

大部分工具里，AI 负责**执行层**（写代码、跑测试），而**管理层**——整理看板、归档旧任务、维护标签体系、把经验沉淀成 SOP——还是压在人身上。

当平台本身就是代码，这条界线消失了：AI 能同时帮你分担执行和管理。你的知识库既是**内容**，也是一个**可编程的操作面**。你多一个会干活的队友，也多一个会打理系统的管理员。

![Most tools stop at execution; here AI shares the management layer too](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-layers.png)

### 小结

「Agent 工作台」的核心，是让 AI 稳定地干活、沉淀产出、可被指挥。UnDercontrol 更进一步——靠 **Everything as Code**，让 AI 能操控平台本身：

- 任务、看板、技能、元数据都是纯 Markdown + CLI 可管的代码；
- 于是同一个 Agent，既能**在平台里干活**（写代码、报进度），又能**操控平台本身**（建看板、归档、写 Skill、维护结构）；
- 全程 agent-agnostic、多端可触发、数据自主。

AI 在 UnDercontrol 里，既是队友，也是管理员。

![Everything as Code — so AI can run the platform, not just work in it](https://dl.udctl.com/features/blog/agent-workbench-everything-as-code/concept-cta.png)
