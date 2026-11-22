---
title: "agent 交回来的 HTML,在 udctl 里直接看"
description: "agent 交回来一份 HTML 报告，你还得问它在哪、去找、再打开，想在手机上看还要先传过去。在 udctl(UnDercontrol)里它就挂在那张卡上：卡里直接显示，页面能点，iPhone 上也能打开。"
authors: [lintao]
tags: [feature, story]
date: 2026-11-22
image: https://dl.udctl.com/features/blog/html-right-in-the-card/01-two-formats.jpg
---

Dana 一个人开设计工作室。周四要和客户 Northwind Cafe 通电话，过一遍十月的数据：新菜单页上线以后，访问、订单、营收每周是怎么走的。

她让 agent 做一份报告。几分钟后 agent 回话：做好了，是一个 HTML 页面，有三个指标、一张能切换的柱状图和一张表。

agent 交回来的东西，写字的用 Markdown,要排版、要图表、要能点的，就是一个 HTML。这份报告就是后一种。

我们把这件事拍成了一支 62 秒的视频:[在 B 站观看](https://www.bilibili.com/video/BV1KEyVzCEy5)。这篇是文字版，截图取自片中画面,Dana、她的工作室、Northwind Cafe 和报告里的数字都是演示数据。

![Markdown 和 HTML 两种文件,HTML 那一边是带柱状图的页面](https://dl.udctl.com/features/blog/html-right-in-the-card/01-two-formats.jpg)

<!-- truncate -->

## 看到报告之前，先找三回

报告是做好了，可 Dana 还没看到。

她先问：文件放哪了？agent 给了一串路径。她打开文件夹，一层一层往下点，找到那个文件，双击，浏览器开了一个新标签页，报告才出来。

![三步：问 agent 文件在哪，在文件夹里找，再打开](https://dl.udctl.com/features/blog/html-right-in-the-card/02-three-steps.jpg)

看了一遍，她让 agent 把一个标题改短一点。改好了，又是一轮：文件还是那个吗，是不是又多了一个新的，在哪个文件夹。

快下班时她想，电话前在手机上再过一遍。可文件在电脑上，要先传过去：数据线、网盘，或者发给自己，传完再在手机上找个能打开它的地方。

![电脑和手机之间，一个 .html 文件不知道怎么过去](https://dl.udctl.com/features/blog/html-right-in-the-card/03-another-device.jpg)

报告本身几分钟就做完了，花时间的是找它、打开它、把它搬到另一台设备上。

## 在 udctl 里，报告就在那张卡上

同一件事放在 [udctl](/)(UnDercontrol)里。

Dana 有一张卡「Northwind Cafe: October report」,上面列着这件事的几步：拉十月数据、做报告页、周四电话里讲给对方听。agent 做完报告，直接把它挂在这张卡上。

她打开卡，报告就渲染在卡里，待办清单的下面。不用问在哪，也不用去文件夹里找。

![网页端卡片「Northwind Cafe: October report」,卡体里直接渲染着报告](https://dl.udctl.com/features/blog/html-right-in-the-card/04-in-the-card.jpg)

卡片的附件区也有这个文件，点一下弹出预览窗，左边是页面，右边是文件信息。

![附件预览窗：左边是渲染好的报告，右边是文件名、类型、大小](https://dl.udctl.com/features/blog/html-right-in-the-card/05-preview-window.jpg)

agent 改了一版，文件还挂在同一张卡上，不用再去找;刷新一下那张卡，看到的就是新的。

## 打开的是能点、能切换的页面

卡里显示的就是 agent 做的那个网页，脚本在跑，按钮能点。

Dana 点 Revenue,柱状图换成营收;点最后一根柱子，下面显示那一周的金额：10 月 22 日到 31 日，8,440 美元。

![预览窗里点了 Revenue,最后一根柱子高亮，下方显示 Oct 22 - 31: $8,440 in revenue](https://dl.udctl.com/features/blog/html-right-in-the-card/06-live-page.jpg)

想看大一点，进文件页点 Full Screen,报告占满整个窗口。

![文件页全屏：报告占满窗口](https://dl.udctl.com/features/blog/html-right-in-the-card/07-full-screen.jpg)

## 换到手机上，不用传

下班路上，Dana 在 iPhone 上打开同一张卡，点附件区的报告，页面就在 app 里打开;点右上角的按钮全屏，往下滑到柱状图。

文件本来就在卡上，电脑和手机看的是同一个，中间没有传文件这一步。

![iPhone 上全屏打开同一份报告](https://dl.udctl.com/features/blog/html-right-in-the-card/08-iphone.jpg)

## agent 写的页面，可以放心打开

报告里有脚本，Dana 没有逐行读过 agent 写了什么。这没关系：页面在一个隔离的框里运行，碰不到她的 udctl 账号。

## 怎么让 agent 这样交付

Claude Code、Codex、OpenCode 或任何在终端里跑的 agent,装好 ud CLI 就能这样交付。对它说一句:

> 把报告做成一个单文件 HTML,挂到这张卡上，再在卡体里加一行链接，让它直接显示。

agent 会用 `ud upload resource` 把文件挂到卡上，再在卡体里写一行指向它的链接。也可以自己在网页上从卡片的附件区上传。

两点要知道：现在只支持单个 HTML 文件，样式、脚本和图片要写在文件里，或者从 CDN 引，同目录下另放的 css、图片读不到;iPhone 上从附件区打开，卡体里那行链接在手机上只显示成文字。
