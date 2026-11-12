---
title: Everything as Code
description: UnDercontrol 任务和笔记的开放文件格式规范
sidebar_position: 3
---

# Everything as Code

UnDercontrol 将任务和笔记存储为**带有 YAML frontmatter 的纯 Markdown 文件**。文件格式由开源的 JSON Schema 定义，发布在 [`ud-schemas`](https://github.com/user/ud-schemas) 仓库中。

这意味着你的数据始终是：
- **人类可读** — 使用任何文本编辑器编辑
- **可追踪差异** — 在版本控制中跟踪变更
- **可移植** — 无厂商锁定，标准格式
- **AI 友好** — LLM 可以原生读写你的任务

## Schemas

| Schema | 描述 |
|--------|------|
| `task.v1.schema.json` | 任务文件 — 标题、状态、标签、截止日期 + Markdown 正文 |
| `note.v1.schema.json` | 笔记文件 — 通过 `task_id` 关联到父任务 + Markdown 正文 |

两个 Schema 均使用 [JSON Schema draft-2020-12](https://json-schema.org/draft/2020-12/json-schema-core)。

---

## 任务文件格式

任务文件是一个 Markdown 文件，在 `---` 分隔符之间包含 YAML frontmatter：

```markdown
---
id: 550e8400-e29b-41d4-a716-446655440000
title: 发布 v1 版本
status: in-progress
tags:
  - release
  - urgent
deadline: 2025-06-01
created_at: 2025-01-01T00:00:00Z
updated_at: 2025-05-20T14:30:00Z
---

v1 发布前的最终清单：

- [ ] 运行完整测试套件
- [ ] 更新变更日志
- [ ] 打标签发布
```

### 任务字段

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `id` | UUID | 否 | 有值 = 更新现有任务。无值 = 创建新任务。 |
| `title` | string | 是 | 任务标题。也用于生成文件名。 |
| `status` | string | 否 | 可选值：`todo`、`in-progress`、`pending`、`stale`、`done`、`archived`，以及 `""`。默认：`todo`。空串表示*没有工作流状态*，即这张卡是**文档**。不写这个字段则沿用默认（新建为 `todo`，更新时保持原值）。 |
| `tags` | string[] | 否 | 标签列表 |
| `deadline` | string | 否 | ISO 8601 或 `YYYY-MM-DD` 格式的截止日期 |
| `created_at` | date-time | 否 | 由服务器设置，请勿修改。 |
| `updated_at` | date-time | 否 | 由服务器设置，用于同步冲突检测。 |

### 状态值

规范值使用连字符。客户端在读取时自动标准化：

| 输入 | 标准化结果 |
|------|-----------|
| `in_progress`、`InProgress`、`in progress` | `in-progress` |
| `to-do` | `todo` |
| `completed`、`complete` | `done` |
| `archive` | `archived` |

### 截止日期格式

以下格式均可接受，会自动标准化为 ISO 8601：

```yaml
deadline: 2025-03-15
deadline: 2025/03/15
deadline: 2025-03-15T14:30:00
deadline: 2025-03-15T14:30:00Z
deadline: 2025-03-15T14:30:00+08:00
```

---

## 笔记文件格式

笔记通过 `task_id` 关联到父任务：

```markdown
---
id: 7a8e6f4f-1234-5678-abcd-ef0123456789
task_id: 550e8400-e29b-41d4-a716-446655440000
created_at: 2025-05-20T15:00:00Z
updated_at: 2025-05-20T15:00:00Z
---

与团队讨论了部署策略。
决定采用蓝绿部署方案。
```

### 笔记字段

| 字段 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `id` | UUID | 否 | 有值 = 更新。无值 = 创建。 |
| `task_id` | UUID | 是 | 父任务的 UUID |
| `created_at` | date-time | 否 | 由服务器设置 |
| `updated_at` | date-time | 否 | 由服务器设置 |

---

## 创建 vs 更新（声明式语义）

任务和笔记文件均遵循 **kubectl 风格的声明式语义**：

- **frontmatter 中没有 `id`** → 创建新资源
- **有 `id`** → 更新现有资源（ID 可以是完整 UUID 或唯一前缀）

这适用于 CLI 的 `ud apply` 命令和本地同步文件扫描。

```bash
# 创建：文件中没有 id
echo '---
title: 新任务
status: todo
---
描述内容。' | ud apply -f -

# 更新：有 id
echo '---
id: 550e8400
title: 更新后的标题
status: done
---
更新后的描述。' | ud apply -f -
```

---

## 文件名规则

### 任务文件

任务文件使用 `normalizeFilename(title)` 命名：

1. 将不安全字符（`/\:*?"<>|%!#$&'()+,;=@[]^{}~`）替换为 `-`
2. 将多个连续空格/短横线合并为单个短横线
3. 去除首尾短横线
4. 截断到 100 个字符
5. 结果为空则使用 `untitled`
6. 重复时添加 `-2`、`-3` 后缀

示例：`Ship v1 release` → `Ship-v1-release.md`

### 笔记文件

笔记文件命名为：`{normalizeFilename(taskTitle)}-{normalizeFilename(noteFirstLine)}.md`

任务标题前缀在文件系统中将笔记与其父任务视觉关联。

---

## URL 规则

内容可以使用以下 URL 方案交叉引用其他资源：

### 应用协议（存储在后端）

| 方案 | 格式 |
|------|------|
| `resource://` | `resource://{resourceId}` |
| `tasks://` | `tasks://{taskId}` |
| `note://` | `note://{taskId}/{noteId}` |

### 本地文件路径（同步文件夹中）

| 类型 | 格式 |
|------|------|
| 资源 | `./resources/{resourceId}.{ext}` |
| 任务 | `./{Task-Title}.md` |
| 笔记 | `./{TaskTitle}-{NoteFirstLine}.md` |

客户端在同步期间进行格式转换。

---

## 验证文件

### 使用 `check-jsonschema`（Python）

```bash
pip install check-jsonschema
check-jsonschema --schemafile task.v1.schema.json your-task.json
```

### 使用 `ajv`（Node.js）

```bash
npm install -g ajv-cli ajv-formats
ajv validate -s task.v1.schema.json -d your-task.json --spec=draft2020
```

### 编辑器集成

大多数支持 YAML/JSON Schema 的编辑器可以使用这些 Schema 进行自动补全和内联验证。

---

## Schema 仓库

Schema 作为开源仓库发布：

- **仓库**: [`ud-schemas`](https://github.com/user/ud-schemas)
- **许可证**: MIT
- **版本控制**: Schema 使用 `v{N}` 后缀。破坏性变更会提升版本号。

仓库包含示例文件和使用说明。
