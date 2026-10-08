---
title: "把评论钉在正文的那一行上：UnDercontrol 的锚定评论"
description: "选中任务正文里的一句话就地评论，引文和高亮跟着原文走；线程像 code review 一样 resolve，@ 一下 agent 就能让它在同一条线程里回复。"
authors: [lintao]
tags: [feature, collaboration]
date: 2026-07-25
image: https://dl.udctl.com/features/blog/anchored-comments/concept-anchored.png
---

需求写完发出去，讨论就开始散架。同事在群里回一句"第三段那个字段是不是应该可空"，你得翻回文档、数到第三段、再猜他说的是哪个字段。隔天再看到这条消息，上下文已经没了。

![锚定评论：讨论钉在它所讨论的那一行上](https://dl.udctl.com/features/blog/anchored-comments/concept-anchored.png)

<!-- truncate -->

UnDercontrol 的锚定评论把讨论留在原文旁边。在任务正文里选中一句话，气泡菜单点 Comment，右边侧边栏就多出一条带着这句引文的评论，正文里那句话同时变成高亮。以后谁点这块高亮，侧边栏就跳到对应的讨论。引用信息记在评论上，正文的 markdown 一个字都没被改过，复制出去、用命令行拉下来，还是你写的那一份。

![任务正文里的高亮句子，右侧边栏是对应的锚定评论线程](https://dl.udctl.com/features/blog/anchored-comments/shot-1-anchored-thread.png)

一条讨论谈完，点 Resolve，高亮从正文里消失，线程折叠成一行灰字，需要时能重新打开。别人回复的时候你这边的线程会自己更新，不用刷新页面。手机上不画高亮，评论排在正文下面。

### 需求评审，像 review 代码一样

评审的人不用再写"第三段第二句那里……"。选中"支持批量导入"这一行，问一句"上限是多少"，作者在同一条线程里回，谈拢就 resolve 掉。

一份需求过完一遍，页面上还亮着的高亮就是没谈拢的地方。不用再单独整理一份会议纪要，剩下的未解决线程本身就是待办清单。

![评审过一遍之后的评论侧边栏：已解决的线程折叠成灰字，剩下的是还没谈拢的](https://dl.udctl.com/features/blog/anchored-comments/shot-2-review-pass.png)

### 指着一行让 agent 去改

这是和普通评论区最不一样的地方。选中要改的那段需求，留一条评论 @ 上你的 agent，写清楚改成什么样。这个 @ 会拉起一个 agent 会话（本来在跑的就接着用），它干完活之后，回复就是这条线程里的下一条评论，和同事的回复排在一起，commit hash 也贴在里面。你点一下高亮，就回到了被改的那段原文，能直接对照。

人和 agent 在同一条线程里说话，不用你在两个工具之间来回转述。

![人在评论里 @ 了 agent，agent 的回复带着 commit hash 排在同一条线程里](https://dl.udctl.com/features/blog/anchored-comments/shot-3-agent-thread.png)

### 长文档的分段讨论

任务正文当设计文档写，每次迭代记一条 Note。讨论各自锚在自己那一段上：正文的评论一组，每条 Note 的评论各一组，没有锚点的闲聊单独一组。三个月后回来看，某个决定当初为什么这么定，就写在那句话旁边。

### 终端里也能回同一条线程

评论在终端里同样能读能写。ud CLI 把评论当成和任务一样的资源，人在网页上留的讨论，agent 在终端里读得到，也能回：

```bash
# 读一个任务下的所有讨论
ud get comments --task 02c137b3

# 回复某条线程
cat <<'EOF' | ud apply -f -
---
task_id: 02c137b3
parent_id: 7a1c9f2e
---
按用户维度限流改完了，commit a1b2c3d4。
EOF
```

Claude Code、Codex、OpenCode 或者任何跑在终端里的 agent 都不需要额外的适配层。谈完了用 `ud patch comment <id> --status resolved` 收尾。

锚定评论从 v0.88.0 起可用，网页端、桌面端和 CLI 都已经支持。
