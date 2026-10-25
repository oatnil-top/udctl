---
title: "把每天的小决定交出去：用定时任务替你备好每天的学习内容"
description: "每天学一点，难的常常是开始前那几个小决定。用 udctl 的定时任务和 agent 把它们一次性写下来交出去：不用每天选题、不用记进度、打开就有内容，意见说一次就变成规则。"
authors: [lintao]
tags: [guide]
date: 2026-10-25
image: https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/en-01-handoff.jpg
---

想每天学一点东西，难的常常不是内容本身，是开始之前那几个小决定：今天学什么、学到哪了、材料在哪。每个都不大，但每天都要重来一遍。

这篇讲一种做法：用 [udctl](/)(UnDercontrol)的定时任务和 agent,把这些决定一次性写下来交出去。之后你每天只剩一件事，打开固定的位置，看今天已经备好的内容。下面每一条好处，都附上作者自己学英语这条线的实际做法。

我们把这件事做成了一支 4 分钟的片子:[在 YouTube 上看](https://www.youtube.com/watch?v=AoweFTBJcgg)。这篇是片子的文字版。

![四个部件连成一条线：定时任务每天建一张卡,agent 读卡、干活、写回，内容落在固定的位置](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/zh-01-handoff.jpg)

<!-- truncate -->

## 它怎么运作

udctl 的定时任务是 cron 加时区，到点按模板建一张任务卡。模板的描述里 @ 一个 agent,卡一建出来，这个 mention 就把 agent 叫醒：它在你自己的机器上开一个会话，读卡、干活，把结果写回这张卡。agent 可以是 Claude Code、Codex、OpenCode,或任何在终端里跑的 agent。

## 不用每天决定今天学什么

选题、排序、讲多长，写进派工模板一次,agent 每天照着做。

作者的语法课模板里写着:「选题归你，自己备课，不要发问卷问 owner。」到 10 月 24 日，这个定时任务已经触发了 88 次。

## 不用记得自己学到哪了

进度放在一张卡上，不放在你脑子里。

作者的拼读课有一张进度卡,agent 开工第一步读它，收工最后一步更新它。下一节要讲什么，已经写在卡上。

![拼读课进度卡：左边第 1 到第 10 节，第 7 节标着「讲到这里」(2026-10-24 的进度),右边是进度卡本身](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/zh-02-progress-card.jpg)

## 打开的时候，内容已经在那儿了

把定时任务排在你醒来之前，所有产出落在同一个路径下。你不用找，也不用等。

作者现在和英语有关的定时任务有三个，时间错开(新加坡时间):

| 时间 | 定时任务 | 产出 |
|---|---|---|
| 05:30 | english-video-daily | 一篇英语短文，加一支约 15 分钟的讲解视频 |
| 08:00 | english-tutor-daily-lesson | 一节语法课 |
| 09:00 | english-phonics-daily | 一节 7 到 10 分钟的拼读课视频 |

早上打开 `/english/video`,最新那张卡就是今天的：正文是英文短文，附件是视频。

![一条时间轴:05:30、08:00、09:00 三个定时任务排在起床之前，起床后打开 /english/video,最新那张卡就是今天的](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/zh-03-before-you-wake.jpg)

视频挂在卡上，在哪儿打开都一样。网页端点开附件，就在页面里直接播。iOS 端打开同一张卡，点一下视频，手机上直接播;全屏、倍速、AirPlay 用的是系统自带的控制。锁屏或者切到别的 app,声音接着播，锁屏上就有播放和暂停。

它就是一个普通的 mp4 文件。电脑上看、手机上听，都是同一张卡，不用再传一遍。

![同一张卡上的同一个视频附件：左边网页端在页面里播放，右边 iOS 端打开同一个文件，中间是锁屏后继续播放](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/zh-04-web-and-ios.jpg)

## 形式换成你真的会打开的那种

内容备好了还不看，问题可能出在形式上。形式也可以交给 agent 换。

作者这条线最早是文字：8 月 18 日开始，每天一篇两三百词的英文短文，到 10 月 10 日停掉前一共 53 篇。停掉的原因是懒得读。

10 月 10 日改成视频，要求是只听声音也能听懂，分三遍讲：纯英文听一遍，英文一句中文一句讲一遍，再听一遍全英文。当天出样片，提意见，第三版定稿后交给一个 agent,每天 05:30 自动跑。

![只听声音也能听懂，分三遍讲：第一遍纯英文，第二遍英文一句、中文一句;右边是一期视频的片头](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/zh-05-three-passes.jpg)

## 内容跟着你的水平变，意见只说一次

觉得不对，在卡上说一次,agent 把它写成规则，第二天的定时任务就按新规则出。你不用记得自己提过什么，也不用每天检查它有没有照做。

作者这条线上的两次调整：

- **嫌太简单。** 10 月 22 日提的意见是：阅读课简单了点，单词也太简单。规则随即改成：短文 300 到 360 词，按 B2 到 C1 写,simple、money 这类词进黑名单。
- **想往下学一层。** 10 月 18 日问能不能把常见音节都学会。agent 先评估：靠规则大约能做到七八成，十周左右。当天出试听版，听完觉得可以，就多了第三个定时任务。

![一个循环：看内容，在卡上提一次意见,agent 把意见写成规则，第二天的定时任务按新规则出](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/zh-06-feedback-loop.jpg)

## 照着搭：五个部件

视频和配音是作者自己的需求，你的版本可以只是每天一篇文字。可以直接照搬的是结构：

1. **一个定时任务**，每天建一张卡，卡里 @ 一个 agent。
2. **派工模板里把决定写死。**
3. **一张进度卡。**
4. **一个固定入口。**
5. **意见写成规则。**

## 这些都不用你亲手搭

听起来要配的东西不少。实际上全程都是 agent 帮你操作。

udctl 是 agent 原生的，所有操作都可以通过指挥 agent 去做，你不需要先学会这些功能。功能都在，但你要做的只是告诉你的 agent 你想要什么，然后跟它来回调整，直到它变成你期望的样子。

![左边是一个人说一句话,agent 去动定时任务、模板、进度卡、文件夹这些部件;右边是评论框里那一句话：让 agent 把英语短文改到每天 05:00 出](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/zh-07-tell-your-agent.jpg)

探索、记录、沉淀。人与 AI agent 共用的私密工作空间。[udctl.com](https://udctl.com/zh-Hans/)
