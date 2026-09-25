/**
 * ApiReference — behavior-first API reference renderer.
 *
 * One component, many pages: each API group is a thin page under
 * src/pages/api/<group>.tsx that exports its data (ApiPageData) and renders
 * <ApiReferencePage data={...}/>. Adding a future group (notes, finance,
 * resources, ...) means writing a data file, never touching this renderer.
 *
 * Design (owner-approved demo, 2026-09-26, ud card f081e261 thread):
 * - grouped by user behavior, not by swagger tag;
 * - every featured endpoint carries one full HTTP call (request tabs
 *   HTTP/curl, response tabs per status code, highlighted server-computed
 *   lines via CodeBlock metastring);
 * - contract-first: endpoints not implemented yet carry the Draft tag and
 *   their target paths ("先给个 tag"); Live endpoints show paths that work
 *   today. Machine truth stays /api/openapi.json.
 *
 * i18n follows the /configuration pattern: {en, zh} strings in the data,
 * picked by the current locale — no mirror files.
 */
import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

export type L = {en: string; zh: string};

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Field {
  name: string;
  type: string;
  desc: L;
  req?: boolean;
  draft?: boolean;
}

export interface ErrRow {
  status: string;
  desc: L;
}

export interface Sample {
  label: string; // tab label, language-neutral
  lang: string;
  code: string;
  hl?: string; // CodeBlock metastring line ranges, e.g. "{14}"
}

export interface Endpoint {
  id: string;
  method: Method;
  path: string;
  status: 'live' | 'draft';
  /** Path that answers today, when the target path has not shipped yet. */
  today?: string;
  behavior: L;
  summary: L;
  fields?: Field[];
  fieldsLabel?: L; // defaults to "Request body"; override e.g. for query params
  errors?: ErrRow[];
  note?: L;
  request?: Sample[];
  responses?: Sample[];
  legend?: L;
}

export interface CompactRow {
  method: Method;
  path: string;
  desc: L;
}

export interface Group {
  id: string;
  title: L;
  blurb?: L;
  endpoints: Endpoint[];
  compact?: CompactRow[];
  compactNavLabel?: L; // nav chip text for the compact block
}

export interface ApiPageData {
  /** browser-tab / gallery title */
  title: L;
  metaDesc: L;
  h1: L;
  lead: L;
  groups: Group[];
  /** extra page-specific footnote line, appended after the shared one */
  footnote?: L;
}

/* ------------------------------------------------------------------ */
/* Shared strings (identical on every API group page)                  */
/* ------------------------------------------------------------------ */

const UI = {
  contractNote: {
    en: 'Contract first: every path on this page is the target contract. Live means the operation is implemented — until the path renames ship (/todolist/* becomes /tasks/*, /kanban/boards/* becomes /boards/*) it answers at the "works today" path shown beneath it. Draft means the endpoint is published contract only, not implemented yet, and may still change before shipping. The machine truth for what is deployed right now stays the OpenAPI spec.',
    zh: '契约先行:本页所有路径都是目标契约。Live 表示操作已实现 —— 在改名落地前(/todolist/* 收敛到 /tasks/*,/kanban/boards/* 收敛到 /boards/*),它在下方标注的「今天可用路径」上应答。Draft 表示端点只发布了契约、尚未实现,上线前仍可能调整。当前线上实况的机器真值仍是 OpenAPI 规范。',
  },
  todayLabel: {en: 'Works today at', zh: '今天可用路径'},
  baseUrl: {en: 'Base URL', zh: '基础地址'},
  baseUrlVal: {
    en: '`https://api.oatnil.com` (hosted) or wherever you self-host',
    zh: '`https://api.oatnil.com`(托管版),自部署则是你自己的地址',
  },
  auth: {en: 'Auth', zh: '认证'},
  authVal: {
    en: 'every route below needs `Authorization: Bearer <access_token>`',
    zh: '以下所有端点都需要 `Authorization: Bearer <access_token>`',
  },
  fullRef: {en: 'Full machine-readable truth', zh: '机器可读的完整真值'},
  live: {en: 'Live', zh: '已上线'},
  draft: {en: 'Draft', zh: '契约 · 未实现'},
  draftField: {en: 'Draft', zh: '契约'},
  required: {en: 'required', zh: '必填'},
  reqLabel: {en: 'Request', zh: '请求'},
  respLabel: {en: 'Response', zh: '响应'},
  fieldsLabel: {en: 'Request body', zh: '请求体'},
  errorsLabel: {en: 'Errors', zh: '错误'},
  colField: {en: 'Field', zh: '字段'},
  colType: {en: 'Type', zh: '类型'},
  colDesc: {en: 'Description', zh: '说明'},
  navLabel: {en: 'Behavior navigation', zh: '行为导航'},
  footnote: {
    en: 'Samples use fabricated data. Draft samples show the agreed contract and may change before shipping. This page is maintained by hand against the backend DTOs; when it disagrees with /api/openapi.json for a Live endpoint, the OpenAPI file wins — please report the mismatch.',
    zh: '示例数据均为虚构。Draft 示例是已定向的契约,上线前可能调整。本页对照后端 DTO 手工维护;Live 端点若与 /api/openapi.json 不一致,以 OpenAPI 为准,并请报告这处不一致。',
  },
};

/* ------------------------------------------------------------------ */
/* Rendering                                                           */
/* ------------------------------------------------------------------ */

function inline(text: string): ReactNode {
  const parts = text.split('`');
  return parts.map((p, i) => (i % 2 === 1 ? <code key={i}>{p}</code> : <span key={i}>{p}</span>));
}

function methodClass(m: Method): string {
  switch (m) {
    case 'GET':
      return styles.mmGet;
    case 'PUT':
      return styles.mmPut;
    case 'PATCH':
      return styles.mmPatch;
    case 'DELETE':
      return styles.mmDel;
    default:
      return styles.mmPost;
  }
}

function PathText({path}: {path: string}): ReactNode {
  const parts = path.split(/(\{[^}]+\})/g);
  return (
    <span className={styles.epPath}>
      {parts.map((p, i) =>
        p.startsWith('{') ? (
          <span key={i} className="prm">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </span>
  );
}

export default function ApiReferencePage({data}: {data: ApiPageData}): ReactNode {
  const {i18n} = useDocusaurusContext();
  const zh = i18n.currentLocale === 'zh-Hans';
  const t = (l: L) => (zh ? l.zh : l.en);

  return (
    <Layout title={t(data.title)} description={t(data.metaDesc)}>
      <main className={styles.main}>
        <h1>{t(data.h1)}</h1>
        <p className={styles.lead}>{t(data.lead)}</p>
        <div className={styles.contractNote}>
          <span className={`${styles.tag} ${styles.tagLive}`}>{t(UI.live)}</span>{' '}
          <span className={`${styles.tag} ${styles.tagDraft}`}>{t(UI.draft)}</span> — {inline(t(UI.contractNote))}
        </div>
        <div className={styles.metaRow}>
          <span>
            <b>{t(UI.baseUrl)}</b>: {inline(t(UI.baseUrlVal))}
          </span>
          <span>
            <b>{t(UI.auth)}</b>: {inline(t(UI.authVal))}
          </span>
          <span>
            <b>{t(UI.fullRef)}</b>: <a href="/api/">OpenAPI</a> · <a href="/api/openapi.json">openapi.json</a>
          </span>
        </div>

        <nav className={styles.nav} aria-label={t(UI.navLabel)}>
          {data.groups.map((g) => (
            <div key={g.id} className={styles.navGroup}>
              <span className={styles.navTitle}>{t(g.title)}</span>
              {g.endpoints.map((ep) => (
                <a key={ep.id} className={styles.navChip} href={`#${ep.id}`}>
                  <span className={`${styles.mm} ${methodClass(ep.method)}`}>{ep.method}</span>
                  {t(ep.behavior)}
                </a>
              ))}
              {g.compact && g.compactNavLabel && (
                <a className={styles.navChip} href={`#${g.id}-compact`}>
                  {t(g.compactNavLabel)}
                </a>
              )}
            </div>
          ))}
        </nav>

        {data.groups.map((g) => (
          <section key={g.id} className={styles.group}>
            <h2 className={styles.groupTitle}>{t(g.title)}</h2>
            {g.blurb && <p className={styles.groupBlurb}>{inline(t(g.blurb))}</p>}

            {g.endpoints.map((ep) => (
              <article key={ep.id} id={ep.id} className={`${styles.ep} ${ep.status === 'draft' ? styles.epDraft : ''}`}>
                <div className={styles.epHead}>
                  <span className={`${styles.epMethod} ${methodClass(ep.method)}`}>{ep.method}</span>
                  <PathText path={ep.path} />
                  <span className={`${styles.tag} ${ep.status === 'draft' ? styles.tagDraft : styles.tagLive}`}>
                    {ep.status === 'draft' ? t(UI.draft) : t(UI.live)}
                  </span>
                </div>
                {ep.today && (
                  <p className={styles.today}>
                    {t(UI.todayLabel)}: <code>{ep.today}</code>
                  </p>
                )}
                <p className={styles.epBeh}>{t(ep.behavior)}</p>
                <p className={styles.epSummary}>{inline(t(ep.summary))}</p>

                {ep.fields && (
                  <>
                    <p className={styles.secLabel}>{t(ep.fieldsLabel ?? UI.fieldsLabel)}</p>
                    <table className={styles.fields}>
                      <thead>
                        <tr>
                          <th>{t(UI.colField)}</th>
                          <th>{t(UI.colType)}</th>
                          <th>{t(UI.colDesc)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ep.fields.map((f) => (
                          <tr key={f.name}>
                            <td>
                              <code>{f.name}</code>
                              {f.req && <span className={styles.fieldReq}>{t(UI.required)}</span>}
                              {f.draft && (
                                <span className={`${styles.tag} ${styles.tagDraft}`} style={{marginLeft: '0.35rem'}}>
                                  {t(UI.draftField)}
                                </span>
                              )}
                            </td>
                            <td>
                              <code>{f.type}</code>
                            </td>
                            <td>{inline(t(f.desc))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}

                {ep.request && (
                  <>
                    <p className={styles.secLabel}>{t(UI.reqLabel)}</p>
                    <Tabs groupId="req-format">
                      {ep.request.map((s) => (
                        <TabItem key={s.label} value={s.label} label={s.label}>
                          <CodeBlock language={s.lang}>{s.code}</CodeBlock>
                        </TabItem>
                      ))}
                    </Tabs>
                  </>
                )}

                {ep.responses && (
                  <>
                    <p className={styles.secLabel}>{t(UI.respLabel)}</p>
                    <Tabs>
                      {ep.responses.map((s) => (
                        <TabItem key={s.label} value={s.label} label={s.label}>
                          <CodeBlock language={s.lang} metastring={s.hl}>
                            {s.code}
                          </CodeBlock>
                        </TabItem>
                      ))}
                    </Tabs>
                  </>
                )}

                {ep.legend && <p className={styles.legend}>{inline(t(ep.legend))}</p>}

                {ep.errors && (
                  <>
                    <p className={styles.secLabel}>{t(UI.errorsLabel)}</p>
                    <div>
                      {ep.errors.map((e) => (
                        <div key={e.status} className={styles.errRow}>
                          <span className={styles.errStatus}>{e.status}</span>
                          <span>{inline(t(e.desc))}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {ep.note && <div className={styles.epNote}>{inline(t(ep.note))}</div>}
              </article>
            ))}

            {g.compact && (
              <div id={`${g.id}-compact`} className={styles.compact}>
                {g.compact.map((r) => (
                  <div key={`${r.method} ${r.path}`} className={styles.compactRow}>
                    <span className={`${styles.mm} ${methodClass(r.method)}`}>{r.method}</span>
                    <span className={styles.compactPath}>{r.path}</span>
                    <span className={styles.compactDesc}>{inline(t(r.desc))}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        <p className={styles.footnote}>
          {inline(t(UI.footnote))}
          {data.footnote && <> {inline(t(data.footnote))}</>}
        </p>
      </main>
    </Layout>
  );
}
