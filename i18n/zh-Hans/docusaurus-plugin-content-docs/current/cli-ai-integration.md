---
title: "让 Claude Code、Codex 管理任务的 AI agent CLI"
description: ud 是面向 AI agent 的命令行工具:Claude Code、Codex 在终端读任务、记进度、传文件,不用手写提示词。
sidebar_label: AI Agent CLI
sidebar_position: 6
---

# AI Agent CLI

`ud` 是 udctl 的命令行工具，它从一开始就同时面向你和你的 AI agent。它自带**内置技能**——一份 agent 按需加载的自描述命令参考——所以你的 agent 可以读取任务、记录进度、上传文件、收尾工作，而你不必手工维护一个提示词文件。

## 什么是 AI agent CLI？

AI agent CLI 是一种为「被 AI agent 驱动」而设计的命令行工具，而不只是给人敲的。它和普通 CLI 有三点不同：命令是**自描述**的，agent 可以在运行时自己发现怎么用，而不需要你去教；输出是**机器可读**的，agent 可以解析结果，而不用去猜格式；操作是**安全且幂等**的，会话中断后重跑同一条命令不会把状态搞坏。

`ud` 就是这样一个工具。它的命令遵循 kubectl 风格的 `动词 资源` 结构，自带面向 agent 的参考（`ud describe skill ud-cli`），写入路径统一收敛到一条声明式的 `ud apply`——frontmatter 里有没有 `id` 决定它是创建还是更新。

## 给你的 AI agent 一块共享的任务板

Claude Code、Codex、Cursor，以及任何基于终端的 agent，都可以连到同一个工作空间。你不用在几个聊天窗口之间来回粘贴上下文：每个 agent 自己读任务、干活，再把进度写回你——以及下一个 agent——看得到的地方。

快速开始：

```bash
npm install -g @oatnil/ud   # 1. 安装（需要 Node.js 18+）
ud login                    # 2. 登录到你自己的服务器或托管工作空间
ud get task                 # 3. 确认能看到你的任务
```

然后在 agent 的会话里，让它执行：

```bash
ud describe skill ud-cli    # 4. agent 自己加载完整命令参考
```

设置到这里就结束了。CLI 也能替你体检这台机器，并为还缺的每一项给出确切的下一条命令：

```bash
ud config onboarding          # 人类可读的检查表
ud config onboarding --json   # 给 agent 用：每项带 next_command / requires_human
```

如果要从零开始、由 agent 代办的完整设置（安装、登录、技能文件），让你的 agent 抓取并按 [https://udctl.com/agent-setup/prompt.md](https://udctl.com/agent-setup/prompt.md) 执行——那份文件是设置流程的唯一权威来源，本节刻意不复述它。

## 内置技能：CLI 自己教会 agent

CLI 把面向 agent 的参考作为一个名为 `ud-cli` 的内置技能随身携带。agent 用这一条命令加载完整的命令参考和用法：

```bash
ud describe skill ud-cli
```

这正是 `ud --help` 指给 agent 的机制，它的页脚写着：

```
AI Agents: run "ud describe skill ud-cli" to load full command reference and usage patterns.
```

因为技能由 CLI／后端提供，它始终与你安装的版本一致——升级之后没有任何东西需要重新生成。

### 发现技能

技能是按 group 划分的能力定义。列出它们，并查看其中任意一个：

```bash
# 列出所有可用技能
ud get skills

# 查看某个技能的完整内容（agent 实际消费的提示词）
ud describe skill ud-cli
ud describe skill ud-pm
```

除了 `ud-cli`，其他内置技能教的是具体工作流（例如 `ud-pm` 用于看板复盘，`ud-common` 用于日常任务查询，`spawn-workspace` 用于拉起 agent 会话）。

### 发现菜谱

想要按资源分类、可直接复制粘贴的命令示例，用 `ud cook`：

```bash
ud cook task
ud cook note
ud cook board
```

### `ud-cli` 技能教了什么

**任务管理**
- 用 `ud apply -f -` 创建和更新任务（无 `id` 即创建，有 `id` 即更新）
- 查看和查询任务（`ud describe task`、`ud get task`、`ud query`）
- 通过写入 `status: done` 标记任务完成
- 用 `ud link task` 建立任务与子任务的关联

**进度跟踪**
- frontmatter 里带 `task_id` 应用一份文档，即添加备注
- 附上 commit 哈希以便追踪
- 记录决策和阻塞问题
- 在会话中记住任务 ID

**文件操作**
- 用 `ud upload resource` 上传文件
- 将文件附加到任务
- 通过预签名 URL 下载资源
- 从任务描述中解析 `resource://` URI

**实体查询**
- 用 `ud get entity` 通过 UUID 检索任何实体
- 获取文件资源的预签名下载 URL

## 用 @mention 把人放回环路

agent 自己干活，但你始终是那道验收关卡。任务上的评论就是这条通道：**在任务评论里 @ 某个 agent，它就会被唤醒**——udctl 会在跑着 daemon 的那台机器上为它启动一个 workspace 会话，agent 带着任务的描述、备注和关联接手工作。

它也用同样的方式回报：进度写进任务的备注（包含 commit），结论写进评论线程，做完之后任务变成 `pending` 状态——等你验收，而不是自动关闭。agent 之间也能互相 @，所以一个 lead 可以把子任务派给成员，而这条委派链永远不会让 agent 拿到比你更大的权限。

两个值得知道的细节：只有**评论**里的 @ 才能唤醒 agent（写在备注里的 @ 不会），并且 @ 不会排队——如果目标机器的 daemon 离线，这次投递会被丢弃，而不是挂起等待。

## AI 工作流示例

一次典型的 AI 辅助开发会话大致是这样：

```
你：    "处理任务 abc-123"
AI：    [执行：ud describe task abc-123]
        "我看到这个任务是关于添加用户认证的。
         我会在本次会话中跟踪任务 abc-123 的进度。"

你：    "实现它"
AI：    [实现功能]
        [执行：cat <<'EOF' | ud apply -f -
                ---
                task_id: abc-123
                ---
                实现了 JWT 认证中间件。Commit: def456
                EOF]
        "完成了。我已添加认证中间件并记录了进度。
         要把这个任务标记为完成吗？"

你：    "是的，再把架构图附上"
AI：    [执行：cat <<'EOF' | ud apply -f -
                ---
                id: abc-123
                status: done
                ---
                EOF]
        [执行：ud upload resource ./auth-flow.png -t todolist -e abc-123]
        "任务已完成，图表已附加。"
```

## 最佳实践

### 项目级 vs 全局设置

**项目级**（推荐）：把指令（或技能文件）放在项目的 `.claude/` 目录里，这样 agent 只在这个项目里管理任务。

**全局**：放在用户主目录（`~/.claude/`），对所有项目生效。

### 多上下文设置

如果你使用多个 ud 上下文（个人／工作），agent 会操作当前活跃的那个上下文：

```bash
# 在 AI 会话前切换到工作上下文
ud config use-context work

# agent 现在操作的是你的工作任务
```

你也可以用全局 `--context` 标志把单条命令钉在某个上下文上，例如 `ud --context work get task`。

## 故障排除

### AI 没有使用 CLI

**问题：** agent 不去执行 `ud` 命令。

**解决方案：**
1. 运行 `ud config onboarding`——它会检查登录、服务器和指令文件是否就位，并为缺的那项给出下一条命令。
2. 确认技能可以加载：`ud describe skill ud-cli`。

### AI 使用了错误的上下文

**问题：** agent 在错误的账户／服务器上操作。

**解决方案：** 在启动会话前切换上下文：

```bash
ud config use-context <correct-context>
```

### 技能文件过期

**问题：** 你把技能存成了文件，它缺少较新的命令。

**解决方案：** 优先用 `ud describe skill ud-cli` 实时加载技能。如果你一定要保留文件，请在 CLI 升级后重新生成：

```bash
ud describe skill ud-cli > .claude/skills/ud-cli/SKILL.md
```

## 常见问题

### Claude Code 能管理我的任务吗？

可以。用 `npm install -g @oatnil/ud` 安装 `ud`，执行 `ud login`，然后让 Claude Code 运行 `ud describe skill ud-cli`——这一条命令就把完整的命令参考加载进了它的会话。从那之后，它就能读取任务描述、创建和更新任务、写进度备注、附加文件，全部在它本来就用来写代码的那个终端里完成。

### 有哪个 CLI 能配合 OpenAI Codex 使用？

`ud` 可以。它就是一个普通的命令行工具，没有编辑器插件，也不绑定任何厂商，所以任何基于终端的 agent——Codex、Claude Code、Cursor、OpenCode——都能用它本来就有的 shell 权限驱动它。udctl 把 agent CLI 当作配置项：你指定实际要执行的命令，同一块任务板服务所有这些 agent。

### AI agent 是怎么学会 CLI 命令的？

在运行时，通过 CLI 本身学。`ud describe skill ud-cli` 返回完整的面向 agent 的参考——命令、文件格式和用法；`ud cook <resource>` 返回针对单个资源类型、可直接复制粘贴的示例。因为这份参考由工具自己提供，而不是被复制进某个提示词文件，它始终与你安装的版本一致，升级之后不需要重新生成任何东西。

### 可以私有部署吗？

可以。udctl 支持私有部署：用 Docker Compose 或 Kubernetes 部署，单人用 SQLite、多人用 PostgreSQL，然后用 `ud login --api-url https://your-server` 把 CLI 指向你自己的服务器。你的任务、笔记和文件都留在你掌控的基础设施上。部署方式详见[私有部署指南](./self-deployment.md)。
