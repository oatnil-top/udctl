/**
 * /dev — the developer hub: one stable route that collects every
 * developer-facing surface (behavior-first API references, OpenAPI, CLI,
 * agent integration). Linked from the footer Docs column.
 *
 * Pure TSX, {en, zh} strings picked by locale (the /configuration pattern) —
 * no i18n mirror file. Extensible by data: a future API group page under
 * src/pages/api/ gets one more entry in API_GROUPS here, nothing else.
 */
import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './dev.module.css';

type L = {en: string; zh: string};

interface Card {
  title: L;
  desc: L;
  to?: string; // internal route
  href?: string; // external / static file
  tag?: L;
  soon?: boolean; // rendered as a non-link placeholder
}

const API_GROUPS: Card[] = [
  {
    title: {en: 'Kanban and tasks', zh: '看板与任务'},
    desc: {
      en: 'Boards, columns, cards, sprints — grouped by behavior, every endpoint with a full HTTP call.',
      zh: '板、列、卡、sprint —— 按行为分组,每个端点带完整 HTTP 调用。',
    },
    to: '/api/kanban',
    tag: {en: 'behavior-first', zh: '行为式'},
  },
  {
    title: {en: 'More groups', zh: '更多组'},
    desc: {
      en: 'Notes, resources, finance and the rest are still served by the OpenAPI reference; behavior-first pages will appear here as they are written.',
      zh: 'notes、资源、记账等其余 API 面暂时仍由 OpenAPI 参考覆盖;行为式页面写好一组就会出现在这里。',
    },
    soon: true,
  },
];

const MACHINE: Card[] = [
  {
    title: {en: 'OpenAPI rendering', zh: 'OpenAPI 在线阅读'},
    desc: {en: 'The full specification rendered — 400 operations, flat.', zh: '完整规范的渲染版 —— 400 个操作,平铺。'},
    href: '/api/',
  },
  {
    title: {en: 'openapi.json', zh: 'openapi.json'},
    desc: {en: 'Raw Swagger 2.0 file, generated from the backend handlers. The machine truth.', zh: '原始 Swagger 2.0 文件,由后端 handler 注释生成。机器真值。'},
    href: '/api/openapi.json',
  },
  {
    title: {en: 'API reference guide', zh: 'API 参考指南'},
    desc: {en: 'Base URL, authentication, provenance and freshness of the spec.', zh: 'Base URL、认证方式、规范的来源与更新方式。'},
    to: '/docs/api-reference',
  },
];

const TOOLS: Card[] = [
  {
    title: {en: 'CLI reference', zh: 'CLI 参考'},
    desc: {en: 'The ud command line: kubectl-style task management from the terminal.', zh: 'ud 命令行:kubectl 风格的终端任务管理。'},
    to: '/docs/cli',
  },
  {
    title: {en: 'Agent setup prompt', zh: 'Agent 接入提示词'},
    desc: {en: 'A ready-to-fetch markdown prompt that teaches an AI agent to work with your instance.', zh: '一份可直接 fetch 的 markdown 提示词,教 AI agent 接入你的实例。'},
    href: '/agent-setup/prompt.md',
  },
  {
    title: {en: 'Open source components', zh: '开源组件'},
    desc: {en: 'Which repositories are published, and under what license.', zh: '哪些仓库是公开的,各自什么许可证。'},
    to: '/open-source',
  },
];

const UI = {
  title: {en: 'Developers', zh: '开发者'},
  metaDesc: {
    en: 'Everything developer-facing in udctl: behavior-first API references, the OpenAPI specification, the CLI, and agent integration.',
    zh: 'udctl 面向开发者的一切:行为式 API 参考、OpenAPI 规范、CLI 与 agent 接入。',
  },
  h1: {en: 'Developers', zh: '开发者'},
  lead: {
    en: 'One place for everything you build against: the HTTP API two ways (by behavior, or the full OpenAPI truth), the CLI, and agent integration.',
    zh: '你会拿来集成的东西都在这一页:HTTP API 两种看法(按行为看,或 OpenAPI 全量真值)、CLI、agent 接入。',
  },
  apiTitle: {en: 'API, by behavior', zh: 'API · 按行为看'},
  apiBlurb: {
    en: 'Endpoints grouped by what you are doing, each with a full HTTP call. Contract-only endpoints are tagged Draft.',
    zh: '端点按「你想做什么」分组,每条带完整 HTTP 调用;只发布了契约、尚未实现的端点标 Draft。',
  },
  machineTitle: {en: 'API, machine-readable', zh: 'API · 机器可读'},
  toolsTitle: {en: 'Tools and integration', zh: '工具与接入'},
};

function CardView({card, t}: {card: Card; t: (l: L) => string}): ReactNode {
  const body = (
    <>
      <span className={styles.cardTitle}>
        {t(card.title)}
        {card.tag && <span className={styles.tag}>{t(card.tag)}</span>}
      </span>
      <span className={styles.cardDesc}>{t(card.desc)}</span>
    </>
  );
  if (card.soon) {
    return <div className={`${styles.card} ${styles.soon}`}>{body}</div>;
  }
  if (card.to) {
    return (
      <Link className={styles.card} to={card.to}>
        {body}
      </Link>
    );
  }
  return (
    <a className={styles.card} href={card.href}>
      {body}
    </a>
  );
}

export default function DevPage(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const zh = i18n.currentLocale === 'zh-Hans';
  const t = (l: L) => (zh ? l.zh : l.en);

  return (
    <Layout title={t(UI.title)} description={t(UI.metaDesc)}>
      <main className={styles.main}>
        <h1>{t(UI.h1)}</h1>
        <p className={styles.lead}>{t(UI.lead)}</p>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t(UI.apiTitle)}</h2>
          <p className={styles.sectionBlurb}>{t(UI.apiBlurb)}</p>
          <div className={styles.cards}>
            {API_GROUPS.map((c) => (
              <CardView key={c.title.en} card={c} t={t} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t(UI.machineTitle)}</h2>
          <div className={styles.cards}>
            {MACHINE.map((c) => (
              <CardView key={c.title.en} card={c} t={t} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t(UI.toolsTitle)}</h2>
          <div className={styles.cards}>
            {TOOLS.map((c) => (
              <CardView key={c.title.en} card={c} t={t} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
