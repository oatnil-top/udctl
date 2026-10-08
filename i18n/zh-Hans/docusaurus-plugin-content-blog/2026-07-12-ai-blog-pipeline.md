---
title: "凌晨一点,AI 在我的任务系统里写博客"
description: 每日定时任务创建一个"描述即 Prompt"的任务,AI Agent 夜里完成草稿并挂为笔记,人早上在评论区一句话反馈——没有任何 AI 专属设施,只用任务系统本身。
authors: [lintao]
tags: [feature, workflow]
date: 2026-07-12
image: https://dl.udctl.com/features/blog/ai-blog-pipeline/concept-hero.png
---

早上八点,我端着咖啡打开看板。Pending 列里躺着一个新任务:

> **2026-07-12 博客草稿 (Blog Draft)**

点开,里面是一篇写好的中文博客草稿。评论区有两条凌晨留下的消息:

> **01:01** — On it — topic scan done, picking task-management-overview. Drafting ZH now.
>
> **01:03** — Done — ZH draft is in the note. Task set to pending for review.

写它的不是人,是一个 AI Agent。我睡觉的时候,它挑了选题、查了产品文档、写完草稿、把任务挪到"待审核",然后在评论区跟我打了声招呼。

<!-- truncate -->

![Kanban board with the blog draft task sitting in the Pending Review column](https://dl.udctl.com/features/blog/ai-blog-pipeline/kanban-pending.png)

我读完草稿,在评论区回了一句:"范围太大,写故事细节。"几分钟后,草稿被重写了——你现在读的这篇,就是那次重写的产物。

这篇文章讲讲这条流水线是怎么搭起来的,以及为什么"任务系统"是人和 AI 之间最舒服的交接点。

### 任务不只是"待办事项"

先说一个核心设计理念:在 UnDercontrol 里,**任务是通用的信息容器**,不只是一条待办。

一个任务可以是:

- 一条真正的待办("修复登录页的校验 bug")
- 一篇文档(设计方案、会议记录、Wiki 页面)
- 一个决策记录(为什么选了方案 B)
- 一篇博客草稿(本文的草稿就是一个任务的笔记)

任务的正文是 Markdown,配合标签和自定义元数据,你可以自由定义"这是什么"——而不是被工具的数据结构绑架。

### 问题:我想持续写博客,但不想每天从零开始

做产品的人都懂:内容要持续输出,但写作的启动成本高得离谱。选题、查资料、组织结构、写初稿——每一步都在消耗本来该拿去写代码的精力。

让 AI 全自动写完直接发布?不行。没有人把关的内容,发出去砸的是自己的招牌。

我要的是一条**人机协作流水线**:AI 负责脏活累活(选题去重、查文档、写初稿),我只负责最值钱的那一步——判断和反馈。

于是问题变成:**AI 干完的活放哪?我在哪 review?反馈怎么传回去?**

答案是:全放在任务系统里。

### 流水线全景:一个任务的 24 小时

整条流水线没有专门的"AI 平台",就是任务系统自己的四个原生能力拼起来的:定时任务、@提及、笔记、评论。

![The 24-hour handoff loop: scheduled job creates the task, mention wakes the agent, draft lands as a note, human reviews in the morning](https://dl.udctl.com/features/blog/ai-blog-pipeline/concept-hero.png)

**01:00 — 定时任务开闸**

一个每日定时任务(CRON)自动创建当天的草稿任务。任务描述就是给 AI 的完整指令,开头 @ 了我的 Agent:

```markdown
[@ud-agent](mention://member/...)

Generate ONE Chinese blog DRAFT for review — do NOT run the full publish pipeline.

1. Pick a topic from `auto/blog-topics.json`. Skip topics already covered —
   check with `ud grep task "<slug>"`. Choose the first uncovered topic.
2. Write ONLY the ZH text draft as a NOTE on THIS task.
3. Set THIS task status to `pending` and reply in the comment thread.
```

注意这里的设计:**任务描述本身就是 Prompt**。指令、边界("不要发布")、验收标准("置为 pending"),全写在任务里。不需要单独的配置系统——任务就是配置。

![Scheduled Jobs page showing the daily 01:00 blog-draft job](https://dl.udctl.com/features/blog/ai-blog-pipeline/scheduled-job.png)

**01:01 — Agent 被 @ 醒**

@提及触发了 Agent 的工作会话。它在我的 Mac 上醒来,做的第一件事不是写作,而是干侦探活:

- 读取选题清单(仓库里的一个 JSON 文件,18 个候选选题)
- 用 `ud grep task` 和 `ud query "tags CONTAINS 'blog'"` 翻旧任务,查哪些选题已经写过
- 27 个历史博客任务过一遍,发现只剩 2 个选题没写——选了排在前面的那个

然后它在评论区留了第一条消息("On it — picking task-management-overview"),才开始动笔。写作之前,它还去翻了产品文档核对功能细节——AI 最大的毛病是一本正经地胡说,让它先读文档能治大半。

**01:03 — 草稿落地,任务转 pending**

草稿写完,不是发到什么"AI 输出面板",而是作为一条**笔记**挂在任务上。任务状态被置为 `pending`——在我们的状态模型里,`pending` 的意思是"我做完了,等别人"。它在评论区留下第二条消息,收工。

整个过程两分钟,发生在我睡着之后。

**08:00 — 我上线,只做判断**

我的 review 界面就是任务详情页:草稿在笔记里,上下文在描述里,Agent 的工作日志在评论区。我不需要打开任何别的工具。

![Task detail page: the scheduled prompt as description, the draft as a note below](https://dl.udctl.com/features/blog/ai-blog-pipeline/task-detail.png)

读完草稿,我在评论线程里回了一句话。这句话又触发了 Agent 的新一轮会话——它读到反馈,**用 `note_id` 更新同一条笔记**(不是新建一条,笔记有完整编辑历史,改坏了随时回滚),然后在线程里回复我改了什么。

一来一回,像跟一个异地同事在工单里协作。区别是这个同事凌晨一点上班,而且从不抱怨返工。

![The comment thread: agent reports progress, human replies with one-line feedback, agent confirms the rewrite](https://dl.udctl.com/features/blog/ai-blog-pipeline/comment-thread.png)

### 为什么交接点是"任务",而不是聊天窗口

跟 AI 在聊天窗口里协作,最大的问题是**产出会沉底**。昨天让它写的东西,今天要往上翻五十屏;换个会话,上下文全丢。

把交接点换成任务,每个环节都有了原生的容器:

- **任务描述** = 需求和指令(living document,永远是最新版)
- **笔记** = 产出物和过程记录(追加式时间线,带编辑历史)
- **评论** = 轻量对话(短平快,带 @ 通知)
- **状态** = 工作流位置(`pending` 就是"等人审",看板一眼扫出所有待审项)

而且这些东西 AI 和人访问的是**同一个入口**。我在网页和手机上看,Agent 在终端里用 CLI 读写:

```bash
ud describe task 51c4981e      # 读任务(含笔记、评论、附件)
cat draft.md | ud apply -f -   # 写笔记
```

因为入口是 CLI + Markdown,这条流水线不绑定任何特定的 AI 工具——Claude Code、Codex、OpenCode,或者任何能跑终端命令的 Agent,都能接进来。今天换个 Agent,流水线一行不用改。

### 这个模式能复制到哪

博客草稿只是最顺手的例子。同样的"定时任务 / @提及 → Agent 干活 → 笔记留档 → pending 等审 → 评论反馈"回路,我们还用在:

- **发布验证**:CI 发完版,自动建任务附上 release notes,Agent 跑冒烟测试、把结果写进笔记
- **每日站会**:定时任务每天建一个站会任务,Agent 汇总昨天所有任务的变更写成摘要
- **代码调研**:把"调研 X 方案"扔给 Agent,醒来看笔记里的对比结论,评论区追问细节

共同点只有一个:**AI 的每一步工作都留在任务里,人只在关键节点出现**。

### 小结

这条流水线没有用到任何为 AI 专门发明的概念。定时任务、@提及、笔记、评论、状态——都是任务系统本来就有的东西。只是当你的任务系统同时满足三个条件时,它自然就成了人机协作的工作台:

1. **Markdown 原生** — AI 读写无障碍,不需要转换层
2. **CLI 入口** — 任何终端 Agent 都能接入,不绑定厂商
3. **状态 + 评论 + 笔记齐全** — 交接、审核、留档各有其位

顺便说一句:这篇文章自己,就是这条流水线在 2026 年 7 月 12 日凌晨的产物。你读到的版本,是人类评论一句"范围太大,写故事细节"之后的第二稿。
