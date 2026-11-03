---
title: "DeepSeek 说 agent 的瓶颈在人的注意力:在 udctl 里少盯几个终端窗口"
description: "DeepSeek 的 Super-agent 文章说,agent 的瓶颈转到了人的注意力上。它拆出来的几件事:一个任务一个会话、事件触发、线程回复直达干活的会话、只在需要人拍板时出声、跑在你自己的机器上,在 udctl 里都有已经上线的对应。"
authors: [lintao]
tags: [feature]
date: 2026-11-03
image: https://dl.udctl.com/features/blog/super-agent-attention/en-01-mapping.png
---

10 月 31 日,DeepSeek Harness 团队发了一篇《Super-agent 设计探索:迈向更自主的 Agent 系统》,同时开源了研究原型 dsh-superagent。文章的出发点是:模型完成单个任务需要人插手的次数在变少,瓶颈转到了人的注意力上。原型 README 把原则写成一句:用尽量少的人类注意力,换尽量多的价值。

如果你同时开着好几个 Claude Code、Codex 或 OpenCode 窗口,这个瓶颈你大概已经碰到过:窗口一多,就分不清哪个在等你回话、哪个早就跑完了。

udctl(UnDercontrol)里没有一个叫 super-agent 的功能。但那篇文章拆出来的几件事,udctl 现在各有一块已经上线的对应:请求从事件来、每个任务一个独立会话、后续消息直接回到对应会话、只在需要人的时候出声、跑在你自己的机器上。下面按「你能少操心什么」来讲,每条都写明对应的是哪个功能。

![左列是 DeepSeek Super-agent 设计的六个部分,右列是 udctl 里已经上线的对应功能](https://dl.udctl.com/features/blog/super-agent-attention/en-01-mapping.png)

<!-- truncate -->

## 不用再守着一排终端窗口

DeepSeek 的设计里,Worker 是上下文互相隔离的会话,一个 Worker 做一件事。

udctl 的做法是一张卡片加一个 agent 等于一个会话。你在卡片里 @ 一个 agent,后端给它在这张卡上开一个会话;同一个 agent 在另一张卡上被 @,是另一个会话,两边的上下文不混。哪些会话在跑、哪些在等输入,`ud get sessions` 一条命令列出来,不用靠记忆分辨窗口。

截至 11 月 3 日,我们自己的工作区里累计有 5451 个这样的会话。

## 不用每次都敲提示词

文章把 agent 的输入叫 Trigger:群聊消息、邮件、日历提醒、代码评审评论、CI 结果,而不是人在输入框里敲一段 prompt。

udctl 里能叫醒 agent 的入口有三类:

- 卡体、笔记或评论里的 @mention;
- 通过 Telegram、Discord 或桌面版的快速输入发给 Alfred;
- 定时任务:到点建一张卡,卡体里的 @ 直接叫醒 agent;或者用 `wake_agent_session` 唤醒一个已有的会话。

上一篇[《把每天的小决定交出去》](/blog/2026/10/25/hand-off-the-small-daily-decisions)里那个准备语法课的定时任务,到 10 月 24 日触发了 88 次,作者没有为它敲过一次提示词。

## 回复自动回到在干活的那个会话

DeepSeek 的设计里,同一个 Thread(一个 PR、一个 IM 话题、一串邮件)的后续消息绕过 Router,直接送给订阅了它的 Worker。

udctl 的评论线程是同一个机制。agent 在一条线程里发过言,就订阅了它;你之后在线程里回复,消息直接送进它在这张卡上的会话。会话中途断了也不丢:下次启动时它读的就是这条线程,中间说过的话都在。

## 只在需要你拍板时被叫到

文章里的 agent 只在需要人决策或签收时才在 IM 里发言,团队还试过每条回复限 100 字。

udctl 0.181.0 把侧栏的「Needs you」改成只列 @ 了你的线程。agent 干完一轮不再自动算作「在等你」,只有它真的 @ 你,那条线程才出现在这里。其余线程照常在 Conversations 里,想看再去翻。

## 一句话进来,分给一组 agent

文章的 Router 层只分派、不干活:统一收消息,把任务派给 Worker。

udctl 有 Agent Team:给一个 lead agent 配一份成员名单,名单会注入它开的每个会话,它把活 @ 给对应的成员。这篇文章就是这么来的:作者在一张卡上写了一句「看看能不能蹭这个热点」,Alfred 把它 @ 给内容组的 lead,lead 查资料、写草稿,在同一条线程里交回。

## 跑在你自己的机器上

文章提到 BYOM(自带机器),设备断线回来后能接着做。

udctl 的 agent 会话跑在 daemon 上:桌面版一启动就注册成 daemon,没装桌面版的机器可以跑 `ud daemon start`。agent 被叫醒时,后端先挑你自己的设备,你的设备都不在线时才用别人共享给你的。全都离线时,消息留在线程里,机器回来后的下一条消息会重新开会话。agent 也可以声明能跑在服务端,不依赖任何在线设备。

## agent 写下的东西和你的记录放在一处

agent 读写的卡体、笔记和评论,跟你记账时写的支出备注、账户说明用的是同一个 Markdown 编辑器。agent 写进来的进度和结论跟你自己的记录放在一起,能按路径、标签和查询找到。

## 试一下

1. 装桌面版(它会自己注册成 daemon),或者在任意一台机器上运行 `ud daemon start`。
2. 在一张卡里 @ 一个 agent,写一句你要它做什么。agent 可以是 Claude Code、Codex、OpenCode,或任何在终端里跑的 agent。
3. 去做别的事。它需要你的时候,那条线程会出现在「Needs you」里。

参考:DeepSeek 原型仓库 https://github.com/deepseek-ai/dsh-superagent-prototype
