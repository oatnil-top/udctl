---
title: "markdown 里的图片往哪放：粘贴一次，网页、手机、本地文件夹里都在"
description: "在 Obsidian、Typora、VS Code 里，图片是一个要自己安放、自己同步的文件。在 udctl 里粘贴就行，按 id 引用，笔记怎么挪都不断图，手机上打开就有，ud pull 还能拉成普通文件。"
authors: [lintao]
tags: [feature, guide]
date: 2026-11-18
image: https://dl.udctl.com/features/blog/where-do-markdown-images-go/04-attachments.jpg
---

用 markdown 写东西很顺手，直到你要插一张图。在 Obsidian、Typora、VS Code 这些常用的 markdown 编辑器里，图片是笔记旁边一个单独的文件，放在哪要你来定:

- Obsidian 在 Settings 的 Files & Links 里让你选新附件的位置：库的根目录、指定的文件夹、当前笔记所在的文件夹，或者它下面的一个子文件夹([文档](https://obsidian.md/help/attachments))。
- Typora 插入本地图片时默认引用图片原来的路径，想复制到某个文件夹，要在偏好设置或文档的 Front Matter 里另外指定([文档](https://support.typora.io/Images/))。
- VS Code 把工作区外粘贴或拖进来的图复制进工作区，放哪个目录由 `markdown.copyFiles.destination` 决定;文件移动或改名时更新链接的设置 `markdown.updateLinksOnFileMove.enabled` 默认是 never([文档](https://code.visualstudio.com/docs/languages/markdown))。

设置选好以后，事情还没完：笔记挪了位置，相对路径可能就断了;换到手机上打开，图得靠另一套同步跟过来，比如 Obsidian 官方的 Obsidian Sync,是一项按月付费的订阅([价格页](https://obsidian.md/sync))。

这篇讲 [udctl](/)(UnDercontrol)里怎么省掉这几步：图片粘贴进来就行，笔记怎么挪都不会断图，手机上打开同一篇就能看到，想要本地文件也是一条命令。最后一段讲 PDF 这类非图片文件怎么放进 markdown。

我们把这件事做成了一支 85 秒的视频:[在 B 站观看](https://www.bilibili.com/video/BV1LWs16DESq)。这篇是文字版，截图里的游记和照片都是虚构的演示数据。

![常见的 markdown 写法里，图片按相对路径引用，笔记一挪链接就断](https://dl.udctl.com/features/blog/where-do-markdown-images-go/01-link-breaks.jpg)

<!-- truncate -->

## 不用想图放哪个文件夹：粘贴或拖进来

在 udctl 的网页版或桌面版里编辑一篇笔记，截图之后直接 Cmd+V 粘贴，或者把图片文件拖进编辑区，图就上传并插在光标的位置。工具栏上的 Insert Image 和斜杠菜单里的 Image 也能插图。

不用先存一份文件，也不用挑文件夹、写路径。

![网页编辑器里，粘贴的一张海边照片和拖进来的一张盖饭照片，各自出现在对应的段落下](https://dl.udctl.com/features/blog/where-do-markdown-images-go/02-paste.jpg)

## 笔记挪了、改了名，图也不会断

切到 Source Mode 看原文，粘贴进来的图只是一行:

```
![shirasu-bowl.jpg](resource://d06fdc00-e207-4042-9a06-2e45b6867bb5)
```

它按 id 指向文件，不按路径。笔记换到别的目录、改个标题，这一行都不变，图照常显示。

![Source Mode 下的正文，两张图各是一行 resource:// 引用](https://dl.udctl.com/features/blog/where-do-markdown-images-go/03-one-line.jpg)

## 图存在哪，你选，也看得见

文件本身传到你的 udctl 服务器上，存在你选的地方：服务器自己的硬盘，或者一个 S3 兼容的存储桶。

上传的文件不会藏起来。卡片右侧的 Attachments 里能看到这篇笔记用到的每个文件;Explorer 里也能按目录找到它们，点开看名称、大小、类型和修改时间。

![卡片详情：正文里的图，右侧 Attachments 里列着同样两张图](https://dl.udctl.com/features/blog/where-do-markdown-images-go/04-attachments.jpg)

![Explorer 里的图片文件，右侧预览显示名称、大小、类型和修改时间](https://dl.udctl.com/features/blog/where-do-markdown-images-go/05-explorer.jpg)

## 换到手机上，图已经在那儿了

网页和手机 App 连的是同一个 udctl 服务器，所以在手机上打开同一篇笔记，图已经在里面了，不用再传一次，也不用同步网盘。

udctl 的任务、笔记、账目和账户用的是同一个 markdown 编辑器，图片在哪种内容里都是这样放、这样显示。

![iOS App 里打开同一篇游记，两张照片和行程 PDF 的链接都在](https://dl.udctl.com/features/blog/where-do-markdown-images-go/06-phone.jpg)

## 想要普通文件，一条命令拉到本地

有时候你想要的就是一个文件夹：拿去备份、用别的编辑器打开，或者交给 Claude Code、Codex、OpenCode 这类在终端里跑的 agent 去读。

```
ud pull /travel/ --fetch-attachments
```

这条命令把 /travel/ 下的笔记拉成本地的 .md 文件，图片放在旁边的 attachments 文件夹里，正文里的引用写成 `![[shirasu-bowl.jpg]]` 这样的文件名，和 Obsidian 嵌入文件的写法是同一种。

![终端里 ud pull 拉下三篇 .md 和两张图片，ls 列出 attachments 文件夹](https://dl.udctl.com/features/blog/where-do-markdown-images-go/07-pull.jpg)

## 不只是图片，任何文件都能放进 markdown

本地文件夹也能往回推。把一份 PDF 放到笔记旁边，在笔记里写一行链接，运行 `ud push`,PDF 就传到服务器上了。回到浏览器，它是笔记正文里的一个链接，点开就地预览，也能下载。

不在命令行的时候，也可以在卡片的 Attachments 里上传任意文件，再用 Copy reference 复制它的引用，粘贴进正文。

![浏览器里点开笔记中的 day-plan.pdf 链接，弹出 PDF 预览和文件详情](https://dl.udctl.com/features/blog/where-do-markdown-images-go/08-pdf.jpg)

## 典型场景

- **写游记**:在电脑上把当天的照片粘进对应的段落，路上用手机打开同一篇，图都在。
- **技术笔记**:报错截图粘贴进排查记录，笔记以后挪去别的目录，截图还在原处显示。
- **会议记录附资料**:会上发的 PDF 传进卡片的 Attachments,复制引用贴在议程旁边，参会的人点开就能看。
- **交给 agent 处理**:用 `ud pull` 把一个目录拉到本地，agent 读的是普通的 .md 和图片文件;它新加的文件，`ud push` 推回去。
