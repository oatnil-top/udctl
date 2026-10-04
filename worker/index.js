/**
 * ud-docs entry Worker.
 *
 * The site itself is a static Docusaurus build served by Workers Static Assets.
 * This script exists for one reason: the Worker's own
 * `ud-docs.lintao-amons.workers.dev` hostname serves a second, fully public copy
 * of the same site (card 5f3e4144 — over 09-11..09-12, GA counted 13 active
 * users landing on it, mostly via old shared links). The canonical tag stops
 * Google from picking the copy, but it does not stop the copy from opening, from
 * showing up in address bars, or from splitting the traffic — so the copy is
 * redirected away permanently instead of being hidden behind robots rules.
 * Blocking indexing would not close an existing link and would cost us the
 * canonical fallback.
 *
 * Path and query are preserved: a shared deep link must land on the same page on
 * the canonical host, not on the home page.
 *
 * Anything that is not a workers.dev host falls through to the asset server
 * untouched, so 404 handling, trailing-slash handling and content types stay
 * exactly as the platform's defaults — this script deliberately re-implements
 * none of that.
 *
 * `run_worker_first` in wrangler.jsonc is what lets this run at all; without it
 * the asset server answers first and the script never sees a request for a path
 * that exists.
 *
 * oatnil.com (the pre-2026-09-12 canonical host) is NOT handled here: it is a
 * zone we own and it redirects via a Cloudflare Redirect Rule. workers.dev is
 * not a zone we own, which is why this one has to live in code.
 */

const CANONICAL_ORIGIN = 'https://udctl.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname.endsWith('.workers.dev')) {
      return Response.redirect(CANONICAL_ORIGIN + url.pathname + url.search, 301);
    }

    if (request.headers.has('Range') && url.pathname.startsWith('/promo/')) {
      return rangedAsset(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

/**
 * Workers Static Assets answers `Range` with a plain 200 and no Accept-Ranges
 * (measured 2026-10-04 on /promo/udctl-intro-en.mp4; the docs are silent on it).
 * Safari / iOS will not play an mp4 without 206, so the intro videos in
 * static/promo/ (~10 MB each, ud task 43868daa) get their ranges cut here. The
 * body is buffered, which is fine for files this size; do not route large media
 * through this path — move it to R2 instead. Only a single `bytes=a-b` range is
 * honoured, anything else falls back to the full 200.
 */
async function rangedAsset(request, env) {
  const full = await env.ASSETS.fetch(new Request(request.url, { headers: { 'Accept-Encoding': 'identity' } }));
  if (full.status !== 200) return full;

  const headers = new Headers(full.headers);
  headers.set('Accept-Ranges', 'bytes');

  const m = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('Range') || '');
  if (!m || (m[1] === '' && m[2] === '')) return new Response(full.body, { status: 200, headers });

  const buf = await full.arrayBuffer();
  const size = buf.byteLength;
  let start;
  let end;
  if (m[1] === '') {
    start = Math.max(0, size - Number(m[2]));
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) {
    headers.set('Content-Range', `bytes */${size}`);
    headers.delete('Content-Length');
    return new Response(null, { status: 416, headers });
  }

  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(end - start + 1));
  return new Response(buf.slice(start, end + 1), { status: 206, headers });
}
