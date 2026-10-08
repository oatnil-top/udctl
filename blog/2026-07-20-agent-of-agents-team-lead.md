---
title: "Agents of Agents: When AI Learns to Lead a Team"
description: "Three agents didn't triple your output — you became the router. A lead agent gets its roster injected at session start, delegates through two channels, and the org tree grows recursively. Your job shifts from dispatching to writing job descriptions."
authors: [lintao]
tags: [feature, agents]
date: 2026-07-20
image: https://dl.udctl.com/features/blog/agent-of-agents-team-lead/concept-hero.png
---

You set up three agents expecting three times the output. Instead your day looks like this: copy A's conclusion over to B, remember to chase C, read three sets of output at once, and hold "who is doing what" in your head.

**More agents didn't fix the bottleneck — it moved. You no longer lack workers. You lack managers, because there's exactly one: you.**

That's not a configuration problem, it's an org-structure problem. One person directly managing ten reports doesn't work in human companies either, and the fix was never "hire stronger individuals." The fix is **a layer of management**.

![One human routing N agents versus a lead that routes for you](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/concept-hero.png)

<!-- truncate -->

### A lead isn't a smarter agent — it's an agent that knows the roster

In UnDercontrol you can organize agents into a **Team**: one **lead**, any number of **members**, and each member carries a **delegation hint** — "what kind of work routes here."

That hint is a job description. It's short, but it decides whether work reaches the right specialist:

```
- @db-expert [reviewer] — schema changes, slow queries, migration scripts
- @ud-tester — requirement acceptance, black-box regression; don't let it touch code
- @infra-ops [remote — mention only] — servers, deploys, DNS
```

![A Team — one lead, four members, each with a delegation hint](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/app-teams.png)

Here's the part that matters: **the moment a lead's session starts, that roster is injected into its initial prompt.** You don't introduce the team in conversation, and it doesn't rediscover them each time. It is born knowing who reports to it, what each one is good at, and how to hand work off.

![The roster as it lands in the lead's prompt at session init](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/app-injected-prompt.png)

Injected alongside it is a plain but consequential instruction: **"As team lead, prefer delegating over implementing yourself. Your job is to coordinate, keep talking to the user, and review the specialist's output. Only implement directly when no member covers the work."**

If you've ever managed people, you'll recognize that sentence as the hardest lesson a new lead has to learn.

### Two delegation channels: one fast, one on the record

This is the design most people don't anticipate. Delegation isn't one move. A lead has two channels, and it defaults to the fast one.

**Channel 1 — native subagent (default)**

The lead runs `ud describe agent <name> -o prompt` to fetch the member's identity prompt, then spins it up using **its own host tool's native subagent capability**, appending the task context. The subagent runs inside the lead's session and permissions; the lead consolidates the result and reports it, noting "via @member."

The split is clean: **ud supplies identity, skills, and context; the host tool executes.** Fast, synchronous, no overhead — right for "take a look at this SQL" work.

**Channel 2 — subtask + @mention (escalation)**

The lead escalates to the second channel when any of these hold:

- The member is pinned to **another machine** (an ops agent that only runs on a production jump box, marked `[remote — mention only]` in the roster)
- The work is **long-running** and must outlive the lead's session
- You want the work to have its **own accountability thread** you can audit separately

The move is: create a subtask → `ud link task <parent> <child> --subtask` → @mention the member in a comment on that subtask. The mention automatically spins up a workspace session for them, and **the delegation chain preserves your access scope** — a member never receives broader permissions than you have. It reports its conclusion back into the thread.

In one line: **fast work goes to a subagent; anything that needs a record, another machine, or a long runway goes to a subtask plus an @mention.**

![Two delegation channels compared](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/concept-channels.png)

### Recursion: agents of agents of agents

Teams nest — a member can itself be the lead of another Team. Hierarchy grows naturally, and **each agent only ever needs to know its direct reports**, never the whole tree. That's how real organizations work.

It goes one step further: the default `ud` agent is the **root manager** of the whole org. On top of any teams it explicitly leads, **every top-level team lead is automatically injected as one of its direct reports** — so no matter how many layers your org grows, the entire tree stays reachable from `ud`.

You don't have to remember who to @. Just @ `ud` and let it walk down.

![The org tree — each node only knows its direct reports](https://dl.udctl.com/features/blog/agent-of-agents-team-lead/concept-tree.png)

### So your job changes

From "dispatching N agents" to three things that look a lot more like management:

1. **Write the job descriptions.** A vague delegation hint sends work to the wrong specialist. Writing a crisp "this belongs here, that doesn't" beats upgrading an agent to a pricier model.
2. **Define acceptance criteria.** You review output, not process. Put the criteria in the task description: the lead uses them to check its members, you use them to check the lead.
3. **Hold the review gate.** However deep the delegation chain runs, you're still the one signing off.

Worth noting: everything agents write back and forth — task descriptions, comments, notes — lives in the same Markdown system as anything you type by hand. And not just tasks: notes, expenses, accounts — every surface in UnDercontrol where you can write text shares one editing experience. Humans and agents read and write the same artifact. There's no "format for the AI" and separate "format for people."

### Traps worth knowing about

- **The lead does the work itself.** The most common failure mode, and usually it means the delegation hints were too vague — the lead couldn't tell who to route to, so it just did it.
- **An offline machine makes @mentions silently vanish.** Mentions **don't queue** waiting for a machine to come online; the delivery is dropped as daemon-offline. Confirm the machine is connected before delegating remote work.
- **One active session per member, per task.** To have an agent push two things in parallel, split them into two tasks — @mentioning it twice on one task won't do it.
- **Nested teams have no cycle detection yet.** Nothing stops you configuring A leads B leads A. Keep the depth in your head — three levels is about the ceiling; past that you can't follow what happened in the middle of the chain at review time.
- **Review debt.** The smoother delegation gets, the faster unreviewed output piles up. The bottleneck migrates from dispatching to accepting — and that part can't be outsourced yet.

### In the end

Any agent can be the lead. Claude Code, Codex, OpenCode, any terminal-based agent can be a lead or a member — roles are defined by prompts and skills, tools by Agent CLI configuration, and every one of them talks to the org through the same [AI agent CLI](/docs/cli-ai-integration/). UnDercontrol isn't tied to any AI vendor.

It does one thing: **when you have enough agents that they need managing, it gives you a management layer — instead of making you be that layer.**
