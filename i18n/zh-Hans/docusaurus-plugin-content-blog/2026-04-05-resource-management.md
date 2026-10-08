---
title: "让文件与工作同在：UnDercontrol 的资源管理"
description: "UnDercontrol 的文件与资源管理如何将收据、文档和图表与它们真正所属的任务和支出关联在一起。"
authors: [lintao]
tags: [feature]
date: 2026-04-05
---

大多数效率工具把文件存储当作附加功能——某个角落里的文件夹，与它所支撑的工作毫无关联。UnDercontrol 的做法不同：文件直接存放在它所属的任务、支出和预算旁边，收据跟着它对应的支出走，设计图跟着它所服务的任务走。

下面介绍资源管理系统在实际使用中的工作方式。

![Task list view — files attach directly to tasks, expenses, and budgets](https://dl.udctl.com/features/blog/resource-management/task-with-attachments.png)

## 按你的工作习惯上传

将文件导入 UnDercontrol 不应该每次都要打开文件选择器绕一圈。目前支持三种主要上传方式：

**拖放上传** — 打开资源页面，或在任务、支出的附件面板中，直接将文件拖入即可。支持单文件和批量上传。

**剪贴板粘贴** — 按下 Ctrl+V，剪贴板中的文件会立即上传。这对截图尤其方便。对着收据或界面 bug 截个图，切换到 UnDercontrol，粘贴。无需先保存到磁盘。

**CLI 上传** — 如果你习惯在终端工作，`ud` CLI 可以直接处理上传：

```bash
ud upload resource ./receipt.png --entity-type expense --entity-id exp-456
```

这在自动化工作流中很有用，比如将导出的报告自动附加到每月预算审查任务中。

## 一次附加，随处引用

同一个资源可以关联到多个条目。如果有一份合同 PDF 同时与某个预算和某个任务相关，你可以将它分别附加到两者——无需重复文件，也无需翻找文件夹。当任务标记为完成后，可以取消该文件与任务的关联，同时保留它与预算的附加关系。

检查器面板会清晰显示某个文件附加到了哪些条目，让你随时掌握文件的引用情况。

## 快速找到所需文件

资源页面提供所有已上传文件的完整概览，并内置筛选功能。你可以按文件类型、附加的实体类型（任务、支出、预算、账户）或日期范围进行筛选。对于图片，图库视图会显示缩略图，让你无需逐一打开便能快速浏览一批收据或截图。

检查器还会显示照片的 EXIF 元数据——如果你需要确认照片的拍摄时间或地点，这非常实用。

![Resource management page showing uploaded files with thumbnails and metadata](https://dl.udctl.com/features/blog/resource-management/resources-grid.png)

## 存储：本地或 S3

由于 UnDercontrol 是自托管的，你可以完全掌控文件的存储位置。默认使用本地磁盘存储，对于运行在家庭服务器或 VPS 上的个人使用场景完全够用。对于更大规模的部署或远程访问需求，可以配置兼容 S3 的对象存储——AWS S3、Backblaze B2、MinIO，用你已有的方案即可。

关键一点：你的文件不会经过任何第三方服务，直接从浏览器传输到你自己的服务器。

存储限制可自行配置。普通用户默认获得 1 GB 空间，单文件上限 10 MB。管理员则不受限制。

## 内置 Drawio 图表

如果你的工作流程涉及系统图、流程图或架构草图，UnDercontrol 内置了 drawio 支持。你可以直接在应用内创建和编辑图表，无需导出为 PNG，也无需切换到其他工具再重新上传。图表文件作为资源附加在对应的任务或笔记上。

## AI 识别图片内容

对于收据和文档扫描件，AI 集成功能值得了解。你可以打开一张图片资源，让 AI 从中提取信息——比如收据上的明细条目、扫描表格中的文字。这与支出追踪工作流天然契合：拍一张收据照片，附加到支出条目，让 AI 自动提取金额和商家名称。

## 日常使用场景

举一个实际的例子：你在追踪一个自由职业项目。有一个"审查客户合同"的任务，你将合同 PDF 附加到该任务。随后，你为项目采购的软件记录了一笔支出，并将发票附加到该支出条目。这两个文件都会出现在资源页面中——你可以按实体类型筛选，只查看支出附件，也可以一起查看，对整个项目进行完整的文件审计。

所有内容集中在一处，无需外部文件托管，也无需翻找邮件记录。

![Budget overview — receipts and invoices attach to expenses within budgets](https://dl.udctl.com/features/blog/resource-management/budget-overview.png)

## 开始使用

如果你已经在运行 UnDercontrol，资源页面可以在主导航中找到。如果你正在评估是否自托管，[部署指南](/docs/self-deployment) 涵盖了实例搭建的全部流程，包括存储配置。

[资源管理文档](/docs/features/resources) 提供了 CLI 命令、存储配置和实体附加选项的完整参考。
