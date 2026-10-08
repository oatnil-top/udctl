---
title: Real-Time Multi-Client Sync with Server-Sent Events
description: How UnDercontrol keeps your tasks and finances in sync across browser tabs, desktop, and mobile using Server-Sent Events and a smart event-driven architecture.
authors: [lintao]
tags: [feature]
date: 2026-04-06
---

If you have UnDercontrol open in a browser tab, on your desktop app, and on your phone at the same time, you probably expect them to stay in sync. Adding a task in one place should show up in the others without a page refresh. Logging an expense should reflect in your budget immediately, everywhere.

That kind of real-time sync sounds simple but gets complicated fast when you factor in reconnects, offline states, and the cost of keeping connections alive. Here is how UnDercontrol handles it.

## Why Server-Sent Events

WebSockets are the obvious choice for real-time features, but they come with overhead — bidirectional connections, custom protocol handling, and more complexity on both ends. For UnDercontrol, the update flow is almost entirely one-directional: the server pushes changes down to clients. That maps perfectly onto Server-Sent Events (SSE), which is a standard HTTP mechanism built into every modern browser.

SSE gives us persistent connections over plain HTTP, automatic reconnection built into the browser spec, and no additional infrastructure beyond the Go backend that already runs your instance. It keeps the self-hosted model clean.

## How It Works

When you open UnDercontrol, the frontend establishes an SSE connection to the backend. Your session is registered in a per-user connection hub — a structure that tracks every active connection for your account across tabs, devices, and the Electron desktop app. When something changes (a task is updated, an expense is logged, a file is renamed), the backend emits an event onto an internal async event bus. That event fans out to every connection registered under your user ID.

This means if you log an expense on your phone, your browser tab sees it within milliseconds. No polling, no manual refresh.

The connection lifecycle is managed deliberately. Connections are kept alive for up to 30 minutes, after which they cycle and reconnect. This prevents resource leaks on long-running instances and plays nicely with load balancers and reverse proxies that have their own timeout rules. If a connection drops for any reason — network hiccup, sleep/wake cycle, proxy timeout — the client reconnects automatically using exponential backoff. It starts with a short delay and increases gradually, so a briefly offline device does not hammer your server the moment it comes back online.

## Smart Cache Updates on the Client

Getting an event is one thing. Knowing what to do with it is another. UnDercontrol does not blindly refetch the entire dataset when an SSE event arrives. Instead, the frontend applies differential cache updates: it looks at what changed, finds the relevant entry in the local Zustand store, and patches only that record.

For example, if a task's status changes from "in progress" to "done," the event carries just that task's updated state. The client merges it into the existing cache. The list re-renders with the new status. Everything else stays untouched.

![Kanban board with live status updates pushed via SSE](https://dl.udctl.com/features/blog/sse-realtime-sync/kanban-board.png)

This keeps the UI fast and prevents the jarring full-reload effect you see in apps that refetch aggressively.

## Optimistic UI and Server Reconciliation

SSE works alongside UnDercontrol's optimistic update model. When you make a change locally, the UI updates immediately — no spinner, no waiting. The write goes to the server in the background. If it succeeds, the server emits an SSE event that propagates to your other clients. If it fails, the local state reverts and you see an error.

The result is that your primary device feels instant, while your secondary devices stay consistent. The server is the source of truth, and SSE is the mechanism that keeps everyone aligned with it.

## Practical Benefits You Will Notice

Open the same UnDercontrol instance in two browser tabs. Make a change in one. Watch it appear in the other without touching anything.

![Task list view — changes sync in real-time across all connected clients](https://dl.udctl.com/features/blog/sse-realtime-sync/task-list.png)

This is particularly useful when you have a budget overview open on one screen and you are logging transactions on another.

![Budget overview — expense changes propagate instantly to all open views](https://dl.udctl.com/features/blog/sse-realtime-sync/budget-overview.png)

The Electron desktop app participates in the same sync. Changes made through the CLI or the Chrome extension propagate back through SSE to whatever else you have open. The whole multi-platform story depends on this layer working reliably.

## Try It Yourself

All of this runs on your own hardware. There is no cloud dependency, no third-party sync service, and no data leaving your control. The SSE endpoint is part of the standard UnDercontrol backend.

If you are not running UnDercontrol yet, the self-deployment guide covers getting started with Docker in a few minutes. If you are already running an instance, the sync is already active — just open a second tab and see for yourself.

Check the [documentation](https://undercontrol.dev/docs) for deployment instructions and configuration options.
