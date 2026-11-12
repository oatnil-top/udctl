// Gate: static/agent-setup/guide.md must be a real page, not missing or empty.
//
// https://udctl.com/agent-setup/guide.md is the product guide AI agents fetch
// (listed in llms.txt; Alfred reads it to answer "how do I ..."). Since card
// 6aa386af this file IS the source: the ud-guide skill it used to be generated
// from was deleted, so there is no copy to compare against any more. What is
// left to guard is "the page silently became empty or lost its content":
//   agent-guide gate: OK     — exit 0
//   agent-guide gate: BROKEN — exit 1 (fails the build)
// The live side (what udctl.com actually serves) is checked by the monorepo's
// auto/verify-release-surfaces.sh, same three checks.
//
// Editing the content? Rerun the result probe in scripts/agent-guide-probe.md.
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const path = join(here, '..', 'static', 'agent-setup', 'guide.md');
const MIN_BYTES = 4000; // the page is ~16 KB; anything far below is a truncation

if (!existsSync(path)) {
  console.error(`agent-guide gate: BROKEN — ${path} is missing`);
  process.exit(1);
}
const text = readFileSync(path, 'utf8');
if (text.length < MIN_BYTES || !text.includes('\n# udctl Guide\n')) {
  console.error(`agent-guide gate: BROKEN — guide.md is ${text.length} bytes or lost its "# udctl Guide" heading`);
  process.exit(1);
}
console.log(`agent-guide gate: OK — guide.md is ${text.length} bytes`);
