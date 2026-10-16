// Gate: are the published agent-setup pastes still what ud-vite-app's template renders?
// (task d8a154e9)
//
// The single source is a TypeScript module in the (private, sibling) monorepo:
//   ud-vite-app/src/components/onboarding/agent-setup-prompt.ts
// Its export script (npm run export:agent-prompt) renders that module into:
//   - static/agent-setup/prompt.md         (this repo — fetched raw at udctl.com/agent-setup/prompt.md)
//   - docs/getting-started.md              (this repo — EN step 5 block)
//   - i18n/zh-Hans/.../getting-started.md  (this repo — ZH step 5 block)
// and commits, next to the source, the exact "exported text" we compare against:
//   - ud-vite-app/src/components/onboarding/agent-setup-prompt.web.{en,zh}.generated.md
//
// This gate needs no TypeScript toolchain: it string-compares the published copies to those
// committed .generated.md files. Three explicit states, because "passed" and "never ran"
// must never share an output (same rule as check-agent-guide.mjs):
//   agent-prompt gate: OK            — every copy matches, exit 0
//   agent-prompt gate: DRIFT         — a copy is stale, exit 1 (fails the build)
//   agent-prompt gate: CANNOT-CHECK  — no monorepo beside this checkout (Cloudflare Workers
//                                      Builds clones only this repo), exit 0 but says so.
//
// This is fast local/CI feedback on the *.generated.md -> published-copy tie. The source ->
// *.generated.md tie (a source edit that forgot to re-export) is caught in the monorepo by a
// vitest test (agent-setup-prompt.test.ts) that renders from the live source, which runs on
// frontend-ci's Node 20; `npm run export:agent-prompt -- --check` does the same by hand.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const srcDir = join(here, '..', '..', 'ud-vite-app', 'src', 'components', 'onboarding');
const genEn = join(srcDir, 'agent-setup-prompt.web.en.generated.md');
const genZh = join(srcDir, 'agent-setup-prompt.web.zh.generated.md');

if (!existsSync(genEn) || !existsSync(genZh)) {
  console.log(
    `agent-prompt gate: CANNOT-CHECK — no ud-vite-app sibling beside this repo (${srcDir}); drift NOT checked`,
  );
  process.exit(0);
}

const promptMd = join(here, '..', 'static', 'agent-setup', 'prompt.md');
const gsEn = join(here, '..', 'docs', 'getting-started.md');
const gsZh = join(
  here,
  '..',
  'i18n',
  'zh-Hans',
  'docusaurus-plugin-content-docs',
  'current',
  'getting-started.md',
);

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);

// The inner paste a Getting Started file carries for a variant, or null if the markers are gone.
function extractBlock(doc, variant) {
  if (!doc) return null;
  const re = new RegExp(
    `<!-- BEGIN generated: agent paste \\(web, ${variant}\\)[^\\n]*\\n\`\`\`text\\n([\\s\\S]*?)\\n\`\`\`\\n<!-- END generated: agent paste \\(web, ${variant}\\) -->`,
  );
  const m = doc.match(re);
  return m ? m[1] : null;
}

const enPaste = readFileSync(genEn, 'utf8'); // includes trailing newline
const zhPaste = readFileSync(genZh, 'utf8');

const drifts = [];

// prompt.md is a 4-line provenance stamp (3 comments + 1 blank) followed by the EN paste.
const prompt = read(promptMd);
if (prompt === null) {
  drifts.push('static/agent-setup/prompt.md is missing');
} else if (prompt.split('\n').slice(4).join('\n') !== enPaste) {
  drifts.push('static/agent-setup/prompt.md differs from the EN template render');
}

const enBlock = extractBlock(read(gsEn), 'en');
if (enBlock === null) drifts.push('docs/getting-started.md: EN agent-paste markers missing');
else if (enBlock + '\n' !== enPaste) drifts.push('docs/getting-started.md: EN block is stale');

const zhBlock = extractBlock(read(gsZh), 'zh');
if (zhBlock === null) drifts.push('i18n/zh-Hans getting-started.md: ZH agent-paste markers missing');
else if (zhBlock + '\n' !== zhPaste) drifts.push('i18n/zh-Hans getting-started.md: ZH block is stale');

if (drifts.length > 0) {
  console.error('agent-prompt gate: DRIFT — run `npm run export:agent-prompt` in ud-vite-app and commit:');
  for (const d of drifts) console.error(`  - ${d}`);
  process.exit(1);
}
console.log('agent-prompt gate: OK — prompt.md and both Getting Started blocks match the template render');
process.exit(0);
