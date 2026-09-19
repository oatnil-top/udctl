// Gate: does this checkout carry git history? Docusaurus writes each page's
// sitemap <lastmod> from the file's last commit date, so a shallow clone (which
// is what Cloudflare Workers Builds makes) stamps EVERY page with the deploy
// date — measured 2026-09-19: 208 of 270 live URLs said 2026-09-15, a blog
// from April included (card 61af9ef5). Search engines then stop trusting the
// date at all. This runs before the build and pulls the history in when it is
// missing. The repo is public, so the fetch needs no credentials.
//
// Three explicit states, printed on one line, because "fixed" and "nothing to
// do" must never look alike:
//   git-history gate: FULL          — history already present, nothing done
//   git-history gate: UNSHALLOWED   — was shallow, history fetched (commit count after)
//   git-history gate: CANNOT        — no git, or the fetch failed; build goes on
//                                     with wrong lastmod, exit 0 but says so
// It never fails the build: a stale <lastmod> is worse than nothing but not
// worth a missed deploy. Re-check with `grep lastmod build/sitemap.xml`.
import { execSync } from 'node:child_process';

const sh = (cmd) => execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
const count = () => sh('git rev-list --count HEAD');

let shallow;
try {
  shallow = sh('git rev-parse --is-shallow-repository') === 'true';
} catch (e) {
  console.log(`git-history gate: CANNOT (not a git checkout: ${String(e.stderr ?? e.message).trim().split('\n')[0]})`);
  process.exit(0);
}

if (!shallow) {
  console.log(`git-history gate: FULL (${count()} commits, nothing to do)`);
  process.exit(0);
}

const before = count();
try {
  execSync('git fetch --unshallow --quiet', { stdio: ['ignore', 'inherit', 'inherit'] });
  console.log(`git-history gate: UNSHALLOWED (${before} -> ${count()} commits)`);
} catch (e) {
  console.log(`git-history gate: CANNOT (fetch --unshallow failed, exit ${e.status}; sitemap <lastmod> will be the deploy date)`);
}
