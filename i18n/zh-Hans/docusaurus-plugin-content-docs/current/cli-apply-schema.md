---
title: CLI Apply 与资源 Schema
description: 使用 ud apply 声明式管理资源 — 类 k8s schema，支持任务、笔记、看板、预算、账户、支出和收入
sidebar_position: 7
---

# CLI Apply 与资源 Schema

`ud apply -f` 命令让你可以通过文件声明式地创建和更新资源——类似 `kubectl apply`。文件即真相来源：首次 apply 创建，带 ID 再次 apply 则更新。

```bash
# 创建或更新任务
ud apply -f task.md
# 创建或更新笔记（自动识别）
ud apply -f note.md
# 创建或更新看板
ud apply -f board.yaml
# 从一个文件 apply 多个资源
ud apply -f resources.yaml
# 从标准输入读取
cat spec.yaml | ud apply -f -
```

---

## 两种文件格式

| 扩展名 | 资源类型 | 结构 |
|--------|---------|------|
| `.md` | 任务、笔记 | YAML frontmatter + markdown 正文 |
| `.yaml` / `.yml` | 看板、预算、账户、支出、收入 | 类 k8s `apiVersion/kind/metadata/spec` |

格式由文件扩展名决定。对于标准输入（`-f -`），自动检测格式：以 `apiVersion:` 开头的解析为 YAML，否则解析为 markdown。

---

## Markdown 资源（`.md`）

Markdown 文件使用 `---` 分隔符之间的 YAML frontmatter，后跟 markdown 正文。

### 任务

frontmatter 中没有 `task_id` 的 `.md` 文件是**任务**。

```markdown
---
title: 发布 v1 版本
status: in-progress
tags:
  - release
  - urgent
kickoff: 2025-05-01
deadline: 2025-06-01
board: abc123
---

v1 发布前的最终清单：

- [ ] 运行完整测试套件
- [ ] 更新变更日志
- [ ] 打标签
- [ ] 部署到生产环境
```

**字段：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `id` | string | 否 | 任务 UUID 或前缀。有 = 更新，无 = 创建。 |
| `title` | string | 否 | 未指定时从正文首行或文件名推导。 |
| `status` | string | 否 | `todo`（默认）、`in-progress`、`pending`、`stale`、`done`、`archived`，或 `""` —— 空串表示*没有工作流状态*：这张卡是**文档**（标题旁不显示状态控件，也不落入任何默认看板列）。不写这个字段则沿用默认：新建为 `todo`，更新时保持原值。 |
| `tags` | array | 否 | 标签列表。 |
| `kickoff` | string | 否 | 开始日期（`YYYY-MM-DD` 或 ISO 8601）。 |
| `deadline` | string | 否 | 截止日期（`YYYY-MM-DD` 或 ISO 8601）。 |
| `board` | string | 否 | 看板 ID 或前缀——直接在该看板中创建任务。 |
| *（正文）* | string | 否 | 成为任务描述。 |

### 笔记

frontmatter 中有 `task_id` 的 `.md` 文件是**笔记**——无需子命令。

```markdown
---
task_id: a1b2c3d4
---

## 进度更新

- 完成 API 集成
- 下一步：对接前端
```

**字段：**

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `task_id` | string | **是** | 父任务 UUID 或前缀。 |
| `note_id` | string | 否 | 笔记 UUID 或前缀。有 = 更新，无 = 创建。 |
| *（正文）* | string | 否 | Markdown 格式的笔记内容。 |

:::tip 自动识别
不再需要 `ud apply note -f`。直接 `ud apply -f note.md` 会通过检测 frontmatter 中的 `task_id` 自动识别笔记格式。`ud apply note` 子命令仍作为向后兼容的别名保留。
:::

---

## YAML 资源（`.yaml` / `.yml`）

YAML 文件使用**类 k8s 信封**，包含四个顶层字段：

```yaml
apiVersion: ud/v1
kind: Board
metadata:
  id: abc12345          # 有 = 更新，无 = 创建
  tags: [work, sprint]
spec:
  name: Sprint Board
  # 类型特定字段...
```

| 字段 | 必填 | 描述 |
|------|------|------|
| `apiVersion` | **是** | 始终为 `ud/v1`。 |
| `kind` | **是** | 资源类型：`Board`、`Budget`、`Account`、`Expense`、`Income`。 |
| `metadata` | 否 | 通用字段：`id`（用于更新）、`tags`。 |
| `spec` | **是** | 类型特定字段（见下文）。 |

### 看板（Board）

```yaml
apiVersion: ud/v1
kind: Board
spec:
  name: Sprint Board
  board_type: private
  default_tags: [sprint-1]
  columns:
    - name: 待办
      query: "status:todo"
    - name: 进行中
      query: "status:in-progress"
    - name: 审核
      query: "status:pending"
    - name: 已完成
      query: "status:done"
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `name` | string | **是** | 看板名称。 |
| `board_type` | string | 否 | `private`（默认）或 `shared`。 |
| `columns` | array | 否 | 有序列定义列表。 |
| `columns[].name` | string | 是 | 列显示名称。 |
| `columns[].query` | string | 否 | 过滤查询（如 `status:todo`）。 |
| `default_tags` | array | 否 | 在此看板中创建新任务时自动添加的标签。 |

### 预算（Budget）

```yaml
apiVersion: ud/v1
kind: Budget
metadata:
  tags: [food]
spec:
  name: 日用品
  amount:
    amount: 500.00
    currency: USD
  starts_at: "2025-01-01"
  plans:
    - amount:
        amount: 500.00
        currency: USD
      frequency: monthly
      effective_from: "2025-01-01"
      reason: 初始月度预算
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `name` | string | **是** | 预算名称。 |
| `amount` | money | **是** | 初始预算金额。 |
| `starts_at` | string | 否 | 预算开始日期（`YYYY-MM-DD`）。 |
| `plans` | array | 否 | 周期性预算计划。 |
| `plans[].amount` | money | 是 | 每期金额。 |
| `plans[].frequency` | string | 是 | `daily`、`weekly`、`biweekly`、`monthly`、`quarterly`、`yearly`。 |
| `plans[].effective_from` | string | 是 | 计划开始日期。 |
| `plans[].effective_to` | string | 否 | 计划结束日期（省略表示无限期）。 |
| `plans[].reason` | string | 否 | 创建此计划的原因。 |

### 账户（Account）

```yaml
apiVersion: ud/v1
kind: Account
metadata:
  tags: [bank]
spec:
  name: 活期存款
  balance:
    amount: 5000.00
    currency: USD
  off_budget: false
  notes: 主要活期账户
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `name` | string | **是** | 账户名称。 |
| `balance` | money | **是** | 当前余额。 |
| `off_budget` | boolean | 否 | 排除在预算计算之外（默认：`false`）。 |
| `notes` | string | 否 | 备注。 |

### 支出（Expense）

```yaml
apiVersion: ud/v1
kind: Expense
metadata:
  tags: [food, lunch]
spec:
  title: 团队午餐
  amount:
    amount: 85.50
    currency: USD
  budget_id: abc123
  account_id: def456
  occurred_at: "2025-03-15"
  description: 每月团队聚餐
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `title` | string | 否 | 支出标题。 |
| `amount` | money | **是** | 支出金额。 |
| `description` | string | 否 | 详细描述。 |
| `budget_id` | string | 否 | 预算 UUID 或前缀。 |
| `account_id` | string | 否 | 账户 UUID 或前缀（从哪个账户支付）。 |
| `occurred_at` | string | 否 | 支出发生时间（`YYYY-MM-DD`）。 |

### 收入（Income）

```yaml
apiVersion: ud/v1
kind: Income
metadata:
  tags: [salary]
spec:
  title: 三月工资
  amount:
    amount: 5000.00
    currency: USD
  source: salary
  account_id: abc123
  occurred_at: "2025-03-31"
```

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `title` | string | **是** | 收入标题。 |
| `amount` | money | **是** | 收入金额。 |
| `description` | string | 否 | 详细描述。 |
| `source` | string | 否 | `salary`、`freelance`、`investment`、`gift`、`other`。 |
| `account_id` | string | 否 | 账户 UUID 或前缀（存入哪个账户）。 |
| `occurred_at` | string | 否 | 收到时间（`YYYY-MM-DD`）。 |

### Money 类型

所有财务资源使用 money 对象：

```yaml
amount:
  amount: 42.50      # 主要货币单位的小数值
  currency: USD      # ISO 4217 货币代码（省略则默认 USD）
```

---

## 多文档 YAML

单个 `.yaml` 文件可以包含多个资源，用 `---` 分隔：

```yaml
apiVersion: ud/v1
kind: Account
spec:
  name: 活期存款
  balance:
    amount: 5000.00
    currency: USD
---
apiVersion: ud/v1
kind: Account
spec:
  name: 储蓄账户
  balance:
    amount: 20000.00
    currency: USD
  off_budget: true
---
apiVersion: ud/v1
kind: Budget
metadata:
  tags: [rent]
spec:
  name: 房租
  amount:
    amount: 2000.00
    currency: USD
  starts_at: "2025-01-01"
  plans:
    - amount:
        amount: 2000.00
        currency: USD
      frequency: monthly
      effective_from: "2025-01-01"
```

资源按顺序 apply。某个文档出错不会阻止后续文档的处理。

---

## 创建与更新

所有资源遵循相同的声明式规则：

| 条件 | 操作 |
|------|------|
| frontmatter/metadata 中无 `id` | **创建**新资源 |
| 有 `id` | **更新**已有资源 |

ID 可以是完整的 UUID 或唯一前缀（通常前 8 个字符就够了）：

```yaml
# 更新 — 使用前缀
metadata:
  id: a1b2c3d4
```

---

## 支持的资源

运行 `ud api-resources` 查看所有资源类型及其可用操作：

```
NAME       SHORTNAMES   VERBS
task       tasks,t      get,describe,apply,delete,annotate
note       -            get,apply,delete
board      boards       get,describe,apply,query
budget     budgets,b    get,describe,apply
expense    expenses,e   get,describe,apply
account    accounts,a   get,describe,apply
income     incomes,i    get,describe,apply
resource   -            upload
column     columns      get
```

---

## Schema 定义

所有资源类型的正式 JSON Schema 定义发布在：

**https://github.com/oatnil-top/ud-schemas**

| Schema | 格式 | 资源 |
|--------|------|------|
| `task.v1.schema.json` | Markdown | 任务文件 |
| `note.v1.schema.json` | Markdown | 笔记文件 |
| `resource.v1.schema.json` | YAML | 通用信封（共享定义） |
| `board.v1.schema.json` | YAML | 看板资源 |
| `budget.v1.schema.json` | YAML | 预算资源 |
| `account.v1.schema.json` | YAML | 账户资源 |
| `expense.v1.schema.json` | YAML | 支出资源 |
| `income.v1.schema.json` | YAML | 收入资源 |

---

## 使用示例

### 从零开始搭建项目

```bash
# 创建账户
cat <<'EOF' | ud apply -f -
apiVersion: ud/v1
kind: Account
spec:
  name: 活期存款
  balance:
    amount: 10000.00
    currency: USD
EOF

# 创建预算
ud apply -f monthly-budgets.yaml

# 创建 Sprint 看板
ud apply -f sprint-board.yaml

# 创建任务
cat <<'EOF' | ud apply -f -
---
title: 搭建 CI/CD 流水线
status: todo
tags:
  - infra
  - sprint-1
board: Sprint
---
配置 GitHub Actions 实现构建、测试和部署。
EOF
```

### AI 代理工作流

AI 代理（Claude Code、Cursor）可以使用 `ud apply -f -` 以编程方式创建和更新资源：

```bash
# 代理创建任务
cat <<'EOF' | ud apply -f -
---
title: 实现用户认证
status: in-progress
---
基于 JWT 的认证，支持 refresh token。
EOF

# 代理添加笔记
cat <<'EOF' | ud apply -f -
---
task_id: abc123
---
## 进度
- 添加登录接口 — commit a1b2c3d4
- 下一步：refresh token 轮换
EOF

# 代理记录支出
cat <<'EOF' | ud apply -f -
apiVersion: ud/v1
kind: Expense
spec:
  title: API 服务器 - 3月
  amount:
    amount: 29.99
    currency: USD
  budget_id: infra
  occurred_at: "2025-03-31"
EOF
```
