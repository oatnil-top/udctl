---
title: "怎么在命令行里用 AI agent?"
description: "三步在终端里跑起一个 AI agent:装一个 CLI(Claude Code、Codex 之类),给它一个任务,再用 udctl 把你的上下文一并交过去。"
authors: [lintao]
tags: [cli, ai-agent, guide]
image: https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/ai-agent-command-line/og-hero.png
date: 2026-09-19
---

AI agent CLI 是跑在你终端里的一个程序,比如 Claude Code、Codex、Gemini CLI。你用大白话描述一件事,它读文件、执行命令、在你机器上改代码,任何有破坏性的动作之前都会先问你一句。怎么用:一条命令装上,在项目目录下打开一个终端,把要做的事打进去。三步,前两步大约一分钟。

![终端里的 AI agent:读取任务、写回进度](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/ai-agent-command-line/og-hero.png)

<!-- truncate -->

下面是详细版:装哪一个、输入什么、以及怎么把仓库里没有的那部分上下文交给它。

## 1. 装一个 agent CLI

挑一个就行。下面这几条,就是 udctl 桌面端在你机器上找不到对应二进制时打印出来的安装命令:

| Agent CLI | 安装 | 然后运行 |
|---|---|---|
| Claude Code | `curl -fsSL https://claude.ai/install.sh \| bash` | `claude` |
| Codex | `npm install -g @openai/codex` | `codex` |
| Gemini CLI | `npm install -g @google/gemini-cli` | `gemini` |

Windows 上 Claude Code 用 `irm https://claude.ai/install.ps1 | iex`,另外两个的 npm 命令一样。

安装命令和包名会变。哪一条跑不通,以厂商自己的安装页为准,不要以这篇文章为准。

第一次运行会让你登录。之后这个二进制就在 `PATH` 上,跟别的命令行工具没区别。

## 2. 在命令行里给它一个任务

先切到项目目录。你启动它的那个目录就是 agent 的工作上下文,大多数 agent 不会主动去读上一层的文件。

```bash
cd ~/code/my-project
claude # 或者 codex / gemini
```

然后把事情打进去。三个开箱就能用的例子:

**读懂一个刚 clone 下来的仓库。**

```
读一下这个仓库,用十行告诉我它构建的是什么、入口在哪、测试怎么跑。
```

**修一个挂掉的测试。**

```
`npm test` 在 auth 那组挂了。跑一遍,查清原因,修好,再跑一遍。
```

**把一堆会议记录整理成待办。**

```
读 notes/2026-09-18-standup.md,给我一份带责任人的行动项清单。
```

每条命令执行前、每处改动写入前,agent 都会先给你看。长任务一条条点确认很烦,但头几次值得,直到你摸清它在你这个仓库里的行为为止。

这三个 CLI 也都支持把任务当参数传进去,方便你写进脚本,只是参数各不相同(`claude -p`、`codex exec`、`gemini -p`)。以你装的那个版本的 `--help` 为准,别照抄博客里的参数。

## 3. 交给它的不只是代码,还有上下文

agent 能读你的代码,但读不到改动的原因:那张写着客户到底反馈了什么的工单、三周前你把最顺手那个方案否掉时留下的笔记、挂在 bug 上的那张截图。这些在浏览器标签页里,而 agent 没有浏览器标签页。

[udctl](/)(UnDercontrol)把它们放进同一个终端。它的 CLI 叫 `ud`,读写的就是你在应用里看到的那些任务、笔记、评论和附件:

```bash
npm install -g @oatnil/ud # 需要 Node.js 18+
ud login
ud get task # 确认能看到你的任务
```

接下来直接按 id 把任务交给 agent,不用再复述一遍:

```bash
ud describe task 205bcf01
```

你不需要教 agent 这些命令。CLI 自带一份面向 agent 的说明,它自己在运行时加载:

```bash
ud describe skill ud-cli
```

整个配置就这些,完整说明在 [AI agent CLI](/docs/cli-ai-integration) 这一页。做完之后,agent 用读任务的同一套方式把进度写回去,提交号一起带上:

```bash
cat <<'EOF' | ud apply -f -
---
task_id: 205bcf01
---
修好了 auth 拦截器里 token 刷新的竞态。Commit: def456
EOF
```

能交的不止任务。笔记、支出、账户在同一个存储里,是同一种 Markdown 文档,用同一个编辑器编辑,也用同一个 CLI 取。如果一件事的上下文一半是规格、一半是一张收据,两边都是一条 `ud` 命令的距离。[CLI 参考](/docs/cli) 列了全部资源类型。

## 4. 让它在你不在的时候跑

在终端里打字,意味着你得坐在终端前面。有两条路绕开它,底下是同一个 daemon:

**从一个任务起一个 session。** 把桌面端注册成 daemon,打开任务,选中这个 daemon,起一个 workspace session,桌面端就会开一个窗口:左边是任务,右边是已经跑起来的 agent,启动时就把任务当成它的 prompt。

**在任务评论里 @ 一个 agent。** 这条 mention 会在跑着 daemon 的那台机器上把 agent 唤醒,它带着任务的描述、笔记和关联一起接手。两点要知道:只有**评论**里的 mention 能唤醒 agent,写在笔记里的不行;mention 不排队,daemon 离线时这次投递会被丢掉,不会留着等。

两条路都一样:agent 认为做完时把任务改成 `pending`,不是 `done`。review 这一关还是你的。

如果你连应用都不想打开,[Alfred](/alfred) 就是同一套机制套了个聊天窗口:在 Telegram 里发一条消息,它派给你的 agent,再在同一个会话里回报。

## FAQ

### 该选哪个 agent CLI?

它们的形状是一样的,所以按你已经在付费的模型订阅选:Anthropic 选 Claude Code,OpenAI 选 Codex,Google 选 Gemini CLI。OpenCode 和 Aider 与模型无关,如果你经常换供应商、或者想接自己跑的模型,值得看一眼。udctl 桌面端按二进制名认七个:`claude`、`codex`、`opencode`、`aider`、`gemini`、`copilot`、`qwen`,这篇文章里的功能没有一项绑定其中任何一个。

### 让 agent 执行命令安全吗?

它以你这个用户的权限运行,所以把它当成别人发给你的一个 shell 脚本来对待。两个习惯覆盖大部分情况:在版本控制下的目录里工作,这样每处改动在发出去之前都先出现在 `git diff` 里;确认提示先别关,直到你看着它在这个仓库里做完几件事为止。这几个 CLI 都有一个不再询问的模式,那个模式是给容器用的,不是给你的笔记本用的。

### agent CLI 能离线用吗?

不能。agent 在本地跑,模型不在,所以每一轮都是一次到供应商的网络请求,除非你用的是与模型无关的 CLI 接自己硬件上的模型。你的任务数据是另一回事:udctl 的后端可以[自部署](/docs/self-deployment),所以即使模型调用要出网,agent 读的那份上下文可以留在你自己机器上。

### 需要装编辑器插件吗?

不需要。`ud` 就是一个普通的命令行工具,没有编辑器集成,所以任何终端里的 agent 都能用它本来就有的 shell 权限驱动它。你的 agent 能跑 `ls`,就能跑 `ud`。

---

从上面三个 CLI 里装一个,然后[装上 `ud`](/download),在同一个终端里跑 `ud describe skill ud-cli`。
