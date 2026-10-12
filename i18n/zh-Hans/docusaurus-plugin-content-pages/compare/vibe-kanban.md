---
title: udctl vs Vibe Kanban
description: Vibe Kanban 和 udctl 都把看板和 AI 编程 agent 放在一起。
---

{/* Placeholder: zh draft from ud note 72edd8ab on card bb621041, wording unchanged (card 85ecfe87). The en file gets the English draft once master has reviewed the zh one. */}

# udctl 和 Vibe Kanban 对比

Vibe Kanban 和 udctl 都把看板和 AI 编程 agent 放在一起。Vibe Kanban 是在本机跑的网页应用,每个工作区给 agent 一个 git worktree 和分支;udctl 是一台自托管的服务器,任务、评论、看板在网页、桌面、iOS 和命令行里是同一份。

udctl(UnDercontrol)是一个可自托管的工作台,用来管理任务、笔记和开销,带 kubectl 风格的命令行(`ud`),还能在任务评论里直接派活给 AI 编程 agent。

## 项目现状

Vibe Kanban 背后的公司 bloop 在 2026-04-10 宣布关闭。托管的远程服务保留 30 天后下线,远程的看板 issue、评论、项目和组织随之删除;本地工作区继续可用。项目转为社区维护的开源项目,GitHub 仓库到 2026-09-19 仍有提交。

## 事实对照

| | Vibe Kanban | udctl |
|---|---|---|
| 形态 | `npx vibe-kanban` 启动,本机后端加网页界面,后端默认只监听 127.0.0.1 | 命令行 `ud`,另有网页、桌面、iOS 客户端 |
| 数据放在哪 | 本机;托管的远程服务按公告在 30 天后下线 | 你部署的服务器上 |
| 远程使用 | README 提供经 SSH 远程部署、用隧道暴露网页界面的说明,以及自托管 Cloud 实例的指南 | 服务器本身就是远程的,各客户端直连 |
| 多人 | README 提到「私下或与团队一起规划」「在看板上分配 issue」,未说明账户与权限模型 | 按组共享任务,组内分管理员和成员 |
| AI 编程 agent 怎么接 | 支持 Claude Code、Codex、Gemini CLI、GitHub Copilot、Amp、Cursor、OpenCode、Droid、CCR、Qwen Code;每个工作区一个 git worktree 和分支;带 MCP 服务器 | agent 调用 `ud` 命令读写任务;也可以在任务评论里 @ 一个 agent,桌面端或 `ud daemon` 在你的机器上开一个终端,启动 Claude Code、Codex、OpenCode 等去做这张任务 |
| 任务之外 | README 未列 | 笔记、开销、账户、预算,用同一个 CLI |
| 许可与价格 | Apache-2.0 开源,免费 | 闭源;个人和 3 人以内团队免费,更大团队按规模收费 |

## 什么情况选谁

- 一个人在本机并行跑多个 agent,希望每个任务自动隔离在独立的 worktree 和分支里,接受社区维护的节奏,选 Vibe Kanban。
- 需要一台长期在线、多人共用的服务器,看板和评论在手机上也能看,任务之外还要记笔记和开销,选 udctl。原来用 Vibe Kanban 远程看板的团队,可以把 udctl 部署在自己的机器上替代那部分。

## 事实来源
- Vibe Kanban README 与 license 字段:https://github.com/BloopAI/vibe-kanban (npx 启动;HOST 默认 127.0.0.1;支持的 agent 列表;worktree;MCP;SSH 远程与自托管指南;Apache-2.0;「Vibe Kanban is sunsetting」)
- 关闭公告,2026-04-10:https://www.vibekanban.com/blog/shutdown
- 最近提交时间:GitHub API pushed_at = 2026-09-19T06:52:48Z
