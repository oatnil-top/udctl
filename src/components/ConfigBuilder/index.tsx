/**
 * ConfigBuilder — interactive configuration builder for the self-hosting docs.
 *
 * Design goals (approved via the Configuration Reference design review, 2026-07-24):
 * - Pick tier / database / storage / AI → generate ready-to-copy docker run,
 *   docker compose and .env output, with unfilled placeholders highlighted.
 * - Always show BOTH boot outcomes: the success banner the backend prints on a
 *   healthy boot, and the STARTUP FAILED block for the most relevant
 *   misconfiguration. Both mirror the real output of cmd/server (banner package)
 *   — if the backend banner changes, update the strings here in the same task.
 * - Product rules are enforced in the UI: PostgreSQL/S3 disabled on Personal tier.
 *
 * Owned by the Onboarding Experience Owner; content tracks
 * go-backend/internal/config/config.go.
 */
import React, {useMemo, useState} from 'react';
import styles from './styles.module.css';

type Tier = 'personal' | 'pro';
type Db = 'sqlite' | 'postgres';
type Storage = 'local' | 's3';
type Tab = 'run' | 'compose' | 'env';

interface Labels {
  title: string;
  subtitle: string;
  tier: string;
  tierPersonal: string;
  tierPro: string;
  database: string;
  storage: string;
  storageLocal: string;
  ai: string;
  aiOff: string;
  aiOn: string;
  signup: string;
  signupClosed: string;
  signupOpen: string;
  proOnly: string;
  hostHint: string;
  adminHint: string;
  secretHint: string;
  encKeyHint: string;
  regenerate: string;
  copy: string;
  copied: string;
  previewOk: string;
  previewFail: string;
}

const EN: Labels = {
  title: 'Build your config',
  subtitle: "Pick what you're running; the command, compose file and boot previews update as you type.",
  tier: 'Tier',
  tierPersonal: 'Personal (free)',
  tierPro: 'Pro / Max',
  database: 'Database',
  storage: 'File storage',
  storageLocal: 'Local disk',
  ai: 'AI features',
  aiOff: 'Off',
  aiOn: 'OpenAI-compatible',
  signup: 'Who can create accounts',
  signupClosed: 'Only me',
  signupOpen: 'Anyone',
  proOnly: 'Pro/Max feature',
  hostHint: 'The URL browsers will use to reach the instance — the misconfigured preview below shows what happens when it is missing or invalid.',
  adminHint: 'Login username of the initial admin — Pro/Max refuses to boot without it.',
  secretHint: 'Random value generated for you. Once the instance has started, keep using the same value — ',
  encKeyHint:
    "Encrypts each user's messenger bot token. Set it once and keep it — changing it strands every token already stored and each user must paste theirs again.",
  regenerate: 'regenerate',
  copy: 'Copy',
  copied: 'Copied',
  previewOk: 'Boot preview — success',
  previewFail: 'Boot preview — misconfigured',
};

const ZH: Labels = {
  title: '生成你的配置',
  subtitle: '选择部署形态，右侧的命令、compose 文件和启动预览会实时更新。',
  tier: '版本',
  tierPersonal: 'Personal（免费）',
  tierPro: 'Pro / Max',
  database: '数据库',
  storage: '文件存储',
  storageLocal: '本地磁盘',
  ai: 'AI 功能',
  aiOff: '关闭',
  aiOn: 'OpenAI 兼容',
  signup: '谁可以建账号',
  signupClosed: '只有我',
  signupOpen: '任何人',
  proOnly: 'Pro/Max 功能',
  hostHint: '浏览器访问实例所用的 URL——下方的失败预览展示了它缺失或非法时的启动结果。',
  adminHint: '初始管理员的登录用户名——Pro/Max 缺少它会拒绝启动。',
  secretHint: '已为你生成随机值。实例启动之后就一直沿用同一个值——',
  encKeyHint:
    '用于加密每位用户的 IM bot token。设定后就不要再换——换掉它会让已经存下的 token 全部解不开，每位用户都得重新粘贴一遍。',
  regenerate: '重新生成',
  copy: '复制',
  copied: '已复制',
  previewOk: '启动预览——成功',
  previewFail: '启动预览——配置错误',
};

const RULE = '==============================================================================';

function randomSecret(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function hostValid(host: string): boolean {
  if (!host) return false;
  try {
    const u = new URL(host);
    return (u.protocol === 'http:' || u.protocol === 'https:') && !!u.host;
  } catch {
    return false;
  }
}

function hostPort(host: string): string {
  try {
    const u = new URL(host);
    return u.port || (u.protocol === 'https:' ? '443' : '80');
  } catch {
    return '3000';
  }
}

// [name, value, isPlaceholder]
type VarEntry = [string, string, boolean];

export default function ConfigBuilder({locale = 'en'}: {locale?: 'en' | 'zh'}): React.ReactElement {
  const L = locale === 'zh' ? ZH : EN;

  const [tier, setTier] = useState<Tier>('personal');
  const [db, setDb] = useState<Db>('sqlite');
  const [storage, setStorage] = useState<Storage>('local');
  const [ai, setAi] = useState<boolean>(false);
  // Defaults to closed, like the backend: the preview must show a self-hoster the
  // instance they will actually get, not the friendlier one.
  const [openSignup, setOpenSignup] = useState<boolean>(false);
  const [host, setHost] = useState('http://localhost:3000');
  const [admin, setAdmin] = useState('');
  const [secret, setSecret] = useState(() => randomSecret());
  // Same treatment as JWT_SECRET, and for the same reason: a key shipped as a
  // copyable example value is a key every instance shares. Generated per visitor,
  // always emitted, overridable.
  const [encKey, setEncKey] = useState(() => randomSecret());
  const [tab, setTab] = useState<Tab>('run');
  const [toast, setToast] = useState('');

  const personal = tier === 'personal';
  const hostOk = hostValid(host.trim().replace(/\/+$/, ''));
  const hostVal = host.trim().replace(/\/+$/, '');

  function pickTier(t: Tier) {
    setTier(t);
    if (t === 'personal') {
      setDb('sqlite');
      setStorage('local');
    }
  }

  const vars = useMemo<VarEntry[]>(() => {
    const v: VarEntry[] = [];
    v.push(['HOST_DOMAIN', hostVal || 'http://localhost:3000', !hostVal]);
    v.push(['JWT_SECRET', secret || 'change-me-to-a-random-string', !secret]);
    v.push(['UD_ENCRYPTION_KEY', encKey || 'change-me-to-a-random-string', !encKey]);
    if (tier === 'pro') {
      v.push(['ADMIN_EMAIL', admin.trim() || 'admin@example.com', !admin.trim()]);
      v.push(['ADMIN_PASSWORD', 'your-secure-password', true]);
      v.push(['LICENSE_TOKEN', 'your-license-token', true]);
      v.push(['LICENSE_HOST_SECRET', 'your-license-host-secret', true]);
    }
    if (db === 'postgres') {
      v.push(['DATABASE_TYPE', 'postgres', false]);
      v.push(['DATABASE_URL', 'postgres://user:pass@host:5432/undercontrol', true]);
    }
    if (storage === 's3') {
      v.push(['S3_ENABLED', 'true', false]);
      v.push(['S3_ENDPOINT', 'https://your-s3-endpoint', true]);
      v.push(['S3_BUCKET', 'your-bucket', true]);
      v.push(['S3_ACCESS_KEY_ID', 'your-access-key', true]);
      v.push(['S3_SECRET_ACCESS_KEY', 'your-secret-key', true]);
    }
    if (ai) v.push(['OPENAI_API_KEY', 'sk-your-key', true]);
    // Only emitted when opting in — off is the default, so the closed config is
    // the one with no line for it.
    if (openSignup) v.push(['REGISTRATION_ENABLED', 'true', false]);
    return v;
  }, [tier, db, storage, ai, openSignup, hostVal, admin, secret, encKey]);

  const port = hostPort(hostVal);

  function varSpan([name, value, ph]: VarEntry, prefix: string, suffix: string): React.ReactElement {
    return (
      <React.Fragment key={name}>
        {`${prefix}${name}=`}
        {ph ? <span className={styles.ph}>{value}</span> : value}
        {`${suffix}\n`}
      </React.Fragment>
    );
  }

  const genNodes: React.ReactNode =
    tab === 'run' ? (
      <>
        {'docker run -d --name undercontrol \\\n'}
        {`  -p ${port}:8080 \\\n`}
        {vars.map((v) => varSpan(v, '  -e ', ' \\'))}
        {'  -v undercontrol-data:/app/data \\\n'}
        {'  lintao0o0/undercontrol:latest'}
      </>
    ) : tab === 'compose' ? (
      <>
        {'services:\n  undercontrol:\n    image: lintao0o0/undercontrol:latest\n'}
        {`    ports:\n      - "${port}:8080"\n`}
        {'    volumes:\n      - ./data:/app/data\n    restart: unless-stopped\n    environment:\n'}
        {vars.map((v) => varSpan(v, '      - ', ''))}
      </>
    ) : (
      <>
        <span className={styles.cm}>{`# udctl — ${tier} tier / ${db} / ${storage} storage\n`}</span>
        {vars.map((v) => varSpan(v, '', ''))}
      </>
    );

  function copyGenerated(e: React.MouseEvent<HTMLButtonElement>) {
    const pre = (e.currentTarget.closest(`.${styles.out}`) as HTMLElement)?.querySelector('pre');
    const text = pre?.textContent ?? '';
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setToast(L.copied);
        window.setTimeout(() => setToast(''), 1400);
      });
    }
  }

  /* ---- boot previews: both always visible, mirroring the real backend banner ---- */
  const successBanner: React.ReactNode = (() => {
    const url = hostOk ? hostVal : 'http://localhost:3000';
    const login = personal ? 'personal@undercontrol.local' : admin.trim() || 'admin@example.com';
    const hint = personal
      ? '           default password: personal123 (set PERSONAL_TIER_PASSWORD to change it)\n'
      : '           default password: admin123 — change it after first login\n';
    return (
      <>
        {RULE + '\n\n  udctl v1.x.x is ready\n\n  '}
        <span className={styles.hlOk}>{`--> Open ${url} to get started`}</span>
        {`\n\n      Login as:  ${login}\n   ${hint}      Tier:      ${personal ? 'Personal (max users: 1)' : 'Pro (max users: 10)'}\n      Database:  ${db === 'postgres' ? 'POSTGRES' : 'SQLITE'}\n      Storage:   ${storage === 's3' ? 'S3/R2' : 'LocalFS'}\n      Signup:    ${openSignup ? 'open (env REGISTRATION_ENABLED)' : 'closed (default)'}\n\n` + RULE}
      </>
    );
  })();

  const [failCap, failTitle, failBody] = (() => {
    if (hostVal && !hostOk) {
      return [
        'invalid HOST_DOMAIN',
        'configuration error',
        `HOST_DOMAIN must be an absolute URL including scheme and host, e.g.\n  https://app.example.com, got: "${hostVal}"`,
      ] as const;
    }
    if (tier === 'pro' && !admin.trim()) {
      return [
        'ADMIN_EMAIL missing',
        'ADMIN_EMAIL is not set',
        "ADMIN_EMAIL is required for Pro tier: it is the admin account's login\n  username, used to create the initial admin user at startup. Set it (and\n  optionally ADMIN_PASSWORD).",
      ] as const;
    }
    return [
      'HOST_DOMAIN missing',
      'configuration error',
      'HOST_DOMAIN is required: set it to the external base URL clients use to\n  reach this backend (scheme + host, no trailing slash), e.g.\n  HOST_DOMAIN=https://app.example.com or HOST_DOMAIN=http://localhost:8080.',
    ] as const;
  })();

  const seg = (
    current: string,
    items: Array<{v: string; label: string; disabled?: boolean}>,
    onPick: (v: string) => void,
  ) => (
    <span className={styles.seg}>
      {items.map((it) => (
        <button
          key={it.v}
          type="button"
          aria-pressed={current === it.v}
          disabled={it.disabled}
          onClick={() => onPick(it.v)}>
          {it.label}
        </button>
      ))}
    </span>
  );

  return (
    <div className={styles.builder}>
      <div className={styles.grid}>
        <div>
          <p className={styles.sub}>{L.subtitle}</p>

          <div className={styles.field}>
            <p className={styles.label}>{L.tier}</p>
            {seg(tier, [
              {v: 'personal', label: L.tierPersonal},
              {v: 'pro', label: L.tierPro},
            ], (v) => pickTier(v as Tier))}
          </div>

          <div className={styles.field}>
            <p className={styles.label}>{L.database}</p>
            {seg(db, [
              {v: 'sqlite', label: 'SQLite'},
              {v: 'postgres', label: 'PostgreSQL', disabled: personal},
            ], (v) => setDb(v as Db))}
            {personal && <span className={styles.segNote}>{L.proOnly}</span>}
          </div>

          <div className={styles.field}>
            <p className={styles.label}>{L.storage}</p>
            {seg(storage, [
              {v: 'local', label: L.storageLocal},
              {v: 's3', label: 'S3 / R2', disabled: personal},
            ], (v) => setStorage(v as Storage))}
            {personal && <span className={styles.segNote}>{L.proOnly}</span>}
          </div>

          <div className={styles.field}>
            <p className={styles.label}>{L.ai}</p>
            {seg(ai ? 'on' : 'off', [
              {v: 'off', label: L.aiOff},
              {v: 'on', label: L.aiOn},
            ], (v) => setAi(v === 'on'))}
          </div>

          <div className={styles.field}>
            <p className={styles.label}>{L.signup}</p>
            {seg(openSignup ? 'on' : 'off', [
              {v: 'off', label: L.signupClosed},
              {v: 'on', label: L.signupOpen},
            ], (v) => setOpenSignup(v === 'on'))}
          </div>

          <div className={styles.field}>
            <p className={styles.label}>HOST_DOMAIN</p>
            <input
              className={`${styles.txt} ${hostOk ? '' : styles.txtBad}`}
              value={host}
              spellCheck={false}
              aria-label="HOST_DOMAIN"
              onChange={(e) => setHost(e.target.value)}
            />
            <p className={styles.hint}>{L.hostHint}</p>
          </div>

          {!personal && (
            <div className={styles.field}>
              <p className={styles.label}>ADMIN_EMAIL</p>
              <input
                className={styles.txt}
                value={admin}
                placeholder="admin@example.com"
                spellCheck={false}
                aria-label="ADMIN_EMAIL"
                onChange={(e) => setAdmin(e.target.value)}
              />
              <p className={styles.hint}>{L.adminHint}</p>
            </div>
          )}

          <div className={styles.field}>
            <p className={styles.label}>JWT_SECRET</p>
            <input
              className={styles.txt}
              value={secret}
              spellCheck={false}
              aria-label="JWT_SECRET"
              onChange={(e) => setSecret(e.target.value)}
            />
            <p className={styles.hint}>
              {L.secretHint}
              <button type="button" className={styles.linky} onClick={() => setSecret(randomSecret())}>
                {L.regenerate}
              </button>
            </p>
          </div>

          <div className={styles.field}>
            <p className={styles.label}>UD_ENCRYPTION_KEY</p>
            <input
              className={styles.txt}
              value={encKey}
              spellCheck={false}
              aria-label="UD_ENCRYPTION_KEY"
              onChange={(e) => setEncKey(e.target.value)}
            />
            <p className={styles.hint}>
              {L.secretHint}
              <button type="button" className={styles.linky} onClick={() => setEncKey(randomSecret())}>
                {L.regenerate}
              </button>
            </p>
            <p className={styles.hint}>{L.encKeyHint}</p>
          </div>
        </div>

        <div className={styles.out}>
          <div className={styles.tabs} role="tablist">
            {(['run', 'compose', 'env'] as Tab[]).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}>
                {t === 'run' ? 'docker run' : t === 'compose' ? 'docker compose' : '.env'}
              </button>
            ))}
            <span className={styles.spacer} />
            <button type="button" className={styles.copyBtn} onClick={copyGenerated}>
              {L.copy}
            </button>
          </div>
          <pre className={styles.gen}>{genNodes}</pre>

          <div className={styles.previewCap}>
            <p className={styles.label}>{L.previewOk}</p>
            <span className={styles.mono}>docker logs undercontrol</span>
          </div>
          <pre className={styles.banner}>{successBanner}</pre>

          <div className={styles.previewCap}>
            <p className={styles.label}>{L.previewFail}</p>
            <span className={styles.mono}>{failCap}</span>
          </div>
          <pre className={`${styles.banner} ${styles.bannerFailed}`}>
            {RULE + '\n\n  '}
            <span className={styles.hlFail}>{`STARTUP FAILED: ${failTitle}`}</span>
            {`\n\n  ${failBody}\n\n${RULE}`}
          </pre>
        </div>
      </div>
      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
