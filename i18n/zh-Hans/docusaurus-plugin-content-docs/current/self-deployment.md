---
sidebar_position: 2
---

# 自部署指南

用一条 Docker 命令即可自部署 udctl。**all-in-one 镜像**把前端和后端打包在同一个容器里，
无需自己拼装——运行即可打开浏览器使用。

镜像同时发布 **linux/amd64** 和 **linux/arm64**（Apple 芯片、ARM 服务器），同一条命令在任何机器上都能用。

## 快速开始（免费 / Personal）

无需许可证。单用户，SQLite，本地文件存储。

```bash
docker run -d --name undercontrol \
  -p 3000:8080 \
  -e HOST_DOMAIN=http://localhost:3000 \
  -e JWT_SECRET=change-me-to-a-random-string \
  -v undercontrol-data:/app/data \
  lintao0o0/undercontrol:latest
```

然后打开 `http://localhost:3000`，点击 **Start** 即可使用。前端和后端在同一容器中，
自动通过 `/api/v1` 连接——无需配置服务器地址。

### 首次启动 banner

容器日志会让成功和失败一目了然。启动成功时，`docker logs undercontrol` 的末尾会打印一个
ready banner，直接告诉你去哪打开、用什么账号登录：

```text
==============================================================================

  udctl v1.x.x is ready

  --> Open http://localhost:3000 to get started

      Login as:  personal@undercontrol.local
                 default password: personal123 (set PERSONAL_TIER_PASSWORD to change it)
      Tier:      Personal (max users: 1)
      Database:  SQLITE
      Storage:   LocalFS
      Scheduler: enabled (default), 0 scheduled job(s)

==============================================================================
```

`Scheduler` 这一行说明定时任务是否在运行、是哪个输入决定的（`default`、`env CRON_ENABLED`
或 `flag --cron-enabled`），以及库里有多少条已启用的定时任务。全新安装显示 `0`。如果你刚建好的实例
显示非零，说明这个数据库来自别处——见[用拷贝来的数据库启动服务](#用拷贝来的数据库启动服务)。

如果配置有误，容器会立即退出，同一份日志里会出现 `STARTUP FAILED` 块，明确指出要修什么——
缺 `HOST_DOMAIN`、Pro/Max 下缺 `ADMIN_EMAIL`、端口被占用，或某个配置项的值读不懂。密码提示只在账号仍使用出厂默认密码时才会出现。

## 首次启动之前先设置 JWT_SECRET {#jwt-secret}

`JWT_SECRET` 是服务端签发每一个登录 token 所用的密钥。请在实例**第一次启动之前**把它设成一串足够长的
随机值，并在这个实例的整个生命周期里保持不变。

```bash
openssl rand -base64 48   # 生成一个值，然后作为 JWT_SECRET 传入
```

传入方式和其他配置项一样：`docker run -e JWT_SECRET=...`、docker-compose 的 `environment:` 列表、
`.env` 文件，或 npm 包的 `-jwt-secret` 参数。Homebrew 安装会自动生成一个。

**为什么必须设置。** 不设 `JWT_SECRET` 时服务端照样能启动，但会用编译进二进制里的一个固定默认值签发
token，这个值是公开的。任何能访问到实例的人都可以用它伪造出合法 token，以任意用户身份登录。本页示例里的
占位值 `change-me-to-a-random-string` 同样是公开的，请务必替换。

**为什么之后不能再改。** 同一把密钥还用来加密服务端存进数据库的设置：每个存储类的配置（包括首次启动时
自动创建的本地存储类）、AI provider 的 API key，以及管理设置里保存的密钥类配置。实例已经有数据之后再改
`JWT_SECRET`，这些值就解不开了：上传和下载文件都会报内部错误，服务端日志里出现 `failed to decrypt config`。
把它改回原来的值即可恢复。一直跑在默认值上、后来才补设新值的实例，同样属于「改了」。另外所有人都会被登出，
因为用旧值签发的 token 不再有效。

## 裸机部署（npm，无需 Docker）

服务端也以 npm 包发布，Web UI 直接编译进二进制——除了 Node.js 18+ 什么都不用装。
支持 macOS（Intel 和 Apple Silicon）、Linux（x64 和 ARM64）、Windows（x64）。

```bash
npm install -g @oatnil/ud-server @oatnil/ud   # 服务端 + CLI

openssl rand -base64 48 > ./jwt-secret   # 只生成一次，保存好，不要重新生成
ud-server -host-domain http://localhost:8080 -data-path ./data \
  -jwt-secret "$(cat ./jwt-secret)"
```

然后打开 `http://localhost:8080`——终端里会打印与 Docker 相同的 ready banner，
包含登录凭据。所有数据都在 `./data` 下（SQLite 数据库和上传文件），备份或迁移
实例就是复制这个目录，并沿用同一个 `JWT_SECRET`。

- 配置与 Docker 完全一致：[配置参考](/configuration) 里的每个环境变量都同时是
  CLI 参数（`ud-server -help` 可查看全部）。每次启动都要给 `HOST_DOMAIN`
  和同一个 `JWT_SECRET`（见[首次启动之前先设置 JWT_SECRET](#jwt-secret)）。
- 许可证同理：启动前 export `LICENSE_TOKEN` / `LICENSE_HOST_SECRET` 即可解锁 Pro 功能。
- 升级：`npm update -g @oatnil/ud-server`；卸载：`npm uninstall -g @oatnil/ud-server`
  （`./data` 目录不受影响）。
- 想以服务方式常驻,用 systemd / launchd 包一层即可,和任何单二进制程序一样;或者用下面的 Homebrew 安装，它会替你配好。

## Homebrew（macOS / Linux，以服务方式常驻）

同一个服务端二进制也在 Homebrew tap 里，带 `brew services` 定义，可以后台常驻、登录后自动启动：

```bash
brew tap oatnil-top/ud
brew trust oatnil-top/ud          # 仅 Homebrew >= 6 需要
brew install ud-server
brew services start ud-server
```

然后打开 `http://localhost:8080`。文件位置如下（`$(brew --prefix)` 在 Apple Silicon 上是
`/opt/homebrew`，Intel 上是 `/usr/local`，Linux 上是 `/home/linuxbrew/.linuxbrew`）：

| 内容 | 路径 |
|---|---|
| 配置 | `$(brew --prefix)/etc/ud-server/.env` |
| 数据（SQLite 数据库、上传文件） | `$(brew --prefix)/var/ud-server` |
| 日志 | `$(brew --prefix)/var/log/ud-server.log` |

- `.env` 里默认写了 `PORT=8080`、`HOST_DOMAIN=http://localhost:8080`、数据目录和本次安装生成的 `JWT_SECRET`;
  [配置参考](/configuration) 里的任何变量都可以加进去，改完执行 `brew services restart ud-server` 生效。
- 服务端监听所有网卡，同一网络里的其他机器能访问 8080 端口。要给它们用，把 `HOST_DOMAIN` 改成它们访问的地址。
- `brew upgrade ud-server` 只替换二进制，配置和数据目录保持不动；升级后执行 `brew services restart ud-server`。
- 停止：`brew services stop ud-server`。`brew uninstall ud-server` 不会删除配置和数据，
  要彻底清除请自行删除上面两个目录。
- `brew services start` 以当前用户身份运行，登录后自动启动；要开机即启动（无需登录）请用
  `sudo brew services start ud-server`。

## Pro / Max（多用户）

加上许可证和管理员账号即可启用多用户、PostgreSQL、S3 存储和管理后台。许可证请联系 udctl 团队获取。

```bash
docker run -d --name undercontrol \
  -p 3000:8080 \
  -e HOST_DOMAIN=http://localhost:3000 \
  -e JWT_SECRET=change-me-to-a-random-string \
  -e ADMIN_EMAIL=admin@example.com \
  -e ADMIN_PASSWORD=your-secure-password \
  -e LICENSE_TOKEN=your-license-token \
  -e LICENSE_HOST_SECRET=your-license-host-secret \
  -v undercontrol-data:/app/data \
  lintao0o0/undercontrol:latest
```

用你设置的 `ADMIN_EMAIL` / `ADMIN_PASSWORD` 登录。

:::info 实例默认是私有的
新起的实例不接受注册。你自己的管理员账号是启动时用 `ADMIN_EMAIL` 创建的，所以你可以直接登录；
但其他人建不了账号——注册表单、GitHub/Google 首次登录、访客按钮这三条路都不行。想让别人也用你这个
实例，设置 `REGISTRATION_ENABLED=true` 后重启。启动 banner 会打印当前状态（`Signup: closed (default)`）。
:::

:::warning Pro/Max 必须设置 ADMIN_EMAIL
Pro/Max tier 启动时会用 `ADMIN_EMAIL` 创建初始管理员账号。如果缺失，服务会**直接拒绝启动**并给出明确报错——
启动前请先设置它（以及 `ADMIN_PASSWORD`）。
:::

## docker-compose

如需持久化数据和更方便的配置，推荐使用 docker-compose：

```yaml
services:
  undercontrol:
    image: lintao0o0/undercontrol:latest
    ports:
      - "3000:8080"
    volumes:
      - ./data:/app/data
    environment:
      - HOST_DOMAIN=http://localhost:3000
      - JWT_SECRET=change-me-to-a-random-string
      # 允许别人在这个实例上自行注册账号（默认关闭）：
      # - REGISTRATION_ENABLED=true
      # 任何人连接 IM 之前必须设置。取一个随机值，设定后不要更换——见下方变量说明：
      # - UD_ENCRYPTION_KEY=change-me-to-a-random-string
      # 仅 Pro/Max：
      # - ADMIN_EMAIL=admin@example.com
      # - ADMIN_PASSWORD=your-secure-password
      # - LICENSE_TOKEN=your-license-token
      # - LICENSE_HOST_SECRET=your-license-host-secret
```

```bash
docker compose up -d
```

## 环境变量

下表覆盖大多数部署会用到的变量。服务端读取的全部配置项（含交互式配置生成器和启动预览）
见[配置参考](/configuration)。

| 变量 | 是否必填 | 默认值 | 说明 |
|------|----------|--------|------|
| `HOST_DOMAIN` | **是** | — | 客户端访问本实例的公开 URL，用于生成文件下载/上传链接，必须可达（如 `http://localhost:3000` 或 `https://ud.example.com`）。 |
| `JWT_SECRET` | **是** | 内置公开值 | 用于签发认证 token、并加密存进数据库的设置（存储类配置、AI provider key）的随机密钥。首次启动之前设好，实例有数据之后不要再改，见[首次启动之前先设置 JWT_SECRET](#jwt-secret)。 |
| `ADMIN_EMAIL` | Pro/Max | — | 初始管理员的登录用户名。Pro/Max tier 必填。 |
| `ADMIN_PASSWORD` | Pro/Max | `admin123` | 初始管理员密码，请务必修改。 |
| `LICENSE_TOKEN` | Pro/Max | — | 解锁 Pro/Max 功能的许可证 token。 |
| `LICENSE_HOST_SECRET` | Pro/Max | — | 与许可证 token 配套的 host secret。 |
| `PERSONAL_TIER_PASSWORD` | 否 | `personal123` | Personal tier 唯一用户（`personal@undercontrol.local`）的密码。请在**首次启动前**设置：**Start** 自动登录始终读取该变量，用户创建后只改环境变量、或只在应用内改密码，都会导致自动登录失效（两者必须一致；登录名本身不可修改）。 |
| `PORT` | 否 | `8080` | 服务在容器内监听的端口。 |
| `REGISTRATION_ENABLED` | 否 | `false` | 允许别人在这个实例上自行注册账号。**默认关闭**——你的管理员账号在启动时由 `ADMIN_EMAIL` 创建，不依赖这个开关，但注册会一律被拒绝，直到你显式打开它。三条建号路径都受它管：注册表单、GitHub/Google 首次登录、访客按钮。仅在启动时生效。 |
| `UD_ENCRYPTION_KEY` | IM 必需 | — | 用于加密用户密钥（目前是各自的 Telegram bot token）。**任何人连接 IM 之前必须设置**：未设置时「即时通讯」区会拒绝保存 token 并给出说明。视为每个实例永久不变——更换会使已保存的 token 全部失效，用户需要重新粘贴。`JWT_SECRET` 同样不能改，原因相近（它加密存储类和 AI provider 设置）。 |
| `IM_MAX_BYO_BOTS` | 否 | `20` | 本实例最多同时运行多少个用户自带 bot（每个 bot 占用一条长轮询连接）。 |
| `AI_DAILY_FREE_QUOTA` | 否 | `10` | 每个用户每天（UTC 零点重置）在服务器共享 AI provider 上的免费次数；用户用**自己的** API key 跑的任何操作都不计数。**`0` 表示零额度——共享 provider 上的 AI 操作一律被拒；`-1` 表示不限。**这两个值容易被反着猜，请刻意设置。到额之后：聊天请求会返回额度错误；速记会在铃铛「For You」里出现一条说明被拒原因的通知，并在 Queue Tasks 页面留下一条 **Failed** 记录。 |
| `CRON_ENABLED` | 否 | `true` | 运行定时任务（清理、备份、计划任务处理、唤醒 agent）。如果这台服务器的数据库来自别处，启动前请设为 `false`——见下。仅在启动时生效。 |

开关类变量接受 `true/false`、`1/0`、`yes/no`、`on/off`、`enabled/disabled`，不区分大小写。
**读不懂的值不会被悄悄换成默认值**：服务会拒绝启动，并告诉你是哪个变量、收到了什么、可接受哪些写法。

### 用拷贝来的数据库启动服务

定时任务存在数据库里，不在配置里。因此一份从备份恢复、或从别的机器拷来的数据库，会带着原实例
全部仍处于启用状态的定时任务过来，而新服务会开始执行它们：发消息、唤醒 agent、写外部服务——
一切都像它就是当初创建这些任务的那个实例。

这种情况下请关掉调度器再启动：

```bash
docker run -e CRON_ENABLED=false ...   # 或：./server --cron-enabled=false
```

然后看启动 banner 里的 `Scheduler` 一行，确认它显示 `disabled`，再去信任这个实例。逐个决定哪些任务
该重新启用，之后再正常重启。同理建议一并加上 `VISITOR_CLEANUP_ENABLED=false`：访客清理会按时删除
访客账号及其数据。

### 可选：PostgreSQL、S3 与 AI

all-in-one 镜像默认使用 SQLite + 本地文件存储，对大多数自部署实例已经足够。Pro/Max 下可通过额外环境变量接入外部服务：

- **PostgreSQL** — 设置 `DATABASE_URL`（或单独的 `DB_*` 变量）以替代内置 SQLite。
- **S3 / R2 存储** — 设置 `S3_*` 变量，把上传文件存到 S3 兼容对象存储（AWS S3、Cloudflare R2、MinIO），替代本地卷。
- **AI 服务** — 设置 OpenAI 兼容的 `AI_*` 变量以启用 AI 功能。

### 可选：Alfred 的 Telegram 通道

Alfred 是内置的管家 Agent。用户在网页端任意评论里 @alfred 即可与他对话，这在任何实例上都开箱可用、
无需任何配置。IM 通道则把 Alfred 带到手机上：每位用户连接**自己的 Telegram bot**，随时随地找他。

不再有全实例共用的 bot token。每位用户自己建 bot、自己持有凭据，聊天只会到达这个 bot——在多人实例上，
这是唯一站得住脚的做法。

**运维方只需做一次：**

- 把 `UD_ENCRYPTION_KEY` 设为一串随机密钥（`openssl rand -hex 32`）。bot token 以 AES-256-GCM 加密存储，没有密钥就无法保存；**设好之后，在这个实例的整个生命周期里都不要再改动它。** 轮换这把密钥会让已经存下的 token 全部失效：密文还在，但没有任何东西能读懂它，每位用户都得重新粘贴自己的 token。
  缺失时「即时通讯」区会提示用户联系管理员。之后更换会使已存 token 全部失效，所以请在用户开始使用前定下来。
- 可选：调整 `IM_MAX_BYO_BOTS`（默认 20），即本实例同时运行的用户 bot 数量上限。
  该值也可在**管理后台 → 系统配置 → Integration** 中随时修改。
- 多人实例上，决定何时把 IM 通道对你以外的用户开放——见下文《多用户开放》。

**每位用户自己完成：**

1. 在 Telegram 里找 [@BotFather](https://t.me/BotFather)，发送 `/newbot`，拿到 token。bot 的名字和头像归自己。
2. 在 **设置 → 即时通讯** 粘贴 token。服务器会先向 Telegram 验证再保存，因此 token 输错会当场报错，
   而不是留下一个永远不回话的 bot。保存后不可回读——界面只显示 bot 用户名和掩码。
3. 向自己的 bot 发送 `/start`。Telegram 要求先 /start，bot 才能给你发消息。
4. 在同一区域生成一次性绑定码，10 分钟内向自己的 bot 发送 `/link 绑定码`。

每个 bot 都是**私人入口**：不是它主人的人向它发消息会被礼貌拒答，绑定码也只能在其主人自己的 bot 上核销。
更换 token 会重连；移除会停止轮询并删除凭据，而账号绑定与对话归档都保留。

若 token 之后被 Telegram 拒绝（例如在 @BotFather 里重置过），用户会在自己的「即时通讯」区看到
**token 被拒绝**以及 Telegram 给出的原因，粘贴新 token 即可恢复。管理员不再有修复入口，
也不会退回到别人的 bot 代发。

`DISCORD_BOT_TOKEN` / `--discord-bot-token` 配置层面仍可读取，但 Discord provider 尚未实现——
只设置它不会启动任何东西。

### 多用户开放

IM 通道默认只对实例所有者开放：`im.multi_user_enabled` 默认为 `false`，关闭期间其他用户在「即时通讯」区
只会看到「多用户暂未开放」。网页端 @alfred 不受影响。

确认边界之后，在**管理后台 → 系统配置**中打开它——每条消息都会在某台机器上运行 Agent 会话，
这个开关决定的正是：第二个用户的消息可以到达谁的机器。

### 从旧版共享 bot 升级

早期版本用一个全实例的 `TELEGRAM_BOT_TOKEN`。该配置项已移除，**升级需要两步手动操作**。
升级前请先读完本节。

自动迁移只认存为运行时设置项 `integration.telegram.bot_token` 的 token。该设置项只在开发过程中
短暂存在过，**没有随任何一个版本发布**，所以在所有真实实例上，token 都在 `TELEGRAM_BOT_TOKEN`
环境变量（或对应的启动参数）里——而迁移不读这个。也就是说：**不会有任何东西被自动迁移，
而且失败是静默的。** 容器照样健康启动，日志照样显示通道已启动。

请按下面的顺序升级：

1. **先把现有的 `TELEGRAM_BOT_TOKEN` 的值抄到安全的地方**，再动其他任何配置。
   升级后它就失效了，而这是你手上唯一的一份。
2. **设置 `UD_ENCRYPTION_KEY`**，取一个随机值（`openssl rand -hex 32`）。
   没有它，服务端会拒绝存储任何 bot token。请视为永久不变——参见上文该变量的说明。
3. 照常升级镜像并启动实例。
4. **手动重新登记 token。** 所有者打开 **设置 → 即时通讯**，粘贴第 1 步抄下来的 token。
   服务端会先向 Telegram 校验再存储，所以粘错会当场报错，而不是变成一个永远不回话的 bot。
5. **再重启一次实例。** 这一步很容易漏掉，但很关键：旧的共享 bot 创建的会话和投递记录还没有
   归属到任何一个用户的 bot 上，而新的运行时只能看到已归属的记录。这次重启做的正是这件事，
   并且它只有在已经存在一个 bot 时才有效——所以必须排在第 4 步之后。

在第 5 步完成之前，通道看上去是正常的，但**发往已有会话的回复会被静默丢弃**。界面上不会有任何
报错，唯一的迹象是日志里的一行 `IM relay has no live bot for a conversation, dropping message`，
其中 `botState="unmigrated"`。升级后新建的会话不受影响，这会让问题看起来时好时坏。

验证方式是真发一条消息、确认收到回复——容器健康、日志干净、通道已启动，这三条都不能证明消息发得出去。

确认即时通讯可用之后，就可以把 `TELEGRAM_BOT_TOKEN` 从配置里删掉了。在那之前留着它没有任何代价，
而且可以让你原地回滚到上一个版本。

其他用户不迁移，因为他们本就没有属于自己的东西可迁——他们用的是运维方的 bot。每个人连接自己的即可。

## 首次启动引导

用户首次打开一个全新实例时，会看到一个五步引导。每一步都可跳过；已经配置好的内容会直接显示为完成状态，
而不会再次询问。这里没有任何一项是服务运行的前提——一个什么都没配的实例同样能顺利走完引导。

1. **语言** —— 界面使用英文还是中文。
2. **工作区状态 hooks** —— 询问是否允许向工作区项目的 `.claude/settings.local.json` 添加 Claude Code
   hooks，桌面端正是靠它展示实时的 Agent 状态（运行中 / 等待中 / 空闲）。未获许可不会写入任何内容。
3. **把本机注册为 daemon** —— daemon 是实际运行 Agent 会话的机器。在 udctl 桌面应用里这是一键完成的，
   同时会扫描本机已安装的 Agent CLI（Claude Code、Codex 等）。在浏览器里，该步骤会推荐安装桌面应用，
   或给出适用于服务器/远程机器的无界面方案：`npm install -g @oatnil/ud`、`ud login`、`ud daemon start`。
   两种方式都一样：只要服务端看到有 daemon 在线，该步骤即完成。
4. **连接 Telegram** —— 用户用 @BotFather 建好自己的 bot 并粘贴 token，与「设置 → 即时通讯」里是同一套流程。
   与其他步骤一样可跳过；第一条指引会指回第 3 步，因为没有机器在背后的 bot 什么也答不了。
   未设置 `UD_ENCRYPTION_KEY` 的实例上，该步骤会说明暂时无法保存 token，并提示联系管理员。
5. **认识 Alfred** —— 介绍这位内置管家（把活派给合适的 Agent、记住你的偏好与决策、随手记下临时想法），
   并告诉用户在网页评论里 @alfred 就能找他。

**运维方需要做什么：** 如果希望第 4 步可用，请在用户走引导之前设置 `UD_ENCRYPTION_KEY`。
引导中其余步骤都不依赖服务端配置；跳过第 4 步的用户之后随时可以在「设置 → 即时通讯」连接自己的 bot。

## 前后端分离镜像（进阶）

如果需要前端和后端独立扩缩容，或分别放在不同代理后面，它们也各自发布为多架构镜像：

- 后端 — `lintao0o0/undercontrol-backend:latest`
- 前端 — `lintao0o0/undercontrol-vite-app:latest`

后端使用与上面相同的环境变量；前端通过 nginx 提供静态资源并把 `/api` 反代到后端。

**运行多个后端副本。** 正确性不再依赖单副本：每位用户同时只有一个 Alfred 会话，这一约束已由数据库索引保证——
抢输的副本插入失败，并把消息交给赢的那个会话。不过 IM 通道仍然更适合单副本：每个副本都会为每个用户 bot
各开一条长轮询，而 Telegram 只允许一个消费者，多副本同时轮询会互相抢消息。有用户连接 IM 时请只跑一个后端副本；
前端无论如何都可以自由扩缩。

## 数据与备份

所有状态都在 `/app/data`（上面挂载的卷）下：SQLite 数据库，以及默认情况下的上传文件。备份该卷即可备份整个实例。
如果使用外部 PostgreSQL 和 S3，则改为备份它们。

`JWT_SECRET` 要和备份一起保管，但不要放进备份里：恢复出来的实例需要同一个值，才能读出存储和 AI provider 设置。

## 故障排查

先看 `docker logs undercontrol`：正常启动的日志以上面的 ready banner 结尾；配置有误则以
`STARTUP FAILED` 块结尾，直接点名要修的变量。

- **容器启动后立即退出** — 读日志里的 `STARTUP FAILED` 块。常见原因：缺 `HOST_DOMAIN`、
  Pro/Max 下缺 `ADMIN_EMAIL`、端口被占用。
- **`no matching manifest for linux/arm64/v8`** — 更新到最新镜像，现已同时发布 amd64 和 arm64。
- **不知道去哪登录** — ready banner 里打印了访问 URL 和当前 tier 的登录账号。
- **上传和下载都报内部错误，日志里是 `failed to decrypt config`** — `JWT_SECRET` 不是这个实例第一次启动时
  用的值（被改过，或者迁移时没带上）。用原来的值重新启动即可。
- **文件链接无法访问** — `HOST_DOMAIN` 必须是客户端实际访问实例的 URL，包含协议和端口。
- 仍无法解决时，携带日志和配置联系支持（去除敏感信息）。
