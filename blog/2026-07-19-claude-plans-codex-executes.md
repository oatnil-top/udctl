---
title: "Claude Plans, Codex Executes"
description: "Turn two AI subscriptions into one team: a planner agent splits work into subtasks with acceptance criteria, delegates via @mention, an executor agent implements — you only review. Agent Teams give the lead its roster automatically."
authors: [lintao]
tags: [feature, agents]
date: 2026-07-19
image: https://dl.udctl.com/features/blog/claude-plans-codex-executes/concept-hero.png
---

Plenty of developers already work this way: hash out the approach in Claude Code, then copy the conclusion into Codex to implement. The reason is practical, too — you're paying for both subscriptions anyway. Claude is great at planning; letting Codex do the heavy lifting doesn't burn your Claude quota. Both subscriptions earn their keep. The only problem: the "copy-paste" role in the middle is *you*.

**In UnDercontrol, this pipeline works out of the box**: Claude plans, Codex executes, and the task system is the whiteboard they share — you only step in to review at the key points.

![Claude plans, Codex executes — tasks are the shared whiteboard between your AI agents](https://dl.udctl.com/features/blog/claude-plans-codex-executes/concept-hero.png)

<!-- truncate -->

### Five steps to a working pipeline

1. **Configure two agents.** Claude Code, Codex, and OpenCode are built-in Agent CLI templates — just pick one (any custom command works too). Give the planner Claude Code and the executor Codex. Don't feel like configuring? Even this step can be outsourced — there's a built-in **Agent Creator**: @mention it, describe the combo you want, and it sets the agents up for you.
2. **Toss the requirement to the planner.** A rough task is fine — just @planner it. The daemon spins up a Claude Code session on your dev machine: it reads the description, clarifies the requirement, and splits it into subtasks with acceptance criteria.
3. **The planner delegates to the executor.** It @executor-mentions each subtask — an agent-to-agent @mention automatically launches a new workspace session for the other agent, and the delegation chain preserves your access scope.
4. **Codex executes.** Each session picks up one subtask: writes code, runs tests, commits, notes progress back on the task, and marks it `pending` when done.
5. **You step in at exactly two points.** Approve the plan; review the output.

![From a rough idea to reviewed commits — one pipeline](https://dl.udctl.com/features/blog/claude-plans-codex-executes/concept-flow.png)

The whole collaboration happens on the task itself — the description is the spec, comments are the conversation, notes are the progress log. Here's a real task detail: the planner's acceptance criteria on the left, the three-way comment thread on the right:

![Task detail — the planner writes the spec, the executor reports commits, everything on the record](https://dl.udctl.com/features/blog/claude-plans-codex-executes/app-task.png)

### Form a squad: Agent Teams

Don't want to conduct two agents by hand every time? Organize them into a **Team**.

A Team has one **lead** and any number of **members**, and each member carries a delegation hint — "what kind of work routes here." When the lead's session starts, its roster is injected into the prompt automatically — **the lead is born knowing who reports to it, what each specialist is good at, and how to delegate**.

![Agent Teams — a lead plus members with delegation hints, roster auto-injected into the lead's session](https://dl.udctl.com/features/blog/claude-plans-codex-executes/app-teams.png)

"Claude plans, Codex executes" becomes a one-liner: @mention the dev-team's lead and it arranges the rest. Teams also nest — a member can itself lead another Team, so hierarchy grows naturally while each agent only ever needs to know its direct reports.

### Watch everything live

Open a board for the big picture: how much got planned, what's executing, what's waiting for review — one glance. Every agent session's terminal output also streams back to the web in real time — on your laptop, or your phone.

![The AI team delivery board — Planning / Executing / Pending Review / Done](https://dl.udctl.com/features/blog/claude-plans-codex-executes/app-board.png)

### Typical scenarios

- **Queue work before bed, review after breakfast.** Drop three feature requests on the planner at night; wake up to split subtasks and several `pending` implementations, each with its own commits.
- **Slice a big refactor.** Claude writes the migration plan and cuts it into 20 small tasks; Codex executes them one by one — roll back exactly the step that goes wrong.
- **A bug-triage pipeline.** The planner reproduces, localizes, and writes up the root cause before delegating the fix — the executor gets "what to change, why, and how to verify," not "there's a bug, fix it."

### The combo is yours to choose

Claude + Codex is just one pairing. UnDercontrol is not tied to any AI tool — Claude Code, Codex, OpenCode, or any terminal-based agent can be a lead or a member, because each of them reaches the shared task board through the same [AI agent CLI](/docs/cli-ai-integration/). Roles are defined by prompts and skills; tools by Agent CLI configuration. Whatever subscriptions you hold and whatever each model is best at, the orchestration is in your hands.

One more thing: the progress agents write back lives in the same Markdown system as everything you write by hand — tasks, notes, comments, even finance records share one editing experience.

---

Want to try it? [Download UnDercontrol](https://oatnil.com/docs/download), start the daemon, create a Team, and @mention the lead on your first task.
