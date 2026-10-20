---
sidebar_position: 0.5
title: 快速开始
description: 从零到第一张卡片、第一件交给 agent 的活:选好 udctl 跑在哪里、登录、建卡、装 ud 命令行、把任务交给你的 AI agent。
---

# 快速开始

这一页带你从零走到一个能用的 udctl:服务端跑起来、账号登录、建出第一张卡片、装好 `ud`
命令行，再让你自己的 AI agent 干完第一件活。每一步都写了做成之后你应该看到什么。

界面按钮在中英文界面下文字不同，下文写作「中文(English)」。

## 1. 选好 udctl 跑在哪里

udctl 总是连着一个服务端。三选一:

| 选项 | 适合 | 你得到的 |
| --- | --- | --- |
| **A. 桌面版** | 一个人用一台 Mac、Windows 或 Linux 电脑 | 应用自带后端，首次打开自动登录。agent 就在这台机器上跑。 |
| **B. Docker** | 自己的服务器、NAS、VPS,或没有桌面环境的机器 | 一个容器包含网页端和后端，用浏览器打开。 |
| **C. 浏览器试用** | 装任何东西之前先看看 | [app.udctl.com](https://app.udctl.com),后面是我们运行的**测试服务器**,不要把正式数据放在上面。 |

### 选项 A:桌面版

1. 在[下载页](/download)下载对应平台的安装包。
2. 打开应用。它会在 `http://localhost:24816` 启动自带的后端并替你登录，不需要注册账号。
3. 登录密码每次安装随机生成。只有从别处登录(浏览器、另一台机器上的命令行)时才用得到，
   在 **个人资料(Profile)→ 密码(Password)** 里能看到。

接着看[第 2 步](#2-首次登录向导)。

### 选项 B:Docker

机器上需要有 Docker。先生成一个密钥，并在这个实例的整个生命周期里一直用它(它还用来加密存储的设置，
见[首次启动前设置 JWT_SECRET](./self-deployment.md#jwt-secret)):

```bash
openssl rand -base64 48
```

启动容器，把上面生成的值填到 `JWT_SECRET`:

```bash
docker run -d --name undercontrol \
  -p 3000:8080 \
  -e HOST_DOMAIN=http://localhost:3000 \
  -e JWT_SECRET=<把生成的值粘贴到这里> \
  -v undercontrol-data:/app/data \
  lintao0o0/undercontrol:latest
```

确认已经就绪:

```bash
docker logs undercontrol
```

日志最后是一段就绪横幅，写明去哪里打开、用什么登录:

```text
  UnDercontrol 0.163.0-020cec4 is ready

  --> Open http://localhost:3000 to get started

      Login as:  personal@undercontrol.local
                 default password: personal123 (set PERSONAL_TIER_PASSWORD to change it)
```

打开 `http://localhost:3000`,点 **登录(Log in)**,用横幅里的邮箱和密码登录。如果容器启动后马上退出，
同一份日志里会有一段 `STARTUP FAILED`,写明要改什么。3000 端口被占用?把 `-p 3000:8080` 和
`HOST_DOMAIN` 一起换成别的端口。

自建服务端的其他方式(npm、Homebrew、Kubernetes、PostgreSQL、S3)见[自部署指南](./self-deployment.md)。

### 选项 C:浏览器试用

打开 [app.udctl.com](https://app.udctl.com)。登录页上有 **访客(免注册)(Visitor (No signup))**
可以先随便看看，也可以点 **在此注册(Register here)** 在测试服务器上注册账号。那里的数据只用于试用。

## 2. 首次登录向导

第一次登录后会弹出一个三步的向导:

1. **语言(Language)**:中文或英文。
2. **机器(Machine)**:说明 agent 要跑在你自己的机器上，给出桌面版下载链接，还有一个
   **交给你的 agent(Paste to your agent)** 框，里面是给 AI agent 的接入说明。下面
   [第 4、5 步](#4-安装-ud-命令行并登录)是同一件事的手动做法。
3. **Alfred**:你的管家，负责把活派给 agent。他需要一台机器来运行(桌面版，或 `ud` daemon),
   所以在纯服务器上可以先跳过这一步。

每一步都可以 **跳过(Skip)**,点 **完成(Finish)** 关闭向导。之后进入任务资源管理器，里面已经有一张欢迎卡片。

## 3. 建第一张卡片

1. 在左侧栏打开 **看板(Kanban)**。
2. 点某一列底部的 **添加任务(Add task)**。
3. 输入标题，比如 `我的第一张卡片`,点 **创建任务(Create Task)**。

卡片马上出现在看板上。卡片内容是 markdown,同一张卡片可以是待办、文档，也可以是会议记录。

## 4. 安装 ud 命令行并登录

`ud` 是命令行客户端。你的 AI agent 也通过它干活，所以即使你习惯用网页端也建议装上。需要 Node.js 18 或更新版本:

```bash
npm install -g @oatnil/ud
ud --version
```

登录，地址用第 1 步里你的服务端:

```bash
ud login --api-url http://localhost:3000 -n personal
```

它会询问邮箱和密码。把 URL 换成你自己的:

| 你选的是 | `--api-url` |
| --- | --- |
| Docker(选项 B) | `http://localhost:3000`,或你在 `HOST_DOMAIN` 里填的地址 |
| 测试服务器(选项 C) | `https://api.udctl.com`(先在 app.udctl.com 注册) |
| 桌面版(选项 A) | 一般不需要：第一次打开工作区时，应用会替你安装命令行并登录(context 名为 `personal`)。手动登录的话地址是 `http://localhost:24816`,密码在 **个人资料 → 密码** 里。 |

看看自己是谁，列出卡片:

```bash
ud whoami
ud get task
```

应该能看到第 3 步建的卡片。再从终端建一张:

```bash
cat <<'EOF' | ud apply -f -
---
title: Try the ud CLI
---
Created from the terminal.
EOF
```

`ud get task` 里能看到它，网页端也会出现。更多命令见 [CLI 参考](./cli.md)。

## 5. 把第一件活交给 agent

udctl 配合你已经在用的 AI 编程 agent(Claude Code、Codex、Cursor 等):agent 通过 `ud`
读写你的卡片。最快的办法是让 agent 自己把 `ud` 配好 —— 把下面这段话粘给它。这和首次登录向导里
**复制给你的 agent** 那个框复制出来的是同一段:

<!-- BEGIN generated: agent paste (web, zh) · source ud-vite-app/src/components/onboarding/agent-setup-prompt.ts -->
```text
我在用 udctl,一个放我任务、笔记和文件的工作区。你可以在终端用 `ud` 命令读取和修改它。我的 udctl 服务器是 <YOUR-SERVER-URL> —— 问我要地址,下面每条命令都用它。

1. 装好 `ud`。如果这台电脑上有 udctl 桌面版,就用它自带的 `ud`;否则 npm install -g @oatnil/ud
2. 帮我登录。永远不要问我密码或 key,也不要替我输入。把下面两种方式讲给我听,让我自己选,然后等我做完:
   a. 在我自己的终端里:ud login --api-url <YOUR-SERVER-URL> -n udctl-<SERVER-HOST>(它会问我密码)
   b. 在 udctl 里,Profile → API Configuration → Create Key,然后在我自己的终端里:ud config set-context udctl-<SERVER-HOST> --api-url <YOUR-SERVER-URL> --api-key <我的 key>
   用 udctl-<SERVER-HOST> 这个上下文(如果它不是当前上下文,就加 --context)。永远不要写名为 `personal` 的上下文。按我的服务器给上下文起名:`udctl-` 加主机名,端口不是默认的就加端口,点和冒号都换成连字符(http://localhost:3300 -> udctl-localhost-3300,https://api.udctl.com -> udctl-api-udctl-com)。
3. 先学会用:`ud describe skill ud-cli` 是完整说明;`ud get skills` 列出更多。
4. 跑一次 `ud config onboarding --done`。它会告诉我的 udctl 窗口你已经连上了。
5. 然后当我的向导:用几句话告诉我可以让你用 udctl 做些什么,问我这周在忙什么,把我的回答变成我的第一批卡片。

关于 udctl 的更多信息:官网是 https://udctl.com。想把它部署到我自己的服务器上,自部署指南在 https://udctl.com/zh-Hans/docs/self-deployment/ ,其余文档的索引在 https://udctl.com/llms.txt ,遇到问题先自己去查,再来问我。卡住了,udctl 的 Telegram 群是 https://t.me/+4hZC0GtTe1syYzhl
```
<!-- END generated: agent paste (web, zh) -->

把 `<YOUR-SERVER-URL>` 换成第 1 步里你的服务器地址。agent 会装好 `ud`、指导你登录(密码或 key
由你自己输入,它绝不索要),从 skill 学会命令行,跑一次 `ud config onboarding --done`,再把你告诉它的
事变成你的第一批卡片。

### 或者手动配置

把 `ud` 的使用说明交给 agent,放在你打开 agent 的那个项目目录里。以 Claude Code 为例:

```bash
mkdir -p .claude/skills/ud-cli
{ printf -- '---\nname: ud-cli\ndescription: Manage tasks and record progress via notes using the ud CLI.\n---\n\n'; ud describe skill ud-cli -o content; } > .claude/skills/ud-cli/SKILL.md
```

其他 agent 从别的路径读说明(`AGENTS.md`、`.cursor/rules/` 等),`ud config onboarding` 会列出来。
然后在这个目录里启动 agent,交给它一件实际的事，比如:

```text
用 ud 命令行看看我的任务，然后建一张标题为「规划本周」的卡片，正文里写一个三项的清单。告诉我新卡片的 id。
```

agent 会运行 `ud get task`,用 `ud apply` 建卡，并回报卡片 id。网页端马上就能看到这张卡片。

## 接下来

- [AI agent 集成](./cli-ai-integration.md):agent 能用 `ud` 做什么。
- [Cookbook](/zh-Hans/docs/cookbook):常见操作的简短配方。
- [查询语法](./query-syntax.md)和[保存的查询](./saved-queries.md):查找和整理卡片。
- [自部署指南](./self-deployment.md)和[配置参考](/configuration):正式运行自己的服务端。
- [下载](./download.md):所有应用和渠道的清单。
