---
title: "udctl 是什么:可自托管的任务、笔记与 AI agent 工作台"
description: udctl(UnDercontrol)是私密的 AI 基础设施:探索、记录、沉淀,都在你自己的机器上。
sidebar_position: 1
---

# 欢迎使用 udctl

udctl(UnDercontrol)是私密的 AI 基础设施:你和你的 AI agent 在这里探索想法,记录任务、笔记、账目和文件,再把它们沉淀成留在你自己机器上的知识。

## 什么是 udctl？

udctl 由一位独立开发者加 AI 打造,把管理时间与金钱的工作放进同一个空间,不依赖第三方服务:

- **用户账户管理**：创建和管理具有基于角色的访问控制的用户账户
- **API 集成**：用于程序化访问的 RESTful API
- **自托管**：完全控制您的数据和部署
- **灵活的存储**：支持本地存储、S3 兼容存储等
- **多种数据库选项**：SQLite 简单易用，PostgreSQL 适用于生产环境

## 主要功能

### 账户管理
使用友好的用户界面管理用户账户、权限和访问控制。

### API 访问
通过全面的 RESTful API 将 udctl 集成到您现有的工作流程中。

### 多种部署选项
使用 Docker Compose 简化部署，或使用 Kubernetes 进行企业级部署。

### 安全优先
内置 JWT 身份验证、CORS 支持和安全配置管理。

## 快速开始

准备好部署 udctl 了吗？查看我们的 [自部署指南](./self-deployment.md) 选择适合您需求的部署方法。

### 快速链接

- [自部署指南](./self-deployment.md) - 选择您的部署方法
- [Docker Compose：本地存储 + SQLite](./self-deployment.md) - 快速入门指南
- [账户管理](./features/accounts.md) - 了解用户账户
- [API 文档](./features/accounts-api.md) - 与您的应用程序集成
- [AI Agent CLI](./cli-ai-integration.md) - 让 Claude Code、Cursor 和 Codex 在终端里读写你的任务

## 系统要求

要部署 udctl，您需要：

- Docker 和 Docker Compose（或 Kubernetes）
- 有效的许可证文件
- 对容器部署的基本了解

## 支持

需要帮助？查看我们的文档或联系 udctl 团队寻求帮助。
