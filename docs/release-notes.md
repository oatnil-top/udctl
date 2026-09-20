---
title: Release Notes
description: Complete version history and changelog for udctl
sidebar_position: 1
---

# Release Notes

<!--
  DO NOT REWORD THE UPGRADE-NOTES OR DESKTOP-APP LINES OF v0.143.0 WITHOUT READING ud card e011a9aa.

  These exact byte strings are referenced by a release-verification criterion that greps the
  deployed bundle for them:
    must be PRESENT : `00078_agent_cli_extra_options`
                      `Back up your database before upgrading` (en) / `升级前请先备份数据库` (zh)
    must be ABSENT  : `No new database migrations` (en) / `没有新增数据库迁移` (zh)
                      `not published in this release` (en) / `这一版不发布` (zh)

  Reword any of them and the check returns zero hits -- which looks exactly like "it passed".
  The card carries the positive control that distinguishes the two.
-->

## Unreleased

Merged to `main`, not in any published build yet. These ship with the next version.

<!--
  READ THIS BEFORE WRITING THE NEXT RELEASE NOTE.  (ud card 2b308cff)

  Why this section exists: a user-visible consequence can be invisible in the commit title
  that carries it. `fix(cli): ud get comments ... real pagination` is completely honest and
  you still cannot read "the default page size changed" off it. So the consequence gets
  written here, by whoever made the change, while the knowledge still exists.

  Rules for whoever writes the next release (release skill, Phase 2 Step 0):
    1. Fold every bullet below into the new `## vX.Y.Z` section -- in this file AND in
       i18n/zh-Hans/docusaurus-plugin-content-docs/current/release-notes.md.
    2. Do NOT re-derive the wording from the commit titles. That is the exact failure this
       section exists to stop.
    3. Then leave the section here with no bullets under it. Deleting the section is how it
       stops being read.

  (Nothing owed right now: every bullet that was listed here was folded into v0.151.0.)
-->


## v0.156.0 (2026-09-21)

### New Features

- **`ud find` — one command that answers "which command do I use to find X".** It maps what you are looking for (a task, a note, a comment, a skill, an agent, a board) onto the command that finds it, and for each one it also names what that command does **not** return — so an empty result is no longer ambiguous between "there is none" and "you asked the wrong command".
- **A scheduled calendar block can be deleted, or moved to a different task, from the block itself.** Click a block on the calendar: the peek now carries a delete button and a re-bind control, so re-planning no longer means deleting the block and building a new one.
- **Deleting a folder now deletes what is inside it.** It used to dissolve the folder and move its contents up one level. Now the server deletes the whole subtree, and before it does, a confirmation names how many items will go and warns that anything without a recycle bin — resources, diagrams — is deleted permanently. Cancel changes nothing. Tasks go to the recycle bin and can be restored.
- **Desktop: every tab keeps its own page history, with back and forward buttons.** Navigating inside a tab no longer costs you the way back.
- **Desktop navigation is one level flatter.** The Runtime group is gone; CLI, Workspace Prompts and Daemons are top-level tabs.
- **The agent detail page was rebuilt around a single Edit switch.** Sections read as plain text until you press Edit, which flips the whole page into edit mode at once, instead of each field carrying its own editor.

### Improvements

- **Agent principles are an ordinary agent field now.** They are edited with everything else on the agent page, `ud apply` writes them (on create as well as on update), `ud describe agent -o apply` round-trips them, and every change is recorded as an `agent.updated` audit event that is kept forever.
- **`ud apply` writes every document in a multi-document file, not only the first.** A file holding several documents used to write the first one and pour the rest into its body.
- **`ud apply` can clear tags.** An empty tag list now reaches the server, and the echo reports the cleared state.
- **`ud describe task` ends by saying how many comment threads the task has**, so "this task has no comments" and "I did not show you its comments" stop looking the same.
- **Writing metadata no longer echoes back a result nobody verified.** A key that does not exist is an error at the call site instead of a success line, and a delete really deletes. `--set cf.points=...` is refused by name and points you at `ud.points`.
- **Table output truncates by display width.** A column cut through the middle of a wide character used to make a grep over the whole output find nothing — which reads exactly like a miss.
- **`--column todo` matches a column named "To Do".** The example in the command's own help no longer fails when you copy it.
- **`ud cook` recipes and the `--help` examples were checked by running them**, each on a board the recipe itself names.
- **Expired rows in the account switcher say so, and prefill the login form.** Switching to a session whose token has expired used to look like an ordinary switch.
- **Calendar quick-create waits until you stop typing (3 seconds) before asking the backend**, and searches the whole local cache in the meantime.
- **Calendar block colors follow live task status.** Change a status and the block repaints immediately, over a new set of attention colors.
- **A screenshot pasted into a comment box is re-encoded before upload**, so pasting one costs a fraction of what it did.
- **Budget: adding a plan resolves overlaps with the plans already there, and period totals accrue per period.**
- **Desktop task detail: click the description heading to collapse the whole section.**
- **The contact page points at a Telegram group** instead of Discord.
- **The product reads as `udctl`** in the browser title, the login and onboarding screens, and About.

### Bug Fixes

- **Mermaid arrowheads no longer disappear when a page holds more than one diagram.** Marker ids are scoped per diagram, so an arrowhead can no longer resolve against a hidden one.
- **A folder delete that fails no longer reports success.** The tree is put back from the pre-delete snapshot and the failure is shown; deleting explorer items reports which ids failed instead of throwing.
- **Creating an agent keeps the principles you gave it.** They were dropped silently on create.
- **The agent pages no longer serve stale data**, and a save that would overwrite somebody else's concurrent edit is stopped before it lands.
- **Frontmatter unquoting strips the quotes**, rather than trimming characters out of the content.
- **Self-hosted: `/health` really reads the database now**, and the SQLite connection pool gained two guards.

### Upgrade Notes (self-hosted)

- **Back up your database before upgrading.** Two migrations run on first boot and both of them drop something. `00090_drop_agent_cli_user_set` clears machine-guessed CLI picks and then removes the `agent_cli_user_set` column from `agent_configs`. `00091_drop_agent_principles_revisions` drops the `agent_principles_revisions` table with every row in it; the principles values themselves live on the agent and are not affected, but the change journal is gone. Rolling either one back restores the shape, not the data.
- **Two API endpoints were retired.** `PUT /api/v1/agents/:id/principles` and `GET /api/v1/agents/:id/principles-history` no longer exist; principles are written through `PUT /api/v1/agents/:id`, and the CLI's `--principles-history` flag went with them. Anything scripted against those two paths needs changing.
- **Deleting a folder changed meaning.** It used to move the folder's contents up one level; it now deletes them. Resources and diagrams have no recycle bin, so for those it is permanent.
- No new configuration settings, and no settings removed.

CLI upgrades are yours to run: publishing a release does not change the `ud` on anybody's machine. There are three routes — **take only one**.

```bash
npm i -g @oatnil/ud # installed via npm
brew update && brew upgrade ud # installed via Homebrew
```

**If your `ud` came from the desktop app, neither line above is your route — install the new desktop app instead.** The app's "Install ud CLI" makes `/usr/local/bin/ud` a symlink into the app bundle, so the `ud` you run is the one the app ships.

Then confirm it took: `ud --version` must print `udctl version 0.156.0`.

---

## v0.155.0 (2026-09-15)

### New Features

- **Agents can carry principles — a short set of red lines re-injected into every prompt they receive.** Each agent now has a `principles` field, capped at 200 characters. Whatever you write there is appended to the end of every prompt that agent is sent, so it is re-read on every delivery rather than once at the top of a long session. Keep it to the one or two lines that matter most; the editor warns you as it gets long, because shorter principles are re-read more reliably.
- **Only the agent's owner can change them, and every change needs a reason.** The principles editor lives on the agent's detail page in the web app. Saving a change requires a one-line change note, and the full history — who changed it, when, and why — is readable from the same dialog under **Change history**.
- **The same field from the CLI.** `ud describe agent <name>` shows an agent's principles, `ud describe agent <name> -o prompt` renders them inside the prompt the agent actually receives, and `ud describe agent <name> --principles-history` prints the change journal.
- **A delivery says what happened to the principles.** Every prompt delivery records whether the principles were injected, were empty, or could not be fetched. A failure to read them does **not** block the prompt — the agent still gets its message, and the failure is recorded rather than turned into an outage.

### Improvements

- **`ud explain agent` marks read-only fields as read-only.** Fields the server owns and refuses to accept from a write — `principles` among them — now render as read-only in `ud explain`, so a field you cannot set no longer looks like one you forgot to set.
- **A self-hosted instance whose object storage falls back now says so, loudly.** When the configured storage class cannot be resolved, the server falls back to the storage built from its startup `--s3-*` flags. Two of the three places this happens logged a warning that named the failure but not the consequence, and the third logged nothing at all. All three now log `BLOB_FALLBACK_USED` at error level with the reason and a running count. This matters during a storage migration: serving from the old bucket looks exactly like serving from the new one, until the old bucket is deleted.

### Upgrade Notes (self-hosted)

- **Back up your database before upgrading.** Two migrations run on first boot: `00088_add_principles_to_agent_configs` and `00089_create_agent_principles_revisions`.
- **The built-in `alfred` agent ships with seed principles, and a seed only reaches a newly created agent.** An instance that already created its built-in agents will find `alfred`'s principles empty after this upgrade — that is expected, not a failed migration. Set them from the agent's detail page if you want them. No other built-in agent carries seed principles.
- No new configuration settings, and no settings removed.

CLI upgrades are yours to run: publishing a release does not change the `ud` on anybody's machine. There are three routes — **take only one**.

```bash
npm i -g @oatnil/ud # installed via npm
brew update && brew upgrade ud # installed via Homebrew
```

**If your `ud` came from the desktop app, neither line above is your route — install the new desktop app instead.** The app's "Install ud CLI" makes `/usr/local/bin/ud` a symlink into the app bundle, so the `ud` you run is the one the app ships.

Then confirm it took: `ud --version` must print `udctl version 0.155.0`.

---

## v0.154.0 (2026-09-15)

### New Features

- **A daily free AI quota, so one user cannot drain the instance's shared AI providers.** Every user now gets a number of free AI calls per UTC day on the AI providers the instance shares — **10 by default**. Calls made on a user's own API key are never counted. An audio capture costs 2 (it is two AI calls under the hood). When the limit is reached, chat requests fail with a quota message instead of a generic error, and the AI quick-create dialog shows how many calls are left today.
- **A quick capture refused for quota now tells you, instead of vanishing.** Quick capture answers "queued" before the chargeable AI call happens, so a quota refusal used to leave you with a success receipt and silence: no task in Explorer, no bell, no toast. Each refused capture now raises a For You bell notification that echoes the text you captured, so the note itself is not lost. The item also shows as **Failed** under Queue Tasks.
- **Self-hosted admins are warned before the license expires.** An expired license makes the server **refuse to start** — it does not downgrade — so a daily sweep now warns this instance's own admins at 60, 30, 7 and 1 days left, in the For You panel. The warning says how long is left, that the server will refuse to start, and where to get a new license. A band crossed on a day the instance was off still fires on the next run, and renewing the license resets the warnings.
- **See what AI is being spent.** `GET /ai/usage` reports your own used / limit / reset time; `GET /ai/admin/usage` aggregates usage per user, per UTC day, per capability and per provider.

### Improvements

- **`ud --help` is 21 lines instead of 94.** The full grouped command tree moved to a new `ud commands`, which root help points at. Four commands that had been falling silently into cobra's "Additional Commands" bucket — `sprint`, `subscribe`, `unsubscribe`, `migrate-layout` — now sit in real groups, so reaching `ud sprint close` from `ud --help` takes three calls.
- **Quick capture routes carry a 20/minute per-IP throttle**, an anti-spam floor underneath the daily quota.

### Bug Fixes

- **An image pasted into a dataflow diagram now renders before you save.** Images in a saved diagram resolve through a diagram-scoped endpoint that refuses anything the saved content does not yet reference — and a freshly pasted image is not referenced until you save, so it showed "Image not accessible".

### Upgrade Notes (self-hosted)

- **Back up your database before upgrading.** Two migrations run on first boot: `00086_create_ai_usage` and `00087_add_license_expiry_notices`.
- **New setting `AI_DAILY_FREE_QUOTA` (flag: `--ai-daily-free-quota`), default `10`** — free AI calls per user per UTC day on the instance's shared AI providers. **`0` means zero quota: every shared-provider AI call is refused. `-1` means unlimited.** Those two read backwards from most settings, so set it deliberately. Leaving it unset gives every user 10 calls a day, where earlier versions placed no limit at all.

CLI upgrades are yours to run: publishing a release does not change the `ud` on anybody's machine. There are three routes — **take only one**.

```bash
npm i -g @oatnil/ud # installed via npm
brew update && brew upgrade ud # installed via Homebrew
```

**If your `ud` came from the desktop app, neither line above is your route — install the new desktop app instead.** The app's "Install ud CLI" makes `/usr/local/bin/ud` a symlink into the app bundle, so the `ud` you run is the one the app ships.

Then confirm it took: `ud --version` must print `udctl version 0.154.0`.

---

## v0.153.0 (2026-09-14)

### New Features

- **Skill packages: install a skill with everything it needs, and publish it back.** `ud describe skill <name> --dir` installs the whole package into `~/.claude/skills/<name>/` — the skill's body plus every script, template and reference file attached to it. `ud apply -f ~/.claude/skills/<name>` publishes the directory back; the directory is the identity, so there is no name to pass. `--dry-run` lists what would change first, including the files at the skill's path a publish leaves alone.
- **Videos posted into a conversation play where they are.** A video attached to a session or a comment now renders a player inline. It used to fall through to a download link, which for a video is not a viewer at all: object storage returns `content-disposition: attachment` for every file, so clicking it saved the video instead of playing it.

### Improvements

- **`ud sprint close` no longer sweeps unfinished cards away without being asked.** A bare close used to move every unfinished member to the backlog with no prompt. Now, if the sprint still has unfinished members and you did not name a rollover target, the close is refused and every blocker is listed by id, title and status. Pass `--rollover <sprint>` or `--rollover backlog` to say where they go. A sprint whose members are all done still closes with no rollover. The gate lives in the server, so the desktop app is covered too.
- **The in-app Quick Start was rewritten against the current product**, with every command on the page actually run.

### Bug Fixes

- **A date filter carrying a timezone offset returned the wrong rows.** `>= '2026-08-31T00:00:00+08:00'` was compared as though it said 00:00 UTC, so rows inside the gap went missing with no error. Measured on production: 585 rows came back where the same instant spelled `Z` returned 594. Offsets are now respected everywhere a datetime reaches SQL.
- **Uploading an iPhone screenshot no longer fails.** iOS writes an invisible narrow no-break space into the filename, and the storage gateway refused the resulting key with a 400, which surfaced as a 500 on upload. Keys are now normalised where they are minted. Files already stored are untouched, and the filename you see is still your own.
- **`ud apply` with unterminated frontmatter now fails instead of creating a junk card.** A missing closing `---` was read as "no frontmatter at all", so the whole block fell into the body, an intended update became a create, and the new card was titled `---` — reported with the same `Task created:` line as a success.
- **`ud apply -f <directory> <name>` refuses instead of silently dropping the name.**

### Upgrade Notes (self-hosted)

- **No schema changes in this release** — nothing runs against your database.
- **No new environment variables.**

Upgrading the CLI is something you do yourself: publishing a release does not change the `ud` on anyone's machine. There are three routes and you should use exactly one.

```bash
npm i -g @oatnil/ud            # installed via npm
brew update && brew upgrade ud # installed via Homebrew
```

**If you got `ud` from the desktop app, neither of those is your route — install the new desktop app instead.** Its "Install ud CLI" makes `/usr/local/bin/ud` a symlink into the app bundle, so the `ud` you run is the one shipped inside the app.

Then check it took: `ud --version` must print `udctl version 0.153.0`.

---

## v0.152.0 (2026-09-12)

### Desktop app

- **macOS no longer shows "Support Ending for Intel-based Apps" when you open UnDercontrol.** Each package now contains only the binaries for its own architecture instead of every platform's. Measured against v0.151.0's published packages: the macOS arm64 disk image went from **229,652,351 to 148,858,229 bytes (−77.05 MiB, −35.18%)**, macOS x64 from **237,379,681 to 159,484,547 (−74.29 MiB, −32.81%)**, and the Windows installer from **184,956,101 to 128,508,034 (−53.83 MiB, −30.52%)**. Nothing you use is missing from them: the packages were carrying other platforms' binaries, not extra features.

### Improvements

- **The calendar can colour events by layer or by status.** A new colour-mode control switches between the two; by layer stays the default. In status mode a completed task keeps its own colour rather than falling back to the grey that `todo` uses, so "done" and "not started" are no longer the same colour.
- **The product now says what an empty `status` means.** An empty status marks a document rather than a task — that has always been true, and nothing in the product ever said it. It is now written in `ud explain`, `ud apply --help`, the operator reference in `ud query help`, the CLI's own help text, the natural-language query prompt, the in-app documentation in both languages, and the AI chat tool schema.
- **The built-in `ud-guide` skill reads the product instead of remembering it.** Every agent reads this skill when a session starts. It carried 11 worked command examples; replayed against the current product, **all 11 were wrong** — they described shapes the product no longer has. They are gone, and what replaces them is how to ask the product for the current shape. The skill went from 640 lines to 300, and adds no new mechanism of its own.

### Bug Fixes

- **`ud describe comment` with an 8-character short ID returns the thread's replies.** The short ID resolved to the right comment and the reply lookup then used the short form again, so the thread came back with its root and nothing else. Every `on_mention` wake-up sends a short ID, so every agent wake-up had been hitting this.
- **`ud apply` given a YAML manifest no longer creates a blank card.** A document with `apiVersion:` / `kind:` that reached the markdown path used to be read as a task with no title, which silently created an empty card and reported success — so a typo in a file extension produced junk that looked like a successful apply. It now refuses with an error naming the problem.
- **Waking an agent no longer tells it to overwrite the card's body.** The wake-up prompt's "update the task" template carried a `<brief description>` line alongside the title, so an agent that followed the instruction it was given rewrote the description of the very card it had just been dispatched on. The template now sets the title only and leaves the body exactly as it was.

### Upgrade Notes (self-hosted)

- **No schema changes in this release** — nothing runs against your database.
- **No new environment variables.**

⚠️ **Upgrading the CLI is something you do yourself — publishing a release does not change the `ud` on anyone's machine.** There are three routes and you should use exactly one:

```bash
npm i -g @oatnil/ud            # installed via npm
brew update && brew upgrade ud # installed via Homebrew
```

**If you got `ud` from the desktop app, neither of those is your route — install the new desktop app instead.** The app's "Install ud CLI" makes `/usr/local/bin/ud` a symlink into the app bundle, so the `ud` you run *is* the one shipped inside the app, and replacing the app upgrades it.

🔴 **This release matters more than usual for whichever `ud` is first on your `PATH`.** The `ud-guide` rewrite above is read by your agents out of the CLI binary they run, so an agent keeps reading the old, wrong examples until that specific binary is replaced. A Homebrew-installed `/opt/homebrew/bin/ud` is a real file, not a link into the app — it changes only when you run `brew upgrade`, and upgrading the desktop app does not touch it. If `/opt/homebrew/bin` comes before `/usr/local/bin` on your `PATH`, upgrading only the app leaves your agents on the old guide **with nothing to tell you**: the version number updates elsewhere, the daemon is online, commands answer normally, and the content is stale.

Then check it took: `ud --version` must print `udctl version 0.152.0`.

---

## v0.151.0 (2026-09-12)

### The product is now called udctl

- **UnDercontrol is now udctl** (lower case everywhere, including at the start of a sentence — like `kubectl`). This release carries the rename across the CLI: `ud --version` now prints `udctl version 0.151.0`, and the help text, README and npm description use the new name. The desktop app and the docs site are moving with it.
- **The command has not changed.** `ud` is still `ud`, the npm package is still `@oatnil/ud`, the config directory and context format are untouched, and nothing you have scripted needs editing. The Homebrew formula additionally installs `udctl` as a second name for the same binary, so either one works.

### Security

- **A failed Telegram send no longer puts the bot token into the log.** When the transport call failed, the error it built embedded the full bot token, so the token reached the server log — and therefore `docker logs` — in plain text, enough for anyone who can read the logs to take the bot over. The token is redacted before the error is constructed. **If your instance has been running a Telegram bot, treat any token that has appeared in your existing logs as exposed and re-issue it through BotFather.**

### Improvements

- **`ud get comments --task <id>` hides resolved threads by default.** Filtering selects whole threads, so a matching root always arrives with all of its replies. Add `--all` (or `--status all`) to include closed threads, or pick one with `--status open|resolved|annotated|unresolved`. The listing does not say how many it left out, so a task whose threads are all closed looks the same as one with no comments.
- `ud get comments` (without `--task`) now pages: `--all`, `--limit` and `--page` take effect, and the default page size is 20 instead of 50.
- **`ud whoami`'s `User:` line reports the credential actually in use**, instead of whatever the config file happened to say. A delegated token also prints an `acting for` line, so acting on someone else's behalf is visible rather than implied.
- **The calendar downloads far less to draw the same grid.** Its window query now asks for a lite row projection that leaves out task bodies, notes and share links: on one real account and window a page went from 1,619,762 B to 41,959 B — 38.6× smaller. Rows fetched this way no longer overwrite a task body already in the cache.
- **Instant events on the calendar render on two lines**, so the time no longer squeezes the title out.

### Bug Fixes

- **Opening a task's edit drawer and saving without changing anything could erase the task body.** The explorer tree seeded the cache with an empty description for tasks whose body it had not fetched — indistinguishable from a body that really is empty — and the editor loaded that empty value, so the save wrote it back. Observed on a task losing 1,848 characters. Both the write path and the rows already in browsers are fixed; see Upgrade Notes below.
- **Pagination no longer reports a page count it did not honour.** Asking for more than the maximum silently fell back to 50 items while still reporting `totalPages: 1`.
- **Short-ID resolution is no longer confined to the most recent page of comments.**
- **Search trims whitespace from the query.** A title that plainly contained the text could not be found if the query carried a stray space. Fixed in the web app, the backend and the Explorer.
- **A single-character bold no longer swallows the rest of the line.** `**a**` followed by more `**` on the same line used to bold everything up to the last one. Fixed in the web app and the desktop app.
- **The calendar's "scheduled" wording matches what it draws.** Scheduled means a task has a scheduled slot; one carrying only a deadline is not scheduled. The marker that claimed otherwise was removed rather than re-pointed: the list it lived on has no slot data to answer the question.

### Upgrade Notes (self-hosted)

- **No schema changes in this release** — nothing runs against your database.
- **The browser task cache is cleared once, on first load after upgrading.** The body-erasure fix above cannot repair rows already stored in a browser, so the persisted cache version was raised; that discards the stored task rows and keeps your preferences. The only visible effect is that the first screen after the upgrade is not instant.
- **Telegram bot tokens** — see the Security note above. Re-issue any token that has been in your logs.

⚠️ **Upgrading the CLI is something you do yourself — publishing a release does not change the `ud` on anyone's machine.** Whichever way you installed it:

```bash
npm i -g @oatnil/ud            # installed via npm
brew update && brew upgrade ud # installed via Homebrew (also gets you the new `udctl` name)
```

**If you got `ud` from the desktop app, neither of those is your route — install the new desktop app instead.** The app's "Install ud CLI" makes `/usr/local/bin/ud` a symlink into the app bundle, so the `ud` you run *is* the one shipped inside the app, and replacing the app upgrades it. Running `npm i -g` on top of that installs a second, separate `ud`, and which one you get then depends on your `PATH`.

**Use one of the three routes, not two.** Then check it took: `ud --version` must print `udctl version 0.151.0`. An `ud` that is months old keeps working and keeps reproducing bugs this release fixed, with nothing to tell you it is behind.

---

## v0.150.0 (2026-09-11)

### New Features

- **A task can now occupy several time blocks on the calendar.** The calendar's *by schedule* view draws **scheduled slots** instead of a task's kickoff and deadline dates. Drag on empty space to create a slot, drag a block to move it, drag its edge to resize it — each of those writes a slot, so one task can appear as several blocks. The Agenda view shows slots too, and the all-day row now renders only when something is actually in it.
- **A Schedule section on the task detail page**, below the deadline: every slot the task has, with past slots collapsed into one line carrying their count and total duration. The same section appears in the kanban card preview.
- **Calendar layers now carry slots.** Each enabled layer fetches its own slots and tags them, so a block shows which layer it came from, and layer colours come from a fixed slot per layer rather than the layer's position in the list.

### Bug Fixes

- The ＋ buttons in the calendar's *by schedule* view (header, sidebar and mobile) created a task that then did not appear on the calendar — they wrote the wrong date column. A card created with ＋ now shows up where you created it.

### Removed

- The **Sprints** layer has been removed from the calendar.

### Upgrade Notes (self-hosted)

- Back up your database before upgrading. This release adds migration `00085_create_task_slots`: one new `task_slots` table plus two indexes, applied automatically at startup on both SQLite and PostgreSQL. No existing table is altered.
- **Existing kickoff and deadline dates are not converted into slots.** On an upgraded instance the *by schedule* view starts empty and fills as slots are created — that is deliberate, not a failed migration.
- No new environment variables are required.

---

## v0.149.0 (2026-09-08)

### New Features

- **`SystemConfigList` — read and apply an instance's whole configuration as one document.** `ud get systemconfiglist` exports every setting the instance has; `ud apply` writes a document back. This is its first public release, so there is nothing existing to migrate — the names below are simply what the resource ships as.
  - Fields: `forServer` (top level, **required** — it names the machine the document is for), and per entry `setBy` (`default` | `env` | `admin`), `settableFrom` (`boot-only` | `env-or-admin` | `admin-only`), `readOnly`, `envVar`, `valueType`, `valueMasked`.
  - Four refusals, each meaning something different for a script: `CONFIG_ENVELOPE_INVALID` (400 — not a SystemConfigList, or `forServer` missing), `CONFIG_SERVER_MISMATCH` (400 — the document names another machine; you are pointed at the wrong instance), `CONFIG_UNKNOWN_FIELD` (400 — a key or field nobody declares, refused by name rather than silently dropped), and `CONFIG_READONLY_FIELD` (**409**, not 400 — a read-only field differs from this machine, so the whole document is refused and nothing is written; the same bytes are a 200 on the box they came from).
- **Search titles only.** `searchIn=title` on the task list restricts matching to titles instead of all content.
- **Capture plain text.** `POST /quick-capture/text` puts a text note into the quick-capture queue with the same three landings as the other capture types.
- **Dataflow diagrams:** group nodes can be collapsed and connected, and the read-only viewer now draws its edges.

### Improvements

- The account menu's current-account row always names its server, so it is obvious which instance you are on.
- `brew install ud` works again — the Homebrew formula had been left far behind and every download URL in it was a 404.
- Onboarding records what you said about Alfred and only seeds his routines if you asked for them; instances that were seeded without asking have those retracted, and anyone who had linked a messenger keeps theirs.

### Bug Fixes

- Sign-up no longer reveals whether an email address is already registered.
- Share links now follow the account's own server instead of a loopback default, so a copied link works for the person you send it to.
- Search no longer breaks on `%` and `_` in the search text.
- The `ud` CLI's `--context` is honoured by the background daemon instead of being replaced by whatever the environment names.
- npm, `.deb` and the CLI's own metadata no longer link to a repository nobody can open.

### Removed

- The standalone income and expense pages are gone; Transactions is the one list.
- The calendar's "Remove from calendar" link and its ⌫/⌦ shortcut are gone.

### Upgrade Notes (self-hosted)

- Back up your database before upgrading. This release adds migration `00084`, which retracts the Alfred hygiene routines from instances that were seeded without being asked; anyone who had linked a messenger keeps theirs.
- No new environment variables are required.

## v0.148.1 (2026-09-06)

### Correction to the v0.148.0 notes

- **v0.148.0 said "signing out and back in could leave the app fully rendered but empty" was fixed. That fix was real but for a different defect.** The case people actually hit — the profile page and every panel empty after signing in, on a server address that starts with `http://` — was caused by the server redirecting to `https://`, and it is fixed only in this release (see the first bug fix below).

### Bug Fixes

- **Empty app after signing in when the server address uses `http://` and the server answers with a redirect to `https://`.** A change of scheme is a change of origin, and on a cross-origin redirect the browser drops the `Authorization` header — so sign-in succeeded (token in the body) while every other request reached the server anonymous, and the app rendered from its caches with every panel blank. The client now re-issues such a request once at the final address and rewrites its saved server address to the `https://` origin so it does not happen again. Desktop app: this is a frontend fix, so the installed app gets it with the next desktop release — until then, set Settings → Backend URL to the `https://` address.
- **"Failed to create board" for a shared board that was in fact created.** Creating a shared board makes you a member of its group, which invalidates your existing sign-in as a security measure; the refreshed sign-in minted in the same second was refused too. Tokens are now minted past that cut-over.
- **A fresh board's two default columns showed "No tasks".** Their query is only an `ORDER BY`, and the board's own tag filter was appended after it, which the server rejected as an invalid query. The filter now lands before the `ORDER BY`.
- **A group that backs a board can no longer be deleted from the Groups page** (the delete button is hidden, and the server refuses with `GROUP_BACKS_BOARD`). Deleting the board removes its group; deleting the group alone used to leave an orphan board nobody could list. Reading a group you are not a member of now answers 404, the same as the board endpoints, instead of 403.
- **Kanban: you are told before being bounced.** Losing access to a board says "This board is no longer available" before falling back to All Tasks, and a member who signs back in lands on their board rather than being told it is gone. When a sign-in expires, the login page says so inline and returns you to the page you were on after signing in. Leaving a group refreshes your sign-in like joining one does.
- **Group invite page: an invalid link is described as expired or revoked**, not "already used" — invite links are multi-use. The members table no longer overlaps or overflows on a long e-mail-shaped username at 1280px.

### Improvements

- **Explorer: "Open in new tab" on a task row's context menu** — an in-app tab on the desktop, a browser tab on the web.
- **The dataflow preview page lays out like the resource detail page**: same header position, same stage padding and ground.

### Removed

- **The status-changes feed on task detail** (desktop and web).
- **The kanban list view, the activity heatmap and the dashboard page.** `/kanban/<board>/list`, `/tasks` and `/dashboard` redirect to the board.

### Upgrade Notes (self-hosted)

- **No new database migrations.** `goose_db_version` stays at 83.
- **No new environment variables.**
- **Both images change.** The backend carries the sign-in and group fixes; the frontend carries the rest. Pull both.
- **Building the all-in-one image from source still needs `ud-dataflow-diagram` checked out beside the monorepo**, at the commit named in `ud-vite-app/ud-dataflow-diagram.lock` (unchanged, `2537eba`).

---

## v0.148.0 (2026-09-06)

### New Features

- **Saved accounts now work across servers.** A saved account remembers which backend it belongs to, so the same person on `api.oatnil.com` and on a self-hosted instance is two entries instead of one silently overwriting the other. Switching to an entry moves the app to that server and signs you in there. The login page, the sidebar switcher and Settings → Saved Accounts show the server under an entry only when it could be misread — when the entries span more than one server, or one of them is not the server the app is on right now. Web app and desktop app alike.

### Improvements

- **A switch is checked with the server before the app reloads.** If the server rejects the saved sign-in, the entry is removed and you are told the session expired; if the server cannot be reached, the entry is kept and the server's own error is shown. Either way you land on the login page already pointed at that server, so signing in again goes to the right place.
- **Desktop: the built-in backend is no longer listed as a saved account.** It is a server choice (Settings → Backend URL), not an account to switch to — its port is chosen at launch, and a stale entry could have pointed the app at a port nothing listens on. The mobile app already follows this rule.

### Bug Fixes

- **Desktop: Sign out is always on the settings page.** It was hidden on the desktop on the reasoning that the personal account signs itself in — but in a half-dead session (the app renders with every panel empty) it was the last control that could clear the state, and hiding it left no way out short of clearing app data.
- **Desktop: signing out and back in could leave the app fully rendered but empty**, every request going out without a sign-in. Several desktop windows share one sign-in but each kept its own copy; every request now reads the shared one, so a login in any window heals all of them and a sign-out disarms all of them.
- **A server answering an unexpected shape no longer takes the whole app to "Something went wrong".** Lists — daemons, agents, sessions, linked providers, API keys — treat a non-list answer as an empty list, and a bad value already cached in the browser is repaired on the next load instead of crashing on every load until "Clear Cache & Login".
- **Desktop: a sign-in refresh finishing in one window after an account switch in another no longer undoes the switch.**

### Upgrade Notes (self-hosted)

- **No new database migrations.** `goose_db_version` stays at 83.
- **No new environment variables.**
- **Nothing in this release changes the backend.** Every change is in the web frontend and the desktop app; the backend image is republished under the new tag unchanged. Pulling the published image needs nothing.
- **Desktop: saved accounts from earlier versions are kept** and treated as belonging to the server the app is pointed at the first time this version opens. If one of them stops working after the upgrade, remove it from the list and sign in again.
- **Building the all-in-one image from source still needs `ud-dataflow-diagram` checked out beside the monorepo**, at the commit named in `ud-vite-app/ud-dataflow-diagram.lock` (unchanged, `2537eba`).

---

## v0.147.0 (2026-09-05)

### New Features

- **Presentations: create and edit `.bento.html` decks inside the app.** "New Presentation" sits in the explorer's context menu and in a task's attachments, starting from a pinned official shell. `⌘S` saves back to the same resource instead of downloading a copy, and a deck previews in the sandbox with its own Presentation icon. The deck runs in an opaque-origin frame with scripts but no same-origin access, so it cannot reach your session; a save that cannot cleanly strip the editor bridge back out is refused rather than written.
- **Dataflow: AI Collaborate is a right-side dock.** It folds, remembers that you folded it, and keeps your draft. The DSL grows icon and group verbs — structure is sayable, geometry never is — with a chunked prompt dropdown and a worked example. Pipes take route anchors that persist (drag a section, click a dot to add, double-click to remove) alongside an orthogonal auto-router, grid arrange joins the selection bar, and whole-file import (JSON, or a diagram embedded in a PNG) sits beside the exports — one `Ctrl+Z` from whatever it replaced.
- **The calendar can plot tasks by when they were created or last updated.** A second axis beside Day/Week/Month: which field a task's day comes from. `schedule` (kickoff → deadline) is the calendar as it was; `created` and `updated` each plot one server-written instant and are **read-only — enforced by absence, not by refusal**. In those two there is no create button, no edit drawer and no drag: nothing renders a control it then declines to honour. Clicking still opens the peek.
- **Manage a task's tags from the calendar peek.** The tag row was read-only; it is now the control. Free text plus autocomplete, and every add and every remove writes immediately — dismissing the popover cannot lose the edit.
- **"Remove from calendar", in the peek.** It clears `kickoff` and `deadline` — the two fields that put the task on the calendar. The task itself is untouched and stays in its board column, list and tree. Five-second undo restores exactly what was cleared, and `Backspace`/`Delete` with a peek open does the same thing.
- **`Alt+C` jumps to the calendar** on the desktop app, and "Go to Calendar" is in the command palette, which is where the key is taught.
- **Comments render restrained markdown.** Line breaks, paragraph gaps, `**bold**`, `` `code` `` and flat `-` / `1.` lists. Everything outside that whitelist — italics, links, headings, tables, raw HTML — renders verbatim as text. Agent replies used to arrive as one blob with literal asterisks and backticks.
- **Tabs have a visible way to open one.** The strip now shows from a single tab and carries a `+` at its tail that cannot be scrolled away, and the desktop menu has `Window → New Tab` with the shortcut printed next to it. A detail tab shows the content's own name — the file name, the task's title — instead of the generic route word.

### Improvements

- **The resource inspector folds to the right edge, dock-style**, and the canvas actually regains the width rather than leaving it blank. The folded state survives a reload. Wide screens only; the narrow-screen accordion is untouched.
- **The lightweight editor opens in visual mode by default.** Because a visual save re-serialises the whole document, a file whose markdown the visual schema cannot represent now warns you **before** the save, with a "don't show again" option. Source-mode saves and lossless files write straight through.
- **Calendar cards that start at the same minute overlap at one pitch instead of shrinking into slivers**, each keeping a readable left strip. A week column that runs out of room draws a counted `+N` chip that lists everything on at that minute — eighteen concurrent items used to be eighteen nine-pixel slivers.
- **Fewer redundant buttons.** The explorer header drops New task and Close, and a resource's detail header drops its back button; tabs made all three redundant.
- **`ud` CLI truncation notices print to stderr, before the rows.** `ud … | head` discarded the trailing notice precisely when it mattered, and past the pipe buffer the process died before ever printing it. `-o apply` is now a clean machine-readable stream on stdout, and it warns about truncation at all, where before it truncated in silence.
- **The desktop app is called udctl** in the dock, the menu bar, About and the window title.

### Bug Fixes

- **Saving a storage-class resolution no longer wipes the backup assignment.** The backend replaces the whole row on every save and an omitted backup means "no backup", but the UI's payload had carried only the primary — so every primary change silently cleared your backup, and the Backup dropdown could never save at all while the confirm dialog kept showing it as unchanged.
- **A revoked or expired invite link no longer leaks the group.** It used to answer with the group's name, description and live member count alongside "invalid"; now an invalid token returns only that it is invalid.
- **A task created on a board keeps its original author.**
- **Bad input to the storage-class order update answers `400`, not `500`.**
- **A task filed at the explorer's root is written as `/`** rather than the empty string that means "unfiled".

### Security

- **An uploaded `.html` or `.svg` is now downloaded, never rendered inline.** Any user could upload an HTML file, attach it to a task, share that task publicly, and the download served it inline at the app's own origin — so the file's script ran as the trusted app, and on an all-in-one deployment (frontend and backend on one origin) it could read the viewer's session token out of local storage. The fix is at the single point where bytes leave, so it covers share pages, every list and gallery view and direct links, and **every upload that already exists — no migration needed**. Other text and image types preview exactly as before.
- **The sharing table gained data-layer guarantees**: the unique index now includes the resource type, and owner-consistency plus a permission whitelist are enforced where shares are written.
- **Expense shares are permission-aware on write.**

### Upgrade Notes (self-hosted)

- **This release adds one database migration.** `goose_db_version` moves 82 → 83. **Back up your database before upgrading.**
- **Migration `00083` refuses rather than repairs, by design.** It widens the unique index on `shared_resources` to `(resource_type, resource_id, shared_with_id)`, and first asserts that no `(resource_type, resource_id)` pair carries more than one owner. If one does, the migration raises an exception and **the deploy stops** — those rows are a finding for a human to look at, not a mess to auto-clean. You can check before upgrading; `0` means it will apply cleanly:

  ```sql
  SELECT COUNT(*) FROM (
    SELECT resource_type, resource_id FROM shared_resources
    GROUP BY resource_type, resource_id HAVING COUNT(DISTINCT owner_id) > 1
  ) t;
  ```

- **No new environment variables.**
- **The desktop app's user-data directory is renamed** `UnderControl` → `udctl`, once, at startup. macOS and Windows filesystems are case-insensitive, so there it is a no-op; on a case-sensitive filesystem the old directory is moved across. If you had pointed the app at a data directory nested inside the old one, that stored path is rewritten to match — an external data directory (iCloud, Dropbox) does not match and is left alone. **If the app ever starts up empty after this upgrade, your data is in the `UnderControl` directory beside the new one; move it across by hand.**
- **Building the all-in-one image from source still needs `ud-dataflow-diagram` checked out beside the monorepo**, at the commit named in `ud-vite-app/ud-dataflow-diagram.lock`, which this release moves forward to `2537eba`. **Pulling the published image needs nothing.**

---

## v0.146.0 (2026-08-31)

### New Features

- **The desktop app has tabs.** The main window keeps a strip of tabs across the top, shown once you have more than one. Click to switch, middle-click to close. Open enough and they compress (full → compact → icon) then scroll, never spilling off the window. **The tab list and the active tab survive a restart**, and the address bar mirrors the active tab both ways.
- **Desktop shortcuts.** `Cmd/Ctrl+T` opens a tab, `Ctrl+Tab` (`+Shift`) cycles, `Cmd/Ctrl+1..9` jumps to the Nth (9 = last). **`Cmd/Ctrl+W` closes the tab when you have more than one, and closes the window otherwise** — windows with no tab strip (workspace terminal, sticker, floating viewer, Alfred panel) close as they always did.
- **Right-click a tab → "Move to new window"** and it becomes a real OS window.
- **`/tabs` in the command palette** lists this window's tabs, searchable by title and path. The tab you are on is marked `current`; choosing it closes the palette instead of pretending to navigate.
- **The calendar can draw your agent sessions.** A read-only toggle lays each session onto the time grid at its real start and end. **Finished sessions are drawn, not only running ones**; a running one extends to the now-line and looks different. Click a band to jump to the task it ran on. Day and Week only; a Week column is too narrow for a name, so there the bands keep their position and lose their label.

### Improvements

- **On the desktop, `cmd/ctrl+click` and middle-click on an in-app link open a background tab instead of an OS window** — it opens behind you, your focus does not move. `shift+cmd/ctrl+click` still opens a real window. **The web app is unchanged.**
- **The "open in new tab" buttons open an in-app tab** — except when the target is the page you are on, where they open a real window. Tabs dedupe by path, so the alternative was focusing the tab you were in — a button that appears to do nothing. Unlike `cmd+click`, these switch to it.
- **Deleting from the explorer now asks only about what cannot be undone.** Tasks alone delete immediately, since a deleted task is recoverable. A resource file or a dataflow diagram in the selection still asks — those are permanent.
- **A collapsed note in a dataflow diagram no longer leaves its line behind.** Hover either end and the line and the content fade back in together. The read-only viewer also stopped painting connection handles on hover.
- **`ud-pull-push` is a built-in skill, and this is the release where it starts existing** — built-ins are compiled into the binary, so it answered `SKILL_NOT_FOUND` until now. It documents the tracking-folder workflow and which local deletions are permanent: a task `.md` is a soft delete; a note or resource file cannot be undone.
- **The two "open in new tab" buttons on a task's detail page have accessible names**, so a screen reader says what they do.

### Bug Fixes

- **Middle-clicking an in-app link never did anything, on any platform.** A middle press fires `auxclick`; the handler listened for `click`, so that branch was dead all along. It works now — and right-click is held back, so opening a context menu can no longer navigate you away.

### Upgrade Notes (self-hosted)

- **This release adds no database migrations and no new environment variables.** `goose_db_version` stays at 82, where v0.145.0 left it.
- **Tabs are desktop-only, deliberately.** A browser owns `Cmd+T` and `Cmd+W` and a page cannot take them back, so the web app is unchanged by the tab work.
- **Building the all-in-one image from source still needs `ud-dataflow-diagram` checked out beside the monorepo**, at the commit in `ud-vite-app/ud-dataflow-diagram.lock`, which this release moves forward. **Pulling the published image needs nothing.**

---

## v0.145.0 (2026-08-31)

### New Features

- **A calendar, built the way Google Calendar works.** Week, day and month views over your existing tasks — `kickoff` is the start, `deadline` is the end, and nothing new had to be stored to make it work. **Drag on empty space to create a task, drag a block to move it, drag its edge to change how long it takes.** Click one and a peek popover opens with the details; `t` jumps to today, `j`/`k` step through, `d`/`w`/`m` switch views. A now-line tracks the current time.
- **The left rail is a set of layers, and a layer is a saved query.** Each one fetches on its own and carries its own colour, so "my tasks", "this sprint" and any query you write can be switched on and off independently. Create and edit a layer from the list with `＋`. The rail collapses, and it remembers that you collapsed it.
- **Quick-create can find a task you already have.** Type in the box after painting a slot and it searches your existing tasks — pick one and it takes the slot you painted, instead of creating a duplicate.
- **On a phone the calendar is an agenda list**, with an Agenda/Day header and the same `＋` quick-create.
- **Edit a task's title and description without leaving the calendar** — the peek's Open task now sits next to a button that opens a right-hand drawer.
- **The peek's status control is a split button.** Mark done / Mark todo stays exactly where it was; the other five statuses are behind the menu next to it.

### Improvements

- **The task detail sidebar shows the card's virtual path**, so you can see where a task lives without opening the explorer.
- **Gantt shows every task on the board.** It asked for 200 and the repository handed back 100 without saying so, so a board past 100 tasks was quietly cut off. It pages now.

### Bug Fixes

- **Timed tasks are no longer drawn hours away from where you put them.** On PostgreSQL, `kickoff` and `deadline` were stored as wall-clock digits in a column that cannot hold a time zone: a task set for 09:00+08:00 came back as 09:00Z — eight hours later than the truth — and 09:00-05:00 came back as that same 09:00Z. Every timed task on the calendar was therefore off by the writer's offset. They are normalized to UTC instants at the single point every write path goes through. **SQLite instances were never affected.**
- **Reveal and move no longer fail silently on some tasks.** A path copied out of the explorer into the task cache was being copied verbatim rather than translated, which left the two disagreeing about where the task was.
- **A deleted user's session cannot mint new credentials.** Refresh now declines to issue a token for a subject with no user row.
- **The calendar's edit drawer can always be closed** — it has three ways out now — and the page no longer leaves a strip of blank space at the bottom.

### Upgrade Notes (self-hosted)

- **No new database migrations, and no new environment variables.**
- **Existing `kickoff` / `deadline` values written before this version are left as they are.** The fix changes what gets stored from now on; it does not rewrite history, and this is deliberate. If you are on PostgreSQL and an old task shows the wrong time on the calendar, re-save that task's date to correct it. PostgreSQL only — SQLite instances never had the skew.
- **Building the all-in-one image from source now needs a second repository.** The dataflow editor moved out into `ud-dataflow-diagram`, consumed as source through a Vite alias, and the image build expects it checked out beside the monorepo at the commit named in `ud-dataflow-diagram.lock`. **Pulling the published image needs nothing** — this only affects you if you build it yourself.

---

## v0.144.0 (2026-08-30)

### New Features

- **Runtime is three tabs now: Agent CLI, Prompts, Daemons.** Five stacked blocks became three pages you can aim at. **Every `section` anchor is carried over unchanged** — renaming one degrades a deep link silently, it still resolves and just lands somewhere else. Which section belongs to which tab is data, and a test asserts that every link both names a rendered section and points at the tab that owns it.
- **Clicking a node in a dataflow lights the pipes attached to it.** It is the highlight the field rows already use, **not a second one** — same 7-colour rotation, and not one colour, width, dash or shadow constant copied anywhere. A node selection and a field selection coexist.
- **You can re-add default agents you deleted.** This **could not have worked before**: a renamed agent still carried its old `builtin_key`, so minting a fresh copy hit a unique index, and the code read that violation as "someone else already made it" and returned success. The button did nothing and said nothing.

### Improvements

- **Option presets in the "View differences" dialog read as text, not as the wire format.** That field used to hand you `{"label":"Opus","args":"--model opus"}` next to a prompt diff written in English. It now reads `Opus — --model opus`, **one per line** (comma-joining ran the halves of different options together), and **"Copy my version" copies the readable form too**. Anything unparseable falls back to the raw item: ugly beats invisible on a list you read before an action with no undo.
- **Renaming an agent tells you, at that moment, when you are taking a system default's name** — and it names **the name you just typed**, not the agent's old one. (It used to be handed the original name in both directions: it type-checked, and it was confidently wrong.)
- **The agent CLI rows seeded for you are private now.** They used to be attached to your first group with read-only sharing, which put **nine rows per teammate** into everyone else's "Shared with you" — each adoptable into another group-visible copy that landed there again.

### Bug Fixes

- **Renaming a CLI no longer silently drops your account default.** The preference stored the name; after a rename the backend found neither an id nor a name, and the default was gone. It stores the row now.
- **An agent whose CLI no longer exists says so on its detail page.** The signal existed, and was documented as the thing behind that notice, but **`GET /agents/:id` never carried it** — and being `omitempty`, a missing value looked exactly like "this agent has no CLI set", so nothing was ever red.
- **A renamed agent no longer keeps privileges its name had given up.** The root-orchestrator roster and the Alfred status card read `builtin_key`, which did not move when you renamed the row. They read the name now.

### Also in this release — the agent CLI roster work

These landed on `main` after v0.143.0 shipped and reach users for the first time here.

- **One agent CLI roster.** A CLI added in settings used to go to browser `localStorage` under an id the backend never saw: launchable by hand in the Electron one-off picker, and invisible everywhere that matters — the agent form's *Runs with*, @mention dispatch, the daemon probe. The UI said "added" and meant "added to this browser". Settings writes the server catalog now, and a migration block turns each leftover local row into a real catalog row in one click — nothing auto-uploaded, nothing silently dropped.
- **Every CLI picker can add a CLI where you stand.** Pickers are reached from inside an unsaved draft (the agent form, the run dialog, board settings), so "go add one and come back" used to cost you the draft. Each now ends in **+ Add a CLI…**, which opens the catalog dialog in place and selects the row it creates. *Manage CLIs…* keeps the navigation for the rarer edit/delete/adopt trip. The agent form had no way out at all before this.
- **A way back if you deleted the default CLIs.** `POST /agent-clis/defaults/fill-missing` re-creates the ones you are missing. It **creates and never overwrites**: a slug you already have a row for is skipped, whether that row is pristine, edited or written from scratch — the way to move an existing row back to the default is the diff page, where what you lose is shown first. A slug you renamed away from **is** refilled, and your renamed row is left alone: you opted that one out, and both can coexist.
- **Your copy can see what it drifted from.** A status line under the template fields, a diff page behind it, and restore. **And the name field is editable at last** — renaming is this design's opt-out switch, and it was unreachable: the agent name input was disabled on edit and the CLI edit dialog had no slug field, while the server allowed both. The diff page shows what you **lose** before the destructive action rather than after, and puts *Copy my version* beside the button, because there is no undo.
- **You can see what would break before you delete a CLI** — `GET /agent-clis/:id/references` lists what points at it.
- **The agent page stops naming a CLI that nothing can resolve.** The fallback behaviour is unchanged — a dangling CLI still degrades to your account default and then to the built-in launch command — but a session running on the built-in default used to look identical to one running on the named CLI. And a teammate opening your agent is told what **your** spawn will do; resolving in the reader's scope would invent an outage that does not exist.
- **A teammate dispatching your agent resolves the CLI in your scope, not theirs.**
- **The run dialog's default CLI chip stops naming a CLI nobody chose**, and **the "built-in" padlock is gone** — it advertised a restriction that was never real.
- **Renaming an agent no longer breaks its scheduled wake-ups** (migration `00080` above). A job holding a name stopped resolving the instant it was used, then failed on every tick with nothing on any screen saying why.
- **Links to runtime configuration point at the runtime page.** Four of six pointed at `/workspaces` for configuration that left it on 2026-08-21, and the sections of `/agents/runtime` are named now so a link can point at one.
- **`ud` stops asking which rows are built-in** and asks which share a default's name — the same rule the web UI uses.

### Upgrade Notes (self-hosted)

⚠️ **Back up your database before upgrading.** This release carries **four new database migrations** (`00079`–`00082`, sqlite and postgres). They are applied automatically at startup and move `goose_db_version` **from 78 to 82**. **Three of them rewrite existing data:**

1. **`00079_privatize_seeded_agent_clis`** — clears `group_id` and `sharing` on `agent_clis` rows whose name is one of nine known slugs (`claude`/`codex`/`aider`/`opencode`/`gemini`/`copilot`/`qwen`/`kimi`/`pi`) and which are not the legacy system catalog. **Visible consequence: those rows disappear from other people's "Shared with you".** The prior values are kept in `agent_cli_privatize_backup_00079` and `Down` restores them exactly.
2. **`00080_wake_payload_agent_id`** — rewrites the agent **name** in `wake_agent_session` scheduled-job payloads to the agent's **user id**, so a rename stops silently breaking the job. The prior payload is kept in `wake_payload_agent_backup_00080` and `Down` restores it. **Jobs naming an agent already renamed or deleted are deliberately left alone** — there is nothing to resolve them to, and guessing would turn a job that fails loudly into one that wakes the wrong agent.
3. **`00081_drop_agent_cli_builtin`** — deletes the legacy `owner_id='system'` catalog rows and the `agent_clis.builtin` column. **It is not a plain `DROP`:** it first repoints any `agent_configs` still pointing at a system row onto that owner's own row of the same name, **then** deletes. References with no replacement are **left dangling on purpose** and render as "the CLI this agent was set to run no longer exists" on the agent page — something you can see and act on, where clearing it would silently rewrite a choice you made.
4. **`00082_drop_agent_builtin_key`** — drops `agent_configs.builtin_key`. Whether a row is a copy of a system default is decided by its **name** now, and renaming is how you opt out.

🔴 **Rolling back is not symmetric — which two you can undo, and which two you cannot:**

| Migration | Reversible? |
|---|---|
| `00079` privatize | ✅ backup table `agent_cli_privatize_backup_00079`; `Down` restores the exact prior values |
| `00080` wake payload | ✅ backup table `wake_payload_agent_backup_00080`; `Down` restores it |
| `00081` repoint | 🔴 in-place `UPDATE`; `Down` **does not restore which config pointed where** |
| `00082` drop builtin_key | 🔴 `Down` restores the column's shape, not its values; recoverable from the name only if the row was never renamed |

- `00081`'s `Down` restores the shape and the system rows' **content**, but **not which `agent_config` pointed where** — the repoint was an in-place `UPDATE`, and afterwards that fact exists nowhere.
- `00082`'s `Down` adds the column back **empty**. A wrong `builtin_key` is worse than none, because the code that read it treated it as authoritative.

⇒ **So the snapshot you take before upgrading is not insurance, it is the only way back.**

**No new environment variables.**

⚠️ **Upgrade the CLI yourself: `npm i -g @oatnil/ud`.** Nothing upgrades it for you.

---

## v0.143.0 (2026-08-29)

### New Features

- **`ud config onboarding` — the CLI now owns its own setup checklist.** One command reports every unmet need as a check row carrying the exact `next_command` that fixes it, machine-readable with `--json`. It never prompts, so a coding agent can run it, act on each row, and re-run until it exits 0. Rows marked `requires_human` — above all `ud login`, which asks for a password — are handed to you instead of being run.
- **Nothing points at a server you did not choose.** On an unconfigured machine the login command now reads `ud login --api-url <YOUR-SERVER-URL>` — a visible blank someone has to fill in — instead of quietly naming the backend we host. Running your own server is the normal path; the backend we host is a test server you may point at while trying the product, and every place that offers it now says so.

### Bug Fixes

- **The suggested login address used to 404.** The old default was `https://ud.oatnil.com`, which serves the web app and not the API, so `ud login` against it failed with `status 404`. It is gone.
- **An agent launched from the workspace now carries its own arguments.** The options-dropdown model pick reached the daemon only when the agent was started by @mention; started through "run as agent" the arguments were silently dropped. Both entrances now produce a byte-identical launch command.
- **Preset argument variants appear in one order everywhere** — API response, web UI and `ud describe` all sort them by label, so the dropdown and the CLI stop disagreeing about which is first.
- **The "no agent CLI detected" panel stopped saying something untrue.** A session does not need a detected CLI: dispatch never consults probe results, and a row pointing at an undetected command runs fine. The panel now says so and links to *Your agent CLIs* on the Runtime page.
- **The daemon-offline notice tells you where to go.** It links to the Machines page, is written in the triggering user's language, and no longer implies that a machine which was never registered will reconnect just by launching the app.
- **Deleting the legacy built-in CLI rows no longer empties the install list or the desktop probe** — both now select rows by what they can do rather than by the deprecated `builtin` flag.

### Desktop app

- Find-in-page in every window the app opens (task popups, editors, the sticker, the floating viewer), not only the main window.
- Three find-bar fixes: typing returns a result instead of leaving a masked box, Enter walks to the next match instead of circling match 1 forever, and shrinking the window no longer clips the close button off the end.
- The session status word focuses its window again, and when it cannot, it names the reason instead of doing nothing.

### Upgrade Notes (self-hosted)

⚠️ **Back up your database before upgrading.** This release carries **one new database migration** (`00078_agent_cli_extra_options`, sqlite and postgres). It is applied automatically at startup and moves `goose_db_version` **from 77 to 78**. It does three things to `agent_clis`:

1. adds an `extra_options` column — additive, defaults to empty;
2. **renames any rows that would collide** under the new uniqueness rule, by appending the first 8 characters of the row id to the name. **This step is not reversible** — nothing anywhere records the original name;
3. replaces the unique index `idx_agent_clis_group_name` with `idx_agent_clis_owner_name`, so an agent CLI name is now unique per owner rather than per group.

Step 2 only touches rows where two `agent_clis` rows share the same `(owner_id, name)`. On both instances we upgraded it renamed **0 rows** — but that is a fact about our data, not a promise about yours, which is why the backup comes first. Rolling back is not symmetric either: `goose down` recreates the old index **non-unique**, does not restore renamed names, and **drops the `extra_options` column** together with anything stored in it.

**No new environment variables.**

> *Corrected on 2026-08-29: this section first shipped saying "No new environment variables. No new database migrations." The migration half was wrong — `00078` does run. If you already upgraded without a backup, point 2 above is the part to check.*

⚠️ **Upgrade the CLI yourself: `npm i -g @oatnil/ud`.** Nothing upgrades it for you, and `ud config onboarding` only exists from this version — an older CLI answers with an unknown-command error.

---

## v0.142.0 (2026-08-27)

### New Features

- **Diagrams have their own page.** Opening a diagram — from the explorer tree or from a task card — lands on a detail page that draws it and nothing else. Editing is a deliberate second click that opens the editor in a new tab.
- **The canvas follows your trackpad.** Two-finger scroll pans the canvas and pinch zooms it. A plain wheel pans; zoom moved to pinch, modifier+wheel, and the on-screen controls.

### Improvements

- **Write a diagram without coordinates and it lays itself out.** Left to right by default (`direction: TB` opts a document back into top-down), layers spaced by the tallest node in them, and a node that arrives without a position lands beside the neighbour it connects to instead of at the origin.
- **Node widths follow the text they have to hold** — a nowrap line grows a shrink-wrapped node past its minimum width, a style-less note is measured at its longest content line, and a collapsed note or resource is measured at its 32px square.
- **An edge handle your document leaves out is solved from the endpoints' relative geometry**, and a handle you did declare is never rewritten.
- **Edge endpoints appear when the edge is selected**, painted above the nodes so their own endpoints win their pixels and can actually be grabbed. Node and field handles keep their hover affordance.
- **Reconnecting a pipe keeps its id**, so its data and its undo history stay with it.
- **The pipe menu opens where you clicked**, clamped inside the viewport.
- **Labels wrap instead of vanishing.** Edge labels are no longer nailed to the path midpoint and wrap before they truncate; icon captions wrap to three lines so names sharing a prefix stop looking identical; a long field value is cut by CSS at 200px rather than by a 10-character slice the CSS never saw. Dragging a label commits where the pointer actually went, not what the last render saw.
- **A collapsed node's handles and edges anchor to the square you can see**, not to the size the note had before it was folded.
- **An id your document carries survives open, merge and save** — only a genuine collision mints a new one.

### The diagram format converged to one

The full graph JSON is now **the only** format a diagram's `spec.data` may use. Nodes carry `type` and `data` (plus optional `id`, `position`, `style`) and edges reference node ids; `position` is optional, and omitting it everywhere hands the layout to the editor.

The two retired dialects — **simplified** (nodes with top-level `name` and `fields`) and **architecture** (a top-level `groups` array) — are now refused at `ud apply`, by shape. The refusal names which dialect it saw, points at the accepted format, and tells you to update the CLI if your copy still teaches the old one. The built-in `generate-dataflow` skill teaches exactly that one format and nothing else.

### Bug Fixes

- **Moving a task to Unfiled works over HTTP.** "Unfiled" and "pinned to the top level" had been collapsed into the same stored value since 2026-05-27, so explicit root had no carrier and the root of the explorer tree held every task nobody had filed. They are now `""` and `/` and they mean different places.
- **Renaming a path prefix has never worked on PostgreSQL.** Fixed — on PG, moving a folder silently did nothing.
- **The daemon's event stream stops losing frames** that were split across network chunks.
- **The agent-session init watchdog stops blaming a machine it never checked.**
- **The runtime page stops claiming the server cannot hold a custom CLI.**
- **The resource inspector reads one step below the page, and its header stops shouting.**

### Upgrade Notes (self-hosted)

🔴 **Upgrade the `ud` CLI at the same time as the server, not after.** The server in this release refuses the two retired diagram dialects at apply time. A CLI older than this release still ships a built-in skill that teaches one of them, so agents running an old CLI will start being refused while their own documentation still tells them to write the refused shape.

⚠️ **If you installed the CLI from npm, nothing upgrades it for you.** Run `npm i -g @oatnil/ud`. Until you do, the refusal stands — this residual window is real, not theoretical.

🔴 **The refusal will not tell you to upgrade.** The server has per-dialect guidance written for exactly this moment — naming the dialect it saw and telling you to update the CLI — but the web layer sends the error code's static default message instead of that text, so what you actually receive is the generic `Diagram content uses a retired format; the only accepted format is the full graph JSON`. The dialect it detected is still there, in the response's `details.dialect` field. If an agent of yours starts being refused, this note is the guidance the error was supposed to give it.

⚠️ **`ud explain dataflow.spec.data` still does not state the one-format rule.** The schema text lives in a separate repository which did not ship with this release, so the schema route is silent about it: the server enforces the rule, but the schema will not warn you in advance. The other route an agent has — `ud describe skill generate-dataflow` — is correct and teaches one format. These two are separate sources and only one of them moved in this release.

**No new environment variables. No new database migrations.**

### Known limitations, and what got worse

This release ships with these open, deliberately.

- **AI generation of the full format was never tested** — the development box has no AI provider configured, so that path is unmeasured.
- **Two layout metrics regressed**: edges crossing nodes went from 2 to 3, and overlapping labels from 10 to 14. Within-layer ordering and label avoidance are not implemented.
- **At deep zoom-out you cannot grab an edge endpoint.** The grab radius is measured in flow units and does not scale with the screen.
- **Real two-finger trackpad panning, and middle/right-button drag panning, remain unverified.** Only a person on real hardware can check them; both are still open.
- **A layout you dragged into place and saved is silently discarded by an agent's next `ud apply`.** This is a deliberate decision: no guard, no merge. The previous version stays in the diagram's history.

---

## v0.141.0 (2026-08-23)

### New Features

- **Files are first-class in the `ud` command line.** A file is now a `kind: File` document with `get`, `describe`, `apply` and `delete`. Upload with `ud apply --content-file <path>` — the path stays a command-line argument and never enters the document, so the same manifest works on any machine.
- **Replacing a file's bytes keeps the bytes it replaced.** The new content is written to a new location, the file switches over only once that has landed, and the old location goes into history. **Nothing is overwritten in place**, so an interrupted replacement cannot destroy the version you had.
- **A file has content history.** Every version you have replaced is listed on the file's page. History records where each old version is stored — not a second copy of the bytes.

### Improvements

- **The resource detail page has been reorganised** — the header says what the file is, and the page states what it costs against your storage.
- **A stored diagram shows its diagram**, drawn from the same registry the editor uses, instead of a placeholder.
- **A read-only diagram no longer offers edit controls it could never save.**
- **Creating a dataflow is available in the app again** — the entry was temporarily hidden in the previous release.

### Bug Fixes

- **The resource detail panel no longer shows two invented values.** Storage read `s3-us-east-1` on every instance no matter where files were actually stored — local disk included — and the uploader always read "You" whoever uploaded the file. Each now shows the real value, or is not shown at all. They looked like ordinary values, so nobody thought to doubt them.
- **A lookup that failed is no longer reported as "no such file."** `ud describe resource` answered `Resource not found` when it had merely been unable to ask — sending people after a file that was there all along.
- **A file's history tells "could not load" apart from "there is no history."** Both used to render as the same empty list.
- **A statistics block that no build has ever contained** was removed from the detail page.

### Upgrade Notes (self-hosted)

- **One new database migration** (`00077`, creating `resource_content_histories`). It runs automatically at startup on both SQLite and PostgreSQL, and creates one table without touching any existing one. Checked by upgrading a real v0.140.0 database in place: the table appears, existing rows unchanged. **No new environment variables.**
- **Versions you have replaced count toward your storage usage.** Their objects are still stored — a file replaced twice occupies all three versions. **An old version cannot be deleted in this release**, so if usage matters to you, replace deliberately.
- **`dataFile` has been removed from the dataflow schema.** Diagram content belongs inline in `data`. Drop the field from any manifest that still sets it.

### Known Limitations (not in this release)

- **The detail page's touch behaviour was not verified on real hardware.** The code is there — on a coarse pointer the rename entry stays visible rather than hiding behind a long press — but taps did not register in the simulator, so this ships **unverified on a real touch device**. Everything else was verified on macOS and in the browser.
- **An old file version cannot be deleted** — content history only grows, and counts toward your usage.

---

## v0.140.0 (2026-08-23)

### New Features

- **Dataflow diagrams are now a first-class thing of their own.** A diagram you create or edit in the app is stored in its own place instead of as a file among your resources. Diagrams **appear in the resource explorer tree** alongside tasks and resources, with their own rename, move and delete; they can also **be attached to a task**, in their own row above the attachments area (a diagram has a name but no file size or file type, so it does not get mixed into the attachment list).
- **Diagrams have version history, and you can roll back.** A rollback is written as a new save of that version — **nothing in between is erased**, and the version it replaces goes into the history.
- **Sharing a diagram makes the images inside it visible — and only inside that diagram.** Unsharing takes that away immediately, and the image's visibility anywhere else (still attached to a private task of yours, say) does not change by a single byte.
- **The `ud` command line can read and write diagrams directly.** `ud apply` understands `kind: Dataflow`, and the same document both creates and updates. Identity is owner + path + name, so **editing a file and applying it again updates the same diagram rather than adding a second one**; applying an unchanged document writes nothing at all. There is also `ud get / describe / delete dataflow`, `ud describe dataflow <id> --history` to list versions (saying for each whether it can still be rolled back), and `ud describe dataflow <id> -o apply` to export — **the exported document carries the diagram itself, so it pipes straight back into `ud apply` and genuinely round-trips.**

### Improvements

- **A saved diagram is now the diagram's own JSON rather than a PNG.** The same diagram goes from about 22 KB to about 1.9 KB. **The "Export PNG" button is unchanged** and still captures the real canvas.
- **Diagrams you already have will be renamed from `.dataflow.png` to `.dataflow.json` on their next save, with no change to their contents.** Opening, editing and reopening all work as before. **A directory you have already `ud pull`ed will not rename itself** — a local file still called `.dataflow.png` **does not mean the rename failed or that the file is broken**; the file is fine, the name is just old, and pulling into a clean directory gives you the new name. **Existing `.dataflow.png` files keep opening forever** and need no migration from you.
- **Diagrams do not count against your storage quota** — the quota measures object storage, and diagrams live in the database. The trade-off is that this usage is invisible to the two existing usage numbers, so the admin storage page **gains a "diagram bytes" column** (history included), flagging any owner over 1 GiB. **That column is not folded into the total.**
- **Saving a diagram unchanged writes nothing** — the modified time does not move and no extra history entry appears.
- **When an image in a diagram cannot be read, the node says why** ("image deleted" / "image not accessible" / "cannot preview" / "image failed to load", with a retry) instead of **going silently blank**.
- **The server's startup banner now reports the storage that is actually in effect** rather than the one the environment asked for, and raises a difference warning when the two disagree. Self-hosted instances can now see at a glance whether what they configured is what is running.

### Changes (may affect existing usage)

- **Inline images are no longer allowed inside a diagram.** Any `data:` URI is refused regardless of size; an image must be uploaded as a resource first and referenced from the diagram as `resource://<id>`. **A single version is capped at 1 MiB.**
- **Diagrams created before this release still open from your resources** (the resource and preview pages say so explicitly), while new ones use the new home. **This is a transitional state for one release, not two permanent paths.**

### Bug Fixes

- **Editing a `.dataflow.json` and reopening it produced a blank canvas — with no error at all.** The file's name and the file's contents were decided in two separate places and could disagree; one place decides both now, so they cannot come apart again.
- **A diagram inside a folder could not be updated with `ud apply`.** The folder was stored in normalised form when the diagram was created, while lookup compared the string exactly as you wrote it — so the row that had just been written was not found, the apply fell through to "create", and uniqueness refused it. Diagrams at the root were unaffected.
- **Applying an unchanged document moved the modified time.** A field merely being present in the document was treated as a field that had changed, so every apply sent an update.
- **A diagram shared read-only could be rewritten and renamed by group members, and the changes were saved.** Writes are owner-only now, while reads still follow the share — so someone the diagram was shared with gets a clear refusal rather than "not found".

### Upgrade Notes (self-hosted)

**The frontend, the backend and the `ud` CLI must be upgraded together in this release.** Upgrading only the backend while the frontend stays behind means edits made by a person in the app and writes made by an agent through the CLI land in two different places, each believing it is right.

**There are two new database migrations** (`00075` creates the diagram and history tables, `00076` the diagram-to-task link table). They run automatically at startup and move `goose_db_version` **from 74 to 76**. Both only create tables and **touch no existing table**; each has been verified on SQLite and PostgreSQL. **No new environment variables.**

**Please sign in again after upgrading.** This release adds four diagram permissions. They are already in the default role, **but tokens you have already been issued — including agent tokens — do not carry them**, so every diagram request is refused until you sign in again or refresh the token.

**An operations command `migrate-dataflows` also ships**, for copying older diagrams out of resources and into the new table (**copy only, never delete**, and safe to re-run). **It currently fails on PostgreSQL for diagrams that contain an inline image, so PostgreSQL instances should not run it yet** — not running it costs you nothing in this release, and older diagrams keep opening as they always did.

### Known Limitations (not in this release)

- **There is no way to share a diagram from the app** — the endpoint exists, the interface does not, so sharing is API-only today.
- **There is no history panel in the app, and `ud` has no rollback subcommand** — history is viewable (`--history`), but rolling back is API-only for now.
- **Opening a diagram in the app and saving it adds a history entry even if you changed nothing** (the command line does not do this).
- **The desktop app (Electron) and Windows were not verified**; this release was verified on macOS and in the browser.

---

## v0.139.0 (2026-08-22)

### New Features

- **Session history on the Workspaces page.** A new History tab beside the live session list shows what your agent sessions actually left behind. Sessions are grouped by day, then by card: which agents ran, how many sessions there were, and the comments, notes and attachments produced in each session's window, plus the latest status change and a preview of the last comment. Filter by date range (last 3 days by default), by agent, by card, and with a has-output / no-output switch — that last one answers "which sessions ran but did nothing". **Sessions that ended badly are shown as such rather than smoothed over**: lost, never started, receipt-only, exited without recording a reason, and "status change not recorded" for sessions older than the 3-day audit window. **Two kinds of number are deliberately kept apart**: comment counts are attributed to the agent, while note and attachment counts carry a ⚠ and are window estimates, not attribution.
- **A task can be a document.** Clearing a task's status now means "no workflow status = document" instead of falling back to To-do. Documents get their own icon in the resource explorer, stay out of kanban columns and status filters, and a new Status row in the card's attributes panel flips a card between task and document in one click. `ud apply` handles it too: an explicit empty `status:` creates or converts a document, while leaving the key out still defaults to To-do. **Cards you already have are unaffected** — they all carry a real status, and a card only becomes a document when its status is cleared deliberately.
- **`ud get subscribers <comment-id>`** shows a comment thread's routing state from the CLI. There was previously no way to see who a thread would reach, which is part of why the unsubscribe bug below went unnoticed for months.

### Improvements

- **Notes and description edits written by an agent are now credited to that agent**, with the delegating human recorded alongside. Before this, every agent-written note was filed under the human, which made agent output impossible to tell apart from your own. Older notes are unchanged and cannot be recovered.
- **A task's notes come back in a stated order** (oldest first) rather than whatever order the database happened to return. Editing a note no longer moves it within the list.
- **Unsubscribing now says what it actually did.** The result carries the number of sessions affected, so an unsubscribe that wrote nothing says so instead of reporting plain success. The wording no longer mixes "you" and "them", and the docs no longer claim that a mention always re-subscribes you — it only does so in specific cases, which are now spelled out.
- **The status row in the attributes panel lays out on one line**, matching the group and assignee rows.

### Bug Fixes

- **The workspace session-history endpoint was refused for everyone.** The route existed but had no permission-registry entry, so every call was rejected before authentication ever ran. This is the fix for the "Access denied" line on the History entry.
- **An agent unsubscribing itself from a thread silently did nothing** and still reported success — it addressed the human it acts for rather than the agent, so no subscription row ever matched.
- **Attachment counts could read zero.** Task attachments are stored under two entity types, current and legacy, and the count only recognised the current one.
- **Session history reported "no record (older than 3 days)" for every session.** A three-day window was applied as nanoseconds, collapsing the cutoff onto "now". A session inside the window whose card genuinely did not move now correctly reads as "no change" — which is the distinction that column exists to make.
- **An account whose username merely starts with "visitor" was shown the test-visitor warning banner.** Only accounts actually minted by the visitor entry point are treated as visitors now. No existing account changes classification.
- **An invalid task status now returns a clear 400 error** instead of a 500.

### Upgrade Notes (self-hosted)

**No manual steps are required. No new environment variables and no new database migrations in this release** — `goose_db_version` stays at 74.

**This is a backend-only release.** The desktop apps and the `ud` CLI are not rebuilt for 0.139.0 and downloads still point at 0.138.0; only the server image moves. The web app is already up to date, so upgrading the backend is what brings the two halves back into line.

---

## v0.138.0 (2026-08-21)

### New Features

- **Delete your own account from inside the app.** Settings now has an account-deletion entry, so this no longer has to go through someone else. Deleting takes the account's own data and credentials with it: sign-in tokens, API keys, files and resources are all removed, and no orphaned files are left behind with nobody to claim them. **Comments you left on other people's cards stay**, because they belong to the discussion they sit in rather than to your account. The action cannot be undone.
- **The knowledge graph can show only nodes you have filed into folders.** A new toggle hides loose nodes and leaves the filed ones. **The toggle needs a server of the same version**: a self-hosted instance that updated only its frontend will see the toggle greyed out with an explanation, while the graph itself renders as usual — that is expected, not a fault.
- **Quick capture no longer fails when the currency is missing.** A record with no currency used to be rejected outright. The currency is now inferred in order: a symbol on the image, then the account, then the default currency you set yourself, then recently used, then what the system has learned, finally falling back to USD. **One ordering change: the default you picked in settings now comes before recently used** — a preference you stated explicitly beats one the system guessed. The trade-off is that while entering a run of foreign-currency records, the chain will not follow along just because you just entered one: your saved default keeps winning until you change it or the record itself carries a currency symbol. The inferred currency is visible in the UI and can be changed in one click.

### Improvements

- **Signing in and "back to app" both land in the resource explorer**, not the AI chat page.
- **The AI assistant is now one floating window.** The full-page AI chat has been removed, and the floating window opens on narrow screens too. Existing `#/ai` bookmarks redirect to the new location.
- **A dispatched session no longer interrupts what you are doing.** Session windows no longer pull themselves to the front. Bring one forward when you want it, from the workspaces page or the button on the card. Arrivals are shown in-app instead: sessions that started while you were not looking are listed, and clicking a row clears just that row.
- **Which CLI runs an agent has moved into the "edit agent" form**, and the old entry in the detail panel **has been removed**. The behaviour changed with it: picking a CLI in the detail panel used to take effect immediately, whereas it now **takes effect when you press Save**, submitted together with the agent's other settings.
- **Your default CLI now follows your account instead of being stored per browser.** Switch machines or browsers and the default comes with you. It also takes part in how a CLI is resolved: **a CLI you set on a specific agent still wins**, and the account default applies only where you have not set one.
- **A session that never started no longer vanishes.** Sessions that failed to start are kept for 24 hours and say which step they stopped at and why (for example, "daemon did not acknowledge workspace init within 30s"). **This makes the failure visible; it does not fix session startup.**
- **The daemon's startup can now be inspected after the fact.** Its five workspace-init steps are written to a local log file, redacted and rotated, on by default — so troubleshooting can see which step it stopped at. **Again, visibility only, not a fix.**

### Upgrade Notes (self-hosted)

No manual steps are required. **No new environment variables and no new database migrations in this release** — `goose_db_version` stays at 74.

Upgrade the frontend and backend together: the knowledge graph's folder toggle needs a matching server version (it greys out otherwise), and in-app account deletion only appears when the backend is on the same version.

---

## v0.137.0 (2026-08-18)

### New Features

- **Give a task its own folder in one click.** In the resource explorer a task can now create a folder named after itself and move into it in a single action. An existing folder of that name is refused rather than merged into or duplicated, a task already sitting in its own folder is left alone (a second click cannot nest `Title/Title`), and a title with no usable characters is refused with its own message.
- **Drag files straight in from Finder / File Explorer.** The resource tree now accepts files dropped from your desktop. The folder under the pointer is ringed while you drag and is where the files land, falling back to the focused row's folder; a drop that resolves to the root says so, since the root is the one destination with no row to highlight. Dropped directories are reported rather than uploaded as junk.

### Improvements

- **A failed drop names every file it failed on, in one message.** Dropping several files used to report only the last failure and swallow the rest, because only one message stays on screen at a time. Failures are now grouped by reason into a single message that lists each file; a lone failure keeps its own message and trace id.
- **The invite-code panel closes the way you expect** — press Escape or click outside it. It previously closed only from its own X button, so it sat over a half-filled registration form until you found the icon. Dismissing it changes nothing but its own visibility: the generated code, the rest of the form, and the page all survive.

### Bug Fixes

- **Uploads through a public share link work again for larger accounts.** Dropping a file into someone's public share link failed with a bare internal error whenever that link's owner already stored more than the default 1 GB — no matter how small the dropped file was, because the drop was measured against a stranger's allowance while being counted against the owner's usage. An anonymous drop is now judged by the **owner's** real allowance, so drops land as intended. The per-link limits that actually guard this are unchanged and still apply: 10 MB per file, 100 MB per link, and rate limiting per link.
- **A refused upload now says it was refused, instead of looking like a crash.** An upload rejected for being over quota arrived as a generic internal error (500), which hid the reason and counted a deliberate "no" as a fault. It now returns a proper out-of-space answer (413 `RESOURCE_QUOTA_EXCEEDED`, or 507 when the instance's own disk is full) with the limit — **at every upload entry point**, not just the one that happened to map it.

### Upgrade Notes (self-hosted)

No manual steps are required. **No new environment variables and no new database migrations in this release** — `goose_db_version` stays at 74.

---

## v0.136.1 (2026-08-17)

> v0.136.0 was superseded by v0.136.1 the same day: only the CLI and the backend image were ever published at 0.136.0, and the desktop and app images never were. The contents are the same as below.

### New Features

- **An instance-wide upload switch (self-hosted).** An instance can now turn uploads off entirely. With it off, every human-initiated upload (task attachments, quick capture, AI image/audio input, anonymous share drops) is refused, and **all eight entry points answer with the same reason code** instead of each inventing its own. **System backups still write** — turning uploads off does not quietly stop your backups.
- **Quick capture: one entry point recognises everything.** Hand the same entry point a screenshot and it works out whether it is an expense, an income or a task — you no longer have to decide first. **The existing single-purpose endpoints are unchanged**, so current callers and older shortcuts keep working exactly as before.

### Improvements

- **A failed upload now tells you why.** When an upload is refused, the upload dialog shows **the real reason per file** (out of space, file type not accepted, uploads switched off on this instance, …) instead of a flat "Upload failed".
- The backend no longer **flattens those coded refusals into a 500** — a refusal it could explain used to arrive shaped like an internal server error, which hid the reason and counted a deliberate "no" as a fault.
- **The outdated-shortcut notice survives this cutover** rather than disappearing silently now that the path behind it changed.

### Upgrade Notes (self-hosted)

- Database migrations apply automatically on startup, as usual.
- One new **optional** environment variable: `UPLOAD_ENABLED` (default `true`). Set it to `false` to switch off every upload on this instance; an instance that never sets it behaves exactly as before.
- ⚠️ **It is a one-way gate, so read this before using it:** once the instance has started with `UPLOAD_ENABLED=false`, setting it back to `true` **does not turn uploads back on** — a seed value equal to the default is never written to the database, so the stored `false` survives the restart. To turn uploads back on, use the **admin panel** (effective immediately, no restart), or delete that config row.

---

## v0.135.0 (2026-08-16)

### New Features

- **Spending breakdown on the transactions page** — a "where it went" view groups spending by category, with actual→plan cadence groups in the sidebar; the expenses summary now lists every category instead of the top three, and percentages always sum to exactly 100.
- **Shortcut version reminders (groundwork)** — the backend can now tell when your iOS capture shortcut is out of date and sends you one in-app notice per new release, pointing at the install guide. Takes effect gradually as versioned shortcuts roll out; older shortcuts keep working unchanged.
- **Redesigned home page** — a single-screen hero with switchable live line-sketch demos.

### Improvements

- **Quick capture** — an image attached to an income is now reachable from that income; a too-blurry image now fails with a clear message instead of a generic error; captured images reach their landing page immediately, before any model reply.
- **Desktop** — every "not ready" state now opens the server panel with a specific explanation, instead of leaving you on a blank screen.

### Bug Fixes

- **Large receipt uploads no longer fail on slow connections.** Photographing a receipt used to spin for 30 seconds and fail if the image was large (over ~2.3 MB) on a slow link. Uploads are now accepted instantly and transferred in the background with automatic retries; if every retry fails, the task shows as failed in the queue and the Retry button re-sends the same bytes — even after an app restart.
- **The queue page's Retry button works again** — it was being rejected before reaching the server logic. Background tasks also no longer show "completed" without actually having run after a server restart.
- **Workspace sessions whose host was removed are now marked lost within half a minute**, instead of showing "running" forever. Sessions of a host that is merely offline are not touched.
- **Shared hierarchy trees** now decide visibility per node by open permission, with a fixed upper bound on query cost.

### Upgrade Notes (self-hosted)

No manual steps are required. Database migrations apply automatically on startup, as usual. One new **optional** environment variable exists: `SHORTCUT_INSTALL_CONFIG_URL` (where the backend reads the latest published shortcut version from). It ships with a working default — set it only if you host your own shortcut install config.

---

Complete version history and new features for udctl.

## Version Numbering

udctl follows **Semantic Versioning** (format: MAJOR.MINOR.PATCH), e.g., `v0.19.0`:

- **MAJOR version 0**: Indicates development version, API and features may change significantly
- **MINOR version** (e.g., 0.**19**.0): Incremented for new features, major improvements, or breaking changes
- **PATCH version** (e.g., 0.19.**0**): Incremented for bug fixes and backward-compatible improvements

---

## v0.134.0 (2026-08-12)

### New Features

- **A Keyboard Shortcuts settings page, with the global "summon Alfred" hotkey recordable** — settings now carry one table, one command per row. The global Alfred row can be clicked and recorded: press the combination you want and it is captured (the VSCode interaction). In-app shortcuts stay read-only in this release and the table says so explicitly, so a row that does not respond is labelled rather than mysterious.
- **After recording you must press the new combination once, and that press is a gate, not a hint** — nothing is applied on recording alone. The app asks you to **actually press the new combination**. Only a real press saves it; without one, nothing changes. Your existing hotkey **stays registered for the whole trial**, so if you abandon the flow — or the combination turns out to be one the OS never delivers — the key you had keeps working.
- **A combination that overlaps an in-app command warns you instead of blocking you** — you can still choose it; the warning only tells you a press will light up both, and leaves the decision with you.

### Improvements

- **The in-app "Ask Alfred" shortcut moved from `Ctrl+A` to `Ctrl+Shift+A`, and it now fires from inside text editors** — the old binding collided with Select All and was swallowed while typing in an editor. The new one summons Alfred even when an editor has focus. Onboarding's instructions for this key were updated in both English and Chinese.

### Bug Fixes

- **A deleted expense or income can no longer be fetched back by id** — deletion hides the row, and while lists filtered hidden rows out, the by-id path did not. A deleted expense/income (amount, merchant, card tail, order number) stayed fully readable by id after it vanished from every list. By-id now matches the list and returns 404.

### One cell in this release has NOT been verified by a real key press (read this as written)

- **Nobody has pressed a key to confirm that the recorder's confirmation step actually catches a combination that registers successfully but never fires.** So we do not claim it verified. **Its failure direction is the safe one: no confirmed press means nothing is saved** — the worst case is "a key that would have worked cannot be set", not "your key silently stopped working". If some combination refuses to confirm, that is this cell; pick another one, and the key you already had is unaffected.

### Upgrade Notes (self-hosted)

- **No new environment variables in this release.**
- **No new database migration in this release.**
- The backend carries exactly one behaviour change: `GET /expense/:id` and `GET /income/:id` now return 404 for deleted (hidden) records. **If you have scripts that rely on reading a record back by id after deleting it, they will start getting 404 from this version.**

---

## v0.132.0 (2026-08-11)

### New Features

- **pi and kimi are pickable built-in agent CLIs** — both existed in some places but were missing wherever the built-in roster is enumerated, so a machine with only kimi installed resolved to no default CLI at all. They are now in the roster, in onboarding's CLI directory, and in the priority order the default pick walks (appended after the original seven).

### Improvements

- **Onboarding's machine step lists what this machine actually has** — the CLI block is a directory read from this machine's probe: the installed ones are listed, the rest are covered in a single sentence, and each explanation appears once, only while its own check is the one to act on.

### Bug Fixes

- **A human's first session launches on the CLI the machine actually has, not hardcoded claude** — the reward button "start your first session" sends no command, and the code resolving that default **never looked at the probe**, so it returned `claude --dangerously-skip-permissions` on every machine — on a box with only codex installed, the session opened straight into command-not-found. It now reuses the same pick that fills an agent's CLI. **An instance that has never received a probe report is unchanged** and keeps the old default.
- **One metadata row stored as invalid JSON no longer aborts the whole sprint lookup** — a single bad row broke both `close-sprint` and the nightly agile sweep instead of being skipped.

### Upgrade Notes (self-hosted)

- **No new environment variables in this release.**
- **This release adds one database migration**, `00073_add_pi_agent_cli` (sqlite and postgres), applied automatically at startup. It adds `pi` to the built-in CLI catalog.
- **Behaviour change — where the default command for a command-less session comes from.** It used to be `claude --dangerously-skip-permissions`, always. It is now the first of claude → codex → gemini → opencode → aider → copilot → qwen → kimi → pi that **your daemons report installed**. **An instance that has never received a probe report is unaffected** and keeps the old default.
- **Note the pick is instance-wide, not per-machine** — it is the union of what every daemon on the instance has ever reported, offline ones included. So if any machine on your instance has reported claude, the default stays claude even on a machine that does not have it. Single-machine self-hosted instances are where this fix actually changes the outcome.

---

## v0.131.0 (2026-08-10)

### New Features

- **A task can now say who it is for** — `assignee` existed as a field, but nothing read it as a relation and nothing checked it. There is now a first-class assignment: `GET /assignments` is the roster (each assignee with their most recent cards), `PUT /assignments/{task}` is an idempotent assign, `DELETE` cancels it. People and agents are the same kind of thing here — you assign your own `ud` exactly the way you assign a colleague. **Being assigned still grants no visibility**: a card you cannot open does not appear in your roster and still answers 404 to your reads.
- **`ud` can assign, and can tell you who a task is for** — `ud patch task <id> --assignee <name|uuid>`, `assignee:` in task frontmatter, and the four assignment commands (`ud get/describe/apply/delete assignment`, `--type human|agent`). A member is named the same way everywhere in the CLI — username, email, agent name or uuid — and an ambiguous name is refused rather than guessed at. `ud describe task` prints the display name; `-o apply` prints the id, so piping it back cannot go ambiguous later.
- **`ud send-input session <id> <text>` types text into a running session** — the backend has always accepted this, but the CLI had no verb for it, so it had to be hand-rolled as raw HTTP. The text is positional and joined with single spaces, so an unquoted invocation sends what it looks like it sends; a lone `-` reads stdin instead, for multi-line payloads shell quoting would mangle. `ud stop session` is untouched — each action on a session stays its own named verb.

### Improvements

- **The @ menu greys out whoever cannot open this card** — on a private card the menu listed every colleague at full strength, so picking one, writing the comment and pressing send was the first moment you learned the mention would be refused. The row is now dimmed and reads "needs sharing", in the same words the write itself uses. The person is still listed: someone vanishing on a private card cannot be told apart from someone who does not exist.
- **Signing in lands you on the last card you had open** — every entrance (password, GitHub, Google, personal-tier) now resolves to the same landing, the explorer docked beside your last task, instead of the AI chat. They had quietly drifted apart.
- **A scheduled backup now reports whether the backup actually worked** — the job reported success the moment the upload was handed to a background worker, and nothing ever read the outcome. On one instance that recorded 100 consecutive "successful" runs while the storage bucket had been refusing uploads for six days, and 14 days produced no object at all. Each run now reports the previous backup's settled outcome.
- **Empty states, onboarding and the secondary marketing pages follow one visual system** — solid fills, highlighter blocks, decorative icon squares and coloured status text are gone; emphasis is carried by rules, weight and underline.
- **Delivered prompts no longer carry the unsubscribe hint line** — agents were told how to leave a thread on every single message. The capability is unchanged; it is taught once instead of repeated.

### Bug Fixes

- **@mentioning someone who cannot read a task is refused, instead of delivering it to them** — the mention put the card title and the whole comment or note body into their notification feed, for a card every one of their reads answers 404 to. Reproduced across all six entrances (comment, reply, comment edit, note, note edit, description) on both SQLite and Postgres. The refusal names who was refused and what to do instead. Agents are unaffected — @-ing your own `ud` on your own private card keeps working.
- **Notifications no longer reach people who cannot read the card** — writing any user's id into `assignee` subscribed them to that card, and every later update then delivered the title and each field's before/after diff to them. `created_by` leaked the same way once a card was transferred or un-shared. Subscribers are now filtered by the same condition the reads themselves enforce.
- **A meaningless `assignee` value is refused instead of stored** — the field accepted anything it was handed, so `GET /todolist/{id}` could show an assignee that `GET /assignments` had no row for: two official reads, opposite answers, from one row. See the upgrade notes — this is a behaviour change.
- **Typing `@` in Quick Note or a task description no longer blanks the editor** — it threw `clis is not iterable` and unmounted the editor's whole React tree. The comment box was never affected, which is why it looked intermittent.
- **`GET /expense` returns the same order every time** — the list was built through a map and Go randomises that iteration, so ten consecutive calls produced ten different sequences of the same rows. Both clients re-sorted locally and hid it; with pagination a shifting order serves a row twice or not at all. The order is now newest-first by when the money left.
- **A symbolic link in an Obsidian vault is skipped, and says so** — following it created tasks from content outside the vault and wrote tracking frontmatter into files outside the tracking root. Skipped links are counted and named in `push` and `status`; a vault with none prints nothing.
- **`ud subscribe/unsubscribe --member` accepts usernames and emails**, not only agent names, and `--member <uuid>` no longer waits on (or fails with) the member lookups it does not need. A partial member list also no longer resolves an ambiguous name to whichever candidate happened to load.

### Upgrade Notes (self-hosted)

- **No new environment variables in this release.**
- **No new migrations in this release.**
- **Behaviour change — a bad `assignee` value now returns 400 where it returned 200.** Both write paths (`POST /todolist/:id` with `{assignee}` and `PUT /assignments/{task}`) now require the value to be a UUID that resolves to a live user. If you have a script that writes a placeholder, a stale id, or a non-UUID into `assignee`, it will start failing. Nothing that stored a real user's id is affected.
- **Behaviour change — who may be assigned is now decided by the card, not by the caller.** The relation path (`PUT /assignments/{task}`) requires the assignee to be someone the card is already visible to: its owner, the members of the group it is shared into, or the owner's own agents. The previous rule asked whether the *assigner* knew the assignee, which never established that the assignee could open the card. Assigning across a group boundary through the relation path is now refused; assigning a private card to your own agent is unaffected and is the case the rule is built around. **The field path (`POST /todolist/:id`) deliberately does NOT apply this membership check** — only the identity check above — so existing clients that assign across a boundary that way keep working.
- **Upgrade the CLI together with the backend.** The assignment guidance agents read at session start ships inside the `ud` binary itself — `ud describe skill` answers from the binary's own copy and never asks the server. A new backend with an old `ud` leaves agents reading the old guidance; a new `ud` against an old backend has agents following guidance whose endpoint does not exist yet.

---

## v0.130.0 (2026-08-07)

### New Features

- **Task search now looks inside your notes** — searching tasks matched the title and nothing else, while every piece of help text (`ud grep task --help`, the built-in skills, the API docs) promised it also covered descriptions and notes. A keyword that lived only in a note body found nothing, and the search reported zero results rather than an error, so there was no sign anything was wrong. Search now matches titles, descriptions and note bodies. What you are allowed to see is unchanged — this widens what matches a task, never which tasks you can reach.

### Improvements

- **A thread reply reaches a busy agent about five times sooner** — when an agent was mid-turn, a broadcast to its thread waited 30 seconds before being offered again. That wait is now 6 seconds.
- **Postgres instances get trigram indexes for the widened search** — on a 200k-note database the new note-body search goes from 658 ms to 7.6 ms. See the upgrade notes for what happens if your database role cannot install extensions.

### Bug Fixes

- **Stopping one session no longer stops a different one** — with two sessions open on the same task, stopping one could mark the *other* one exited while its window and agent kept running. The control plane then believed the task was free and put someone else on it, so two agents edited the same files. A stop now names the session that actually closed.
- **A stopped session's agent is actually stopped** — the stop signalled the terminal only, but the agent runs as a child of the shell we launch, so it routinely kept running with no terminal attached and nothing able to reach it. The whole process group is signalled now. Known gap: an agent inside a tmux-wrapped session lives under the tmux server and is still not reached.
- **Sessions now record the process they run**, shown by `ud describe session` — previously there was no link between a session and a process at all, which is what made a stray agent something you had to find by eyeballing `ps` and guessing.
- **Agent comment authors show their name, not a UUID** — comments written by an agent displayed a raw identifier in the task detail view and the thread view.

### Upgrade Notes (self-hosted)

- **No new environment variables in this release.**
- **Migrations `00071` and `00072` run at startup**, in both SQLite and Postgres.
- **`00071` adds trigram indexes on Postgres and needs the `pg_trgm` extension.** Creation is deliberately guarded: if your database role may not `CREATE EXTENSION`, the migration logs a warning and continues, and search stays correct but scans the notes table. It will not fail your boot. SQLite has no equivalent and skips this.
- **The session/process link applies to new sessions only.** `agent_pid` is `0` for every row that already exists and for every session started by an older daemon — only the daemon knows a pid and it cannot be asked about the past, so **there is no backfill**. The stop fixes above therefore take effect for sessions started *after* you upgrade, not for ones already running when you upgrade. Restart your daemon after upgrading.

---

## v0.129.0 (2026-08-05)

### New Features

**Shared tasks are finally visible to the people you shared them with**
- Sharing a task with a group did not reach anyone already signed in. Their session still carried the group list from the moment they logged in, so the task simply never appeared — no error, nothing to retry, and it stayed that way until they happened to sign in again.
- Group membership changes now reach sessions that are already open. This fix has been waiting since August 4th; this is the first release that carries it.

**Your built-in agents belong to you**
- The six built-in agents used to be constants inside the server, shared by everyone. Now each person gets their own copy, created the first time they enter their workspace.
- Because it is your own copy, you can edit it — change your `ud`'s prompt and the very next session you summon uses it. No redeploy, no restart.

**Agents can be members of a group**
- An agent can now be added to a group, and only its owner can put it there. A mention reaches your own agent, or one belonging to a group you are in.
- The group member list tells humans and agents apart, and each agent row says who maintains it.

**The @ menu was rebuilt around people**
- The menu now asks the server who is actually reachable rather than guessing, and every agent row says whose agent it is, grouped by owner.
- There is now one addressing space — people. An agent is a person. Links written against the retired `@session` scheme render as plain text.

**You can see which human is behind an agent's reply**
- A comment written by someone else's agent records who summoned it, and the reply says whose agent it is and whose permissions it ran with.
- Every prompt delivered to an agent now names who is speaking to it.

**Add group members by email or username**
- Group owners can add someone by exact email or username, straight from the Groups page.

**The notification panel is split in two**
- What needs you comes first, everything else after, with each notification tiered by how it reached you.

### Improvements

- **The sidebar's selected state colours the icon instead of painting a block behind it**, and clicking an open panel's entry now collapses it.
- **The language you register in is recorded as a fact about you.** Anyone without one gets the system default, which is English.
- **The server now states what it can do**, so clients stop inferring capabilities from version numbers — the Add Member entry point hides itself on a backend that cannot resolve an identifier.

### Bug Fixes

- **A group that does not exist now answers 404 instead of 500.**
- **The @ menu's result cap applies across all candidate types**, not separately within each, so one crowded category can no longer crowd out the rest.
- **A membership row whose user no longer exists is no longer shown as a member.** These rendered as blank-named entries in group member lists; they now disappear. See the upgrade note below.
- **The "not your bot" IM reply now explains how to fix it yourself** (`/link relink`) instead of just refusing.

### Upgrade Notes (self-hosted)

- **No new environment variables in this release.**

- **Sessions are signed out of one request when group membership changes.** From this release, changing a group's membership immediately invalidates tokens already issued to the affected accounts. The web app refreshes and replays automatically, so people browsing will not notice. The `ud` CLI and agent sessions get a single `401 AUTH_REQUIRED` and the command fails — **re-run the command and it succeeds.** This applies to the person making the change as well as the person being added.

- **Database migrations `00066`–`00070` run at startup.** Two of them cannot be cleanly undone:
  - **`00070` will refuse to roll back** on any instance where someone has deleted an agent and then created a new one with the same name. It stops with an error rather than discarding rows, so nothing is lost silently — but a human has to decide what happens to those soft-deleted rows before the rollback can proceed.
  - **`00068` writes the six built-in agents in as real rows.** Rolling the code back does not remove them.

- **Built-in agents are no longer created when the server boots.** They are created per person, the first time each one opens their workspace. A brand-new self-hosted install therefore has no built-in agent rows until its first user arrives — this is expected, not a failed migration.

- **Some group member lists will get shorter after upgrading.** Membership rows pointing at users that no longer exist stop being listed. On our own instance this removed 92 such rows across 38 groups; every one of them was already displaying as a blank name, and no named person or agent was affected. Yours may differ — the count is whatever `SELECT COUNT(*) FROM user_groups ug LEFT JOIN users u ON u.id = ug.user_id WHERE u.id IS NULL OR u.is_deleted = 1` returns before you upgrade.

---

## v0.128.0 (2026-08-03)

### New Features

**Calling Alfred is now just `Ctrl+A`**
- The quick input's summon key moved from `Cmd+/` to `Ctrl+A`, reachable with one hand. It only fires outside text inputs, so select-all inside a field is untouched.
- The Meet Alfred onboarding now teaches the new key.

**A bigger, calmer Alfred panel**
- Summoning no longer flashes a blank frame: the pre-warmed transcript shows instantly and refreshes silently in the background. Dark mode no longer flashes white on open.
- Surfaces grew — web dialog 760px, desktop panel 840×560 — and the transcript fills the window.
- The desktop panel is draggable and resizable, and remembers the bounds you gave it.

**`ud pull` starts new folders in vault layout**
- A first `ud pull` into a fresh folder now initializes a vault-layout root — one `.md` file per task, notes under `notes/`, a starter `.udignore` — same as `ud init`.
- The deprecated folder-per-task layout stays available via `ud pull --layout ud`; existing roots keep the layout they were created with.

### Improvements

**Daemon reconnects can no longer deadlock**
- After a network blip, a reconnecting daemon could be told "already connected" by a zombie stream, and both sides would believe each other forever — the daemon sat offline until someone forced it by hand.
- The server now always lets the newest connection take over, and the desktop client stops trusting "already connected": it retries with backoff and forces its way in on the second rejection.

**A restarting daemon cleans up its own ghosts**
- Daemon registration now sweeps that machine's provably-dead sessions (active records under an offline or heartbeat-stale daemon) to lost, so ghost sessions stop showing as running.

### Bug Fixes

- **The IM bot no longer sits at "Connecting…" while actually working.** A race between identity resolution and state tracking could permanently overwrite a healthy bot's status; reboots and token re-pastes replayed it. Fixed.
- **Ask AI in advanced query now says "AI provider unavailable"** when the configured provider is down, instead of "An unexpected error occurred".
- **Quoted-comment highlights are back** — no longer lost in hidden or deferred containers (mobile layout, long pages).
- **Typing Chinese/Japanese: confirming a candidate word with Enter no longer sends.** Alfred quick input, mention/slash menus, inline rename and quick-create all gained an IME-composition guard.

### Upgrade Notes (self-hosted)

- **No new environment variables and no database migrations in this release.**
- **The desktop app must be updated manually for the daemon-reconnect fix to fully take effect.** Half of the fix lives in the desktop app (the reconnect client). Once the backend is upgraded, old desktops already benefit from the server-side takeover, but the complete fix (backoff + auto-force) needs the new desktop build.

---

## v0.127.0 (2026-08-01)

### New Features

**Summon Alfred from anywhere**
- On the web, press `Cmd+/` and a quick-input box opens over whatever you were doing: type, send, and the message lands in your Alfred conversation without leaving the page.
- The desktop app gets a global hotkey — `Cmd/Ctrl+Shift+Space` by default — that summons a resident Alfred quick panel even while the app is in the background. The panel lives hidden rather than being built per press, so the input is there the instant you ask. Esc, clicking away, or pressing the hotkey again hides it.
- The hotkey is editable on the profile page. If the default is taken by another app, registration walks a fallback chain (`Control+Alt+Space`, then `Cmd/Ctrl+Shift+A`) and the settings page shows which one actually stuck.
- If Alfred replies while the panel is hidden, a system notification fires; clicking it brings the panel up. No notification while the panel is on screen — alerting you to something you are looking at is just noise.

**Threads have a door now — participants can leave**
- A subscriber bar under the thread header lists everyone in the conversation: members who wrote in it plus bound agent sessions, with exited participants grayed out.
- You can unsubscribe an agent from a thread (or pull it back in) right from the bar — for when a topic has moved on but keeps waking an agent that finished its part long ago. Changing someone else's subscription requires write access to the task.
- Agents learned the exit too: an agent done with its part can now leave a thread on its own instead of being dragged along by every later reply. Mentioning it again pulls it back in.
- CLI: `ud unsubscribe comment <id>` / `ud subscribe comment <id>` (add `--member` to act for an agent).

**Pick which CLI an agent runs on, per dispatch**
- Mention a CLI alongside the agent — `@my-agent @codex go do X` — and the session started for that message runs on the chosen CLI. It is a one-session choice: the agent's own config is untouched, and an already-running session keeps the CLI it started with; the request text still carries the `@codex` in the sender's own words, so the agent can answer that a running session cannot switch.

### Improvements

**Daemon restarts keep their identity**
- Shutting a daemon down now marks it offline instead of deleting its registration, so a restart comes back as the same daemon — no more orphaned duplicate daemon entries for mentions to be dispatched to.
- Shutdown releases the health port and PID file only after everything has actually stopped, closing the race where a rapid restart found the port free while the old process was still alive.
- A failed agent-session start now keeps its failure reason instead of having it overwritten by later status updates — a silently idle session now says why.

### Bug Fixes

- **Agent config reads are scoped to their owner.** One account could previously read agent configuration belonging to another; reads are now bounded to the requesting owner. (security fix)
- **Deleted the AI provider-test routes that spent the wrong user's key.** Testing a provider could bill an API key that did not belong to the tester; the routes are gone. (security fix)
- **The CLI no longer waits forever on an orphaned pipe.** Version reads and agent resolution now cap the wait instead of hanging.

### Upgrade Notes (self-hosted)

- **One migration (`00065`) runs when the new image starts.** It adds a `muted_at` column to session-thread bindings — the storage behind thread unsubscribe. Same startup-migration mechanism as previous releases.

---

## v0.126.0 (2026-07-31)

### New Features

**Public share links can accept drop-offs**
- A share link can now be marked **allow uploads** when you create it. Anyone holding the link can leave a file — plus one optional line of text — in the task behind it, with no account and no login.
- The two permissions are independent: a link can accept drops while handing nothing out. That is the safer configuration, and the one most people asking for "let them send me a file" actually want.
- Visitors never see what other visitors dropped. Drops are hidden from the public attachment list and from the public download endpoint; only the task owner sees them.
- Each link is capped at 20 files and 100 MB on top of your own storage quota, and the drop endpoints are rate limited per visitor per link.
- Instance owners get a kill switch: `feature.public_share.upload_enabled` in Admin > System Config, **off by default**, editable without a restart. It is separate from `feature.public_share.enabled`, so you can keep read-only sharing while refusing anonymous writes.

**Admins can reset a user's password**
- Admin > Users has a **Reset Password** action. It sets a new password for that account and takes effect immediately — for the case where somebody is locked out and the instance has no mail configured.

### Improvements

**First-run setup: you summon Alfred yourself**
- The "Meet Alfred" step used to post the greeting for you. Now it gives you a real comment box with the same `@`-mention autocomplete used everywhere else in the app, and the handshake starts when you press Send. Typing `@alfred` as plain text routes to nobody, so Send stays disabled until the message carries the actual mention link.
- The first machine conversation now ends with the agent writing what was discussed into a note, unasked, and showing it to you.

### Bug Fixes

**Public endpoints are rate limited, and the client IP behind a proxy is trustworthy first**
- `GET /share/code/:code` had no rate limit at all, so the space of currently-active 6-letter share codes was scannable at line speed — and a hit reads someone's shared task, notes and, when the link allows it, attachments. It now allows 20 requests per minute per client. Login (10/min) and register (5/min) are limited too: generous enough that retyping a password never trips it, tight enough that credential stuffing is not free. A throttled request gets `429` with `Retry-After`.
- The limit is keyed on the real client IP. The server previously trusted any `X-Forwarded-For` a caller typed, which would have let one forged header per request mint a fresh budget and made the limiter decoration. `UD_TRUSTED_PROXIES` now decides which proxies may set that header, defaulting to private and loopback ranges. **If your instance sits behind a public-IP CDN or platform edge, set that variable — see the Upgrade Notes; the default leaves these limits ineffective there.**

**The login page no longer explains a signup policy when it cannot reach the server at all**
- A server URL missing its `/api/v1` suffix produced "Signups are closed on this instance" and a collapsed Server Settings link — a confident claim about an instance the page had never reached. An unreachable backend now says so, Server Settings opens itself so the field you need is in front of you, and the signup claim is withheld until the server actually answers.
- The server URL field can be cleared (it used to snap back to the current value), the placeholder shows the right shape including `/api/v1`, and the hint appears only when the address is already wrong.

### Upgrade Notes (self-hosted)

- **Anonymous drop-off is off until you turn it on.** `feature.public_share.upload_enabled` defaults to off, so upgrading opens none of your existing links to writes — links created before this release carry the permission off. Turn it on in Admin > System Config; no restart needed.
- **New env var `UD_TRUSTED_PROXIES` — read this if anything public sits in front of your instance.** Leaving it unset means "trust private and loopback ranges", which is correct when the proxy is on the same host or the same Docker network (nginx, the all-in-one image) and correct bare-metal. **It is not enough behind a CDN or platform edge on a public IP** — Cloudflare, or a `*.onrender.com` service, which is fronted by Cloudflare. There the server treats the edge as an untrusted peer, so it keys rate limits on the edge's address instead of your visitor's, and that address rotates per request: the limits stop binding and your logs stop showing real client IPs. Name your proxy's ranges explicitly (`UD_TRUSTED_PROXIES=173.245.48.0/20,103.21.244.0/22,...`), or `*` to trust any proxy (gin's old behaviour — spoofable, but it does restore the real client IP behind a single trusted edge). `none` trusts nothing.
- **Two migrations (`00063`, `00064`) run when the new image starts.** They add the drop-off permission to share links and the table that records drops.

---

## v0.125.0 (2026-07-30)

### New Features

**`REGISTRATION_ENABLED` — decide whether strangers can create accounts on your instance**
- A new instance-level switch (env `REGISTRATION_ENABLED`, flag `--registration-enabled`). **The default is off**: on a fresh instance, nobody but the owner gets in.
- With it off, all three self-service signup paths are closed — the invite-code signup endpoint, first-time account creation through GitHub/Google login, and the Visitor button — each answering `403 AUTH_REGISTRATION_DISABLED`. The login page hides the signup and Visitor entries, so there is no button that leads nowhere.
- Accounts you create as the instance owner are unaffected: Admin > Users still works exactly as before.
- To open your instance to other people, set `REGISTRATION_ENABLED=true` and restart. The startup banner prints a `Signup:` line telling you whether signups are open or closed and which env var or flag decided it.
- `GET /auth/tier-info`, which is public, now includes `registration_enabled` — so a login page knows the answer before anyone signs in.

### Improvements

**Configuration values are read strictly, and startup tells you what it read**
- Every boolean and numeric setting accepts a wider vocabulary: `true/false`, `1/0`, `yes/no`, `on/off`, `enabled/disabled`, with surrounding whitespace trimmed.
- A value that cannot be read stops the boot with a message naming the variable, the value it was given, the spellings that are accepted, and how to get back to the default. One boot reports **every** problem it finds, so a half-wrong compose file is one fix rather than a restart per typo.
- A variable that is set but empty (`- FOO=` in compose) uses the default and now says so with a warning in the log.
- The ready banner names both the value **and where it came from** for the scheduler and for signups — `enabled (env CRON_ENABLED)`, `closed (default)`. When the scheduler is running it also reports how many enabled scheduled jobs this database holds, which is how you can tell a copy restored from a backup is about to act as that instance.

**Admin > System Config shows startup settings read-only, with their real running value**
- The four scheduler settings — `CRON_ENABLED`, `VISITOR_CLEANUP_ENABLED`, `VISITOR_CLEANUP_SCHEDULE`, `VISITOR_RETENTION_DAYS` — are decided once, when the process boots. The admin page now displays them read-only, showing the value actually in effect and the env var or flag that set it. Change them where they are owned: set the env var or flag, then restart.
- Other boot-time settings behave the same way, including the JWT secret, telemetry and license.

**The desktop app honours a `CRON_ENABLED` you set yourself**
- The scheduler still defaults to on in the desktop app. If you set `CRON_ENABLED` explicitly, that value is now respected — which is what you want when you point the desktop app at a database it did not create.

### Upgrade Notes (self-hosted)

- **If your instance relies on open signups, you now have to say so explicitly.** `REGISTRATION_ENABLED` defaults to **off**, so after upgrading, an instance that previously accepted public registration will refuse it — including GitHub/Google first-time login and the Visitor button — until you set `REGISTRATION_ENABLED=true` and restart. Nothing else about signup changed: with the switch on, the flow is identical to before.
- **A configuration value that cannot be read now stops the boot, instead of falling back to a default.** If your environment or compose file has a typo in a boolean or numeric setting (`CRON_ENABLED=flase`, `MAX_FILE_SIZE=10MB`), the container will refuse to start and name it. Worth a look at your env before you pull; the error message lists the accepted spellings and how to return to the default.
- **One migration (`00062`) runs automatically when the new image starts.** It clears stored values for the four scheduler settings that are now read-only. The values in effect come from your env vars and flags and are unchanged by this.

---

## v0.124.0 (2026-07-29)

### New Features

**First-run setup is three steps instead of five**
- Pick your language / Let this machine do the work / Meet Alfred. The separate "authorise hooks" step is gone, and Telegram is folded into the last step.
- Every "Next" checks before it lets you through: if something isn't done the page stays put, tells you exactly what is missing, and the button becomes "Skip anyway" — press it again to move on.
- When everything on a step is done, it gets out of your way entirely.

**The machine step sets this machine up for you**
- It installs the ud CLI and registers the daemon. The button only lights up once both are in place, and pressing it opens a plain workspace session on your own welcome card.
- The web app shows the same three steps, with the middle one explaining what the desktop app adds and where to get it.

**Hooks are installed and repaired at the start of every session, with your permission**
- Permission starts **off**. Nothing is written to your agent CLI's configuration until you turn it on, and you can toggle it any time in Profile.
- Once granted, every session start installs what's missing and upgrades what's outdated. If that fails, your session still starts.
- All hook installation in the desktop app is now delegated to the ud CLI, which also cleans up registrations left behind by the old installer.
- `ud hooks status --json` reports what is currently installed.

**codex joins Claude Code with workspace hook support**
- codex is the second agent CLI that can report live session status through a workspace hook.

**Kimi Code added as the eighth built-in agent CLI**
- This integration is written from Moonshot's published documentation and **has not been tested against the real CLI yet**. Treat it as unverified rather than supported.

### Bug Fixes

**The Markdown editor no longer rewrites your file**
- Saving in visual mode used to rewrite the whole document: raw HTML blocks were dropped entirely, footnotes were flattened into malformed links, and plain text lost its trailing newline.
- External `.md` files now open in source mode. Switching to visual mode first round-trips the document and tells you which syntax would be rewritten.
- A file is no longer marked unsaved the moment it opens.
- Closing a window with unsaved changes now asks first.
- Clicking a `task://` link in a standalone editor window no longer pushes it to a backend that isn't there, or loses your unsaved work.

**First-run setup can no longer get stuck on the last step**
- If the machine handshake timed out, the status stayed "pending" forever and the Finish button stayed greyed out, leaving Skip as the only way forward.

### Upgrade Notes (self-hosted)

- No manual action required. This release adds no environment variables and no system switches; one seed migration (adding Kimi Code to the built-in agent CLI list) runs automatically when the new image starts.
- Hook permission starts **off** for everyone, including existing users. If you were relying on the desktop app installing status hooks during first-run setup, turn it on in Profile or accept the prompt the next time you start a session.

---

## v0.123.0 (2026-07-29)

### New Features

**Alfred's chat starts a fresh thread every day**
- The chat transcript used to append to one comment thread forever — the first one reached nearly a thousand replies in three days, which made it slow to open and impossible to skim.
- A new thread now opens on each new day, in your own timezone, and the previous day's thread is closed off and stays readable where it is.

**Alfred keeps his own memory tidy**
- Two routine jobs — an hourly sweep and a nightly archive — now appear in your Scheduled Jobs the first time Alfred starts a session for you.
- They are ordinary scheduled jobs: edit them, disable them, or delete them. **A routine you delete is not recreated.**
- If you already wake Alfred on a schedule of your own, nothing is added — your arrangement is left alone.

**`ud describe wctx` is readable again**
- Notes are summarised instead of printed in full, and comment threads are listed as an index.
- A task with a long history no longer floods the terminal.

### Improvements

**macOS: the app opens without the unidentified-developer warning**
- The `.dmg` itself is now signed, notarised and stapled. Previously only the app inside it was, so macOS still showed the Gatekeeper warning on a freshly downloaded disk image. Auto-update checksums are recomputed after stapling, so updating is unaffected.

**Possession pages redesigned** — a wide-screen layout in the same ink language as the iOS app.

**Login page restyled** to match the rest of the app.

### Bug Fixes

- HTML attachments that store anything locally — bento decks, small self-contained web apps — no longer fail to open in the browser with "The operation is insecure". The preview now provides its own in-memory storage.
- The CLI daemon writes its pending-prompt timestamp in a format the status hook can read, so an installed hook actually reports.
- The CLI daemon confirms a prompt was delivered before submitting it, fixing occasional prompts that were silently dropped.

### Upgrade Notes (self-hosted)

- **No manual steps.** This release adds no environment variables and no system switches.
- One additive database migration runs automatically when the new image starts: a column on `im_conversations` recording which day the current chat thread was opened. Existing conversations carry an empty value by design — an unknown day can never equal today, so the next message simply opens that day's thread.

---

## v0.122.0 (2026-07-28)

### Critical Fix

**Reloading the page after finishing onboarding blanked the whole app**
- Once you completed or skipped first-run onboarding, a page reload left every screen empty — the app shell itself failed to render.
- This hit everyone who had been through onboarding. **Upgrading is recommended for all users.**

### New Features

**First-run onboarding: a real handshake with Alfred**
- Onboarding opens a session on your machine and waits for Alfred to actually reply before letting you continue, showing waiting / replied / timed-out states instead of hanging silently.
- Progress is recorded per segment, so reopening onboarding resumes where you left off.
- The wizard is a fixed size and scrolls its own content.

**Per-agent CLI and model arguments**
- Each agent can choose which agent CLI it runs (Claude Code, Codex, Gemini, …).
- Extra arguments can be appended per agent, for example `--model opus`.

**Agent CLI availability at a glance**
- The desktop app probes which agent CLIs are installed on the machine and reports them.
- The web UI shows availability with version numbers, and an install command for the ones that are missing.

**Session terminal output survives the session**
- The tail of a session's terminal output is retained, so you can still read what happened after the session is gone.

**Telegram group on the contact page**
- The contact page now links the Telegram group; the documentation site's contact page was rewritten to match the homepage style.

**Alfred takes on secretary duties**
- To-dos, calendar and reminders are now part of Alfred's routine.
- Alfred requires an acknowledgement when dispatching work, and reads the terminal before judging a session's state.

### Bug Fixes

- Item photos never loaded (the photo URL was always empty) — they now display correctly.
- "Reset to default" on an agent now also clears its extra CLI arguments.
- Onboarding no longer stalls at "Starting a session on this machine…", and the handshake timeout message no longer contradicts what actually happened.
- Fixed occasional onboarding runs where the prompt was never delivered and Alfred never replied.
- Sessions in the `lost` state can now be stopped, so orphaned processes can be reaped.
- Fixed the CLI daemon showing healthy registration while its SSE connection failed with 401.

### Upgrade Notes (self-hosted)

- No manual action required. This release adds no environment variables and no system switches; its two database changes (additive column and table creation, all with defaults) run automatically when the new image starts.

---

## v0.121.0 (2026-07-27)

### New Features

**Bring your own Telegram bot — for every user**
- Connect your own bot in Profile → Messenger: create one with @BotFather, paste the token, and message your bot to link.
- Your bot answers only you — messages from any other Telegram account are refused, and link codes can only be redeemed by the bot's owner.
- Multi-user messaging opens with this release: it is no longer limited to the instance owner.

**My-Alfred card**
- Profile gains a status card for your Alfred, and first-run onboarding gains a Telegram step.

**Your own daemon comes first**
- Session dispatch prefers a daemon you registered over shared ones.
- If your daemon is offline, you get a receipt telling you exactly how to bring it back instead of silence.

**Desktop: missing agent CLI detection & install guidance**
- If an agent CLI such as Claude Code is not installed, the terminal shows install guidance in place.
- A new zombie-session watchdog kills and reports agent sessions that produce no output.

**Desktop: configurable backend data directory**
- Keep your data in a directory of your choice (a synced folder, for example); the database switches to a single-file journal mode that is safe for sync.

**CLI: `ud stop session` as a first-class verb**
- Plus `ud describe session --tail N` to view the tail of a session, a LAST-SEEN column in the session list, and more accurate daemon liveness detection.

### Bug Fixes

- Fixed the desktop app failing to launch agent sessions on Intel Macs (posix_spawnp error).
- Editing code-owned fields of builtin agents now fails with a clear message naming the field, instead of silently dropping the edit.
- Admin system config values can now be cleared to empty.

### Upgrade Notes (self-hosted)

- The instance-wide `TELEGRAM_BOT_TOKEN` is removed in favor of per-user bots. Operators should set `UD_ENCRYPTION_KEY` to encrypt stored bot tokens. **Correction (2026-07-27): an existing token does _not_ migrate automatically** — this note first said it did. Save your token, set the key, upgrade, re-register it in Profile → Messenger, then restart once more so existing conversations are reattached. Until that last restart the bridge looks healthy but silently drops replies to old conversations. Full procedure: [Upgrading an instance that used the old shared bot](/docs/self-deployment#upgrading-an-instance-that-used-the-old-shared-bot).
- New multi-user messaging switch `im.multi_user_enabled` (system config, default off); once enabled, every user on the instance can connect their own bot.

---

## v0.120.0 (2026-07-25)

### New Features

**Meet Alfred — a built-in butler agent for every workspace**
- Every workspace now comes with Alfred, a butler who dispatches work to the right agents and keeps track of it, remembers your preferences, and files the quick notes you toss at him.
- Talk to him by mentioning `@alfred` in any comment. He supports scheduled wake-ups (a morning brief, for example) and survives daemon reconnects.

**Chat with Alfred from Telegram**
- New Telegram messenger channel: bind your account in Profile → Messenger (generate a one-time code, then send `/link CODE` to the bot) and talk to Alfred from your phone.
- Agent replies mirror back to Telegram, so a conversation started in the app continues in chat.
- Self-host operators enable it with the `TELEGRAM_BOT_TOKEN` env var — see the configuration reference.
  - *Since v0.121.0: replaced by BYO bots. There is no instance-wide bot token any more — each user connects their own bot in Profile → Messenger, and the operator sets `UD_ENCRYPTION_KEY` instead. An existing token must be re-registered by hand on upgrade — see the [upgrade procedure](/docs/self-deployment#upgrading-an-instance-that-used-the-old-shared-bot).*

**Redesigned first-run onboarding**
- A 4-step wizard walks you through language, workspace status, registering this machine as a daemon, and meeting Alfred with optional Telegram binding.
  - *Since v0.121.0: five steps — connecting your own Telegram bot is now its own step after daemon registration.*
- Daemon registration is one click in the desktop app — which also detects installed agent CLIs like Claude Code and Codex — and guided commands in the browser. Every step is skippable.

### Improvements

- Profile has a new Messenger section for managing IM bindings — generate a code, list them, unlink — and tells you whether the server has a bot configured.
  - *Since v0.121.0: the section is where you connect your own bot, and it reports that bot's own health rather than the server's.*
- The Conversations tab now uses the Inbox icon, matching iOS.
- Download links now point to oatnil.com/download; the /subscribe page is retired.

### Bug Fixes

- Fixed a request storm on the Kanban page for fresh accounts with zero boards.
- Admin system config now surfaces the finance category (base currency and exchange rates).

---

## v0.119.0 (2026-07-25)

### New Features

**Self-host without Docker — npm bare-metal install**
- `npm install -g @oatnil/ud-server @oatnil/ud` now gives you the complete udctl stack: the server binary ships with the web UI built in.
- One command starts the full site: `ud-server -host-domain http://localhost:8080 -data-path ./data` — then log in from the browser. No Docker required.

**Clear startup banner for self-hosted servers**
- On boot the server prints a ready banner with the login URL and the initial account credentials, so first-run setup no longer requires digging through logs.
- Configuration problems (like a missing `ADMIN_EMAIL` on Pro/Max tier) now stop the server at startup with a prominent error banner instead of booting into a broken state.

**Manage possessions from the CLI**
- New `ud` possession commands: get/describe/apply/delete plus `acquire`, `dispose`, and `share`.

### Improvements

- All Docker images (all-in-one and split backend/frontend) are now published for arm64 as well as amd64 — Apple Silicon and ARM servers can pull natively.

### Bug Fixes

- Expense and income timestamps are now stored as UTC instants, fixing entries that could shift a day across timezones.
- Receipt scanning now rejects images that aren't receipts and reads the date printed on the receipt instead of assuming today.
- AI tasks abandoned mid-processing are now marked failed instead of silently disappearing.
- The homepage "onboard your agent" flow now copies the correct GitHub raw URL.

### Upgrade Notes (self-hosted)

- Personal tier: the account password is now controlled by the `PERSONAL_TIER_PASSWORD` env var and can no longer be changed in-app — this keeps the desktop Start auto-login in sync. Set the env var to change it.

---

## v0.118.1 (2026-07-23)

### Improvements

**Agents now know who is talking to them**
- When an agent is triggered by a mention, session message, or broadcast, its trigger prompt now names the sender (shown as `User @name` / `Agent @name`).
- The agent's reply is addressed to the right person instead of a generic "a user", so multi-agent and mention conversations stay clear about who said what.

---

## v0.118.0 (2026-07-23)

### New Features

**Create a possession straight from an expense**
- The expense detail view has a new "Create possession" action.
- It opens the possession form pre-filled from that expense, so a purchase becomes a tracked possession in one step.
- The expense itself is never modified — a new possession is created and linked back to it.

**"Onboard your agent to udctl" button on the homepage**
- One click copies a single line you can paste into any AI agent.
- The agent reads the setup instructions itself, installs the CLI, and connects to your workspace.

**`ud describe skill <name> -o content`**
- Prints a skill's body with no metadata header.
- Redirect it into a `SKILL.md` file, or pipe it straight to an agent.

### Improvements

**Agent sessions can recover their own identity**
- When a first mention's setup message failed to land, the session ran on with no identity at all.
- Every follow-up mention and reply now tells the session to load its agent settings.

### Bug Fixes

**The Skills page copy buttons handed out a dead command**
- They copied `ud prompt <name>`, which was removed from the CLI, so pasting it just errored.
- Every copy command and in-app doc now points at `ud describe skill`.

**The web app was stuck on an old build**
- The frontend build had been failing on out-of-memory since 0.117.1, leaving ud.oatnil.com serving the 0.117.0 bundle.
- Fixed, so the web app updates again.

---

## v0.117.1 (2026-07-21)

### Bug Fixes

**Possession dates were saved one day off outside UTC**
- Acquisition and disposal dates were stored as the previous day (east of UTC) or the next day (west of UTC).
- That made holding days and daily cost wrong — at UTC+8 the daily cost showed as roughly half the real figure, and the error was silent because a halved number still looks plausible.
- The date you pick is now recorded exactly as picked.

### Upgrade Notes

- Possessions created before this fix keep the date they were saved with; holding periods are not recomputed automatically. If a possession's daily cost looks wrong, re-pick its acquisition date to correct it.

---

## v0.117.0 (2026-07-21)

### New Features

**Possessions — track the things you own and what they cost you per day**
- New Possessions module for physical items: record what you paid, when you got it, and see the running daily cost of ownership.
- Full lifecycle: wish -> in service -> retired / sold / lost. Costs are derived live, so the daily figure is always current without any bookkeeping.
- Disposing of an item as "sold" can book the proceeds straight into Income.
- Outliving its expected lifespan reads as "Target reached", not an overspend warning — more days than you planned for is the good outcome.
- Possessions appear in the Explorer tree and in the sidebar's finance group.
- A cost too small to show at two decimals is stated as a monthly figure rather than displayed as "0.00 a day".

**Multi-currency accounts**
- Account totals are now reported exactly, per currency. Balances in different currencies are no longer added together into a meaningless number.
- Optionally roll everything up into one display currency of your choice, using the exchange rates configured in system settings.
- The dashboard, trend chart and account list show a single combined figure only when that figure is honest — otherwise they show a per-currency breakdown.
- When a roll-up can't include everything, the app names the currencies it left out instead of quietly understating your total.
- Currency is chosen from a picker when creating an account, not typed.

### Improvements
- The Income module is complete: dedicated list page, route and summary.
- Summaries and cash-flow figures are currency-aware throughout.
- The currency breakdown is ordered by what each holding is actually worth when rates are available, instead of by raw amount.
- Clearer messaging when a conversion isn't available, naming the specific currency that lacks a rate rather than giving one generic message.
- Fewer redundant success toasts on actions that already update instantly.

### Bug Fixes
- Expenses inside a budget shared with a group are now visible to group members. Previously only per-user shares worked, so members saw the budget but none of its expenses.
- Fixed authorization gaps in group-shared expenses and income.
- Opening an account with a balance of 0 works. It was rejected as "Invalid format" while editing an existing account to 0 succeeded.
- Amounts too small to store are now refused instead of being silently saved as 0.
- The budget and off-budget parts of a converted total now add up to the total.
- Holdings worth something but less than 0.01 show "< 0.01" instead of 0.
- A malformed currency code in a request is rejected rather than ignored.

### Upgrade Notes
- Account currency is now restricted to active ISO-4217 codes at creation time. Existing accounts are unaffected and no migration is needed. Self-hosted users who tracked points, tokens or local scrip as an account currency can no longer create accounts with custom codes.
- Rolling everything up into a single currency relies on exchange rates in system settings, which is a Pro feature. Personal tier continues to get the exact per-currency breakdown.

---

## v0.116.0 (2026-07-20)

### New Features

- **Spreadsheet-style paste in tables** — Paste multi-cell data from Google Sheets, Excel, or CSV directly at any cell: rows and columns expand from where you point, and multi-line values are parsed correctly.
- **Full-page Conversations view** — Browse all your comment threads in a dedicated page with the thread list on the left and the conversation on the right.
- **Pop-out conversation windows** — Open any conversation thread in its own standalone window with the new pop-out icon.

### Improvements

- **Terminal zoom controls** — Workspace terminal zoom controls are now a translucent floating overlay, leaving the whole pane for your output.
- **Read-only terminals fill the pane** — Read-only terminals now scale to fill the pane and follow external terminal resizes.
- **Conversation filters wrap** — Filter chips wrap onto multiple lines instead of hiding in a horizontal scroll.
- **Conversations open faster** — Expanding conversations auto-opens the top thread and preloads the next page of threads.

### Bug Fixes

- **Table editing** — Typing to edit a cell no longer loses the first character; cutting or deleting a selection is now a single undo step; CSV delimiter detection and markdown escaping are more robust.
- **AI Chat layout** — Long message content no longer overflows the chat panel.
- **Resource deletion** — Deleting an uploaded file now removes it from your configured storage provider.

---

## v0.115.0 (2026-07-18)

### New Features

- **Zero-config agile sprints** — Boards now support Scrum-style sprints with no setup: create your first sprint from the new Backlog page and sprint tooling lights up automatically.
- **Backlog page** — Plan work in a dedicated backlog: sprint sections, drag tasks into a sprint, and quick-create tasks in place.
- **Sprint scope bar on the board** — A scope bar on the kanban board focuses the view on the active sprint with one click.
- **Reports: burndown & velocity** — A new Reports tab charts sprint burndown and team velocity, powered by daily automatic snapshots.
- **Sprint ceremonies** — Start a sprint with date presets; complete it with a closing dialog that rolls unfinished tasks into the next sprint and produces an itemized retro summary.
- **Risk alerts & WIP warnings** — The board warns when a column exceeds its WIP limit, and at-risk sprint tasks automatically receive a risk-alert comment.
- **Jira-style named views** — Board / Backlog / Gantt view tabs are unified across board pages, with a shared header and a board switcher everywhere.
- **Agile fields on tasks** — Tasks gain built-in agile fields (like their sprint), editable in the task detail and usable in board queries.
- **CLI sprint management** — `ud sprint close` completes a sprint with rollover from the terminal; `ud patch task --set` patches task metadata (including JSON arrays/objects); plus a built-in agile skill and cook recipes.

### Improvements

- **More compact board layout** — Tabs move inline with the header, sprint scope merges into the filter bar, and the Gantt header collapses to a single row — more room for your tasks.
- **Flexible dates when creating tasks** — Task creation (API and CLI) now accepts relaxed date formats.
- **Sprint title links to its task** — Sprint section titles open the sprint's task detail, where its dates can be edited.

### Bug Fixes

- **Directed agent replies stay in their thread** — Replies addressed to a specific session no longer broadcast to other bound sessions.
- **Agent startup failures are reported** — When an agent session fails to initialize, the error is now replied into the comment thread that triggered it.
- **Custom field types display correctly** — Field types and option sources now show proper labels.
- **Reports & backlog respect the board scope** — Backlog, sprint lists, and progress queries follow the board's scope, and Reports resets the selected sprint when you switch boards.

---

## v0.114.0 (2026-07-18)

### New Features

- **Obsidian-style vault layout for CLI sync** — `ud init` now creates a vault layout by default: tasks live as plain Markdown files and notes materialize into a visible `notes/` folder, so your whole checkout works directly as an Obsidian vault.
- **Wikilink translation** — `[[wikilinks]]` in your vault files are converted to ud task links on push and back to wikilinks on pull, so links keep working on both sides.
- **File names with spaces and special characters** — Synced paths now allow spaces and most special characters; only characters your filesystem itself forbids are rejected.
- **Fetch attachments on pull** — `ud pull --fetch-attachments` downloads task attachments into your vault.
- **Migrate existing checkouts** — `ud migrate-layout` converts an existing ud-layout checkout to the new vault layout in place.

### Bug Fixes

- **Your own edits are no longer flagged as conflicts** — Sync no longer reports conflicts for changes you just pushed, and timestamp comparison now uses full nanosecond precision.
- **Dotfiles sync correctly** — Dotfile resources (e.g. `.gitignore`) are materialized verbatim on pull, with sensible names when deduplication is needed.
- **Pull reconciles identical untracked files** — Pulling over an untracked local file with identical content now adopts it into tracking instead of failing.

---

## v0.113.0 (2026-07-16)

### New Features

- **LaTeX math in the editor and viewer** — Write math formulas anywhere: use inline math or insert a math block from the slash menu, and see them rendered beautifully with KaTeX in both edit and view modes — including AI chat responses.
- **Personal global instructions for AI agents** — Define your own global instructions once, and every AI agent session you start will follow them automatically.

### Improvements

- **Zoom controls in the terminal viewer** — The read-only terminal view now has +/- zoom buttons, making long output readable on small and mobile screens.
- **Terminal output keeps its original layout** — Long lines in the read-only terminal no longer wrap unexpectedly; the view sizes itself to the content.
- **Cleaner site header** — The public site header navigation has been simplified.

---

## v0.112.1 (2026-07-15)

### Improvements

- **AI agent sessions no longer stall on interactive prompts** — Agent sessions now run to completion autonomously instead of pausing to wait for user input.

### Bug Fixes

- **Budgets and expenses display in their own currency** — Budgets and expenses now render in their own currency instead of a single global currency.
- **In-app markdown links navigate correctly** — Markdown links inside the app now route through the in-app router everywhere instead of breaking navigation.
- **AI chat settings link goes to AI settings** — The settings link in AI chat now navigates directly to the AI settings section.

---

## v0.112.0 (2026-07-14)

### New Features

- **Fullscreen image lightbox in conversations** — Click any image in a conversation to open it in a fullscreen viewer, then pan and zoom to inspect the details.

### Improvements

- **The ud assistant now orchestrates your whole team** — Your default ud agent now acts as a root manager over all top-level team leads, coordinating work across teams instead of operating in isolation.
- **Clearer CLI daemon feedback** — `ud` daemon start now reports real success or failure from the captured output instead of silently swallowing errors.

---

## v0.111.0 (2026-07-12)

### Improvements

- **Smarter agent team delegation** — Team leads now delegate to specialists through their AI tool's built-in subagent capability by default: run `ud describe agent <name> -o prompt` to get a ready-to-inject identity prompt (persona, skills, working constraints) and spawn the specialist as a subagent, with results reported right back in the thread. @mention delegation remains for specialists on other machines and long-running background work, and members that can only be reached remotely are now clearly marked in the team roster. Leads are also guided to delegate rather than do everything themselves, staying focused on coordination and review.

---

## v0.110.0 (2026-07-11)

### New Features

- **Running badge focuses its window** — Clicking a workspace's Running badge now brings the already-open workspace window to the front when it's on the same computer, instead of doing nothing.
- **Stuck workspace launches are detected** — Workspace sessions that never start are now failed automatically after a timeout, with a notification posted back into the task thread — no more sessions silently stuck on "starting".

### Improvements

- **Faster terminal reconnects** — Reopening a workspace terminal now restores the screen from a snapshot instead of replaying the entire output history, making reconnects faster and cleaner.
- **Sharper terminal rendering** — The terminal now uses WebGL rendering with more accurate font-size fitting and correct raw output display.

### Bug Fixes

- **Workspace launches without a project folder** — When no working directory is configured, a dedicated sandbox folder is now created automatically instead of the session failing to start.
- **Stray "~" folder** — Fixed the desktop app creating a literal `~` folder inside the project directory when setting up workspace hooks.
- **Conversation previews** — The conversations sidebar now previews the latest reply in a thread, not an older message.

---

## v0.109.0 (2026-07-08)

### Improvements

- **Copy commands everywhere in Markdown** — Copy as rich text, copy as Markdown, and copy Markdown link are now available in every Markdown editor — task and note descriptions, expense/income/account notes, and the kanban preview — not just the task detail view.
- **Cleaner Kanban toolbar** — The board header is now a minimal, unified toolbar: quick icon actions stay visible while everything else folds into an overflow menu, with a single responsive layout for mobile and desktop.
- **Smarter built-in `@ud` agent** — The default `@ud` AI agent now acts as an orchestrator: it understands the full agent roster, clarifies with you, then delegates work to specialist agents instead of doing everything itself.

---

## v0.108.0 (2026-07-08)

### Security

- Fixed a SQL-injection vulnerability in Advanced Search where a specially crafted custom-field name could be injected into the underlying query.

### New Features

- **Unified search bar** — Advanced Search is now a single query bar with three modes: **Filters** (visual chips), **Query** (SQL-like), and **Ask AI** (describe what you want). Filters apply instantly as you add or remove them, switching between Filters and Query keeps your work intact, and a live validity indicator shows when your query is ready.
- **Filter Kanban columns by more fields** — board columns can now match on **Title**, **Description**, and other fields (not just Status and Tags), including a new "contains all tags" option. The column editor shows a live preview of the generated query plus a wildcard hint for pattern matching.

### Improvements

- Kanban: filtering a column by a read-only field (like Title) no longer risks overwriting that field when a card is dropped into the column.

### Bug Fixes

- Fixed terminal (tty) alignment and resizing on the task detail page.

---

## v0.107.0 (2026-07-06)

### New Features

- **Agent Teams** — organize your AI agents into teams with a lead and specialist members. Each member gets a "when to delegate here" note, and that roster is injected into the lead's session so it automatically knows who to hand work off to. Teams nest to form a delegation hierarchy. Manage them in the new **Agents** hub (Agents · Teams · Skills tabs), or from the `ud` CLI (`ud apply` / `ud get agent-team`).
- **Copy as Rich Text** — right-click a task, or its description, to copy it as rich text for pasting into other apps.

### Improvements

- Comment threads: resolving a thread now offers **resolve + mark done + terminate** in place of the old resolve + delete.
- File explorer: a resource attached to a task now appears co-located with that task.

---

## v0.106.0 (2026-07-06)

### New Features

- Pasted images stay tidy — pasting or inserting an image now routes it to a dedicated `/system/pasted-image/` folder instead of cluttering your file explorer root
- Smarter workspace daemon selection — workspace sessions now prefer and reuse your last-used daemon instead of always grabbing the first online one

### Bug Fixes

- AI chat: failed tool steps now clearly show an error state instead of incorrectly rendering as a green "done"; a clear notice appears when a tool loop reaches its iteration limit
- AI chat: long messages in enlarged mode are now centered at a comfortable line width for easier reading
- Workspace: session control buttons no longer get clipped in short or narrow panes

---

## v0.105.0 (2026-07-05)

### New Features

- CLI: new `stop-workspace-session` command to actually terminate a running agent session (not just mark its status)

### Improvements

- Agent sessions now fall back to a default workspace project — when no working directory is configured, sessions run in a dedicated "Default" project so every session gets a real, listed working directory
- When an @agent mention can't start a session (e.g. no agent daemon is online), you now get a clear error reply in the thread instead of the mention silently doing nothing

### Bug Fixes

- Fixed garbled text in read-only terminal views when a workspace session was resized — all viewers now re-apply the new size immediately
- Fixed the task explorer not reflecting status, path, or tag changes after a refresh
- Fixed the Claude Code status indicator showing "idle" while background subagents were still running

---

## v0.104.0 (2026-07-05)

### Improvements

- The markdown editor's popup edit mode has been removed — zen mode (full-screen editing) is now the only way to edit
- Task detail page: better edit-mode affordances, onboarding no longer blocks usage on failure, and the outline now supports grouping
- Task detail page: error states support retry, empty fields can be edited with a single click, and dialogs are more accessible
- Previously hardcoded text in the editor is now properly localized

### Bug Fixes

- Fixed some screens showing raw translation keys instead of proper text
- Fixed the markdown editor sometimes losing unsaved content
- Fixed unsafe link protocols not being filtered in editor links
- Fixed new workspace session windows covering the currently focused window

---

## v0.103.0 (2026-07-04)

### New Features

- Workspace session windows now open in the background — click the status indicator to bring a window into focus
- Click a workspace session title to preview its associated task in a popup

### Improvements

- The workspace group-by toggle now uses icons with tooltip hints
- The compose agent picker supports keyboard navigation, and your draft is kept when switching recipients
- Read-only terminals are now scrollable and support text copying

### Bug Fixes

- Quick-note mention tasks no longer duplicate content across the title, description, and comment

---

## v0.102.0 (2026-07-04)

### New Features

- Responsive mobile layout for the workspaces page — drill down from the session list into the detail view on small screens
- Group workspace sessions by agent or daemon — your group-by choice is remembered
- Stop a session directly from the workspaces sidebar — a stop button appears when hovering a session
- Read-only terminal viewing now scales to fit your window, and the terminal resizes to match the viewer
- The workspace sidebar remembers its collapsed state across sessions
- CLI: `ud apply --dry-run` previews board changes before applying, and board columns round-trip losslessly through export and apply

### Improvements

- Sending input to a remote workspace session now requires Cmd/Ctrl+Enter, preventing accidental sends
- The conversation and explorer sidebars are now mutually exclusive — opening one closes the other

### Bug Fixes

- The workspace working directory is validated before the terminal spawns — an invalid path now shows a clear error instead of a black terminal
- Options chosen in the Run dialog are now honored when generating the workspace session prompt
- Removed a stale keyboard-shortcut hint from the workspace session input placeholder

---

## v0.101.1 (2026-07-03)

### Bug Fixes

- Fixed the backend failing to start when applying the v0.101.0 database migrations (affected self-hosted Docker images and binaries; desktop apps and the CLI were not affected)

---

## v0.101.0 (2026-07-03)

### New Features

- New `ud init` command — bind an existing local folder to a virtual path and publish it with `ud push`; tracking folders are now bound to the path they were pulled from (git-clone style), so `ud pull` with no arguments incrementally syncs everything tracked
- Start a workspace session without picking an existing task — the redesigned prompt-first Run dialog puts your prompt first and collapses settings into a summary line
- Workspace sessions are now grouped by working directory, and the concurrent-workspace limit has been removed entirely
- Gemini, GitHub Copilot, and Qwen are now available as built-in agents for local workspace sessions
- Dataflow is now fully translated into Chinese and English

### Improvements

- Much faster resource lists — download links are now cached and included in list responses, removing a request per resource
- Dataflow visual refresh — flat nodes, orthogonal edges, outlined groups, and smoother dragging without canvas-wide re-renders
- Conversations now live in the sidebar panel; the separate full-page view has been removed

### Bug Fixes

- Explorer: the drag-and-drop target highlight is now visible and stays steady while dragging over folders
- Dataflow: fixed undo tracking and data corruption on rename/duplicate/delete, jumping icon-node anchors, and pipe rendering from any handle direction
- Workspace: terminal history no longer renders twice, and the Run dialog no longer clips input focus rings
- Fixed duplicate folders appearing when pulling or pushing paths with inconsistent formatting

### Upgrade Notes

- The old local-sync feature has been removed from the app, desktop, CLI, and backend — use the new tracking-folder workflow instead (`ud pull` a path into a folder, edit, `ud push`). Old v1 `tracking.json` folders are no longer recognized; re-pull them with the current CLI

---

## v0.100.0 (2026-07-02)

### New Features

- New `ud pull`, `ud push`, and `ud status` CLI commands — sync tasks, notes, and resources between local files and the server, git-style: pull server content into a folder, edit locally, check changes with `ud status`, then push them back
- Comment conversations now have a Resolve & Delete Task button in the header — close a discussion and remove its comment task in one click

### Improvements

- Workspace sessions that fail to start now show the actual error from the daemon instead of failing silently

---

## v0.99.29 (2026-06-29)

### Improvements

- Workspace session detail now shows a read-only live terminal view instead of notes
- Faster task lists — notes and share links are now batch-loaded, removing redundant lookups
- Faster CLI task browsing — `ud tree` and hierarchy views now use dedicated, lighter endpoints

### Bug Fixes

- Workspace terminal: initial output is now buffered until the view is ready, so you no longer miss the first lines
- Fixed access to task tree and hierarchy views that were previously blocked

### Upgrade Notes (self-hosted)

- `HOST_DOMAIN` is now required at startup — set it in your deployment configuration or the backend will not start

---

## v0.99.28 (2026-06-28)

### New Features

- Workspaces, redesigned — Active Sessions now use a full-height master–detail layout at /workspaces, with sub-navigation showing live session-count pills and a more inviting empty state with a clear "New Session" action
- Smoother onboarding — after you pick a language, udctl seeds a welcome board and opens a maximized Quick Note so you can start right away
- System-wide storage limit — admins can now set a total storage volume cap across all users from Admin → Storage, alongside the per-file and per-user limits
- Desktop apps now offer to install the ud CLI for you when you launch a local workspace without it

### Improvements

- Refined the sidebar app rail with a lighter, more consistent line style
- The homepage "Try Now" button now jumps straight to a full-screen loading page with clear feedback

### Bug Fixes

- The admin Max File Size setting now takes effect immediately for all users
- Workspace session controls (stop, screenshot, send input) now reliably target the exact session instead of the whole task
- Follow-up mention prompts now submit correctly in desktop workspaces
- Task detail now shows a skeleton placeholder instead of a brief "Invalid Date"
- Opening the explorer no longer clobbers loaded task content
- Removed a redundant "Run" button from the empty session list

---

## v0.99.27 (2026-06-27)

### New Features

- Video files now play directly on the resource detail page with full playback controls (play, timeline, volume, fullscreen) — videos no longer show "preview not available"

### Improvements

- Simplified the desktop app's update check to a single "Check for Updates" button: it tells you whether you're up to date or offers a Download button for a new version. The best download mirror is now chosen automatically, and a startup crash tied to the updater has been fixed
- Clearer error messages when a file can't be previewed or downloaded — you now see the specific reason (file missing, link expired, storage unavailable) instead of a generic "file not found"

---

## v0.99.26 (2026-06-26)

### Bug Fixes

- Fixed a startup issue where the desktop app could fail to launch with "Backend failed to start within 30s"; the backend now starts reliably

### Improvements

- The desktop app now asks your permission before adding Claude Code hooks to your projects (for real-time workspace status). Choose during onboarding, or toggle anytime in Profile → CLI. Nothing is written to your Claude Code config unless you allow it

---

## v0.99.25 (2026-06-21)

### New Features

- Explorer: Highlight active task in sidebar
- CLI: Added `path` as a queryable built-in field in `ud query`
- Skills now browsable in explorer API

### Bug Fixes

- Fixed large file (MP4) upload timeout in `ud sync resources`
- Fixed infinite loop when agent reply contains self-mention in comment threads
- Fixed empty state flash during task detail page reload

---

## v0.99.24 (2026-06-19)

### New Features

- CLI: Added `ud share` and `ud unshare` commands for managing group sharing on tasks, budgets, expenses, incomes, and accounts
- CLI: Added `ud patch resource` subcommand for updating resource properties
- Mobile: Search button added to floating action group
- Explorer: Manual refresh button in header
- Task navigation: Auto-navigate to previous task after deleting current

### Improvements

- Agent-to-agent comment thread reply routing with rate limiting

### Bug Fixes

- Improved comment reply notification readability
- Fixed explorer live refresh not handling path field changes correctly

---

## v0.99.23 (2026-06-18)

### New Features

- Task status icon in conversation sidebar is now clickable for quick status changes

### Bug Fixes

- Fixed conversation detail header buttons showing redundant text labels
- Fixed status dropdown in conversations being obscured by overlapping elements

---

## v0.99.22 (2026-06-18)

### New Features

- **Unified Explorer**: Tasks and resources merged into a single tree with drag-and-drop and folder operations for all node types
- **Incremental Sync**: Explorer uses IndexedDB cache and syncs only changes for faster loading
- **Unfiled Section**: Items without a folder path are grouped in a dedicated "Unfiled" area
- **Explorer Context Menu**: Right-click to create new Diagrams, Dataflows, and Sheets directly
- **Code File Preview**: Inline preview for JSON, JS, CSS, XML, and other code/data files
- **Reveal in Explorer**: Quickly locate both tasks and resources in the explorer tree
- **Task Status Icons**: Tasks in the explorer tree display their status icons
- **Note Node Styling**: Style panel for dataflow Note nodes with color presets and font size
- **Focus Window Button**: Workspace session controls include a focus window button
- **Resend Init Button**: Resend the initialization prompt in workspace sessions

### Bug Fixes

- Fixed explorer not auto-syncing when tab regains focus
- Fixed right-click inside folder content using the wrong path
- Fixed explorer context menu hidden behind panels

---

## v0.99.21 (2026-06-16)

### New Features

- **Dataflow Kubernetes Icons**: Added 22 K8s resource icons (Pod, Deployment, Service, Ingress, CRD, etc.) with group presets for Cluster, Namespace, and Node
- **Dataflow Sequence Icons**: New numbered circle icons (1–20) for indicating steps and ordering in diagrams
- **AI Chat Comment Management**: AI assistant can now create, edit, and delete task comments directly
- **Floating AI Chat Popup**: Open AI chat as a floating window when the sidebar is collapsed

### Improvements

- Monospace font for Note nodes in the dataflow editor for better readability
- Faster page rendering with optimistic updates and stale-while-revalidate caching

### Bug Fixes

- Fixed style panels not following nodes/edges during drag in the dataflow editor
- Fixed skill/prompt picker being hidden behind the floating conversation panel
- Fixed race condition in terminal session output restore

---

## v0.99.20 (2026-06-15)

### New Features

- **Dataflow Shape Nodes**: Added shape node with 8 geometric variants — rectangle, rounded rectangle, circle, diamond, parallelogram, hexagon, triangle, and cylinder
- **Dataflow Pipe Styling**: Customize pipe/connection colors, width, dash patterns, and animated flow effects
- **Unsaved Changes Warning**: Dataflow editor now warns before navigating away with unsaved changes
- **Resource Preview**: Click resources to preview inline instead of downloading
- **Explorer Sidebar**: Explorer is now a toggleable sidebar for quick access
- **Workspace Thread Binding**: @mention-triggered workspace sessions now bind to threads immediately

### Improvements

- Resource nodes accept all file types, not limited to images

### Bug Fixes

- Fixed style panel clicks causing node deselection in dataflow editor
- Fixed mobile keyboard dismissing buttons and popovers
- Fixed missing back button in desktop sidebar conversation view

---

## v0.99.19 (2026-06-14)

### New Features

- Added new conversation button (+) in the conversation sidebar — start new conversations with agents or self without leaving the panel
- Added skill & prompt picker in compose view — quickly insert skill references when talking to agents

### Improvements

- Collapsed navigation sidebar now opens the conversation panel directly instead of navigating to the full page
- Conversation sidebar loads instantly from cache with background refresh

---

## v0.99.18 (2026-06-14)

### New Features

- Mobile floating conversation switcher: slide-in panel with filters, session status badges, and quick thread switching
- Conversation popup mode: view and reply to threads in a floating panel without leaving the current page
- Conversation threads sorted by last activity time (including reply timestamps)

### Improvements

- Workspace toggle button stays visible when popover is open
- Floating edge buttons unified into a shared component with automatic stacking and consistent sizing

---

## v0.99.17 (2026-06-14)

### New Features

- Recycle bin: view deleted task details and permanently delete
- `ud tree` command for visualizing task hierarchies as a tree
- `ud get task -l <tag>` tag filtering and `ud get tags` aggregation view
- CLI access to soft-deleted tasks

### Bug Fixes

- Pagination footer now more prominent with --page/--all hints

---

## v0.99.16 (2026-06-14)

### New Features

- Table editor overhaul: Google Sheets-like UX with cell selection, keyboard navigation, drag select
- Multi-sheet workbook support
- Boolean checkbox and date column types
- Column width drag resize
- Excel paste, Markdown copy/export, and clipboard support
- Right-click context menu and row height adjustment
- Selection enhancements: Ctrl+A, column select, range perimeter border

### Bug Fixes

- Fixed row height jumping when entering edit mode
- Fixed cell outline color and cursor visibility issues
- Eliminated double border artifacts in cell selection

---

## v0.99.15 (2026-06-13)

### New Features

- Support updating resource metadata via `ud apply`
- Workspace sessions now available as CLI resource type (`ud get workspace-session`, `ud describe workspace-session`)
- File-based sync lock to prevent concurrent access conflicts

### Bug Fixes

- Fixed resource preview not rendering on full-screen resource page
- Fixed folder move action not working in file browser
- Fixed comment change notifications not being delivered

---

## v0.99.14 (2026-06-12)

### New Features

- Explorer sidebar now loads all tasks, showing the complete folder tree regardless of task count
- CLI: New `ud patch task --path` command to quickly move tasks into virtual folders (e.g. `ud patch task abc123 --path docs/design`)

### Improvements

- CLI auto-prepends leading `/` to path arguments, making the command more forgiving

---

## v0.99.13 (2026-06-12)

### New Features

- Entity protocol links (e.g. `task://`) in comments and conversations are now clickable
- Pinned tasks now appear in the conversation sidebar
- CLI: New `ud cook` command (cookbook recipes for all 15 API resources) and `ud patch` command (with comment `--status` support)

### Bug Fixes

- Fixed comment anchor highlight not working (clicking a comment link now correctly scrolls and highlights the referenced comment)
- Fixed CLI `bind task --project` sending wrong JSON field name

---

## v0.99.12 (2026-06-09)

### New Features

- Conversations now appear next to AI Assistant in sidebar, with a new "AI vs Conversations" doc page
- CLI: New `ud get resource` and `ud describe resource` commands with date filtering (`--since`, `--before`)
- CLI: Local-sync is now a built-in agent, with `--create-dir` and `--create-project` flags

### Bug Fixes

- CLI: Resource table now shows full UUIDs instead of partial IDs

---

## v0.99.11 (2026-06-09)

### New Features

- Added `-o apply` flag to all `ud get` commands and `ud describe comment/income` for direct apply-compatible output, enabling easier piping and automation

### Bug Fixes

- Fixed agent mention dropdown not refreshing properly due to stale-while-revalidate caching

---

## v0.99.10 (2026-06-09)

### New Features

- Notes can now be accessed by note ID alone — no need to specify the parent task ID for read, update, or delete operations
- New `ud describe note` command to view note details and export in apply-compatible format

### Improvements

- Simplified `ud delete note` to accept just a note ID instead of requiring both task ID and note ID

---

## v0.99.9 (2026-06-07)

### New Features

- Resource preview now supports .dataflow.json file format
- Double-click to edit task title (single-click on mobile)
- Paste image and file upload in task comment sidebar
- New builtin dataflow-creator agent

### Improvements

- Mobile conversations page UX: wider chat bubbles, hidden tags and external link button
- Mobile resource detail: nav buttons in separate row, single-click title editing
- Admin config nav pills scrollable on mobile
- Conversation header shows only status icon for cleaner look

### Bug Fixes

- Fixed taskId reference error in task comments

---

## v0.99.8 (2026-06-05)

### New Features

- File upload support in conversation reply and compose windows
- Conversation links: render conversation:// links and copy comment IDs for cross-referencing
- Task status selector in conversation thread header
- @mention support in conversation reply window
- Paste resource:// URI to create resource nodes in dataflow diagrams

### Bug Fixes

- Fixed mention dropdown opening direction in conversation reply
- Fixed resource node missing default dimensions preventing image rendering
- Fixed feature toggle not appearing in admin system config page

---

## v0.99.7 (2026-06-03)

### New Features

- Elements Panel: new architecture diagram capabilities
  - Icon nodes with built-in AWS, Azure, and Lucide icon libraries in a 2-level sidebar
  - Icon style customization: SVG stroke, fill, and border colors
  - Enhanced group nodes with icons, style presets, and nested group support
  - Architecture import format (Format A+) with nested groups
- Admin toggle for public task sharing
- Inline HTML resource rendering via resource:// protocol in markdown with auto-sizing, download button
- Task selector in workspace run dialog
- Exec button on task detail page

### Bug Fixes

- Fixed group z-index and drag behavior in dataflow
- Fixed icon SVG stroke color rendering
- Fixed mouse wheel scrolling in task selector dropdown
- Fixed HTML embed height issues

---

## v0.99.6 (2026-06-02)

### New Features

- AI chat now supports file attachments and voice recording input
- AI chat messages persist across page navigation — no more lost conversations

### Improvements

- Improved HTML resource preview with sandboxed rendering
- Cleaner AI chat interface with more space for conversations

### Bug Fixes

- Fixed resource preview being cut off by parent containers
- Fixed divider buttons overlapping with modals
- Fixed misaligned icons in chat input area

---

## v0.99.5 (2026-05-31)

### New Features

- Added `ud get income` command for querying income records from the CLI

### Bug Fixes

- Fixed agent-to-agent @mention delegation not working correctly in workspace sessions

---

## v0.99.4 (2026-05-31)

### New Features

- Community Skill Registry: browse, install, and share skills via `ud market` commands

### Improvements

- Mobile task detail: simplified bottom bar by moving pin and check-in into the More menu

### Bug Fixes

- AI chat input now auto-focuses when opened via Ctrl+J for immediate typing
- Fixed conversation popup displaying sidebar and extra UI instead of just the chat window

---

## v0.99.3 (2026-05-30)

### New Features

- AI chat pop-out window with Ctrl+J shortcut
- Pop-out button for conversation thread view
- Ctrl+K shortcut to focus main window
- Markdown Embeds documentation page

### Improvements

- Task detail right sidebar stays sticky on scroll
- Outline navigation targets visible elements correctly

### Bug Fixes

- Fixed todolist item path field not persisting on update
- Fixed tooltip display on AI talk page
- Updated pop-out icon to ExternalLink for clarity

---

## v0.99.2 (2026-05-30)

### New Features

- Mobile collapsible layout: Task detail and explorer pages now have collapsible sections (Session, Comments, Description, Notes, Details) with a Comments button in the bottom action bar
- AI chat suggestions: Onboarding prompts with randomized topic pool for AI assistant conversations
- Agent comment threads: Agent conversations now use comment threads instead of task description
- Scheduled jobs: Schedule agent tasks with new CLI commands and builtin skill
- Dataflow set operations: JSON field set operations (union, intersection, difference, complement)

### Improvements

- Comment status model: "Annotated" is now a final state (same level as "Resolved") for notes that don't need resolution
- Conversation page defaults to showing unresolved threads

### Bug Fixes

- Fixed AI chat message overflow on mobile screens
- Fixed workspace session reappearing after stop due to SSE race condition
- Removed duplicate Reply button in comment threads
- Fixed divider lines showing for hidden sections on mobile

---

## v0.99.1 (2026-05-28)

### New Features

- Star threads: Gmail-style star to bookmark important conversations
- Prompt & skill picker added to conversation thread input
- Optimistic update for conversation resolve toggle
- Workspace control strip in conversation thread view
- Mobile sidebar toggle for explorer page

### Improvements

- Conversation filter bar is now horizontally scrollable
- Conversation threads auto-refresh on new comment events (SSE)

### Bug Fixes

- Fixed infinite loop in CommentFeed from preference store selector
- Fixed explorer sidebar toggle overlapping with main sidebar toggle

---

## v0.99.0 (2026-05-27)

### New Features

- Explorer view: new 3-column layout with virtual folder tree, drag-to-move, and context menus
- Task paths: tasks now support hierarchical paths for folder-based organization
- AI Talk landing page: AI Talk replaces the dashboard, unified with /commands and @agent mentions
- Conversations: comments page upgraded to conversations with chat bubble UI
- Image paste in conversations: paste images directly to upload as a resource
- Inline resource images: resource:// images render inline in conversation messages

### Improvements

- Task detail page: full-width layout with actions consolidated into overflow dropdown
- Auto-switch to comments sidebar when adding a comment
- Description editor fills full container height
- Login page loads instantly using cached tier info

### Bug Fixes

- Fixed explorer path handling, command autocomplete, and prefix matching
- Fixed chat hint display with /commands and @agent
- Fixed comment count badge clipping
- Fixed first-visit tier detection

---

## v0.98.1 (2026-05-26)

### Improvements

- Comment status upgraded to three states: open/resolved/annotated for finer discussion management
- Comments page now updates in real-time via SSE — no manual refresh needed
- Selected comment thread persists in URL — page refresh preserves your position
- Thread-linked workspace session status badges are now more reliable (backed by server-side binding data)
- Workspace dialog CWD display aligned with backend resolution

---

## v0.98.0 (2026-05-26)

### New Features

- User avatars: set and display profile pictures across the app
- Dashboard focus view: quickly resume your last visited task
- Dataflow diagram: undo/redo support with toolbar buttons
- Dataflow diagram: paste plain text to create note nodes
- Drag-to-reorder fields in JSON nodes

### Improvements

- Agent mentions now include comment content for better context

### Bug Fixes

- Fixed workspace monitor tile rendering with correct session keys
- Removed artificial 9-session limit from workspace monitor
- Agent users no longer count toward loginable user limit

---

## v0.97.4 (2026-05-26)

### Improvements

- Image paste in canvas now shows a placeholder immediately with upload loading state
- After sending agent instructions, automatically navigates to the new task
- Agent session status now visible in comment thread feed
- "No daemon available" hint shown in send instructions dialog

### Bug Fixes

- Fixed legacy 'image' type canvas nodes not rendering correctly
- Fixed duplicate agent instruction requests when clicking send button rapidly
- Fixed agent list not refreshing when opening send instructions dialog

---

## v0.97.3 (2026-05-25)

### Improvements

- Added inline resolve button to comment feed sidebar for quicker resolution
- Added "Resolved" filter tab to comments page to view resolved threads
- Added reply button alongside resolve in comment thread footer

### Bug Fixes

- Fixed error toast import path

---

## v0.97.2 (2026-05-24)

### New Features

- Added duplicate button on the agent detail page to quickly create a copy of an existing agent
- Comment threads now use thread-level session routing for more accurate and contextual AI responses

---

## v0.97.1 (2026-05-23)

### New Features

- Workspace Run Dialog now shows the source of the resolved working directory (board, project, task, or default)

### Bug Fixes

- Comment SSE notifications now reach the task owner, not just the commenter
- Agent display names resolve correctly in comments and UI
- Workspace CWD correctly falls back to `~/.undercontrol/workspace` instead of showing broken paths
- Agent sessions with AgentCLI now properly deliver the initial prompt
- Workspace prompt delivery is more reliable (pattern-based detection replaces fragile debounce)
- Mentions in task descriptions are now parsed on creation
- Board and project selection are properly decoupled in workspace launcher

---

## v0.97.0 (2026-05-22)

### New Features

- New Workspace and Send Instructions shortcuts in sidebar
- Send Instructions button on agent detail page
- Agent Creator is now a builtin skill, available out of the box
- CLI: `-o apply` flag on `describe` commands for round-trip YAML export
- CLI: grouped command help output for better discoverability
- CLI: Daemon and AgentCLI are now managed resources with get/describe/delete

### Bug Fixes

- Default to Unresolved tab in comments page
- YAML parser now handles `---` inside block scalars correctly

### Upgrade Notes

- `ud get entity` renamed to `ud get entity` (old command removed)
- `ud daemon` renamed to `ud run-as-daemon`
- `ud apply note` subcommand removed
- Markdown-based apply for Skills, Prompts, AgentCLI removed (YAML only)

---

## v0.96.2 (2026-05-21)

### Improvements

- Workspace arguments are now resolved server-side for improved reliability
- Fixed agent CLI command resolution in local Electron desktop app

---

## v0.96.1 (2026-05-21)

### Improvements

- Desktop app now identifies each device by hardware UUID, enabling accurate per-device daemon management.

### Bug Fixes

- Fixed daemon connection incorrectly targeting the first registered device instead of the current one.

---

## v0.96.0 (2026-05-20)

### New Features

- **Agent Workspace Sessions** — Launch AI agent workspace sessions directly from the CLI with `ud apply workspace`, or from the UI via any workspace launcher.
- **Built-in Agents** — Two built-in agents (`@ud` for task management with skill discovery, `@agent-creator` for creating new agents) are auto-seeded on startup.
- **Prompt Preview** — Preview the fully assembled prompt before launching a workspace — see exactly what the AI agent will receive.
- **Spawn Workspace Skill** — New built-in skill enables agents to spawn additional workspace sessions.

### Improvements

- Workspace daemon selection is now optional — simpler startup flow.
- Agent configuration UI redesigned with a clearer two-column layout.
- Agent sessions reuse existing terminal windows instead of creating duplicates.

### Bug Fixes

- Fixed workspace project resolution for prefix/name matching and CWD overrides.
- Entity ID validation now correctly requires full UUIDs for project and daemon IDs.

---

## v0.95.0 (2026-05-18)

### New Features

- **Quick Note @mention agents** — Type @agent in Quick Note to send commands to AI agents.
- **Dedicated Agents page** — New "AI Agents" navigation entry for managing agent configurations.
- **Agent config enhancements** — Skills picker (badge-chip UI) and workspace defaults (daemon, tags, board, project).
- **Comment deletion** — Delete button in comments thread view.
- **CLI verb-first commands** — New `bind`, `unbind`, `link`, `unlink`, `grep` commands replacing old resource-first syntax.

### Improvements

- Renamed "Agent" to "Agent CLI" in workspace run dialog for clarity.

### Bug Fixes

- Fixed agents page navigation i18n key.
- Fixed deprecated CLI command references in docs and frontend.

---

## v0.94.0 (2026-05-18)

### New Features

- **AI Agents** — Create custom AI agents with prompts, skills, and triggers. Agents run workspace sessions with delegated access — select them in the "Run as" dropdown when starting a workspace.
- **Agent @mentions** — @mention custom agents in private tasks (not just group tasks). The mention dropdown shows built-in @ud and all owned agents.
- **Agent management page** — New "AI Agents" section in Workspaces settings for creating, editing, and deleting custom agents.
- **CLI agent management** — Manage agents via `ud get agents`, `ud describe agent`, `ud apply agent`, `ud delete agent`.

### Improvements

- Default Agent CLI selector moved into Custom Agent CLIs section for a cleaner layout.

### Bug Fixes

- Fixed mobile scroll in Skills/Prompts/History popovers.

---

## v0.93.3 (2026-05-17)

### Improvements

- **Session mention labels** — @mentioning a workspace session in comments now shows the user name and task title (e.g., `alice · Fix auth bug`) instead of a cryptic session ID. Session mentions now work in all comment inputs, not just the rich text editor.

### Bug Fixes

- Workspace session tokens now last 7 days instead of 1 hour, preventing authentication loss during long work sessions.

---

## v0.93.2 (2026-05-17)

### Bug Fixes

- Fixed workspace terminal authentication failure when the desktop app connects to a remote server. CLI commands in workspace sessions now work without needing a `--context` flag workaround.

---

## v0.93.1 (2026-05-17)

### Bug Fixes

- CLI `whoami` command now correctly respects the `--context` flag priority over environment variables.
- Desktop: Fixed PTY spawn failure by auto-rebuilding node-pty after npm install.

---

## v0.93.0 (2026-05-16)

### New Features

- **@workspace session mentions** — Mention active workspace sessions directly in comments to send input to the running session, without targeting a specific user. The mention menu shows both members and active sessions.
- **Daemon injects backend URL** — Workspace PTY environment now has the backend URL auto-injected by the daemon, ensuring CLI commands within sessions connect to the correct server.

### Bug Fixes

- CLI `--context` flag now takes priority over `UD_*` environment variables, allowing you to target a different server from inside a workspace session.

---

## v0.92.0 (2026-05-16)

### New Features

- **Knowledge graph exploration** — New `ud graph` command for visualizing task connections and knowledge base relationships.
- **Auto-updater CDN source switching** — Desktop client can now switch between R2 and Bitiful CDN for updates (Settings > About).
- **Manual update checking** — Check for desktop app updates manually from the Electron client.

### Improvements

- Workspace terminal output cache now uses a memory-capped ring buffer, evicting the oldest session first when the cap is reached.

### Bug Fixes

- CLI `--context` flag now correctly overrides workspace environment variables, allowing you to target a different server from inside a workspace session.
- Auto-updater now has a 15-second timeout to prevent infinite spinning when the update server is unreachable.
- Workspace init simplified — daemon uses its own backend URL instead of receiving it from the frontend.

---

## v0.91.0 (2026-05-16)

### New Features

- **Built-in @ud agent** — Workspace sessions now use a built-in soul prompt for smarter AI-assisted task execution.
- **Multi-session list** — New multi-session list UI in task detail sidebar, showing all linked workspace sessions.
- **Comment resolve/unresolve** — Resolve and unresolve buttons added to comment thread view.
- **Window type color coding** — Color-coded left border for different window types in workspace picker.
- **Session creator indicator** — Bot/User icon shown across all session views to identify who created each session.
- **`ud whoami` command** — New CLI command for auth diagnostics and troubleshooting.

### Improvements

- Main window title now shows "Main Window: \<page name\>" for better clarity.
- Agent sessions now properly inject auth tokens and API URL.

### Bug Fixes

- Agent reply templates no longer show "wk:" prefix.
- Comment creator correctly shows agent identity instead of delegated human user.
- Agent prompts correctly placed in user prompt position.
- Fixed infinite re-render from Zustand selectors returning new object refs.
- Fixed agent session initialization with empty commands.

---

## v0.90.0 (2026-05-14)

### New Features

- **Comments feed page** — New cross-task comment feed with threaded discussions and inline replies.
- **Projects page** — Standalone projects page with list-detail layout, showing linked tasks per project.
- **Task-project linking** — Project picker in task detail view to link tasks to projects.
- **Local directory project linking** — Link local directories to projects via `ud.projects` file.
- **Collapsed sidebar menu** — Collapsed sidebar shows expandable chevron for hidden navigation items.
- **License info in admin** — License expiry warning banner and license info section in System Config.
- **Tag length increase** — Tags can now be up to 50 characters (previously 20).

### Bug Fixes

- Thread replies reset properly when switching between comments.
- Comment feed shows individual threads instead of grouping by task.
- Replies filtered from comment feed — only top-level threads shown.

---

## v0.89.0 (2026-05-13)

### New Features

- **Agent workspace sessions** — @ud mention on tasks now auto-initializes a workspace session running Claude Code, enabling AI-assisted task execution.
- Admin user management page now shows user types (human vs agent).

### Bug Fixes

- @ud agent is now always mentionable on private tasks (no longer requires group membership).
- Daily note carry-over no longer adds an unwanted "Carried Over" heading.
- Daily note carry-over now preserves original indentation of items.

---

## v0.88.4 (2026-05-12)

### New Features

- @workspace mention now works in task descriptions and notes (previously comments only).
- Quick notes can now be saved empty with an automatic datetime title.

### Bug Fixes

- Fixed anchored comments from notes showing wrong section and color.
- Fixed @workspace replies in descriptions/notes incorrectly appearing as anchored comments.

---

## v0.88.3 (2026-05-11)

### Bug Fixes

- Fixed workspace terminal window occasionally crashing on launch.

---

## v0.88.2 (2026-05-11)

### Improvements

- Workspace dialog board selector now shows all boards with grouped display.

### Bug Fixes

- Kanban search now supports short ID prefix matching.
- Sidebar elements are properly dimmed when dialog overlay is open.
- Fixed skills page scroll on mobile.
- Fixed missing /v1 in localfs presigned URL paths for self-hosted file access.
- Fixed @mention background styling in comments.
- Fixed comment anchors incorrectly marked as missing due to highlight timing race.

---

## v0.88.1 (2026-05-10)

### Bug Fixes

- Fixed SQLite database migration errors that could occur during upgrades for self-hosted users.

---

## v0.88.0 (2026-05-10)

### New Features

- **Task Comments** — Add threaded comments to tasks with replies, resolve/unresolve, and real-time sync. Quote text from description or notes to create anchored comments that highlight the referenced content.
- **@User Mentions** — Mention teammates in comments with `@username`. Mentioned users receive notifications.
- **Keyboard Shortcut** — Press Cmd/Ctrl+Enter to quickly submit comments, replies, and edits.
- **Notification Badge** — See unread notification count on the user icon when the sidebar is collapsed.
- **AI Assistant Tools** — Chat with the AI assistant to update tasks, create notes, update descriptions, and link tasks directly from the conversation.
- **Welcome Board** — New users get a starter board with a sample task to help them get started.
- **Group Budgets & Expenses** — Budgets and expenses now support group ownership for team collaboration.

### Improvements

- Skills list refreshes automatically after external changes in the workspace prompt picker.
- Dark mode highlights use brighter colors for better readability.
- Stale anchor indicator shown when quoted comment text is no longer found in content.

### Bug Fixes

- Fixed docs page header being hidden behind iOS Safari chrome after navigation.
- Fixed board membership check for shared boards with scope tags.

---

## v0.87.0 (2026-05-09)

### New Features

- **Workspace launcher board selector** — Board selector added to the global workspace launcher with cross-window shortcut
- **Cross-window sync** — Workspace windows now sync state in real-time via BroadcastChannel
- **AI assistant board integration** — AI assistant automatically adds tasks to the board when board context is provided

### Improvements

- AI chat can now correctly find tasks by ID
- Updated AI chat suggestion hints for better task tool discovery
- Run dialog now fetches latest skills when opened

### Bug Fixes

- Fixed skills not refreshing in the Run dialog

---

## v0.86.0 (2026-05-08)

### New Features

- **Dashboard editor action bar** — Action bar defaults to expanded for better editing experience
- **Custom scrollbars** — Dashboard editor uses OverlayScrollbars for a smoother look
- **Welcome guide** — New users get a welcome guide seeded in the dashboard editor after onboarding

### Improvements

- Dashboard editor uploads images to server instead of base64 inline
- Auth system upgraded to stateless OIDC-aligned architecture with zero DB queries per request

### Bug Fixes

- Fixed clear button confirmation dialog styling and interaction
- Fixed mobile editor viewport height and scroll issues
- Fixed dashboard switcher visibility on mobile browsers
- Fixed dashboard view switcher being pushed by content instead of staying fixed at bottom

---

## v0.85.2 (2026-05-08)

### Bug Fixes

- Fixed duplicate SSE connection in workspace windows
- Improved token refresh stability
- Fixed UserCreated event retention to persist indefinitely

---

## v0.85.1 (2026-05-06)

### Improvements

- Refined dashboard layout with 6-pillar grid homepage restructure
- Save button on floating toolbar now highlighted in primary color for better visibility
- Improved mobile voice recording UI
- Remembered password now encoded in base64 for better security

### Bug Fixes

- Fixed nested scroll container breaking editor height
- Fixed dashboard editor not filling available height in Electron
- Fixed focus not returning to terminal after prompt picker closes
- Fixed incorrect audio hint text about combined audio+text support
- Fixed legacy plaintext remembered password handling

---

## v0.85.0 (2026-05-06)

### New Features

- **Dashboard AI chat** — AI chat integrated into the dashboard with AI provider selector
- **Dashboard view switching** — Simplified dashboard with workspace-style switching between editor and chat, with floating save toolbar
- **All-in-One Docker deployment** — Single Docker image for easier self-hosted deployment
- **Delete budget/account** — Delete buttons with confirmation dialogs on budget and account pages
- **Global Error Boundary** — React Error Boundary prevents white-out page crashes

### Improvements

- Error boundary navigates to dashboard instead of full page reload
- Contact link added to error boundary page for easier support

### Bug Fixes

- Fixed AI provider selector not showing with a single provider
- Fixed AI providers loading without needing to open floating chat window
- Fixed keyboard shortcut hint visibility in dashboard chat view
- Fixed editor/chat flicker on view switch
- Fixed dashboard view switching height issues
- Fixed terminal losing focus after selecting a prompt

---

## v0.84.0 (2026-05-03)

### New Features

- **Floating content window** — Pin document content as an always-on-top window in the desktop app for easy reference
- **Workspace prompts sync** — Prompts are now stored on the server and synced across devices (migrated from local storage)
- Task sharing now includes the task title in the share message

### Bug Fixes

- Fixed floating viewer button placement — moved from bubble menu to the floating actions toolbar
- Fixed input method (IME) state preservation when viewing content in TiptapViewer

---

## v0.83.0 (2026-05-02)

### New Features

- **AI Quick Create** — Create tasks using voice recording with audio transcription, accessible from the sidebar
- **Inline audio player** — Play audio files directly in the resource preview dialog
- **AI Provider capabilities** — Configure chat/vision/transcription capabilities per provider; system automatically selects provider based on capabilities
- **Real-time task sync** — Other tabs/clients instantly see newly created tasks via SSE
- **Daemon selection preference** — Prefers online daemons and remembers your last selection

### Improvements

- Collapsed sidebar quick actions use a more compact 2-column grid layout

### Bug Fixes

- Fixed board view not updating correctly on SSE task_created events
- Fixed transcription using wrong model/language settings
- Fixed AI provider form losing draft when accidentally dismissed
- Fixed test connection using wrong endpoint for transcription-only providers
- Fixed vision-to-task status format producing invalid status values

---

## v0.82.2 (2026-05-01)

### Bug Fixes

- Fixed workspace monitor terminal display — tiles now properly fit their container with horizontal scrolling support for wide content

---

## v0.82.1 (2026-05-01)

### Bug Fixes

- Fixed register/reconnect button not always showing for local daemon connections
- Fixed command encoding using incorrect platform when no remote daemon is selected

---

## v0.82.0 (2026-05-01)

### New Features

- **Monitor Page** — New multi-session TTY dashboard with 3×3 grid layout and full-viewport focus mode
- **Grid Navigation** — Arrow keys and Enter for navigating between session tiles, click-to-select with session controls
- **Session Controls** — Collapsible screenshot, arrow key, and Enter signal buttons; hidden in focus mode for more terminal space
- **Quick Actions** — New session buttons on monitor and workspaces pages, settings button for quick navigation
- **Local Daemon** — Added local daemon execution option in execution dialogs

### Bug Fixes

- Fixed task creation with selected text — now uses selected text as description, first characters as title
- Fixed click propagation on controls causing unintended tile deselection
- Fixed i18n key for create task button label and toast

---

## v0.81.1 (2026-05-01)

### Improvements

- Improved real-time sync stability — daemon SSE connections now properly handle duplicates and prevent reconnect loops

---

## v0.81.0 (2026-04-30)

### New Features

- **Projects management** — create, edit, and delete projects; link them to boards and workspaces as working directories
- **Project selector** — choose a project in board settings, execution dialog, and global workspace launcher (Cmd+E)
- **Project CLI support** — manage projects via `ud project get/describe/apply/delete` commands
- **Skills section** — workspace page now includes a Skills area with sidebar navigation link
- **Workspace page redesign** — sidebar navigation layout, consistent with the profile page
- **Auto daemon registration** — idempotent registration on startup, no manual action needed

### Improvements

- Board selector always visible with "None" option, easily resettable
- Explicit CWD input in execution dialog with auto-preselection from board's linked project
- Default agent dropdown shows resolved name (e.g., "Default (Claude Code)")
- Project dropdown shows only project name, not full path
- Hide Register button when device already has a daemon, show short ID
- "This device" badge and reconnect button on daemon list
- Configure links navigate to /workspaces instead of /profile

### Bug Fixes

- Fixed daemon SSE connecting to wrong machine
- Fixed stale daemon ID not cleared when daemon deleted externally
- Fixed reconnect button not triggering SSE stream reconnect

---

## v0.80.0 (2026-04-29)

### New Features

- **Knowledge graph enhancements** — toggle tag nodes on/off, clearer parent-subtask relationship visualization
- **Task navigation history** — Obsidian-style back/forward navigation for seamless jumping between tasks
- **Sidebar "More" section** — collapsible area housing Calendar, Graph, and Timeline views
- **AI chat improvements** — multi-keyword OR search, create_task and list_boards tools
- **Admin onboarding config** — configure the default landing page for new users after onboarding
- **Default user groups** — admins can auto-assign default groups to newly registered users
- **Global workspace shortcut** — Cmd+E to launch workspace from any page
- **Floating prompt picker** — prompt picker button pinned to workspace TaskPanel viewport

### Improvements

- Cleaner sidebar: Tags and Advanced Search moved to Cmd+K command palette
- Quick Actions replaced with a 2×2 shortcut grid
- Admin page consolidation: Users/Roles/Groups/Onboarding in one view
- Minimal icon badge styling
- Actionable suggestion buttons in empty AI chat state

### Bug Fixes

- Fixed invisible legend line color for parent/subtask links in graph view
- Fixed sidebar "More" section not foldable on secondary routes

---

## v0.79.0 (2026-04-28)

### New Features

- **Remote terminal streaming** — view workspace terminal output in the browser in real-time; late-joining viewers automatically receive recent output history
- **Terminal output caching** — terminal output is cached server-side, so refreshing the page restores your terminal view

### Improvements

- Clearer error message when uploading empty (0-byte) files

### Bug Fixes

- Fixed duplicate API calls on the skills page
- Fixed terminal display issues (column width, font size, horizontal scrolling, background color)

---

## v0.78.1 (2026-04-27)

### New Features

- **View mode switcher** — switch between tree, list, and kanban views on board pages

### Improvements

- Minimal view mode switcher design — icon-only, no border

### Bug Fixes

- Fixed status icon alignment with task title in saved query rows
- Fixed status icon not vertically centered in tree view
- Fixed layout rendering issues in conditional view modes

---

## v0.78.0 (2026-04-27)

### New Features

- **Three-column layout** — desktop task list now supports a three-column view with sidebar, list, and detail panes side by side
- **Tree panel quick create** — create tasks directly from tree panel column headers with inline editing
- **Inline navigation** — back/forward navigation within the task detail panel without leaving the page

### Performance

- Zero-lag task switching — cache-first rendering with progressive background refresh
- Optimized large list rendering with useDeferredValue and memo

### Bug Fixes

- Fixed token refresh race condition causing request failures after long sessions
- Fixed CLI upload failing on Windows with "Incorrect function" error
- Fixed storage usage endpoint crash when owner_id is short
- Fixed login page tier-info request blocking indefinitely (added 3s timeout)
- Fixed CLI section not showing install info on web (was desktop-only)
- Fixed trailing slash in API base URL causing CLI request errors
- Fixed columns not scrolling independently in three-column layout
- Fixed data migration tool compatibility for v0.55.0 → v0.77.1 upgrades

### CLI Improvements

- Added kubectl-style usage examples and --context flag documentation to all commands

---

## v0.77.1 (2026-04-26)

### Bug Fixes

- Fixed a crash that could occur when SQLite encountered malformed JSON in task metadata
- Fixed shareable links incorrectly using the browser's URL instead of the configured frontend URL

---

## v0.77.0 (2026-04-26)

### New Features

- **Board name editing** — rename boards directly in board settings
- **Mobile workspace switcher** — floating trigger for quick workspace switching
- **Kanban advanced filters** — IS NULL / IS NOT NULL operators for custom fields
- **PowerShell preview** — human-readable script display in command preview
- **Audit log TTL** — per-event-type retention for self-hosted deployments

### Improvements

- Redesigned landing page with orchestration diagram and Three Pillars section
- Better mobile experience with enhanced sidebar trigger transparency
- Faster note sync — skips unchanged writes using timestamp comparison

### Bug Fixes

- Checkbox toggle in view mode now properly saves to backend
- Workspace switcher no longer overlaps sidebar trigger on mobile
- Save-as-prompt button visible on mobile in history popover
- Fixed clipboard handling in workspace dropdown
- Command preview sections now scroll when content overflows

---

## v0.76.1 (2026-04-25)

### Bug Fixes

- Fixed custom field values being lost when dragging cards between kanban columns
- Fixed column removal dialog translation

### Improvements

- Replaced browser native confirm dialog with styled dialog for kanban column removal

---

## v0.76.0 (2026-04-25)

### New Features

- **Folder sharing** — share resource folders with groups, with cascading file access. Resource list now shows Group and Permission columns
- **Session skill selector** — reorganized session controls with a skill selector for quick access
- **Auto-expanding input** — session input area grows automatically with content, plus a clear (X) button

### Improvements

- Image sizes now persist correctly across markdown round-trips using Obsidian-compatible pipe format (`![alt|size](src)`)
- Cleaner session UI: shorter prompt/history labels, hidden scrollbar for single-line content

---

## v0.75.0 (2026-04-24)

### New Features

- **Dataflow pipe relationship markers** — pipes now support description labels and endpoint markers (arrow, one, many/crow's foot) for ER-diagram-style relationships
- **Terminal button creates task** — kanban terminal button auto-creates a task and initiates a workspace session
- **Session prompt history** — prompts can be saved to workspace prompt library for reuse
- **Workspace settings drawer** — workspace configuration moved from profile page to a settings drawer on the workspaces page

### Improvements

- Monitor icon now visible on kanban page for all clients (not just Electron)
- Board name shown in selector with resolved path displayed separately in CWD section
- Pipe markers refined: subtler sizes, better defaults, improved crow's foot direction

### Bug Fixes

- Fixed NoteNode drag during text selection
- Fixed reconciliation overriding awaiting_input status back to running
- Fixed CWD resolution for multi-board tasks in exec dialog

---

## v0.74.0 (2026-04-24)

### New Features

- **AI Chat tool calling** — the AI assistant can now search your tasks semantically during conversations
- **Multi-board tasks** — tasks can belong to multiple boards; board selector dropdown when opening workspaces
- **Workspace actions** — screenshot, interrupt, and check status directly from the workspaces page
- **File attachments in kanban preview** — view attached files without opening the full task detail
- **Dashboard edit mode** — cleaner interface for customizing your dashboard layout
- **Kanban list actions** — "Add to Board" and "Delete" buttons in the expanded list view

### Improvements

- Hooks now install automatically on all boards (no more per-board toggle)
- Workspace sessions transition optimistically from pending to running
- Custom field labels display with `cf.` prefix for clarity
- Resolved working directory shown in workspace dialog with copy support

### Bug Fixes

- Fixed checkbox toggle creating duplicate history entries
- Fixed CWD resolution fallback when no project directory is configured
- Fixed AI search tool query building for keyword searches
- Fixed migration error message to include environment variable instructions

---

## v0.73.4 (2026-04-22)

### New Features

- Share daemons with groups for workspace collaboration
- Show task title instead of raw ID in workspace sessions
- Multi-skill selection in exec dialogs

### Bug Fixes

- Fixed hooks ordering crash on task detail page
- Show empty state placeholder in workspace task panel when no content
- Copy full share message for existing links instead of just URL

---

## v0.73.3 (2026-04-22)

### Bug Fixes

- Fixed workspace screenshots appearing in attachment lists
- Screenshot button now shows a spinner while capturing
- Improved performance by reducing redundant API calls for resources

---

## v0.73.2 (2026-04-22)

### Improvements

- Workspace screenshots now display in a dedicated scrollable gallery with highlight animation
- Workspaces moved to the Tasks section in the sidebar for quicker access

### Bug Fixes

- Fixed editor bubble menu appearing when image or code block is selected
- Fixed images being auto-selected when opening the content viewer
- Sidebar navigation now preserves the selected board
- Fixed markdown checkbox toggling
- Fixed duplicate screenshot uploads in desktop app

---

## v0.73.1 (2026-04-21)

### Bug Fixes

- Fixed tier detection not working correctly in Electron desktop app and when using custom server URLs

### Improvements

- Server configuration page now displays the current tier name

---

## v0.73.0 (2026-04-21)

### New Features

- **Dashboard Widget Customization** — Hide or show dashboard widgets to personalize your workspace
- **Poster Name in Task Notes** — Task notes now display the poster's name for better attribution

### Bug Fixes

- Fixed workspace window title not syncing with tracked task name
- Fixed heartbeat, stale session cleanup, and screenshot upload issues in workspace
- Fixed missing stop button for pending workspace sessions on mobile
- Fixed excessive session polling causing unnecessary API calls

---

## v0.72.1 (2026-04-20)

### New Features

- **Mobile Workspace Shortcut** — Access workspace sessions directly from the task bottom action bar — quickly scroll to an active session or start a new one

### Bug Fixes

- Fixed daemon SSE connection reliability in desktop app — reconnection now works correctly after network interruptions

---

## v0.72.0 (2026-04-20)

### New Features

- **Workspace Screenshots** — Capture workspace window screenshots and attach them as task notes
- **Workspace Session Sidebar** — View workspace session status and duration in the task detail sidebar
- **Session Interrupt & Status Check** — New interrupt and check-status buttons for workspace sessions
- **Session Auto-Recovery** — Automatic session reconciliation on daemon reconnect
- **Daemon Rename** — Inline rename UI for daemon management

### Bug Fixes

- Fixed control character handling in terminal input
- Fixed daemon SSE stream premature disconnect
- Fixed incorrect daemon connection error code
- Fixed "Register this device" button incorrectly showing in web UI

---

## v0.71.0 (2026-04-19)

### New Features

- **Web Workspace Viewer** — View and manage AI agent workspaces directly from the browser
- **Daily Note Navigation** — Daily notes link to the previous day with auto pin/unpin
- **Remote Daemon Workspaces** — Desktop app connects to remote daemons for AI workspace orchestration via SSE
- **Workspace Status CLI** — New `ud workspace status` command to check workspace state
- **Workspace Input Relay** — Send user input to workspace PTY sessions
- **Mobile Kanban Menu** — Kanban header actions collapsed into hamburger menu on mobile

### Bug Fixes

- Fixed daemon connector authentication flow
- Fixed workspace status display for pending/completed/stopped states

---

## v0.70.0 (2026-04-18)

### New Features

- **Notification System** — Subscribe to tasks you care about and get notified when they change status or are updated
- **Daily Note** — Quickly create a daily note with automatic checkbox carry-over (Alt+D / Option+D shortcut)
- **Paste-to-Note** — Paste content anywhere on the task panel to append it to notes
- **"Create & Link" Button** — Create new tasks directly from subtask and linked task dialogs
- **Copy Resource Markdown Link** — Copy resource ID as a markdown link from all resource views
- **Outline Improvements** — Renamed outline with description as the first item for quick navigation
- **Pending Resource Management** — Interactive dialog replaces background cleanup with automatic stale resource removal

### Bug Fixes

- Fixed tag queries using an invalid operator
- Fixed macOS Alt key producing special characters instead of triggering shortcuts
- Fixed outline showing when no notes exist
- Improved paste hint styling with i18n support

---

## v0.69.2 (2026-04-16)

### New Features

- **AI Image to Markdown** — Convert images to markdown text using AI vision
- **Unified System Config Page** — All config categories in one scrollable view showing runtime values, env var names, and CLI flag names

### Improvements

- Board default columns: removed Draft column, moved Recent Created/Updated to end

### Bug Fixes

- Fixed mermaid diagram elements missing in fullscreen preview
- Fixed create task dialog size not aligned with task preview modal
- Fixed CreateBoardDialog default columns not matching backend defaults

---

## v0.69.1 (2026-04-16)

### New Features

- **Mobile Task Graph & Heatmap** — Calendar heatmap and knowledge graph now available on mobile list page
- **Default Board Columns** — Added "Recent Created", "Draft", and "Recent Updated" default columns with fold-all toggle
- **Exec Dialog** — Replaced kanban terminal dropdown with a more intuitive exec dialog
- **Editor Image Upload** — Added image upload button to markdown editor toolbar

### Improvements

- Renamed "Task Graph" to "Knowledge Graph" for clearer naming

### Bug Fixes

- Fixed white screen crash when using external toolbars
- Fixed graph fullscreen not working properly on mobile devices
- Fixed markdown editor toolbar positioning and z-index issues

---

## v0.69.0 (2026-04-15)

### New Features

- **Admin Storage Management** — New dedicated storage page in admin panel showing per-user storage usage and allowing individual quota overrides
- **Scope Tags** — Default Tags renamed to Scope Tags with automatic `board:` prefix auto-fill when creating new tags

### Improvements

- Shareable links now use configurable frontend URL, improving link sharing in Electron desktop app

### Bug Fixes

- Fixed dark mode flash on app startup — theme is now applied immediately from cache
- Fixed dark mode not applying to static loading screen
- Fixed dark mode theme not syncing across all Electron windows
- Fixed storage quota config not showing in admin system config page

---

## v0.68.1 (2026-04-14)

### New Features

- **AI Chat Quick Action** — Added AI chat shortcut to sidebar for faster access to the AI assistant
- **AI Language Adaptation** — Built-in AI skills now reply in the user's preferred language

### Improvements

- Redesigned Create Task Dialog with flat/minimal design language, improved tag input and padding alignment
- Dialog now uses 80% of viewport width and height for more editing space
- Mobile skill page uses master-detail layout with auto-hidden header bar when viewing details
- Mobile QuickNote toolbar moved to sticky top position with safe-area bottom padding

### Bug Fixes

- Fixed task creator showing the board owner instead of the actual requester
- Fixed username not resolving correctly across groups in share tooltips
- Fixed markdown content being cleared when resource URL resolution fails
- Fixed share links using incorrect domain in Electron
- Fixed resource group ownership when creating tasks on shared boards

---

## v0.68.0 (2026-04-13)

### New Features

- **Local Docker Deployment** — Ready-to-use docker-compose setups for self-hosted deployment with built-in `/api` nginx reverse proxy

### Bug Fixes

- Fixed Docker image requiring rebuild when changing API domain (now domain-agnostic)
- Fixed connection status indicator failing on unexpected server responses

### Upgrade Notes (Self-Hosted)

- New `deployment/docker-local-sqlite/` and `deployment/docker-local-postgres/` directories provide one-command docker-compose setups
- Docker frontend image no longer needs `VITE_API_URL` at build time — configure the API URL at runtime via nginx

---

## v0.67.2 (2026-04-13)

### New Features

- **Admin Skills Management** — Admins can now browse, edit, create, and delete system skills from the Admin panel
- **Built-in PM Skill** — New `ud-pm` system skill for batch PM review and task implementation

### Improvements

- Admin-customized system skills now persist across backend restarts

### Bug Fixes

- Fixed command preview not matching the actual executed command
- Fixed skill seeding issue on fresh installations

---

## v0.67.1 (2026-04-12)

### New Features

- Added `ud explain` command for viewing resource schema documentation directly from the CLI

### Improvements

- CLI skill commands now accept `skill`/`skills` aliases for all kubectl-style operations (get, describe, delete)

### Bug Fixes

- Fixed app crashes caused by localStorage QuotaExceededError on devices with limited storage

---

## v0.67.0 (2026-04-12)

### New Features

- **Skills Management** — New skills page for creating, editing, and managing reusable prompts and instructions with a WYSIWYG rich text editor. System-level built-in skills are visible to all users.
- **Pinned Tasks Dashboard Widget** — Pin important tasks and view them directly on the dashboard, with empty state guidance.
- **Agent CLI Command Preview** — See the exact command that will be executed before running an agent, with copy button and skill selector.
- **Agent CLI "Configure..." Option** — Quick access to agent configuration from all agent tool dropdowns.
- **Init Skill Support** — Agent CLI commands can now use init skills for workspace setup.

### Improvements

- Skill detail view with inline editing and read-only mode
- Side-by-side config + execute preview in agent CLI dialog
- Skill usage guidance shown in task detail view
- Right sidebar widened for full task ID display

### Bug Fixes

- Remove back/forward navigation buttons from main container
- Fix skill editor content scrolling and toolbar behavior

---

## v0.66.1 (2026-04-11)

### Bug Fixes

- Fix inline editor toolbar and floating action bar to restore correct floating style

---

## v0.66.0 (2026-04-11)

### New Features

- Inline invite code generation and deploy options on registration page
- Task status switcher in workspace window top bar
- Show created_by in task metadata section
- Links in workspace task panel open in new tab/window
- Kubernetes Helm deployment doc added to in-app docs

### Improvements

- Collapse metadata section by default on mobile task preview
- Redesign condition builder to stacked two-row layout
- Make kanban board selection lists scrollable

### Bug Fixes

- Improved registration UX for invite code flow and login redirect
- Redirect to dashboard instead of kanban after login
- Fix editor flash when entering/switching edit mode
- Fix editor toolbar and floating action bar positioning on mobile
- Fix onboarding skip button reliability
- Allow holding Ctrl+D/Ctrl+U for continuous fast scrolling
- Fix layout shift in kanban column condition editor
- Fix link routing in workspace task panel

---

## v0.65.3 (2026-04-10)

### Improvements

- Deployment pipeline improvements

---

## v0.65.2 (2026-04-09)

### Bug Fixes

- Internal stability improvements

---

## v0.65.1 (2026-04-09)

### New Features

- **China Mainland Download**: Added dedicated download button for users in mainland China

### Performance

- Eliminated flash when toggling to edit mode
- Deferred off-screen note editors for faster task page loading
- Fixed duplicate queries and N+1 issue for faster task detail loading
- Fixed 5-second navigation delay on task detail pages

### Bug Fixes

- Fixed mobile editor action bar overlapping with chat button
- Fixed editor toolbar frozen at left when scrolling horizontally
- Fixed toggle button not staying pinned when scrolling in editor
- Removed "Loading images..." indicator that caused layout shift on task navigation

---

## v0.65.0 (2026-04-08)

### New Features

- **Sidebar Outline Highlight**: Auto-track and highlight the active note section based on viewport visibility
- **Scroll-to-End Button**: Quick scroll-to-bottom button in the floating action bar
- **Keyboard Edit Shortcut**: Press `i` to enter Markdown edit mode (Vim-style insert)
- **Kanban in New Window**: Open kanban boards in a new Electron window
- **Image Size Controls**: S/M/L image size options in the TipTap editor
- **Dataflow Diagram Interaction**: Click to select/deselect nodes and edges in dataflow diagrams
- **Timer Commands**: `/timer` commands available in the command palette
- **Short ID Search**: Search tasks by short ID in the command palette
- **Mobile Toolbar Toggle**: Collapse/expand mobile editor toolbar with pinned image button
- **CLI `ud apply`**: Create resources from YAML files with `ud apply -f`, auto-detects notes
- **User-Defined Skills**: Store custom skills in the config directory

### Improvements

- **Task Detail Performance**: Lazy-loaded heavy components, deferred TipTap editors and note rendering, individual selectors — faster navigation and rendering
- **Simplified Timer**: Merged into single `/timer` command with toast feedback

### Bug Fixes

- Fixed tag suggestions overlapping the confirm button
- Fixed `i` shortcut editing the wrong section
- Fixed Mermaid fullscreen SVG flashing on zoom/scroll
- Fixed partial UUID search not working in command palette
- Fixed mobile editor toolbar not sticking to viewport bottom
- Fixed Ctrl+D/U Vim shortcuts scrolling the wrong container

---

## v0.64.0 (2026-04-07)

### New Features

- **Anthropic AI Provider**: Configure Anthropic as a backend AI provider alongside OpenAI, with simplified provider type selection
- **Task Switcher**: Quickly switch between tasks from the workspace window
- **Workspace Top Bar**: Shows status icon, task ID with copy button for quick reference
- **Vim Navigation**: Ctrl+D/U for half-page scroll, Ctrl+O/I for task visit history
- **Mermaid Fullscreen**: View mermaid diagrams in fullscreen mode
- **CLI Improvements**: `--folder` flag for uploads; `ud get` defaults to 20 results with pagination
- **Audit Cleanup**: Automatic audit log cleanup based on retention settings
- **Landing Page Redesign**: New "Private AI Butler" positioning with refreshed design

### Bug Fixes

- Fixed CLI upload folder path handling
- Fixed Chinese translation for API key expiry option
- Fixed task loading when not in local cache
- Fixed Ctrl+O/I to navigate task history instead of browser history
- Fixed landing page font weights

---

## v0.63.3 (2026-04-05)

### Improvements

- Real-time sync connections now auto-refresh every 30 minutes to prevent stale connections

### Bug Fixes

- Fixed real-time sync connections dropping unexpectedly
- Fixed task updates via real-time sync potentially causing data inconsistency

---

## v0.63.2 (2026-04-05)

### Bug Fixes

- Fixed task not refreshing when description is updated via SSE

---

## v0.63.1 (2026-04-05)

### Improvements

- Share message now uses code entry page URL with simplified sharing instructions
- "Open in new tab" replaces remote workspace action for easier multi-window workflow
- Redesigned login pages with refined flat minimal design and decorative guide lines
- Share message button is now more prominent and includes both sharing links
- Real-time updates now work in Electron workspace windows

### Bug Fixes

- Fixed find-in-page in desktop app: input losing focus after first character and stuck matches
- Fixed group invite links not being reusable (removed count limit)
- Fixed share message saying "content" instead of "task"

---

## v0.63.0 (2026-04-05)

### New Features

- Desktop: Find-in-page with Ctrl+F / Cmd+F
- CLI: New `ud local-sync` command with watch mode for real-time sync
- CLI: New `api-resources` command, enhanced help text
- CLI: `/task` alias routes and `X-UD-Channel` audit header
- CWD input field in ad-hoc execution dialog
- "Copy Share Message" button in share dialog
- Cmd+R shortcut to run task
- Restored Cmd+W close window shortcut

### Documentation

- Rewritten Quick Start page covering all entry points
- Rewritten Domain Language page with all app domains
- New Custom Clients doc page
- New Everything-as-Code doc page
- Task concept added to onboarding welcome task
- Reorganized docs sidebar structure

### Bug Fixes

- Fixed task detail sidebar height and scrollbar issues
- Fixed sidebar bottom items cut off on mobile
- Fixed docs sidebar not scrollable on mobile
- Fixed inline editor toolbar scrollable on mobile, removed popup editor
- Fixed global scrollbar CSS affecting xterm viewport
- Fixed dashboard charts -1 dimension warning
- Fixed dataflow node connection handles on fold/collapse
- Fixed parent sidebar items: click name navigates, chevron toggles fold
- Renamed "Run Ad-hoc" to "Run"

---

## v0.62.1 (2026-04-03)

### Improvements

- CLI: AI work sessions now record notes more frequently and promptly, ensuring knowledge and progress survive session interruptions

### Bug Fixes

- Fixed Windows desktop app icon background transparency

---

## v0.62.0 (2026-04-03)

### New Features

- Quick Note: Gmail-style popup with Ctrl+N shortcut, full-screen Markdown editor, sidebar entry, mobile FAB collapses on scroll
- Command Palette: SSE-based real-time cache invalidation, shows both Title/Grep search modes
- Window Management: Ctrl+Q shortcut to cycle between windows with MRU ordering
- Dataflow: resizable image/note nodes, "Copy for AI" export
- Global default AI agent setting
- "Back to App" button for authenticated users on public pages
- Updated app icons

### Bug Fixes

- Fixed command palette stale cache, task deletion cleanup
- Fixed Quick Note editor stability (tiptap lifecycle, mount guards)
- Fixed dataflow pipe delete button not working
- Fixed Markdown simplified URL rendering
- Fixed mobile FAB positioning
- Fixed Windows Codex launch path resolution
- Fixed dataflow node viewport placement

---

## v0.61.3 (2026-04-02)

### Bug Fixes

- Fixed task detail sidebar scrolling — sidebar is now independently scrollable with hidden scrollbar

---

## v0.61.2 (2026-04-02)

### Improvements

- CLI: `ud describe task` output now clarifies it already includes all notes

### Bug Fixes

- AI provider configuration now defaults to OpenAI-compatible type and no longer auto-fills endpoint URLs

---

## v0.61.1 (2026-04-02)

### Improvements

- AI: configure AI providers directly from AI-powered panels without navigating to settings

---

## v0.61.0 (2026-04-02)

### New Features

- Dataflow: raw editor mode for editing node JSON data directly
- Dataflow: cross-diagram copy/paste for nodes
- Dataflow: multiple connections for note/image nodes
- Kanban: open multiple terminal windows from column dropdown
- CLI: kubectl-style note commands (get notes, apply note, delete note)
- CLI: board name lookup, get columns, and query board commands

### Bug Fixes

- Fixed command palette navigation always targeting main window in Electron
- Fixed Ctrl+Q now shows all windows including editors
- Fixed kanban column search tooltip showing "Batch actions" instead of "Search in column"
- Removed non-functional column search button
- Unified startup loading screens to match flat/minimal design

---

## v0.60.0 (2026-04-01)

### New Features

- Draw.io editor: explicit Save / Save & Close buttons with quit confirmation dialog
- Ctrl+S triggers save & close in all resource editors
- Resource editors open in dedicated windows (desktop) or new tabs (browser)
- Ctrl/Cmd+Enter shortcut for ad-hoc action dialog
- Dataflow: blue dashed lines for image node connections
- Dataflow: { } button in field editor to convert fields to objects
- Dataflow: recursive child field creation

### Bug Fixes

- Fixed resource editor windows unable to close due to iframe beforeunload
- Fixed copy/paste shortcuts not working in all Electron windows
- Fixed new Draw.io resources saving in wrong format
- Fixed Save button in new resource editor unexpectedly closing tab/window
- Fixed JS replace() corrupting $ patterns in user prompts
- Fixed Electron startup Service Worker database error

---

## v0.59.1 (2026-03-31)

### New Features

- Dataflow: Image Nodes — new image node type with folding, Ctrl+V paste, and Draw.io export
- Dataflow: Node-level Handles — connection handles on JsonNode and ProcessNode, enlarge on hover
- Dataflow: Title Links — clickable URL links in node titles
- Dataflow: Inline Child Fields — expand child fields inline for object/array fields

### Bug Fixes

- Fixed group node border display issues
- Fixed group title positioning overlapping content
- Fixed node handles not visible when connected
- Fixed redundant blue indicator dot on JsonNode header
- Fixed image node Draw.io export for data URLs

---

## v0.59.0 (2026-03-30)

### New Features

- Share Access Code — securely share content via access codes
- Dataflow: Group Nodes — visually group related nodes, edit group name & color
- Dataflow: Note Nodes — add notes with attachments, drag-to-attach to nodes/fields, collapsible
- Dataflow: Field Editor — inline editing of field name, example, and description
- Dataflow: Multi-select Delete — bulk delete selected elements

### Bug Fixes

- Fixed command palette Cmd+Enter not opening task in new window
- Fixed Draw.io editor not using user's language preference
- Fixed dataflow grouped node export positions
- Fixed dataflow parent-child relationships lost on save/reload

---

## v0.58.4 (2026-03-29)

### New Features

- Draw.io editor: import and export local .drawio files
- Export dataflow diagrams as .drawio XML
- Checklist items link directly to subtasks via task:// protocol

### Improvements

- Onboarding reorganized into 4 top-level categories with how-to subtasks
- Onboarding defaults to English

### Bug Fixes

- Fixed white screen after Electron app updates (stale cache)
- Fixed Draw.io export list items with incorrect vertical positioning
- Fixed resource links opening unnecessarily in new windows
- Fixed welcome task checklist not mirroring full subtask tree
- Fixed Level 1 category tasks missing subtask checklists

---

## v0.58.3 (2026-03-28)

### Improvements

- Updated homepage hero copy and marketing tagline

### Upgrade Notes (Self-Hosted)

- Environment variable `ADMIN_USERNAME` has been renamed to `ADMIN_EMAIL`. Please update your deployment configuration accordingly.

### Documentation

- Added Personal → Pro/Max migration guide

---

## v0.58.2 (2026-03-27)

No end-user facing changes in this release.

This release contains internal build and release workflow updates only.

---

## v0.58.1 (2026-03-27)

No end-user facing changes in this release.

This release contains internal build and release workflow updates only.

---

## v0.58.0 (2026-03-27)

### New Features

- Dataflow canvas box selection — drag to select multiple nodes at once
- Merge/append import for dataflow diagrams — import without replacing existing work
- Topological layout for imported nodes — auto-arranged for readability
- Accept simplified AI format for dataflow graph import
- Warning shown on failed dataflow graph import
- Improved AI prompt for dataflow diagram generation
- Migrate-from-personal flag for self-hosted Pro/Max tier migration

### Improvements

- Zoom out further in dataflow canvas

### Bug Fixes

- Fixed advanced search not triggering initial search on page load
- Fixed onboarding dialog unmounting early, leaving empty task list
- Fixed terminal not auto-focusing when workspace window gains focus

---

## v0.57.0 (2026-03-26)

### New Features

- Dataflow multi-field selection — Ctrl+Click to select multiple fields with 7-color highlight palette

### Bug Fixes

- Fixed task attachments not syncing properly with resource store
- Fixed long task titles overflowing in links section

### Improvements

- Thin scrollbar applied globally for a cleaner interface

---

## v0.56.0 (2026-03-25)

### New Features

- Kanban cards show assignee avatars with assignee filter in toolbar
- Scheduled database backups with configurable backup owner
- Delete action in scheduled jobs dropdown menu
- Refresh button on resources page
- "Run Ad-hoc" moved to first position in workspace menu

### Bug Fixes

- Fixed onboarding dialog blocking existing users, now dismissible via click-outside or Escape
- Fixed cross-origin file downloads
- Fixed refresh button not resetting resource cache
- Fixed audit column migration table names and field widths
- Hidden backup UI when using PostgreSQL

---

## v0.55.1 (2026-03-24)

### New Features

- Task Assignee — assign team members to tasks directly from the task properties panel
- Audit channel tracking for better change history visibility

### Bug Fixes

- Fixed dialog overflow when displaying long content
- Fixed edit column dialog layout overflow with long conditions

---

## v0.55.0 (2026-03-24)

### New Features

- Gantt chart view for task scheduling — visualize tasks on a timeline with start and end dates
- Drag-to-resize Gantt chart bars to adjust task dates directly
- Kickoff (start date) field for tasks, enabling calendar and Gantt planning
- Updated list view icon, gallery view now supports selection

### Bug Fixes

- Fixed metadata not flowing through account/budget/expense creation
- Fixed kanban board filter being dropped when column has ORDER BY

---

## v0.54.2 (2026-03-23)

### New Features

- Batch select, delete, and move files to folders in File Storage view
- Command palette tasks now sorted by most recently updated

### Bug Fixes

- Fixed H4 and H5 heading styles missing in rich text editor
- Fixed timeline status segment being clipped when too narrow

---

## v0.54.1 (2026-03-23)

### New Features

- Edit drawio, dataflow, and text resources directly from the detail page

### Bug Fixes

- Fixed command palette text overflow in title and preview content
- Fixed workspace working directory resolution from task/board metadata in TUI

---

## v0.54.0 (2026-03-23)

### New Features

- Storage class management — Admin UI for creating, editing, deleting, and testing storage classes with backup replication, user/group/system assignment hierarchy, and resolution overview
- Fullscreen mode for Kanban board
- Heading H4 & H5 support and clear formatting in markdown/bubble menu editor

### Improvements

- CLI migration: unified metadata-based idempotent incremental migration for all entity types

### Bug Fixes

- Fixed storage class edit modal overwriting secrets with masked values

---

## v0.53.4 (2026-03-21)

### New Features

- Referral hint in workspace limit dialog — invite friends to unlock more workspaces
- Platform hints integrated into download dialog popup
- Growth trend line charts on admin dashboard

### Improvements

- Code blocks now scroll horizontally within their container
- Dialogs are scrollable on small viewports with tighter spacing
- Workspace limit description updated to mention feedback unlocks

### Bug Fixes

- Fixed ISO date format handling in growth chart X-axis labels
- Fixed dialog content overflow on small screens

---

## v0.53.3 (2026-03-20)

### Improvements

- Added a dedicated "preview in new window" button for opening detail pages in a separate window

### Bug Fixes

- Fixed detail page to always open in a new window instead of navigating away from the current view

---

## v0.53.2 (2026-03-20)

### New Features

- Resource preview: open previewed files in a new window for side-by-side viewing
- Markdown editor: translate selected text directly from the bubble menu
- Download dialog: added referral hint with profile link and Discord community link

### Bug Fixes

- Fixed Ctrl+Q keyboard shortcut not working correctly

---

## v0.53.1 (2026-03-20)

### Bug Fixes

- Fixed desktop app startup crash caused by SQLite database migration error

---

## v0.53.0 (2026-03-19)

### New Features

- Keyboard shortcuts reference section on profile page
- Workspace switcher command palette (Ctrl+Q)
- Fold/unfold all and refresh shortcuts in CLI board view

### Bug Fixes

- Fixed drawio files losing original format when saving
- Fixed Electron app singleton lock not cleaning up properly on startup
- Fixed duplicate case handling in column condition builder
- Adjusted table of contents breakpoint for better viewport compatibility
- Fixed database migration failure for pre-existing databases missing workspace_sessions table

---

## v0.52.0 (2026-03-19)

### New Features

- Configurable query widgets on dashboard with settings icon
- Customize widget size and display order
- Widget configurations are persisted server-side via preferences

### Improvements

- Query string always shown in dimmed style for better readability

### Bug Fixes

- Fixed missing group_id columns in accounts table
- Fixed dashboard store persistence merge strategy
- Fixed incorrect SQL-like query syntax format

---

## v0.51.4 (2026-03-19)

### Improvements

- Refined referral reward card with updated description
- Improved invite code section to show referral benefits

---

## v0.51.3 (2026-03-19)

### New Features

- Added invite code display and referral reward card to the profile page for easy access and copying

---

## v0.51.2 (2026-03-18)

### New Features

- Added referral reward system — earn rewards by sharing invite codes for desktop app downloads
- New download dialog with Discord community join prompt and invite code entry

---

## v0.51.1 (2026-03-18)

### Improvements

- Added Configure link to the Implementation Tool dropdown for quick access to AI provider settings

### Bug Fixes

- Fixed entity links not working in Safari browser
- Fixed kanban board not filtering by default tags in CLI TUI view
- Fixed missing translation keys for kanban prompt and hooks settings

---

## v0.51.0 (2026-03-18)

### New Features

- Redesigned Add to Board panel — shows all boards with type labels and ownership info, private boards shown as read-only, sharing warning when adding to shared boards
- Kanban AI prompt setting — configure AI prompts when creating boards
- Email and linked identity providers now displayed on profile page

### Improvements

- Board removal confirmation now shows group name and tags list
- Removal confirmation shown for all boards, not just shared ones
- Refresh buttons now show spin animation for visual feedback

### Bug Fixes

- Fixed profile page crash
- Improved Chinese translations for more natural phrasing

---

## v0.50.1 (2026-03-17)

### Improvements

- Internal maintenance and stability improvements

---

## v0.50.0 (2026-03-17)

### Improvements

- Enhanced permission auditing — bulk permission changes now correctly track who made them and emit audit events

### Bug Fixes

- Fixed bulk permission updates not tracking the updater and not emitting audit events

---

## v0.49.6 (2026-03-17)

### Improvements

- Simplified board filtering — boards now use default tags instead of raw query syntax

### Bug Fixes

- Fixed various UI glitches in board settings panel (scrollbar, borders, focus rings)

---

## v0.49.5 (2026-03-17)

### New Features

- Board query scoping — Kanban boards can now filter tasks using a board-level query, with a scope indicator badge showing when filtering is active

### Bug Fixes

- Fixed break reminder timer resetting when navigating between pages

---

## v0.49.4 (2026-03-16)

### New Features

- Added OpenCode as a built-in AI agent option
- Workspace window limit dialog now shows a thank-you message

### Bug Fixes

- Fixed workspace close events being lost during app shutdown
- Fixed Safari navigating to custom protocol URLs in markdown links

---

## v0.49.3 (2026-03-16)

### Bug Fixes

- Fixed ugly scrollbar and layout shift in Gantt charts
- Fixed Linux binary execute permissions in CI pipeline

---

## v0.49.2 (2026-03-16)

### Bug Fixes

- Fixed monthly chart click navigation not working after recharts upgrade

---

## v0.49.1 (2026-03-16)

### New Features

- Daily spending chart — new per-day summary chart on the transactions page

### Improvements

- Simplified CLI installation to npm only

### Bug Fixes

- Fixed monthly chart hover index type error

---

## v0.49.0 (2026-03-15)

### New Features

- Task Status Timeline — new Gantt chart page showing task status changes over time, letting you visualize how tasks flow through statuses
- Status Changes Feed — dashboard "Recently Updated" widget replaced with a live feed of task status changes
- Knowledge Graph Tag Filter — filter nodes by tag in the knowledge graph view
- Kanban Subtask Preview — subtasks now shown directly in the kanban card preview modal

---

## v0.48.1 (2026-03-15)

### New Features

- Task preview below search results on mobile for quick context
- Title/Grep segmented control on mobile command palette
- Section-level add task button in board list view
- Inline search and tag filter in list view

### Improvements

- Tag suggestions sorted by last used instead of alphabetical

### Bug Fixes

- Fixed focus ring clipping on title input in create task dialog

---

## v0.48.0 (2026-03-14)

### New Features

- Subtask ordering with drag-and-drop reordering
- Show all workspace windows instead of just current board
- Go-to-parent button in epic view for quick navigation
- Open-externally buttons now navigate within the current window
- CLI: `--parent` and `--subtask` flags for `ud task unlink`

### Improvements

- Optimistic updates for subtask drag-and-drop (instant visual feedback)

### Bug Fixes

- Relations graph now shows when task has only subtasks
- Fixed subtask title alignment and styling
- Fixed drag handle causing layout shift

---

## v0.47.1 (2026-03-14)

### Improvements

- Optimized Linux desktop app build pipeline

---

## v0.47.0 (2026-03-14)

### New Features

- Mermaid diagram rendering in TipTap editor with fullscreen pan-zoom preview and SVG download
- Task relationships restructure: dedicated Parent, Subtasks, and Linked sections with subtask progress bar
- CLI subtask support with `--parent` and `--subtask` flags, subtask display in task detail
- Configurable storage quota via admin system config
- Local sync frontmatter support for parent, subtasks, and linked fields

### Improvements

- Add existing task as subtask dialog for quick subtask creation

### Bug Fixes

- Fixed mermaid SVG sanitization for XML parsing on download
- Fixed fullscreen preview invisible on light mode
- Fixed resource detail page preview inconsistency
- Fixed user role not passed through upload quota validation paths
- Fixed subtask progress count not using backend data

---

## v0.46.6 (2026-03-13)

### Improvements

- Added additional showcase image for the access control feature on the homepage

---

## v0.46.5 (2026-03-13)

### Bug Fixes

- Fixed CLI binary auto-update: the desktop app now silently updates the CLI on startup
- Fixed child window size: new windows now default to a larger size showing desktop view
- Removed automatic DevTools popup that was interrupting users

---

## v0.46.4 (2026-03-13)

### Bug Fixes

- Fixed Linux dock icons displaying in grayscale instead of color (sRGB conversion)
- Child windows now open much faster (reduced fallback timer from 5s to 500ms)

---

## v0.46.3 (2026-03-13)

### Bug Fixes

- Fixed child window display issues on Linux with fallback show timer and error handling
- Fixed Electron desktop app builds for macOS and Windows by using prebuilt native binaries

---

## v0.46.2 (2026-03-13)

### Improvements

- Added mobile board selector and view toggle to kanban list page

### Bug Fixes

- Fixed database migration failing on fresh installs
- Fixed board metadata (workspace working directory) lost during updates
- Fixed tags wrapping to multiple lines
- Fixed mobile sidebar toggle visibility
- Fixed Linux desktop app terminal not rendering

---

## v0.46.1 (2026-03-12)

### Bug Fixes

- Fixed expired login sessions cached in the browser bypassing the login page and showing the onboarding dialog

---

## v0.46.0 (2026-03-12)

### Improvements

- Database upgrades now use versioned SQL migrations for more reliable schema management
- Fixed a startup crash on desktop (SQLite) caused by legacy database column cleanup

---

## v0.45.2 (2026-03-12)

### New Features

- Command palette now highlights search terms in results and shows note previews
- Navigation commands consolidated into a single /nav submenu for a cleaner command palette

### Bug Fixes

- Fixed kanban sidebar icon not navigating directly to the selected board
- Fixed /board command not navigating to the selected board correctly

---

## v0.45.1 (2026-03-12)

### Improvements

- Added integration test framework for better release quality assurance

---

## v0.45.0 (2026-03-12)

### New Features

- Command palette now supports grep search mode — press Tab to toggle between title-only and full-text search (title + description + notes)
- Added "Go to Board" button in workspace TaskPanel
- Resource preview now supports multiple text formats, markdown preview, and docx/xlsx preview
- Added text resource support for task attachments

---

## v0.44.5 (2026-03-11)

### New Features

- Added /windows command to command palette for quick window switching
- Dataflow nodes now support description fields with edit button and hover tooltip

### Improvements

- Replaced familiar features section with highlights gallery on comparison page

### Bug Fixes

- Fixed kanban window title not showing the selected board name

---

## v0.44.4 (2026-03-11)

### Bug Fixes

- Hidden history actions (floating button and context menu) for read-only shared tasks
- Fixed workspace terminal not inheriting the board's configured working directory

---

## v0.44.3 (2026-03-11)

### New Features

- Workspace now enforces a window limit; unlock more windows with a license key
- Task ID is now displayed beneath the task title in the Workspace task panel

### Bug Fixes

- Fixed finance data not refreshing after preset data cleanup or logout
- Hidden the create board button on mobile view

---

## v0.44.2 (2026-03-11)

### New Features

- Workspace switcher dropdown in workspace TaskPanel
- "Save to udctl" button in standalone editor

### Bug Fixes

- Fixed frontmatter block corruption in visual editor
- Fixed editor instances not properly separated per mode

---

## v0.44.1 (2026-03-11)

### New Features

- Inline workspace bar on kanban board page

### Bug Fixes

- Fixed page-level horizontal scroll during kanban drag
- Fixed auto-scroll continuing when cursor moves past scroll container edge
- Fixed kanban drag-to-offscreen columns and right margin
- Fixed toolbar scrolling away — now sticks below title bar
- Hidden all write actions for read-only shared tasks

---

## v0.44.0 (2026-03-10)

### New Features

- Standalone Markdown editor in the desktop app — open and edit .md files directly

### Bug Fixes

- Fixed missing custom protocols in Electron protocol filter

---

## v0.43.0 (2026-03-10)

### New Features

- k9s-style TUI overhaul: 3-section layout, two-column header with branding and context info
- TUI kanban view: vertical columns with expand/collapse, board drill-down navigation
- TUI workspace support: launch from task detail, PTY management, action picker
- Edit tasks in `$EDITOR` from TUI with frontmatter format
- Create new tasks via editor in TUI
- k9s-style `/` filter for all TUI resource views
- `:ctx` command to switch contexts, shows API URL and user info in header
- Command mode accessible from any view
- Backend liveness indicator in TUI header
- Resource shortname and plural aliases for CLI commands
- "Open Claude (task context)" workspace action

### Improvements

- Arrow up/down navigation in table while in filter mode

### Bug Fixes

- Fixed expenses table padding so DATE column is not truncated
- Fixed view not restored when leaving workspace picker
- Fixed goroutine leak on workspace detach and reattach
- Fixed TUI layout issue on workspace reattach

---

## v0.42.1 (2026-03-09)

### Improvements

- Added internationalization support for kanban board fields and placeholders

### Bug Fixes

- Fixed hooks toggle requiring correct project directory context

---

## v0.42.0 (2026-03-09)

### New Features

- Board permission system: set boards as read-only, enforce permission ceiling for tasks
- Permission toggle in board share modal
- Read-only visual feedback for shared tasks and boards
- Transfer task ownership when sharing to board's group
- Click-to-enlarge image preview in rich text editor
- Kanban: create button moved next to settings for easier access
- Project-level hook injection with per-board consent toggle

### Improvements

- Cleaner image display in rich text editor (removed border-radius)

### Bug Fixes

- Fixed drag overlay escaping board container bounds
- Code blocks now scroll horizontally instead of wrapping
- Fixed white-space handling in code blocks
- Fixed drag-and-drop error with dynamic sensors

---

## v0.41.6 (2026-03-09)

### Improvements

- Kanban drag-and-drop order now persists across page reloads

### Bug Fixes

- Fixed kanban column display query
- Fixed kanban task sorting for consistent drag-and-drop feedback
- Fixed default query sort order

---

## v0.41.5 (2026-03-09)

### Bug Fixes

- Fixed PowerShell argument mangling on Windows that could cause CLI commands to fail
- Fixed variable word-splitting in workspace commands on Windows

---

## v0.41.4 (2026-03-08)

### Improvements

- Internal code optimization and maintainability improvements

---

## v0.41.3 (2026-03-08)

### Improvements

- Desktop app workspace agent starts faster — skills prompt is now embedded at build time instead of requiring a runtime CLI call

---

## v0.41.2 (2026-03-08)

### Improvements

- CLI now defaults to official server URL (ud.oatnil.com)
- Workspace desktop actions now show a confirmation dialog instead of a tooltip hint

### Bug Fixes

- Fixed kanban board card ordering not persisting after drag-and-drop
- Fixed workspace agent command execution reliability

---

## v0.41.1 (2026-03-08)

### Bug Fixes

- Fixed infinite loop in tag condition filtering that could cause the page to freeze

---

## v0.41.0 (2026-03-08)

### New Features

- Multi-account switching: save up to 5 accounts and switch between them without logging out, available in sidebar, login page, and profile page
- Task board in CLI: `ud task` now shows which board a task belongs to
- Unified onboarding flow: visitor account creation and sample data generation are now separate steps with clear progress indication
- Scheduled jobs: Run Now promoted to a direct button for easier access; preset data cleanup defaults to disabled

### Improvements

- Preference store now persists to localStorage for instant rendering on page reload

### Bug Fixes

- Fixed chart rendering warnings in dashboard
- Fixed stale pinned tasks appearing from cache after updates

---

## v0.40.0 (2026-03-08)

### New Features

- ud vs Obsidian comparison page: full landing page with feature comparison table, familiar features checklist, and pain point solutions
- Obsidian showcase section on homepage with image gallery
- Post-login onboarding dialog with language selection
- Admin workspace management page for system-wide daemon and session monitoring
- CLI `ud apply` now supports board field for direct board task creation
- Windows remote workspace agent support via PowerShell hook script
- Refresh button on workspace monitor page
- In-app remote workspace setup guide

### Improvements

- /tasks now redirects to kanban board view
- Pinned task cache uses stale-while-revalidate for faster rendering

### Bug Fixes

- Fixed kanban card floating outside board when dragged beyond the last column

---

## v0.39.0 (2026-03-07)

### New Features

- Workspace: Full remote workspace system with daemon registration & discovery, SSE event streaming, session tracking & agent spawning, control signals (stop/read-new-instruction), action blacklist for security, and frontend trigger & viewer UI
- Real-time task note notifications via SSE for workspace updates

### Bug Fixes

- Fixed CLI unable to run ud commands in spawned Claude Code agent sessions
- Fixed CLI passing task_id as prompt to Claude Code agent
- Hardened CLI daemon with safe ID truncation, SSE backoff reset, and consistent error handling
- Fixed SSE endpoint response interceptor causing connection issues

---

## v0.38.10 (2026-03-06)

### Bug Fixes

- Removed China download option from subscription desktop section

---

## v0.38.9 (2026-03-06)

### Bug Fixes

- Fixed ad-hoc command execution starting agent without a prompt
- Improved board type selection — shared is now default with clearer descriptions

---

## v0.38.8 (2026-03-06)

### New Features

- Added directory path picker for board project settings

### Bug Fixes

- Fixed context hint ordering for better task workflow

---

## v0.38.7 (2026-03-06)

### Bug Fixes

- Fixed ud CLI skills command compatibility
- Fixed prompt context for non-Claude AI agents
- Fixed prompt handling on Windows to prevent argument splitting

---

## v0.38.6 (2026-03-06)

### Bug Fixes

- Fixed Codex CLI prompt handling to properly combine system and user prompts
- Fixed argument splitting issue when passing prompts to Codex

---

## v0.38.5 (2026-03-06)

### New Features

- CLI: Added login hint to `set-context` command and `--name/-n` flag to `login` for easier authentication

### Bug Fixes

- Fixed workspace terminal not resolving user's full PATH correctly
- Removed stale /view command from command palette

---

## v0.38.4 (2026-03-06)

### Bug Fixes

- Fixed workspace launch failing on Windows due to PowerShell command parsing issues

---

## v0.38.3 (2026-03-06)

### New Features

- Dashboard account and budget widgets now show recent items
- Dashboard transaction widget shows 3 most recent transactions
- CLI: New migrate command for server-to-server data migration

### Bug Fixes

- Fixed dashboard accounts donut chart color inconsistencies
- Fixed dashboard accounts widget layout misalignment with budget and transactions widgets
- Fixed CLI saved-query and task-view list response formats

---

## v0.38.2 (2026-03-06)

### Improvements

- Internal stability and tooling improvements

---

## v0.38.1 (2026-03-06)

### New Features

#### System Info Viewer

- Admins can view database type, version, and size metadata directly in System Config

#### Dataflow Export as AI Prompt

- Copy dataflow diagrams as structured prompts for use with AI tools

#### Delete Tasks from Saved Queries

- Delete tasks directly from saved query result lists without navigating away

### Improvements

- AI assistant now describes its current task context
- Predefined saved query names and preset data cleanup jobs translated in Chinese/English

### Bug Fixes

- Fixed dataflow copy prompt to produce importable JSON format
- Fixed CLI install configuration

---

## v0.38.0 (2026-03-05)

### New Features

#### Board Creation Experience

- New visible "Create Board" button in kanban header for easy board creation
- Create Board dialog now includes advanced settings (description, visibility), expanded by default
- System boards guide you to create your own custom boards

#### Preset Data for New Users

- New users automatically receive sample data to explore the app
- Tag-based cleanup lets you remove all preset data with one click when ready

#### Desktop CLI Auto-Configuration

- Desktop app automatically configures CLI personal context on login — no manual setup needed

### Improvements

- Simplified onboarding from 30 to 10 tasks with more accurate content
- Shared board description better explains collaboration features

### Bug Fixes

- Fixed crash when clicking Create Board button
- Fixed preset data notice with cleanup link on welcome task
- Fixed Windows CLI path setup issue

---

## v0.37.9 (2026-03-05)

### Improvements

- Desktop app now automatically installs the ud CLI and configures Claude Code hooks on startup — no manual setup needed

### Bug Fixes

- Fixed Windows CLI path mismatch between install and workspace terminal
- Removed manual CLI install option from profile page (now automatic)

---

## v0.37.8 (2026-03-05)

### Bug Fixes

- Fixed Windows CLI compatibility issue
- Fixed desktop app package identification

---

## v0.37.7 (2026-03-05)

### Improvements

- Homepage showcase updated with resources feature images for a richer visual experience

---

## v0.37.6 (2026-03-05)

### New Features

- Added "Download Desktop App" button to the home page for easy access to the desktop client
- CLI now supports get/describe commands for expenses, budgets, and accounts

---

## v0.37.5 (2026-03-04)

### Improvements

- Main window close confirmation dialog now supports Chinese and English

---

## v0.37.4 (2026-03-04)

### New Features

#### Board Terminal

- Open AI agent terminals directly from kanban board headers, with support for multiple concurrent terminals
- Choose specific AI agents for individual actions and launch ad-hoc workspace actions

#### Real-Time Status Updates

- Workspace status now updates in real-time via Server-Sent Events for faster and more reliable updates

#### Close Confirmation

- The app now asks for confirmation before closing the main window when child windows (workspaces) are open, preventing accidental data loss

### Bug Fixes

- Fixed board terminal prompts including unnecessary task context
- Agents can now be started interactively when no prompt is provided
- Fixed agent selection dropdown display layering issue

---

## v0.37.3 (2026-03-04)

### New Features

#### Epic View

A new subtask tree visualization page showing task hierarchy:

- Navigate from task detail to Epic View for a full subtask tree
- Expand/collapse all nodes to quickly browse or focus on specific branches
- Quick-add subtasks directly within the tree
- Clickable task titles for fast navigation to task details

#### Subtask Progress Indicator

- Task list items and task detail page show subtask completion progress
- Progress bar displayed in linked tasks section

#### Workspace Event History

- Monitor page now tracks workspace status changes over time
- Workspaces auto-marked as idle on open for accurate event tracking

### Improvements

- Mobile hero section uses horizontal pill tabs for better browsing

### Bug Fixes

- Fixed kanban cards disappearing on refresh and after creating a new card
- Fixed workspace event history not always showing on monitor page

---

## v0.37.2 (2026-03-04)

### Bug Fixes

- Fixed workspace actions causing infinite re-render loop

---

## v0.37.1 (2026-03-04)

### New Features

#### Interactive Feature Showcase

- Home page feature cards now support click interaction with multi-image galleries, auto-rotation, left/right navigation, and click-to-enlarge lightbox
- Added "Try Now" button for visitors to instantly try the platform from the home page
- Updated descriptions for tasks, finance, workspace, resources, and localsync features

#### Workspace Window Status Indicator

- Workspace window titles now show status emoji for at-a-glance monitoring

### Bug Fixes

- Fixed infinite request loop when loading kanban columns
- Fixed infinite loop in agent selector
- Fixed linked task sorting to use update time consistently
- Removed non-functional Export PDF button from mobile view

---

## v0.37.0 (2026-03-04)

### New Features

#### Workspace Settings Redesign

- Settings page reorganized into CLI, Workspace, and Integrations sections for clearer navigation
- Built-in workspace actions and agent CLIs now visible as read-only items in settings
- Click on built-in actions and agents to view their full details

#### Configurable Agent CLIs & Per-Task Working Directory

- Add custom agent CLIs for workspace automation
- Configure working directory per task for context-aware CLI commands
- CLI context configuration available in board & task workspace

#### Quick Custom Action Access

- "Add Custom Action..." link added to workspace dropdown for quick access
- Custom action form now pre-filled with useful examples instead of empty placeholders

### Improvements

- Board settings and kanban dropdown menus fully localized (i18n)

### Bug Fixes

- Fixed custom action prompts containing unnecessary placeholders

---

## v0.36.9 (2026-03-03)

### New Features

- Workspace actions now use a template system for better organization
- Agents show a green "Planning" status when in plan mode
- New "Check Implementation" action in workspace dropdown

### Bug Fixes

- Removed invalid "shell" option from board implementation tool choices

---

## v0.36.8 (2026-03-03)

### Bug Fixes

- Adjusted workspace status dot size on kanban cards to match adjacent icons

---

## v0.36.7 (2026-03-03)

### Bug Fixes

- Fixed workspace status dot showing on kanban cards even when no workspace window is open

---

## v0.36.6 (2026-03-03)

### New Features

#### Resource Tags

- Resources now support tags for better organization and filtering

#### Kanban Agent Status

- Workspace agent status is now displayed directly on kanban cards

### Bug Fixes

- Unified workspace status colors for a more consistent look

---

## v0.36.5 (2026-03-03)

### New Features

#### Workspace Enhancements

- Added "Open Shell" option to workspace dropdown for quick terminal access
- Agent now knows the current task ID, enabling more context-aware assistance

### Bug Fixes

- Fixed kanban task creation dialog focusing on description instead of title
- Fixed workspace agent status not updating during permission and input dialogs

---

## v0.36.4 (2026-03-03)

### Improvements

- Removed calculator widget from expense and income dialogs for a cleaner interface
- Idle agent status now uses blue color for better visual distinction from working status

### Bug Fixes

- Fixed vertical scrolling not working on remaining public pages

---

## v0.36.3 (2026-03-03)

### New Features

#### Workspace Monitor

- New workspace monitor page for a bird's-eye view of all active workspaces
- Quickly accessible from the command palette
- Workspace task panels include a shortcut to open tasks in the main window for editing

### Improvements

- Status icons displayed alongside task titles in workspace panels

### Bug Fixes

- Fixed status icon alignment in workspace task panels

---

## v0.36.2 (2026-03-02)

### Improvements

- Desktop app profile page now shows a hint to install the CLI from Integrations

### Bug Fixes

- Fixed workspace limit dialog redirecting to wrong section
- Fixed vertical scrolling not working on public pages (subscribe, contact, docs)

---

## v0.36.1 (2026-03-02)

### Improvements

- Window titles now show WK/Task prefix for easy identification

### Bug Fixes

- Fixed double horizontal scrollbar on kanban page
- Fixed agent status cross-contamination between workspaces

---

## v0.36.0 (2026-03-02)

### New Features

#### AI Workspace Real-Time Status Detection

- Workspace windows now show real-time AI agent status (working/idle/offline)
- Status displayed as emoji prefix in window titles for quick recognition
- Idle status uses amber indicator for better attention

#### Task Pinning

- Pin/unpin button on task detail page to keep important tasks at the top

#### Electron Task Windows

- Open dedicated windows for tasks in the desktop app for parallel workflows
- Window titles display the task name for easy identification

#### Registration Language Preference

- Language preference selector added to the registration form

### Improvements

- Workspace notes now sorted by creation time (newest first)

---

## v0.35.7 (2026-03-01)

### New Features

#### Workspace Experience Improvements

- Workspace window titles now display the task name for easy identification
- Start implementation directly from the kanban task preview modal

### Improvements

- A confirmation dialog now appears before redirecting to the CLI install page

---

## v0.35.6 (2026-03-01)

### New Features

#### ud CLI Resource Sync Enhancements

- Added `--concurrent` flag for faster file synchronization
- Added filtering flags for selective file synchronization

### Bug Fixes

- Fixed scrollbar visibility in kanban columns while keeping scroll functionality

---

## v0.35.5 (2026-03-01)

### New Features

#### Break Reminder Widget

A new dashboard widget to help you take regular breaks:

- Countdown timer with customizable intervals (supports hours, minutes, seconds, e.g. "2m3s")
- In-app popup alerts with editable reminder titles
- Sound beep fallback when system notifications are suppressed

#### Transaction Widget

The dashboard expense widget has been upgraded to a transaction widget with a donut chart for visual income/expense breakdown.

#### Saved Query Improvements

- Duplicate saved queries with one click
- Create query dialog upgraded to a sheet drawer with preset query shortcuts
- Added "AI gen without Kanban" preset query

### Bug Fixes

- Fixed multiple break reminder issues (notification delivery, countdown display, timer stopping)
- Fixed popup title showing fixed text instead of custom message
- Fixed toggle not blocked when input has errors

---

## v0.35.4 (2026-03-01)

### New Features

#### Task Custom Metadata

View all metadata fields on task details and add custom key-value fields to any task.

#### Saved Query Task Actions

Change task status and share tasks to boards directly from saved query result rows.

### Bug Fixes

- Fixed task session creation failing with non-ASCII titles

---

## v0.35.3 (2026-02-28)

### New Features

#### Budget Share-to-Group

Share budgets with groups using Unix-style permission controls (read/write/admin) for collaborative budget management.

### Bug Fixes

- Fixed cash flow summary not rendering on mobile when subcategories exist but data is empty

---

## v0.35.2 (2026-02-28)

### New Features

#### Workspace Window Limit for Personal Tier

Personal tier users can now open up to 2 implementation windows at a time. An upgrade prompt appears when the limit is reached, with a link to get a Pro license.

#### Personal Tier Credentials Display

Personal tier users can now view their default login credentials on the profile page, making it easy to use with the CLI or other clients.

#### CLI Availability Check

The app now checks if the ud CLI is installed when using "Start Implementation" and prompts you to install it if needed.

---

## v0.35.1 (2026-02-28)

### New Features

#### Install CLI from Desktop App

You can now install the ud command-line tool directly from the desktop app — no need to install via Homebrew separately. Go to Settings > Integrations to set it up.

- One-click install with automatic system PATH configuration
- Shows installation status and path
- Detects externally installed CLI (e.g., via Homebrew)

#### Task Detail Refresh

Added a refresh button to task detail pages for quickly reloading the latest data.

### Bug Fixes

- Fixed monthly cash flow chart not displaying correctly on mobile

---

## v0.35.0 (2026-02-28)

### New Features

#### Workspace: AI-Powered Task Implementation

Start implementing tasks directly from the Kanban board with the new embedded terminal workspace:

- New "Start Implementation" button on the task detail page to kick off implementation
- Embedded terminal workspace launches Claude Code with your task context
- Board-level project directory configuration ensures the workspace opens in the right location

#### Monthly Income/Expense Chart

New bar chart on the transactions page showing monthly income vs. expenses at a glance, collapsed by default for a cleaner layout.

### Improvements

- Board edit dialog converted to a drawer layout with project directory configuration

---

## v0.34.7 (2026-02-27)

### New Features

#### Command Palette Preview

The command palette now includes a preview panel with a split layout for viewing task descriptions.

### Improvements

- Identity providers settings page now supports Chinese and English

### Bug Fixes

- Fixed active view not auto-refreshing after localsync pushes tasks

---

## v0.34.6 (2026-02-27)

### Bug Fixes

- Fixed cross-domain API URL handling for self-hosted deployments
- Fixed identity config page redirect URL display

---

## v0.34.5 (2026-02-26)

### New Features

#### Budget Monthly View

A new monthly budget view with a month picker for viewing and managing budgets by month, making it easier to track spending over time.

#### Budget Concepts Page

New documentation page explaining budget concepts and domain language to help you understand budget management terminology.

### Improvements

- AI "Feel Lucky" feature now includes source task references for better context

### Bug Fixes

- Fixed budget page layout issues on mobile devices

---

## v0.34.4 (2026-02-26)

### New Features

#### Feel Lucky Dashboard Widget

A new "Feel Lucky" widget on the dashboard for knowledge exploration — randomly discover and explore content from your knowledge base.

#### AI Provider Internationalization

AI provider configuration dialog and settings section now fully support Chinese and English.

### Improvements

- Added how-to guide for configuring AI providers

### Bug Fixes

- Fixed how-to guide navigation redirect
- Fixed file upload paths for task-from-vision and task-from-image
- Fixed AI provider startup configuration
- Improved AI error handling in Feel Lucky feature

---

## v0.34.3 (2026-02-25)

### New Features

#### Content Outline (Table of Contents)

A new content outline on the task detail page that automatically detects headings in the visible section:

- Navigate headings in both task descriptions and notes
- Available in both normal view and zen mode
- Smooth fade-in/fade-out animation

#### Redesigned Sidebar Toggle

New sidebar toggle with a vertical line and round button on the right edge, providing a cleaner and more elegant design.

#### Zen Mode Improvements

- Added right-edge back button for easy navigation
- Content outline (TOC) available in zen mode

#### Auto-collapse Sidebar

Left sidebar auto-collapses on task detail pages for more reading space.

### Improvements

- Auto-focus editor and position cursor at double-click location
- TOC hides automatically when editing content
- Wider content outline for better readability
- Removed Export PDF action button for cleaner task detail interface

### Bug Fixes

- Fixed print view to keep page numbers while hiding browser header
- Fixed sidebar toggle position to avoid scrollbar overlap
- Fixed content outline repositioning when sidebar state changes

---

## v0.34.2 (2026-02-25)

### New Features

#### Deadline Display in Kanban View

Tasks with deadlines now display the due date directly in both kanban list view and kanban cards, making it easier to track time-sensitive tasks at a glance.

#### @ Mention Menu in Editor

Type `@` in the rich text editor to bring up a mention menu. Quickly reference tasks, budgets, and other entities by searching and selecting from the popup menu.

### Bug Fixes

- Fixed deadline date format to show year when the deadline is not in the current year
- Fixed deadline date format to respect locale settings (Chinese/English)
- Improved deadline positioning inline after task title for better visual alignment
- Fixed alignment consistency for deadline badges across list rows
- Fixed arrow key navigation in the @ mention menu
- Fixed Chrome extension source code link URL

---

## v0.34.1 (2026-02-24)

### New Features

- Command palette: added `/localsync` command to quickly trigger local sync

### Bug Fixes

- Fixed task owner unable to edit task when shared as read-only
- Fixed local sync failing to parse filenames with spaces

---

## v0.34.0 (2026-02-23)

### New Features

#### Flat File Local Sync

Local sync now uses flat `.md` files instead of nested UUID folders, making it easier to browse and edit tasks in your file explorer or Obsidian.

#### Wikilink & Markdown Link Resolution

`[[wikilinks]]` and `[text](./file.md)` links between tasks are automatically resolved during sync, preserving cross-references between your tasks.

#### Full Push to Remote

New button to force-push all local files to the app at once.

#### Task Navigation History

Browser-style back/forward navigation arrows on the task detail page for quickly switching between tasks.

### Improvements

- Push/pull buttons now clearly show direction (Local → App, App → Local)
- Bare `.md` files with no frontmatter are accepted as tasks with default fields
- Local Sync promoted to its own section in Settings

### Bug Fixes

- Fixed macOS dock icon sizing and proportions
- Navigation arrows always visible with cached fallback

---

## v0.33.2 (2026-02-20)

### New Features

#### Account Asset Trend Chart

Multi-line asset trend chart on the accounts homepage for visualizing asset changes:

- Defaults to 3-month view with toggleable time ranges
- Chart is collapsible (collapsed by default), click to expand
- Data points marked at actual history dates

#### Account History Comments

Added comment field to account history records for documenting each change.

#### CSV Export

Export account data as CSV files directly from the browser.

#### Resource Metadata

Resource upload flow now supports adding metadata, with a new metadata update endpoint.

#### CLI Folder Sync

New `ud sync resource` command for recursively syncing local folders to the cloud.

### Improvements

- Visitor mode shows enriched account history preset data for better trend visualization

### Bug Fixes

- Fixed trend chart X-axis ticks showing the same date repeatedly
- Fixed historical dates being lost when generating preset account history
- Fixed visitor account history not aligned to consistent time points

---

## v0.33.1 (2026-02-20)

### New Features

#### Command Palette Hint Bar Enhancements

- Added toggle to hide/show the keyboard shortcut hint bar for a cleaner workspace
- Added "Open in New Tab" and "Copy Link" shortcuts with clickable hint labels
- Shortcut hints now display with text labels for better readability

#### npm Distribution for ud CLI

ud CLI is now available via npm: `npm install -g @oatnil/ud`

### Improvements

- Web Clipper now supports both Markdown and SingleFile HTML formats
- Updated installation documentation with npm and Homebrew methods

---

## v0.33.0 (2026-02-19)

### New Features

#### Predefined Saved Queries for New Users

New users automatically receive a set of predefined saved queries upon account creation, making it easier to get started.

#### CLI Kanban Board Commands

New CLI commands for kanban boards: get, describe, and board add.

#### Income Preset Data for Visitors

Visitor accounts now include preset income data for a more complete demo experience.

### Improvements

- Personal tier access tokens now last 7 days, reducing the need for frequent re-login
- Homepage architecture diagram now includes clear descriptions for each component

### Bug Fixes

- Fixed transaction filters row height and alignment on mobile devices

---

## v0.32.0 (2026-02-18)

### New Features

#### Income Tracking & Unified Transactions Page

A new income tracking feature and unified transactions page to manage all your finances in one place:

- Add and track income with a dedicated detail page and transaction click-through
- Unified transactions page showing both expenses and income together
- Auto-fill default title when creating income entries

#### Cash Flow Summary

New cash flow summary on the transactions page:

- View real-time income and expense totals
- Multi-currency support with separate buckets per currency
- Automatic refresh when expenses or income are added or deleted

#### Budget Progress Tracking

New budget progress bars in the transactions sidebar for at-a-glance budget monitoring:

- Individual progress bars for each budget
- Total expense/budget summary progress bar

#### Blind Mode

New blind mode toggle on the transactions page to hide financial amounts for privacy.

#### Task PDF Export

Export tasks with their notes as PDF files for offline sharing and archiving.

### Improvements

- Simplified transaction icons and amount colors for a cleaner look
- More compact cash flow summary layout

### Bug Fixes

- Fixed expenses not using the budget's currency when created from a budget
- Fixed queue tasks list page auto-refreshing unnecessarily

---

## v0.31.1 (2026-02-15)

### Improvements

#### Website Showcase Redesign

- App showcase section redesigned with auto-playing slideshow featuring real product screenshots
- SaaS subscription section redesigned with improved visual layout
- Architecture diagram now supports interactive node previews — click nodes to see actual app screens
- Architecture diagram updated with Desktop App, Apple Shortcuts, and storage option nodes

### Bug Fixes

- Fixed dialog accessibility issues

---

## v0.31.0 (2026-02-15)

### New Features

#### Web Clipper (Chrome Extension)

New Chrome browser extension to save web pages as udctl tasks:

- Click the extension icon, edit the title, and save the entire page
- Captures full-page HTML snapshots using SingleFile technology
- Snapshots are automatically attached as resources to the new task
- Web Clipper section added to the subscribe page with documentation link

#### CLI Multi-Account Support

New `--context` flag for ad-hoc context switching in the CLI:

- Quickly access different accounts/servers without changing the default context
- Example: `ud --context work get task` to temporarily use the work context
- In-app documentation updated with full multi-account usage guide

---

## v0.30.1 (2026-02-14)

### Bug Fixes

- Fixed build errors for improved application stability

---

## v0.30.0 (2026-02-14)

### New Features

#### Filesystem-Style Resource Browsing

The resources page now provides a file system-like browsing experience:

- Create folders to organize files into directories
- Breadcrumb navigation for quick directory switching
- Click `..` to navigate to parent directory
- Both list view and gallery view support folder browsing

#### Drag-and-Drop File Management

- Drag files onto folders to move them
- Drag files from desktop to upload directly into the current directory

#### Sortable File List

- Click column headers (Name, Size, Created, Updated) to sort files
- Arrow indicators show current sort direction

#### Quick Task Input in Kanban

- Quickly add tasks with AI creation directly from kanban list view

### Improvements

- AI-recognized expense receipts are automatically filed to `/system/expense-from-vision/`
- AI-recognized task images are automatically filed to `/system/task-from-vision/`

---

## v0.29.1 (2026-02-13)

### Improvements

- Saved queries now display a refresh icon for quick re-execution

---

## v0.29.0 (2026-02-13)

### New Features

#### Budget Projection Ledger

View projected budget balance over time with the new projection ledger.

#### Budget Breakdown Timeline

A new timeline view showing budget plans and one-time adjustments:

- Add plans and adjustments directly from the breakdown timeline
- Sidebar shows related expenses for a complete budget overview

#### Quick Navigation Links

- Navigate directly from an expense to its linked account
- Navigate directly from an expense to its linked budget
- Add expenses directly from the budget detail page

### Improvements

- Account link icon now always visible when an account is set on an expense
- Currency field shown (read-only) when creating a budget for clarity

### Bug Fixes

- Fixed budget dialogs using hardcoded CNY instead of the budget's own currency
- Fixed date format issues in plan and adjustment dialogs
- Fixed timeline alignment issues
- Fixed redundant top bar in editor source mode
- Fixed default theme in preference subscription

---

## v0.28.5 (2026-02-13)

### New Features

#### AI Translation

Select any text and translate it using AI directly from the bubble menu.

#### Enhanced AI Bubble Menu

- Added "Ask AI" button for quick AI assistance when editing
- Added copy button to easily copy AI-generated results
- Visual checkmark feedback after copying

### Bug Fixes

- Fixed crashes that could occur when using AI text refinement
- Fixed AI chat input auto-resize behavior

---

## v0.28.4 (2026-02-12)

Build failed - superseded by v0.28.5.

---

## v0.28.3 (2026-02-12)

### Bug Fixes

- Fixed AI chat causing excessive network requests when tasks were selected as context

---

## v0.28.2 (2026-02-12)

### Improvements

- AI chat now sends task notes as context to the AI provider, enabling more informed responses

### Bug Fixes

- Fixed floating action buttons appearing on budget detail page
- Fixed kanban task preview modal showing stale data

---

## v0.28.1 (2026-02-12)

### New Features

#### Queue Tasks Page

A new page for viewing and monitoring background queue tasks. Retry failed tasks with one click.

### Bug Fixes

- Fixed empty state display in the queue page

---

## v0.28.0 (2026-02-11)

### New Features

#### UDQ Inline Task Query Blocks

Embed dynamic task queries directly in Markdown documents. Use `udq` code blocks to query tasks by status, priority, tags, and more — results render live inline.

#### Discord Community

Added a Discord invite link to the contact page for easy access to the community.

### Bug Fixes

- Fixed sidebar overlapping fullscreen editors (DrawIO diagrams, Mind Maps)
- Fixed duplicate API key label on profile page
- Fixed profile page content not using full available width

---

## v0.27.2 (2026-02-10)

### New Features

#### CLI File Upload & Attachment

Upload files and attach resources to tasks directly from the terminal — no need to open the web app.

- `ud upload resource <file>` — Upload a file to your resource library
- `ud attach resource <resource-id> --entity-type <type> --entity-id <id>` — Attach a resource to a task or other entity
- Upload and attach in one step by specifying the target entity during upload

---

## v0.27.1 (2026-02-10)

### New Features

#### Dataflow AI Generation

Generate dataflow diagrams using AI directly in the diagram editor. Supports multiple AI providers — describe your data flow in natural language and get a diagram instantly.

### Improvements

- Sidebar auto-hides when editing diagrams for more workspace

---

## v0.27.0 (2026-02-10)

### New Features

#### Tag Management Page

A new dedicated page for browsing and managing your tags. The left panel shows all tags with usage counts, and the right panel displays tasks for the selected tag.

- Master-detail two-column layout for easy navigation
- Sort tags by most used, alphabetical, or recent
- Search to filter tags quickly
- View all tasks associated with a tag, with pagination
- Delete unused tags directly from the list

---

## v0.26.0 (2026-02-09)

### New Features

#### Tag Autocomplete

All tag inputs now show smart suggestions from your existing tags. Suggestions appear immediately when you focus the input — no typing required. The suggestion dropdown stays open when selecting multiple tags for faster batch tagging.

### Improvements

- Tags now display as `#tag` pill badges consistently across the app
- Tag names now support special characters

### Bug Fixes

- Fixed tag suggestions not refreshing after saving task tags

---

## v0.25.5 (2026-02-09)

### New Features

#### kubectl-style CLI Commands

The CLI now supports `get`, `describe`, `apply`, `delete` as top-level commands for managing tasks, making operations more intuitive.

### Improvements

- Saved query task rows can now be opened in a new tab
- In-app CLI documentation updated with kubectl-style command reference
- Query docs now link to full documentation site

---

## v0.25.4 (2026-02-08)

### New Features

#### Sidebar Advanced Search

Added advanced search entry point in the sidebar for quick navigation to the search page.

#### CLI Note Apply Command

New `ud task note apply` command to create or update task notes directly from the CLI.

### Improvements

- Admin pages (users, roles, groups) now use mobile-first card layouts for better browsing on mobile devices

### Bug Fixes

- Fixed command palette selecting extra items when pressing Ctrl/Cmd+Enter in link modal

---

## v0.25.3 (2026-02-08)

### New Features

#### Natural Language Search

Search your data using natural language queries in the advanced search page, no need to remember complex query syntax.

---

## v0.25.2 (2026-02-08)

### Improvements

- Query builder simple mode now supports all field types (text, number, date, boolean, select, etc.) with appropriate input controls for each type

### Bug Fixes

- Fixed CONTAINS_ALL query generating incorrect syntax in the query builder

---

## v0.25.0 (2026-02-07)

### New Features

#### Saved Queries

Save and reuse your frequently used task search queries for quick access. Expandable task rows let you view descriptions and notes inline without navigating to the detail page.

#### Sidebar Collapsible Sections

Navigation items are now organized into collapsible sections with clean divider labels, making the sidebar more organized and easier to navigate.

### Improvements

- Updated application icons

### Bug Fixes

- Fixed duplicate task creation when pressing Ctrl+Enter in Kanban view
- Fixed custom field support in saved query validation and autofill

---

## v0.24.0 (2026-02-06)

### New Features

#### Kanban Task Creation Matches Column Conditions

When creating a task from a specific column, the task automatically inherits the column's filter values. For example, creating a task in the "High Priority" column will automatically set it as high priority.

#### Custom Field Namespace System

Custom field names now support Unicode characters including Chinese, allowing you to name fields more naturally.

### Improvements

- Kanban column actions now support Chinese/English i18n
- System boards show an edit protection warning to prevent accidental modifications
- User-type enum fields supported in kanban column conditions

### Bug Fixes

- Fixed custom field metadata prefix handling in task detail panel
- Fixed shared boards not appearing in "Add to Board" modal
- Fixed user candidate prefetching and caching

---

## v0.23.0 (2026-02-05)

### New Features

#### Advanced Kanban Filtering and Querying

Kanban boards now support more powerful task filtering capabilities to help you find exactly what you need.

- String fields support fuzzy matching (LIKE, ILIKE) and null checks (IS NULL, IS NOT NULL)
- Number fields support full comparison operators (equals, greater than, less than, etc.)
- Enum fields support IN operator with multi-select for matching multiple values at once
- Added 8 new queryable fields: Status, Scheduled Date, Due Date, Started Time, Paused Time, Completed Time, Tag IDs, Priority

#### Custom Fields Improvements

- Custom field keys are now auto-generated, eliminating manual input
- Kanban cards now display task status
- Custom field dropdowns now show usernames instead of user IDs for better clarity

#### Command Palette Enhancement

Command palette now auto-detects and looks up entity UUIDs, making it easy to quickly locate tasks, budgets, and other resources.

#### User Experience Improvements

- Slash menu reordered: Task List moved to the top, Text formatting to the bottom, matching usage frequency
- Added Chinese translation support for Kanban interface

### Bug Fixes

- Fixed user field dropdown options not populating in Kanban
- Fixed custom fields not refreshing when task tags change
- Fixed Kanban query string parsing for comparison operators
- Fixed Kanban IN operator query formatting
- Fixed i18n translation key paths for field names
- Fixed field names not updating when language changes

### Improvements

- User dropdowns now refresh automatically when opened, ensuring up-to-date data
- Enhanced Chinese translations throughout Kanban interface

---

## v0.22.2 (2026-02-03)

### New Features

#### Trash & Recycle Bin

Tasks can now be safely deleted with the ability to restore them later.

- View deleted tasks in the new Trash page
- Restore accidentally deleted tasks with one click
- Kanban boards show a recycle bin widget in the sidebar

### Improvements

- Keyboard shortcuts now accessible via command palette

### Bug Fixes

- Fixed loading spinners appearing unnecessarily on kanban columns
- Fixed task deletion causing brief flicker in todo list
- Improved state handling when deleting tasks

---

## v0.22.1 (2026-02-03)

### New Features

#### Dashboard Quick Search

Added a command palette widget to the dashboard. Click to quickly search tasks, expenses, and commands without memorizing keyboard shortcuts.

#### Kanban Tag Filtering Enhancement

- Support "not contains" operator for filtering tasks without specific tags
- Clearer "contains/not contains" labels in condition configuration

#### CLI Improvements

- Require confirmation before marking tasks as done to prevent accidental completion

### Bug Fixes

- Fixed tag query consistency in Kanban boards
- Improved column configuration form layout
- Fixed issue where empty boards couldn't add columns

---

## v0.22.0 (2026-02-02)

### New Features

#### Kanban Card Transfer Actions

Cards can now automatically trigger preset actions when moving between columns:
- Support for column exit actions (exitAction)
- Smart break logic to prevent duplicate triggers
- Multiple actions are merged for efficient execution

#### ud-cli Task Linking Commands

New `link` and `unlink` commands to associate and disassociate tasks

### Improvements

- Personal tier users can now see dedicated feature entry points

### Bug Fixes

- Fixed kanban column actions not saving correctly in some cases
- Fixed default column action generation when creating boards

---

## v0.21.11 (2026-02-02)

### Improvements

#### Kanban Column Sort Order

Set sort order when creating kanban columns for more flexible task organization.

### Bug Fixes

- Fixed slash menu keyboard navigation scroll and Enter key issues in markdown editor

---

## v0.21.10 (2026-02-01)

### New Features

#### CLI Apply Command

New kubectl-style `apply` command for managing tasks using YAML files:

```bash
ud task apply -f task.yaml
```

#### Kanban Custom Field Sorting

Kanban now supports sorting by custom fields with intelligent direction labels based on field type.

### Bug Fixes

- Fix custom field sorting to properly handle null values
- Fix CLI status values to use correct format
- Fix private board updates to allow owners proper access
- Improve error messages for board permission issues

---

## v0.21.9 (2026-01-31)

### Improvements

#### Board Type Selection

When creating boards, you can now choose the board type (private or shared), giving you more flexibility in organizing tasks.

#### Simplified Private Boards

Private boards no longer create unnecessary groups, making personal task management cleaner and simpler.

---

## v0.21.8 (2026-01-31)

### New Features

#### CLI Task Notes

Add notes, progress updates, and comments to tasks via CLI for seamless human-AI collaboration.

```bash
# Add a progress note
ud task note add abc123 "✓ Auth module done"

# List all notes for a task
ud task note list abc123

# Delete a note
ud task note delete abc123 note-id
```

This enables workflows where AI agents can log progress while humans track and provide context.

---

## v0.21.7 (2026-01-31)

### New Features

#### Custom Field Sorting

Task lists now support sorting by custom fields, allowing you to organize tasks based on project-specific fields.

#### CLI Improvements

- **Short ID Matching**: Use task ID prefixes to quickly select tasks without typing the full ID
- **Batch Update Command**: New `task apply` command for file-based batch updates

```bash
# Use short IDs to operate on tasks
ud task get abc     # Matches tasks starting with "abc"

# Batch update tasks from file
ud task apply tasks.yaml
```

---

## v0.21.6 (2026-01-31)

### New Features

#### Natural Language Task Query

Query your tasks using natural language from the CLI:

```bash
ud nlquery "show me tasks due this week"
ud nlquery "what are my high priority tasks?"
```

---

## v0.21.5 (2026-01-31)

### New Features

#### CLI Multi-Account Support

Manage multiple accounts and API endpoints with kubectl-style commands:

- **Multi-context management**: Easily switch between personal and work accounts
- **Multi-server support**: Configure development, staging, and production servers
- **Environment variable overrides**: Support for CI/CD scenarios

Common commands:
- `ud config get-contexts` - List all configured contexts
- `ud config use-context work` - Switch to work account
- `ud login --context staging` - Login to a specific context

### Documentation

- Added comprehensive CLI multi-context authentication guide

---

## v0.21.1 (2026-01-30)

### Improvements

#### CLI Installation Experience

- **Version Check**: CLI now supports `ud --version` command to verify installation
- **One-liner Install**: Subscribe page CLI section now has a copyable one-liner install command

---

## v0.21.0 (2026-01-30)

### New Features

#### Command Line Interface (CLI)

A brand new terminal tool for managing tasks from the command line:

- **TUI Interactive Mode**: Run `ud` to enter a visual terminal interface
  - Vim-style keybindings (j/k to move, gg/G to jump, / to search, etc.)
  - Browse task list and detail views
  - Create, edit, and delete tasks directly

- **File Picker**: Press `f` to open an fzf-like fuzzy search
  - Select files from current directory to create tasks
  - First line becomes title, rest becomes description
  - Binary files are automatically skipped

- **One-shot Commands**: Perfect for scripts and automation
  - `ud task list` - List tasks
  - `ud task create "title"` - Create a task
  - `ud task done <id>` - Mark task as done

- **AI Agent Integration**: Let Claude Code, Cursor, and other AI tools access your tasks

#### CLI Downloads

- **New CLI Download Section**: Added to subscribe page with support for macOS, Linux, and Windows
- **Complete Documentation**: New CLI docs page with installation, configuration, and usage instructions

---

## v0.20.3 (2026-01-29)

### Improvements

#### Kanban List View Enhancements

- **Column Settings Edit**: Click the settings button next to column headers in list view to edit column filters and sort order
- **Create Kanban Guide**: When clicking settings on the "All Tasks" system board, a helpful dialog appears encouraging you to create your own custom kanban for more flexible configuration

---

## v0.20.2 (2026-01-29)

### New Features

#### Kanban List View

A new list view mode for kanban boards, offering a more flexible way to browse tasks:

- **List View Mode**: Switch to list view on kanban page to see tasks in table format
- **All Tasks Board**: New system-level "All Tasks" board for viewing all private tasks
- **Board Selector**: Quickly switch between boards from the list page header

#### Task Detail Page Improvements

- **Desktop Sticky Sidebar**: The task detail sidebar now stays fixed in the viewport while scrolling

### Improvements

- **Navigation Update**: Tasks menu now links directly to kanban list view
- **Segmented Control Redesign**: Sidebar header now uses segmented controls for more intuitive interaction
- **Column Sorting**: Kanban columns now support ORDER BY configuration
- **Search Preview**: Added search preview link in column edit dialog

### Bug Fixes

- **Task Detail Sidebar**: Fixed sticky sidebar positioning
- **Kanban Translations**: Fixed missing i18n translations
- **Expense Date Format**: Fixed date format when updating expenses
- **Custom Field Queries**: Fixed custom field handling in kanban queries

---

## v0.20.1 (2026-01-29)

### New Features

#### Smart Kanban Drag & Drop

When dragging a task to a new column, the system intelligently updates task properties to match the target column's conditions:

- **Automatic property updates**: Task fields are automatically set to match target column requirements
- **Smart cleanup**: Properties only relevant to the source column are automatically cleared
- **Tag handling**: Tags are intelligently added or removed, not overwritten

#### Multi-Column Task Display

- **Tasks can appear in multiple columns**: If a task matches the conditions of multiple columns, it will appear in all matching columns
- **Independent card operations**: Each card instance can be dragged independently

#### Custom Field Filtering for Kanban

- **Custom field support**: Column match conditions now support custom fields for filtering
- **Flexible condition combinations**: Combine status, tags, and custom fields to create precise task views

#### Kanban Documentation

- **New kanban documentation**: Added documentation link in the board info hover card for easy access to usage guide

### Improvements

- **Column settings dialog**: Click column title to open dialog for easier viewing and editing of column name and match conditions

---

## v0.20.0 (2026-01-28)

### New Features

#### Kanban Edit Mode

A new kanban layout editing feature for more flexible task view management:

- **Layout Edit Mode**: Click "Edit Layout" button to enter edit mode
  - Inline column name editing - double-click to modify
  - Edit board conditions and column filters directly
  - Use status dropdown for quick condition selection
  - Drag columns to reorder

- **Condition Editor**: Display current filter conditions next to board title
  - Edit raw query string directly
  - Click to navigate to search page and view matches

#### Mind Map Enhancements

- **Status Color Display**: Task nodes now show different colors based on status, instantly identify task progress

#### Task View Sorting

- **Per-Section Sorting**: Configure independent sort rules for each section
- **View Default Sorting**: Pre-set sort configuration when creating views

#### Command Palette Improvements

- **Keyboard Shortcut Hints**: Display shortcuts for task creation and selection
- **Clearer Shortcut Display**: Improved visual presentation of keyboard shortcuts

### Improvements

- **Kanban Performance**: Column reordering uses optimistic updates for smoother interactions
- **View Editing**: Root-level filters can now be edited (with warning)

### Bug Fixes

- **Mind Map Stability**: Fixed tooltip display issues
- **Kanban Status Selection**: Fixed status value matching issues

---

## v0.19.1 (2026-01-27)

### Documentation Improvements

- **AI Chat Clarification**: Clearer explanation of communication modes for different AI providers, helping you better understand how AI features work
- **Version Numbering Guide**: Added explanation of version numbers in release notes, so you understand what each version means
- **Migration Guide**: Added data migration instructions for v0.18.0, helping self-hosted users upgrade smoothly
- **AI Assistance Tips**: Added AI assistance tips to query syntax documentation
- **Quick Access to Updates**: "What's New" button now links directly to the full release notes page

---

## v0.19.0 (2026-01-27)

### New Features

#### Mind Map

Visualize and organize your tasks with mind maps!

- **Task Hierarchy Mind Map**: Click "Mind Map" button in task detail page to view tasks and subtasks as a mind map
  - Automatically generate mind map from task relationships
  - Click nodes to navigate to task details
  - Clearly visualize task hierarchy

- **Mind Map Editor**: Add mind maps as task attachments
  - Click "Add Mind Map" in task attachments section
  - Create nodes and connections freely
  - Drag nodes to rearrange
  - Double-click to edit node content
  - Export as image

---

## v0.18.0 (2025-01-24)

### New Features

#### Resource Management Enhancements

- **One-to-Many Resource Links**: A single file can now be linked to multiple tasks, budgets, or accounts
  - Example: Link one design file to multiple related tasks
  - View all linked items on resource detail page

- **Quick Upload**: New upload button in resources page header for easier file uploads

### Improvements

- **Accounts, Budgets, Expenses Pages**: Faster loading and smoother interactions
- **Attachment Management**: Fixed several issues with attachment deletion and display
- **UI Polish**: Simplified button styles for a cleaner interface

### Upgrade Notes (Self-Hosted Users)

If you're upgrading from a previous version to v0.18.0, you need to run the following migration script to migrate existing resource associations:

```sql
-- Migration script: Migrate resource associations to new link table
-- This migrates entity_type/entity_id data from resources table
-- to the new resource_entity_links many-to-many join table.
-- Run AFTER the new table has been created by GORM AutoMigrate.
-- Safe to run multiple times (uses INSERT OR IGNORE).

INSERT OR IGNORE INTO resource_entity_links (
    id,
    resource_id,
    entity_type,
    entity_id,
    created_at,
    created_by,
    updated_at,
    updated_by
)
SELECT
    lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' ||
          substr(hex(randomblob(2)),2) || '-' ||
          substr('89ab',abs(random()) % 4 + 1, 1) ||
          substr(hex(randomblob(2)),2) || '-' || hex(randomblob(6))) as id,
    r.id as resource_id,
    r.entity_type,
    r.entity_id,
    COALESCE(r.created_at, datetime('now')) as created_at,
    r.owner_id as created_by,
    COALESCE(r.updated_at, datetime('now')) as updated_at,
    r.owner_id as updated_by
FROM resources r
WHERE r.entity_type IS NOT NULL
  AND r.entity_type != ''
  AND r.entity_id IS NOT NULL
  AND r.entity_id != ''
  AND NOT EXISTS (
    SELECT 1 FROM resource_entity_links rel
    WHERE rel.resource_id = r.id
      AND rel.entity_type = r.entity_type
      AND rel.entity_id = r.entity_id
  );
```

**How to run**:
1. Connect to your database file using an SQLite client
2. Execute the above SQL script
3. Restart the application

---

## Previous Versions

For earlier version history, please refer to the project's Git commit log.
