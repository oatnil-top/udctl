---
title: udctl 和 Beads 对比
description: Beads 和 udctl 都给 AI 编程 agent 提供一份可读写的任务数据,出发点不同。
---

{/* zh text from ud note 58bc2a20 on card bb621041 (master-approved 2026-10-12, card 85ecfe87); en twin in src/pages/compare/. Fix wording on the card, not here. */}

# udctl 和 Beads 对比

Beads 和 udctl 都给 AI 编程 agent 提供一份可读写的任务数据,出发点不同。Beads 把任务库放进代码仓库,给 agent 当长期记忆;udctl 是一台自托管的服务器,人和 agent 在同一份任务、看板、笔记上协作。

udctl(UnDercontrol)是一个可自托管的工作台,用来管理任务、笔记和开销,带 kubectl 风格的命令行(`ud`),还能在任务评论里直接派活给 AI 编程 agent。

## 事实对照

| | Beads | udctl |
|---|---|---|
| 形态 | 命令行 `bd`;README 未列内置网页界面,社区有第三方界面 | 命令行 `ud`,另有网页、桌面、iOS 客户端 |
| 数据放在哪 | 仓库里的 `.beads/` 目录,存储引擎是 Dolt(带版本的 SQL 数据库) | 你部署的服务器上 |
| 多机与多人 | `bd dolt push` / `bd dolt pull` 经 git remote 同步;另有实验性的 HTTP 后端 `bd serve`;server 模式支持多个并发写入方 | 所有客户端连同一个服务器;按组共享任务,组内分管理员和成员 |
| AI 编程 agent 怎么接 | `bd setup` 为 Claude Code、Codex CLI、Cursor 等写好集成;agent 自己调用 `bd create`、`bd ready`、`bd close` 等命令 | agent 调用 `ud` 命令读写任务;也可以在任务评论里 @ 一个 agent,桌面端或 `ud daemon` 在你的机器上开一个终端,启动 Claude Code、Codex、OpenCode 等去做这张任务 |
| 任务之外 | 依赖关系(`bd dep add`)、记忆(`bd remember`) | 笔记、开销、账户、预算,用同一个 CLI |
| 许可与价格 | MIT 开源,免费 | 闭源;个人和 3 人以内团队免费,更大团队按规模收费 |

## 什么情况选谁

- 任务只属于一个代码仓库,希望它跟着代码一起版本化,主要给 agent 自己用,不想维护服务器,选 Beads。
- 任务跨多个仓库或根本不在仓库里,要让同事在网页或手机上看看板、留评论,想从一条评论把任务派给 agent,选 udctl。

## 事实来源
- Beads README 与 license 字段:https://github.com/steveyegge/beads (MIT;Dolt 存储;`bd` 命令;`bd dolt push/pull`;`bd serve` 标注 experimental;`bd setup` 支持的 agent)
