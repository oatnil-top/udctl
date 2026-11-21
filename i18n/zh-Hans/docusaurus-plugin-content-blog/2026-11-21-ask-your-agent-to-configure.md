---
title: "不用自己配置，让你的 agent 去做"
description: "在 udctl(UnDercontrol)里，整台实例的设置是一份 YAML 文档。你说一句要什么,agent 读它、改那一个键，再把新值读回来给你看。"
authors: [lintao]
tags: [feature, guide]
date: 2026-11-21
image: https://dl.udctl.com/features/blog/ask-your-agent-to-configure/01-cover.jpg
---

自己部署的服务，总有一项设置要改：成员传不上文件，登录过期太快，默认存储配额不够。通常要先打开管理后台，在几十项里找到它;再查文档，弄清它对应哪个环境变量、改了要不要重启。

在 [udctl](/)(UnDercontrol)里，这一步可以交给 agent:你说一句要什么，它去读设置、改那一个键，再把新值读回来给你看。

我们把这件事拍成了一支 85 秒的视频:[在 B 站观看](https://www.bilibili.com/video/BV1cZytzVE3d)。这篇是文字版，截图都取自片中画面，Mara、Dana 和视频文件都是演示数据。

![一句话进去，agent 改掉设置文档里的一行](https://dl.udctl.com/features/blog/ask-your-agent-to-configure/01-cover.jpg)

<!-- truncate -->

## 来由：让 agent 替用户去配

这个想法来自一场 Linux meetup。我在那里了解到 Omarchy 的做法：系统的设置是纯文本文件，系统还给 agent 带了一份说明，写明怎么读、怎么改用户的配置。用户说要什么，agent 去配。

udctl 用的是同一个想法，落在自己的实例设置上。

## 不用在几十项设置里找那一项：整台实例的设置是一份 YAML

一条命令导出整台实例的设置:

```
ud describe systemconfiglist -o apply
```

出来的是一份 YAML 文档。每个键下面写着它的值、类型、是谁设的(默认值、环境变量还是管理员)、对应的环境变量名和默认值。拍片用的那台实例上一共 65 个键。

![终端里导出的 SystemConfigList 文档，每个键带着 value、settableFrom、setBy、envVar](https://dl.udctl.com/features/blog/ask-your-agent-to-configure/02-one-yaml-document.jpg)

同样这些设置，管理后台的 System Config 页里也有，一项一项排下来。你可以自己去找;agent 读的是上面那份文档。

![管理后台 System Config 页，Max File Size 一项的值是 10485760](https://dl.udctl.com/features/blog/ask-your-agent-to-configure/03-admin-page.jpg)

## 不用先查「这项能不能在线改」：文档里写着

每个键都有一个 settableFrom 字段，说明它从哪里改:

| settableFrom | 含义 | 例子 |
|---|---|---|
| admin-only | 只能由管理员在这份文档或后台里改 | storage.quota.default_storage_gb(每个用户的默认存储配额) |
| env-or-admin | 环境变量给初始值，管理员可以在文档里改 | storage.max_file_size(单个文件上传上限)、security.jwt.expiration_minutes(登录令牌过期时间) |
| boot-only | 启动时读一次，只能改环境变量 | scheduler.visitor_cleanup.schedule(访客数据清理的定时) |

改一个 boot-only 的键，apply 会整份拒绝，拒绝信息里写着该去改哪个环境变量。所以 agent 动手前就能看出这一项能不能在线改;不能在线改的，拒绝信息也写明了该改哪个环境变量。

## 成员被卡住时，你只说一句

片子里，团队成员 Mara 想传一个 38 MB 的视频，实例的上传上限是 10 MB,被拒了。

![成员 Mara 上传 studio-reel.mp4 被拒，提示文件 38.0 MB,上限 10.0 MB](https://dl.udctl.com/features/blog/ask-your-agent-to-configure/04-member-rejected.jpg)

管理员 Dana 在对话里对 Alfred(udctl 内置的 agent)说了一句:

> Mara can't upload a 40 MB video. Raise the upload limit to 100 MB.

41 秒后 Alfred 回复：上传上限 storage.max_file_size 从 10 MB 改成了 100 MB,读回来确认已生效,Mara 可以再试。

![对话里 Dana 的一句话和 Alfred 的回复](https://dl.udctl.com/features/blog/ask-your-agent-to-configure/05-alfred-answers.jpg)

这一次他直接改了。同样一句话，他有时会先问你确认，再动手。

## 改了什么，你看得到，也核得了

Alfred 做的事，在他的会话记录里是三步：读这份设置文档;写一份只含要改的那个键的五行 YAML,apply;再把这个键读回来。

```yaml
apiVersion: ud/v1
kind: SystemConfigList
forServer: http://localhost:24971
spec:
  storage.max_file_size: 104857600
```

apply 的回执是 `1 written, 0 ignored`,并列出这个键从 10485760 变成 104857600;读回来时 setBy 一栏是 admin。你自己跑一遍 `ud describe systemconfiglist`,看到的是同一个值。

![终端重放：五行 YAML 应用后回读,storage.max_file_size 为 104857600,setBy 为 admin](https://dl.udctl.com/features/blog/ask-your-agent-to-configure/06-apply-and-read-back.jpg)

Mara 再传一次，成功了。

![Mara 的 Files 页里出现 studio-reel.mp4,类型 Video](https://dl.udctl.com/features/blog/ask-your-agent-to-configure/07-upload-goes-through.jpg)

## 不只 Alfred:任何在终端里跑的 agent 都能这么做

Alfred 用的是普通的 ud 命令。Claude Code、Codex、OpenCode,或者任何在终端里跑的 agent,只要它用的 ud CLI 登录的是管理员账号，就能照同样的步骤读和改。`ud cook systemconfiglist` 里有四条现成的写法：导出整份设置、改一个键、把一个键恢复默认、哪些能改哪些不能改。

典型场景:

- 成员反映文件传不上去：让 agent 把 storage.max_file_size 调到你说的大小。
- 团队嫌一小时就要重新登录：让 agent 把 security.jwt.expiration_minutes 改长。
- 新成员多了、存储不够分：让 agent 调 storage.quota.default_storage_gb。
- 想知道某项现在是谁设的：让 agent 读文档里的 setBy,告诉你是默认值、环境变量还是管理员改过。

## 怎么开始

改实例设置需要 Pro 或 Max 版实例上的管理员账号。在 udctl 的对话页里点名 Alfred,用一句话说你要改什么;或者在终端里先跑一次 `ud describe systemconfiglist -o apply`,看看你的实例上有哪些键。
