---
title: udctl vs Taskwarrior + Vikunja
description: 想要「命令行管任务,同时有网页看板」的人,常见做法是 Taskwarrior 管终端、Vikunja 管网页。udctl 用一台服务器同时提供这两样。
---

{/* zh text from ud note 454d6887 on card bb621041 (master-approved 2026-10-12, card 85ecfe87); en twin in src/pages/compare/. Fix wording on the card, not here. */}

# udctl 和 Taskwarrior + Vikunja 对比

想要「命令行管任务,同时有网页看板」的人,常见做法是 Taskwarrior 管终端、Vikunja 管网页。udctl 用一台服务器同时提供这两样。

udctl(UnDercontrol)是一个可自托管的工作台,用来管理任务、笔记和开销,带 kubectl 风格的命令行(`ud`),还能在任务评论里直接派活给 AI 编程 agent。

## 事实对照

| | Taskwarrior 3 | Vikunja | udctl |
|---|---|---|---|
| 形态 | 命令行 `task` | 自托管网页应用;列表、看板、甘特图、表格四种视图;另有付费托管 Vikunja Cloud | 命令行 `ud`,另有网页、桌面、iOS 客户端 |
| 命令行 | `task <过滤> <命令> <修改>`,如 `task 12 modify due:eom` | 自带的 `vikunja` 命令管服务器(备份、迁移、用户);任务 CLI 是 `veans`,官方标注实验性 | `ud get / describe / apply / patch / delete` |
| 数据放在哪 | 本机 `taskchampion.sqlite3` | 你部署的 Vikunja 服务器 | 你部署的 udctl 服务器 |
| 多设备与多人 | `task sync` 到 TaskChampion 同步服务器或 AWS S3、Google Cloud Storage;同步服务器可配多用户 | 服务器上的多个账户 | 所有客户端连同一服务器;按组共享,组内分管理员和成员 |
| AI 编程 agent 怎么接 | agent 调用 `task` 命令 | `veans` 面向编程 agent:`veans prime` 输出教 agent 用法的系统提示,agent 认领任务后转「In Review」 | agent 调用 `ud` 命令;也可以在任务评论里 @ 一个 agent,在你机器上开终端启动 Claude Code、Codex、OpenCode 等 |
| 两者合用 | Taskwarrior 与 Vikunja 是两套各自独立的数据 | 同左 | 命令行和网页是同一份数据 |
| 许可与价格 | MIT 开源 | AGPL-3.0 开源;自托管免费,Cloud 付费 | 闭源;个人和 3 人以内团队免费,更大团队按规模收费 |

## 什么情况选谁

- 只要终端,单人,离线,开源,选 Taskwarrior。
- 只要网页看板,要甘特图,开源,选 Vikunja。
- 要命令行和网页看同一份任务,还想把笔记和开销放在同一个服务器上,选 udctl。

## 事实来源
- Taskwarrior:https://taskwarrior.org/docs/upgrade-3/ (taskchampion.sqlite3)、/docs/sync/ (同步后端、多用户)、/docs/examples/ (命令示例)、/docs/ (MIT)
- Vikunja:https://vikunja.io/ (四种视图、AGPLv3、Cloud)、/docs/cli/ (服务器管理命令)、/docs/veans/ (实验性 agent CLI)
