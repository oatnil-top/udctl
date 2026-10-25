---
title: "Hand Off the Small Daily Decisions: Let Scheduled Jobs Prepare What You Study Each Day"
description: "Learning a little every day is hard mostly because of the small decisions before you start. Write them down once with udctl scheduled jobs and an agent: no picking today's topic, no tracking where you left off, content ready when you open it, and feedback you give once becomes a rule."
authors: [lintao]
tags: [guide]
date: 2026-10-25
image: https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/en-01-handoff.jpg
---

Learning a little every day is hard, and the hard part is often not the content itself but the few small decisions before you start: what to study today, where you left off, where the material is. None of them is big, but every day you make them all over again.

This post describes one way out: with [udctl](/) (UnDercontrol) scheduled jobs and an agent, you write those decisions down once and hand them over. After that you have one thing left to do each day: open a fixed place and look at what has already been prepared. Each benefit below comes with how the author runs it for their own English study.

We made a 5-minute video of this: [watch it on YouTube](https://www.youtube.com/watch?v=AoweFTBJcgg). This post is the written version.

![Four parts in a row: a scheduled job creates one card a day, an agent reads it, does the work and writes back, and the result lands in a fixed place](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/en-01-handoff.jpg)

<!-- truncate -->

## How it works

A udctl scheduled job is a cron expression plus a time zone. When it fires, it creates a task card from a template. The template's description @-mentions an agent, and the moment the card is created, that mention wakes the agent: it opens a session on your own machine, reads the card, does the work, and writes the result back to the card. The agent can be Claude Code, Codex, OpenCode, or any terminal-based agent.

## No deciding what to study each day

Topic, order and length go into the dispatch template once, and the agent follows it every day.

The author's grammar-lesson template says: "the topic is yours, prepare the lesson yourself, don't send the owner a questionnaire." As of October 24, that scheduled job had fired 88 times.

## No remembering where you left off

Progress lives on a card, not in your head.

The author's phonics course has a progress card. The agent reads it as the first step of each session and updates it as the last. What the next lesson covers is already written on the card.

![The phonics progress card: lessons 1 to 10 on the left with lesson 7 marked "here" (progress as of 2026-10-24), the card itself on the right](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/en-02-progress-card.jpg)

## When you open it, the content is already there

Schedule the jobs before you wake up and have everything land under the same path. No searching, no waiting.

The author currently has three English-related scheduled jobs, staggered in time (Singapore time):

| Time | Scheduled job | Output |
|---|---|---|
| 05:30 | english-video-daily | An English passage plus a roughly 15-minute explainer video |
| 08:00 | english-tutor-daily-lesson | A grammar lesson |
| 09:00 | english-phonics-daily | A 7 to 10 minute phonics video |

In the morning you open `/english/video`, and the newest card is today's: the body is the English passage, the attachment is the video.

![A timeline: three scheduled jobs at 05:30, 08:00 and 09:00 run before waking up; after waking you open /english/video and the newest card is today's](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/en-03-before-you-wake.jpg)

The video is attached to the card, so it is the same wherever you open it. On the web, click the attachment and it plays right on the page. On iOS, open the same card, tap the video, and it plays on your phone; full screen, playback speed and AirPlay are the system's own controls. Lock the screen or switch to another app and the audio keeps playing, with play and pause on the lock screen.

It is an ordinary mp4 file. Watch on the computer or listen on the phone: it is the same card, with nothing to upload twice.

![The same video attachment on the same card: playing on the web page on the left, the same file opened on iOS on the right, and playback continuing on the lock screen in between](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/en-04-web-and-ios.jpg)

## Switch to a format you will actually open

If the content is ready and you still don't look at it, the format may be the problem. The format can be handed to the agent too.

The author's version started as text: from August 18, one English passage of two to three hundred words a day, 53 of them before it was stopped on October 10. It was stopped because the author could not be bothered to read it.

On October 10 it became a video. The requirement: it must be understandable by ear alone, in three passes: once in pure English, once with each English sentence followed by its Chinese explanation, and once more in English. A sample came out the same day, feedback went in, and once the third version was settled it was handed to an agent to run automatically every day at 05:30.

![Understandable by ear alone, in three passes: pass 1 in pure English, pass 2 English then Chinese; on the right, the title card of one episode](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/en-05-three-passes.jpg)

## Content that follows your level, with feedback given once

When something is off, say it once on the card. The agent writes it into a rule, and the next day's scheduled job runs by the new rule. You don't have to remember what you asked for, or check every day whether it was followed.

Two adjustments from the author's version:

- **Too easy.** On October 22 the feedback was that the reading was a bit too easy and the words were too simple. The rule changed right away: passages of 300 to 360 words, written at B2 to C1, and words like *simple* and *money* go on a blacklist.
- **One level deeper.** On October 18 the question was whether all the common syllables could be learned. The agent assessed it first: rules would cover roughly 70 to 80 percent, in about ten weeks. A trial lesson came out the same day, it sounded fine, and a third scheduled job was added.

![A loop: you read, you comment once on the card, the agent writes it as a rule, and the next day's job follows the new rule](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/en-06-feedback-loop.jpg)

## Build your own: five parts

Video and voice-over are the author's own needs; your version can be one piece of text a day. What you can copy directly is the structure:

1. **One scheduled job** that creates a card every day, with an agent @-mentioned in the card.
2. **Decisions written firmly into the dispatch template.**
3. **One progress card.**
4. **One fixed entry point.**
5. **Feedback written as rules.**

## You don't have to build any of it by hand

That sounds like a lot of setup. In practice, the agent does all of it for you.

udctl is agent-native: everything above can be done by directing your agent, so you don't need to learn the features first. They are all there, but what you do is tell your agent what you want, then adjust with it in conversation until it works the way you expect.

![On the left, one person says one sentence and the agent touches the scheduled job, template, progress card and folder; on the right, that sentence in a comment box, asking the agent to move the English passage to 05:00 every day](https://dl.udctl.com/features/blog/hand-off-the-small-daily-decisions/en-07-tell-your-agent.jpg)

Explore. Capture. Distill. A private workspace for people and AI agents. [udctl.com](https://udctl.com)
