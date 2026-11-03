---
title: "DeepSeek Says the Agent Bottleneck Is Human Attention: Watch Fewer Terminal Windows with udctl"
description: "DeepSeek's Super-agent article says the bottleneck for agents has moved to human attention. Each piece it describes (one session per task, event triggers, thread replies that reach the working session, speaking up only when a person must decide, your own machine) already has a shipped counterpart in udctl."
authors: [lintao]
tags: [feature]
date: 2026-11-03
image: https://dl.udctl.com/features/blog/super-agent-attention/en-01-mapping.png
---

On October 31, DeepSeek's Harness team published "Super-agent design exploration: toward more autonomous agent systems" and open-sourced a research prototype, dsh-superagent. The starting point of the article: models need a human to step in less and less to finish a single task, so the bottleneck has moved to human attention. The prototype's README puts the principle in one line: take as little human attention as possible, and give as much value as possible.

If you keep several Claude Code, Codex or OpenCode windows open at once, you have probably hit this bottleneck already. Past a few windows, you can no longer tell which one is waiting for your answer and which one finished long ago.

udctl (UnDercontrol) has no feature called super-agent. But each piece the article breaks out has a counterpart in udctl that is already shipped: requests come from events, each task gets its own session, follow-up messages go straight back to that session, the agent speaks up only when it needs a person, and it runs on your own machine. The sections below are organized by what you no longer have to keep track of, and each one names the feature behind it.

![Left column: six parts of DeepSeek's Super-agent design. Right column: the udctl feature already shipped for each](https://dl.udctl.com/features/blog/super-agent-attention/en-01-mapping.png)

<!-- truncate -->

## No more watching a row of terminal windows

In DeepSeek's design, a Worker is a session with its own isolated context, and one Worker does one job.

In udctl, one card plus one agent is one session. When you @-mention an agent on a card, the backend opens a session for it on that card; mention the same agent on another card and that is a separate session, with no shared context. To see which sessions are running and which are waiting for input, run `ud get sessions`. You don't have to tell windows apart from memory.

As of November 3, our own workspace has had 5,451 of these sessions.

## No typing a prompt every time

The article calls an agent's input a Trigger: a group-chat message, an email, a calendar reminder, a code review comment, a CI result, rather than a person typing a prompt into a box.

udctl has three kinds of entry points that wake an agent:

- an @mention in a card's description, a note or a comment;
- a message to Alfred through Telegram, Discord or the desktop app's quick input;
- a scheduled job: at the set time it creates a card whose @mention wakes the agent, or it uses `wake_agent_session` to wake an existing session.

The scheduled job that prepares grammar lessons in our previous post, [Hand Off the Small Daily Decisions](/blog/2026/10/25/hand-off-the-small-daily-decisions), had fired 88 times by October 24, and its owner never typed a prompt for it.

## Replies go back to the session doing the work

In DeepSeek's design, follow-up messages on the same Thread (a PR, an IM topic, an email chain) bypass the Router and go straight to the Worker subscribed to it.

udctl's comment threads work the same way. Once an agent has posted in a thread, it is subscribed to it; when you reply in that thread later, the message goes straight into its session on that card. If the session drops halfway, the next one starts by reading that same thread, with everything said in between.

## Called in only when you have to decide

The agent in the article speaks up in IM only when it needs a person to decide or sign off, and the team also tried capping each reply at 100 characters.

In udctl 0.181.0, the sidebar's "Needs you" lists only threads that @-mention you. An agent finishing a turn no longer counts as "waiting for you"; a thread shows up there only when the agent actually @-mentions you. Every other thread stays in Conversations for when you want to look.

## One sentence in, handed out to a team of agents

The article's Router layer dispatches and does no work itself: it takes in all messages and hands tasks to Workers.

udctl has Agent Teams. Give a lead agent a roster of members; the roster is injected into every session it starts, and it @-mentions the right member for each job. This post came about that way: the author wrote one line on a card ("see if we can ride this trend"), Alfred @-mentioned the content team's lead, and the lead did the research and the draft and handed them back in the same thread.

## Runs on your own machine

The article mentions BYOM (bring your own machine): when a device drops and comes back, the work picks up again.

udctl agent sessions run on a daemon. The desktop app registers itself as a daemon as soon as it starts; on a machine without it, run `ud daemon start`. When an agent is woken, the backend picks one of your own devices first, and uses one someone shared with you only when none of yours is online. If everything is offline, the message stays in the thread, and the next message after a machine comes back opens a new session. An agent can also declare that it runs on the server, with no online device needed.

## What agents write sits next to your own records

The card descriptions, notes and comments an agent reads and writes use the same Markdown editor as your expense notes and account descriptions. The progress and conclusions an agent writes live alongside your own records, and you find them by path, tag and query.

## Try it

1. Install the desktop app (it registers itself as a daemon), or run `ud daemon start` on any machine.
2. On a card, @-mention an agent and write one sentence about what you want done. The agent can be Claude Code, Codex, OpenCode, or any terminal-based agent.
3. Go do something else. When it needs you, that thread shows up in "Needs you".

Reference: DeepSeek's prototype repository, https://github.com/deepseek-ai/dsh-superagent-prototype
