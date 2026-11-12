---
title: 查询语法
description: SQL 风格查询语法的完整参考，适用于高级搜索、自定义视图、看板、CLI 和 AI 查询
sidebar_position: 6
---

# 查询语法

UnDercontrol 提供了强大的 SQL 风格查询语法，用于过滤和搜索任务。你可以手动编写查询，也可以让 AI 根据自然语言自动生成。

## 查询的使用场景

查询语法在整个应用中通用：

- **高级搜索** — 在搜索页面构建复杂的过滤条件
- **自定义视图** — 定义视图的 Root Query，筛选显示的任务
- **看板过滤** — 在看板列中过滤任务
- **保存的查询** — 保存常用查询，一键执行
- **CLI** — 在终端中使用 `ud query` 运行查询
- **AI 聊天** — 用自然语言描述需求，让 AI 生成查询

:::tip 不想手写查询？
使用任务页面的 **AI 聊天**功能 — 直接用自然语言描述你的需求，AI 会帮你生成查询语句。
:::

---

## 快速开始

以下是几个入门查询示例：

```sql
-- 查找所有待办任务
status = 'todo'

-- 查找逾期任务
deadline < 'today' AND status != 'done'

-- 按标题搜索任务
title ILIKE '%会议%'

-- 最近一周创建的任务，按最新排序
created_at >= '-7d' ORDER BY created_at DESC
```

---

## 可用字段

### 内置字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | 文本 | 任务标题 |
| `description` | 文本 | 任务描述 |
| `status` | 文本 | 任务状态：`todo`、`in-progress`、`pending`、`stale`、`done`、`archived`，或 `''`（空串 = 这张卡是文档，没有工作流状态） |
| `tags` | 数组 | 任务的标签列表 |
| `deadline` | 日期时间 | 截止日期 |
| `created_at` | 日期时间 | 创建时间 |
| `updated_at` | 日期时间 | 最后修改时间 |

### 自定义字段

自定义字段使用 `cf.` 前缀进行查询，前缀后跟自定义字段的名称（slug）。

```sql
cf.priority = 5
cf.priority > 3
cf.priority IN (1, 2, 3)
cf.department = 'engineering'
```

#### 自定义字段类型

每种自定义字段类型支持特定的运算符：

| 类型 | 说明 | 支持的运算符 |
|------|------|-------------|
| 数字（`number`） | 数值字段 | `=`、`!=`、`>`、`<`、`>=`、`<=`、`IN`、`IS NULL`、`IS NOT NULL` |
| 文本（`text`） | 文本字段 | `=`、`!=`、`LIKE`、`ILIKE`、`IN`、`IS NULL`、`IS NOT NULL` |
| 选择（`select`） | 下拉选择 | `=`、`!=`、`IN`、`IS NULL`、`IS NOT NULL` |
| 复选框（`checkbox`） | 布尔值 | `=`、`!=`、`IS NULL`、`IS NOT NULL` |
| 用户（`user`） | 用户引用 | `=`、`!=`、`IN`、`IS NULL`、`IS NOT NULL` |

:::info 自定义字段名称
自定义字段名称是你创建字段时定义的 slug。例如，如果你创建了一个名为"优先级"的字段，其 slug 可能是 `priority_level`，查询时应写作 `cf.priority_level`。
:::

---

## 运算符

### 比较运算符

#### 等于和不等于

| 运算符 | 说明 | 示例 |
|--------|------|------|
| `=` | 等于 | `status = 'todo'` |
| `!=` | 不等于 | `status != 'archived'` |

:::info `status` 永远有值 —— 空串 `''` 也是其中一个
每张卡都有 `status`。空串 `''` 是这个字段的一个合法值，含义是*这张卡是文档*（没有工作流状态）。
既然它和别的值一样，它就一样参与比较：

- 文档满足 `status = ''`；
- 文档也满足 `status != 'done'`、`status != 'archived'` 等等 —— 它确实不是 `'done'`；
- `status IN ('todo', 'in-progress')` **不**匹配文档，因为 `''` 不在列举里。

所以只想看工作流任务的视图，把这件事显式写出来：

```sql
-- 逾期任务，不含文档
deadline < 'today' AND status != 'done' AND status != ''
```

完整取值见 `ud explain task.frontmatter.status`。
:::

#### 数值和日期比较

| 运算符 | 说明 | 示例 |
|--------|------|------|
| `>` | 大于 | `deadline > 'today'` |
| `<` | 小于 | `deadline < 'today'` |
| `>=` | 大于等于 | `created_at >= '-7d'` |
| `<=` | 小于等于 | `deadline <= 'tomorrow'` |

这些运算符适用于日期时间字段、数字类型的自定义字段和标准日期值。

#### 空值检查

| 运算符 | 说明 | 示例 |
|--------|------|------|
| `IS NULL` | 字段没有设置值 | `deadline IS NULL` |
| `IS NOT NULL` | 字段已设置值 | `deadline IS NOT NULL` |

使用空值检查可以查找可选字段（如截止日期或自定义字段）为空或已填写的任务。

### 文本搜索运算符

| 运算符 | 说明 | 示例 |
|--------|------|------|
| `LIKE` | 模式匹配（区分大小写） | `title LIKE '%Bug%'` |
| `ILIKE` | 模式匹配（不区分大小写） | `title ILIKE '%bug%'` |

使用 `%` 通配符匹配任意字符序列：

| 模式 | 匹配规则 |
|------|----------|
| `'%会议%'` | 包含"会议"的任何位置 |
| `'会议%'` | 以"会议"开头 |
| `'%会议'` | 以"会议"结尾 |

:::tip
`ILIKE` 通常是更好的选择，因为它不区分大小写。只有在需要严格区分大小写时才使用 `LIKE`。
:::

### 多值运算符

#### IN

检查字段值是否在给定列表中：

```sql
status IN ('todo', 'in-progress')
cf.department IN ('engineering', 'design', 'marketing')
```

#### CONTAINS_ALL（数组字段）

检查数组字段是否包含**所有**指定值，主要用于 `tags` 字段：

```sql
-- 同时包含 'work' 和 'urgent' 标签的任务
tags CONTAINS_ALL ('work', 'urgent')
```

#### BETWEEN

检查值是否在范围内（包含边界值）：

```sql
deadline BETWEEN '2024-01-01' AND '2024-12-31'
created_at BETWEEN '-7d' AND 'today'
cf.estimate BETWEEN 5 AND 20
```

---

## 日期时间表达式

日期时间字段（`deadline`、`created_at`、`updated_at`）除了支持标准的 ISO 8601 日期格式（如 `2024-01-15`），还支持多种便捷的日期表达式。

### 命名表达式

| 表达式 | 说明 |
|--------|------|
| `today` | 今天的开始时间（零点） |
| `yesterday` | 昨天的开始时间 |
| `tomorrow` | 明天的开始时间 |
| `now` | 当前精确时间（日期 + 时间） |

### 相对表达式

相对表达式允许你指定相对于当前时间的时间点。使用 `-` 表示过去，`+` 表示未来：

| 格式 | 说明 | 示例 |
|------|------|------|
| `-Nd` 或 `-Ndays` | N 天前 | `-7d` = 7 天前 |
| `+Nd` 或 `+Ndays` | N 天后 | `+3d` = 3 天后 |
| `-Nw` 或 `-Nweeks` | N 周前 | `-2w` = 2 周前 |
| `+Nw` 或 `+Nweeks` | N 周后 | `+1w` = 1 周后 |
| `-Nm` 或 `-Nmonths` | N 月前 | `-1m` = 1 个月前 |
| `+Nm` 或 `+Nmonths` | N 月后 | `+3m` = 3 个月后 |
| `-Ny` 或 `-Nyears` | N 年前 | `-1y` = 1 年前 |

### 日期时间示例

```sql
-- 截止日期在今天或之前
deadline <= 'today'

-- 最近 7 天创建的任务
created_at >= '-7d'

-- 本周更新的任务
updated_at >= '-1w' AND updated_at <= 'today'

-- 未来一周内到期的任务
deadline BETWEEN 'today' AND '+7d'

-- 未来一个月内到期的任务
deadline BETWEEN 'today' AND '+1m'

-- 在特定年份创建的任务
created_at BETWEEN '2024-01-01' AND '2024-12-31'
```

:::info 标准日期格式
你也可以使用标准的 ISO 8601 日期格式，如 `2024-01-15` 或 `2024-01-15T14:30:00Z`。当你需要查询特定的固定日期而非相对日期时，这些格式非常有用。
:::

---

## 逻辑运算符

### AND 和 OR

使用 `AND` 和 `OR` 组合多个条件：

```sql
-- 两个条件都必须为真
status = 'todo' AND deadline <= 'today'

-- 任一条件为真即可
status = 'done' OR status = 'archived'
```

### 运算符优先级

`AND` 的优先级**高于** `OR`，即 `AND` 条件会先被计算。

以下查询：

```sql
status = 'todo' OR pinned = 'true' AND deadline <= 'today'
```

等同于：

```sql
status = 'todo' OR (pinned = 'true' AND deadline <= 'today')
```

### 使用括号

使用括号明确控制计算顺序：

```sql
-- 待办或进行中的任务，并且今天到期
(status = 'todo' OR status = 'in-progress') AND deadline <= 'today'

-- 今天到期或标记为紧急的任务，并且未完成
(deadline <= 'today' OR tags = 'urgent') AND status != 'done'

-- 嵌套分组
(status = 'todo' AND deadline <= 'today') OR (status = 'in-progress' AND tags = 'urgent')
```

:::tip
在同一查询中混合使用 `AND` 和 `OR` 时，建议始终使用括号来明确你的意图 — 即使在不严格需要的情况下也是如此。这会让查询更易读，也能避免因优先级规则产生意外结果。
:::

---

## ORDER BY 排序

使用 `ORDER BY` 子句对查询结果进行排序，它始终放在查询的末尾。

```sql
-- 按创建时间倒序排列所有结果
ORDER BY created_at DESC

-- 过滤并排序
status = 'todo' ORDER BY created_at DESC

-- 逾期任务按截止日期排序（最早的在前）
deadline < 'today' AND status != 'done' ORDER BY deadline ASC
```

### 可排序字段

| 字段 | 说明 |
|------|------|
| `created_at` | 按创建时间排序 |
| `updated_at` | 按最后更新时间排序 |
| `deadline` | 按截止日期排序 |
| `title` | 按标题字母顺序排序 |

### 排序方向

| 方向 | 说明 |
|------|------|
| `ASC` | 升序 — 从小到大、从早到晚、A 到 Z |
| `DESC` | 降序 — 从大到小、从晚到早、Z 到 A |

如果不指定方向，默认为 `DESC`（降序）。

---

## 保存的查询

保存的查询功能让你可以存储常用查询，实现一键快速访问。无需每次都重新输入相同的查询，你可以为其命名并保存。

### 功能特点

- **创建** — 为任何查询保存一个描述性名称
- **执行** — 运行保存的查询，直接查看匹配的任务
- **编辑** — 更新保存查询的名称或查询语句
- **置顶** — 将重要的查询固定到列表顶部，快速访问
- **排序** — 拖拽调整保存查询的顺序
- **删除** — 移除不再需要的查询

### 使用方法

1. 从侧边栏导航到**保存的查询**页面
2. 点击**新建查询**创建一个保存的查询
3. 输入名称（如"我的逾期任务"）和查询语句
4. 点击保存的查询即可展开查看匹配结果
5. 置顶常用查询，保持它们在列表顶部

### 保存查询示例

| 名称 | 查询语句 |
|------|----------|
| 逾期任务 | `deadline < 'today' AND status != 'done' AND status != 'archived'` |
| 本周到期 | `deadline BETWEEN 'today' AND '+7d' AND status != 'done'` |
| 近期活跃 | `updated_at >= '-7d' AND status IN ('todo', 'in-progress')` |
| 紧急事项 | `(deadline <= 'today' OR tags = 'urgent') AND status != 'done'` |
| 未规划任务 | `deadline IS NULL AND status = 'todo'` |

---

## 在 CLI 中使用查询

UnDercontrol CLI 支持直接在终端运行查询。这对于脚本编写、自动化和快速查找非常有用，无需离开终端工作流。

### `ud query`

使用上述文档中的结构化查询语法运行查询：

```bash
ud query "<查询语句>" [选项]
```

**选项：**
- `--page` — 页码（默认：1）
- `--limit` — 每页条数（默认：50）
- `--sort` — 排序字段（`title`、`deadline`、`created_at`、`updated_at`）
- `--order` — 排序方向（`asc`、`desc`）

**示例：**

```bash
# 查找所有待办任务
ud query "status = 'todo'"

# 按标题搜索
ud query "title ILIKE '%api%'"

# 本周到期的任务
ud query "deadline BETWEEN 'today' AND '+7d'"

# 带标签的任务
ud query "tags = 'urgent'"

# 复杂查询并排序
ud query "(status = 'todo' OR status = 'in-progress') AND deadline <= 'today'" --sort deadline --order asc

# 分页查询
ud query "status != 'archived'" --page 2 --limit 20
```

完整的 CLI 文档请参阅 [CLI 参考](./cli.md)。

---

## AI 驱动的查询

UnDercontrol 集成了 AI 功能，让查询更加便捷。你无需学习查询语法，直接用自然语言描述需求即可。

### 在 Web 界面中

1. 打开任务页面
2. 打开 **AI 聊天**面板
3. 用自然语言输入你的请求，例如：
   - "显示所有逾期的任务"
   - "查找标记为 work 标签且本周到期的任务"
   - "今天更新了哪些任务？"
4. AI 会生成并执行结构化查询

### 在 CLI 中

使用 `ud query` 命令运行查询：

```bash
ud query "deadline BETWEEN 'today' AND '+7d' AND status != 'done'"
```

在 Web 界面中，AI 聊天功能可以帮你将自然语言描述转换为结构化查询语法并返回匹配的任务。

---

## 实用示例

### 按状态筛选

```sql
-- 所有待办任务
status = 'todo'

-- 进行中的任务
status = 'in-progress'

-- 已完成的任务
status = 'done'

-- 所有未完成的任务（待办或进行中）
status IN ('todo', 'in-progress')

-- 非归档任务
status != 'archived'
```

### 按截止日期筛选

```sql
-- 今日到期或已逾期的未完成任务
deadline <= 'today' AND status != 'done' AND status != 'archived'

-- 逾期任务
deadline < 'today' AND status != 'done' AND status != 'archived'

-- 本周到期
deadline BETWEEN 'today' AND '+7d' AND status != 'done'

-- 本月到期
deadline BETWEEN 'today' AND '+30d' AND status != 'done'

-- 未设置截止日期
deadline IS NULL

-- 已设置截止日期
deadline IS NOT NULL

-- 没有截止日期的待办任务
deadline IS NULL AND status = 'todo'
```

### 按时间筛选

```sql
-- 最近 7 天创建的
created_at >= '-7d'

-- 最近 7 天更新的
updated_at >= '-7d'

-- 本月创建的
created_at >= '-30d'

-- 今天更新的
updated_at >= 'today'

-- 在特定日期范围内创建的
created_at BETWEEN '2024-06-01' AND '2024-06-30'
```

### 按标签筛选

```sql
-- 包含特定标签的任务
tags = 'work'

-- 包含任一标签的任务
tags IN ('work', 'personal')

-- 包含所有指定标签的任务
tags CONTAINS_ALL ('work', 'urgent')
```

有两个标签含义固定:`awaiting-decision`(等你拍板)和 `follow-up`(需要有人去追)。系统自带的 All Tasks 看板最左两列 Awaiting Decision 与 Follow-up 就按它们取卡，只列未完成的任务:

```sql
-- Awaiting Decision 列
tags = 'awaiting-decision' AND status != 'done' AND status != 'archived' ORDER BY updated_at DESC

-- Follow-up 列，截止时间最早的在前
tags = 'follow-up' AND status != 'done' AND status != 'archived' ORDER BY deadline ASC
```

命令行读取:`ud get task --board __system_all_tasks__ --column Follow-up`。

### 文本搜索

```sql
-- 标题包含关键词（不区分大小写）
title ILIKE '%会议%'

-- 描述包含关键词
description ILIKE '%重要%'

-- 标题以特定词开头
title ILIKE 'bug%'

-- 区分大小写的标题搜索
title LIKE '%API%'
```

### 自定义字段

```sql
-- 数字自定义字段比较
cf.priority > 5
cf.estimate >= 10
cf.priority BETWEEN 1 AND 3

-- 文本/选择自定义字段
cf.department = 'engineering'
cf.department IN ('design', 'marketing')

-- 复选框自定义字段
cf.reviewed = 'true'

-- 自定义字段的空值检查
cf.priority IS NULL                           -- 尚未设置优先级
cf.priority IS NOT NULL AND cf.priority <= 3  -- 低优先级任务
```

### 组合查询

```sql
-- 紧急待办：今日到期或标记为紧急，且未完成
(deadline <= 'today' OR tags = 'urgent') AND status != 'done' AND status != 'archived'

-- 工作进行中：带 work 标签的进行中任务
tags = 'work' AND status = 'in-progress'

-- 近期活跃：最近 7 天更新的未完成任务
updated_at >= '-7d' AND status IN ('todo', 'in-progress')

-- 需要关注：逾期或本周到期的待办任务
(deadline < 'today' OR deadline BETWEEN 'today' AND '+7d') AND status = 'todo'

-- 高优先级工程任务
cf.priority > 5 AND cf.department = 'engineering' AND status != 'done'

-- 未规划的紧急任务
deadline IS NULL AND tags = 'urgent' AND status = 'todo'
```

### 带排序的查询

```sql
-- 待办任务，最新的在前
status = 'todo' ORDER BY created_at DESC

-- 逾期任务，最早的截止日期在前
deadline < 'today' AND status != 'done' ORDER BY deadline ASC

-- 最近更新的任务
status != 'archived' ORDER BY updated_at DESC

-- 高优先级按更新时间排序
cf.priority > 5 ORDER BY updated_at DESC

-- 所有任务按标题字母排序
ORDER BY title ASC
```

---

## 提示与注意事项

1. **字符串值需要引号** — 所有字符串值必须用单引号（`'todo'`）或双引号（`"todo"`）包围。数字不需要引号。

2. **字段名区分大小写** — 始终使用小写字段名：`status`、`deadline`、`created_at` 等。

3. **有效的状态值** — 内置的状态值为：`todo`、`in-progress`、`pending`、`stale`、`done`、`archived`，以及空串 `''` —— 空串表示这张卡是**文档**（没有工作流状态）。查文档用 `status = ''`。注意：文档也满足 `status != 'x'`（对任意 `x`），所以只想要任务时要显式排除：`status != 'done' AND status != ''`。

4. **数组字段行为** — `tags` 字段是数组类型。使用 `=` 检查是否包含某个标签，使用 `IN` 检查是否包含任一标签，使用 `CONTAINS_ALL` 要求包含所有指定标签。

5. **自定义字段前缀** — 查询自定义字段时必须使用 `cf.` 前缀：`cf.priority = 5`，而不是 `priority = 5`。

6. **ORDER BY 位置** — `ORDER BY` 子句必须始终放在查询的最后部分，所有过滤条件都应在其之前。

7. **默认排序方向** — 如果省略 `ASC` 或 `DESC`，默认排序方向为 `DESC`（降序）。

8. **日期格式** — 查询引擎支持 ISO 8601 日期（`2024-01-15`）、命名表达式（`today`、`tomorrow`）和相对表达式（`-7d`、`+1m`）。相对表达式需要加引号：`'-7d'`，而非 `-7d`。

9. **可排序字段** — `ORDER BY` 仅支持以下字段：`created_at`、`updated_at`、`deadline`、`title`。其他字段不能用于排序。

10. **空查询** — 你可以单独使用 `ORDER BY` 而不加任何过滤条件来排序所有任务：`ORDER BY deadline ASC`。
