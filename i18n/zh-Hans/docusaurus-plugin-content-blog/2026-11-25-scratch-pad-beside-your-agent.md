---
title: "聊到一半冒出的想法，终于有地方放了：就在 agent 旁边"
description: "和 agent 聊方案，它写的在聊天里往上滚，你写的在另一处。在 udctl（UnDercontrol）桌面端，卡就在会话旁边：agent 往上写，你在上面改，会话结束它还在，搜得到。"
authors: [lintao]
tags: [feature, story]
date: 2026-11-25
image: https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/01-cover.jpg
---


Dana 一个人开设计工作室，正在给客户 Northwind Cafe 筹备两天的品牌 workshop。她和 agent 聊方案，聊到一半，想起一件事：预算有上限，场地也不用租，就在咖啡馆里办。

这句话放哪？打在聊天里，过几轮就被刷上去了。记进笔记软件，agent 看不到。另开一个文档，下次要找的时候，又得想当时放在了哪。

我们把这件事拍成了一支 99 秒的视频：[在 B 站观看](https://www.bilibili.com/video/BV1e41Fz9Ed4)。这篇是文字版，截图取自片中画面，Dana、她的工作室、Northwind Cafe 和方案里的数字都是演示数据。

![一个想法，聊天、笔记软件、文档三个去处，放大镜在找它](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/02-where-did-i-put-it.jpg)

<!-- truncate -->

## 两摊东西，来回搬

聊方案的时候，agent 写的在一处：一份长回答，留在聊天里往上滚。Dana 写的在另一处：笔记里的几行字，一张随手画的草图。

想让 agent 照着她的想法改，她得把笔记复制进聊天框；agent 改完，她再把结果复制回文档。下次打开，还要对一遍哪份是新的。

![左边一摞是 agent 写的，右边一摞是你写的，中间一个问号](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/03-two-piles.jpg)

## 想法有了固定去处：会话旁边就是卡

在 [udctl](/)（UnDercontrol）桌面端，从一张卡上开 agent 会话，弹出来的窗口左边是这张卡，右边是终端。和 agent 聊天，草稿区就在手边。

Dana 的卡叫「Northwind Cafe: brand workshop plan」，一开始只有一行字：两天，里斯本，12 个人，三月初。她点 Run，写了一句要求：

> Draft the full plan onto this card: agenda for both days, a Mermaid timeline of the two days, budget table, open questions.

agent 把整份方案写进了左边这张卡。Dana 没有点刷新，内容自己出现在左栏。

想看方案就把中间的分隔线往右拖，想看终端就往左拖。

![拖过分隔线之后，左边的卡更宽，方案和议程表都看得清](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/05-drag-the-divider.jpg)

## 该留的留在卡上，其余的随它滚走

agent 干活时会在终端里刷很多东西：跑了什么命令、读了什么、最后一段总结。这些看过就行，不用都存下来。

方案写在卡上。之后终端再滚多少屏，左边那份都在原处。

![左边卡上标着 KEPT，右边终端标着 SCROLLS AWAY](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/04-kept-and-scrolls-away.jpg)

卡里也不只有字。议程和预算是表格，两天的时间线是 agent 写的 Mermaid，在卡里直接画成了图。

![卡里渲染出来的 Mermaid 时间线，下面接着预算表](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/06-timeline-on-the-card.jpg)

## 你的想法也写在同一张卡上

方案最后留了十个待定问题，第五个就是预算有没有上限。Dana 点左栏的铅笔图标，在末尾写了一行：

> Dana: budget ceiling is 12k EUR all in. Drop the hotel venue, keep it at our own cafe.

![待定问题下面，Dana 写的一行字](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/07-your-line.jpg)

她又把咖啡馆的平面草图贴了进去：一张十二人的长桌，一面钉板墙，一块屏幕，靠里是吧台。然后保存。

![贴进卡里的咖啡馆平面草图](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/08-your-sketch.jpg)

## 不用复制粘贴，说一句它就接着改

Dana 回到右边的终端，打了一句：

> I added a line at the bottom of the card. Rework the plan to fit it.

agent 去读卡，读到那一行，也读了那张草图，然后把方案重写了一遍。它把 Dana 的那行字和草图挪到了方案前面，标题叫 Client brief，字没有改。

![agent 重写后的卡：Dana 的那行字和草图排在最前面，右边终端里是它读卡、下载草图、写回的记录](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/09-agent-picks-up-your-edit.jpg)

场地费从 1,800 欧变成 0，总价从 15,114 欧降到 11,660 欧，在 12,000 的上限以内。新加的 Room setup 一节按草图安排：十二个座位怎么坐，一面墙怎么轮着用，茶歇放在吧台。

![新预算表，旧版和新版两列并排，合计从 15,114 变成 11,660](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/10-new-budget.jpg)

## 下次找得到

会话结束了，卡还在。Dana 想接着看，在桌面端按 Cmd+P，输入 workshop，这张卡就在结果里，右边带着正文预览。打开，方案在，她那行字和草图也在。

![搜索 workshop，结果里是这张卡，右侧是正文预览](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/11-search.jpg)

## 怎么开始

1. 装好你常用的 agent CLI，用 udctl 桌面端 v0.191.0 或更新的版本打开一张卡。
2. 点右侧工具条的终端图标，选 Run，写一句要求，点 Run。会话窗口会左右并排弹出来。
3. 要求里写明「写到这张卡上」，agent 就会把内容写进卡的描述。
4. 等 agent 写完再动笔，改完保存，到终端里说一声改了哪里，让它接着做。

Claude Code、Codex、OpenCode 或任何在终端里跑的 agent 都可以，片子里用的是 Claude Code。

典型场景：

- 写方案：agent 出初稿，你在卡上批几句，它照着改。
- 查问题：终端里翻日志，卡上只留结论和复现步骤。
- 聊到一半想起别的事：等 agent 停下来，在左边记一行，下一轮交给它。
