---
title: "选模型这件事，也交给 agent:轻活走快模型，难活交给最强的"
description: "每派一件活都要先想用哪个模型，这本身就费神。在 udctl 里把选模型的规则写一次,Alfred 照着规则自己选、自己派：改错别字走 Haiku,设计界面走 Fable,复核再请 Codex 看一遍。想亲手指定，派活时换一行 CLI,只对这一条消息生效。"
authors: [lintao]
tags: [feature, guide]
date: 2026-11-12
image: https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/01-alfred-picks.jpg
---

改一个错别字，和设计一整套界面，不该是同一个价钱、同一个等法。可如果每派一件活都要自己先想「这次用哪个模型」,这个决定本身又成了一件活。

这篇讲 [udctl](/)(UnDercontrol)里的一种做法：把选模型的规则写一次，交给 Alfred 去照着选、照着派。你省下的是每次派活前那一下判断;轻活不再排在最强模型后面等，难活也不会被派给不够用的模型。

我们把这件事拍成了一支 1 分半的片子，画面里的派工是真跑出来的。这篇是片子的文字版。

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginBottom: '1rem'}}>
  <iframe
    src="https://player.bilibili.com/player.html?bvid=BV1GdWQ6FEEt&autoplay=0&high_quality=1"
    title="选模型这件事，也交给 agent"
    style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0}}
    allowFullScreen
  ></iframe>
</div>

B 站:[BV1GdWQ6FEEt](https://www.bilibili.com/video/BV1GdWQ6FEEt) · 英文版在 [YouTube](https://www.youtube.com/watch?v=j3Pvh3PWjiM)

![你只说一句「派出去」,Alfred 读规则，把改错别字、整理标签、做表单、设计界面、最终复核分别派到 claude-haiku、claude-sonnet、claude-opus、claude-fable 和 codex](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/01-alfred-picks.jpg)

<!-- truncate -->

## 每个模型就是一行命令，用什么模型一眼看得到

在 udctl 里，每个模型是一行 agent CLI,模型就写在命令里。比如 `claude-fable` 这一行就是 `claude --dangerously-skip-permissions --model fable`,`claude-haiku` 是同一条命令换成 `--model haiku`。

不只是 Claude。Codex、Pi,你电脑上装了哪个，就能挂哪个;列表底下点「New CLI...」再加一行。Claude Code、Codex、OpenCode,或任何在终端里跑的 agent 都是这样接进来的。

![设置页的 agent CLI 列表:Codex、Pi,以及 Fable、Haiku、Opus、Sonnet 四行 Claude Code,每行命令末尾的 --model 参数标了出来](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/02-agent-cli-list.jpg)

## 常用的分工，配一次就不用再管

每个 agent 有自己的默认：写代码的 coder 用 Opus,做设计的 designer 用 Fable,复核的 reviewer 交给 Codex。在 agent 的编辑表单里，「Runs with」选一行 CLI 就是它的默认。

![reviewer 的编辑表单:Runs with 选的是 Codex,旁边提示这台机器上可用](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/03-agent-default.jpg)

## 不用每次派活都重新想一遍用哪个模型

默认只解决了「这个 agent 平时用什么」。可同一个 coder,今天要改一个按钮上的错别字，明天要做一整张表单，用同一个模型不划算。于是每派一件活，你又得想一遍。

把这个判断写成规则，写一次。设置里的 Global Instructions(全局指令)会进到每一个会话的提示词里，你自己的会话和你触发的 agent 的会话都算。片子里写的是这样一条:

> Choosing a model: default to claude-opus; simple jobs use claude-sonnet; tiny, repetitive jobs use claude-haiku; complex jobs that need strong design use claude-fable; for code review, have codex take a look as well.

![Global Instructions 输入框里写着选模型的规则](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/04-global-rule.jpg)

## 一句话派出去，每件活落到合适的模型上

规则写好之后，选模型这个决定也可以交给 Alfred。片子里演示账号只对 Alfred 说了一句:「Dispatch the four jobs on the "Checkout page redesign" card」。

Alfred 读了规则，自己拆卡、自己派。那一次真跑的结果：

| 子卡上的活 | 派给 | 用的 CLI |
|---|---|---|
| 新的布局和交互草稿 | designer | claude-fable |
| 做表单和校验 | coder | claude-opus |
| 改按钮文字里的错别字 | coder | claude-haiku |
| 合并前复核 | reviewer | claude-opus |
| 复核的第二遍 | reviewer | codex |

最后一行是 Alfred 按规则里「复核再请 codex 看一遍」多开的一张。每张子卡各起一个会话，加上 Alfred 自己，一共 6 个。

他发出的每一条派工，都在 agent 点名旁边带着一行 CLI:

![Alfred 写在子卡上的派工:@designer 旁边带着 @claude-fable](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/05-dispatch-names-cli.jpg)

被派的会话，就按那一行启动。打开 designer 的会话，Command 里是 `--model fable`:

![designer 会话正在运行,Command 一栏的启动命令里是 --model fable](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/06-session-command.jpg)

如果你的 Alfred 派工时只点了 agent、没带 CLI,会话会按那个 agent 的默认行启动。这时在 Alfred 的提示词里加一句:「派工时，把全局指令里选模型规则要求的那一行 CLI 带在 agent 点名旁边」,之后的派工就会带上。

## 想自己拍板，也只是换一行

有时候你就是想指定。派活的时候，在输入框上方的下拉里换一行 CLI 就行，比如这次让 coder 用 claude-haiku 改个错别字。

这只对这一条消息生效,agent 的默认不动，下一条消息还是它原来的那一行。

![输入框上方的 CLI 下拉:选中 claude-haiku,底部写着 For this message only,coder 自己的默认在 Manage coder 里设置](https://dl.udctl.com/features/blog/let-your-agent-pick-the-model/07-per-message-cli.jpg)

## 自己搭一套：三步

1. **把模型挂成 CLI。** 设置里的 agent CLI,每个模型一行，模型写在命令里。
2. **给每个 agent 选默认。** agent 编辑表单里的「Runs with」。
3. **在 Global Instructions 里写一条选模型的规则。** 写清楚什么样的活用哪一行;然后把活交给 Alfred,说一句「派出去」。

这三步也不用你亲手点：对你的 agent 说你想要的分工，让它去配，配完在对话里调到合适为止。

[udctl.com](https://udctl.com)
