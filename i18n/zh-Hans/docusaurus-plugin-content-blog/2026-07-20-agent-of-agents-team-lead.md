---
title: "Agent 的 Agent：当 AI 学会带团队"
description: "配了三个 agent，产出没翻三倍，你自己成了路由器。lead 会话一启动就被注入花名册，靠两条通道委派，组织树还能递归生长——你的活从指挥变成写岗位说明书。"
authors: [lintao]
tags: [feature, agents]
date: 2026-07-20
image: https://dl.udctl.com/features/blog/agent-of-agents-team-lead/concept-hero.png
---

你配了三个 agent，本以为效率会翻三倍。结果一天下来，你在做这几件事：把 A 的结论复制给 B、想起来该催 C 了、同时读三份产出、在脑子里维护"谁在干什么"。

**agent 变多了，瓶颈从"干活的人不够"变成了"管事的人只有你一个"。**

这不是配置问题，是组织结构问题。一个人直接带十个下属，在人类公司里也不成立——解法从来不是招更强的员工，而是**多一层管理**。

![一个人指挥 N 个 agent，和让 lead 替你路由](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/concept-hero.png)

<!-- truncate -->

### lead 不是一个更聪明的 agent，是一个知道花名册的 agent

在 UnDercontrol 里，你可以把若干 agent 编成一个 **Team**：一个 **lead**，若干 **成员**，每个成员带一条 **delegation hint**——"什么活该路由到这儿"。

这条 hint 就是岗位说明书。它不长，但它决定了 lead 会不会把活派对人：

```
- @db-expert [reviewer] — schema 变更、慢查询、迁移脚本
- @ud-tester — 需求验收、黑盒回归，别让它改代码
- @infra-ops [remote — mention only] — 服务器、部署、DNS
```

![Team 配置 — 一个 lead、四个成员，每人一条分工提示](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/app-teams.png)

关键在于：**lead 的会话一启动，这份花名册就被注入到它的初始提示词里**。它不需要你在对话里介绍团队，也不需要每次现学——它天生就知道自己手下有谁、谁擅长什么、以及该怎么把活交出去。

![花名册进入 lead 提示词时的样子](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/app-injected-prompt.png)

同时被注入的还有一句朴素但要命的指令：**"作为 lead，能交给成员的就别自己写。你的工作是协调、跟用户沟通、审专家的产出。只有没人覆盖这块活的时候，才自己动手。"**

如果你带过团队你会知道，这句话正是新晋 leader 最难学会的一课。

### 两条委派通道：一条快，一条留痕

这是很多人想不到的一层设计。委派并不只有一种做法，lead 手上有两条通道，默认走快的那条：

**通道一：原生子 agent（默认）**

lead 先跑一句 `ud describe agent <name> -o prompt` 把成员的身份提示词取出来，再用宿主工具**自己原生的子 agent 能力**把它拉起来，附上任务上下文。子 agent 跑在 lead 自己的会话和权限里，结果由 lead 汇总，并在汇报时注明"via @某成员"。

分工很清楚：**ud 提供身份、技能和上下文，宿主工具负责执行。** 快、同步、没有额外开销——适合"帮我看一眼这段 SQL"这种一问一答的活。

**通道二：子任务 + @提及（升级通道）**

当出现下面任一情况，lead 会升级到第二条通道：

- 成员被钉在**另一台机器**上（比如只在生产跳板机上跑的运维 agent，花名册里标着 `[remote — mention only]`）
- 活是**长跑**，要活得比 lead 这次会话更久
- 你需要这件事有**独立的问责线程**，事后能单独翻账

做法是：建子任务 → `ud link task <parent> <child> --subtask` → 在子任务的评论里 @ 那个成员。@提及会自动为对方拉起一个 workspace 会话，**并且委派链保留你的权限范围**——成员拿到的访问权限不会比你更大。它干完把结论回到线程里。

一句话记：**要快就用子 agent，要留痕、要跨机器、要跑得久就用子任务 + @。**

![两条委派通道对比](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/concept-channels.png)

### 递归：agent 的 agent 的 agent

Team 可以嵌套——一个成员自己也可以是另一个 Team 的 lead。于是层级自然生长，而**每个 agent 只需要认识自己的直属下属**，不需要知道整棵树。这跟真实组织的运作方式是一样的。

更进一步：默认的 `ud` agent 是整个组织的**根管理者**。除了它自己明确带的队，**所有顶层 team lead 都会被自动注入成它的直属下属**——于是不管你的组织长到几层，从 `ud` 出发整棵树都是可达的。

你不需要记住该 @ 谁。@ 一下 `ud`，它自己往下找。

![组织树 — 每个节点只认识自己的直属下属](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/concept-tree.png)

### 于是你的工作变了

从"指挥 N 个 agent"变成了三件更像管理者的事：

1. **写岗位说明书。** delegation hint 写得含糊，活就派错人。写清楚"什么活来这儿、什么活别来"，比给 agent 换个更贵的模型有用得多。
2. **定验收标准。** 你审的是产出，不是过程——标准写在任务描述里，lead 拿它去验成员，你拿它去验 lead。
3. **守住 review 关口。** 委派链再深，最后签字的还是你。

顺带一提，agent 之间来回写的这些东西——任务描述、评论、备注——跟你手写的内容共用同一套 Markdown 系统。而且不只是任务：备注、账目、账户……UnDercontrol 里所有能写字的地方，编辑体验都是同一个。人和 agent 读写的是同一份东西，没有"给 AI 看的格式"和"给人看的格式"之分。

### 几个容易踩的坑

- **lead 自己把活干了。** 最常见的失败模式。通常是因为 delegation hint 太空泛，lead 判断不出该给谁，索性自己上。
- **对方机器不在线，@ 就静默失效。** 提及**不会排队等机器上线**——投递会被直接判定为 daemon 离线丢掉。派远程活之前先确认那台机器连着。
- **同一个任务上，同一个成员只能有一个活跃会话。** 想让一个 agent 并行推两件事，就得拆成两个任务，而不是在一个任务里 @ 它两次。
- **嵌套团队目前没有环检测。** A 带 B、B 又带 A 这种配置，系统不会拦你。层级自己心里有数——三层基本到顶了，再深你在 review 时就看不懂链条中间发生了什么。
- **review 债。** 委派得越顺，待审的产出堆得越快。管理的瓶颈会从"派活"转移到"验收"——这一段目前没法外包。

### 说到底

选什么 agent 当 lead 都行。Claude Code、Codex、OpenCode，任何终端 agent 都可以是 lead 或成员——角色由提示词和技能定义，工具由 Agent CLI 配置决定，而它们全都通过同一个 [AI Agent CLI](/zh-Hans/docs/cli-ai-integration/) 与这个组织对话。UnDercontrol 不绑定任何一家 AI。

它只负责一件事：**当 agent 多到需要被管理的时候，给你一层管理结构，而不是让你自己去当那层结构。**
