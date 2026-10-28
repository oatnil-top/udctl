---
title: Workspace Terminal
description: Start a workspace session from a task; a desktop daemon launches an agent to implement it
sidebar_position: 6
---

# Workspace Terminal

The Workspace Terminal is a desktop feature that opens a dedicated window for implementing tasks with a terminal-based agent (Claude Code, Codex, OpenCode, …). It provides a side-by-side view of task details and an embedded terminal, connected to a real PTY process.

## Overview

You start a **workspace session** from a task. The session runs on a **daemon** — your desktop app (Electron) registered as a daemon — which opens a new workspace window:

- **Left panel**: Task details with auto-refresh (detects note updates from the ud CLI)
- **Right panel**: xterm.js terminal running the agent with ud CLI skill context

The terminal uses `ud prompt` to inject the ud CLI skill instructions into the agent (via `--append-system-prompt`), then passes the task instruction as the user prompt. Users don't need the `/init-task` skill file installed — it works out of the box.

> This feature relies on the desktop app (Electron) running as a daemon; the web app itself does not provide a local terminal.

## Quick Start

1. On the **Workspaces** page, register this device as a daemon (the app detects your machine name and platform and connects to the backend over SSE)
2. Set a **Project Directory** in the board settings (gear icon) — optional but recommended
3. Open any task, pick an online daemon in the workspace session area, and **start a session**
4. The desktop app on that daemon opens a workspace window with the agent ready to implement the task

## How a session is launched

A workspace session is **not** a local "click a terminal icon and a window opens" action — it goes through a daemon pipeline, even when the target daemon is this same machine:

```
start a session from a task
  → backend POST /workspace/init   (the backend resolves cwd/tmux — it is the single
                                     source of truth, SST)
  → an SSE workspace_init event is pushed to the target daemon
  → the daemon (desktop app main process) calls createWorkspaceWindow + spawns the PTY
```

- **Register the device as a daemon**: after registering on the Workspaces page, the desktop app connects to the backend over SSE and waits for instructions.
- **Backend resolves cwd / tmux (SST)**: cwd, tmux session name, and the launch command are resolved by the backend and delivered with the `workspace_init` event — the daemon does **not** read board metadata locally.

### Which machine a session lands on

When you pick a daemon yourself, that is the one. When an agent starts a session for you —
an `@alfred` mention, a message from Telegram, a scheduled wake — the backend chooses, and it
chooses **your own machines first**: a machine shared with you is used only when none of yours
is online. Your agent runs against your files, on hardware you control, whenever that is
possible at all.

A mention can name the machine itself with a runtime link
(`[@laptop](mention://runtime/daemon:<daemon-id>)`): that machine or none, if the agent's
owner allows it. An agent whose allowed runtimes list specific machines only ever lands on
one of those.

The order after that is: a daemon the agent is pinned to, then the one you last ran a session
on, then whatever is online. Pinning an agent to a specific daemon in the agent settings
overrides the preference — on a multi-user instance that pin applies to everyone, which the
setting says next to the field.

If none of your machines is online, nothing is lost. The message stays in its thread, and the
bot replies with how to bring one back — open the desktop app, which connects on launch, or run
`ud daemon start` on any machine you use. When the agent may also run on the server, the reply
ends with a ready `[@server](mention://runtime/server)` link that gets the answer from there now. Your next message after that starts the session, and
it reads the thread it is bound to, so it sees everything said while nobody was listening.
There is no queue to drain and nothing replays.

## Board Configuration

Each kanban board stores workspace settings in its metadata (configure them in the board settings drawer — gear icon on the board header). The backend reads these when resolving session parameters.

### Project Directory

The working directory for workspace sessions. When set, sessions for tasks on this board start in this directory.

**Example**: Set to `/Users/me/projects/my-app` and the agent runs with that as its working directory, giving it access to your project files.

If not set, the session falls back to `~/.undercontrol/workspace` (a dedicated sandbox).

### Tmux Session

Optional. When configured, the launch command is wrapped in a named tmux session. The actual session name is `<name>-<task-slug>` (a task slug is appended so different tasks don't share a session):

```bash
tmux new-session -As <name>-<task-slug> '<agent launch command>'
```

**Behavior**:
- If the session already exists: attaches to it
- If the session doesn't exist: creates it and runs the agent
- Closing the workspace window does NOT kill the tmux session — it continues in the background
- Reopening the workspace reattaches to the running session

This is useful for long-running implementations where you want the agent session to persist even if you close the window.

## CWD Resolution

The cwd is resolved by the **backend** (single source of truth) and delivered with the `workspace_init` event. The daemon only expands `~` and applies the fallback when it's empty:

```
explicit cwd → task metadata.cwd → board metadata.projectDir
fallback: ~/.undercontrol/workspace   (a dedicated sandbox that limits the agent's access scope)
```

## Architecture

### Components

| Component | Location | Role |
|-----------|----------|------|
| Workspaces page / session controls | Vite app | Register daemons; start a session on a task (`POST /workspace/init`) |
| Backend workspace handler | Go backend | Resolves cwd/tmux/command (SST); pushes `workspace_init` over SSE |
| `daemon-connector.js` | Electron main | Receives `workspace_init` over SSE; calls `createWorkspaceWindow` |
| `workspace-manager.js` | Electron main | Spawns the BrowserWindow + PTY per session |
| `preload/index.js` | Electron preload | Exposes `workspaceApi` (PTY I/O, window control) via contextBridge |
| Workspace page | Vite app | Split layout with xterm.js terminal |

### Data Flow

```
Start session (Vite app)
  → POST /workspace/init { task_id, daemon_id }
  → backend resolves cwd / tmux / launch command (SST)
  → SSE 'workspace_init' → target daemon (Electron main)
  → daemon-connector → workspace-manager.createWorkspaceWindow
  → BrowserWindow + PTY spawned; agent launched with the delivered command
  → PTY output → IPC → xterm.js renderer
  → User keyboard input → IPC → PTY stdin
```

### IPC Channels

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `workspace:pty-data` | main → renderer | PTY stdout data |
| `workspace:pty-input` | renderer → main | User keyboard input |
| `workspace:pty-resize` | renderer → main | Terminal resize events |
| `workspace:pty-exit` | main → renderer | PTY process exited |
| `workspace:closed` | main → renderer | Window was closed |

### Window Management

- **One window per task** (manual sessions): starting the same task again focuses the existing window; agent-spawned sessions each get their own window
- **Position persistence**: Window bounds saved to `~/.undercontrol/workspace-positions.json`
- **Cascade positioning**: New windows are offset by 30px from the last one
- **Cleanup on close**: PTY process is killed when the window closes

## Terminal Details

### Shell Startup

The workspace spawns a login+interactive shell with an augmented environment:

- `TERM=xterm-256color` for full color support
- `COLORTERM=truecolor` for 24-bit color
- PATH extended with common tool locations (`/usr/local/bin`, `/opt/homebrew/bin`, `~/.local/bin`, etc.)

### Command Execution

The launch command is assembled in the frontend/backend (the old main-process `buildAgentCommand` was removed) and delivered to the daemon with the `workspace_init` event. The agent is launched with the ud CLI skill context appended to its system prompt (via `ud prompt` → `--append-system-prompt`), so users don't need the `/init-task` skill file installed.

After the agent exits, the shell remains alive so you can run additional commands.

## Troubleshooting

### Terminal shows wrong directory

**Problem**: The session starts in the sandbox (`~/.undercontrol/workspace`) instead of the project directory.

**Solution**: Check that the board has a Project Directory configured in its settings, and that the task is on that board (matched by column queries). The backend resolves the cwd from board/task metadata, so the setting must be saved before you start the session.

### node-pty errors on startup

**Problem**: Error like "NODE_MODULE_VERSION mismatch" in the console.

**Solution**: Run `npx electron-rebuild` in the `ud-electron-vite` directory to rebuild native modules for the current Electron version. This is needed after Electron or Node.js version changes.

### Tmux session not persisting

**Problem**: Closing the workspace window kills the agent session.

**Solution**: Make sure the **Tmux Session** field is configured in the board settings. Without it, the PTY process is killed directly when the window closes. With tmux, only the tmux client detaches — the session continues in the background.

### Window opens but terminal is blank

**Problem**: The workspace window opens but the terminal panel shows nothing.

**Solution**: This can happen if node-pty failed to load. Check the Electron main process console for `[WorkspaceManager] Failed to load node-pty` errors. Run `npx electron-rebuild` to fix native module issues.
