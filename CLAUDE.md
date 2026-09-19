# UnDercontrol Docs Site (ud-docs)

Docusaurus site served at https://udctl.com — the canonical host since 2026-09-12
(epic `f02f82bb`). `oatnil.com` and `www.udctl.com` 301 to it, and so does the
worker's own `*.workers.dev` hostname (see `worker/index.js`). Deploys
automatically via Cloudflare Workers Builds on push to `main`. i18n: `en`
(default) + `zh-Hans`.

## Audience positioning (decided 2026-07-24)

**`src/pages/` is for humans. `docs/` is for agents.**

- `src/pages/` — marketing and tool pages with full React interactivity
  (`/self-hosting`, `/configuration`). Optimize for discovery and interaction.
  i18n for TSX pages: `<Translate>` ids resolved in `i18n/zh-Hans/code.json`, or
  single-file `{en, zh}` string maps switched on `i18n.currentLocale`
  (see `src/pages/configuration.tsx`) — no page mirror files.
- `docs/` — plain, structured markdown with stable URLs. AI agents consume these
  as raw text (the homepage agent-setup prompt flow fetches
  `https://udctl.com/agent-setup/prompt.md`, served as `text/markdown` from
  `static/`), so keep them machine-readable: no React components, no visual
  tricks, facts stated plainly. The rendered HTML is a byproduct for human readers.
  ZH mirrors live in `i18n/zh-Hans/docusaurus-plugin-content-docs/current/` and
  must stay in sync with the EN file.
- The same fact often appears on both surfaces (e.g. env vars on `/configuration`
  and in `docs/self-deployment.md`) — when you change one, check the other.

## Page ownership

- Self-host/onboarding surfaces (`/self-hosting`, `/configuration`,
  `docs/self-deployment.md`) are owned by the **Onboarding Experience Owner**
  agent. The Configuration Reference (`src/pages/configuration.tsx` +
  `src/components/ConfigBuilder/`) is generated from
  `go-backend/internal/config/config.go` in the main repo — any variable
  add/rename/default change there must update the page's `REFERENCE` data and the
  ConfigBuilder banner strings in the same task.
- The homepage "Fetch <url>" agent-setup prompt's source of truth is
  `static/agent-setup/prompt.md`. It has no mirror: `src/pages/index.tsx` only
  holds the URL that points at it, and the main repo's `ud-vite-app` home page
  dropped its copy when `/home` became a single screen. Edit the static file.

## Conventions

- The product name is **UnDercontrol** (capital U and D). It is proprietary —
  never describe it as open-source.
- Verify changes with `npm run build` (builds both locales; broken links fail
  the build). Pre-existing broken-anchor warnings on `/privacy`,
  `/self-hosting`, `/` and their `/zh-Hans/` twins are known.
  Docusaurus cannot enumerate anchors on TSX pages, so **any** link into
  `/configuration#<id>` or `/self-hosting#<id>` is reported broken even when the
  `id` really is in the emitted HTML (check with
  `grep 'id="<id>"' build/configuration/index.html` before believing the
  warning). `docs/self-deployment.md` deep-links `#telegram_bot_token` this way.
- Commit messages: `[<task-id-prefix>] <type>(<scope>): <message>`.

## IndexNow (Bing side of "did the crawler see the change")

`.github/workflows/indexnow.yml` runs on every push to `main` that touches
content: full-depth checkout, `npm run build`, wait until udctl.com serves the
sitemap that build produced, then `scripts/indexnow.mjs` POSTs every sitemap URL whose
`<lastmod>` is on or after the push's oldest commit date. The key is
`static/<key>.txt` (public by design; the file's presence is the proof of
ownership). `npm run indexnow` is a dry run against the live sitemaps. Google
ignores IndexNow; it still reads the sitemap. Card `df4fe865`.
