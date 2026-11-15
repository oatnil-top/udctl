---
sidebar_position: 12
---

# The AI Provided by udctl.com

Alfred needs an AI model to answer. On the desktop app or a single-user self-hosted install with no model of your own, you can turn on the AI provided by udctl.com instead of adding an API key. No sign-up is needed.

It is off until you turn it on. Before that, the app sends nothing to udctl.com.

## Who gets it, and where

- Only Personal-tier installs: the desktop app and single-user self-hosted instances. Pro and Max servers do not offer it.
- It is offered wherever Alfred has no model: in the first-run guide after you choose "Not yet, just chat", above the conversation input, in Alfred's quick input, and in **Settings > AI & models** when no provider is set up.
- Each place shows the same block with the two points below, a **Turn on** button and a **Use my own API key** button.

## Two things to know before you turn it on

1. **It has a daily limit.** Once today's allowance is used up, it stops until the next day; the allowance resets at 00:00 UTC. One Alfred answer can take several model calls. While it is on, the line above the conversation input shows what is left, for example "via udctl.com · 27 of 30 left today". There is also a daily cap per network and a daily total for udctl.com; when any of them runs out, Alfred says which one in the thread.
2. **Your conversation leaves this computer.** Once on, your conversation with Alfred and the cards Alfred reads to answer are sent to udctl.com and passed on to the model provider (Anthropic) to generate the answer.

## What is sent, and where

Only three kinds of request go to udctl.com, and only while the option is on:

| Request | When |
|---|---|
| Enroll | Once, when you click **Turn on**. udctl.com returns an anonymous access token that this install uses from then on. |
| Message | When Alfred answers you. The request carries your conversation and the cards Alfred read. |
| Usage | When you open a conversation or the settings page, right after turning it on, and after an answer ends. |

There is no timer and no background heartbeat. The requests carry no machine ID, install ID, app version or local account name; the only identity is the anonymous token. udctl.com's access log records the source IP address and request time, not the conversation content.

Only Alfred and conversation answers use it. Other AI features (AI actions on tasks, notes and images, receipt scanning, scheduled AI jobs) do not; they still need a provider of your own.

## Turn it off

Go to **Settings > AI & models** and click **Turn off** on the "AI provided by udctl.com" row. The access token stored on this computer is deleted and nothing more is sent to udctl.com. Turning it on again enrolls again.

## Use your own API key instead

Add your own provider in **Settings > AI & models** (see [Configure an AI provider](../howto/config-ai-provider.md)). Your own model takes priority automatically: the udctl.com row stays in the list as a fallback after it, and the line above the conversation input changes to "Using your own model · no udctl.com allowance used". You do not need to turn the udctl.com option off; turn it off only if you want no fallback.
