/**
 * FAQ — standalone page at /faq (GEO round two, card 85ecfe87).
 *
 * The visible Q&A and the FAQPage JSON-LD are both rendered from the one array
 * in src/data/faq.ts, so they stay identical entry by entry — never write an
 * answer in two places. The JSON-LD answer is the same text with the code
 * backticks stripped.
 *
 * i18n: one file, locale picked by i18n.currentLocale (same pattern as
 * configuration.tsx) — no mirror file.
 */
import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {FAQ_EN, FAQ_ZH, type FaqEntry} from '@site/src/data/faq';

const COPY = {
  en: {title: 'udctl FAQ', heading: 'udctl FAQ'},
  zh: {title: 'udctl 常见问题', heading: 'udctl 常见问题(FAQ)'},
};

// `x` -> <code>x</code> on the page; odd segments of a backtick split are code.
function renderAnswer(a: string): ReactNode[] {
  return a.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));
}

function faqJsonLd(entries: FaqEntry[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map(({q, a}) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {'@type': 'Answer', text: a.replaceAll('`', '')},
    })),
  });
}

export default function Faq(): ReactNode {
  const {i18n: {currentLocale}} = useDocusaurusContext();
  const isZh = currentLocale === 'zh-Hans';
  const t = isZh ? COPY.zh : COPY.en;
  const entries = isZh ? FAQ_ZH : FAQ_EN;
  return (
    <Layout title={t.title} description={entries[0].a.replaceAll('`', '')}>
      <Head>
        <script type="application/ld+json">{faqJsonLd(entries)}</script>
      </Head>
      <main className="container margin-vert--xl" style={{maxWidth: 820}}>
        <h1>{t.heading}</h1>
        {entries.map(({q, a}) => (
          <section key={q} className="margin-top--lg">
            <h2>{q}</h2>
            <p>{renderAnswer(a)}</p>
          </section>
        ))}
      </main>
    </Layout>
  );
}
