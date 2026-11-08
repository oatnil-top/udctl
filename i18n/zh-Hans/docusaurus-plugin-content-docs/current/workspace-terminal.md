---
title: 工作区终端
description: 从任务详情直接启动 Claude Code 实现任务（Electron 桌面版功能）
sidebar_position: 6
---

# 工作区终端

工作区终端是 Electron 桌面应用的功能，可以打开一个专用窗口，用 Claude Code 来实现任务。窗口左侧显示任务详情，右侧是连接到真实 PTY 进程的嵌入式终端。

## 概述

点击任务操作栏中的终端图标后，会打开一个新的工作区窗口：

- **左侧面板**：任务详情，支持自动刷新（检测 ud CLI 添加的备注更新）
- **右侧面板**：xterm.js 终端，运行加载了 ud CLI 技能上下文的 Claude Code

终端通过 `ud prompt` 将 ud CLI 技能指令注入 Claude Code 的系统提示（`--append-system-prompt`），然后传入任务初始化指令作为用户提示。用户无需安装 `/init-task` 技能文件即可使用。

> 此功能仅在 Electron 桌面应用中可用。

## 快速开始

1. 打开 Electron 桌面应用
2. 把任务或它所在的看板关联到一个 **Project**，Project 的目录指向你的代码（可选，推荐）
3. 打开该看板上的任意任务
4. 点击操作栏中的 **终端图标**
5. 工作区窗口打开，Claude Code 自动开始实现任务

## 会话跑在哪台机器上

你自己选定 daemon 时，就用那一台。当 Agent 替你启动会话时——@alfred 提及、来自 Telegram 的消息、
定时唤醒——由后端选择，而它**优先选你自己的机器**：只有当你所有的机器都不在线，才会用别人共享给你的机器。
只要可能，你的 Agent 就跑在你自己的文件、你自己掌控的硬件上。

其后的顺序是：Agent 被固定的 daemon，其次是你上次成功运行的那台，再次是任意在线的机器。
在 Agent 设置里把它固定到某台 daemon 会覆盖上述偏好——多人实例上该固定对所有人生效，设置项旁边也写明了这一点。

如果你的机器全部离线，什么也不会丢失。消息仍会留在它的线程里，bot 会回复如何让机器上线——
打开桌面 App 即自动上线，或在任意常用机器上执行 `ud daemon start`。之后你的下一条消息会启动会话，
而它会读取所绑定的线程，因此能看到离线期间说过的一切。没有队列要排空，也不会重放。

## 会话配置

会话在哪个目录运行、是否包进 tmux，配置在**任务**和它关联的 **Project** 上，不在看板上。后端在解析会话参数时读取这些配置。

### 工作目录

会话在关联 **Project** 的目录下启动：先看任务自己关联的 Project，再看看板关联的 Project。任务也可以带自己的 `metadata.cwd`，它优先于任何 Project。

**示例**：把看板关联到目录为 `/Users/me/projects/my-app` 的 Project，该看板上任务的会话都会在这个目录下运行，Agent 可以访问你的项目文件。

如果都没有解析出目录，会话回退到 `~/.undercontrol/workspace`（一个专用沙箱）。

### Tmux 会话

可选，按任务配置。设置任务的 `metadata.tmuxSession`：

```bash
ud patch task <task-id> --set tmuxSession=<会话名>
```

设置后，启动命令会被包装在指定名称的 tmux 会话中。实际会话名是 `<会话名>-<task-slug>`（追加任务 slug，避免不同任务共用一个会话）：

```bash
tmux new-session -As <会话名>-<task-slug> '<agent 启动命令>'
```

**行为说明**：
- 如果会话已存在：自动附加到该会话
- 如果会话不存在：创建新会话并运行 Claude Code
- 关闭工作区窗口不会终止 tmux 会话，它会在后台继续运行
- 重新打开工作区会重新附加到运行中的会话

适用于长时间运行的实现工作，即使关闭窗口也希望 Claude Code 会话保持运行。

## 配置解析链

cwd 由**后端**统一解析（单一事实来源），随 `workspace_init` 事件下发：

```
显式 cwd → 任务 metadata.cwd → 任务的 Project → Agent（或请求）的 Project
  → 看板的 Project → 你的 Default Project
回退：~/.undercontrol/workspace（专用沙箱，限制 Agent 的访问范围）
```

tmux 会话名只读任务的 `metadata.tmuxSession`，未设置则不使用 tmux。

## 架构

### 组件

| 组件 | 位置 | 职责 |
|------|------|------|
| Workspaces 页面 / 会话控件 | Vite 应用 | 注册 daemon；在任务上启动会话（`POST /workspace/init`） |
| 后端工作区处理器 | Go 后端 | 解析 cwd / tmux / 启动命令（单一事实来源）；通过 SSE 推送 `workspace_init` |
| `daemon-connector.js` | Electron 主进程 | 通过 SSE 接收 `workspace_init`；调用 `createWorkspaceWindow` |
| `workspace-manager.js` | Electron 主进程 | 为每个会话创建 BrowserWindow + PTY |
| `preload/index.js` | Electron 预加载脚本 | 通过 contextBridge 暴露 `workspaceApi`（PTY 读写、窗口控制） |
| 工作区页面 | Vite 应用 | 分屏布局 + xterm.js 终端 |

### 数据流

```
启动会话（Vite 应用）
  → POST /workspace/init { task_id, daemon_id }
  → 后端解析 cwd / tmux / 启动命令（单一事实来源）
  → SSE 'workspace_init' → 目标 daemon（Electron 主进程）
  → daemon-connector → workspace-manager.createWorkspaceWindow
  → 创建 BrowserWindow + 启动 PTY；用下发的命令启动 Agent
  → PTY 输出 → IPC → xterm.js 渲染
  → 用户键盘输入 → IPC → PTY stdin
```

### IPC 通道

| 通道 | 方向 | 用途 |
|------|------|------|
| `workspace:pty-data` | 主 → 渲染 | PTY 标准输出数据 |
| `workspace:pty-input` | 渲染 → 主 | 用户键盘输入 |
| `workspace:pty-resize` | 渲染 → 主 | 终端大小调整事件 |
| `workspace:pty-exit` | 主 → 渲染 | PTY 进程退出 |
| `workspace:closed` | 主 → 渲染 | 窗口已关闭 |

### 窗口管理

- **每个任务一个窗口**（手动会话）：再次启动同一任务会聚焦已有窗口；Agent 启动的会话各自一个窗口
- **位置持久化**：窗口位置保存在 `~/.undercontrol/workspace-positions.json`
- **级联定位**：新窗口相对上一个偏移 30px
- **关闭时清理**：窗口关闭时终止 PTY 进程

## 终端详情

### Shell 启动

工作区启动一个登录 + 交互式 shell，并增强环境变量：

- `TERM=xterm-256color` 支持完整颜色
- `COLORTERM=truecolor` 支持 24 位真彩色
- PATH 扩展了常用工具路径（`/usr/local/bin`、`/opt/homebrew/bin`、`~/.local/bin` 等）

### 命令执行

启动命令由前端/后端组装（主进程里旧的 `buildAgentCommand` 已删除），随 `workspace_init` 事件下发给 daemon。Agent 启动时，ud CLI 的技能上下文会追加到它的系统提示中（`ud prompt` → `--append-system-prompt`），用户无需安装 `/init-task` 技能文件。

Agent 退出后，shell 保持活跃，可以继续运行其他命令。

## 故障排除

### 终端显示错误的目录

**问题**：会话在沙箱（`~/.undercontrol/workspace`）启动，而不是项目目录。

**解决方案**：检查任务或它所在的看板是否关联了带目录的 Project，或任务是否设置了 `metadata.cwd`。后端在会话启动时解析 cwd，所以要在启动会话前保存好关联。

### node-pty 启动错误

**问题**：控制台出现 "NODE_MODULE_VERSION mismatch" 之类的错误。

**解决方案**：在 `ud-electron-vite` 目录下运行 `npx electron-rebuild` 重新编译原生模块。Electron 或 Node.js 版本变更后需要执行此操作。

### Tmux 会话未持久化

**问题**：关闭工作区窗口后 Claude Code 会话被终止。

**解决方案**：启动会话前设置任务的 `metadata.tmuxSession`（`ud patch task <task-id> --set tmuxSession=<会话名>`）。未设置时，关闭窗口会终止 PTY 的整个进程组，Agent 一并退出。设置了 tmux 后，关闭窗口只是断开 tmux 客户端，tmux 会话在后台继续运行。

### 窗口打开但终端空白

**问题**：工作区窗口打开了，但终端面板什么都没显示。

**解决方案**：可能是 node-pty 加载失败。检查 Electron 主进程控制台是否有 `[WorkspaceManager] Failed to load node-pty` 错误。运行 `npx electron-rebuild` 修复原生模块问题。
