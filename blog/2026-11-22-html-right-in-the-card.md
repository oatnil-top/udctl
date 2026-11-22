---
title: "Your agent made an HTML file. Read it right in udctl."
description: "An agent hands you a report as an HTML file, and you still have to ask where it is, find it, open it, and move it to your phone. In udctl (UnDercontrol) it is on the card: it renders right there, works, and opens on your iPhone too."
authors: [lintao]
tags: [feature, story]
date: 2026-11-22
image: https://dl.udctl.com/features/blog/html-right-in-the-card/01-two-formats.jpg
---

Dana runs a one-person design studio. On Thursday she has a call with her client, Northwind Cafe, to go through October: how visits, orders and revenue moved week by week after the new menu page went live.

She asks her agent for a report. A few minutes later the agent replies: done, it's an HTML page with three numbers, a bar chart you can switch, and a table.

When an agent hands something back, writing comes as Markdown. Anything with layout, charts or buttons comes as HTML. This report is the second kind.

We made a 64-second video of this: [watch it on YouTube](https://www.youtube.com/watch?v=QEopgZz5RX4). This post is the written version. The screenshots are frames from the video; Dana, her studio, the cafe and the numbers in the report are demo data.

![Two kinds of files, Markdown and HTML; the HTML one is a page with a bar chart](https://dl.udctl.com/features/blog/html-right-in-the-card/01-two-formats.jpg)

<!-- truncate -->

## Three rounds of searching before you see it

The report is done, but Dana hasn't seen it yet.

First she asks where the file is. The agent gives her a path. She opens a folder, clicks down one level after another, finds the file and double-clicks it. A new browser tab opens, and there is the report.

![Three steps: ask the agent where the file is, dig through folders, then open it](https://dl.udctl.com/features/blog/html-right-in-the-card/02-three-steps.jpg)

She reads it once and asks the agent to shorten a heading. Done. Then the same questions come back. Is it still the same file, or is there a new one now, and in which folder?

Near the end of the day she wants to go over it once more on her phone before the call. The file is on her laptop, so it has to get to the phone first: a cable, a cloud drive, or emailing it to herself. Then she needs something on the phone that will open it.

![A laptop and a phone, and an .html file with no obvious way across](https://dl.udctl.com/features/blog/html-right-in-the-card/03-another-device.jpg)

Making the report took a few minutes. The time went into finding it, opening it, and moving it to another device.

## In udctl, the report is on the card

Here is the same thing in [udctl](/) (UnDercontrol).

Dana has a card, "Northwind Cafe: October report", listing the steps: pull the October numbers, build the report page, walk the client through it on Thursday's call. When the agent finishes the report, it attaches it to this card.

She opens the card and the report renders right there, under the to-do list. No asking where it is, no digging through folders.

![The card "Northwind Cafe: October report" in the web app, with the report rendered in the card body](https://dl.udctl.com/features/blog/html-right-in-the-card/04-in-the-card.jpg)

The file is also in the card's attachments. Click it and a preview window opens: the page on the left, file details on the right.

![Attachment preview: the rendered report on the left, file name, type and size on the right](https://dl.udctl.com/features/blog/html-right-in-the-card/05-preview-window.jpg)

When the agent changes something, the file is still on the same card, so there is nothing to find again. Refresh the card and you see the new version.

## The page in the card works

What shows in the card is the web page the agent built. Scripts run and buttons work.

Dana clicks Revenue and the bar chart switches to revenue. She clicks the last bar and the amount for that week shows below it: October 22 to 31, $8,440.

![In the preview, Revenue is selected and the last bar is highlighted, with "Oct 22 - 31: $8,440 in revenue" below](https://dl.udctl.com/features/blog/html-right-in-the-card/06-live-page.jpg)

For more room, open the file page and click Full Screen. The report fills the window.

![File page in full screen: the report fills the window](https://dl.udctl.com/features/blog/html-right-in-the-card/07-full-screen.jpg)

## On the phone, nothing to transfer

On the way home, Dana opens the same card on her iPhone and taps the report in the attachments. The page opens inside the app. She taps the button in the top-right corner for full screen and scrolls down to the chart.

The file was on the card all along. Laptop and phone show the same file, with no transfer step in between.

![The same report open full screen on an iPhone](https://dl.udctl.com/features/blog/html-right-in-the-card/08-iphone.jpg)

## A page your agent wrote is safe to open

The report has scripts in it, and Dana hasn't read every line the agent wrote. She doesn't have to. The page runs in an isolated frame and can't reach her udctl account.

## How to get your agent to deliver this way

Claude Code, Codex, OpenCode, or any terminal-based agent can deliver this way once the ud CLI is installed. Tell it:

> Make the report a single-file HTML, attach it to this card, and add a link line in the card body so it shows right there.

The agent attaches the file to the card with `ud upload resource`, then writes a line in the card body that links to it. You can also upload the file yourself from the card's attachments in the web app.

Two things to know. Only single HTML files work for now: styles, scripts and images have to be inside the file or loaded from a CDN, and a separate CSS file or image in the same folder won't load. On the iPhone, open the file from the attachments; the link line in the card body shows as plain text there.
