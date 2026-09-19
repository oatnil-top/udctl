---
title: "udctl 下载渠道:桌面版、CLI、扩展与 Docker 镜像"
description: udctl 全部获取方式:桌面版、npm 安装的 ud CLI、Chrome 扩展、iOS 与 Android、Docker 私有部署镜像。
---

# 下载

获取 udctl 的全部渠道。给人看的请去[下载页](/zh-Hans/download);本页把同样的事实写成机器可读的形式。

## 网页版

- 地址:https://ud.oatnil.com
- 无需安装。不注册账号也能以访客身份试用。

## 桌面版(macOS / Windows / Linux)

桌面安装包托管在 Cloudflare R2:

```
https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/releases/{VERSION}/{FILENAME}
```

各平台文件名:

| 平台 | 文件名 |
| --- | --- |
| macOS(Apple Silicon) | `undercontrol-desktop-{VERSION}-arm64.dmg` |
| macOS(Intel) | `undercontrol-desktop-{VERSION}-x64.dmg` |
| Windows(x64) | `undercontrol-desktop-{VERSION}-setup.exe` |
| Linux(x64) | `undercontrol-desktop-{VERSION}.AppImage` |

当前的 `{VERSION}` 从自动更新元数据里取(纯 YAML,第一行就是 `version:`):

```
https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/releases/latest/latest-mac.yml
https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/releases/latest/latest.yml        # Windows
https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/releases/latest/latest-linux.yml
```

R2 上只保留最近几个版本,所以要先解析出当前版本号,不要把版本号写死。

平台说明:

- **Windows**:安装包未签名,首次运行会提示「未知发布者」。点 **更多信息 → 仍要运行** 继续。
- **Linux**:先给 AppImage 加执行权限:`chmod +x undercontrol-desktop-{VERSION}.AppImage`。

## CLI(`ud`)

推荐用 npm 安装:

```bash
npm install -g @oatnil/ud   # 需要 Node.js 18+
ud --version
```

Homebrew 也可以(macOS 与 Linux):

```bash
brew tap oatnil-top/ud
brew trust oatnil-top/ud   # 仅 Homebrew 6 及以上需要
brew install ud
```

文档:[CLI 命令参考](/zh-Hans/docs/cli) · [AI agent CLI](/zh-Hans/docs/cli-ai-integration)

## 浏览器扩展

- Chrome 网上应用店的 [udctl Web Clipper](https://chromewebstore.google.com/detail/undercontrol-web-clipper/mckkbigikfkoeddpcbhdmpncoljoagog):把网页存成带完整页面快照的任务,并能提取视频字幕。说明见[网页剪藏扩展](/zh-Hans/docs/web-clipper)。

## 移动端(iOS 与 Android)

iOS 原生应用在公测,通过 TestFlight 链接加入:
https://testflight.apple.com/join/st2TnaBF(需要先从 App Store 装 TestFlight)。

Android 直接下载 APK 安装,不在 Google Play 上架:
https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/releases/android/0.0.20/undercontrol-0.0.20.apk
因为文件不来自 Play 商店,首次安装会问来源,点 **设置 → 允许来自此来源** 即可继续。APK 用的是移动端自己的版本号,与上面的桌面版版本号无关。

另外还有:一键采集用的 [Apple 快捷指令](https://www.icloud.com/shortcuts/4e0becebe3cd48a180940ccbd04d6fa7),以及在手机浏览器里打开网页版。

## 私有部署

两条路,配置面相同:

- **Docker(all-in-one)**:镜像 `lintao0o0/undercontrol:latest`(linux/amd64 与 linux/arm64),网页应用与后端打在一个容器里。
- **裸机(npm)**:`npm install -g @oatnil/ud-server`,单二进制内嵌网页界面(Node.js 18+;macOS / Linux / Windows)。启动:`ud-server -host-domain http://localhost:8080 -data-path ./data`。

`docker run` / compose / Kubernetes / 裸机的具体步骤见[私有部署指南](/zh-Hans/docs/self-deployment),全部环境变量见[配置参考](/zh-Hans/configuration)。
