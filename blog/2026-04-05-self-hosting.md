---
title: Own Your Data with Self-Hosting
description: Deploy UnDercontrol on your own infrastructure with Docker Compose or Kubernetes — full data ownership, no vendor lock-in, your choice of SQLite or PostgreSQL.
authors: [lintao]
tags: [feature]
date: 2026-04-05
---

There is a certain kind of frustration that builds slowly. You sign up for a productivity app, migrate your tasks and finances into it, build habits around it — and then one day the pricing changes, the company pivots, or worse, the service shuts down. Your data is gone or locked behind an export button that produces something barely usable.

UnDercontrol was built from the start to avoid that situation entirely. It is self-hosted, which means you run it on infrastructure you control, and your data lives wherever you put it.

## Deploy in Minutes with Docker Compose

For most people, Docker Compose is the fastest path to a running instance. A single `docker-compose.yml` file pulls the backend and frontend images, wires them together, and has UnDercontrol running on your server or local machine in a few minutes.

A minimal setup looks roughly like this: a backend service with your data directory mounted as a volume, a frontend service pointing at it, and an optional reverse proxy like Caddy or Nginx in front. That is genuinely all there is to it for a single-user or small household deployment. No managed cloud accounts, no API keys to a third-party service, no data leaving your network.

The Docker image is designed to be small and predictable. It does not phone home, it does not require an internet connection after the initial pull, and it stores everything in the paths you configure.

![UnDercontrol dashboard — self-hosted and fully under your control](https://dl.udctl.com/features/blog/self-hosting/dashboard.png)

## Kubernetes for Teams and Power Users

If you are running a homelab with Kubernetes, or you want the kind of reliability that comes with proper orchestration, UnDercontrol ships with Kubernetes manifests as well. You get standard Deployments and Services, PersistentVolumeClaims for your data, and ConfigMaps for environment-specific settings.

This is particularly useful if you are deploying UnDercontrol for a small team — a family, a group of friends, a small company — where you want proper resource limits, rolling updates, and the ability to scale the backend independently if needed. Kubernetes also makes it straightforward to add ingress rules, TLS termination, and namespace-level isolation.

## SQLite or PostgreSQL — Pick What Fits

One of the practical decisions UnDercontrol makes easy is choosing your database. For a single user or a small number of users, SQLite is the default and it works extremely well. There is no database server to manage, no connection pooling to configure, and backups are as simple as copying a file. SQLite is surprisingly capable under these conditions, and it keeps the operational overhead close to zero.

When you need more — concurrent users, larger datasets, integration with existing database infrastructure — switching to PostgreSQL is a matter of changing your environment variables and running migrations. The schema is identical across both backends. You do not have to redesign anything; you just point the application at your Postgres instance and it works.

This flexibility matters because your needs change over time. Starting with SQLite and migrating later is a supported path, not an afterthought.

## What Full Data Ownership Actually Means

Self-hosting means your tasks, your financial records, your uploaded files, and your AI conversation history all live on storage you control. If you want to move to a different server, you copy your data directory and update your deployment. If you want to back up everything, you back up that directory. If you decide to stop using UnDercontrol entirely, your data is still there, in formats you can read.

There is no account to delete, no support ticket to file, no waiting period. The data is yours because it was always on your machine.

This also means you control who has access. Running UnDercontrol on a private network or behind a VPN means your finance data never touches the public internet unless you explicitly route it there. For people who track detailed budgets or sensitive personal information, that is not a small thing.

## No Vendor Lock-in by Design

The backend API is documented and open. The CLI uses kubectl-style commands and works against the same API the web app uses. You can script against it, integrate it with other tools, or build your own clients. The task and note formats are designed to be portable.

The goal was always to build something that earns your continued use because it is genuinely useful — not because migrating away is too painful to bother with.

## Get Started

The deployment guide covers Docker Compose setup, Kubernetes manifests, database configuration, and backup strategies in detail. If you have a server or a spare machine running, you can have a working instance today.

Check out the [self-hosting documentation](/docs/self-deployment) to get started, or open an issue on GitHub if something in the setup does not work the way you expect.
