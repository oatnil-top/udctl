---
title: "没有服务器,手机也能随时访问自己的数据"
description: "0 元实现数据完全自持:UnDercontrol 桌面版内嵌后端 + 免费 Cloudflare Tunnel,iOS app 随时随地连接你自己的 endpoint。"
authors: [lintao]
tags: [tutorial, self-hosting]
date: 2026-07-26
image: https://dl.udctl.com/features/blog/your-desktop-is-the-server/concept-tunnel.png
---

数据放在谁那里,是选工具时绕不过的一道分岔口。托管服务(SaaS)省事:注册就用,升级、备份、运维都不用操心,代价是数据存在服务商的服务器上。UnDercontrol 也会提供这样的托管服务。但如果你想要的是**数据完全自持**——任务、笔记、账本的原始数据只存在自己的设备上,备份是拷一个文件,迁移是换一台电脑,谁也拿不走——这篇教程就是为你写的。

自持通常意味着自己架服务器,而这正是大多数人放弃的地方。下面走通一条不需要服务器的 0 元路径:UnDercontrol 桌面版自带完整后端,数据以 SQLite 文件落在你自己的磁盘;Cloudflare Tunnel 免费把这台电脑暴露到公网;iOS app 直连你自己的 endpoint。人在地铁上照样看任务、补笔记、记账,而数据的存放位置从头到尾只有一个:你的电脑。不需要公网 IP,不需要路由器端口转发,也不需要买域名(想要固定地址时才可选)。

![架构:桌面版内嵌 server,cloudflared 反向连接到 Cloudflare 边缘,iOS 从任意网络经 HTTPS 访问](https://dl.udctl.com/features/blog/your-desktop-is-the-server/concept-tunnel.png)

<!-- truncate -->

## 第一步:安装桌面版,确认内嵌 server

从[下载页](https://oatnil.com/download)安装 UnDercontrol 桌面版(macOS / Windows / Linux)。桌面版不是一个网页壳:它内嵌了完整的 Go 后端,启动 app 的同时,一个本地 server 已经在 8888 端口跑起来了(端口被占用时会自动顺延到下一个空闲端口),数据以 SQLite 文件的形式落在你自己的磁盘上。

首次打开你会看到「Welcome to UnDercontrol」和一个 Start 按钮——点一下就进入了。桌面版会自动创建一个本地账号 `personal@undercontrol.local`(默认密码 `personal123`),不需要注册,也没有邀请码。记住这组账号,第四步手机登录要用;默认密码在暴露公网前必须改掉,「安全提醒」一节有具体做法。

验证一下 server 活着:

```bash
curl http://localhost:8888/health
# {"service":"ud-go-production","status":"healthy"}
```

看到 `healthy`,你的「服务器」已经就绪——它就是你正在用的这台电脑。

## 第二步:一条命令,把它暴露到公网

Cloudflare Tunnel 的原理是反向连接:你电脑上的 `cloudflared` 主动连到 Cloudflare 边缘节点,外部流量经 Cloudflare 转发进来。因为连接是从内向外发起的,所以不需要公网 IP,也不用碰路由器设置。

安装 cloudflared:

```bash
# macOS
brew install cloudflared

# Windows
winget install Cloudflare.cloudflared

# Linux (Debian/Ubuntu):先按 https://pkg.cloudflare.com 添加软件源
sudo apt install cloudflared
```

然后一条命令:

```bash
cloudflared tunnel --url http://localhost:8888
```

![终端里的真实输出:quick tunnel 创建成功,curl 公网地址返回 healthy](https://dl.udctl.com/features/blog/your-desktop-is-the-server/shot-terminal-quick-tunnel.png)

几秒后终端会打印一个 `https://xxx.trycloudflare.com` 的随机地址——这就是你的公网 endpoint,自带 HTTPS,连 Cloudflare 账号都不用注册。拿手机验证一下(关掉 Wi-Fi 用流量,确认走的是公网):浏览器访问 `https://xxx.trycloudflare.com/health`,看到 `healthy` 说明整条链路通了。

快速隧道适合先把流程跑通:地址每次重启 `cloudflared` 都会变,Cloudflare 也不对它做可用性承诺。日常使用建议花五分钟升级成命名隧道。

## 第三步(推荐):命名隧道,把地址固定下来

命名隧道需要一个免费的 Cloudflare 账号和一个托管在 Cloudflare 的域名(几十块一年,这是整条链路里唯一可能花钱的地方)。

```bash
# 1. 登录,浏览器里授权你的域名
cloudflared tunnel login

# 2. 创建隧道
cloudflared tunnel create ud

# 3. 把子域名指到隧道
cloudflared tunnel route dns ud ud.example.com
```

写一个配置文件 `~/.cloudflared/config.yml`:

```yaml
tunnel: ud
credentials-file: /Users/you/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: ud.example.com
    service: http://localhost:8888
  - service: http_status:404
```

跑起来,确认没问题后注册成开机自启的系统服务:

```bash
cloudflared tunnel run ud        # 先手动跑通
sudo cloudflared service install # 再装成服务,开机自启
```

从此 `https://ud.example.com` 就是你的固定 endpoint。记得在系统电源设置里别让电脑自动休眠——它现在是你的服务器了。

## 第四步:iOS 连上自己的 endpoint

iOS app 目前通过 [TestFlight 公测](https://testflight.apple.com/join/st2TnaBF)安装(需要先装 App Store 里的 TestFlight)。

打开 app,登录页底部有一个 **API server** 区域,显示当前连接的服务器。点右侧的 **Change**,输入你的公网地址,**注意要带 `/api/v1` 后缀**:

```
https://xxx.trycloudflare.com/api/v1
```

输入时下面的状态点会实时探测:变绿并显示 `connected · Personal`,说明手机已经摸到了你电脑上的 server。点 **Save**,然后用第一步的账号登录:`personal@undercontrol.local` / 你的密码。

![iOS 登录页:API server 指向 trycloudflare 地址,状态 connected · Personal](https://dl.udctl.com/features/blog/your-desktop-is-the-server/shot-ios-connected.png)

登录后手机上看到的就是你电脑里的那份数据:任务、笔记、账本,手机上改一条,桌面端就是最新的。

一个细节:iOS 要求公网域名走 HTTPS(Cloudflare Tunnel 自带,不用操心);如果你填的是局域网或内网组网的 IP 地址,记得显式写 `http://`——不写协议时 app 默认按 `https://` 处理。

## 安全提醒

公网暴露意味着任何拿到 URL 的人都能访问你的 endpoint。三件事,按重要程度排:

**1. 先改默认密码。** 所有数据接口都要求登录,而桌面版默认账号密码 `personal123` 是公开已知的——不改就暴露公网,等于把门钥匙贴在门上。桌面版的密码由 `PERSONAL_TIER_PASSWORD` 环境变量控制,macOS 上从终端带着它启动:

```bash
PERSONAL_TIER_PASSWORD='你的强密码' /Applications/UnderControl.app/Contents/MacOS/UnderControl
```

Windows 在「系统环境变量」里添加 `PERSONAL_TIER_PASSWORD` 后重启 app。之后手机、CLI 都用新密码登录。

**2. 随机 URL 不是安全机制。** trycloudflare 的随机地址不容易被猜到,但不要把它当作保护;分享链接前想清楚。

**3. 想再加一层门禁**,Cloudflare 免费套餐里的 [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) 可以给命名隧道套一个邮箱验证码验证,配置一次,所有设备生效。

## 不想暴露公网?

如果你只想「自己的设备互相可达」,可以完全不碰公网:用内网组网工具把手机和电脑拉进同一个虚拟局域网——各设备装上客户端就互相可见,电脑会得到一个虚拟局域网 IP,iOS app 里把 endpoint 填成 `http://<虚拟局域网IP>:8888/api/v1` 就行(记得显式写 `http://`)。零公网暴露,这类工具的免费额度对个人使用通常足够。具体的组网配置这里不展开,各家官方文档都有手机 + 电脑的接入指引。

## 跑通之后

盘一下成本:VPS 0 元,隧道 0 元,HTTPS 证书 0 元;唯一可选的开销是一个几十块一年的域名。

- 桌面版下载:https://oatnil.com/download
- iOS TestFlight:https://testflight.apple.com/join/st2TnaBF
