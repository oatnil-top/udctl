/**
 * Download — standalone page at /download, every distributable in one place:
 * desktop apps, CLI, web app, browser extension, mobile status, self-host.
 *
 * Pure TSX with both locales in this one file as {en, zh} strings picked by
 * the current docusaurus locale (same pattern as /configuration — no i18n
 * mirror file). The version comes from version.json, which the release
 * workflow bumps every release, so download links never go stale by hand.
 *
 * Distribution facts encoded here (keep them true):
 * - Desktop binaries live on R2 under releases/{version}/; only recent
 *   versions are retained, which is why links must derive from version.json.
 * - macOS builds are Developer ID signed + notarized, but the owner prefers
 *   not to advertise it (2026-07-25): no "signed/notarized" badges or copy on
 *   the page. It also means never re-add xattr/right-click instructions.
 * - Windows builds are NOT code signed and won't be (owner declined the cert,
 *   2026-07-28), so SmartScreen flags an unknown publisher on first run. The
 *   Windows footnote states that plainly and gives the one step past it — keep
 *   it plain text, never a warning callout.
 * - The CLI ships through npm only (@oatnil/ud). The Homebrew tap is dead.
 * - iOS is in public beta via the TestFlight link below (Beta group, cap 1000
 *   testers). Builds expire after 90 days, so keep TestFlight uploads flowing.
 * - Android ships as a direct apk on R2 (since 0.0.9, 2026-07-28) — NOT through
 *   Google Play, so first-time installs pass an "unknown sources" prompt. That
 *   is stated as a footnote in the same plain tone as the Windows one.
 *   The apk carries the ud-mobile app's own version, which moves independently
 *   of version.json (that one is the desktop/web release train) — hence the
 *   separate ANDROID_VERSION constant and R2 path.
 *
 * The hero is the page's platform census — every surface a first-time visitor
 * might be looking for, one node each, no versions or file sizes (those belong
 * to the sections below). It doubles as the section nav, which is why there is
 * no separate jump row. It is drawn as a hub diagram rather than a grid of
 * buttons because the census alone undersells the product: seven clients that
 * all resolve to ONE workspace is the thing competitors don't have, and a
 * picture says it faster than a sentence. See HUB_RUN_ON / HUB_REACH_IN.
 *
 * Owned by the Onboarding Experience Owner.
 */
import {useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Check, ChevronRight, Copy, Download as DownloadIcon, ExternalLink} from 'lucide-react';

import {PlatformGlyph, PlatformGlyphDefs} from '@site/src/components/PlatformGlyphs';

import versionConfig from '../../version.json';
import styles from './download.module.css';

const VERSION: string = versionConfig.version;

const APP_URL = 'https://ud.oatnil.com';
const R2_RELEASES = 'https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/releases';
const CHROME_STORE_URL =
  'https://chromewebstore.google.com/detail/undercontrol-web-clipper/mckkbigikfkoeddpcbhdmpncoljoagog';
const SHORTCUT_URL = 'https://www.icloud.com/shortcuts/4e0becebe3cd48a180940ccbd04d6fa7';
const TESTFLIGHT_URL = 'https://testflight.apple.com/join/st2TnaBF';

// Android is versioned by the mobile app itself, not by version.json, and lives
// under its own R2 prefix: releases/android/<version>/undercontrol-<version>.apk.
// Bump both when a new apk lands and re-check the link answers 200.
const ANDROID_VERSION = '0.0.20';
const ANDROID_APK_FILE = `undercontrol-${ANDROID_VERSION}.apk`;
const ANDROID_APK_URL = `${R2_RELEASES}/android/${ANDROID_VERSION}/${ANDROID_APK_FILE}`;

const CLI_INSTALL = `# requires Node.js 18+
npm install -g @oatnil/ud
ud --version`;

type L = {en: string; zh: string};

function useT() {
  const {i18n} = useDocusaurusContext();
  const zh = i18n.currentLocale === 'zh-Hans';
  return (l: L) => (zh ? l.zh : l.en);
}

// --- Desktop artifacts ---

interface PlatformDl {
  os: L;
  arch: string;
  file: string;
}

const PLATFORMS: PlatformDl[] = [
  {
    os: {en: 'macOS', zh: 'macOS'},
    arch: 'Apple Silicon · .dmg',
    file: `undercontrol-desktop-${VERSION}-arm64.dmg`,
  },
  {
    os: {en: 'macOS', zh: 'macOS'},
    arch: 'Intel · .dmg',
    file: `undercontrol-desktop-${VERSION}-x64.dmg`,
  },
  {
    os: {en: 'Windows', zh: 'Windows'},
    arch: 'x64 · installer .exe',
    file: `undercontrol-desktop-${VERSION}-setup.exe`,
  },
  {
    os: {en: 'Linux', zh: 'Linux'},
    arch: 'x64 · AppImage',
    file: `undercontrol-desktop-${VERSION}.AppImage`,
  },
];

// --- Hero platform census, drawn as a hub ---
//
// Two groups, and the split is a fact rather than a ranking: HUB_RUN_ON are
// surfaces you install the app onto, HUB_REACH_IN are tools you already use
// reaching into a workspace that is already there. A visitor arrives asking
// "is my platform here?", and that question is answered by the group they
// recognise, not by whichever client we happen to consider most important.
//
// `href` omitted = no artifact to link at yet; the node renders as a plain div
// so an unshipped platform stays visible without handing anyone a 404. No node
// is in that state today (Android left it when the apk shipped).
//
// Every href points at a section on this page, never straight at a binary: the
// hero is a census, and the file name, version and install caveats belong to the
// section that owns them. /alfred is the one off-page link — chat apps have no
// artifact to describe here.

interface HeroPlatform {
  /** id of a <g> in PlatformGlyphDefs (src/components/PlatformGlyphs). */
  glyph: string;
  name: L;
  meta: L;
  href?: string;
}

const HUB_RUN_ON: HeroPlatform[] = [
  {
    glyph: 'ud-g-desktop',
    name: {en: 'Desktop', zh: '桌面端'},
    meta: {en: 'macOS · Windows · Linux', zh: 'macOS · Windows · Linux'},
    href: '#desktop',
  },
  {
    glyph: 'ud-g-web',
    name: {en: 'Web', zh: '网页版'},
    meta: {en: 'Any browser · nothing to install', zh: '任何浏览器 · 免安装'},
    href: '#web',
  },
  {
    glyph: 'ud-g-ios',
    name: {en: 'iOS', zh: 'iOS'},
    meta: {en: 'Public beta on TestFlight', zh: 'TestFlight 公测中'},
    href: '#mobile',
  },
  {
    glyph: 'ud-g-android',
    name: {en: 'Android', zh: 'Android'},
    meta: {en: 'Direct APK download', zh: 'APK 直接下载'},
    href: '#mobile',
  },
];

const HUB_REACH_IN: HeroPlatform[] = [
  {
    glyph: 'ud-g-chat',
    name: {en: 'Chat apps', zh: '聊天软件'},
    meta: {en: 'Telegram', zh: 'Telegram'},
    href: '/alfred',
  },
  {
    glyph: 'ud-g-cli',
    name: {en: 'Terminal', zh: '命令行'},
    meta: {en: 'For you and your agents', zh: '给你，也给你的 AI Agent'},
    href: '#cli',
  },
  {
    glyph: 'ud-g-ext',
    name: {en: 'Browser extension', zh: '浏览器扩展'},
    meta: {en: 'Chrome Web Store', zh: 'Chrome 商店 · 网页剪藏'},
    href: '#extension',
  },
];


function CopyBtn({text}: {text: string}) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        },
        () => undefined,
      );
    }
  };
  return (
    <button type="button" className={`${styles.copybtn} ${copied ? styles.ok : ''}`} onClick={onCopy}>
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? t({en: 'Copied', zh: '已复制'}) : t({en: 'Copy', zh: '复制'})}
    </button>
  );
}

function Terminal({name, code}: {name: string; code: string}) {
  return (
    <div className={styles.term}>
      <div className={styles.termBar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.termName}>{name}</span>
        <CopyBtn text={code.replace(/^#.*\n/gm, '')} />
      </div>
      <div className={styles.termBody}>
        <pre>
          {code.split('\n').map((line, i) => (
            <span key={i} className={line.trimStart().startsWith('#') ? styles.cmt : undefined}>
              {line + '\n'}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

// --- Sections ---

/** One node of the hub. Renders as a plain div when there is nothing to link to. */
function HubNode({p}: {p: HeroPlatform}) {
  const t = useT();
  const body = (
    <>
      <PlatformGlyph id={p.glyph} className={styles.ic} />
      <span className={styles.nodeTxt}>
        <span className={styles.nodeName}>{t(p.name)}</span>
        <span className={styles.nodeMeta}>{t(p.meta)}</span>
      </span>
    </>
  );
  // In-page anchors stay raw <a>; route links go through Link so the zh-Hans
  // build keeps its locale prefix.
  return (
    <div className={styles.hubRow}>
      {p.href?.startsWith('#') ? (
        <a href={p.href} className={styles.node}>
          {body}
        </a>
      ) : p.href ? (
        <Link to={p.href} className={styles.node}>
          {body}
        </Link>
      ) : (
        <div className={`${styles.node} ${styles.nodeSoon}`}>{body}</div>
      )}
    </div>
  );
}

function Hero() {
  const t = useT();
  return (
    <header className={styles.hero}>
      <Link to="/docs/release-notes" className={styles.versionBadge}>
        <b>v{VERSION}</b>
        <span>·</span>
        <span>{t({en: "What's new", zh: '更新内容'})}</span>
        <ChevronRight size={12} strokeWidth={2} />
      </Link>
      <h1 className={styles.heroTitle}>
        {t({en: 'One workspace. ', zh: '一个工作空间。'})}
        <em>{t({en: 'Every platform.', zh: '所有平台。'})}</em>
      </h1>
      {/* Self-hosting used to hang off a separate "Also:" line under the census.
          The extension took its place in the hero, so the only survivor of that
          line lives here in the body copy instead. */}
      <p className={`${styles.lede} ${styles.heroLede}`}>
        {t({
          en: 'udctl runs where you do. Every client is free to start with, and they all connect to the same workspace — our cloud, or ',
          zh: 'udctl 跟随你的工作方式。每一个都可以免费开始，也都连接同一个工作空间——我们的云端，或',
        })}
        <a href="#selfhost">{t({en: 'a server you run yourself', zh: '你自己部署的服务器'})}</a>
        {t({en: '.', zh: '。'})}
      </p>
      {/* Five grid columns: run-on nodes | wires | core | wires | reach-in nodes.
          Below 860px the whole thing turns its axis (see download.module.css) —
          the core moves to the top and the trunk runs down the left. Same
          diagram, one axis; it is never dropped and never cropped. */}
      <div className={styles.hub}>
        <div className={`${styles.hubSide} ${styles.hubSideRun}`}>
          <p className={styles.hubCap}>{t({en: 'Install the app', zh: '应用装在这里'})}</p>
          {HUB_RUN_ON.map((p) => (
            <HubNode key={t(p.name)} p={p} />
          ))}
        </div>
        <div className={`${styles.wire} ${styles.wireRun}`} aria-hidden="true">
          {HUB_RUN_ON.map((p) => (
            <i key={t(p.name)} />
          ))}
        </div>
        <div className={styles.core}>
          <span className={styles.coreMark} aria-hidden="true" />
          <span className={styles.coreName}>{t({en: 'Your workspace', zh: '你的工作空间'})}</span>
          <span className={styles.coreMeta}>
            {t({en: 'One account', zh: '同一个账号'})}
            <br />
            {t({en: 'our cloud · or your own server', zh: '云端 · 或你自建的服务器'})}
          </span>
        </div>
        <span className={styles.hubStem} aria-hidden="true" />
        <div className={`${styles.wire} ${styles.wireReach}`} aria-hidden="true">
          {HUB_REACH_IN.map((p) => (
            <i key={t(p.name)} />
          ))}
        </div>
        <div className={`${styles.hubSide} ${styles.hubSideReach}`}>
          <p className={styles.hubCap}>{t({en: 'Reach in from here', zh: '也可以从这里接入'})}</p>
          {HUB_REACH_IN.map((p) => (
            <HubNode key={t(p.name)} p={p} />
          ))}
        </div>
      </div>
    </header>
  );
}

function DesktopSection() {
  const t = useT();
  return (
    <section className={styles.section} id="desktop">
      <p className={styles.eyebrow}>{t({en: 'Desktop app', zh: '桌面应用'})}</p>
      <h2 className={styles.h2}>
        {t({en: 'Local-first. Your data stays on your machine.', zh: '本地优先，数据留在你的电脑上。'})}
      </h2>
      <p className={styles.lede}>
        {t({
          en: 'The desktop app ships the full stack — UI and backend in one install. Work fully offline with no account, or connect it to a remote server whenever you want to sync.',
          zh: '桌面应用内置完整技术栈——界面和后端一次安装。无需账号即可完全离线使用，随时可连接远程服务器同步。',
        })}
      </p>
      <div className={styles.plats}>
        {PLATFORMS.map((p) => (
          <div key={p.file} className={styles.plat}>
            <h3 className={styles.platOs}>{t(p.os)}</h3>
            <div className={styles.platArch}>{p.arch}</div>
            <div className={styles.platSpacer} />
            <a className={styles.platBtn} href={`${R2_RELEASES}/${VERSION}/${p.file}`}>
              <DownloadIcon size={14} strokeWidth={2} />
              {t({en: 'Download', zh: '下载'})}
            </a>
            <div className={styles.platFile}>{p.file}</div>
          </div>
        ))}
      </div>
      <div className={styles.footnotes}>
        <p className={styles.footnote}>
          <b>Windows:</b>{' '}
          {t({
            en: 'the installer is unsigned, so Windows shows an "unknown publisher" warning the first time you run it — click ',
            zh: '安装包未签名，首次运行时 Windows 会提示「未知发布者」——点击',
          })}
          <b>{t({en: 'More info → Run anyway', zh: '更多信息 → 仍要运行'})}</b>
          {t({en: ' to continue.', zh: '即可继续。'})}
        </p>
        <p className={styles.footnote}>
          <b>Linux:</b>{' '}
          {t({en: 'make the AppImage executable first: ', zh: '先给 AppImage 加执行权限：'})}
          <code>chmod +x undercontrol-desktop-{VERSION}.AppImage</code>
        </p>
      </div>
    </section>
  );
}

function CliSection() {
  const t = useT();
  return (
    <section className={styles.section} id="cli">
      <p className={styles.eyebrow}>{t({en: 'Command line', zh: '命令行'})}</p>
      <h2 className={styles.h2}>
        {t({
          en: "The same workspace, in your terminal — and your agents'.",
          zh: '同一个工作空间，在你的终端里——也在你的 AI Agent 手里。',
        })}
      </h2>
      <p className={styles.lede}>
        {t({
          en: 'One npm install gives you ud: kubectl-style commands, an interactive TUI, and the interface AI coding agents use to read and write your tasks. npm is the only distribution channel.',
          zh: '一条 npm 命令装好 ud：kubectl 风格的命令、交互式 TUI，也是 AI 编码 Agent 读写你任务的接口。npm 是唯一分发渠道。',
        })}
      </p>
      <Terminal name="bash — npm" code={CLI_INSTALL} />
      <div className={styles.btnrow}>
        <Link className={styles.btnGhost} to="/docs/cli">
          {t({en: 'CLI documentation', zh: 'CLI 文档'})}
        </Link>
        <Link className={styles.btnGhost} to="/docs/cli-ai-integration">
          {t({en: 'Use it as an AI agent CLI', zh: '当作 AI Agent CLI 使用'})}
        </Link>
      </div>
    </section>
  );
}

function WebSection() {
  const t = useT();
  return (
    <section className={styles.section} id="web">
      <div className={styles.band}>
        <div>
          <p className={styles.eyebrow}>{t({en: 'Web app', zh: '网页版'})}</p>
          <h2 className={styles.h2}>{t({en: 'Nothing to install.', zh: '什么都不用装。'})}</h2>
          <p className={styles.lede}>
            {t({
              en: 'The hosted app runs in any modern browser — try it as a visitor before creating an account.',
              zh: '云端应用在任何现代浏览器中直接运行——注册之前可以先以游客身份试用。',
            })}
          </p>
        </div>
        <div className={styles.bandAction}>
          <a className={styles.btnPrimary} href={`${APP_URL}/#/login`} target="_blank" rel="noopener noreferrer">
            {t({en: 'Launch the web app', zh: '打开网页版'})}
            <ExternalLink size={14} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}

function ExtensionSection() {
  const t = useT();
  return (
    <section className={styles.section} id="extension">
      <div className={styles.band}>
        <div>
          <p className={styles.eyebrow}>{t({en: 'Browser extension', zh: '浏览器扩展'})}</p>
          <h2 className={styles.h2}>
            {t({en: 'Clip the web into your workspace.', zh: '把网页剪进你的工作空间。'})}
          </h2>
          <p className={styles.lede}>
            {t({
              en: 'udctl Web Clipper saves any page as a task with a full-page snapshot — video transcripts included.',
              zh: 'udctl Web Clipper 把任意网页存为任务，附带整页快照——还能提取视频字幕。',
            })}
          </p>
        </div>
        <div className={styles.bandAction}>
          <a className={styles.btnPrimary} href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer">
            {t({en: 'Add to Chrome', zh: '添加到 Chrome'})}
            <ExternalLink size={14} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}

function MobileSection() {
  const t = useT();
  return (
    <section className={styles.section} id="mobile">
      <div className={styles.band}>
        <div>
          <p className={styles.eyebrow}>{t({en: 'Mobile', zh: '移动端'})}</p>
          <h2 className={styles.h2}>
            {/* zh keeps a comma rather than the usual em dash: at 390px the dash
                wraps to the head of the second line, which reads as a stray. */}
            {t({en: 'iOS and Android — both in beta.', zh: 'iOS 与 Android，都在公测中。'})}
          </h2>
          <p className={styles.lede}>
            {t({
              en: 'The native iOS app is in public beta — join on TestFlight and it installs like any app, updates included. Android installs from the APK below. The Apple Shortcut still gives you one-tap task capture, and the web app works great on mobile browsers.',
              zh: '原生 iOS 应用已开启公测——通过 TestFlight 加入即可像普通 App 一样安装并自动更新。Android 通过下方的 APK 安装。Apple 快捷指令依旧支持一键创建任务，网页版在手机浏览器上也表现出色。',
            })}
          </p>
        </div>
        <div className={styles.bandAction}>
          <a className={styles.btnPrimary} href={TESTFLIGHT_URL} target="_blank" rel="noopener noreferrer">
            {t({en: 'Join the beta on TestFlight', zh: '通过 TestFlight 加入公测'})}
            <ExternalLink size={14} strokeWidth={2} />
          </a>
          {/* Wrapped so the file name hangs off its own button rather than
              floating between the two, which the column gap alone would do. */}
          <div>
            <a className={styles.btnPrimary} href={ANDROID_APK_URL}>
              <DownloadIcon size={14} strokeWidth={2} />
              {t({en: 'Download the Android APK', zh: '下载 Android APK'})}
            </a>
            <div className={styles.platFile}>{ANDROID_APK_FILE}</div>
          </div>
          <a className={styles.btnGhost} href={SHORTCUT_URL} target="_blank" rel="noopener noreferrer">
            {t({en: 'Get the Apple Shortcut', zh: '获取 Apple 快捷指令'})}
            <ExternalLink size={14} strokeWidth={2} />
          </a>
        </div>
      </div>
      <div className={styles.footnotes}>
        <p className={styles.footnote}>
          <b>Android:</b>{' '}
          {t({
            en: 'the APK comes straight from us rather than from Google Play, so the first install asks where the file came from — tap ',
            zh: 'APK 直接从我们这里下载，不经过 Google Play，因此首次安装时系统会询问文件来源——点击',
          })}
          <b>{t({en: 'Settings → Allow from this source', zh: '设置 → 允许来自此来源'})}</b>
          {t({en: ' and the install continues.', zh: '，安装即可继续。'})}
        </p>
      </div>
    </section>
  );
}

function SelfHostSection() {
  const t = useT();
  return (
    <section className={`${styles.section} ${styles.selfhost}`} id="selfhost">
      <p className={styles.eyebrow}>{t({en: 'Self-host', zh: '私有部署'})}</p>
      <h2 className={styles.h2}>{t({en: 'Or skip our cloud entirely.', zh: '或者，完全不依赖我们的云。'})}</h2>
      <p className={styles.lede}>
        {t({
          en: 'Every client above also works against a server you run yourself. Pick your path: one all-in-one Docker image (amd64 and arm64), or a bare-metal npm install — a single ud-server binary with the web UI built in. A free 3-month Pro trial license is included on the self-hosting page.',
          zh: '上面的每个客户端都可以连接你自己部署的服务器。两条路径任选：all-in-one Docker 镜像（支持 amd64 和 arm64），或裸机 npm 安装——一个自带 Web UI 的 ud-server 二进制。私有部署页面还附带免费 3 个月的 Pro 试用许可证。',
        })}
      </p>
      <div className={styles.btnrow}>
        <Link className={styles.btnPrimary} to="/self-hosting">
          {t({en: 'Self-hosting guide', zh: '私有部署指南'})}
        </Link>
        <Link className={styles.btnGhost} to="/configuration">
          {t({en: 'Configuration reference', zh: '配置参考'})}
        </Link>
        <Link className={styles.btnGhost} to="/docs/self-deployment">
          {t({en: 'Deployment docs', zh: '部署文档'})}
        </Link>
      </div>
    </section>
  );
}

export default function DownloadPage(): ReactNode {
  const t = useT();
  return (
    <Layout
      title={t({
        en: 'Download udctl — Desktop, CLI, Web, and Self-Host',
        zh: '下载 udctl——桌面端、CLI、网页版与私有部署',
      })}
      description={t({
        en: 'Download udctl for macOS, Windows, and Linux, install the CLI from npm, add the browser extension, or self-host the all-in-one Docker image.',
        zh: '下载 macOS、Windows、Linux 桌面版，通过 npm 安装 CLI，添加浏览器扩展，或用 all-in-one Docker 镜像私有部署 udctl。',
      })}>
      <main className={styles.page}>
        <PlatformGlyphDefs />
        <Hero />
        <DesktopSection />
        <CliSection />
        <WebSection />
        <ExtensionSection />
        <MobileSection />
        <SelfHostSection />
      </main>
    </Layout>
  );
}
