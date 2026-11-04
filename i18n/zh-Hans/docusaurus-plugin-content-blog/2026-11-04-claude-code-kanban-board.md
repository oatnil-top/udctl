---
title: "有没有能管 Claude Code 会话的看板?"
title_meta: "给 Claude Code 配一块看板:一张卡一个会话"
description: "把 Claude Code 和 Codex 的任务放到自托管看板上:写卡、@ 一下 agent,每张卡起一个会话,回执回到卡的线程里。"
authors: [lintao]
tags: [cli, ai-agent, guide]
image: https://dl.udctl.com/features/blog/claude-code-kanban/hero.png
date: 2026-11-04
---

有,而且不止一块。claude-code-kanban、Kanban Code、Vibe Kanban 都能把 Claude Code 摆上看板,也都能从看板上开工。如果你想要的看板放在自己的服务器上,卡片写需求,评论里 @ 一下 agent 就起一个会话,结果回到卡的线程,换成 Codex 或 OpenCode 也不用换板,[udctl](/)(UnDercontrol)就是这样工作的。它是自托管的,个人和 3 人以内的团队免费。

![左边是放在你服务器上的卡片,包含需求、笔记和评论线程;右边是你机器上的 daemon,@ 之后启动 Claude Code、Codex 或 OpenCode 会话,回复回到线程](https://dl.udctl.com/features/blog/claude-code-kanban/hero.png)

<!-- truncate -->

## 一眼看出哪个会话在做哪件事

Claude Code 开到第四个终端窗口,你就得挨个切过去,才想得起每个窗口在干什么。把每件事写成一张卡,这个问题就交给了看板:一个 agent 在一张卡上只有一个会话,再 @ 同一个 agent,消息会进它在这张卡上已有的会话。卡片在哪一列,这件事就走到了哪一步。

终端里也能查。下面是这篇文章的卡片上正在跑的会话,`ud` 的真实输出:

```bash
$ ud get sessions --task 533f3c5b --status running
ID        TASK      AGENT     DAEMON    STATUS      LAST-SEEN  AGE     CLI
9abbf748  533f3c5b  e77a3904  6f2ad927  running     just now   2m      claude
```

## 不开终端也能开工

开工要三步:

1. **写卡。** 在网页、桌面端建一张卡,或者让 agent 用 `ud` 建。需求写在卡体里,日志和截图作为附件挂上去。
2. **在评论里 @ agent。** 比如 `@fixer 修一下这个偶发失败的测试`。要先有这个 agent:起个名字、写一段提示词、选一个 CLI,`ud cook agent create-agent` 会打印完整模板。
3. **等回复。** udctl 在一台登记为 daemon 的机器上开一个终端,启动 agent。这台机器可以是开着的桌面客户端,也可以是运行过 `ud daemon start` 的任何一台机器。agent 带着卡的需求、笔记和链接开工,`ud` 的用法也已经进了它的系统提示,不需要你维护提示词文件。

典型场景:周五下午积了三个小 bug。写三张卡,各 @ 一次,三个会话各干各的,你继续写手上的代码。

## 只在需要你拍板时才被叫

agent 把进展写进卡的笔记,提交哈希也记在那里,结论回到评论线程。它认为做完了,就把卡移到 `pending` 等你审,不会自己关掉。所以看板上的 `pending` 列就是你的待审清单,其他列不用盯。

想让它返工,在同一个线程回一句,消息会送进这个线程里还活着的会话。agent 之间也能互相 @,主 agent 可以把子任务派给另一个 agent,这条委派链上谁的权限都不会超过你。

典型场景:agent 改完了实现,卡在两个方案之间。它在线程里问你,你在 iOS 客户端读到问题,回一句,它接着做。

## 会话结束了,上下文还在

Claude Code 的会话一关,里面的讨论就留在了那个会话的记录里。claude-code-kanban 这类看板读的是 Claude Code 写在本机的任务文件和 transcript,看板状态跟着这些文件走。

udctl 把卡片存在你的服务器上,卡片不依赖任何一个会话。下一个会话运行 `ud describe task <id>`,就能读到上一个会话留下的笔记,包括三周前否掉某个方案的原因。这部分在 [FAQ](/faq/) 里也有简短回答。

卡片之外也一样。笔记、开销、账户和任务用的是同一个 Markdown 编辑器,存在同一处,都能用同一个 CLI 读写。一件事的上下文如果一半是规格说明、一半是一张收据,agent 跑一条 `ud` 命令就能拿到。

## 换成 Codex 不用换板

每个 agent 绑定一个 CLI 启动命令。Claude Code、Codex、OpenCode,或者任何终端里的 agent 都可以,看板、卡片、线程都不用动。桌面端能按二进制名检测 `claude`、`codex`、`opencode`、`aider`、`gemini`、`copilot`、`qwen` 等 CLI。`ud` 是普通命令行工具,不需要插件,agent 能跑 shell 就能用,细节在 [AI agent CLI](/docs/cli-ai-integration) 这页。

典型场景:Claude 拆需求,Codex 写代码,两份订阅各用各的。[让 Claude 规划任务,Codex 去执行](/blog/2026/07/19/claude-plans-codex-executes/)写了完整做法。

## 哪块看板适合你

下表来自各项目 2026 年 11 月 4 日的 README:

| | claude-code-kanban | Kanban Code | Vibe Kanban | udctl |
|---|---|---|---|---|
| 形态 | 本地 Web 面板 | macOS、Windows 原生应用 | 本地后端加 Web 界面 | 自托管服务器,加 Web、桌面、iOS 客户端和 CLI |
| 从看板开工 | 能 | 能 | 能 | 能,评论里 @ agent |
| 数据来源或存放 | 监听 Claude Code 写的任务文件和 transcript | `~/.kanban-code` 加本机 Claude 会话 | 本机 | 你部署的服务器 |
| Agent | 围绕 Claude Code | README 只列出 Claude Code | Claude Code、Codex、OpenCode 等十种 | Claude Code、Codex、OpenCode 等 |
| 多人 | 默认只监听 127.0.0.1,无认证 | README 未写 | README 未写账号和权限 | 群组,有管理员和成员角色 |
| 许可 | MIT | Apache 2.0 | Apache-2.0 | 专有,个人和 3 人以内团队免费 |

按你的用法选:

- 一个人、一台机器、只用 Claude Code,想要一块实时面板,选 claude-code-kanban,它跑在 localhost 上,不需要服务器。
- 想要原生桌面应用,选 Kanban Code。
- 在自己机器上并行跑多个 agent,每个工作区要有自己的分支、终端和开发服务器,选 Vibe Kanban。它的公司已宣布关停,项目由社区继续维护,详见 [udctl 与 Vibe Kanban 的对比](/compare/vibe-kanban/)。
- 要一台常开的服务器给几个人共用,在手机上看看板和线程,任务旁边还放着笔记和开销,选 udctl。

## 在自己的机器上跑起来

最快的是[下载桌面客户端](/download),后端内置,打开就能用,在 Workspaces 页把这台设备登记为 daemon 就能接活。想放到服务器上,用一个 Docker 镜像:

```bash
docker run -d --name undercontrol \
  -p 3000:8080 \
  -e HOST_DOMAIN=http://localhost:3000 \
  -e JWT_SECRET=<运行 openssl rand -base64 48 生成> \
  -v undercontrol-data:/app/data \
  lintao0o0/undercontrol:latest
```

然后在要跑 agent 的机器上装 CLI 并启动 daemon:

```bash
npm install -g @oatnil/ud
ud login
ud daemon start
```

完整步骤在[快速开始](/docs/getting-started)和[自托管](/self-hosting)。第一次用 agent 命令行的话,先看[怎么在命令行里用 AI agent](/blog/2026/09/19/use-an-ai-agent-from-the-command-line)。

## FAQ

### 必须买 Claude Code Max 吗?

不用。udctl 启动的是机器上已经装好的 `claude` 命令,用的是它现有的登录,用量算在你自己的账号上。Codex 和其他 agent 同理。

### 两个人能共用一块看板吗?

能。一个人用不需要授权;3 人以内的团队可以申请一份免费授权,更大的团队按规模付费。卡片通过群组共享,群组有管理员和成员角色。

### 日志在哪里?

agent 的结论在线程里,进展在笔记里。完整的终端输出由 daemon 回传到服务器,会话结束后也能查:

```bash
ud describe session <session-id> --tail 40
```

### agent 以什么权限运行?

默认无人值守。内置的 Claude Code 启动命令是 `claude --dangerously-skip-permissions`,Codex 是 `codex --yolo`,所以会话不会停下来等你确认每条命令,它拥有运行 daemon 的那个系统账号的权限。启动命令可以改,`ud cook agent-cli update-agent-cli` 有写法。工作目录在看板设置里配置,没配时落在专用目录 `~/.undercontrol/workspace`。

装好之后,挑一件今天本来要自己开终端做的小事写成卡,在评论里 @ 你的 agent。
