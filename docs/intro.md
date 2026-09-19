---
sidebar_position: 1
---

# Welcome to udctl

udctl (UnDercontrol) is a self-hosted personal finance and task management app. Track your budget, log expenses, manage tasks, and organize files — all in one place, with full ownership of your data.

## What is udctl?

Built by an indie developer + AI, udctl gives you a unified workspace for managing your money and time without relying on third-party services:

- **Budget & Expense Tracking**: Create budgets, log expenses, and monitor your spending
- **Task & Issue Tracker**: A lightweight issue tracker with markdown editing, bi-directional linking, and query syntax for advanced filtering
- **AI-Driven Workflows**: Snap photos, send text or voice, and let AI log expenses or create tasks automatically. Integrates with Apple Shortcuts for one-click capture
- **Resource Management**: Upload and attach files to tasks, expenses, or notes. Store locally or on S3-compatible storage
- **Self-Hosted**: Deploy on your own infrastructure — your data never leaves your control
- **Multi-Platform**: Access via web app, desktop app (macOS, Windows, Linux), or CLI

## Key Features

### Budget & Expenses
Track spending across multiple accounts and categories. Export your data anytime — no vendor lock-in.

### Task Management
A personal issue tracker with full markdown support, bi-directional linking between tasks and notes, and powerful query syntax for filtering.

### AI Assistant
Send images, text, or voice to the AI to quickly log expenses and create tasks. Seamlessly integrated with Apple Shortcuts for rapid capturing.

### Resource Management
Upload files via drag-and-drop, paste, or file selection. Attach resources to any task, expense, or note. Choose between local storage or remote S3.

### CLI Tool
Manage tasks and record progress directly from the terminal with the `ud` command-line tool. It doubles as an [AI agent CLI](./cli-ai-integration.md): Claude Code, Cursor, and Codex can read and write your tasks through the same commands.

### Flexible Deployment
Deploy via Docker Compose for simplicity or Kubernetes for larger setups. Supports SQLite for single-user and PostgreSQL for multi-user environments.

## Getting Started

Ready to deploy udctl? Check out our [Self-Deployment Guide](./self-deployment.md) to get started.

### Quick Links

- [Self-Deployment Guide](./self-deployment.md) - Choose your deployment method
- [Docker Compose: Local Storage + SQLite](./self-deployment.md) - Quick start guide
- [Account Management](./features/accounts.md) - Learn about user accounts
- [API Documentation](./features/accounts-api.md) - Integrate with your applications

## Requirements

To deploy udctl, you'll need:

- Docker and Docker Compose (or Kubernetes)
- Basic understanding of container deployments
