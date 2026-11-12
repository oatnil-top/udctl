# Agent guide result probe

`static/agent-setup/guide.md` (served at https://udctl.com/agent-setup/guide.md)
is edited in this repo; until card 6aa386af it was generated from the ud-guide
skill in the monorepo, which is deleted. Alfred and outside agents answer users
from it and the pages llms.txt lists.

**Retest the result, not the existence.** The corpus is judged by whether
   a fresh agent can answer real user questions from it — not by whether the
   file is reachable. After a content edit, rerun this probe:

   Give a FRESH agent (no prior product knowledge, no web search) only this
   instruction: fetch https://udctl.com/llms.txt, follow only URLs it lists
   (one hop, max 8 fetches), answer the six questions below, and for anything
   the corpus does not state, answer 「无法从语料回答」 instead of guessing.
   The cannot-answer list is the finding.

   1. udctl 是什么?和 Jira / Notion 有什么不同?
   2. 我怎么装?我是 mac,想先本地试试。
   3. 我想自部署给三个人用,要准备什么?要花钱吗?
   4. 怎么用 CLI 把一张卡改成 done?
   5. 它能不能替我跑 AI agent?怎么起一个?
   6. 数据在哪?我能导出吗?

   Baseline (2026-09-14, first run): 1, 2, 4 fully answered; 3 partial
   (post-trial price), 5 partial (daemon startup command not documented
   anywhere), 6 partial (`ud pull` as the export story absent from
   operational docs). Same-day fix and retest for 3: after indexing
   /subscribe in llms.txt the probe answered it fully, with the real
   band prices. 5 and 6 are content gaps tracked on card 9e442340; their
   acceptance criterion is these two questions flipping to fully answered
   in this same probe. The retest also surfaced a naming drift the probe
   itself flagged: /subscribe sells Personal / Small Team / Team /
   Unlimited while /docs/subscription-tiers/ describes Personal / Pro /
   Max — undecided as of 2026-09-14, reported on task 15455d96.

Scope guard: the corpus stays the llms.txt-reachable SET. Download, deploy
and pricing facts live on their own pages and are linked, never restated —
every restated fact is one more drift axis (owner-confirmed, task 15455d96).
Never write a capability the product does not have: agents quote this file
to users as authority.
