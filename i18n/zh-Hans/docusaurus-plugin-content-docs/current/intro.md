---
sidebar_position: 1
sidebar_label: udctl 是什么
title: "udctl 是什么:可自托管的任务、笔记与 AI agent 工作台"
description: udctl(UnDercontrol)是一个可自托管的工作台，用来管理任务、笔记和开销，带 kubectl 风格的命令行(ud),还能在任务评论里直接派活给 AI 编程 agent。
---

# udctl 是什么

udctl(UnDercontrol)是一个可自托管的工作台，用来管理任务、笔记和开销，带 kubectl 风格的命令行(`ud`),还能在任务评论里直接派活给 AI 编程 agent。跑在你自己的机器上。

它是你和 AI agent 共用的私密工作空间。通常要分散在 Jira 这类任务工具、Obsidian 这类 Markdown 笔记库、记账软件和 agent 管理工具里的东西，在这里放在同一处。

## 主要功能

| 功能 | 说明 |
| --- | --- |
| 任务管理 | 任务、看板、Backlog、Sprint |
| 知识库 | Markdown 卡片和笔记，卡片之间双向关联，带关系图 |
| AI agent | 在评论里把任务派给 Claude Code、Codex 等终端 agent,会话跑在你自己的机器上 |
| 命令行 | `ud`,kubectl 风格，工作空间里的东西都能用它管 |
| 文件同步 | `ud pull` 和 `ud push` 让本地 Markdown 文件夹与工作空间双向同步 |
| 财务 | 账户、预算、支出和收入，按币种分别汇总 |
| 日历 | 带时间段的日历，每个看板有 Gantt 视图 |

## `ud` 命令行

命令行工具叫 `ud`,用法和 `kubectl` 一样：动词、资源类型、id。

```bash
# 查看任务列表
ud get tasks
# 查看某个任务
ud describe task <id>
# 从文件创建或更新任务
ud apply -f task.md
# 删除任务(进回收站)
ud delete task <id>
```

完整命令见[命令行指南](./cli.md)。

## 为 AI agent 设计

能跑 shell 命令的 agent 都能用 `ud`,所以 Claude Code、Codex、Cursor 操作的是和你同一份数据：

- agent 用 `ud describe task` 读取任务需求。
- 工作有进展时，agent 更新任务状态。
- agent 把开发进度记成任务下的笔记。
- 不同的 agent 共用同一套任务和知识库。

接入方法见 [AI Agent CLI](./cli-ai-integration.md);让 agent 会话和它手上的任务并排打开，见[工作区终端](./workspace-terminal.md)。

## 安装

```bash
# 需要 Node.js 18+
npm install -g @oatnil/ud
ud --help
```

命令行支持 macOS、Linux 和 Windows,x64 与 arm64 都有。Homebrew、桌面端、网页版和手机端见[下载页](./download.md)。

## 我们为什么做它

我们做 udctl,是想让 AI agent 像团队成员一样留得住东西：任务的上下文、一路写下的笔记、做到哪一步。Claude Code 和 Codex 在同一个工作空间里共享任务、记录进度，你就不用在每个会话开头把背景重讲一遍。

## 接下来看什么

- [快速开始](./getting-started.md):从零到第一张卡片和第一件交给 agent 的活
- [自部署指南](./self-deployment.md):用 Docker Compose、Kubernetes 或单个二进制运行 udctl
- [对比总览](/zh-Hans/compare/):[对比 Beads](/zh-Hans/compare/beads/)、[对比 Taskwarrior + Vikunja](/zh-Hans/compare/taskwarrior-vikunja/)、[对比 Vibe Kanban](/zh-Hans/compare/vibe-kanban/)
- [常见问题](/zh-Hans/faq/)
