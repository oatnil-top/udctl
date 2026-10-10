---
sidebar_position: 2
---

# Self-Deployment Guide

Self-host udctl with a single Docker command. The **all-in-one image** bundles
the frontend and backend in one container, so there is nothing to wire together — just
run it and open your browser.

The images are published for both **linux/amd64** and **linux/arm64** (Apple Silicon,
ARM servers), so the same command works on any machine.

## Quick Start (Free / Personal)

No license required. Single user, SQLite, local file storage.

```bash
docker run -d --name undercontrol \
  -p 3000:8080 \
  -e HOST_DOMAIN=http://localhost:3000 \
  -e JWT_SECRET=change-me-to-a-random-string \
  -v undercontrol-data:/app/data \
  lintao0o0/undercontrol:latest
```

Then open `http://localhost:3000` and click **Start**. The frontend and backend are in
the same container and connect automatically via `/api/v1` — no server URL to configure.

### First-boot banner

The container logs make success and failure obvious. On a successful boot,
`docker logs undercontrol` ends with a ready banner telling you exactly where to go
and how to log in:

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

The `Scheduler` line states whether scheduled jobs are running, which input decided
that (`default`, `env CRON_ENABLED`, or `flag --cron-enabled`), and how many enabled
scheduled jobs the database holds. A fresh install shows `0`. A non-zero count on an
instance you just created means the database came from somewhere else — see
[Starting a server from a copied database](#starting-a-server-from-a-copied-database).

If the configuration is broken, the container exits immediately and the same logs show
a `STARTUP FAILED` block explaining exactly what to fix — a missing `HOST_DOMAIN`, a
missing `ADMIN_EMAIL` on Pro/Max, a port already in use, or a setting whose value could
not be read. The password hint only appears while the account is still on the shipped
default password.

## Set JWT_SECRET before the first start {#jwt-secret}

`JWT_SECRET` is the key the server signs every login token with. Set it to a long random
value before you start the instance for the first time, and keep it for the life of the
instance.

```bash
# generate a value, then pass it as JWT_SECRET
openssl rand -base64 48
```

Pass it like any other setting: `docker run -e JWT_SECRET=...`, the `environment:` list in
docker-compose, a `.env` file, or `-jwt-secret` for the npm package. The Homebrew install
generates one for you.

**Why it is required.** With no `JWT_SECRET`, the server still starts, but signs tokens with
a fixed default that is compiled into the binary and therefore public. Anyone who can reach
the instance can use it to forge a valid token and sign in as any user. The placeholder
`change-me-to-a-random-string` in the examples on this page is just as public: replace it.

**Why it must not change later.** The same key also encrypts settings the server stores in
its database: the configuration of every storage class (including the built-in local one
created on first start), AI provider API keys, and secret values saved in the admin
settings. If `JWT_SECRET` changes on an instance that already has data, those values can no
longer be decrypted: file uploads and downloads fail with an internal error, and the
server log says `failed to decrypt config`. Setting it to the original value again makes
them readable again. This also applies to an instance that has been running on the
default and is then given a new value. Everyone is signed out as well, since tokens signed
with the old value stop validating.

## Bare-metal (npm, no Docker)

The server is also published as an npm package with the web UI compiled into the
binary — nothing else to install. Requires Node.js 18+. Available for macOS
(Intel & Apple Silicon), Linux (x64 & ARM64), and Windows (x64).

```bash
# server + CLI
npm install -g @oatnil/ud-server @oatnil/ud

# once; keep it, never regenerate
openssl rand -base64 48 > ./jwt-secret
ud-server -host-domain http://localhost:8080 -data-path ./data \
  -jwt-secret "$(cat ./jwt-secret)"
```

Then open `http://localhost:8080` — the same ready banner as Docker prints in the
terminal with the login credentials. Everything lives under `./data` (SQLite database
and uploads), so backing up or moving the instance is copying that directory and
keeping the same `JWT_SECRET`.

- Configuration is identical to Docker: every environment variable in the
  [Configuration reference](/configuration) also works as a CLI flag
  (`ud-server -help` lists them). Always give it `HOST_DOMAIN` and the same
  `JWT_SECRET` on every start (see [Set JWT_SECRET before the first start](#jwt-secret)).
- Licenses work the same way: export `LICENSE_TOKEN` / `LICENSE_HOST_SECRET`
  before starting to unlock Pro features.
- Upgrade with `npm update -g @oatnil/ud-server`; uninstall with
  `npm uninstall -g @oatnil/ud-server` (your `./data` directory is untouched).
- To run it as a service, wrap the command in systemd / launchd like any other
  single binary, or install it with Homebrew (below), which sets that up for you.

## Homebrew (macOS / Linux, runs as a service)

The same server binary is in the Homebrew tap, with a `brew services` definition so it
starts in the background and comes back at login:

```bash
brew tap oatnil-top/ud
# Homebrew >= 6 only
brew trust oatnil-top/ud
brew install ud-server
brew services start ud-server
```

Then open `http://localhost:8080`. Where things live (`$(brew --prefix)` is
`/opt/homebrew` on Apple Silicon, `/usr/local` on Intel, `/home/linuxbrew/.linuxbrew` on Linux):

| What | Path |
|---|---|
| Configuration | `$(brew --prefix)/etc/ud-server/.env` |
| Data (SQLite database, uploads) | `$(brew --prefix)/var/ud-server` |
| Log | `$(brew --prefix)/var/log/ud-server.log` |

- The `.env` file sets `PORT=8080`, `HOST_DOMAIN=http://localhost:8080`, the data
  path and a `JWT_SECRET` generated for this install; any variable from the
  [Configuration reference](/configuration) can be added there. Restart to apply:
  `brew services restart ud-server`.
- The server listens on all network interfaces, so other machines on your network can
  reach port 8080. To serve them, set `HOST_DOMAIN` to the URL they use.
- `brew upgrade ud-server` replaces only the binary; the configuration and data
  directories are left as they are. Run `brew services restart ud-server` afterwards.
- Stop with `brew services stop ud-server`; `brew uninstall ud-server` leaves the
  configuration and data in place, so delete those two directories yourself to remove
  everything.
- `brew services start` runs it as your user and starts it when you log in. To start
  it at boot without a login, use `sudo brew services start ud-server`.

## Pro / Max (Multi-user)

Add a license token and an admin account to unlock multi-user, PostgreSQL, S3 storage and
the admin dashboard. Contact the udctl team for a license token.

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

Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set.

:::info Your instance is private by default
A fresh instance does not accept sign-ups. Your own admin account is created at
startup from `ADMIN_EMAIL`, so you can log in straight away — but nobody else can
create an account, through the register form, a GitHub/Google login, or the visitor
button. To let other people use your instance, set `REGISTRATION_ENABLED=true` and
restart. The boot banner prints which it is (`Signup: closed (default)`).
:::

:::warning ADMIN_EMAIL is required for Pro/Max
On Pro/Max tier the initial admin user is created from `ADMIN_EMAIL` at startup. If it is
missing the server **refuses to boot** with a clear error — set it (and `ADMIN_PASSWORD`)
before starting.
:::

## docker-compose

For persistent data and easier configuration, use docker-compose:

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
      # Let other people create their own accounts on this instance (default: off):
      # - REGISTRATION_ENABLED=true
      # Needed before anyone can connect a messenger. Pick a random value once and
      # never change it — see the variable reference below:
      # - UD_ENCRYPTION_KEY=change-me-to-a-random-string
      # Pro/Max only:
      # - ADMIN_EMAIL=admin@example.com
      # - ADMIN_PASSWORD=your-secure-password
      # - LICENSE_TOKEN=your-license-token
      # - LICENSE_HOST_SECRET=your-license-host-secret
```

```bash
docker compose up -d
```

## Environment Variables

The table below covers the variables most deployments touch. For every setting the
server reads — with an interactive config builder and boot preview — see the
[Configuration Reference](/configuration).

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HOST_DOMAIN` | **Yes** | — | Public URL clients use to reach this instance. Used to build file download/upload links, so it must be reachable (e.g. `http://localhost:3000` or `https://ud.example.com`). |
| `JWT_SECRET` | **Yes** | built-in public value | Random secret used to sign auth tokens and to encrypt stored settings (storage class configuration, AI provider keys). Set it before the first start and never change it on an instance that has data — see [Set JWT_SECRET before the first start](#jwt-secret). |
| `ADMIN_EMAIL` | Pro/Max | — | Login username of the initial admin user. Required on Pro/Max tier. |
| `ADMIN_PASSWORD` | Pro/Max | `admin123` | Initial admin password. Change it. |
| `LICENSE_TOKEN` | Pro/Max | — | License token that unlocks Pro/Max features. |
| `LICENSE_HOST_SECRET` | Pro/Max | — | Host secret paired with your license token. |
| `PERSONAL_TIER_PASSWORD` | No | `personal123` | Password of the single Personal-tier user (`personal@undercontrol.local`). Set it **before first boot**: the **Start** auto-login always uses this variable, so changing only the env var after the user exists — or changing only the password in-app — breaks auto-login (the two must match; the login name itself cannot be changed). |
| `PORT` | No | `8080` | Port the server listens on inside the container. |
| `REGISTRATION_ENABLED` | No | `false` | Lets people create their own accounts on this instance. **Off by default** — your admin account comes from `ADMIN_EMAIL` at startup, so you can log in without it, but sign-ups are refused until you turn it on. Covers all three ways an account can be created: the register form, a first GitHub/Google login, and the visitor button. Applied at boot only. |
| `UD_ENCRYPTION_KEY` | Messenger | — | Key used to encrypt user-owned secrets at rest — today each user's own messenger bot token. **Required before anyone can connect a messenger**: without it the Messenger section refuses to store a token and says so. Treat it as permanent per instance — changing it strands every stored token and each user must paste theirs again. `JWT_SECRET` must not change either, for a related reason (it encrypts storage and AI provider settings). |
| `IM_MAX_BYO_BOTS` | No | `20` | How many user-owned messenger bots this instance will run at once. Each holds one long-polling connection. |
| `AI_DAILY_FREE_QUOTA` | No | `10` | Free AI actions per user per day (resets at UTC midnight) on the server's shared AI providers; anything a user runs on their **own** API key is never counted. **`0` means no free quota at all — every shared-provider AI action is refused; `-1` means unlimited.** These two are easy to guess backwards, so set them deliberately. When someone hits the limit: chat requests fail with a quota error, and a quick capture shows up as a "For You" bell notification explaining the refusal plus a **Failed** row on the Queue Tasks page. |
| `CRON_ENABLED` | No | `true` | Runs scheduled jobs (cleanup, backups, scheduled-task processing, agent wake-ups). Set it to `false` before starting a server whose database came from somewhere else — see below. Applied at boot only. |

On/off variables accept `true/false`, `1/0`, `yes/no`, `on/off` and `enabled/disabled`,
in any case. A value the server cannot read is **not** silently replaced by the default:
it refuses to start and tells you which variable, what it received, and what is accepted.

### Starting a server from a copied database

Scheduled jobs live in the database, not in your configuration. A database restored from
a backup — or copied from another machine — therefore arrives with all of the original
instance's scheduled jobs still enabled, and the new server will start running them:
sending messages, waking agents, writing to external services, all as if it were the
instance they were created on.

Start such a server with the scheduler off:

```bash
docker run -e CRON_ENABLED=false ...   # or: ./server --cron-enabled=false
```

Then check the `Scheduler` line in the boot banner to confirm it says `disabled` before
you trust the instance. Decide job by job what should be re-enabled, then restart
normally. `VISITOR_CLEANUP_ENABLED=false` is worth adding for the same reason: visitor
cleanup deletes visitor accounts and their data on a schedule.

### Optional: PostgreSQL, S3 and AI

The all-in-one image defaults to SQLite + local file storage, which is enough for most
self-hosted instances. On Pro/Max you can point it at external services with additional
environment variables:

- **PostgreSQL** — set `DATABASE_URL` (or the individual `DB_*` variables) to a Postgres
  connection instead of the bundled SQLite.
- **S3 / R2 storage** — set the `S3_*` variables to store uploaded files in
  S3-compatible object storage (AWS S3, Cloudflare R2, MinIO) instead of the local volume.
- **AI provider** — set the OpenAI-compatible `AI_*` variables to enable AI features.

### Optional: Telegram messenger for Alfred

Alfred is the built-in butler agent. Users talk to him by mentioning `@alfred` in any comment
on the web, and that works on every instance with no configuration at all. The messenger
channel adds the phone: each user connects **their own Telegram bot** and messages Alfred
from anywhere.

There is no instance-wide bot token. Every user creates a bot, holds its credential, and
their chats arrive on it and nowhere else — which is the only arrangement that stays honest
once more than one person uses an instance.

**What the operator does — once:**

- Set `UD_ENCRYPTION_KEY` to a random secret (`openssl rand -hex 32`). Bot tokens are stored
  AES-256-GCM encrypted and cannot be stored at all without it; the Messenger section tells
  users to ask you if it is missing. **Then leave it alone for the life of the instance.**
  Rotating this key strands every token already stored — the ciphertext stays, nothing can read it, and each
  user has to paste their token in again.
- Optionally raise or lower `IM_MAX_BYO_BOTS` (default 20), the number of user bots this
  instance will run at once. It is also editable at runtime in
  **Admin → System Config → Integration**.
- On a multi-user instance, decide when to open the bridge beyond yourself — see
  *Multi-user access* below.

**What each user does — themselves:**

1. Talk to [@BotFather](https://t.me/BotFather) on Telegram, send `/newbot`, and take the
   token it hands back. The bot's name and picture are theirs.
2. Paste the token in **Profile → Messenger**. The server checks it with Telegram before
   storing anything, so a mistyped token is an error next to the field rather than a bot that
   never answers. Once saved it can never be read back — the page shows the bot's handle and a
   mask.
3. Send `/start` to their own bot. Telegram requires it before a bot may message them.
4. Generate a one-time link code in the same section and send `/link CODE` to their bot within
   10 minutes.

Each bot is a private entrance: anyone who is not its owner gets a polite refusal, and a link
code only works on its own owner's bot. Replacing a token reconnects; removing one stops the
connection and deletes the credential, leaving the account binding and the conversation
history intact.

A token Telegram later rejects (a reset in @BotFather, say) shows as **token rejected** in the
user's own Messenger section with the messenger's own error, and they fix it by pasting a new
one. There is no admin repair path any more, and nothing falls back to another user's bot.

`DISCORD_BOT_TOKEN` / `--discord-bot-token` is still accepted by the configuration, but no
Discord provider is implemented yet — setting it alone starts nothing.

### Multi-user access to the messenger bridge

The bridge ships locked to the instance owner: `im.multi_user_enabled` defaults to `false`, and
while it is off any other user sees *multi-user access is not open yet* in place of the
Messenger section. Mentioning `@alfred` on the web is unaffected.

Open it in **Admin → System Config** once you are satisfied with the boundary — every message
runs an agent session on a machine, so this is the switch that decides whose machines a second
user's messages can reach.

### Upgrading an instance that used the old shared bot

Earlier versions had one operator-configured `TELEGRAM_BOT_TOKEN` for the whole instance. That
key is gone, and **the upgrade needs two manual steps**. Read this section before upgrading.

The automatic migration only picks up a token that was stored as the runtime setting
`integration.telegram.bot_token`. That setting existed only briefly during development and
**shipped in no release**, so on every real instance the token lives in the
`TELEGRAM_BOT_TOKEN` environment variable (or the matching flag) — which the migration does
not read. In practice this means: **nothing is migrated automatically, and the failure is
silent.** The container still boots healthy and the logs still say the bridge started.

Upgrade like this:

1. **Copy your existing `TELEGRAM_BOT_TOKEN` value somewhere safe** before you change anything.
   It becomes inert after the upgrade, and it is the only copy you have.
2. **Set `UD_ENCRYPTION_KEY`** to a random secret (`openssl rand -hex 32`) in the same
   configuration. Without it the server refuses to store any bot token at all. Treat it as
   permanent — see the variable's note above.
3. Upgrade the image and start the instance as usual.
4. **Re-register the token by hand.** The owner opens **Profile → Messenger** and pastes the
   token from step 1. The server verifies it with Telegram before storing, so a mistyped token
   is an error on the spot rather than a bot that never answers.
5. **Restart the instance once more.** This step is easy to miss and matters: conversations and
   deliveries created by the old shared bot are not attached to any per-user bot yet, and the
   new runtime can only see rows that are. The restart is what attaches them, and it only works
   once a bot exists — which is why it comes after step 4.

Until step 5 is done, the bridge looks healthy but **replies to existing conversations are
silently dropped**. There is no error in the interface; the only symptom is a log line reading
`IM relay has no live bot for a conversation, dropping message` with `botState="unmigrated"`.
New conversations started after the upgrade are unaffected, which can make the problem look
intermittent.

Verify by sending a real message and confirming a reply comes back — a healthy container, a
clean log and a started bridge do not prove delivery works.

Once the messenger is confirmed working you can drop `TELEGRAM_BOT_TOKEN` from your
configuration. Keeping it until then costs nothing and lets you roll back to the previous
version in place.

Other users are not migrated, because there was nothing of theirs to migrate: they were using
the operator's bot. Each connects their own.

## First-run onboarding

The first time a user opens a fresh instance they get a five-step wizard. Every step is
skippable, and anything already configured shows up as completed instead of asking again.
Nothing here is required for the server to run — a bare instance completes onboarding fine.

1. **Language** — English or Chinese for the interface.
2. **Workspace status hooks** — asks permission to add Claude Code hooks to the workspace
   project's `.claude/settings.local.json`, which is what lets the desktop app show live agent
   status (running / waiting / idle). Nothing is written unless the user allows it.
3. **Register this machine as a daemon** — a daemon is the machine that runs agent sessions.
   In the udctl desktop app this is one click, plus a scan of the agent CLIs installed
   locally (Claude Code, Codex, …). In a browser the step recommends the desktop app, or gives
   the headless path for a server or remote box: `npm install -g @oatnil/ud`, `ud login`,
   `ud daemon start`. Either way the step completes as soon as the server reports an online
   daemon.
4. **Connect Telegram** — the user creates their own bot with @BotFather and pastes its token,
   the same flow that lives in Profile → Messenger. Skippable like every other step; the first
   instruction points back at step 3, because a bot with no machine behind it answers nothing.
   On an instance with no `UD_ENCRYPTION_KEY` the step explains that tokens cannot be stored yet
   and to ask the administrator.
5. **Meet Alfred** — introduces the built-in butler agent (dispatching work to the right agent,
   remembering preferences and decisions, filing quick captures) and points users at
   `@alfred` mentions in web comments.

**What the operator must do:** set `UD_ENCRYPTION_KEY` before your users go through onboarding
if you want step 4 to work. Nothing else in the wizard depends on server configuration, and a
user who skips step 4 can connect a bot later from Profile → Messenger.

## Separate frontend / backend images (advanced)

If you need to scale the frontend and backend independently, or put them behind different
proxies, they are also published as separate multi-arch images:

- Backend — `lintao0o0/undercontrol-backend:latest`
- Frontend — `lintao0o0/undercontrol-vite-app:latest`

The backend takes the same environment variables as above; the frontend serves the static
assets via nginx and proxies `/api` to the backend.

**Running more than one backend replica.** Correctness no longer depends on a single
replica: the cap of one live Alfred session per user is enforced by a database index, so a
second replica that races the first loses its insert and hands the message to the session
that won. The messenger bridge is still happiest on one replica, though — each replica opens
its own long poll per user bot, and Telegram allows one consumer per bot, so several replicas
polling the same bots steal each other's messages. Run one backend replica if users connect
messengers; scale the frontend freely either way.

## Data & Backup

All state lives under `/app/data` (mounted as a volume above): the SQLite database and, by
default, uploaded files. Back up that volume to back up your instance. If you use external
PostgreSQL and S3, back those up instead.

Keep a copy of your `JWT_SECRET` with the backup, but not inside it: a restored instance
needs the same value to read its storage and AI provider settings.

## Troubleshooting

Start with `docker logs undercontrol`: a healthy boot ends with the ready banner shown
above, and a misconfigured one ends with a `STARTUP FAILED` block naming the exact
variable to fix.

- **Container exits immediately** — read the `STARTUP FAILED` block in the logs. The
  common causes are a missing `HOST_DOMAIN`, a missing `ADMIN_EMAIL` on Pro/Max, or the
  port already being in use.
- **`no matching manifest for linux/arm64/v8`** — update to the latest image; it is now
  published for both amd64 and arm64.
- **Don't know where to log in** — the ready banner prints the URL and the login account
  for your tier.
- **Uploads and downloads fail with an internal error, and the log says `failed to decrypt
  config`** — `JWT_SECRET` is not the value the instance was first started with (it was
  changed, or the instance moved without it). Start it again with the original value.
- **File links are unreachable** — `HOST_DOMAIN` must be the URL clients actually use to
  reach the instance, including scheme and port.
- If you're still stuck, contact support with the logs and your configuration (remove
  sensitive data).
