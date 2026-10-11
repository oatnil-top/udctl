---
title: CLI 多账户认证
description: 使用 kubectl 风格的上下文管理多个账户和 API 端点
sidebar_position: 5
---

# CLI 多账户认证

UnDercontrol CLI 支持使用 kubectl 风格的上下文系统管理多个账户和 API 端点。这让你可以轻松切换不同的服务器、账户或环境。

## 概述

一个 **上下文（Context）** 是一个命名配置，包含：
- API URL（服务器端点）
- 认证令牌或 API 密钥
- 用户名（用于显示）

你可以拥有多个上下文（如 `personal`、`work`、`staging`）并即时切换。

## 配置文件

上下文存储在 `~/.config/ud/config.yaml`：

```yaml
current-context: personal
contexts:
- name: personal
  context:
    api_url: https://ud.example.com
    token: eyJhbGciOi...
    user: john@example.com
- name: work
  context:
    api_url: https://ud.company.com
    token: eyJhbGciOi...
    user: john@company.com
- name: staging
  context:
    api_url: http://localhost:4000
    api_key: ak_test_xxx
```

## 命令

### 列出所有上下文

```bash
ud config get-contexts
```

输出：
```
CURRENT  NAME      API URL                      USER
*        personal  https://ud.example.com john@example.com
         work      https://ud.company.com       john@company.com
         staging   http://localhost:4000        (api-key)
```

`*` 表示当前激活的上下文。

### 切换上下文

```bash
ud config use-context work
```

输出：
```
Switched to context "work".
```

### 显示当前上下文

```bash
ud config current-context
```

输出：
```
work
```

### 创建或更新上下文

```bash
# 创建新上下文
ud config set-context staging --api-url http://localhost:4000

# 使用 API 密钥创建（用于 CI/CD）
ud config set-context ci --api-url https://api.example.com --api-key ak_xxx

# 更新现有上下文
ud config set-context work --api-url https://new-api.company.com
```

### 删除上下文

```bash
ud config delete-context staging
```

### 重命名上下文

```bash
ud config rename-context work production
```

### 查看完整配置

```bash
ud config view
```

输出（令牌会部分遮蔽）：
```
current-context: personal
contexts:
- name: personal
  context:
    api_url: https://ud.example.com
    user: john@example.com
    token: eyJhbGciOi...xyz
- name: work
  context:
    api_url: https://ud.company.com
    user: john@company.com
    token: eyJhbGciOi...abc
```

## 登录时指定上下文

登录时，你可以指定将凭据保存到哪个上下文：

```bash
# 登录并保存到新上下文
ud login --context work --api-url https://ud.company.com

# 登录到现有上下文（更新凭据）
ud login --context personal
```

## 使用 `--context` 临时切换上下文

`--context` 全局参数让你可以在不切换默认上下文的情况下，临时使用其他上下文执行命令：

```bash
# 列出工作上下文的任务（不改变默认上下文）
ud --context work get task

# 查看 staging 上下文中的任务
ud --context staging describe task abc123

# 在不同账户中创建任务
ud --context personal task create "买菜"

# 使用指定上下文启动 TUI
ud --context work
```

这是 **临时覆盖** — 不会修改配置文件中的 `current-context`。命令执行完成后，你的默认上下文保持不变。

:::tip
`--context` 参数是对其他上下文执行单次命令的推荐方式。只有需要永久切换时才使用 `ud config use-context`。
:::

### 优先级顺序

CLI 按以下顺序（从高到低）确定使用哪个上下文：

1. `--context` 命令行参数
2. `UD_CONTEXT` 环境变量
3. 配置文件中的 `current-context`

## 环境变量覆盖

你也可以使用环境变量覆盖上下文设置：

| 变量 | 说明 |
|------|------|
| `UD_CONTEXT` | 覆盖当前上下文 |
| `UD_API_URL` | 覆盖 API URL |
| `UD_API_KEY` | 覆盖 API 密钥 |
| `UD_TOKEN` | 覆盖认证令牌 |

示例：
```bash
# 单次命令使用不同上下文
UD_CONTEXT=staging ud task list

# 临时覆盖 API URL
UD_API_URL=http://localhost:4000 ud task list
```

## 常用工作流

### 个人 + 工作 配置

```bash
# 设置个人账户
ud login --context personal --api-url https://ud.example.com

# 设置工作账户
ud login --context work --api-url https://ud.company.com

# 使用 --context 参数执行单次命令（推荐）
ud --context personal get task  # 列出个人任务
ud --context work get task      # 列出工作任务

# 或永久切换默认上下文
ud config use-context personal
ud get task  # 列出个人任务
```

### 开发 + 生产 环境

```bash
# 本地开发
ud config set-context dev --api-url http://localhost:4000
ud login --context dev

# 生产环境
ud login --context prod --api-url https://ud.example.com

# 快速切换
ud config use-context dev
ud config use-context prod
```

### CI/CD 使用 API 密钥

```bash
# 使用 API 密钥创建上下文（无需交互式登录）
ud config set-context ci \
  --api-url https://ud.example.com \
  --api-key ak_your_api_key

# 在 CI/CD 脚本中使用
ud config use-context ci
ud task create "部署完成" -d "版本 1.2.3"
```

或使用环境变量：
```bash
export UD_API_URL=https://ud.example.com
export UD_API_KEY=ak_your_api_key
ud task list
```

## 从单上下文迁移

如果你有使用旧格式单上下文的配置文件：

```yaml
# 旧格式
api_url: https://ud.example.com
token: eyJhbGciOi...
```

CLI 会自动迁移到新格式：

```yaml
# 新格式（自动迁移）
current-context: default
contexts:
- name: default
  context:
    api_url: https://ud.example.com
    token: eyJhbGciOi...
```

无需手动操作 - 首次使用时自动迁移。

## 故障排除

### 找不到上下文

```
Error: context "work" not found
```

**解决方案**：先创建上下文 `ud config set-context work --api-url <url>` 或 `ud login --context work`。

### 未登录

```
Error: not logged in. Run 'ud login' first or set UD_API_KEY environment variable
```

**解决方案**：当前上下文没有认证信息。运行 `ud login` 或设置 `UD_API_KEY`。

### 上下文错误

如果命令请求到了错误的服务器，检查当前上下文：

```bash
ud config current-context
ud config get-contexts
```

使用 `ud config use-context <name>` 切换到正确的上下文。
