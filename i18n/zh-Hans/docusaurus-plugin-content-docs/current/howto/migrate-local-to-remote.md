---
title: 从本地迁移数据到远程服务器
sidebar_position: 2
---

# 从本地迁移数据到远程服务器

了解如何将本地 UnDercontrol 桌面端（Personal 版，SQLite 数据库）的数据迁移到远程服务器，实现多设备同步和访问。

## 前提条件

- 已有数据的 UnDercontrol 桌面端应用
- 已部署并可访问的远程 UnDercontrol 服务器（参见 [Docker Compose 部署](/docs/self-deployment)）
- 本机已安装 `ud` CLI（[CLI 文档](/docs/cli)）
- 在本地和远程服务器上都已注册账号

## 概述

使用 Personal 版 UnDercontrol 桌面端时，数据存储在本地 SQLite 数据库中。如果你想从多个设备（如笔记本电脑和手机）访问数据，需要将数据迁移到远程服务器。

`ud migrate` 命令从一个服务器（源）获取数据，并在另一个服务器（目标）上创建，自动处理跨引用的 ID 映射（如费用关联预算）。

## 步骤

### 步骤 1：安装 CLI

检查是否已安装 `ud` CLI：

```bash
ud --version
```

如果未安装，可以通过以下方式安装：

- **桌面端应用**：打开 **设置 → 账号**，在 CLI 配置区域点击 **安装** 按钮
- **其他安装方式**：参见 [CLI 下载页面](https://udctl.com/download#cli)

完整 CLI 文档请参见 [CLI 命令行工具](/docs/cli) 页面。

### 步骤 2：设置上下文

CLI 使用「上下文」管理不同服务器的连接。你需要设置两个上下文：一个用于本地实例，一个用于远程服务器。

**登录本地实例：**

```bash
ud login --name local --api-url http://localhost:4000
```

**登录远程服务器：**

```bash
ud login --name remote --api-url https://your-server.example.com
```

验证两个上下文已配置：

```bash
ud config get-contexts
```

你应该能看到 `local` 和 `remote` 两个上下文。

### 步骤 3：执行预演

在正式迁移之前，先执行预演查看将要迁移的内容（不会写入任何数据）：

```bash
ud migrate --from local --to remote --dry-run
```

这会显示将要迁移的实体数量：

```
Migration dry run (no data will be written)
  accounts        fetched=3 created=3
  budgets         fetched=5 created=5
  expenses        fetched=120 created=120
  incomes         fetched=45 created=45
  tasks           fetched=200 created=200
  boards          fetched=2 created=2
  saved-queries   fetched=5 created=5
  task-views      fetched=3 created=3
```

### 步骤 4：执行迁移

确认预演结果后，执行正式迁移：

```bash
ud migrate --from local --to remote
```

命令会按依赖顺序迁移实体：

1. **账户**和**预算**（无依赖）
2. **费用**和**收入**（引用账户/预算）
3. **任务**及其备注和链接
4. **看板**、**保存的查询**和**任务视图**

跨引用（如费用关联的预算）会自动使用目标服务器的新 ID 进行映射。

### 步骤 5：验证迁移结果

通过浏览器登录远程服务器，验证数据是否完整。检查一些任务、费用和预算，确保一切正常。

## 进阶：用户映射

如果本地和远程账户使用不同的用户 ID（例如使用不同邮箱注册），可以提供用户映射文件：

**创建 `user-map.yaml` 文件：**

```yaml
users:
  "本地用户UUID": "远程用户UUID"
```

**使用用户映射执行迁移：**

```bash
ud migrate --from local --to remote --user-map user-map.yaml
```

要查找用户 ID，请在各实例的个人设置页面查看。

## 进阶：选择性迁移

你可以只迁移特定类型的实体：

```bash
# 只迁移任务和费用
ud migrate --from local --to remote --entities tasks,expenses

# 只迁移财务数据
ud migrate --from local --to remote --entities accounts,budgets,expenses,incomes
```

可用实体类型：`accounts`、`budgets`、`expenses`、`incomes`、`tasks`、`boards`、`saved-queries`、`task-views`

## 使用技巧

- 始终先执行 `--dry-run` 预览将要迁移的内容
- 迁移会在目标服务器创建新数据，不会删除源服务器的任何内容
- 如果迁移中断，可以安全地重新运行（不同实体类型的重复检测可能有所不同）
- 迁移完成后，可以将桌面端应用指向远程服务器以继续使用

## 相关文档

- [CLI 命令行工具](/docs/cli)
- [Docker Compose 部署](/docs/self-deployment)
