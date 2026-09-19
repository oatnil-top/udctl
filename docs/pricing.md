---
title: Pricing
sidebar_position: 2
description: udctl self-hosted license pricing - free for individuals and teams of 3 or fewer, US$49/month up to 20 people, US$149/month unlimited. Flat per team-size band, never per seat.
---

{/*
  This page is the single source of truth for udctl prices. It replaced the
  /subscribe TSX page on 2026-09-19 (owner's call: one pricing page, not two;
  /subscribe now 301s here). The four bands and amounts were approved verbatim
  by the owner on 2026-09-14 (card efc8e0a9): annual is ten monthly payments,
  USD only. Tax and payment channel are NOT decided, so every call to action is
  "contact us" and never a buy button. Deliberate omissions, each a constraint:
  no expiry / renewal copy (the backend hard-stops on an expired license, card
  ab50aba5), no per-tier feature lists, no middle band between 20 and unlimited,
  no competitor names or amounts. Band-not-headcount is load-bearing (license
  MaxUsers is enforced at user creation); never re-lay this out per seat.
*/}

# Pricing

udctl self-hosted licenses are priced by team-size band, not by headcount. Pick the band your team fits in and that is the whole bill. Hiring inside your band changes nothing, and no line on it reads "per user per month".

## Four bands. Prices in USD.

| Band | Team size | Price | Annual | |
|------|-----------|-------|--------|---|
| **Personal** | One person | Free | | Forever. No license key needed. |
| **Small team** | Up to 3 people | Free | | One free license for the team. |
| **Team** | Up to 20 people | US$49 / month | or US$490 / year | Flat, for the whole deployment. |
| **Unlimited** | Any team size | US$149 / month | or US$1490 / year | Flat, for the whole deployment. |

A year is billed as ten months, so two months are on us. Prices are in US dollars.

**[Contact us for a license](/contact)**

## A band, not a headcount

Each license covers a size band at one flat price. Going from 4 people to 20 costs exactly nothing; only crossing into the next band changes the number. Your bill never grows because someone joined.

## Deploy first, decide later

Self-hosting is a first-class path: one all-in-one Docker image or a single npm-installed binary, with a free 3-month Pro trial license included on the [self-hosting page](/self-hosting). Prefer zero servers? The [desktop app](/download#desktop) ships its own backend and runs fully local, free. Deployment details are in the [deployment docs](/docs/self-deployment).

## Hosted udctl is still on the way

The prices above are for licenses you run on your own infrastructure. A hosted udctl you can subscribe to, with no servers and no maintenance, is in the works, and its plans will appear here when it ships. [Reach out](/contact) and we will let you know the moment it is ready.

## Related pages

- [License Activation Guide](/docs/subscription-tiers) - how to activate a license you already have
- [Self-Hosting](/self-hosting) - deploy udctl on your own infrastructure
- [Contact us](/contact) - get a license, or ask a pricing question
