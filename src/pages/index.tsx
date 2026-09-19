import {useEffect, useState, type MouseEvent, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, {translate} from '@docusaurus/Translate';

import PhoneDemo from '@site/src/components/HeroDemos/PhoneDemo';
import KanbanDemo from '@site/src/components/HeroDemos/KanbanDemo';
import GraphDemo from '@site/src/components/HeroDemos/GraphDemo';
import AgentsDemo from '@site/src/components/HeroDemos/AgentsDemo';

import {PlatformGlyph, PlatformGlyphDefs} from '@site/src/components/PlatformGlyphs';

import styles from './butler.module.css';
import hero from './home-hero.module.css';

/**
 * Homepage, design v8 (ud task d9f0567c, master 2026-08-29).
 *
 * THE FIRST SCREEN IS A DELIBERATE COPY of the reference product page's hero —
 * master's words were 「首屏完全模仿」. Copied: layout, grid, whitespace
 * rhythm, size ramp, colour relationships, button shape and icon placement,
 * and the tile row's arrangement and size (every ratio lives in
 * home-hero.module.css). NOT copied, and never to be: the reference's mark,
 * its wordmark, its headline typeface, or anything that would let a visitor
 * think this is their page.
 *
 * Everything BELOW the first screen still follows the older rule — learn the
 * structure and rhythm, do not copy pixels — so the four-angle showcase, the
 * Alfred funnel, the engine row, the architecture diagram and the CTA are the
 * v7.1 sections, unchanged apart from the showcase losing its headline role.
 *
 * Two consequences worth knowing before editing:
 *  - The biggest line on the ZH homepage is now a Latin product name. That is
 *    a known cost of copying the screen, not a missing translation.
 *  - The agent-onboarding pill no longer sits above the fold. The reference's
 *    first screen has no counterpart to it, so copying the screen left it no
 *    room; it is the first thing under the fold instead.
 */

/**
 * Agent onboarding pill.
 *
 * The whole onboarding contract is one line of text an agent can act on:
 * `Fetch <AGENT_SETUP_PROMPT_URL>`. The prompt itself lives in this repo at
 * static/agent-setup/prompt.md and is served straight out of the Workers asset
 * build, so the URL below and the file are the same bytes — there is no second
 * copy to keep in sync. Edit the file in this repo, never here.
 *
 * The URL used to be the GitHub raw one, on the theory that oatnil.com's bot
 * protection blocked some agents' fetchers. It points at the docs domain again
 * (task 2b70fc29, owner report 2026-08-18: agents were failing to fetch GitHub
 * content). Measured 2026-08-18 before the switch: no-UA, curl, python-requests,
 * Go-http-client, node-fetch, Claude-User, GPTBot and ChatGPT-User each got
 * `200 text/markdown`, 6019 bytes, from https://udctl.com/agent-setup/prompt.md
 * — no challenge on any of them. If an agent ever does get challenged here, the
 * fix is a Cloudflare WAF/bot-management exception for this path, not another
 * host: the prompt tells the agent it is published at this URL so it can
 * re-verify authenticity, and that self-reference has to stay true.
 */
const AGENT_SETUP_PROMPT_URL = 'https://udctl.com/agent-setup/prompt.md';
const AGENT_SETUP_COMMAND = `Fetch ${AGENT_SETUP_PROMPT_URL}`;

/** The Clipboard API needs a secure context; keep the button working over plain http. */
function copyViaTextarea() {
  const el = document.createElement('textarea');
  el.value = AGENT_SETUP_COMMAND;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  el.remove();
}

function AgentSetupButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const id = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = () => {
    // Flip the label first: Chrome can leave writeText pending until the document
    // regains focus, so awaiting it would swallow the feedback entirely.
    setCopied(true);
    try {
      const pending = navigator.clipboard?.writeText(AGENT_SETUP_COMMAND);
      if (pending) {
        pending.catch(copyViaTextarea);
        return;
      }
    } catch {
      // Fall through — no Clipboard API here.
    }
    copyViaTextarea();
  };

  // Boss feedback 2026-07-26 (task b00f9e8f): the pill stays compact — never
  // print the Fetch command itself, only a copy glyph; the command lives in
  // the title tooltip and the clipboard.
  //
  // This is an <a href={prompt url}>, not a <button>, and the href is the
  // load-bearing part (task 15455d96): a text/markdown conversion of this page
  // drops `title` and `onClick`, so a <button> made the prompt invisible to
  // exactly the audience it exists for — a fetched copy of the page carried no
  // path to prompt.md at all. A plain left click still copies instead of
  // navigating (the human behavior is unchanged); modified clicks and
  // non-click fetchers get the real URL.
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    copy();
  };
  return (
    <a
      href={AGENT_SETUP_PROMPT_URL}
      className={styles.agentSetupButton}
      onClick={onClick}
      title={AGENT_SETUP_COMMAND}
      aria-label={translate({
        id: 'homepage.hero.agentSetup.aria',
        message: 'Copy the agent setup prompt',
      })}>
      <span>
        {copied ? (
          <Translate id="homepage.hero.agentSetup.copied">Copied — paste it into your agent</Translate>
        ) : (
          <Translate id="homepage.hero.agentSetup.label">Onboard your agent to udctl</Translate>
        )}
      </span>
      <code className={styles.agentSetupCode}>{copied ? '✓' : '⧉'}</code>
    </a>
  );
}

// --- First screen: the copied hero ---

/**
 * The seven access surfaces, in the order the download page's census lists
 * them: four you install the app onto, then three that reach into a workspace
 * that is already there. Labels are short here — the census page carries the
 * detail line, this row carries only "you can use it from here".
 *
 * Every tile links somewhere real. A tile that promises a surface and lands on
 * nothing is worse than one tile fewer, so this list may only grow by adding a
 * surface that has been clicked through, not by adding a name.
 */
type Tile = {key: string; glyph: string; href: string; label: ReactNode};

function useTiles(): Tile[] {
  return [
    {
      key: 'desktop',
      glyph: 'ud-g-desktop',
      href: '/download#desktop',
      label: <Translate id="home5.tile.desktop">Desktop</Translate>,
    },
    {key: 'web', glyph: 'ud-g-web', href: '/download#web', label: <Translate id="home5.tile.web">Web</Translate>},
    {key: 'ios', glyph: 'ud-g-ios', href: '/download#mobile', label: <Translate id="home5.tile.ios">iOS</Translate>},
    {
      key: 'android',
      glyph: 'ud-g-android',
      href: '/download#mobile',
      label: <Translate id="home5.tile.android">Android</Translate>,
    },
    {key: 'chat', glyph: 'ud-g-chat', href: '/alfred', label: <Translate id="home5.tile.chat">Chat apps</Translate>},
    {
      key: 'terminal',
      glyph: 'ud-g-cli',
      href: '/download#cli',
      label: <Translate id="home5.tile.terminal">Terminal</Translate>,
    },
    {
      key: 'extension',
      glyph: 'ud-g-ext',
      href: '/download#extension',
      label: <Translate id="home5.tile.extension">Extension</Translate>,
    },
  ];
}

/** The chevron the strip and the reference's menus both use. */
function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function FirstScreen() {
  const tiles = useTiles();
  return (
    <div className={hero.heroBleed}>
      <PlatformGlyphDefs />
      <header className={hero.hero}>
        <div className={hero.strip}>
          <span>udctl</span>
          <a className={hero.stripJump} href="#explore">
            <Translate id="home5.strip.explore">Explore here</Translate>
            <Chevron />
          </a>
        </div>

        <div className={hero.body}>
          {/*
            The headline is the product name in BOTH locales — the chosen layout
            (slogan as the subtitle, master's default 2026-08-29) keeps the
            reference's structure, and the reference's headline is its product
            name. The ZH cost is real and known: the biggest line a Chinese
            reader sees is a Latin word, and the Chinese claim sits one line
            below it. Promoting the slogan into the headline is the one change
            that buys that back, and it is a structural change, not a copy edit.
          */}
          <h1 className={hero.h1}>udctl</h1>

          {/*
            EN and ZH carry different sentences here on purpose. ZH gets the
            slogan master approved verbatim (「把一切放回你手里」) plus the
            entry list, in the reference's two-part shape. EN keeps the
            product's existing approved subtitle — the site tagline in
            docusaurus.config.ts — because no English wording for the slogan has
            been approved, and an unapproved outward-facing line must not ship.
          */}
          <p className={hero.sub}>
            <Translate id="home5.hero.sub">
              One workspace for tasks, knowledge, and AI agents — private, portable, yours.
            </Translate>
          </p>

          <div className={hero.ctas}>
            <Link className={hero.ctaPrimary} to="/download">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="M12 3v12M7.5 10.5L12 15l4.5-4.5M4 19.5h16" />
              </svg>
              <Translate id="home5.hero.ctaDownload">Download for macOS</Translate>
            </Link>
            <Link className={hero.ctaSecondary} to="/docs/intro">
              <Translate id="home5.hero.ctaDocs">Read the docs</Translate>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
              </svg>
            </Link>
          </div>
          {/* Order follows our own download page, not the reference's. */}
          <p className={hero.fine}>
            <Translate id="home5.hero.fine">Available for macOS, Windows, and Linux.</Translate>
          </p>

          <p className={hero.waysLabel}>
            <Translate id="home5.hero.ways">Other ways to use udctl:</Translate>
          </p>
          <div className={hero.tiles}>
            {tiles.map((t) => (
              <Link key={t.key} className={hero.tile} to={t.href}>
                <PlatformGlyph id={t.glyph} className={hero.tileIcon} />
                <span className={hero.tileLabel}>{t.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>
    </div>
  );
}

/**
 * The agent pill, first thing below the fold.
 *
 * The pill itself stays compact (boss feedback 2026-07-26, task b00f9e8f: never
 * print the Fetch command, only a copy glyph). The redesign draft drew it with
 * the command printed; that instruction was never withdrawn, so the position
 * moved and the shape did not.
 */
function AgentSetupRow() {
  return (
    <div className={hero.agentRow}>
      <p className={hero.agentLabel}>
        <Translate id="home5.agent.label">Brought an AI agent? Paste this into it</Translate>
      </p>
      <AgentSetupButton />
    </div>
  );
}

// --- Showcase: four rotating angles, copy and stage in sync ---

type Slide = {key: string; t1: ReactNode; t2: ReactNode; sub: ReactNode; tab: ReactNode; demo: ReactNode};

// Each slide's demo is an interactive simulation (src/components/HeroDemos/)
// rendered inside the fixed stage frame — same footprint for every slide.
// Built inside a hook, not at module scope, so the Translate ids stay
// statically extractable.
function useSlides(): Slide[] {
  return [
    {
      key: 'alfred',
      t1: <Translate id="home4.slide.alfred.t1">You just chat.</Translate>,
      t2: <Translate id="home4.slide.alfred.t2">Alfred handles the rest.</Translate>,
      sub: (
        <Translate id="home4.slide.alfred.sub">
          A private butler living in your Telegram: he understands, remembers, delegates, tracks — and results return
          to the chat.
        </Translate>
      ),
      tab: <Translate id="home4.tab.alfred">Chat with Alfred</Translate>,
      demo: <PhoneDemo frameless />,
    },
    {
      key: 'boards',
      t1: <Translate id="home4.slide.boards.t1">Tasks, boards, notes —</Translate>,
      t2: <Translate id="home4.slide.boards.t2">one place.</Translate>,
      sub: (
        <Translate id="home4.slide.boards.sub">
          Everything Alfred notes lands on your boards. When you want hands-on control, it's all there.
        </Translate>
      ),
      tab: <Translate id="home4.tab.boards">Boards</Translate>,
      demo: <KanbanDemo />,
    },
    {
      key: 'knowledge',
      t1: <Translate id="home4.slide.knowledge.t1">Every task is a doc.</Translate>,
      t2: <Translate id="home4.slide.knowledge.t2">Search, and it's there.</Translate>,
      sub: (
        <Translate id="home4.slide.knowledge.sub">
          Markdown notes, meeting minutes, decision records — linked into one graph; full-text search brings anything
          back in a second.
        </Translate>
      ),
      tab: <Translate id="home4.tab.knowledge">Knowledge</Translate>,
      demo: <GraphDemo />,
    },
    {
      key: 'agents',
      t1: <Translate id="home4.slide.agents.t1">A team of agents,</Translate>,
      t2: <Translate id="home4.slide.agents.t2">at your command.</Translate>,
      sub: (
        <Translate id="home4.slide.agents.sub">
          Dev, ops, writing — each has a specialist. Alfred is the head butler who hands work to the right one.
        </Translate>
      ),
      tab: <Translate id="home4.tab.agents">Agents</Translate>,
      demo: <AgentsDemo />,
    },
  ];
}

const ROTATE_MS = 5000;

/**
 * The four-angle showcase. It used to BE the hero; the copied first screen took
 * that job, so it is now the section the first screen's "Explore here" jumps
 * to. Copy, tabs and demos are unchanged.
 */
function ShowcaseSection() {
  const slides = useSlides();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // `index` in the deps restarts the countdown on every slide change, so a
  // manual tab click always gets the full 5s (and an interaction with the
  // demo isn't cut short by a timer started slides ago).
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, index, slides.length]);

  const slide = slides[index];

  return (
    <section
      id="explore"
      className={`${styles.hero} ${styles.wrap}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      <div>
        <div className={styles.eyebrow}>
          <Translate id="home4.hero.eyebrow">Private AI Butler &amp; Workspace</Translate>
        </div>
        {/* All four copy blocks stay mounted, stacked in one grid cell
            (.copyStack); the tallest sets the column height at every viewport
            width, so switching tabs never changes the section height — the
            page used to jump one h1 line (71px at 1440, task 340300ec).
            This stack IS the height reservation: the old h1/sub min-heights
            are gone on purpose, do not reintroduce them. Swapping the class
            (fadeup ↔ copyGhost) replays the entrance animation, which the
            key-remount used to do. */}
        <div className={styles.copyStack}>
          {slides.map((s, i) => (
            <div
              key={s.key}
              className={i === index ? styles.fadeup : styles.copyGhost}
              aria-hidden={i !== index}>
              <h2>
                {s.t1}
                <br />
                <span className={styles.turn}>{s.t2}</span>
              </h2>
              <p className={styles.sub}>{s.sub}</p>
            </div>
          ))}
        </div>
        {/* Boss feedback 2026-07-26: the hero sells udctl, not "an
            Alfred app" — exactly three CTAs, each landing on a dedicated
            page (never a docs page): /alfred, /download, /self-hosting. */}
        <div className={styles.ctas}>
          <Link className={styles.btnPrimary} to="/alfred">
            <Translate id="home4.hero.ctaMeet">Meet Alfred →</Translate>
          </Link>
          <Link className={styles.btnGhost} to="/download">
            <Translate id="home4.hero.ctaDownload">Download</Translate>
          </Link>
          <Link className={styles.btnGhost} to="/self-hosting">
            <Translate id="home4.hero.ctaSelfhost">Self-Host</Translate>
          </Link>
        </div>
        {/* "Built since September 2024" is a trust signal, and the date is
            verifiable: the first ud-next-web commit is 2024-09-22 (ud-server
            2024-09-23). NOT the current monorepo's 2025-07-03 — that is only
            the Go+Vite rewrite. Do not restate it as another year. It lives on
            this line rather than the eyebrow because .eyebrow is uppercase
            monospace at 0.22em tracking (a date there overflows on mobile) and
            because this line already carries the rest of the same credential
            triad. See ud tasks e95c1469 (note d6f1e6b1) and 92d5ed92. */}
        <p className={styles.fine}>
          <Translate id="home4.hero.fine">Free for personal use · Self-hostable · Desktop, web, iOS &amp; chat apps · Built since September 2024</Translate>
        </p>
      </div>

      <div className={styles.stageBox}>
        <div
          className={styles.stage}
          aria-label={translate({id: 'home4.hero.stageAria', message: 'Product showcase'})}>
          <div key={slide.key} className={styles.fadeup} style={{height: '100%'}}>
            {slide.demo}
          </div>
        </div>
        <div
          className={styles.angleTabs}
          role="tablist"
          aria-label={translate({id: 'home4.hero.stageAria', message: 'Product showcase'})}>
          {slides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={i === index ? styles.tabOn : undefined}
              onClick={() => setIndex(i)}>
              {/* Alfred keeps a green lead-dot: he is the headline angle. */}
              {s.key === 'alfred' && <span className={styles.leadDot} />}
              {s.tab}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- "What is udctl?" — count, then catch ---
/**
 * Two beats, heavy then light (ud task 1e56b4ca, master 2026-09-13). Beat one
 * piles up everything udctl is — the reader is MEANT to finish the list
 * thinking "that's a lot, this must be complex". Beat two catches it: you are
 * not the one operating any of it, your AI is. The contrast IS the section's
 * value; an edit that flattens it into a feature grid has removed its reason
 * to exist. Every line is backed by a shipped feature (per-line evidence is
 * recorded on the task), and the two product names are scoped to exactly what
 * we do — Jira: the board/sprint/backlog/burndown loop; Obsidian: `ud pull`
 * writes a folder of plain .md files it opens natively. Do not widen either,
 * and do not add a line that is not shipped: the list must survive a hostile
 * reader trying each item.
 *
 * It sits directly above MeetAlfredSection on purpose: the catch ("your AI
 * drives it") hands straight into "Don't want to learn an interface? Start
 * with Alfred."
 */
function WhatIsSection() {
  const code = (s: string) => <code className={styles.whatCode}>{s}</code>;
  const items: Array<{key: string; t: ReactNode; d: ReactNode}> = [
    {
      key: 'agile',
      t: <Translate id="home6.what.agile.t">An agile tracker</Translate>,
      d: (
        <Translate id="home6.what.agile.d">
          boards, sprints, backlog, burndown — the loop you would otherwise run in Jira.
        </Translate>
      ),
    },
    {
      key: 'docs',
      t: <Translate id="home6.what.docs.t">A knowledge base</Translate>,
      // Confluence is named on master's explicit ruling (task 1e56b4ca,
      // 2026-09-14 「就是要点名」), in the same scoped sense as Jira above:
      // "where you would otherwise do this", never "we are Confluence".
      d: (
        <Translate id="home6.what.docs.d">
          every card is a Markdown document; notes, full-text search, a graph of links — the pages you would
          otherwise keep in Confluence.
        </Translate>
      ),
    },
    {
      key: 'vault',
      t: <Translate id="home6.what.vault.t">A local notes folder</Translate>,
      // The advantage clause states OUR packaging and never claims Obsidian
      // lacks sync — Obsidian Sync exists, it is a paid per-user add-on
      // (obsidian.md/sync, checked 2026-09-14: $4-8/user/mo). Keep the
      // sentence about us. "Ships with self-hosting" is verified against
      // route_table.go: the sync endpoints (todolist/batch-upsert,
      // synced-paths) and every /resources route carry no Tier — only
      // admin/multi-user surfaces do — so sync is built into every tier,
      // license or none. Do NOT strengthen it to "free": team self-host
      // license pricing is being decided (master, task 1e56b4ca 2026-09-14),
      // only personal is flatly free. "Manage themselves" is the ud-cli
      // round trip: pull downloads web-uploaded attachments into the vault
      // and rewrites them to ![[..]] embeds (fetchattach.go); push uploads
      // new local files and re-attaches embeds to the card (push.go
      // bindEmbeddedResources).
      d: (
        <Translate id="home6.what.vault.d" values={{pull: code('ud pull'), push: code('ud push')}}>
          {
            '{pull} lays your tasks out as plain .md files Obsidian opens as a vault; {push} them back. Sync ships with self-hosting — nothing you buy on top — and image attachments manage themselves: pulled down as ![[…]] embeds, pushed back onto the card.'
          }
        </Translate>
      ),
    },
    {
      key: 'vpath',
      t: <Translate id="home6.what.vpath.t">A virtual file tree</Translate>,
      d: (
        <Translate id="home6.what.vpath.d">
          tasks, files, skills, diagrams — all hanging on one folder tree you browse like a file manager.
        </Translate>
      ),
    },
    {
      key: 'ledger',
      t: <Translate id="home6.what.ledger.t">A ledger</Translate>,
      d: (
        <Translate id="home6.what.ledger.d">
          expenses, budgets, accounts — multi-currency.
        </Translate>
      ),
    },
    {
      key: 'calendar',
      t: <Translate id="home6.what.calendar.t">A calendar, plus a Gantt chart</Translate>,
      d: (
        <Translate id="home6.what.calendar.d">
          kickoffs and deadlines on a month grid, and on a timeline.
        </Translate>
      ),
    },
    {
      key: 'cli',
      t: <Translate id="home6.what.cli.t">A kubectl-style CLI</Translate>,
      d: (
        <Translate id="home6.what.cli.d" values={{get: code('ud get'), apply: code('ud apply')}}>
          {'{get}, {apply} — the same cards, from your terminal.'}
        </Translate>
      ),
    },
    {
      key: 'agents',
      t: <Translate id="home6.what.agents.t">An agent orchestra</Translate>,
      d: (
        <Translate id="home6.what.agents.d">
          hire a team of specialist agents — group them, hand off work, wake them on schedule; plus a butler living
          in your Telegram.
        </Translate>
      ),
    },
    {
      key: 'selfhost',
      // Cost is stated as structure, not numbers (task 1e56b4ca round 3):
      // we have no public price to cite (the subscribe page says the hosted
      // plan is coming soon), and competitor prices are tiered and change —
      // a dated comparison is the easiest claim on the page to falsify.
      // "No per-seat line" is structurally true of self-hosting and cannot
      // expire.
      t: <Translate id="home6.what.selfhost.t">… self-hosted</Translate>,
      d: (
        <Translate id="home6.what.selfhost.d">
          the whole thing runs on your own machine — free for personal use, with no per-seat line on any bill.
        </Translate>
      ),
    },
  ];
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>
          <Translate id="home6.what.eyebrow">What is udctl</Translate>
        </div>
        <h2>
          <Translate id="home6.what.title">Honestly? It's a lot of things.</Translate>
        </h2>
        <div className={styles.whatList}>
          {items.map((item) => (
            <div key={item.key} className={styles.whatItem}>
              <div className={styles.whatT}>{item.t}</div>
              <div className={styles.whatD}>{item.d}</div>
            </div>
          ))}
        </div>
        <p className={styles.whatTurn}>
          <Translate id="home6.what.turn">
            Sounds like a lot to learn? It would be — if you were the one operating it.
          </Translate>
        </p>
        <p className={styles.whatCatch}>
          <Translate
            id="home6.what.catch"
            values={{
              mention: (
                <code className={styles.whatCode}>
                  <Translate id="home6.what.mention">@dev fix this bug</Translate>
                </code>
              ),
            }}>
            {
              "You don't have to. Leave one sentence on any card — {mention} — and that sentence starts an agent session: bound to the card, progress written back onto it, the result replied right under your words. Board, CLI, chat — one copy of the data underneath. Your AI drives all of it; you learn none of it."
            }
          </Translate>
        </p>
      </div>
    </section>
  );
}

// --- "Start with Alfred" funnel ---
function MeetAlfredSection() {
  return (
    <section className={styles.section}>
      <div className={`${styles.wrap} ${styles.meet}`}>
        <div>
          <div className={styles.eyebrow}>
            <Translate id="home4.meet.eyebrow">The lead angle</Translate>
          </div>
          <h2>
            <Translate id="home4.meet.title">Don't want to learn an interface? Start with Alfred.</Translate>
          </h2>
          <p className={styles.lede}>
            <Translate id="home4.meet.lede">
              Everything above — tasks, ledger, the agent team — can be driven entirely by chatting with Alfred.
            </Translate>
          </p>
        </div>
        <Link className={styles.btnGhost} to="/alfred">
          <Translate id="home4.meet.cta">Meet Alfred →</Translate>
        </Link>
      </div>
    </section>
  );
}

// --- Engine row: the five demoted angles, one line each ---
function EngineSection() {
  const items: Array<{key: string; t: ReactNode; d: ReactNode}> = [
    {
      key: 'tasks',
      t: <Translate id="home4.engine.tasks.t">Tasks &amp; Boards</Translate>,
      d: <Translate id="home4.engine.tasks.d">Everything is a task; views your way.</Translate>,
    },
    {
      key: 'notes',
      t: <Translate id="home4.engine.notes.t">Notes</Translate>,
      d: <Translate id="home4.engine.notes.d">Long-form lives beside your tasks.</Translate>,
    },
    {
      key: 'finance',
      t: <Translate id="home4.engine.finance.t">Finance</Translate>,
      d: <Translate id="home4.engine.finance.d">Multi-currency ledger, monthly rollups.</Translate>,
    },
    {
      key: 'agents',
      t: <Translate id="home4.engine.agents.t">Agent team</Translate>,
      d: <Translate id="home4.engine.agents.d">AI colleagues you hire, team up, hand off to.</Translate>,
    },
    {
      key: 'selfhost',
      t: <Translate id="home4.engine.selfhost.t">Self-hosted</Translate>,
      d: <Translate id="home4.engine.selfhost.d">Your data, on your own machine.</Translate>,
    },
  ];
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>
          <Translate id="home4.engine.eyebrow">One engine</Translate>
        </div>
        <h2>
          <Translate id="home4.engine.title">Five angles, one udctl</Translate>
        </h2>
        <div className={styles.engineRow}>
          {items.map((item) => (
            <div key={item.key} className={styles.engineItem}>
              <div className={styles.engineT}>{item.t}</div>
              <div className={styles.engineD}>{item.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Architecture (design v6): box-and-arrow SVG between engine row and CTA ---
// Main line 你 → IM entry → Alfred → orchestration → CLI execution layer, with
// memory (bidirectional), scheduling and the prompt/cwd config plane as side
// inputs, and the dashed ⑤ edge returning results to the chat. Colors go
// through the .scope tokens so light/dark adapt.
//
// Two compositions of the same diagram, swapped by CSS at 820px (task 704a59ea):
// the landscape SVG (880×530) for wide screens, and a portrait SVG (360×668)
// for phones — on a 390px phone the landscape version left only a 342px window
// onto a 760px drawing, with the whole spine off-screen. Both carry the exact
// same nodes, numbered steps and return edges (⑤ results→chat, writes back,
// configures); reuse the same Translate ids so the two can never say different
// things. Change one → change both. Markers are duplicated with `2`-suffixed
// ids because url(#…) refs into a display:none <svg> don't render.
// (The old note "mirrored in the Vite app's ArchitectureSection" is obsolete —
// ud-vite-app dropped its copy; this file is the only home of the diagram.)
function ArchitectureSection() {
  const s = styles;
  return (
    <section className={s.section}>
      <div className={s.wrap}>
        <div className={s.eyebrow}>
          <Translate id="home4.arch.eyebrow">Architecture</Translate>
        </div>
        <h2>
          <Translate id="home4.arch.title">How udctl is put together</Translate>
        </h2>
        <p className={s.lede}>
          <Translate id="home4.arch.lede">
            To you, it's a conversation. Underneath: memory, orchestration, and scheduling — three systems resting on
            an execution layer that does the real work.
          </Translate>
        </p>

        <div className={s.archScroll}>
          <svg
            className={s.archsvg}
            viewBox="0 0 880 530"
            role="img"
            aria-label={translate({id: 'home4.arch.aria', message: 'udctl architecture diagram'})}>
            <defs>
              <marker id="arch-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className={s.aMk} />
              </marker>
              <marker id="arch-arrM" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className={s.aMkM} />
              </marker>
              <marker id="arch-arrA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className={s.aMkA} />
              </marker>
            </defs>

            {/* you */}
            <rect x="375" y="12" width="130" height="36" rx="18" className={s.aBox} />
            <text x="440" y="35" textAnchor="middle" className={s.aTt}>
              <Translate id="home4.arch.you">💬 You</Translate>
            </text>

            {/* ① you -> IM */}
            <line x1="440" y1="48" x2="440" y2="84" className={s.aEdge} markerEnd="url(#arch-arr)" />
            <text x="452" y="70" className={s.aEstep}>
              <Translate id="home4.arch.step1">① Send a message</Translate>
            </text>

            {/* IM entry */}
            <rect x="290" y="88" width="300" height="52" rx="10" className={s.aBox} />
            <text x="440" y="109" textAnchor="middle" className={s.aTt}>
              <Translate id="home4.arch.im">IM entry</Translate>
            </text>
            <text x="440" y="128" textAnchor="middle" className={s.aSub}>
              Telegram · Discord · Web
            </text>

            {/* IM -> Alfred */}
            <line x1="440" y1="140" x2="440" y2="176" className={s.aEdge} markerEnd="url(#arch-arr)" />

            {/* Alfred */}
            <rect x="340" y="180" width="200" height="56" rx="12" className={s.aBoxAccent} />
            <text x="440" y="203" textAnchor="middle" className={`${s.aTt} ${s.aOnAccent}`}>
              🎩 Alfred
            </text>
            <text x="440" y="222" textAnchor="middle" className={`${s.aSub} ${s.aOnAccent}`}>
              <Translate id="home4.arch.alfredSub">Private butler</Translate>
            </text>

            {/* ② Alfred <-> Memory (read/write) */}
            <path d="M 380,236 L 380,264 L 190,264 L 190,296" className={s.aEdge} markerStart="url(#arch-arr)" markerEnd="url(#arch-arr)" />
            <text x="285" y="257" textAnchor="middle" className={s.aEstep}>
              <Translate id="home4.arch.step2">② Understand &amp; remember</Translate>
            </text>

            {/* memory */}
            <rect x="90" y="300" width="200" height="66" rx="10" className={s.aBox} />
            <text x="190" y="326" textAnchor="middle" className={s.aTt}>
              <Translate id="home4.arch.memory">Memory</Translate>
            </text>
            <text x="190" y="346" textAnchor="middle" className={s.aSub}>
              tasks · notes · boards — markdown
            </text>

            {/* ③ Alfred -> Orchestration */}
            <line x1="440" y1="236" x2="440" y2="296" className={s.aEdge} markerEnd="url(#arch-arr)" />
            <text x="452" y="270" className={s.aEstep}>
              <Translate id="home4.arch.step3">③ Delegate</Translate>
            </text>

            {/* orchestration */}
            <rect x="330" y="300" width="220" height="66" rx="10" className={s.aBox} />
            <text x="440" y="326" textAnchor="middle" className={s.aTt}>
              <Translate id="home4.arch.orch">Orchestration</Translate>
            </text>
            <text x="440" y="346" textAnchor="middle" className={s.aSub}>
              <Translate id="home4.arch.orchSub">agent team + resident daemons</Translate>
            </text>

            {/* scheduling */}
            <rect x="640" y="238" width="180" height="52" rx="10" className={s.aBox} />
            <text x="730" y="259" textAnchor="middle" className={s.aTt}>
              <Translate id="home4.arch.sched">Scheduling</Translate>
            </text>
            <text x="730" y="277" textAnchor="middle" className={s.aSub}>
              scheduled jobs &amp; agents
            </text>

            {/* scheduling -> orchestration */}
            <path d="M 640,264 L 540,264 L 540,296" className={s.aEdgeM} markerEnd="url(#arch-arrM)" />
            <text x="588" y="256" textAnchor="middle" className={s.aElabel}>
              <Translate id="home4.arch.fires">fires on schedule</Translate>
            </text>

            {/* prompt/cwd config plane */}
            <rect x="640" y="330" width="180" height="66" rx="10" className={s.aBoxDash} />
            <text x="730" y="356" textAnchor="middle" className={s.aTt}>
              prompt · cwd
            </text>
            <text x="730" y="376" textAnchor="middle" className={s.aSub}>
              <Translate id="home4.arch.configSub">agent definition · project</Translate>
            </text>

            {/* config -> orchestration */}
            <line x1="640" y1="352" x2="554" y2="352" className={s.aEdgeM} markerEnd="url(#arch-arrM)" />
            <text x="597" y="344" textAnchor="middle" className={s.aElabel}>
              <Translate id="home4.arch.configures">configures</Translate>
            </text>

            {/* ④ orchestration -> CLI */}
            <line x1="440" y1="366" x2="440" y2="428" className={s.aEdge} markerEnd="url(#arch-arr)" />
            <text x="452" y="400" className={s.aEstep}>
              <Translate id="home4.arch.step4">④ Execute</Translate>
            </text>

            {/* CLI layer */}
            <rect x="270" y="432" width="340" height="66" rx="10" className={s.aBox} />
            <text x="440" y="458" textAnchor="middle" className={s.aTt}>
              <Translate id="home4.arch.cli">Execution — the real CLIs</Translate>
            </text>
            <text x="440" y="478" textAnchor="middle" className={s.aSub}>
              Claude Code · Codex · OpenCode · …
            </text>

            {/* CLI writes back to memory */}
            <path d="M 270,465 L 190,465 L 190,370" className={s.aEdgeM} markerEnd="url(#arch-arrM)" />
            <text x="230" y="457" textAnchor="middle" className={s.aElabel}>
              <Translate id="home4.arch.writesBack">writes back</Translate>
            </text>

            {/* ⑤ results return to chat */}
            <path d="M 610,465 L 848,465 L 848,114 L 594,114" className={s.aEdgeA} markerEnd="url(#arch-arrA)" />
            <text x="721" y="104" textAnchor="middle" className={s.aEstep}>
              <Translate id="home4.arch.step5">⑤ Results return to chat</Translate>
            </text>
          </svg>
        </div>

        {/* Portrait composition for phones — same nodes, same edges, same
            Translate ids as the landscape SVG above. Spine runs down x=180;
            side systems flank it (memory left, scheduling right, config left);
            the two return flows ride the margins: writes-back rail up the left
            (x=16), ⑤ results rail up the right (x=352). */}
        <svg
          className={`${s.archsvg} ${s.archMob}`}
          viewBox="0 0 360 668"
          role="img"
          aria-label={translate({id: 'home4.arch.aria', message: 'udctl architecture diagram'})}>
          <defs>
            <marker id="arch2-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className={s.aMk} />
            </marker>
            <marker id="arch2-arrM" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className={s.aMkM} />
            </marker>
            <marker id="arch2-arrA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className={s.aMkA} />
            </marker>
          </defs>

          {/* you */}
          <rect x="120" y="8" width="120" height="36" rx="18" className={s.aBox} />
          <text x="180" y="31" textAnchor="middle" className={s.aTt}>
            <Translate id="home4.arch.you">💬 You</Translate>
          </text>

          {/* ① you -> IM */}
          <line x1="180" y1="44" x2="180" y2="80" className={s.aEdge} markerEnd="url(#arch2-arr)" />
          <text x="172" y="66" textAnchor="end" className={s.aEstep}>
            <Translate id="home4.arch.step1">① Send a message</Translate>
          </text>

          {/* IM entry */}
          <rect x="50" y="84" width="260" height="52" rx="10" className={s.aBox} />
          <text x="180" y="105" textAnchor="middle" className={s.aTt}>
            <Translate id="home4.arch.im">IM entry</Translate>
          </text>
          <text x="180" y="124" textAnchor="middle" className={s.aSub}>
            Telegram · Discord · Web
          </text>

          {/* IM -> Alfred; ⑤ label sits in this gap, next to the right rail */}
          <line x1="180" y1="136" x2="180" y2="172" className={s.aEdge} markerEnd="url(#arch2-arr)" />
          <text x="344" y="160" textAnchor="end" className={s.aEstep}>
            <Translate id="home4.arch.step5">⑤ Results return to chat</Translate>
          </text>

          {/* Alfred */}
          <rect x="90" y="176" width="180" height="56" rx="12" className={s.aBoxAccent} />
          <text x="180" y="199" textAnchor="middle" className={`${s.aTt} ${s.aOnAccent}`}>
            🎩 Alfred
          </text>
          <text x="180" y="218" textAnchor="middle" className={`${s.aSub} ${s.aOnAccent}`}>
            <Translate id="home4.arch.alfredSub">Private butler</Translate>
          </text>

          {/* ② Alfred <-> Memory (read/write) */}
          <line x1="126" y1="232" x2="126" y2="276" className={s.aEdge} markerStart="url(#arch2-arr)" markerEnd="url(#arch2-arr)" />
          <text x="136" y="258" textAnchor="start" className={s.aEstep}>
            <Translate id="home4.arch.step2">② Understand &amp; remember</Translate>
          </text>

          {/* memory */}
          <rect x="12" y="280" width="160" height="66" rx="10" className={s.aBox} />
          <text x="92" y="302" textAnchor="middle" className={s.aTt}>
            <Translate id="home4.arch.memory">Memory</Translate>
          </text>
          <text x="92" y="320" textAnchor="middle" className={s.aSub}>
            tasks · notes · boards
          </text>
          <text x="92" y="336" textAnchor="middle" className={s.aSub}>
            — markdown
          </text>

          {/* ③ Alfred -> Orchestration */}
          <line x1="180" y1="232" x2="180" y2="466" className={s.aEdge} markerEnd="url(#arch2-arr)" />
          <text x="188" y="444" textAnchor="start" className={s.aEstep}>
            <Translate id="home4.arch.step3">③ Delegate</Translate>
          </text>

          {/* scheduling */}
          <rect x="200" y="300" width="140" height="52" rx="10" className={s.aBox} />
          <text x="270" y="322" textAnchor="middle" className={s.aTt}>
            <Translate id="home4.arch.sched">Scheduling</Translate>
          </text>
          <text x="270" y="340" textAnchor="middle" className={s.aSub}>
            scheduled jobs &amp; agents
          </text>

          {/* scheduling -> orchestration */}
          <line x1="270" y1="352" x2="270" y2="466" className={s.aEdgeM} markerEnd="url(#arch2-arrM)" />
          <text x="344" y="380" textAnchor="end" className={s.aElabel}>
            <Translate id="home4.arch.fires">fires on schedule</Translate>
          </text>

          {/* prompt/cwd config plane */}
          <rect x="24" y="380" width="148" height="62" rx="10" className={s.aBoxDash} />
          <text x="98" y="404" textAnchor="middle" className={s.aTt}>
            prompt · cwd
          </text>
          <text x="98" y="424" textAnchor="middle" className={s.aSub}>
            <Translate id="home4.arch.configSub">agent definition · project</Translate>
          </text>

          {/* config -> orchestration */}
          <line x1="98" y1="442" x2="98" y2="466" className={s.aEdgeM} markerEnd="url(#arch2-arrM)" />
          <text x="108" y="460" textAnchor="start" className={s.aElabel}>
            <Translate id="home4.arch.configures">configures</Translate>
          </text>

          {/* orchestration */}
          <rect x="50" y="470" width="260" height="66" rx="10" className={s.aBox} />
          <text x="180" y="496" textAnchor="middle" className={s.aTt}>
            <Translate id="home4.arch.orch">Orchestration</Translate>
          </text>
          <text x="180" y="516" textAnchor="middle" className={s.aSub}>
            <Translate id="home4.arch.orchSub">agent team + resident daemons</Translate>
          </text>

          {/* ④ orchestration -> CLI */}
          <line x1="180" y1="536" x2="180" y2="586" className={s.aEdge} markerEnd="url(#arch2-arr)" />
          <text x="188" y="566" textAnchor="start" className={s.aEstep}>
            <Translate id="home4.arch.step4">④ Execute</Translate>
          </text>

          {/* CLI layer */}
          <rect x="30" y="590" width="300" height="66" rx="10" className={s.aBox} />
          <text x="180" y="616" textAnchor="middle" className={s.aTt}>
            <Translate id="home4.arch.cli">Execution — the real CLIs</Translate>
          </text>
          <text x="180" y="636" textAnchor="middle" className={s.aSub}>
            Claude Code · Codex · OpenCode · …
          </text>

          {/* CLI writes back to memory — left margin rail */}
          <path d="M 30,623 L 16,623 L 16,346" className={s.aEdgeM} markerEnd="url(#arch2-arrM)" />
          <text x="24" y="368" textAnchor="start" className={s.aElabel}>
            <Translate id="home4.arch.writesBack">writes back</Translate>
          </text>

          {/* ⑤ results return to chat — right margin rail, label up in the IM gap */}
          <path d="M 330,623 L 352,623 L 352,110 L 314,110" className={s.aEdgeA} markerEnd="url(#arch2-arrA)" />
        </svg>
      </div>
    </section>
  );
}

// --- CTA ---
function CtaSection() {
  return (
    <section className={styles.ctaBand}>
      <div className={styles.wrap}>
        <h2>
          <Translate id="home4.cta.title">Starting today, hand it to Alfred.</Translate>
        </h2>
        <Link className={styles.btnPrimary} to="/download">
          <Translate id="home4.cta.primary">Get started with Alfred</Translate>
        </Link>
        <p className={styles.fine}>
          <Translate id="home4.cta.fine">Free for personal use · Self-hostable · Running in five minutes</Translate>
        </p>
        {/* Executable text, in the text flow on purpose (task 15455d96): the
            page advertised `ud get`/`ud apply` above while carrying zero
            install commands and never linking its own CLI/API references. A
            text-mode fetch keeps only what is in the flow — commands and
            links must never retreat into a tooltip or a click handler. */}
        <p className={styles.fine}>
          <Translate id="home4.cta.installLead">Prefer the terminal?</Translate>{' '}
          <code className={styles.whatCode}>npm install -g @oatnil/ud</code>
        </p>
        <p className={styles.fine}>
          <Link to="/docs/cli">
            <Translate id="home4.cta.cliRef">CLI reference</Translate>
          </Link>
          {' · '}
          <Link to="/docs/api-reference">
            <Translate id="home4.cta.apiRef">API reference</Translate>
          </Link>
        </p>
      </div>
    </section>
  );
}

/**
 * Structured data for the homepage (audit efb0ebf3 #6). Two nodes in one graph:
 * the Organization is what search engines attach the brand ("udctl", formerly
 * "UnDercontrol") and the sameAs profiles to; the SoftwareApplication is what
 * lets a result carry the app category / price / platforms. `name` is not
 * translated on purpose — the brand token is the same in every locale — while
 * the description reuses the localized meta description so the two never drift.
 */
function homepageJsonLd(description: string): string {
  const url = 'https://udctl.com';
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name: 'udctl',
        alternateName: 'UnDercontrol',
        url,
        logo: `${url}/img/favicon.svg`,
        sameAs: [
          'https://github.com/oatnil-top',
          'https://www.npmjs.com/package/@oatnil/ud',
          'https://discord.gg/vkw2nhxE',
          'https://t.me/+qoTRSTL82lMxZjJl',
          'https://chromewebstore.google.com/detail/undercontrol-web-clipper/mckkbigikfkoeddpcbhdmpncoljoagog',
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${url}/#software`,
        name: 'udctl',
        alternateName: 'UnDercontrol',
        description,
        url,
        downloadUrl: `${url}/download`,
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'macOS, Windows, Linux, iOS, Android, Web',
        offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free for personal use'},
        author: {'@id': `${url}/#organization`},
      },
    ],
  });
}

export default function Home(): ReactNode {
  // The zh homepage gets the zh social card; every other page falls back to
  // themeConfig.image. react-helmet-async keeps the last og:image, so this
  // overrides the site-wide one instead of adding a second tag.
  const {i18n: {currentLocale}, siteConfig: {url}} = useDocusaurusContext();
  const socialCard = `${url}/img/social-card${currentLocale === 'zh-Hans' ? '.zh-Hans' : ''}.png`;
  const metaDescription = translate({
    id: 'homepage.description',
    message:
      'udctl (UnDercontrol) schedules, retries, and remembers for a team of AI agents on real CLIs. Delegate from chat; results land in your tasks. Self-hosted.',
    description: 'The homepage meta description',
  });
  return (
    <Layout
      title={translate({
        id: 'homepage.title',
        message: 'Run a Team of AI Agents on Your Own Machine',
        description: 'The homepage meta title',
      })}
      description={metaDescription}>
      <Head>
        <meta property="og:image" content={socialCard} />
        <meta name="twitter:image" content={socialCard} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{homepageJsonLd(metaDescription)}</script>
      </Head>
      <main className={styles.scope}>
        <FirstScreen />
        <AgentSetupRow />
        <ShowcaseSection />
        <WhatIsSection />
        <MeetAlfredSection />
        <EngineSection />
        <ArchitectureSection />
        <CtaSection />
      </main>
    </Layout>
  );
}
