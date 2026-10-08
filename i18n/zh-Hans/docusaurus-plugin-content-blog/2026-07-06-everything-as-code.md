---
title: "Everything as Code:当你的任务变成一段可以提交进 Git 的 Markdown"
description: 在 UnDercontrol,一个任务就是带 YAML frontmatter 的 Markdown——可版本控制、用 kubectl 式 CLI apply、任何终端 AI agent 都能读写。给你的待办办 GitOps。
authors: [lintao]
tags: [feature, guide]
date: 2026-07-06
---

我们已经习惯了 "X as Code":基础设施即代码、配置即代码、文档即代码。原因很简单——纯文本可以 diff、可以 review、可以版本控制、可以被脚本和 AI 直接读写。

那为什么你的**任务、笔记、待办**,还锁在某个 SaaS 的数据库里,只能通过它的 UI 一个个点?

UnDercontrol 的答案是:**Everything as Code**。在这里,一个任务就是一段带 YAML frontmatter 的 Markdown。仅此而已。

![任务即 Markdown:一段带 frontmatter 的纯文本,apply 后渲染成任务卡片](https://dl.udctl.com/features/blog/everything-as-code/concept-1.png)

<!-- truncate -->

### 一个任务长什么样

```markdown
---
title: 给发布流程加上冒烟测试
status: in-progress
tags: [release, testing]
deadline: 2026-07-10
---
## 目标
每次发版前自动跑一遍关键路径,失败就阻断 tag。

## 步骤
- [x] 登录 + 建任务
- [ ] 浏览三个核心页面
- [ ] 断言无 console error
```

frontmatter 是这个任务的**结构化元数据**:标题、状态、标签、截止日期、指派人、链接——覆盖 80% 场景的那 20% 字段都是一等公民,并且可查询。frontmatter 下面的正文,是这个任务的**正规文档(Single Source of Truth)**:一段能长期演进的 Markdown。

没有专有格式,没有需要导出的二进制,没有 vendor lock-in。你看到的就是全部。

### apply,就像 kubectl

把这段 Markdown 存成文件,然后:

```bash
ud apply -f task.md
```

规则和 `kubectl apply` 一模一样:frontmatter 里**没有 id 就是创建,有 id 就是更新**。apply 是**整体替换**——文件即真相。

想批量导出、改完再灌回去?`ud get task -o apply` 会把任务输出成 apply 能吃的同一种格式,round-trip 无损。这意味着你的任务列表可以像代码一样被 sed / jq / 脚本处理,再一次性 apply 回去。

![无损 round-trip:ud get -o apply 导出成本地 md,脚本处理后再 ud apply 回去](https://dl.udctl.com/features/blog/everything-as-code/concept-2.png)

### 为什么这对开发者(和 AI)是解锁级的

**1. 可版本控制、GitOps 友好。** 任务是纯文本,自然可以 diff、可以进 Git、可以走 PR review。你的项目计划和你的代码可以住在同一个 commit history 里。

**2. AI agent 的原生输入输出。** Markdown 是人类可读、也是 AI 可读的。任何终端里的编码 agent——Claude Code、Codex、OpenCode 或任意 terminal-based agent——都能通过 `ud` CLI 直接读写你的任务,不需要专门的插件或 SDK。整个知识库是 plain-text-native、AI-ready 的。

```bash
# agent 在你的终端里就能干这些
ud get task 'status = in-progress'
ud apply -f new-task.md
ud describe task 8b30140e
```

**3. 可脚本化、可组合。** 类 SQL 的查询语法 + kubectl 式的动词(get / describe / apply / delete / patch),让任务管理变成一件能塞进任何自动化流程的事。CI 里建任务、脚本里批量改标签、cron 里生成周报——都只是几行 shell。

![多入口单一真相:CLI、AI agent、CI 脚本都通过 ud apply 写入同一份 Markdown 数据源](https://dl.udctl.com/features/blog/everything-as-code/concept-3.png)

### 不只是任务

这里有个容易被忽略的点:UnDercontrol 的 Markdown 编辑器**不是任务专属的**。它是一个共享在所有文本表面上的编辑器——任务、笔记、甚至开支和账户的备注,用的都是同一套编辑体验、同一套 Markdown 内核。

所以 "Everything as Code" 里的 "Everything" 是字面意义的:你的待办是 Markdown,你的笔记是 Markdown,你记的一笔账的说明也是 Markdown。一个数据源,按你喜欢的方式组织,all-in-one。不用在多个 app 之间切换,AI agent 也只需要学会一个工具就能访问你的全部信息。

### 三层内容结构

每个信息单元有三层,各有设计意图,但你完全可以按自己的习惯用:

| 层 | 格式 | 设计意图 |
|----|------|----------|
| **任务正文** | Markdown | 正规的、持续演进的文档——Single Source of Truth |
| **笔记 (notes)** | Markdown | append-only 时间线——记录这个信息单元如何演进 |
| **评论 (comments)** | 纯文本 | 轻量的、线程式的对话——短而聚焦 |

区分一个 "文档" 和一个 "任务" 的,不是数据结构,而是**标签、元数据和视图**。UnDercontrol 不强制你用某种目录层级或打标签规范——同一个任务可以出现在多个 board(board 本质是"保存的查询",不是容器,所以没有重复)。

### 开始用

如果你也受够了把想法困在某个 UI 里,试试把它们变成可以 apply 的 Markdown:

```bash
ud apply -f my-first-task.md
```

Everything as Code,不只是一句口号——它是让你的任务、你的脚本、你的 AI agent 终于说同一种语言的方式。
