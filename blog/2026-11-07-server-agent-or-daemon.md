---
title: "Server or Daemon: Where Should Your UnDercontrol (udctl) Agent Run?"
title_meta: "Server or Daemon: Where Your Agent Should Run"
description: "UnDercontrol (udctl) agents can run on the server or on your own machine through a daemon. Here is how to pick: by what the job has to touch."
authors: [lintao]
tags: [ai-agent, feature, guide]
image: https://dl.udctl.com/features/blog/server-agent-or-daemon/hero.png
date: 2026-11-07
---

An agent in UnDercontrol (udctl) can now run in two places. Pick **server** when the job lives inside udctl, such as answering from your cards, creating a card, writing a note or posting a scheduled rundown. Your machine can be off for all of these. Pick **daemon** when the job needs your code, your shell, or a coding CLI: Claude Code, Codex, OpenCode, or any terminal-based agent.

![Two panels. Server runs inside the udctl backend: it is mentioned or scheduled, runs one turn, works with tasks, cards and notes, and replies in the same conversation, while your machine can be off. Daemon runs on a machine of yours, with Claude Code, Codex, OpenCode or any terminal-based agent, your repo, your shell and a terminal you can watch](https://dl.udctl.com/features/blog/server-agent-or-daemon/hero.png)

<!-- truncate -->

We made a 58-second video of this: [watch it on YouTube](https://www.youtube.com/watch?v=4mr1paOVkFo). This post is the written version.

## Get an answer while your laptop is closed

A daemon agent starts on a machine of yours, so it needs one online. A server agent runs inside the udctl backend. You install nothing on your computer, and your computer does not have to be on.

Mention the agent in a conversation and it runs one turn. In that turn it can look up a task, search your tasks, create a card, and add a note to a card. Its final message is the reply, in the same conversation. Each step is recorded, shown live, and kept with the card and the thread. The model calls use your own key.

A typical case: you are away from your desk and your laptop is shut. You open the web app, mention the agent, ask which release cards are still open, and tell it to add a card for the thing you just remembered.

New agents run on the server by default. Agents you already had keep running where they ran before.

## Get a morning rundown without leaving a machine on

Open a conversation, choose **More**, then **Set as resident conversation**, and give it a schedule and a message. When the time comes, the server posts that message into the conversation, the agent runs one turn, and the answer stays there. The same job appears under **Settings > Automation**.

In our promo film the schedule is every day at 9 AM and the message asks for the open cards tagged `release`. At 09:00 the agent answers with all five, and which one to do first, with no machine online.

![A timeline with three separate turns: a mention, a 09:00 schedule, and a follow-up mention. Each one starts one turn, and each turn ends with a reply in the thread. Between turns nothing is running and the conversation holds the history](https://dl.udctl.com/features/blog/server-agent-or-daemon/turns.png)

A server agent works in turns like these. It starts when it is mentioned or when its schedule fires, and it finishes when the reply is written. So set the schedule to the moments you want a report, and read the result when you next open the conversation.

## Keep coding work next to your code

A daemon agent starts a CLI on your machine, so it has your repository, your shell, and your local tools. Tests run where they always run. Usage counts against the account that CLI is already logged in to. In a daemon conversation, the header's **Stream** tab shows the terminal, so you can watch the work and step in.

A daemon agent also has the full `ud` CLI. Notes, expenses and accounts share one Markdown editor and one store with your tasks, so a daemon agent can pull a receipt and a spec into the same job. A server agent's tools work with tasks and their notes.

## Pick by what the job has to touch

![A decision chart. Jobs that touch cards, notes and the conversation go to server. Jobs that touch your code, shell or local tools go to daemon. When it depends, you pick server or daemon as you send the message](https://dl.udctl.com/features/blog/server-agent-or-daemon/choose-v2.png)

| The job | Pick | Why |
|---|---|---|
| "What is still open on the release?" | server | It only reads your cards |
| Turn a message into a card, or add a note to one | server | Both are udctl tools |
| A rundown of your cards every morning | server | No machine has to be online when it fires |
| Fix a bug in a repository | daemon | It needs your code and a coding CLI |
| Run the tests or a build | daemon | It needs your shell |
| Keep using your Claude Code or Codex login | daemon | The CLI on your machine does the work |
| Watch the terminal and step in | daemon | The Stream tab exists for daemon conversations |

If you are unsure, ask one question: does this job need a file on my computer? If yes, use daemon. If no, start with server.

## Change your mind on a single message

Right after you mention an agent, you can choose where it runs for this message. The chip under the input shows the current choice, such as "runs on server by default", and a click changes it.

- A choice outside the agent's declared range is refused, and the conversation tells you why.
- If you pick daemon and no machine is online, you get a receipt at once instead of a silent wait. When the agent's range includes the server, the receipt offers a ready-made line that sends the question there.
- An agent you own can run on the server for one conversation even if its settings list only daemons. Its settings stay as they were, and its other conversations keep using a daemon.

## Slack is coming soon

Coming soon: mention the agent in a Slack channel and it replies in the thread. Scheduled channel digests are coming soon too.

## Try it

We tested this on the hosted site, and both paths work there: mentioning a server agent for an answer, and a job that fires on schedule.

1. Open [app.udctl.com](https://app.udctl.com). Registering a new account needs an invite code. If you do not have one, choose **Visitor (No signup)** on the sign-in page. Visitor accounts are temporary, so use a model key you can revoke.
2. Add your own model key in **Settings**. A server agent needs it to answer, on either kind of account.
3. Create an agent. New agents run on the server by default.
4. Start a conversation, type `@` and the agent's name, and ask about your cards.
5. To put it on a schedule, choose **More > Set as resident conversation**.

On your own instance, "server" means your own backend: see [Self-Hosting](/self-hosting) and [Getting Started](/docs/getting-started).
