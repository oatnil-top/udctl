/**
 * Configuration Reference — standalone page at /configuration.
 *
 * Pure TSX by design (user decision 2026-07-24, aligning with /self-hosting):
 * both locales live in this one file as {en, zh} strings picked by the current
 * docusaurus locale — there is NO i18n mirror file for this page. The variable
 * data below is generated from go-backend/internal/config/config.go; when a
 * variable is added, renamed, or its default changes there, update REFERENCE
 * here (and the ConfigBuilder banner strings) in the same task. The short
 * env-var table in docs/self-deployment.md must stay consistent with this page.
 *
 * Owned by the Onboarding Experience Owner.
 */
import {useMemo, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ConfigBuilder from '@site/src/components/ConfigBuilder';
import styles from './configuration.module.css';

type L = {en: string; zh: string};

interface Badge {
  kind: 'req' | 'tier' | 'warn';
  label: L;
}

interface VarRow {
  id: string;
  names: string[]; // first is the primary (click-to-copy) name
  badges?: Badge[];
  desc: L; // `backticks` render as inline code
  metaDefault?: string; // raw text, may contain `code`
  metaFlags: string;
}

interface Category {
  id: string;
  title: L;
  note?: L;
  rows: VarRow[];
}

const REQUIRED: Badge = {kind: 'req', label: {en: 'Required', zh: '必填'}};
const PRO: Badge = {kind: 'tier', label: {en: 'Pro / Max', zh: 'Pro / Max'}};
const PERSONAL: Badge = {kind: 'tier', label: {en: 'Personal', zh: 'Personal'}};

const REFERENCE: Category[] = [
  {
    id: 'core',
    title: {en: 'Core server', zh: '核心服务'},
    rows: [
      {
        id: 'host_domain',
        names: ['HOST_DOMAIN'],
        badges: [REQUIRED],
        desc: {
          en: 'External base URL clients use to reach this instance — scheme + host, no trailing slash (e.g. `https://ud.example.com`, or `http://localhost:3000` when mapping `-p 3000:8080`). Used to build file download/upload links, so it must be the address browsers actually use. Missing or malformed → the server refuses to boot.',
          zh: '客户端访问本实例的外部基础 URL——协议 + 主机，无尾部斜杠（如 `https://ud.example.com`，或映射 `-p 3000:8080` 时的 `http://localhost:3000`）。用于生成文件上传/下载链接，必须是浏览器实际使用的地址。缺失或格式非法 → 服务拒绝启动。',
        },
        metaDefault: '—',
        metaFlags: '--host-domain',
      },
      {
        id: 'port',
        names: ['PORT'],
        desc: {
          en: 'Port the server listens on. In the all-in-one image, this is the port inside the container — map it with `-p <host>:8080`. If the port is already taken, boot fails fast with a clear error.',
          zh: '服务监听端口。在 all-in-one 镜像中这是容器内部端口——用 `-p <host>:8080` 映射。端口被占用时会快速失败并给出明确报错。',
        },
        metaDefault: '`8080`',
        metaFlags: '--port',
      },
      {
        id: 'environment',
        names: ['ENVIRONMENT'],
        desc: {
          en: '`development` or `production`. Production switches the HTTP framework to release mode (less request logging). The all-in-one image ships with `production` preset.',
          zh: '`development` 或 `production`。production 会切换 HTTP 框架到 release 模式（减少请求日志）。all-in-one 镜像预置为 `production`。',
        },
        metaDefault: '`development`',
        metaFlags: '--environment',
      },
      {
        id: 'log_level',
        names: ['LOG_LEVEL'],
        desc: {
          en: 'Log verbosity: `debug`, `info`, `warn`, `error`. Logs are structured JSON; the human-readable boot banner prints regardless of level.',
          zh: '日志级别：`debug`、`info`、`warn`、`error`。日志为结构化 JSON；无论什么级别，人类可读的启动 banner 都会打印。',
        },
        metaDefault: '`info`',
        metaFlags: '--log-level',
      },
      {
        id: 'sql_log_level',
        names: ['SQL_LOG_LEVEL'],
        desc: {
          en: 'SQL statement logging: `silent`, `error`, `warn`, or `info` (logs every query — debugging only).',
          zh: 'SQL 语句日志：`silent`、`error`、`warn` 或 `info`（记录每条查询——仅调试用）。',
        },
        metaDefault: '`silent`',
        metaFlags: '--sql-log-level',
      },
      {
        id: 'ud_data_path',
        names: ['UD_DATA_PATH'],
        desc: {
          en: 'Directory holding all local state: the SQLite database and locally-stored uploads. In Docker this is `/app/data` — mount a volume there; backing up this directory backs up the instance.',
          zh: '存放所有本地状态的目录：SQLite 数据库和本地存储的上传文件。Docker 中为 `/app/data`——在此挂载卷；备份该目录即备份整个实例。',
        },
        metaDefault: '`./data`',
        metaFlags: '--data-path',
      },
    ],
  },
  {
    id: 'auth',
    title: {en: 'Accounts & authentication', zh: '账号与认证'},
    rows: [
      {
        id: 'registration_enabled',
        names: ['REGISTRATION_ENABLED'],
        badges: [{kind: 'warn', label: {en: 'Off by default', zh: '默认关闭'}}],
        desc: {
          en: 'Lets other people create their own accounts on this instance. **Off by default** — an instance is yours until you decide otherwise. Your own admin account is created at startup from `ADMIN_EMAIL` and does not depend on this switch, so leaving it off never locks you out; it only refuses everyone else. Covers all three ways an account can be created: the register form, a first GitHub/Google login, and the visitor button. Turn it on and restart to open sign-ups. The boot banner prints the current state.',
          zh: '允许别人在这个实例上自行注册账号。**默认关闭**——实例在你决定开放之前只属于你。你自己的管理员账号在启动时由 `ADMIN_EMAIL` 创建，不依赖这个开关，所以保持关闭永远不会把你自己锁在外面，只会拒绝其他人。三条建号路径都受它管：注册表单、GitHub/Google 首次登录、访客按钮。要开放注册，打开它并重启。启动 banner 会打印当前状态。',
        },
        metaDefault: '`false`',
        metaFlags: '--registration-enabled',
      },
      {
        id: 'jwt_secret',
        names: ['JWT_SECRET'],
        badges: [{kind: 'warn', label: {en: 'Set it — default is public', zh: '务必设置——默认值公开'}}],
        desc: {
          en: 'Secret used to sign login tokens, and to encrypt settings the server stores in its database (every storage class configuration, including the built-in local one, AI provider API keys, and secret admin settings). The default is a publicly known placeholder — anyone who knows it can forge sessions; the server prints a startup warning while it is in use. Set a long random value (`openssl rand -base64 48`) before the first start and keep it: changing it on an instance that has data, including moving off the default, leaves those stored settings unreadable — uploads and downloads fail and the log says `failed to decrypt config` — until the original value is restored. It also signs everyone out.',
          zh: '用于签发登录 token，并加密服务端存进数据库的设置（每个存储类的配置，包括内置的本地存储类、AI provider 的 API key、管理设置里的密钥类配置）。默认值是公开已知的占位符——知道它的人可以伪造会话；用着默认值时服务端启动会打印警告。请在首次启动之前设一个足够长的随机值（`openssl rand -base64 48`）并一直保持：实例已有数据后再改（包括从默认值改成新值），这些设置就解不开了——上传和下载都会失败，日志里是 `failed to decrypt config`——直到改回原值为止。同时所有人都会被登出。',
        },
        metaDefault: '`your-secret-key`',
        metaFlags: '--jwt-secret',
      },
      {
        id: 'ud_encryption_key',
        names: ['UD_ENCRYPTION_KEY'],
        badges: [
          {kind: 'warn', label: {en: 'Set once — never change', zh: '设定后不要更换'}},
        ],
        desc: {
          en: "Key used to encrypt user-owned secrets at rest — today each user's own messenger bot token. It is a separate key rather than a database setting on purpose: a key kept in the same database as the ciphertext it protects protects nothing. **Set it before anyone connects a messenger**: with no key the messenger paths refuse to store a token (they say so rather than falling back to plaintext), so Alfred and the IM integration cannot be used. Generate a random value — `openssl rand -hex 32` — and treat it as permanent for the life of the instance. Changing it strands every token already stored, and each user has to paste theirs in again. (`JWT_SECRET` must not change either; see its entry.)",
          zh: '用于加密用户自己的密钥（目前是每位用户的 IM bot token）的密钥。它独立于数据库设置是有意的：把密钥和它保护的密文放在同一个数据库里，等于没有保护。**任何人连接 IM 之前就要设好**：没有这把密钥，IM 相关路径会拒绝保存 token（并明确说明，而不是退回明文存储），Alfred 和 IM 集成都无法使用。请生成一串随机值（`openssl rand -hex 32`），并当作这个实例永久不变的东西。换掉这把密钥，已经存下的 token 全部解不开，每位用户都得重新粘贴一遍。（`JWT_SECRET` 同样不能改，见它那一条。）',
        },
        metaDefault: '—',
        metaFlags: '--encryption-key',
      },
      {
        id: 'jwt_expiration_minutes',
        names: ['JWT_EXPIRATION_MINUTES'],
        desc: {
          en: 'Access-token lifetime in minutes. Sessions refresh automatically, so the practical effect is how long a stolen token stays valid.',
          zh: '访问 token 的有效期（分钟）。会话会自动刷新，实际影响是被盗 token 的存活时长。',
        },
        metaDefault: '`60`',
        metaFlags: '--jwt-expiration-minutes',
      },
      {
        id: 'admin_email',
        names: ['ADMIN_EMAIL'],
        badges: [REQUIRED, PRO],
        desc: {
          en: 'Login username of the initial admin account, created at first boot. On Pro/Max the server refuses to boot without it — Personal tier ignores it.',
          zh: '初始管理员账号的登录用户名，首次启动时创建。Pro/Max 缺少它会拒绝启动——Personal tier 忽略此项。',
        },
        metaDefault: '—',
        metaFlags: '--admin-email',
      },
      {
        id: 'admin_password',
        names: ['ADMIN_PASSWORD'],
        badges: [PRO],
        desc: {
          en: 'Initial admin password, applied only when the admin account is first created. Change it after first login (the boot banner reminds you while the default is in use).',
          zh: '初始管理员密码，仅在管理员账号首次创建时生效。首次登录后请修改（默认密码在用时启动 banner 会提醒）。',
        },
        metaDefault: '`admin123`',
        metaFlags: '--admin-password',
      },
      {
        id: 'personal_tier_password',
        names: ['PERSONAL_TIER_PASSWORD'],
        badges: [PERSONAL, {kind: 'warn', label: {en: 'Set before first boot', zh: '首次启动前设置'}}],
        desc: {
          en: 'Password of the single Personal-tier user, `personal@undercontrol.local` (the login name itself cannot be changed). The Start auto-login always uses this variable, but the stored password is only written at first boot — changing one side without the other breaks auto-login. Set it before the first start, or keep both in sync.',
          zh: '唯一用户 `personal@undercontrol.local` 的密码（登录名本身不可修改）。Start 自动登录始终读取该变量，但存储的密码只在首次启动时写入——只改一边会导致自动登录失效。请在首次启动前设置，或保持两边一致。',
        },
        metaDefault: '`personal123`',
        metaFlags: '--personal-tier-password',
      },
      {
        id: 'migrate_from_personal',
        names: ['MIGRATE_FROM_PERSONAL'],
        badges: [PRO],
        desc: {
          en: 'One-shot migration switch. Starting a Pro/Max server against a database created by Personal tier is refused as a safety check; set this to `true` (together with `ADMIN_EMAIL` / `ADMIN_PASSWORD`) to transfer all data to the new admin account and remove the personal user.',
          zh: '一次性迁移开关。用 Personal tier 创建的数据库启动 Pro/Max 服务会被安全检查拒绝；设为 `true`（配合 `ADMIN_EMAIL` / `ADMIN_PASSWORD`）可把全部数据转移到新管理员账号并移除 personal 用户。',
        },
        metaDefault: '`false`',
        metaFlags: '--migrate-from-personal',
      },
    ],
  },
  {
    id: 'license',
    title: {en: 'License', zh: '许可证'},
    note: {en: 'Personal tier needs none of these', zh: 'Personal tier 不需要以下任何配置'},
    rows: [
      {
        id: 'license_token',
        names: ['LICENSE_TOKEN'],
        badges: [PRO],
        desc: {
          en: 'License token that unlocks Pro/Max features (multi-user, PostgreSQL, S3, admin dashboard). Also read from `UNDERCONTROL_LICENSE`, a `license.txt` in the working directory, or `/etc/undercontrol/license.txt` — first match wins.',
          zh: '解锁 Pro/Max 功能（多用户、PostgreSQL、S3、管理后台）的许可证 token。也可从 `UNDERCONTROL_LICENSE`、工作目录的 `license.txt` 或 `/etc/undercontrol/license.txt` 读取——先命中者生效。',
        },
        metaDefault: '—',
        metaFlags: '--license-token',
      },
      {
        id: 'license_host_secret',
        names: ['LICENSE_HOST_SECRET'],
        badges: [PRO],
        desc: {
          en: 'Host secret paired with your license token; both are issued together.',
          zh: '与许可证 token 配套签发的 host secret。',
        },
        metaDefault: '—',
        metaFlags: '--license-host-secret',
      },
      {
        id: 'license_private_key',
        names: ['LICENSE_PRIVATE_KEY'],
        desc: {
          en: 'Used for issuing licenses. Leave unset on self-hosted instances.',
          zh: '用于签发许可证。自部署实例请留空。',
        },
        metaDefault: '—',
        metaFlags: '--license-private-key',
      },
    ],
  },
  {
    id: 'database',
    title: {en: 'Database', zh: '数据库'},
    note: {en: 'SQLite by default — PostgreSQL is Pro/Max', zh: '默认 SQLite——PostgreSQL 为 Pro/Max 功能'},
    rows: [
      {
        id: 'database_type',
        names: ['DATABASE_TYPE'],
        desc: {
          en: '`sqlite` or `postgres`. SQLite lives inside `UD_DATA_PATH` and is enough for most single-household instances; PostgreSQL requires a Pro/Max license.',
          zh: '`sqlite` 或 `postgres`。SQLite 位于 `UD_DATA_PATH` 内，对大多数个人/家庭实例已经足够；PostgreSQL 需要 Pro/Max 许可证。',
        },
        metaDefault: '`sqlite`',
        metaFlags: '--database-type',
      },
      {
        id: 'database_url',
        names: ['DATABASE_URL'],
        desc: {
          en: 'Full PostgreSQL connection string. When set, it overrides all the individual `POSTGRES_*` variables below.',
          zh: '完整的 PostgreSQL 连接串。设置后会覆盖下面所有单项 `POSTGRES_*` 变量。',
        },
        metaDefault: '—',
        metaFlags: '--database-url',
      },
      {
        id: 'postgres_conn',
        names: ['POSTGRES_HOST', '/ PORT / USER / PASSWORD / DATABASE / SSL_MODE'],
        desc: {
          en: 'Individual connection parts, for when you prefer them over one URL: `POSTGRES_HOST` (`localhost`), `POSTGRES_PORT` (`5432`), `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE` (`undercontrol`), `POSTGRES_SSL_MODE` (`disable`).',
          zh: '不想用一条 URL 时的单项连接参数：`POSTGRES_HOST`（`localhost`）、`POSTGRES_PORT`（`5432`）、`POSTGRES_USER`、`POSTGRES_PASSWORD`、`POSTGRES_DATABASE`（`undercontrol`）、`POSTGRES_SSL_MODE`（`disable`）。',
        },
        metaFlags: '--postgres-host, --postgres-port, …',
      },
      {
        id: 'postgres_pool',
        names: ['POSTGRES_MAX_OPEN_CONNS', '/ MAX_IDLE_CONNS / CONN_MAX_LIFETIME / CONN_MAX_IDLE_TIME'],
        desc: {
          en: 'Connection-pool tuning; the defaults suit a small instance: max open `25`, max idle `5`, connection lifetime `300` s, idle timeout `60` s.',
          zh: '连接池调优，默认值适合小型实例：最大连接 `25`、最大空闲 `5`、连接存活 `300` 秒、空闲超时 `60` 秒。',
        },
        metaFlags: '--postgres-max-open-conns, …',
      },
    ],
  },
  {
    id: 'storage',
    title: {en: 'Files & storage', zh: '文件与存储'},
    note: {en: 'local disk by default — S3 is Pro/Max', zh: '默认本地磁盘——S3 为 Pro/Max 功能'},
    rows: [
      {
        id: 'max_file_size',
        names: ['MAX_FILE_SIZE'],
        desc: {
          en: 'Upload size limit in bytes.',
          zh: '上传大小上限（字节）。',
        },
        metaDefault: '`10485760` (10 MB)',
        metaFlags: '--max-file-size',
      },
      {
        id: 's3_enabled',
        names: ['S3_ENABLED'],
        badges: [PRO],
        desc: {
          en: 'Store uploads in S3-compatible object storage (AWS S3, Cloudflare R2, MinIO) instead of the local data directory. The boot banner shows which mode is active.',
          zh: '把上传文件存到 S3 兼容对象存储（AWS S3、Cloudflare R2、MinIO），替代本地数据目录。启动 banner 会显示当前生效的存储模式。',
        },
        metaDefault: '`false`',
        metaFlags: '--s3-enabled',
      },
      {
        id: 's3_conn',
        names: ['S3_ENDPOINT', '/ REGION / BUCKET / ACCESS_KEY_ID / SECRET_ACCESS_KEY / FORCE_PATH_STYLE'],
        desc: {
          en: 'All required once `S3_ENABLED=true`: endpoint URL, region (`auto` works for R2), bucket name, credentials. `S3_FORCE_PATH_STYLE` (default `true`) suits MinIO and most non-AWS providers.',
          zh: '`S3_ENABLED=true` 后均为必填：endpoint URL、region（R2 可用 `auto`）、bucket、凭据。`S3_FORCE_PATH_STYLE`（默认 `true`）适合 MinIO 及多数非 AWS 提供商。',
        },
        metaFlags: '--s3-endpoint, --s3-bucket, …',
      },
    ],
  },
  {
    id: 'ai',
    title: {en: 'AI & vision', zh: 'AI 与视觉'},
    note: {en: 'all optional — AI features stay off without a key', zh: '全部可选——不配 key 时 AI 功能保持关闭'},
    rows: [
      {
        id: 'openai_api_key',
        names: ['OPENAI_API_KEY'],
        desc: {
          en: 'API key that enables the AI features (task-from-image, receipt extraction, chat). Works with any OpenAI-compatible endpoint — pair with `OPENAI_BASE_URL` for Azure, GitHub Models, or a local model server.',
          zh: '启用 AI 功能（图片转任务、票据识别、聊天）的 API key。兼容任何 OpenAI 风格的 endpoint——配合 `OPENAI_BASE_URL` 可接 Azure、GitHub Models 或本地模型服务。',
        },
        metaDefault: '—',
        metaFlags: '--openai-api-key',
      },
      {
        id: 'openai_tuning',
        names: ['OPENAI_MODEL', '/ BASE_URL / MAX_TOKENS / TEMPERATURE / ORG_ID'],
        desc: {
          en: 'Model and endpoint tuning: model name (`gpt-3.5-turbo`), base URL (`https://api.openai.com/v1`), response cap (`1000` tokens), temperature (`0.7`), optional organization ID.',
          zh: '模型与 endpoint 调优：模型名（`gpt-3.5-turbo`）、base URL（`https://api.openai.com/v1`）、响应上限（`1000` tokens）、temperature（`0.7`）、可选 organization ID。',
        },
        metaFlags: '--openai-model, --openai-base-url, …',
      },
      {
        id: 'ai_startup',
        names: ['AI_STARTUP_BACKEND_ACTIVE', '/ AI_STARTUP_FRONTEND_ACTIVE'],
        desc: {
          en: 'Whether the system AI provider configured above starts out active on the backend / offered to the frontend. Users can still bring their own provider in-app.',
          zh: '上面配置的系统级 AI 服务是否在后端默认激活 / 是否提供给前端。用户仍可在应用内使用自己的 AI 服务。',
        },
        metaDefault: '`false` / `false`',
        metaFlags: '--ai-startup-backend-active, …',
      },
      {
        id: 'azure_vision',
        names: ['AZURE_VISION_KEY', '/ AZURE_VISION_URL'],
        desc: {
          en: 'Azure computer-vision credentials for image analysis, if you use Azure instead of an OpenAI-compatible vision model.',
          zh: '使用 Azure 而非 OpenAI 兼容视觉模型做图像分析时的 Azure 凭据。',
        },
        metaDefault: '—',
        metaFlags: '--azure-vision-key, --azure-vision-url',
      },
      {
        id: 'ocr',
        names: ['OCR_ENDPOINT', '/ OCR_AUTHORIZATION / OCR_TIMEOUT'],
        desc: {
          en: 'External OCR service for receipt/document text extraction: endpoint (`http://127.0.0.1:8000/ocr`), auth token, timeout in seconds (`30`).',
          zh: '票据/文档文字提取的外部 OCR 服务：endpoint（`http://127.0.0.1:8000/ocr`）、认证 token、超时秒数（`30`）。',
        },
        metaFlags: '--ocr-endpoint, …',
      },
    ],
  },
  {
    id: 'network',
    title: {en: 'Network & integrations', zh: '网络与集成'},
    rows: [
      {
        id: 'cors_allowed_origins',
        names: ['CORS_ALLOWED_ORIGINS'],
        desc: {
          en: 'Comma-separated list of origins allowed to call the API from a browser. Only needed when the frontend is served from a different origin than the backend — the all-in-one image serves both from one origin, so the default is fine there.',
          zh: '允许从浏览器调用 API 的来源列表（逗号分隔）。仅当前端与后端不同源时需要——all-in-one 镜像前后端同源，默认值即可。',
        },
        metaDefault: '`http://localhost:3000,http://localhost:12000,http://localhost:8080`',
        metaFlags: '--cors-allowed-origins',
      },
      {
        id: 'frontend_url',
        names: ['FRONTEND_URL'],
        desc: {
          en: 'Where shareable links point when generated outside a browser (e.g. from the desktop app). Set it to the same public URL as `HOST_DOMAIN` for all-in-one deployments.',
          zh: '在浏览器之外（如桌面应用）生成分享链接时的指向。all-in-one 部署请设为与 `HOST_DOMAIN` 相同的公网 URL。',
        },
        metaDefault: '`http://localhost:12000`',
        metaFlags: '--frontend-url',
      },
      {
        id: 'slack_webhook_url',
        names: ['SLACK_WEBHOOK_URL'],
        desc: {
          en: 'Slack incoming-webhook for server notifications such as backup results.',
          zh: '服务端通知（如备份结果）的 Slack incoming-webhook。',
        },
        metaDefault: '—',
        metaFlags: '--slack-webhook-url',
      },
      {
        id: 'telegram_bot_token',
        names: ['TELEGRAM_BOT_TOKEN'],
        desc: {
          en: 'Bot token that switches on the Telegram channel for Alfred, the built-in butler agent — get one from @BotFather (`/newbot`). Applies at runtime: an admin can set, change or clear it in Admin → System Config → Integration and the messenger gateway starts, restarts or stops accordingly, no server restart. The env var seeds the same setting at boot; while it is set it wins on every boot and the field shows as locked in the admin UI. A token Telegram rejects is reported on the System Config page. Once set, `GET /app/info` lists the messenger and users can link their own account from first-run onboarding or Profile → Messenger (generate a one-time code, send `/link CODE` to the bot within 10 minutes). Entirely optional: mentioning `@alfred` in web comments works without it. `DISCORD_BOT_TOKEN` is accepted too, but no Discord provider is implemented yet.',
          zh: '为内置管家 Agent Alfred 开启 Telegram 通道的 bot token——在 Telegram 里找 @BotFather 发送 `/newbot` 获取。运行时即刻生效：管理员可在「管理后台 → 系统配置 → Integration」中设置、更换或清除，IM 网关会相应启动、重启或停止，无需重启服务。环境变量在启动时注入同一配置；只要它还在，每次启动都以它为准、后台界面中该字段显示为锁定。被 Telegram 拒绝的 token 会直接显示在系统配置页上。配置后 `GET /app/info` 会列出该通道，用户可在首启引导或 Profile → Messenger 中绑定自己的账号（生成一次性验证码，10 分钟内向 bot 发送 `/link CODE`）。完全可选：不配置也能在网页评论里 @alfred 对话。`DISCORD_BOT_TOKEN` 同样可读取，但 Discord provider 尚未实现。',
        },
        metaDefault: '—',
        metaFlags: '--telegram-bot-token',
      },
    ],
  },
  {
    id: 'jobs',
    title: {en: 'Background jobs', zh: '后台任务'},
    rows: [
      {
        id: 'cron_enabled',
        names: ['CRON_ENABLED'],
        desc: {
          en: 'Master switch for scheduled jobs (cleanup, backups, scheduled-task processing). Leave on unless you run a separate worker instance. **Set it to `false` before starting a server whose database came from somewhere else** — a restored backup or a copy carries every scheduled job the original had, and those jobs belong to that instance, not this one. Applied at boot only: the value is read-only in Admin → System Config, and the startup banner prints the state, where it came from, and how many enabled scheduled jobs the database holds.',
          zh: '定时任务总开关（清理、备份、计划任务处理）。除非另跑独立 worker 实例，否则保持开启。**如果这台服务器的数据库来自别处（恢复的备份或拷贝），启动前先把它设为 `false`** —— 那份库里原有的定时任务会全部由这个实例执行，而它们本不属于这里。仅在启动时生效：该值在「管理后台 → 系统配置」中只读展示，启动横幅会打印它的状态、来源，以及库里有多少条已启用的定时任务。',
        },
        metaDefault: '`true`',
        metaFlags: '--cron-enabled',
      },
      {
        id: 'visitor_cleanup',
        names: ['VISITOR_CLEANUP_ENABLED', '/ VISITOR_RETENTION_DAYS / VISITOR_CLEANUP_SCHEDULE'],
        desc: {
          en: 'Automatic removal of expired visitor (demo) accounts and their data: on by default, retention `3` days, runs daily at midnight (`0 0 * * *`, cron syntax). Applied at boot only, like `CRON_ENABLED` — worth knowing when you boot a copy of a real database, since it deletes visitor data on a schedule.',
          zh: '过期访客（演示）账号及其数据的自动清理：默认开启，保留 `3` 天，每天零点运行（`0 0 * * *`，cron 语法）。与 `CRON_ENABLED` 一样仅在启动时生效 —— 用真实库的拷贝起实例时要留意：它会按时删除访客数据。',
        },
        metaFlags: '--visitor-cleanup-enabled, …',
      },
    ],
  },
  {
    id: 'observability',
    title: {en: 'Observability', zh: '可观测性'},
    note: {en: 'for operators who ship logs/traces elsewhere', zh: '面向需要外送日志/追踪的运维者'},
    rows: [
      {
        id: 'otel_enabled',
        names: ['OTEL_ENABLED'],
        desc: {
          en: 'Export traces, metrics and logs via OpenTelemetry (OTLP). Off by default; logs still go to stdout either way.',
          zh: '通过 OpenTelemetry（OTLP）导出 trace、指标和日志。默认关闭；日志始终会输出到 stdout。',
        },
        metaDefault: '`false`',
        metaFlags: '--otel-enabled',
      },
      {
        id: 'otel_endpoints',
        names: ['OTEL_EXPORTER_OTLP_ENDPOINT', '/ _HEADERS / TRACES / METRICS / LOGS / SERVICE_NAME'],
        desc: {
          en: 'Standard OTLP exporter settings: one shared endpoint (`OTEL_EXPORTER_OTLP_ENDPOINT`), auth headers (`OTEL_EXPORTER_OTLP_HEADERS`), per-signal overrides (`OTEL_TRACES_ENDPOINT` / `OTEL_METRICS_ENDPOINT` / `OTEL_LOGS_ENDPOINT`), and the reported service name (`OTEL_SERVICE_NAME`).',
          zh: '标准 OTLP 导出配置：共享 endpoint（`OTEL_EXPORTER_OTLP_ENDPOINT`）、认证头（`OTEL_EXPORTER_OTLP_HEADERS`）、按信号覆盖（`OTEL_TRACES_ENDPOINT` / `OTEL_METRICS_ENDPOINT` / `OTEL_LOGS_ENDPOINT`），以及上报的服务名（`OTEL_SERVICE_NAME`）。',
        },
        metaFlags: '--otel-endpoint, …',
      },
    ],
  },
  {
    id: 'advanced',
    title: {en: 'Advanced', zh: '进阶'},
    note: {en: 'rarely needed', zh: '一般用不到'},
    rows: [
      {
        id: 'event_bus',
        names: ['EVENT_BUS_WORKERS', '/ EVENT_BUS_QUEUE_SIZE'],
        desc: {
          en: 'Internal event-bus sizing: background workers (`4`) and queue capacity (`1000`). Only worth touching on unusually busy instances.',
          zh: '内部事件总线规模：后台 worker 数（`4`）与队列容量（`1000`）。只有异常繁忙的实例才值得调整。',
        },
        metaFlags: '--event-bus-workers, --event-bus-queue-size',
      },
    ],
  },
];

/** Render `backtick` spans in a plain string as inline <code>. */
function inline(text: string): ReactNode {
  const parts = text.split('`');
  return parts.map((part, i) => (i % 2 === 1 ? <code key={i}>{part}</code> : part));
}

const UI = {
  eyebrow: {en: 'udctl · Self-hosting', zh: 'udctl · 自部署'},
  title: {en: 'Configuration Reference', zh: '配置参考'},
  lede: {
    en: 'Build a working configuration below, then look anything up in the full reference. Every setting can be given three ways, in order of precedence: CLI flag › environment variable › built-in default. A `.env` file in the working directory is loaded automatically.',
    zh: '先用下面的生成器搭出一份可用配置，再到完整参考里查任何一项。每个配置项都有三种设置方式，优先级从高到低：CLI flag › 环境变量 › 内置默认值。工作目录下的 `.env` 文件会被自动加载。',
  },
  values: {
    en: 'On/off settings accept `true/false`, `1/0`, `yes/no`, `on/off` and `enabled/disabled`, in any case and ignoring surrounding spaces. A value that cannot be read is **not** quietly replaced by the default: the server refuses to start and names the variable, what it received, and the accepted spellings. The same goes for numbers. Leaving a variable empty (`CRON_ENABLED=`) uses the default and logs a warning — remove the line instead if that is what you meant.',
    zh: '开关类配置接受 `true/false`、`1/0`、`yes/no`、`on/off`、`enabled/disabled`，不区分大小写、忽略首尾空格。**读不懂的值不会被悄悄换成默认值**：服务会拒绝启动，并指明是哪个变量、收到了什么、以及可接受的写法。数字类配置同理。把变量留空（`CRON_ENABLED=`）会使用默认值并打印一条警告——如果本意就是用默认值，请直接删掉这一行。',
  },
  source: {
    en: 'Source of truth: `go-backend/internal/config/config.go` — this page tracks it.',
    zh: '事实来源：`go-backend/internal/config/config.go`——本页始终与它保持同步。',
  },
  minimumTitle: {en: 'The minimum to boot', zh: '启动所需的最少配置'},
  minimumItems: {
    en: [
      '`HOST_DOMAIN` — `http://localhost:3000` or your public URL',
      '`JWT_SECRET` — a random string, set before the first start and never changed (the default is a known value)',
      '`ADMIN_EMAIL` — Pro/Max only; Personal tier needs nothing more',
    ],
    zh: [
      '`HOST_DOMAIN` —— `http://localhost:3000` 或你的公网 URL',
      '`JWT_SECRET` —— 随机字符串，首次启动前设好、之后不再改（默认值是公开已知的）',
      '`ADMIN_EMAIL` —— 仅 Pro/Max 需要；Personal tier 不需要更多配置',
    ],
  },
  minimumNote: {
    en: "Get these wrong and the server won't limp along — it exits with a `STARTUP FAILED` block naming the variable to fix. Get them right and the log ends with `--> Open <url> to get started`.",
    zh: '配错时服务不会带病运行——会直接退出并打印 `STARTUP FAILED` 块，指明要修的变量。配对时日志末尾会显示 `--> Open <url> to get started`。',
  },
  buildTitle: {en: 'Build your config', zh: '生成你的配置'},
  refTitle: {en: 'Full reference', zh: '完整参考'},
  refSub: {
    en: 'Click a variable name to copy it.',
    zh: '点击变量名即可复制。',
  },
  filterPlaceholder: {en: 'Filter — try “postgres”, “password”, “S3”…', zh: '过滤——试试 “postgres”、“密码”、“S3”…'},
  matches: {en: 'entries match', zh: '条匹配'},
  of: {en: 'of', zh: '/'},
  defaultKey: {en: 'Default', zh: '默认'},
  flagKey: {en: 'Flag', zh: 'Flag'},
  copied: {en: 'Copied', zh: '已复制'},
  footnote: {
    en: 'Maintained by the Onboarding Experience Owner. When a variable is added, renamed, or its default changes in `config.go`, this page changes in the same task — if you find drift, that is a bug worth reporting. See also the ',
    zh: '由 Onboarding Experience Owner 维护。`config.go` 中任何变量的新增、改名或默认值变化，都会在同一任务里同步到本页——发现不一致请当作 bug 反馈。另见',
  },
  footnoteLink: {en: 'Self-Deployment Guide', zh: '自部署指南'},
} as const;

export default function ConfigurationPage(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const zh = i18n.currentLocale === 'zh-Hans';
  const t = (l: L | {en: string; zh: string}) => (zh ? l.zh : l.en);

  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');

  const total = useMemo(() => REFERENCE.reduce((n, c) => n + c.rows.length, 0), []);

  const q = query.trim().toLowerCase();
  const rowMatches = (row: VarRow) =>
    !q ||
    row.names.join(' ').toLowerCase().includes(q) ||
    t(row.desc).toLowerCase().includes(q) ||
    (row.metaFlags || '').toLowerCase().includes(q);

  const visible = REFERENCE.map((cat) => ({
    cat,
    rows: cat.rows.filter(rowMatches),
  }));
  const shown = visible.reduce((n, v) => n + v.rows.length, 0);

  function copyName(name: string) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(name).then(() => {
        setToast(`${t(UI.copied)} ${name}`);
        window.setTimeout(() => setToast(''), 1400);
      });
    }
  }

  return (
    <Layout
      title={t(UI.title)}
      description={
        zh
          ? 'udctl 服务端的全部配置项——含交互式配置生成器和启动预览。'
          : 'Every setting the udctl server reads — with an interactive config builder and boot preview.'
      }>
      <main className={styles.shell}>
        <p className={styles.eyebrow}>{t(UI.eyebrow)}</p>
        <h1 className={styles.title}>{t(UI.title)}</h1>
        <p className={styles.lede}>{inline(t(UI.lede))}</p>
        <p className={styles.lede}>{inline(t(UI.values))}</p>
        <p className={styles.sourceNote}>{inline(t(UI.source))}</p>

        <div className={styles.minimum}>
          <h2>{t(UI.minimumTitle)}</h2>
          <ul>
            {(zh ? UI.minimumItems.zh : UI.minimumItems.en).map((item, i) => (
              <li key={i}>{inline(item)}</li>
            ))}
          </ul>
          <p className={styles.bannerNote}>{inline(t(UI.minimumNote))}</p>
        </div>

        <h2 className={styles.sectionTitle}>{t(UI.buildTitle)}</h2>
        <ConfigBuilder locale={zh ? 'zh' : 'en'} />

        <h2 className={styles.sectionTitle}>{t(UI.refTitle)}</h2>
        <p className={styles.lede}>{t(UI.refSub)}</p>

        <div className={styles.controls}>
          <input
            className={styles.filter}
            type="search"
            value={query}
            placeholder={t(UI.filterPlaceholder)}
            aria-label={t(UI.filterPlaceholder)}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={styles.filterMeta}>
            {q ? `${shown} ${t(UI.of)} ${total} ${t(UI.matches)}` : ''}
          </div>
        </div>

        <nav className={styles.catNav} aria-label={zh ? '分类' : 'Categories'}>
          {REFERENCE.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`}>
              {t(cat.title)} <span className={styles.catCount}>{cat.rows.length}</span>
            </a>
          ))}
        </nav>

        {visible.map(({cat, rows}) =>
          rows.length === 0 ? null : (
            <section key={cat.id} className={styles.cat}>
              <h2 id={cat.id} className={styles.catTitle}>
                {t(cat.title)}
                {cat.note && <span className={styles.catNote}>{t(cat.note)}</span>}
              </h2>
              {rows.map((row) => (
                <div key={row.id} id={row.id} className={styles.row}>
                  <div className={styles.rowHead}>
                    <button
                      type="button"
                      className={styles.rowName}
                      title={zh ? '点击复制' : 'Click to copy'}
                      onClick={() => copyName(row.names[0])}>
                      {row.names[0]}
                    </button>
                    {row.names.slice(1).map((n) => (
                      <span key={n} className={`${styles.mono} ${styles.rowName}`} style={{cursor: 'default'}}>
                        {n}
                      </span>
                    ))}
                    {row.badges?.map((b, i) => (
                      <span
                        key={i}
                        className={`${styles.badge} ${
                          b.kind === 'req' ? styles.badgeReq : b.kind === 'warn' ? styles.badgeWarn : styles.badgeTier
                        }`}>
                        {t(b.label)}
                      </span>
                    ))}
                  </div>
                  <p className={styles.rowDesc}>{inline(t(row.desc))}</p>
                  <div className={styles.rowMeta}>
                    {row.metaDefault && (
                      <span>
                        <span className={styles.metaKey}>{t(UI.defaultKey)}</span>
                        {inline(row.metaDefault)}
                      </span>
                    )}
                    <span>
                      <span className={styles.metaKey}>{t(UI.flagKey)}</span>
                      <code>{row.metaFlags}</code>
                    </span>
                  </div>
                </div>
              ))}
            </section>
          ),
        )}

        <p className={styles.footnote}>
          {inline(t(UI.footnote))}
          <Link to="/docs/self-deployment">{t(UI.footnoteLink)}</Link>
          {zh ? '。' : '.'}
        </p>
      </main>
      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}
    </Layout>
  );
}
