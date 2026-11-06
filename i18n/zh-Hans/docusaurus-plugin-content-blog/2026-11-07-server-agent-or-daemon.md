---
title: "server 还是 daemon:你的 udctl Agent 该跑在哪"
title_meta: "server 还是 daemon:Agent 该跑在哪"
description: "udctl 的 agent 可以跑在服务端,也可以通过 daemon 跑在你自己的机器上。怎么选,看这件事要碰什么。"
authors: [lintao]
tags: [ai-agent, feature, guide]
image: https://dl.udctl.com/features/blog/server-agent-or-daemon/hero.png
date: 2026-11-07
---

udctl(UnDercontrol)的 agent 现在有两个地方可以跑。事情都在 udctl 里,比如根据卡片回答问题、建卡、写笔记、定时发一份汇总,选 **server**,这时你的机器可以关着。事情要碰你的代码、你的 shell,或者要用 Claude Code、Codex、OpenCode 等任意终端 agent,选 **daemon**。

![两栏对比。server 跑在 udctl 后端里:被点名或到点时跑一轮,处理任务、卡片和笔记,回到同一条对话,你的机器可以关着。daemon 跑在你自己的机器上,用 Claude Code、Codex、OpenCode 或任意终端 agent,有你的代码仓库、shell 和可以旁观的终端](https://dl.udctl.com/features/blog/server-agent-or-daemon/hero.png)

<!-- truncate -->

{/* VIDEO: 中文宣传片发布后把视频嵌在这里。 */}

## 电脑合上,也能拿到回答

daemon agent 在你自己的机器上启动,所以要有一台机器在线。server agent 跑在 udctl 后端里,你的电脑上什么都不用装,也不用开着。

在对话里点它的名,它就跑一轮。这一轮里它能查一张卡、搜索你的任务、建卡、给卡加笔记,还能列出可以交活的 agent。它最后那条消息就是回复,落在同一条对话里。每一步都有记录,过程实时可见,并随卡片和线程保留。调模型用的是你自己的 key。

典型场景:你不在工位,笔记本合着。打开网页版,点 agent 的名,问发版还有哪些卡没做完,再让它把你刚想起来的那件事建成一张卡。

新建的 agent 默认跑在 server。已有的 agent 继续跑在原来的地方。

## 机器不用开着,早上也有一份汇总

打开一条对话,在「更多」里选「设为常驻对话」,填好时间和一句话。到点后,服务端把这句话投进对话,agent 跑一轮,结果留在这条对话里。同一个作业在「设置 > 自动化」里也能看到。

我们宣传片里的设置是每天上午 9 点,让它列出带 `release` 标签、还没做完的卡。到 09:00,agent 列出全部五张,并说了先做哪张,当时没有一台机器在线。

![时间线上有三个独立的轮次:一次点名、一次 09:00 定时、一次追问点名。每次触发跑一轮,每轮以线程里的一条回复结束。轮次之间什么都没在跑,历史留在对话里](https://dl.udctl.com/features/blog/server-agent-or-daemon/turns.png)

server agent 就是这样一轮一轮地工作:被点名或到点时开始,写完回复就结束。所以时间要设在你想看汇报的时刻,下次打开对话时读结果。

## 写代码的活,留在代码旁边

daemon agent 在你的机器上启动一个 CLI,你的代码仓库、shell 和本地工具它都能用。测试还在原来的环境里跑,用量算在这个 CLI 已登录的账号上。在 daemon 对话里,顶部的「过程」页签显示终端,你可以看着它干,也可以中途接手。

daemon agent 还能用完整的 `ud` CLI。笔记、记账和账户与任务共用同一个 Markdown 编辑器和同一份存储,所以一件事既要看票据又要看需求时,它都拿得到。server agent 的工具处理的是任务和任务上的笔记。

## 怎么选:看这件事要碰什么

![决策图。只碰卡片、笔记和对话的事选 server。要碰代码、shell 或本地工具的事选 daemon。两边都要碰的事先走 server,由它建卡并在卡里点名,叫起 daemon agent](https://dl.udctl.com/features/blog/server-agent-or-daemon/choose.png)

| 这件事 | 选 | 原因 |
|---|---|---|
| 「发版还有哪些卡没做完?」 | server | 只需要读你的卡 |
| 把一句话建成卡,或给卡加笔记 | server | 这两件都是 udctl 的工具 |
| 每天早上汇总一次卡片 | server | 到点时不需要机器在线 |
| 修代码仓库里的 bug | daemon | 要有你的代码和编码 CLI |
| 跑测试或构建 | daemon | 要有你的 shell |
| 继续用 Claude Code 或 Codex 的登录账号 | daemon | 干活的是你机器上的 CLI |
| 看着终端,随时接手 | daemon | daemon 对话才有「过程」页签 |

拿不准就问一句:这件事要用到我电脑上的文件吗?要用就选 daemon,不用就先从 server 开始。

## 从 server 接活,到你的机器上做完

有些需求开始时只是一句话,最后要改代码。server agent 可以列出你够得着的 agent,建一张写好需求的卡,再在卡片描述里点其中一个的名。这个点名会叫起那个 agent。如果被点名的 agent 跑在 daemon 上,活就到了你的机器上,卡里已经有它要的东西。

典型场景:你在对话里描述一个不稳定的测试,让 server agent 交给你的编码 agent。回复里会带一个卡片链接,卡上有你的原话和完成标准,编码 agent 在这张卡的线程里回报。

## 选错了,下一条消息就能改

点名 agent 之后,你可以马上选这条消息在哪里跑。输入框下的标签显示当前选择,比如「默认在 server 运行」,点一下就能改。

- 选了 agent 声明范围以外的地方,会被拒绝,对话里会说明原因。
- 选了 daemon 而没有机器在线,对话里马上有回执,不会无声等待。如果 agent 的范围包含 server,回执里会给一行现成的话,发出去就改由 server 回答。
- 你自己的 agent,就算设置里只列了 daemon,也可以在某一条对话里改跑 server。它的设置不变,其他对话继续用 daemon。

## Slack 即将推出

即将推出:在 Slack 频道里点 agent 的名,它在线程里回你。频道定时摘要也即将推出。

## 怎么试

我们在线上站点实测过,点名回话和到点作业这两条路都能用。

1. 打开 [app.udctl.com](https://app.udctl.com)。注册新账号需要邀请码;没有邀请码的话,在登录页选「访客(免注册)」。访客账号是临时的,建议用一个可以随时吊销的模型 key。
2. 在「设置」里加上你自己的模型 key。不管用哪种账号,server agent 都要有它才能回答。
3. 新建一个 agent,新建的默认跑在 server。
4. 开一条对话,输入 `@` 和 agent 的名字,问问你的卡片。
5. 想定时跑,在「更多」里选「设为常驻对话」。

用自己的实例时,「server」就是你自己的后端,见 [自托管](/self-hosting) 和 [快速开始](/docs/getting-started)。桌面版的后端跑在你的电脑上,想合着盖子也能拿到回答,要用一个一直开着的后端。
