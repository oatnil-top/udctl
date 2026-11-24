---
title: "A thought comes up mid-chat. Now it has a place: right beside the agent."
description: "When you plan with an agent, its answers scroll away in the chat and your notes sit somewhere else. In the udctl (UnDercontrol) desktop app, the card is beside the session: the agent writes on it, you edit it, and it is still there afterwards."
authors: [lintao]
tags: [feature, story]
date: 2026-11-25
image: https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/01-cover.jpg
---

Dana runs a one-person design studio and is planning a two-day brand workshop for her client, Northwind Cafe. Halfway through working out the plan with her agent, she remembers something: the budget has a ceiling, and there is no need to rent a venue, because they can hold it at the cafe.

Where does that go? Typed into the chat, it scrolls away after a few more turns. In a notes app, the agent can't see it. In a separate doc, she has to remember later where she put it.

We made a 103-second video of this: [watch it on YouTube](https://www.youtube.com/watch?v=OQ6IuaLnrk0). This post is the written version. The screenshots are frames from the video; Dana, her studio, Northwind Cafe and the numbers in the plan are demo data.

![A thought with three places to go, a chat, a notes app and a doc, and a magnifying glass looking for it](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/02-where-did-i-put-it.jpg)

<!-- truncate -->

## Two piles, and you carry things between them

While they plan, what the agent writes is in one place: a long answer, scrolling up the chat. What Dana writes is in another: a few lines in her notes, a sketch she drew by hand.

To have the agent work from her ideas, she copies her notes into the chat box. When the agent is done, she copies the result back into her doc. Next time she opens them, she has to check which copy is the newer one.

![A pile of what the agent wrote on the left, a pile of what you wrote on the right, and a question mark between them](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/03-two-piles.jpg)

## A thought has a fixed place: the card beside the session

In the [udctl](/) (UnDercontrol) desktop app, start an agent session from a card and the window that opens has the card on the left and the terminal on the right. The scratch pad is next to you while you talk to the agent.

Dana's card is called "Northwind Cafe: brand workshop plan". It starts with one line: two days, Lisbon, 12 people, early March. She clicks Run and types one request:

> Draft the full plan onto this card: agenda for both days, a Mermaid timeline of the two days, budget table, open questions.

The agent writes the whole plan onto the card on the left. Dana does not click refresh; the content shows up in the left column by itself.

To read the plan, drag the divider to the right. To watch the terminal, drag it to the left.

![After dragging the divider the card on the left is wider, with the plan and the agenda table readable](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/05-drag-the-divider.jpg)

## Keep what is worth keeping, and let the rest scroll

An agent at work prints a lot in the terminal: the commands it ran, what it read, a summary at the end. You look at it once. You don't need to store all of it.

The plan is on the card. However many screens the terminal scrolls after that, the plan on the left stays where it is.

![KEPT above the card on the left, SCROLLS AWAY above the terminal on the right](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/04-kept-and-scrolls-away.jpg)

The card holds more than text. The agenda and the budget are tables, and the two-day timeline is Mermaid the agent wrote, drawn as a diagram right in the card.

![A Mermaid timeline rendered in the card, with the budget table below it](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/06-timeline-on-the-card.jpg)

## Your own thoughts go on the same card

The plan ends with ten open questions, and the fifth asks whether there is a budget ceiling. Dana clicks the pencil icon in the left column and writes one line at the end:

> Dana: budget ceiling is 12k EUR all in. Drop the hotel venue, keep it at our own cafe.

![The line Dana typed below the open questions](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/07-your-line.jpg)

She also pastes in a floor plan sketch of the cafe: one long table for twelve, a pin wall, a screen, and the counter at the back. Then she saves.

![The floor plan sketch pasted into the card](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/08-your-sketch.jpg)

## No copying and pasting: say one sentence and it carries on

Back in the terminal on the right, Dana types:

> I added a line at the bottom of the card. Rework the plan to fit it.

The agent reads the card, finds her line, reads the sketch too, and rewrites the plan. It moves her line and the sketch up in front of the plan under the heading Client brief, with her words unchanged.

![The card after the rewrite: Dana's line and sketch come first, and the terminal on the right records the agent reading the card, downloading the sketch and writing back](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/09-agent-picks-up-your-edit.jpg)

The venue goes from 1,800 euros to 0, and the total from 15,114 to 11,660, under the 12,000 ceiling. A new section, Room setup, follows the sketch: who sits where at the twelve seats, how the groups take turns on one wall, and breaks at the counter.

![The new budget table with the old and new versions side by side, total down from 15,114 to 11,660](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/10-new-budget.jpg)

## You can find it next time

The session ends and the card is still there. To pick it up again, Dana presses Cmd+P in the desktop app and types workshop. The card is in the results, with a preview of its text on the right. She opens it and finds the plan, her line and her sketch.

![Searching for workshop: the card is in the results with a text preview on the right](https://dl.udctl.com/features/blog/scratch-pad-beside-your-agent/11-search.jpg)

## How to start

1. Install the agent CLI you use, and open a card in the udctl desktop app, v0.191.0 or later.
2. Click the terminal icon in the toolbar on the right, choose Run, type a request, and click Run. The session window opens side by side.
3. Say "onto this card" in the request, and the agent writes into the card's description.
4. Wait for the agent to finish writing before you edit. Save, then tell it in the terminal what you changed and let it carry on.

Claude Code, Codex, OpenCode, or any terminal-based agent will do. The video uses Claude Code.

Typical scenarios:

- Writing a plan: the agent drafts, you leave a few lines on the card, it revises from them.
- Chasing a bug: read logs in the terminal, and keep only the conclusion and the steps to reproduce on the card.
- Remembering something else mid-chat: when the agent stops, note it on the left and hand it over in the next turn.
