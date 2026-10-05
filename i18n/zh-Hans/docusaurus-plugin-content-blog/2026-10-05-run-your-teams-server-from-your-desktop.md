---
title: "用你的桌面电脑跑团队服务器"
description: "udctl 桌面版里带着完整的后端。加一个 license 就是多人团队后端，用 Cloudflare Tunnel 放上公网，再让手机连上它。不需要 VPS,不需要公网 IP,也不需要 Docker。"
authors: [lintao]
tags: [tutorial, self-hosting]
date: 2026-10-05
image: https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/run-your-teams-server-from-your-desktop/03-architecture.jpg
---

udctl(UnDercontrol)桌面版里带着完整的后端。装上它，你的电脑就已经是一台服务器：监听 `localhost:24816`,任务、笔记、账本都存在你自己磁盘上的一个 SQLite 文件里。加一个 license,这台服务器就成了多人团队后端。再加一条 Cloudflare Tunnel,你的手机、笔记本和队友在哪儿都能连上它。不需要 VPS,不需要公网 IP,也不用在路由器上做端口转发。

![示意图：你的电脑上运行 udctl 桌面版，内置后端监听 localhost:24816,数据以 SQLite 文件存在本机磁盘;cloudflared 隧道把它接到公网，手机和团队成员通过 HTTPS 访问](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/run-your-teams-server-from-your-desktop/03-architecture.jpg)

<!-- truncate -->

你也不需要会 Docker。大多数自部署教程第一步是容器、环境变量和反向代理。这里的服务器是一个桌面应用，像别的软件一样安装，打开就在运行。本文里所有终端命令都是给 Cloudflare 隧道用的，没有一条是给服务器的。

下面这段 78 秒的视频把整条路走了一遍(视频里的界面是英文版)。正文是同一条路，换成可以直接复制的命令。

[在 YouTube 上看 78 秒演示](https://www.youtube.com/watch?v=xp3N_cU-_zw)

## 第一步：安装桌面版

从 [udctl.com/download](https://udctl.com/download/) 下载:macOS(Apple Silicon 和 Intel)、Windows x64,或 Linux x64 AppImage。桌面版不是套了个窗口的网页。它自带 Go 后端，应用一启动后端就跟着启动。不用拉 Docker 镜像，也不用装数据库。应用装好了，服务器也就装好了。

![udctl 桌面版的看板，有 To do、In progress、Done 三列，数据来自同一台电脑上运行的后端](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/run-your-teams-server-from-your-desktop/01-desktop-kanban.jpg)

确认它在运行:

```bash
curl http://localhost:24816/health
# {"status":"healthy", ...}
```

24816 是固定端口。如果它已经被别的程序占用，应用会直接显示后端日志，而不是悄悄换一个端口，这样指向 24816 的隧道不会连到一个空端口上。(旧的教程，包括我们 7 月那篇，用的是 8888,现在已经不用了。)

只自己用的话，这就是 Personal 档：单用户、免费、不需要 license key。应用会用这次安装时随机生成的密码自动帮你登录。在个人资料页的账户信息里可以看到这个密码，也可以重置;CLI 和手机用的就是这组账号密码。

## 第二步：激活 license,变成团队后端

服务器只给自己用，可以跳过这一步。

给团队用的话，打开个人资料页，进入 **系统与语言 → 许可证**(英文界面为 System & Language → License),填四个字段:

- **许可证 token**
- **Host secret**
- **管理员邮箱**,之后就是你的管理员登录名
- **管理员密码**

点 **激活**。后端会重启，需要几秒钟，之后许可证一栏显示档位 **Pro**。第一次激活时，这台机器上已有的数据会转到你刚填的管理员账号下，内置的 personal 账号会被移除。数据不会丢：任务、笔记和记录换的是所有者，内容不变。表单在你点击之前会提示这一点，因为这一步只做一次，而且不能撤销。

![激活后「系统与语言」下的许可证一栏：档位显示 Pro(Active)和到期日期，顶部提示 "Activating... restarting local backend"(截图为英文界面)](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/run-your-teams-server-from-your-desktop/02-license-pro-active.jpg)

从这里开始你就是服务器管理员了。在 **管理面板 → 用户管理 → 创建用户**(英文界面为 Admin → Access → Users → Create User)给队友开账号。

license 从哪里来：按[定价页](https://udctl.com/docs/pricing/),3 人以内的团队免费，整个团队一张免费 license,[联系我们](https://udctl.com/contact)领取。更大的团队按人数档定价:20 人以内每月 49 美元，不限人数每月 149 美元。

## 第三步：一条命令放上公网

Cloudflare Tunnel 靠的是反向连接：你电脑上的 `cloudflared` 主动连到 Cloudflare 边缘节点，外面的请求再顺着这条连接回来。因为连接是从你的机器往外发起的，所以不需要公网 IP,也不用碰路由器。

安装 cloudflared:

```bash
# macOS
brew install cloudflared

# Windows
winget install Cloudflare.cloudflared

# Linux (Debian/Ubuntu): 先按 https://pkg.cloudflare.com 添加软件源
sudo apt install cloudflared
```

然后:

```bash
cloudflared tunnel --url http://localhost:24816
```

几秒后它会打印一个随机的 `https://<something>.trycloudflare.com` 地址。这就是你的公网入口，自带 HTTPS,而且不需要 Cloudflare 账号。用手机走蜂窝数据(关掉 Wi-Fi,确认请求确实是从外网进来的)打开 `https://<something>.trycloudflare.com/health`,看到 `healthy` 就通了。

![终端里运行 cloudflared tunnel --url http://localhost:24816,输出显示隧道已建立并把流量转到 localhost:24816。图中地址是占位符，真实的快速隧道会打印一个 trycloudflare.com 地址](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/run-your-teams-server-from-your-desktop/04-cloudflared-tunnel.jpg)

拿到这个地址的人都能打开你的登录页，所以分享之前先给管理员账号设一个正经的密码。

### 日常使用：固定地址

快速隧道的域名在每次 `cloudflared` 重启后都会变。团队天天要用的服务器，改用命名隧道。它需要一个免费的 Cloudflare 账号，以及一个托管在 Cloudflare 上的域名。

```bash
cloudflared tunnel login
cloudflared tunnel create ud
cloudflared tunnel route dns ud ud.example.com
```

`~/.cloudflared/config.yml`:

```yaml
tunnel: ud
credentials-file: /Users/you/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: ud.example.com
    service: http://localhost:24816
  - service: http_status:404
```

```bash
cloudflared tunnel run ud        # 先手动跑一次
sudo cloudflared service install # 再装成开机自启的服务
```

然后把公网地址告诉桌面版：个人资料页，**系统与语言 → 公网访问地址**(英文界面为 Public access address),填 `https://ud.example.com`,保存。后端会重启，之后用这个地址生成文件下载链接，远端设备也能打开附件。不填的话，远端拿到的附件链接是 `localhost`。trycloudflare 地址拿来演示可以，但不适合填在这里：它每次运行都会变，旧的文件链接会失效。

最后一件事：在电源设置里关掉电脑的自动睡眠。它现在是服务器了。

## 第四步：连上手机

iOS 版在 [TestFlight](https://testflight.apple.com/join/st2TnaBF) 公开测试中。Android 版在[下载页](https://udctl.com/download/)装 APK。

在 iOS 登录页找到 **Backend** 一栏，点 **Change**。填你的公网地址，末尾加上 `/api/v1`:

```
https://ud.example.com/api/v1
```

应用不会帮你补 `/api/v1`。输入时下方的状态行会检查这个地址;显示 `connected · Pro`,就说明手机已经连到了你桌上那台服务器。保存，然后用管理员邮箱(或管理员给你开的账号)登录。Personal 档的话，改用桌面版个人资料页上的用户名和密码。

现在手机上看到的任务、笔记和账本和桌面版是同一份。在手机上改一个任务，桌面版上也就改了。

![iOS 应用显示 Shipping v1.4 任务列表，状态行为 "connected · Pro · synced":和桌面看板是同一批任务，来自你电脑上的服务器](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/run-your-teams-server-from-your-desktop/05-phone-synced.jpg)

## 不在桌面上跑?

桌面版只是运行服务器的一种方式。另外两种都写在[自部署指南](https://udctl.com/docs/self-deployment/)里:

- **Docker**:前后端合在一个容器里的 all-in-one 镜像，提供 linux/amd64 和 linux/arm64。
- **裸二进制**:`ud-server`,发布在 npm 上，网页界面编译进了二进制，支持 macOS、Linux 和 Windows。需要 Node.js 18+,不需要 Docker。

## 花多少钱

服务器就是你的桌面电脑,Cloudflare 的快速隧道和命名隧道都免费，所以这套搭法本身不花钱，也不要求你学 Docker。唯一可选的开销是买一个域名做固定地址。udctl 个人使用免费，不需要 license key;3 人以内的团队也免费。

- 桌面版下载:[udctl.com/download](https://udctl.com/download/)
- 定价:[udctl.com/docs/pricing](https://udctl.com/docs/pricing/)
- license 激活说明:[udctl.com/docs/subscription-tiers](https://udctl.com/docs/subscription-tiers)
