import {Fragment, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import {
  Lock,
  Code,
  WifiOff,
  Server,
  Copy,
  Check,
  FolderInput,
} from 'lucide-react';

import styles from './self-hosting.module.css';

// --- Free Pro trial license, valid until 2027-01-03 (dev-phase, shared publicly on purpose) ---
const LICENSE_TOKEN =
  'eyJjcmVhdGVkX2F0IjoxNzkxMTY5MDU3LCJ2YWxpZF91bnRpbCI6MTc5ODk0NTA1NywidGllciI6InBybyIsInVzZXJfbmFtZSI6IlNlbGYtSG9zdCBUcmlhbCIsInVzZXJfc2VjcmV0X2hhc2giOiJlZDJiYTE3OGM2NzBlYzdmZjA0NzdlZTc1MTAyNjVkM2M4NWUzN2QyNWI2NDcxNDc3OTBmZDJmZDJlMTI1YmQ4Iiwibm9uY2UiOiI0NmU0NTE5Mi04NWI0LTQzZDUtOTczYS1kMzg2MDc2NmZhNWMiLCJtYXhfdXNlcnMiOjV9.uP9ZL2efUQbLQAVa3RMgNVJi7br0o3i44yE64lhev21Gpw8_yp8Qs1jgKASLpEHsQgusS8oqq5QtVy7y5L0fBQ';
const LICENSE_SECRET = 'undercontrol-selfhost-trial';
const LICENSE_VALID_UNTIL = '2027-01-03';

// --- Copy-paste-ready snippets (code is not translated) ---
const HERO_RUN = `# the all-in-one image: frontend + backend in one container
# only you can log in; add -e REGISTRATION_ENABLED=true to let others sign up
docker run -d -p 3000:8080 \\
  -e HOST_DOMAIN=http://localhost:3000 \\
  -e JWT_SECRET=change-me-to-a-random-string \\
  -e ADMIN_EMAIL=admin@example.com \\
  -e ADMIN_PASSWORD=changeme \\
  -e LICENSE_TOKEN=${LICENSE_TOKEN} \\
  -e LICENSE_HOST_SECRET=${LICENSE_SECRET} \\
  -v undercontrol-data:/app/data \\
  lintao0o0/undercontrol:latest`;

const ENV_FILE = `# udctl - free Pro trial license (valid until ${LICENSE_VALID_UNTIL})
LICENSE_TOKEN=${LICENSE_TOKEN}
LICENSE_HOST_SECRET=${LICENSE_SECRET}`;

const COMPOSE_ALLINONE = `services:
  undercontrol:
    image: lintao0o0/undercontrol:latest
    container_name: undercontrol
    ports:
      - "3000:8080"
    environment:
      - GIN_MODE=release
      - HOST_DOMAIN=http://localhost:3000
      - JWT_SECRET=change-me-to-a-random-string
      - ADMIN_EMAIL=admin@example.com
      - ADMIN_PASSWORD=changeme
      # let other people sign up too (default: only you can log in)
      # - REGISTRATION_ENABLED=true
      # free Pro trial license (valid until ${LICENSE_VALID_UNTIL})
      - LICENSE_TOKEN=${LICENSE_TOKEN}
      - LICENSE_HOST_SECRET=${LICENSE_SECRET}
    volumes:
      - ./data:/app/data
    restart: unless-stopped`;

const COMPOSE_AIOPG = `services:
  postgres:
    image: postgres:18.1-alpine3.23
    environment:
      POSTGRES_DB: undercontrol
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s

  undercontrol:
    image: lintao0o0/undercontrol:latest
    ports:
      - "3000:8080"
    environment:
      - GIN_MODE=release
      - HOST_DOMAIN=http://localhost:3000
      - JWT_SECRET=change-me-to-a-random-string
      - DATABASE_TYPE=postgres
      - POSTGRES_HOST=postgres
      - POSTGRES_PORT=5432
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DATABASE=undercontrol
      - ADMIN_EMAIL=admin@example.com
      - ADMIN_PASSWORD=changeme
      # let other people sign up too (default: only you can log in)
      # - REGISTRATION_ENABLED=true
      - LICENSE_TOKEN=${LICENSE_TOKEN}
      - LICENSE_HOST_SECRET=${LICENSE_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

volumes:
  pg_data:`;

const COMPOSE_SPLIT = `services:
  postgres:
    image: postgres:18.1-alpine3.23
    environment:
      POSTGRES_DB: undercontrol
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s

  backend:
    image: lintao0o0/undercontrol-backend:latest
    environment:
      - GIN_MODE=release
      - DATABASE_TYPE=postgres
      - POSTGRES_HOST=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DATABASE=undercontrol
      - CORS_ALLOWED_ORIGINS=http://localhost:3000
      - HOST_DOMAIN=http://localhost:3000
      - JWT_SECRET=change-me-to-a-random-string
      - ADMIN_EMAIL=admin@example.com
      - ADMIN_PASSWORD=changeme
      # let other people sign up too (default: only you can log in)
      # - REGISTRATION_ENABLED=true
      - LICENSE_TOKEN=${LICENSE_TOKEN}
      - LICENSE_HOST_SECRET=${LICENSE_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    image: lintao0o0/undercontrol-vite-app:latest
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  pg_data:`;

const BAREMETAL_NPM = `# no Docker needed — one binary with the web UI built in (requires Node.js 18+)
npm install -g @oatnil/ud-server @oatnil/ud

# free Pro trial license (valid until ${LICENSE_VALID_UNTIL})
export LICENSE_TOKEN=${LICENSE_TOKEN}
export LICENSE_HOST_SECRET=${LICENSE_SECRET}

ud-server -host-domain http://localhost:8080 -data-path ./data`;

// The four brew commands are docs/self-deployment.md's Homebrew section (also
// homebrew-ud/README.md) — change them there first. One deliberate difference:
// the "Homebrew >= 6 only" note sits on its own line, never after the command.
// Pasted into macOS zsh (interactivecomments off by default) a trailing
// comment becomes arguments plus a redirect: `brew trust` gets "#" "Homebrew",
// exits 1 with "Trust targets must be fully-qualified", the tap stays
// untrusted, and the next `brew install` is refused (measured 2026-10-10). The formula writes
// $(brew --prefix)/etc/ud-server/.env on install and the service reads it, so
// the trial license goes into that file before the first start — together with
// ADMIN_EMAIL, without which a Pro-tier server refuses to boot (measured
// 2026-10-10 on ud-server 0.161.2: "STARTUP FAILED: ADMIN_EMAIL is not set").
const BREW_SERVER = `# macOS / Linux — the same binary, run by brew services in the background
brew tap oatnil-top/ud
# Homebrew >= 6 only (older Homebrew and Linuxbrew have no trust)
brew trust oatnil-top/ud
brew install ud-server

# free Pro trial license (valid until ${LICENSE_VALID_UNTIL}) + the admin account Pro requires
cat >> "$(brew --prefix)/etc/ud-server/.env" <<EOF
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme
LICENSE_TOKEN=${LICENSE_TOKEN}
LICENSE_HOST_SECRET=${LICENSE_SECRET}
EOF

brew services start ud-server`;

const HELM_INSTALL = `# production-grade: HA, autoscaling, rolling updates
helm repo add undercontrol https://oatnil-top.github.io/undercontrol-helm
helm repo update
helm install undercontrol undercontrol/undercontrol \\
  --create-namespace --namespace undercontrol \\
  --set backend.jwt.secret=change-me-to-a-random-string \\
  --set backend.licenseToken=${LICENSE_TOKEN} \\
  --set backend.licenseHostSecret=${LICENSE_SECRET}`;

// Render code with two functional tints: dimmed comments, gold license lines.
function renderCode(code: string): ReactNode {
  return code.split('\n').map((line, i) => {
    const trimmed = line.trimStart();
    let cls: string | undefined;
    if (trimmed.startsWith('#')) cls = styles.cmt;
    else if (/LICENSE_TOKEN|LICENSE_HOST_SECRET|licenseToken|licenseHostSecret/.test(line)) cls = styles.gold;
    return (
      <span key={i} className={cls}>
        {line + '\n'}
      </span>
    );
  });
}

function CodeBlock({name, code, wrap}: {name: string; code: string; wrap?: boolean}) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        },
        () => undefined,
      );
    }
  };
  return (
    <div className={styles.term}>
      <div className={styles.termBar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.termName}>{name}</span>
        <button type="button" className={`${styles.copybtn} ${copied ? styles.ok : ''}`} onClick={onCopy}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? (
            <Translate id="selfhosting.copied">Copied</Translate>
          ) : (
            <Translate id="selfhosting.copy">Copy</Translate>
          )}
        </button>
      </div>
      <div className={`${styles.termBody} ${wrap ? styles.wrap : ''}`}>
        <pre>{renderCode(code)}</pre>
      </div>
    </div>
  );
}

// --- Hero ---
function HeroSection() {
  return (
    <header className={styles.hero}>
      <p className={styles.eyebrow}>
        <Translate id="selfhosting.hero.eyebrow">Self-Hosting</Translate>
      </p>
      <h1 className={styles.heroTitle}>
        <Translate id="selfhosting.hero.title.a">One image. </Translate>
        <em>
          <Translate id="selfhosting.hero.title.b">One command.</Translate>
        </em>
        <br />
        <Translate id="selfhosting.hero.title.c">Your whole workspace.</Translate>
      </h1>
      <p className={`${styles.lede} ${styles.heroLede}`}>
        <Translate id="selfhosting.hero.lede">
          udctl ships as a single all-in-one container — frontend and backend baked together. Run it on your own infrastructure with one command. No vendor lock-in, and nothing ever leaves your network.
        </Translate>
      </p>
      <div className={styles.pillrow}>
        <span className={styles.pill}>
          <b>1</b> <Translate id="selfhosting.hero.pill1">container</Translate>
        </span>
        <span className={styles.pill}>
          <b>~2</b> <Translate id="selfhosting.hero.pill2">min to running</Translate>
        </span>
        <span className={styles.pill}>
          <b><Translate id="selfhosting.hero.pill3a">Free</Translate></b> <Translate id="selfhosting.hero.pill3b" values={{date: LICENSE_VALID_UNTIL}}>{'Pro license until {date}'}</Translate>
        </span>
      </div>
      <div className={styles.term} style={{marginTop: 26}}>
        <div className={styles.termBar}>
          <span className={styles.dots}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.termName}>bash — docker run</span>
          <HeroCopy />
        </div>
        <div className={`${styles.termBody} ${styles.wrap}`}>
          <pre>{renderCode(HERO_RUN)}</pre>
        </div>
      </div>
      <div className={styles.btnrow}>
        <Link className={styles.btnPrimary} to="#deploy">
          <Translate id="selfhosting.hero.cta1">All deployment methods →</Translate>
        </Link>
        <Link className={styles.btnGhost} to="/configuration">
          <Translate id="selfhosting.hero.config">Full configuration reference</Translate>
        </Link>
        <Link className={styles.btnGhost} to="/docs/self-deployment">
          <Translate id="selfhosting.hero.cta2">Read the guide</Translate>
        </Link>
      </div>
    </header>
  );
}

function HeroCopy() {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(HERO_RUN).then(
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
      {copied ? <Translate id="selfhosting.copied">Copied</Translate> : <Translate id="selfhosting.copy">Copy</Translate>}
    </button>
  );
}

// --- Why ---
const WHY = [
  {key: 'ownership', Icon: Lock},
  {key: 'nolockin', Icon: Code},
  {key: 'offline', Icon: WifiOff},
  {key: 'control', Icon: Server},
] as const;

const WHY_TEXT: Record<string, {title: ReactNode; desc: ReactNode}> = {
  ownership: {
    title: <Translate id="selfhosting.why.ownership.title">Full data ownership</Translate>,
    desc: (
      <Translate id="selfhosting.why.ownership.desc">
        Tasks, notes, files, and finances live on hardware you control. Nothing is sent to a third party — not even for AI, which runs against your own provider.
      </Translate>
    ),
  },
  nolockin: {
    title: <Translate id="selfhosting.why.nolockin.title">No vendor lock-in</Translate>,
    desc: (
      <Translate id="selfhosting.why.nolockin.desc">
        Everything-as-code. Your data is declarable in Markdown and YAML, versionable with Git, and exportable any time. No proprietary formats to escape.
      </Translate>
    ),
  },
  offline: {
    title: <Translate id="selfhosting.why.offline.title">Offline & air-gapped</Translate>,
    desc: (
      <Translate id="selfhosting.why.offline.desc">
        Run inside a private network or a fully air-gapped environment. udctl keeps working without any outbound internet access.
      </Translate>
    ),
  },
  control: {
    title: <Translate id="selfhosting.why.control.title">Pick your setup</Translate>,
    desc: (
      <Translate id="selfhosting.why.control.desc">
        Choose your database, storage, backups, and scaling. A Raspberry Pi, a home server, a VPS, or a Kubernetes cluster — the choice is entirely yours.
      </Translate>
    ),
  },
};

function WhySection() {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>
        <Translate id="selfhosting.why.label">Why self-host</Translate>
      </p>
      <h2 className={styles.h2}>
        <Translate id="selfhosting.why.title">Your infrastructure, your rules.</Translate>
      </h2>
      <div className={styles.why}>
        {WHY.map(({key, Icon}) => (
          <div key={key} className={styles.whyItem}>
            <Icon size={22} strokeWidth={1.7} className={styles.whyIcon} />
            <h3>{WHY_TEXT[key].title}</h3>
            <p>{WHY_TEXT[key].desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Progressive deployment ---
const STAGES = [
  {
    key: 'local',
    title: <Translate id="selfhosting.grow.s1.title">Local desktop app</Translate>,
    desc: <Translate id="selfhosting.grow.s1.desc">Download & run. Built-in backend, fully offline. No Docker, no server.</Translate>,
    add: <Translate id="selfhosting.grow.add.selfhost">self-host</Translate>,
    first: true,
  },
  {
    key: 'aio',
    title: <Translate id="selfhosting.grow.s2.title">All-in-one · SQLite</Translate>,
    desc: <Translate id="selfhosting.grow.s2.desc">One container on your own server. Reach it from any device.</Translate>,
    add: <Translate id="selfhosting.grow.add.postgres">+ postgres</Translate>,
  },
  {
    key: 'pg',
    title: <Translate id="selfhosting.grow.s3.title">Dedicated PostgreSQL</Translate>,
    desc: <Translate id="selfhosting.grow.s3.desc">Concurrent access and production-grade reliability.</Translate>,
    add: <Translate id="selfhosting.grow.add.s3">+ s3 / r2</Translate>,
  },
  {
    key: 's3',
    title: <Translate id="selfhosting.grow.s4.title">Cloud file storage</Translate>,
    desc: <Translate id="selfhosting.grow.s4.desc">Offload attachments to S3, R2, or MinIO.</Translate>,
    add: <Translate id="selfhosting.grow.add.k8s">+ k8s</Translate>,
  },
  {
    key: 'k8s',
    title: <Translate id="selfhosting.grow.s5.title">Kubernetes cluster</Translate>,
    desc: <Translate id="selfhosting.grow.s5.desc">High availability, autoscaling, rolling updates.</Translate>,
  },
] as const;

function GrowSection() {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>
        <Translate id="selfhosting.grow.label">Progressive deployment</Translate>
      </p>
      <h2 className={styles.h2}>
        <Translate id="selfhosting.grow.title">Start small. Grow in place.</Translate>
      </h2>
      <p className={`${styles.lede} ${styles.sub}`}>
        <Translate id="selfhosting.grow.lede">
          Start right on your own laptop with the desktop app — no Docker, no server. Graduate to a self-hosted container when you want multi-device access, then scale to PostgreSQL, cloud storage, or a full cluster. Same data model the whole way — you flip environment variables, never re-architect.
        </Translate>
      </p>
      <div className={styles.growrow}>
        {STAGES.map((stage, i) => (
          <Fragment key={stage.key}>
            <div className={`${styles.stage} ${'first' in stage && stage.first ? styles.first : ''}`}>
              <span className={styles.sn}>{String(i + 1).padStart(2, '0')}</span>
              <h4>{stage.title}</h4>
              <p>{stage.desc}</p>
            </div>
            {'add' in stage && stage.add ? (
              <div className={styles.growarrow}>
                <span className={styles.growLabel}>{stage.add}</span>
                <svg
                  className={styles.garrow}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true">
                  <path d="M5 12h13" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
      <div className={styles.portableNote}>
        <FolderInput size={22} strokeWidth={1.7} />
        <div>
          <h3>
            <Translate id="selfhosting.portable.title">One root directory — fully portable</Translate>
          </h3>
          <p>
            <Translate id="selfhosting.portable.desc.a">
              Everything you own lives under a single root data directory. Moving your entire workspace — from your desktop app to a self-hosted server, or from one server to another — is a single copy of
            </Translate>{' '}
            <code>./data</code>.{' '}
            <Translate id="selfhosting.portable.desc.b">
              No proprietary export, no re-import. Back it up, move it, restore it, done.
            </Translate>
          </p>
        </div>
      </div>
    </section>
  );
}

// --- License ---
function LicenseSection() {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>
        <Translate id="selfhosting.license.label">Free trial license</Translate>
      </p>
      <h2 className={styles.h2}>
        <Translate id="selfhosting.license.title" values={{date: LICENSE_VALID_UNTIL}}>{'Start on Pro — on us, until {date}.'}</Translate>
      </h2>
      <p className={`${styles.lede} ${styles.sub}`}>
        <Translate id="selfhosting.license.lede">
          We're in active development, so this Pro license is free for everyone to use. It's already wired into every deployment below — just paste and go.
        </Translate>
      </p>
      <div className={styles.licenseCard}>
        <span className={styles.licenseTag}>
          ◆ <Translate id="selfhosting.license.tag">Free · Pro tier</Translate>
        </span>
        <h3>
          <Translate id="selfhosting.license.cardTitle">udctl Pro — Self-Host Trial</Translate>
        </h3>
        <p>
          <Translate id="selfhosting.license.cardDesc">
            Unlocks PostgreSQL, S3/R2 storage, multi-user with roles, and the admin dashboard.
          </Translate>
        </p>
        <div className={styles.licMeta}>
          <div>
            <Translate id="selfhosting.license.tier">Tier</Translate>
            <b>Pro</b>
          </div>
          <div>
            <Translate id="selfhosting.license.validUntil">Valid until</Translate>
            <b>{LICENSE_VALID_UNTIL}</b>
          </div>
          <div>
            <Translate id="selfhosting.license.maxUsers">Max users</Translate>
            <b>5</b>
          </div>
        </div>
        <div style={{marginTop: 16}}>
          <CodeBlock name=".env" code={ENV_FILE} wrap />
        </div>
      </div>
    </section>
  );
}

// --- Deployment tabs ---
const METHODS = [
  {
    key: 'allinone',
    tab: 'all-in-one · sqlite',
    rec: true,
    name: 'docker-compose.yml — all-in-one (SQLite)',
    code: COMPOSE_ALLINONE,
    access: (
      <Translate id="selfhosting.deploy.access.allinone">
        Then open http://localhost:3000 — one container, SQLite stored in ./data.
      </Translate>
    ),
  },
  {
    key: 'baremetal',
    tab: 'bare-metal · npm',
    name: 'bash — npm install',
    code: BAREMETAL_NPM,
    access: (
      <Translate id="selfhosting.deploy.access.baremetal">
        Then open http://localhost:8080 and you are logged in — no Docker, the binary serves the web UI itself. Data lives in ./data; upgrade with npm update -g @oatnil/ud-server.
      </Translate>
    ),
  },
  {
    key: 'brew',
    tab: 'homebrew · brew services',
    name: 'zsh — Homebrew',
    code: BREW_SERVER,
    access: (
      <Translate id="selfhosting.deploy.access.brew">
        Then open http://localhost:8080 and log in as admin@example.com / changeme — it starts again at login. Configuration is in $(brew --prefix)/etc/ud-server/.env, data in $(brew --prefix)/var/ud-server; brew upgrade ud-server replaces only the binary. brew trust exists only on Homebrew 6 and later — skip that line on older Homebrew and Linuxbrew.
      </Translate>
    ),
  },
  {
    key: 'aiopg',
    tab: 'all-in-one · postgres',
    name: 'docker-compose.yml — all-in-one + PostgreSQL',
    code: COMPOSE_AIOPG,
    access: (
      <Translate id="selfhosting.deploy.access.aiopg">
        Then open http://localhost:3000 — same single app image, backed by a dedicated PostgreSQL.
      </Translate>
    ),
  },
  {
    key: 'split',
    tab: 'separate fe + be · postgres',
    name: 'docker-compose.yml — separate frontend + backend + PostgreSQL',
    code: COMPOSE_SPLIT,
    access: (
      <Translate id="selfhosting.deploy.access.split">
        Then open http://localhost:3000 — the frontend proxies /api to the backend.
      </Translate>
    ),
  },
  {
    key: 'k8s',
    tab: 'kubernetes · helm',
    name: 'bash — Helm',
    code: HELM_INSTALL,
    access: (
      <>
        <Translate id="selfhosting.deploy.access.k8s">
          Deploys backend + frontend with SQLite, ClusterIP, and a PVC. Chart:
        </Translate>{' '}
        <a href="https://github.com/oatnil-top/undercontrol-helm" target="_blank" rel="noreferrer">
          github.com/oatnil-top/undercontrol-helm
        </a>
      </>
    ),
  },
] as const;

function DeploySection() {
  const [active, setActive] = useState<string>('allinone');
  const current = METHODS.find((m) => m.key === active) ?? METHODS[0];
  return (
    <section className={styles.section} id="deploy">
      <p className={styles.eyebrow}>
        <Translate id="selfhosting.deploy.label">Deployment methods</Translate>
      </p>
      <h2 className={styles.h2}>
        <Translate id="selfhosting.deploy.title">Copy a compose file, and you're running.</Translate>
      </h2>
      <p className={`${styles.lede} ${styles.sub}`}>
        <Translate id="selfhosting.deploy.lede">
          Every method below has the trial license baked in. The all-in-one image is the fastest path; the others are there when you want a dedicated database or a cluster.
        </Translate>
      </p>

      <div className={styles.tabs} role="tablist">
        {METHODS.map((m) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={m.key === active}
            className={`${styles.tab} ${m.key === active ? styles.tabActive : ''}`}
            onClick={() => setActive(m.key)}>
            {m.tab}
            {'rec' in m && m.rec ? <span className={styles.rec}>REC</span> : null}
          </button>
        ))}
      </div>

      <CodeBlock key={current.key} name={current.name} code={current.code} wrap />
      <div className={styles.accessline}>{current.access}</div>

      <div className={styles.s3note}>
        <b>
          <Translate id="selfhosting.s3.title">Want S3 / R2 storage?</Translate>
        </b>{' '}
        <Translate id="selfhosting.s3.desc">
          Add S3_ENABLED=true, S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY to any method above — works with AWS S3, Cloudflare R2, or MinIO.
        </Translate>
      </div>

      <div className={styles.runrow}>
        <div className={styles.runNum}>↑</div>
        <div>
          <h3>
            <Translate id="selfhosting.run.title">Bring it up</Translate>
          </h3>
          <p>
            <Translate id="selfhosting.run.desc">
              Save the file, then run docker compose up -d. First boot pulls the image and runs migrations automatically.
            </Translate>
          </p>
        </div>
      </div>
    </section>
  );
}

// --- Architecture ---
function ArchSection() {
  return (
    <section className={styles.section}>
      <p className={`${styles.eyebrow} ${styles.plain}`}>
        <Translate id="selfhosting.arch.label">Architecture</Translate>
      </p>
      <h2 className={styles.h2} style={{fontSize: 24}}>
        <Translate id="selfhosting.arch.title">One image by default — split it out when you need to.</Translate>
      </h2>
      <div className={styles.archwrap}>
        <div className={styles.archrow}>
          <div className={styles.node}>
            <div className={styles.nt}>Browser</div>
            <div className={styles.ns}>web · desktop · mobile</div>
          </div>
          <span className={styles.arrow}>→</span>
          <div className={`${styles.node} ${styles.hl}`}>
            <div className={styles.nt}>undercontrol</div>
            <div className={styles.ns}>all-in-one · :3000</div>
          </div>
          <span className={styles.arrow}>→</span>
          <div className={styles.archcol}>
            <div className={styles.node}>
              <div className={styles.nt}>Database</div>
              <div className={styles.ns}>sqlite / postgres</div>
            </div>
            <div className={`${styles.node} ${styles.opt2}`}>
              <div className={styles.nt}>AI provider</div>
              <div className={styles.ns}>optional</div>
            </div>
            <div className={`${styles.node} ${styles.opt2}`}>
              <div className={styles.nt}>S3 storage</div>
              <div className={styles.ns}>optional</div>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.archCap}>
        <Translate id="selfhosting.arch.caption">
          The all-in-one image serves the web app and the Go API from one container. Bring your own PostgreSQL or SQLite, and plug in an OpenAI-compatible AI provider, S3-compatible storage, or OpenTelemetry — all optional, all under your control.
        </Translate>
      </p>
    </section>
  );
}

// --- CTA ---
function CTASection() {
  return (
    <section className={`${styles.section} ${styles.cta}`}>
      <h2 className={styles.ctaTitle}>
        <Translate id="selfhosting.cta.title">Ready to own your workspace?</Translate>
      </h2>
      <p>
        <Translate id="selfhosting.cta.desc">
          Paste the compose file above, or follow the full guide for PostgreSQL, S3, and Kubernetes setups.
        </Translate>
      </p>
      <div className={styles.btnrow}>
        <Link className={styles.btnPrimary} to="/docs/self-deployment">
          <Translate id="selfhosting.cta.guide">Deployment guide</Translate>
        </Link>
        <Link className={styles.btnGhost} to="/configuration">
          <Translate id="selfhosting.cta.config">Configuration reference</Translate>
        </Link>
        <Link className={styles.btnGhost} to="/contact">
          <Translate id="selfhosting.cta.contact">Contact us</Translate>
        </Link>
      </div>
    </section>
  );
}

export default function SelfHosting(): ReactNode {
  return (
    <Layout
      title={translate({
        id: 'selfhosting.title',
        message: 'Self-Host udctl — Your Server, Your Data, Your Rules',
        description: 'The self-hosting page meta title',
      })}
      description={translate({
        id: 'selfhosting.description',
        message: 'Self-host udctl on your own infrastructure — one all-in-one image, or Docker Compose and Kubernetes. PostgreSQL or SQLite, local or S3 storage. Your data never leaves your network.',
        description: 'The self-hosting page meta description',
      })}>
      <main className={styles.page}>
        <HeroSection />
        <WhySection />
        <GrowSection />
        <LicenseSection />
        <DeploySection />
        <ArchSection />
        <CTASection />
      </main>
    </Layout>
  );
}
