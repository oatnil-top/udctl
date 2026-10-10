#!/usr/bin/env node
/**
 * Postbuild: write a markdown twin `index.md` next to every `build/**\/index.html`.
 *
 * Why: "Markdown for Agents" (Cloudflare Agent Readiness, ud task 5ac33489) — a
 * request carrying `Accept: text/markdown` should get the page as markdown, while
 * browsers keep getting HTML. worker/index.js does the negotiation; this script
 * produces the bytes it serves.
 *
 * Why at build time and not in the Worker: udctl.com is on the Free plan, where a
 * Worker gets ~10 ms CPU per request; parsing a 35 KB page into a syntax tree on
 * every request would not reliably fit. Cloudflare's own converter is Pro-only.
 *
 * Why from the built HTML and not from docs/*.md: TSX pages (/, /download,
 * /self-hosting) have no markdown source, and MDX sources carry imports and
 * components an agent cannot read. The rendered HTML is the one shape every page
 * shares, so every page gets a twin from the same code path.
 *
 * Content kept: `<article>` when the page has one (docs, blog posts), otherwise
 * `<main>`. Site chrome (navbar, footer, sidebar, TOC, breadcrumbs, pagination,
 * heading anchors, buttons) is dropped. Relative links become absolute so the
 * markdown still works after an agent copies it elsewhere.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { select, selectAll } from 'hast-util-select';

const SITE = 'https://udctl.com';
const BUILD_DIR = path.resolve(process.argv[2] || 'build');

// Everything an agent reading the page text does not need.
const DROP = [
  'script', 'style', 'noscript', 'svg', 'button', 'nav', 'footer', 'form', 'iframe',
  '.hash-link', '.theme-doc-breadcrumbs', '.theme-doc-toc-mobile', '.theme-doc-toc-desktop',
  '.theme-doc-footer', '.theme-doc-version-badge', '.pagination-nav', '.theme-edit-this-page',
  '[aria-hidden="true"]', '[hidden]',
].join(', ');

async function* htmlPages(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    // /assets holds hashed bundles, never pages.
    if (entry.isDirectory() && entry.name !== 'assets') yield* htmlPages(full);
    else if (entry.isFile() && entry.name === 'index.html') yield full;
  }
}

function pageUrl(file) {
  const rel = path.relative(BUILD_DIR, path.dirname(file)).split(path.sep).join('/');
  return `${SITE}/${rel ? `${rel}/` : ''}`;
}

/** Remove matched nodes in place (hast has no parent pointers, so walk from the root). */
function prune(node, doomed) {
  if (!node.children) return;
  node.children = node.children.filter((c) => !doomed.has(c));
  for (const c of node.children) prune(c, doomed);
}

function absolutize(node, base) {
  const p = node.properties;
  if (p) {
    for (const key of ['href', 'src', 'poster']) {
      if (typeof p[key] === 'string' && !/^[a-z][a-z0-9+.-]*:|^#/i.test(p[key])) {
        p[key] = new URL(p[key], base).href;
      }
    }
  }
  for (const c of node.children || []) absolutize(c, base);
}

const toMarkdown = unified()
  .use(rehypeRemark)
  .use(remarkGfm)
  .use(remarkStringify, { bullet: '-', fences: true, rule: '-' });

export function htmlToMarkdown(html, url) {
  const tree = unified().use(rehypeParse).parse(html);
  const title = select('title', tree);
  const titleText = title ? title.children.map((c) => c.value || '').join('').trim() : '';
  const root = select('article', tree) || select('main', tree) || select('body', tree);
  if (!root) return null;

  prune(root, new Set(selectAll(DROP, root)));
  absolutize(root, url);

  const body = toMarkdown.stringify(toMarkdown.runSync({ type: 'root', children: [root] })).trim();
  const head = body.startsWith('# ') ? '' : `# ${titleText}\n\n`;
  return `${head}${body}\n\n---\nSource: ${url}\n`;
}

async function main() {
  let written = 0;
  let skipped = 0;
  for await (const file of htmlPages(BUILD_DIR)) {
    const url = pageUrl(file);
    const md = htmlToMarkdown(await readFile(file, 'utf8'), url);
    if (!md) {
      skipped += 1;
      continue;
    }
    await writeFile(path.join(path.dirname(file), 'index.md'), md);
    written += 1;
  }
  // Zero twins means the negotiation silently falls back to HTML everywhere:
  // fail the build instead of shipping that.
  if (written === 0) {
    console.error(`build-markdown: no index.html found under ${BUILD_DIR}`);
    process.exit(1);
  }
  console.log(`build-markdown: wrote ${written} markdown twins (${skipped} skipped) under ${BUILD_DIR}`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
