---
title: Visual Project Management with Kanban Boards in UnDercontrol
description: Learn how UnDercontrol's kanban boards bring drag-and-drop task management with auto status updates, custom columns, and team sharing to your self-hosted setup.
authors: [lintao]
tags: [feature]
date: 2026-04-04
---

If you have been managing tasks through a flat list and wondering when things started feeling unwieldy, kanban boards are probably the answer. UnDercontrol's kanban view gives you a column-based layout over your existing tasks — no separate system to maintain, no data duplication, just a better way to see what is actually happening.

## The Board is a View, Not a Silo

This is the part worth understanding before anything else. In UnDercontrol, a kanban board is a visual layer on top of your task system. When you drag a card from "Todo" to "In Progress," you are not just moving a card on a board — you are updating the task's status. That change shows up immediately in your task list, your CLI queries, everywhere. There is no synchronization problem because there is only one source of truth.

This means you can switch between kanban and list views freely without worrying about things getting out of sync.

## Getting Started: The All Tasks Board

Every account comes with a built-in "All Tasks" board. Open it and you will see all your tasks organized across eleven columns: Awaiting Decision, Follow-up, Recent Created, Recent Updated, Draft, Todo, In Progress, Pending, Stale, Done, and Archived. This board cannot be deleted and it always appears first.

It is a good place to start. Drag a task from Todo to In Progress, and watch the status update instantly. That is the basic loop — visual placement drives task state, not the other way around.

## Custom Boards with Query-Based Columns

Where things get interesting is when you create your own boards. Each column is defined by a filter condition — essentially a query that determines which tasks belong there. A "Blocked" column might filter for tasks tagged `blocked`. A "Due This Week" column could filter on due date. The column is not just a label; it is a live query.

When you configure column actions, moving a card becomes a trigger. Drag a task into the "Done" column and it gets marked done automatically. Move something into a "Needs Review" column and it can be tagged and assigned in one gesture. You define what dragging into a column means, and the board handles the bookkeeping.

This is genuinely useful for multi-step workflows. If your process is something like Draft -> Review -> Ready to Ship -> Done, you can model that exactly — with each column transition doing the right thing to the underlying task data.

## Private and Shared Boards

Private boards are scoped to you. You can create as many as you need — one for a side project, one for your weekly planning, one for a home renovation. They all pull from your full task pool, filtered through whatever columns you configure.

Shared boards work differently. When you share a board with a group, the board only shows tasks that belong to that group. Everyone in the group can see the board and move cards around based on their permissions. It is a clean model: the board's scope is the group, and access is controlled through group membership.

This makes shared boards practical for small teams. A sprint board for a two- or three-person team, where everyone can see what is in progress and what is blocked, is easy to set up and does not require any additional tooling.

## A Few Workflow Patterns Worth Trying

If you are not sure how to structure a board, here are a few approaches that work well:

A **status-based board** mirrors the default setup — Todo, In Progress, Done. Simple, low-overhead, good for solo work.

A **time-based board** uses columns like Backlog, This Week, Today, and Done. The filter conditions look at due dates or custom fields rather than status. Dragging a task into "Today" can update a priority field automatically.

A **project board** with shared access uses the group feature to scope tasks to a specific project. Columns map to your team's actual workflow stages, and everyone operates from the same board.

## Everything Stays Connected

Because boards are built on top of the same task and tag system as the rest of UnDercontrol, they compose naturally with other features. Tags you use in task filters work as column conditions. Custom fields you create for a project can drive column membership and be updated by column actions. The board is not a separate module — it is the task system made visual.

If you want to see how this fits into the broader setup, the [Kanban Boards documentation](/docs/features/kanban) covers column configuration, automatic actions, and sharing in detail. And if you are not running UnDercontrol yet, the [self-hosting guide](/docs/self-deployment) will get you up and running in under an hour — your data stays on your infrastructure, always.
