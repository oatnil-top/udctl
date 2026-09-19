---
title: "一键把网页变成干净的 Markdown,直接喂给 AI —— UnDercontrol Web Clipper"
description: Web Clipper Chrome 扩展无需登录即可把任意网页一键复制成干净的 Markdown 喂给 AI,支持本地保存完整 HTML 快照,也能把网页直接剪成 UnDercontrol 任务供 AI Agent 读取。
authors: [lintao]
tags: [feature, guide]
date: 2026-07-11
image: https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/web-clipper/concept-copy-markdown.png
---

想把一篇网页文章丢给 AI 总结、翻译、提问,你现在是怎么做的?

全选复制?粘过去的是一堆导航栏、广告、推荐位和乱掉的排版。发链接?很多 AI 工具抓不了页面,抓到的也常常是残缺的。

UnDercontrol 的 [**Web Clipper**](/zh-Hans/docs/web-clipper/) Chrome 扩展给了一个更干净的答案:点一下 **Copy Markdown**,当前页面的正文被提取成整洁的 Markdown 进入剪贴板——**无需登录、无需账号、无需任何配置**,装上就能在任何页面用。粘给 Claude、ChatGPT 或任何 AI,它拿到的是纯正文,没有一点噪音。

![Web Clipper 弹窗 — 无需登录即可 Copy Markdown 和本地保存](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/web-clipper/popup-setup.png)

<!-- truncate -->

## Copy Markdown:为 AI 时代准备的复制

这是整个扩展最高频的功能,也完全不依赖 UnDercontrol 服务器:

- **一键复制**:页面正文以干净的 Markdown 格式进入剪贴板
- **智能提取**:基于 Readability + Turndown,自动剥离广告、导航、侧边栏等非正文元素
- **零门槛**:不用注册、不用登录,任何页面即点即用
- **稳定可靠**:自动跳过 video/canvas 等重型元素,复杂页面也不会把浏览器拖崩

Markdown 是 AI 的母语——结构清晰、无冗余标记。同一篇文章,贴 Markdown 比贴网页全选复制的内容,让 AI 的理解和回答质量高得多,也省 token。

![网页 → 干净 Markdown → 你的 AI —— 一键完成,无需登录](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/web-clipper/concept-copy-markdown.png)

## Save to Local:不登录也能存档

同样无需登录的还有本地保存:一键下载两个文件——

1. **完整 HTML 快照**:基于开源的 [SingleFile](https://github.com/gildas-lormeau/SingleFile),把 HTML、CSS、图片、字体全部内联进一个自包含文件,离线原样打开
2. **提取好的 Markdown**:和 Copy Markdown 同源的干净正文

链接会失效、页面会改版,但快照永远是你按下保存那一刻的样子。归档文章、调研资料、时效性页面,不需要任何服务器。

## Save to UnDercontrol:剪藏进入你的工作流

如果你在用 UnDercontrol(支持登录或 API Key 两种方式连接,自部署实例天然支持),剪藏会更进一步——网页直接变成一条**任务**:

![Web Clipper 就绪视图 — 标题预填、标签、Save Page](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/web-clipper/popup-ready.png)

- **Markdown 正文写进任务描述**,在任务里直接可读、可编辑
- **HTML 快照作为附件**挂在任务上,随时还原原页面
- 之后就是完整的任务能力:打标签、进看板、和其他任务链接、加笔记写结论
- **AI Agent 可访问**:通过 ud CLI,Claude Code、Codex、OpenCode 或任何基于终端的 AI Agent 都能读到这条任务——描述里就是现成的 Markdown 正文,Agent 不需要再去抓网页

下面就是一条真实剪藏出来的任务:描述开头是来源链接,正文是提取好的 Markdown,右侧附件里挂着完整的 HTML 快照:

![剪藏生成的任务 — 描述中是来源链接和 Markdown 正文,附件是 HTML 快照](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/web-clipper/task-detail.png)

在 UnDercontrol 里,任务本来就不只是待办事项——它是通用的信息容器,网页剪藏只是又一种进入这个容器的方式。

## 彩蛋:B 站视频字幕一键变文稿

Web Clipper 还内置了 **Bilibili 字幕提取**:在 B 站视频页上,扩展会自动识别并亮出 **Save Transcript** 按钮,把 CC 字幕或 AI 生成字幕提取成格式化的 Markdown 文稿——可以直接下载到本地,或存成 UnDercontrol 任务。看完一个技术分享视频,文稿顺手就归档了,丢给 AI 做摘要也是一句话的事。

![检测到 Bilibili 视频 — 一键 Save Transcript](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/web-clipper/popup-bilibili.png)

## 典型场景

- **喂给 AI**:长文复制成 Markdown 贴给任何 AI 总结、翻译、提问——比贴链接或全选复制干净得多
- **技术文章稍后读 + 行动项**:值得跟进的文章剪成任务、设截止日期,读完的实践计划直接写进任务笔记
- **竞品调研**:竞品定价页、功能页逐个剪进调研看板,对方改版后你手里还有当天的快照
- **Bug 存证**:第三方页面出问题时剪一份完整快照附在 bug 任务上,页面恢复后依然能还原现场
- **视频学习笔记**:B 站技术视频的字幕一键变 Markdown 文稿,归档或交给 AI 提炼要点

## 安装与配置

从 [Chrome Web Store](https://chromewebstore.google.com/detail/undercontrol-web-clipper/mckkbigikfkoeddpcbhdmpncoljoagog) 安装即可。**Copy Markdown 和本地保存装上就能用,零配置**;只有"存为任务"需要连接你的 UnDercontrol 服务器——直接登录,或在网页端 **Settings → API Keys** 创建一个 `ak_` 开头的 API Key 填入扩展。

![Login to server — 用户名密码或 API Key,仅"存为任务"需要](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/web-clipper/popup-login.png)

## 诚实的边界

- Chrome 内部页面(`chrome://`、`chrome-extension://`)无法捕获
- 动态内容很重的复杂页面,完整快照的捕获可能需要最长 2 分钟
- 快照是时间点副本——原页面更新后,快照不会跟着变(这也正是它的价值所在)

Web Clipper 浏览器扩展本身以 AGPL-3.0 协议开源,源码在 [github.com/oatnil-top/ud-chrome-extension](https://github.com/oatnil-top/ud-chrome-extension)。

## 小结

不登录,它是一个干净的"网页转 Markdown + 本地存档"工具,天生为把内容喂给 AI 而设计;登录后,剪藏直接进入一个能打标签、能进看板、能被 AI Agent 读取的任务系统。下次想把网页内容交给 AI 的时候,先点一下 Copy Markdown 试试。
