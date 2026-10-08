---
title: "Virtual Path：让任务沉淀成知识和文档"
description: "任务不该死在 Done 那一刻。Virtual Path 把做完的任务归档进策展过的知识树，Agent 能把一批任务浓缩成一篇文档，git 风格的 vault sync 把整棵树同步成本地离线的 Obsidian 原生 Markdown。"
authors: [lintao]
tags: [feature, guide]
date: 2026-07-18
image: https://dl.udctl.com/features/blog/virtual-path-tasks-become-knowledge/concept-1.png
---

我见过太多任务在"Done"的那一刻死掉。卡片一归档，里面的东西就再也没人看了——当时为什么这么设计、踩了什么坑、最后怎么验证的，全埋在里面。过两个月有人问起，只能凭记忆再讲一遍。

做 UnDercontrol 的时候我一直有个执念：任务不该是一次性的。它的正文本来就是一份 Markdown 文档，Notes 记着它怎么一步步演进，评论里留着当时的争论。这些东西做完就扔，太浪费了。

所以有了 Virtual Path。

![任务的终点不是 Done，而是知识树里的一个位置](https://dl.udctl.com/features/blog/virtual-path-tasks-become-knowledge/concept-1.png)

<!-- truncate -->

### 给任务一个位置

想法很简单：每个任务、每个上传的文件、甚至每个 Skill，都可以有一个虚拟路径，比如 `/engineering/backend/`。有路径的东西汇成一棵树，这就是 Explorer——长得像文件管理器，但底下没有真的目录。路径在哪，"文件夹"就在哪；内容删光了，文件夹自己消失。你永远不用维护一堆空目录。

任务做完了，值得留，就拖进 `/decisions/` 或者 `/engineering/`——它从一张完成的卡片变成了知识库里的一篇文档。不用复制粘贴到别的笔记软件，Notes 和评论都还挂在上面。

不值得留的呢？不用管。没归类的任务待在树根和"未归档"区，不会混进你整理好的目录。所以这棵树是挑出来的，不是堆出来的——什么东西配得上一个位置，你说了算。

![Explorer 树 + 任务即文档：左侧是知识树，右侧是一篇沉淀下来的架构文档](https://dl.udctl.com/features/blog/virtual-path-tasks-become-knowledge/explorer.jpg)

架构图、截图、白板照片这些文件也能放进同一个路径，一个专题的文字和素材挨在一起，省得回头去网盘里翻"那张图到底存哪了"。

顺带说一句，这套逻辑不只对任务成立。UnDercontrol 里所有能写字的地方——任务、笔记、记账、账户备注——用的是同一个 Markdown 编辑器，所以任何内容都能走这条路沉淀下来。

### 多个任务，一篇文档

更常见的情况其实是这样：一个专题做下来七八个任务，每个里面都有点零散的发现，但没有一个能直接当文档用。

这种活我现在都交给 Agent。Claude Code、Codex、OpenCode，随便哪个终端 Agent，都能通过 ud CLI 把这批任务通读一遍，提炼成一篇新文档，放进知识树对应的目录。原始任务一个不动，留着当原材料，想追溯随时能翻。知识库里存的是蒸馏过的结论，不是过程的堆积。

### 同步到本地，离线也是你的

知识放在服务器上只是第一步。我自己的习惯是：文档一定要能落到自己的磁盘上，用自己顺手的编辑器改。

ud CLI 的同步是 git 风格的（基础用法之前写过一篇：[像 git 一样管理任务：ud pull / push](https://oatnil.com/zh-Hans/blog/2026/07/07/ud-pull-push/)）：

```bash
ud init /Knowledge/   # 把当前文件夹绑定到一个虚拟路径
ud pull               # 拉取：任务变成本地 .md 文件
ud push               # 推送：本地修改写回服务器
ud status             # 看看两边差了什么
```

现在默认的 vault layout 是 Obsidian 原生的：

```
MyVault/
├─ engineering/backend/
│  └─ SSE reconnect backoff.md     ← 一个 .md = 一个任务
├─ notes/SSE reconnect backoff/    ← 任务的 Notes，按任务分组
│  └─ soak test results.md
├─ attachments/diagram.png         ← 资源文件（--fetch-attachments 拉取）
└─ .udignore
```

pull 下来之后，这就是一个完全离线的本地知识库。纯 Markdown 躺在磁盘上，断网能读能改，飞机上照样写，落地一句 `ud push` 同步回去。数据是你的，两份都是。

![vault sync：服务器上的虚拟路径树 ⇄ 本地 Obsidian vault](https://dl.udctl.com/features/blog/virtual-path-tasks-become-knowledge/concept-2.png)

细节上花了不少功夫，挑几个说：ud 只在文件头上写一行 `ud-id`，其余 frontmatter 原样保留；本地把文件改个名，push 之后任务标题跟着变；Obsidian 里写的 `[[双链]]`，push 时自动翻译成 ud 的 `task://` 链接，pull 时再翻回来，两边点击都能跳转；不想同步的文件写进 `.udignore`，gitignore 语法；冲突处理也是 git 式的——两边都改过的条目会被标记出来默认跳过，绝不悄悄覆盖你的修改。老用户想从旧目录结构切过来，`ud migrate-layout` 一条命令的事。

### 让 Agent 整理你的知识树

知识库用久了都会乱。目录越挖越深，命名各写各的，过时的和新的混在一起——我的也一样。

但整理这种批量活，恰好是 Agent 最擅长的。vault 就是个本地文件夹，`ud pull` 之后让 Agent 通读整棵树：重组目录、合并重复、统一命名、把过时的挪进归档。它做的全是普通文件操作，你用 git 或 `ud status` 把改动过一遍目，满意了再 `ud push`。Web 端的 Explorer 立刻变成整理后的样子。

![分层模型：内容层是你的 vault，协作层是 ud 的 overlay](https://dl.udctl.com/features/blog/virtual-path-tasks-become-knowledge/concept-3.png)

敢这么放手让 Agent 动，是因为分层分得清楚：vault 这层是内容——纯文本、可 git、谁都能改；状态、看板、评论、Notes 时间线是 ud 那层的协作元数据，挂在内容之上，就像 PR 评论不会写进 git tree。Agent 动的是内容层，协作历史一点不丢。

整理好的树也不会锁在某台电脑里。网页端、桌面端、手机端看到的是同一棵树：通勤路上手机翻一篇 ADR，工位上网页端慢慢改，终端里交给 CLI 和 Agent 批量处理。整理一次，哪儿都能用。

---

任务的终点不该是"Done"。值得留下的东西，给它在知识树里一个位置——一次拖拽，一条命令，或者，交给你的 Agent。
