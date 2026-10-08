---
title: 高级用户查询与已保存筛选器——UnDercontrol 进阶指南
description: 学习如何使用 UnDercontrol 的类 SQL 查询语法、自然语言搜索和已保存查询，像高级用户一样精准筛选任务。
authors: [lintao]
tags: [feature]
date: 2026-04-05
---

当 UnDercontrol 里的任务积累到一定数量，"滚动浏览"这种方式就会开始失效。你清楚地知道自己在找什么——已逾期的项目、所有标记了 `work` 且仍在进行中的任务、还没有截止日期的待办——但仅靠状态筛选，很难快速定位到它们。

本文介绍 UnDercontrol 内置的查询系统：一套类 SQL 语法，可在 Web 界面、CLI、自定义视图、看板以及已保存查询中统一使用。一旦上手，你会发现自己几乎每天都在用它。

## 查询语法

这套语法在设计上与 SQL WHERE 子句非常接近。如果你写过数据库查询，会立刻感到熟悉；如果没有，基础部分大约五分钟就能掌握。

一个简单的查询如下：

```sql
status = 'todo' AND deadline <= 'today'
```

这会找出所有状态为待办、且截止日期在今天或更早的任务——也就是已逾期的待办项。

你可以在此基础上加入标签、文本搜索、日期范围和自定义字段：

```sql
(deadline <= 'today' OR tags = 'urgent') AND status != 'done' AND status != 'archived'
```

这是一个可靠的"当前需要处理"查询。将它保存为已保存查询（下文详述），就有了一个一键直达的紧急任务列表。

![Task search with query syntax filtering](https://dl.udctl.com/features/blog/query-syntax/task-query.png)

## 日期时间表达式

语法中较为实用的一部分是相对日期支持。你不需要写死具体日期，而是使用 `'-7d'`、`'+1w'` 或直接写 `'today'` 这样的表达式。

```sql
-- 过去一周内创建的任务
created_at >= '-7d'

-- 未来一个月内到期
deadline BETWEEN 'today' AND '+1m'

-- 今天有更新
updated_at >= 'today'
```

支持的时间单位包括天（`d`）、周（`w`）、月（`m`）和年（`y`），`+` 表示未来，`-` 表示过去。当你需要固定日期时，`2025-06-01` 这样的标准 ISO 8601 格式同样适用。

## 文本搜索与自定义字段

文本搜索使用 `LIKE`（区分大小写）和 `ILIKE`（不区分大小写），以 `%` 作为通配符：

```sql
title ILIKE '%api%'
```

自定义字段需加上 `cf.` 前缀：

```sql
cf.priority > 3 AND cf.department = 'engineering'
```

自定义字段根据其类型支持完整的比较运算符——数字、文本、下拉选项、复选框和用户引用均可使用。

## 自然语言查询

熟悉语法后，手写查询其实很快。但如果你更倾向于直接描述需求，AI 集成功能可以自动完成转换。

在 Web 界面中，打开任务页面的 AI Chat 面板，输入类似"显示带有 work 标签的逾期任务"，AI 会自动生成结构化查询并执行。

在 CLI 中，使用 `ud task nlquery`：

```bash
ud task nlquery "tasks I need to finish this week"
ud task nlquery "high priority engineering items with no deadline"
```

如果想少打几个字，`nl` 别名同样有效。此功能需要配置 AI 提供商，但一旦设置完成，它能处理相当自然的描述方式。

## 已保存查询

这是查询系统真正在日常使用中发挥价值的地方。已保存查询允许你为任意查询命名并存储，之后只需在侧边栏点击一下即可执行。

![Saved queries for quick access to filtered views](https://dl.udctl.com/features/blog/query-syntax/saved-queries.png)

以下几个查询值得立即配置：

| 名称 | 查询 |
|------|-------|
| 已逾期 | `deadline < 'today' AND status != 'done' AND status != 'archived'` |
| 本周到期 | `deadline BETWEEN 'today' AND '+7d' AND status != 'done'` |
| 未规划 | `deadline IS NULL AND status = 'todo'` |
| 近期活跃 | `updated_at >= '-7d' AND status IN ('todo', 'in-progress')` |

你可以将常用查询置顶，通过拖拽调整顺序，并随时编辑。点击已保存查询后，结果会在当前页面内展开，无需跳转。

## 在 CLI 中使用查询

CLI 通过 `ud task query` 支持相同的查询语法：

```bash
ud task query "status = 'todo'" --sort deadline --order asc
ud task query "(status = 'todo' OR status = 'in-progress') AND tags = 'work'"
```

分页（`--page`、`--limit`）和排序（`--sort`、`--order`）参数均可使用。这使得将查询结果导入其他工具或在 shell 脚本中调用查询变得非常方便。

## 开始使用

完整的查询语法参考文档请见[查询语法文档](/docs/query-syntax)，包含所有运算符、日期时间表达式格式，以及一套可直接复用和改写的实用示例。

如果你还没有部署 UnDercontrol，[自托管指南](/docs/self-deployment)介绍了如何通过 Docker 完成部署。你的数据始终保存在自己的基础设施上——这正是它的核心价值所在。
