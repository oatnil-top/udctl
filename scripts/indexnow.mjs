#!/usr/bin/env node
// Tell IndexNow (Bing, Yandex, Naver, Seznam share it) which pages changed, so
// they are fetched within minutes instead of at the next scheduled crawl.
// Google does not read IndexNow; it keeps using the sitemap.
//
// Selection is stateless: a page is "changed" when its sitemap <lastmod> is on
// or after --since. Docusaurus writes <lastmod> from the source file's last git
// commit date (docusaurus.config.ts: sitemap lastmod 'date'), so the pages
// touched by a push are exactly the ones whose lastmod is >= the oldest commit
// date in that push. Pages without <lastmod> (blog index, tag pages) are never
// submitted; that is fine, they are navigation not content.
//
// Usage:
//   node scripts/indexnow.mjs [--since YYYY-MM-DD] [--dry-run] [--sitemap <url-or-file>]...
//   --since    default: today (UTC).
//   --sitemap  default: the two live sitemaps (en + zh-Hans). A local
//              build/sitemap.xml also works, for a dry run before deploy.
//   --dry-run  list the URLs, do not POST.
// Exit 0 with an explicit "0 URLs" line when nothing changed; exit 1 on any
// non-2xx from the API, so a broken key or wrong host cannot pass silently.
import { readFileSync } from 'node:fs';

const HOST = 'udctl.com';
const KEY = 'f4696a96fcf011e6d78f435a58153362'; // public by design: proof of ownership is the file at /<key>.txt
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_SITEMAPS = [`https://${HOST}/sitemap.xml`, `https://${HOST}/zh-Hans/sitemap.xml`];

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i === -1 ? undefined : args[i + 1]; };
const since = opt('--since') ?? new Date().toISOString().slice(0, 10);
const dryRun = args.includes('--dry-run');
const sitemaps = args.flatMap((a, i) => (a === '--sitemap' ? [args[i + 1]] : []));
if (!/^\d{4}-\d{2}-\d{2}$/.test(since)) { console.error(`--since must be YYYY-MM-DD, got "${since}"`); process.exit(2); }

async function readSitemap(src) {
  if (/^https?:\/\//.test(src)) {
    const r = await fetch(src);
    if (!r.ok) throw new Error(`${src} -> ${r.status}`);
    return r.text();
  }
  return readFileSync(src, 'utf8');
}

const changed = [];
let total = 0;
for (const src of sitemaps.length ? sitemaps : DEFAULT_SITEMAPS) {
  const xml = await readSitemap(src);
  for (const m of xml.matchAll(/<url>(.*?)<\/url>/gs)) {
    total += 1;
    const loc = m[1].match(/<loc>(.*?)<\/loc>/)?.[1];
    const lastmod = m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
    if (loc && lastmod && lastmod.slice(0, 10) >= since) changed.push(loc);
  }
}

console.log(`# indexnow: ${changed.length} of ${total} sitemap URLs have lastmod >= ${since}${dryRun ? ' (dry run, not submitted)' : ''}`);
for (const u of changed) console.log(u);
if (changed.length === 0 || dryRun) process.exit(0);

// One POST for all of them (limit is 10,000 per request); host must match every URL.
const r = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: changed }),
});
const body = await r.text();
console.log(`# indexnow: POST ${ENDPOINT} -> ${r.status}${body ? ` ${body.slice(0, 200)}` : ''}`);
// 200 = accepted, 202 = accepted and key still being verified. Anything else is
// a real failure (403 key not found at keyLocation, 422 URL/host mismatch, 429).
if (r.status !== 200 && r.status !== 202) process.exit(1);
