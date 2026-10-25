---
title: Query Syntax
description: Complete reference for the SQL-like query syntax used in Advanced Search, Custom Views, Kanban, CLI, and AI-powered queries
sidebar_position: 6
---

# Query Syntax

udctl provides a powerful SQL-like query syntax for filtering and searching tasks. You can write queries manually or let AI generate them from natural language.

## Where Queries Are Used

The query syntax is available across the entire application:

- **Advanced Search** — Build complex filter conditions on the search page
- **Custom Views** — Define a Root Query for views to filter which tasks are displayed
- **Kanban Filtering** — Filter tasks within kanban board columns
- **Saved Queries** — Save frequently used queries for one-click access
- **CLI** — Run queries from the terminal with `ud query`
- **AI Chat** — Describe what you want in natural language and let AI generate the query

:::tip Don't want to write queries manually?
Use the **AI Chat** feature on the task page — just describe what you're looking for in plain language, and the AI will generate the query for you. This works in both the web UI and the CLI (`ud query`).
:::

---

## Quick Start

Here are a few queries to get you started:

```sql
-- Find all todo tasks
status = 'todo'

-- Find overdue tasks
deadline < 'today' AND status != 'done'

-- Search tasks by title
title ILIKE '%meeting%'

-- Tasks created in the last week, sorted by newest first
created_at >= '-7d' ORDER BY created_at DESC
```

---

## Available Fields

### Built-in Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | Text | Task title |
| `description` | Text | Task description |
| `status` | Text | Task status: `todo`, `in-progress`, `pending`, `stale`, `done`, `archived`, or `''` (empty = the card is a document and has no workflow status) |
| `tags` | Array | List of tags attached to the task |
| `deadline` | Datetime | Due date |
| `created_at` | Datetime | When the task was created |
| `updated_at` | Datetime | When the task was last modified |

### Custom Fields

Custom fields are queried using the `cf.` prefix. The prefix is followed by the custom field's name (slug).

```sql
cf.priority = 5
cf.priority > 3
cf.priority IN (1, 2, 3)
cf.department = 'engineering'
```

#### Custom Field Types

Each custom field type supports a specific set of operators:

| Type | Description | Supported Operators |
|------|-------------|---------------------|
| Number (`number`) | Numeric values | `=`, `!=`, `>`, `<`, `>=`, `<=`, `IN`, `IS NULL`, `IS NOT NULL` |
| Text (`text`) | Text values | `=`, `!=`, `LIKE`, `ILIKE`, `IN`, `IS NULL`, `IS NOT NULL` |
| Select (`select`) | Dropdown selection | `=`, `!=`, `IN`, `IS NULL`, `IS NOT NULL` |
| Checkbox (`checkbox`) | Boolean value | `=`, `!=`, `IS NULL`, `IS NOT NULL` |
| User (`user`) | User reference | `=`, `!=`, `IN`, `IS NULL`, `IS NOT NULL` |

:::info Custom Field Names
Custom field names are the slugs you defined when creating the field. For example, if you created a field called "Priority Level", the slug might be `priority_level`, and you would query it as `cf.priority_level`.
:::

---

## Operators

### Comparison Operators

#### Equality and Inequality

| Operator | Description | Example |
|----------|-------------|---------|
| `=` | Equal to | `status = 'todo'` |
| `!=` | Not equal to | `status != 'archived'` |

:::info `status` is always set — and `''` is one of its values
Every card has a `status`. The empty string `''` is a legal value of that field and
means *this card is a document* (no workflow status). Being a value like any other,
it takes part in comparisons:

- a document matches `status = ''`;
- a document also matches `status != 'done'`, and `status != 'archived'`, and so on —
  it is genuinely not `'done'`;
- `status IN ('todo', 'in-progress')` does **not** match a document, because `''` is
  not in the list.

So a view meant to show workflow tasks only says so explicitly:

```sql
-- Overdue tasks, documents excluded
deadline < 'today' AND status != 'done' AND status != ''
```

The full list of values is in `ud explain task.frontmatter.status`.
:::

#### Numeric and Date Comparisons

| Operator | Description | Example |
|----------|-------------|---------|
| `>` | Greater than | `deadline > 'today'` |
| `<` | Less than | `deadline < 'today'` |
| `>=` | Greater than or equal | `created_at >= '-7d'` |
| `<=` | Less than or equal | `deadline <= 'tomorrow'` |

These operators work with datetime fields, numeric custom fields, and standard date values.

#### Null Checks

| Operator | Description | Example |
|----------|-------------|---------|
| `IS NULL` | Field has no value set | `deadline IS NULL` |
| `IS NOT NULL` | Field has a value set | `deadline IS NOT NULL` |

Use null checks to find tasks where optional fields (like deadline or custom fields) are empty or filled in.

### Text Search Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `LIKE` | Pattern matching (case-sensitive) | `title LIKE '%Bug%'` |
| `ILIKE` | Pattern matching (case-insensitive) | `title ILIKE '%bug%'` |

Use the `%` wildcard to match any sequence of characters:

| Pattern | Matches |
|---------|---------|
| `'%meeting%'` | Contains "meeting" anywhere |
| `'meeting%'` | Starts with "meeting" |
| `'%meeting'` | Ends with "meeting" |

:::tip
`ILIKE` is usually the better choice for text search since it's case-insensitive. Use `LIKE` only when you specifically need case-sensitive matching.
:::

### Multi-Value Operators

#### IN

Check if a field value is in a given list:

```sql
status IN ('todo', 'in-progress')
cf.department IN ('engineering', 'design', 'marketing')
```

#### CONTAINS_ALL (Array Fields)

Check if an array field contains **all** specified values. This is primarily used with the `tags` field:

```sql
-- Tasks that have BOTH the 'work' AND 'urgent' tags
tags CONTAINS_ALL ('work', 'urgent')
```

#### BETWEEN

Check if a value falls within a range (inclusive):

```sql
deadline BETWEEN '2024-01-01' AND '2024-12-31'
created_at BETWEEN '-7d' AND 'today'
cf.estimate BETWEEN 5 AND 20
```

---

## Datetime Expressions

Datetime fields (`deadline`, `created_at`, `updated_at`) accept several convenient date expression formats in addition to standard ISO 8601 dates (e.g., `2024-01-15`).

### Named Expressions

| Expression | Description |
|------------|-------------|
| `today` | Start of today (midnight) |
| `yesterday` | Start of yesterday |
| `tomorrow` | Start of tomorrow |
| `now` | Current exact time (date + time) |

### Relative Expressions

Relative expressions let you specify a point in time relative to now. Use `-` for the past and `+` for the future:

| Format | Description | Example |
|--------|-------------|---------|
| `-Nd` or `-Ndays` | N days ago | `-7d` = 7 days ago |
| `+Nd` or `+Ndays` | N days from now | `+3d` = 3 days from now |
| `-Nw` or `-Nweeks` | N weeks ago | `-2w` = 2 weeks ago |
| `+Nw` or `+Nweeks` | N weeks from now | `+1w` = 1 week from now |
| `-Nm` or `-Nmonths` | N months ago | `-1m` = 1 month ago |
| `+Nm` or `+Nmonths` | N months from now | `+3m` = 3 months from now |
| `-Ny` or `-Nyears` | N years ago | `-1y` = 1 year ago |

### Datetime Examples

```sql
-- Tasks due today or earlier
deadline <= 'today'

-- Tasks created in the last 7 days
created_at >= '-7d'

-- Tasks updated this week
updated_at >= '-1w' AND updated_at <= 'today'

-- Tasks due within the next week
deadline BETWEEN 'today' AND '+7d'

-- Tasks due within the next month
deadline BETWEEN 'today' AND '+1m'

-- Tasks created in a specific year
created_at BETWEEN '2024-01-01' AND '2024-12-31'
```

:::info Standard Date Formats
You can also use standard ISO 8601 date formats like `2024-01-15` or `2024-01-15T14:30:00Z`. These are useful when you need to query for a specific fixed date rather than a relative one.
:::

---

## Logical Operators

### AND and OR

Combine multiple conditions with `AND` and `OR`:

```sql
-- Both conditions must be true
status = 'todo' AND deadline <= 'today'

-- Either condition can be true
status = 'done' OR status = 'archived'
```

### Operator Precedence

`AND` has **higher precedence** than `OR`. This means `AND` conditions are evaluated first.

The following query:

```sql
status = 'todo' OR pinned = 'true' AND deadline <= 'today'
```

Is evaluated as:

```sql
status = 'todo' OR (pinned = 'true' AND deadline <= 'today')
```

### Using Parentheses

Use parentheses to explicitly control evaluation order:

```sql
-- Tasks that are either todo or in-progress, AND are due today
(status = 'todo' OR status = 'in-progress') AND deadline <= 'today'

-- Tasks that are either due today or tagged urgent, AND not done
(deadline <= 'today' OR tags = 'urgent') AND status != 'done'

-- Nested grouping
(status = 'todo' AND deadline <= 'today') OR (status = 'in-progress' AND tags = 'urgent')
```

:::tip
When combining `AND` and `OR` in the same query, always use parentheses to make your intent clear — even when they're not strictly necessary. This makes queries easier to read and avoids unexpected results from precedence rules.
:::

---

## ORDER BY

Use the `ORDER BY` clause to sort query results. It's always placed at the end of the query.

```sql
-- Sort all results by creation time (newest first)
ORDER BY created_at DESC

-- Filter and sort
status = 'todo' ORDER BY created_at DESC

-- Overdue tasks sorted by deadline (earliest first)
deadline < 'today' AND status != 'done' ORDER BY deadline ASC
```

### Sortable Fields

| Field | Description |
|-------|-------------|
| `created_at` | Sort by creation time |
| `updated_at` | Sort by last update time |
| `deadline` | Sort by due date |
| `title` | Sort alphabetically by title |

### Sort Direction

| Direction | Description |
|-----------|-------------|
| `ASC` | Ascending — smallest to largest, earliest to latest, A to Z |
| `DESC` | Descending — largest to smallest, latest to earliest, Z to A |

If no direction is specified, the default is `DESC`.

---

## Saved Queries

Saved Queries let you store frequently used queries for quick access. Instead of typing the same query every time, you can save it with a name and execute it with one click.

### Features

- **Create** — Save any query with a descriptive name
- **Execute** — Run a saved query and see matching tasks inline
- **Edit** — Update the name or query string of a saved query
- **Pin** — Pin important queries to the top of the list for quick access
- **Reorder** — Drag and drop to organize your saved queries
- **Delete** — Remove queries you no longer need

### How to Use Saved Queries

1. Navigate to the **Saved Queries** page from the sidebar
2. Click **New Query** to create a saved query
3. Give it a name (e.g., "My Overdue Tasks") and enter the query string
4. Click on a saved query to expand it and see matching results
5. Pin frequently used queries to keep them at the top

### Example Saved Queries

| Name | Query |
|------|-------|
| Overdue Tasks | `deadline < 'today' AND status != 'done' AND status != 'archived'` |
| Due This Week | `deadline BETWEEN 'today' AND '+7d' AND status != 'done'` |
| Recently Active | `updated_at >= '-7d' AND status IN ('todo', 'in-progress')` |
| Urgent Items | `(deadline <= 'today' OR tags = 'urgent') AND status != 'done'` |
| Unplanned Tasks | `deadline IS NULL AND status = 'todo'` |

---

## Using Queries in the CLI

The udctl CLI supports running queries directly from the terminal. This is useful for scripting, automation, and quick lookups without leaving your terminal workflow.

### `ud query`

Run a structured query using the same syntax documented above:

```bash
ud query "<query>" [flags]
```

**Flags:**
- `--page` — Page number (default: 1)
- `--limit` — Items per page (default: 50)
- `--sort` — Sort field (`title`, `deadline`, `created_at`, `updated_at`)
- `--order` — Sort direction (`asc`, `desc`)

**Examples:**

```bash
# Find all todo tasks
ud query "status = 'todo'"

# Search by title
ud query "title ILIKE '%api%'"

# Tasks due this week
ud query "deadline BETWEEN 'today' AND '+7d'"

# Tagged tasks
ud query "tags = 'urgent'"

# Complex query with sorting
ud query "(status = 'todo' OR status = 'in-progress') AND deadline <= 'today'" --sort deadline --order asc

# Paginated results
ud query "status != 'archived'" --page 2 --limit 20
```

For full CLI documentation, see the [CLI Reference](./cli.md).

---

## AI-Powered Queries

udctl integrates AI to make querying more accessible. Instead of learning the query syntax, you can describe what you want in plain language.

### In the Web UI

1. Open the task page
2. Open the **AI Chat** panel
3. Type your request in natural language, for example:
   - "Show me tasks that are overdue"
   - "Find all tasks tagged with 'work' that are due this week"
   - "What tasks were updated today?"
4. The AI generates and executes the structured query

### In the CLI

Use `ud query` to run structured queries from the terminal:

```bash
ud query "deadline BETWEEN 'today' AND '+7d' AND status != 'done'"
```

See the [CLI Reference](./cli.md) for the full list of query flags and options.

---

## Practical Examples

### By Status

```sql
-- All todo tasks
status = 'todo'

-- In-progress tasks
status = 'in-progress'

-- Completed tasks
status = 'done'

-- All incomplete tasks (todo or in-progress)
status IN ('todo', 'in-progress')

-- Non-archived tasks
status != 'archived'
```

### By Deadline

```sql
-- Tasks due today or earlier (not yet done)
deadline <= 'today' AND status != 'done' AND status != 'archived'

-- Overdue tasks
deadline < 'today' AND status != 'done' AND status != 'archived'

-- Due this week
deadline BETWEEN 'today' AND '+7d' AND status != 'done'

-- Due this month
deadline BETWEEN 'today' AND '+30d' AND status != 'done'

-- No deadline set
deadline IS NULL

-- Has a deadline
deadline IS NOT NULL

-- Tasks without a deadline that are still todo
deadline IS NULL AND status = 'todo'
```

### By Time

```sql
-- Created in the last 7 days
created_at >= '-7d'

-- Updated in the last 7 days
updated_at >= '-7d'

-- Created this month
created_at >= '-30d'

-- Updated today
updated_at >= 'today'

-- Created in a specific date range
created_at BETWEEN '2024-06-01' AND '2024-06-30'
```

### By Tags

```sql
-- Tasks with a specific tag
tags = 'work'

-- Tasks with any of several tags
tags IN ('work', 'personal')

-- Tasks with ALL specified tags
tags CONTAINS_ALL ('work', 'urgent')
```

Two tags have a fixed meaning: `awaiting-decision` (waiting for you to decide) and `follow-up` (someone has to chase it). They back the first two columns of the built-in All Tasks board, Awaiting Decision and Follow-up, which list open tasks only:

```sql
-- The Awaiting Decision column
tags = 'awaiting-decision' AND status != 'done' AND status != 'archived' ORDER BY updated_at DESC

-- The Follow-up column, earliest deadline first
tags = 'follow-up' AND status != 'done' AND status != 'archived' ORDER BY deadline ASC
```

From the CLI: `ud get task --board __system_all_tasks__ --column Follow-up`.

### Text Search

```sql
-- Title contains a keyword (case-insensitive)
title ILIKE '%meeting%'

-- Description contains a keyword
description ILIKE '%important%'

-- Title starts with a specific word
title ILIKE 'bug%'

-- Case-sensitive title search
title LIKE '%API%'
```

### Custom Fields

```sql
-- Numeric custom field comparisons
cf.priority > 5
cf.estimate >= 10
cf.priority BETWEEN 1 AND 3

-- Text/select custom field
cf.department = 'engineering'
cf.department IN ('design', 'marketing')

-- Checkbox custom field
cf.reviewed = 'true'

-- Null checks on custom fields
cf.priority IS NULL                           -- Not yet prioritized
cf.priority IS NOT NULL AND cf.priority <= 3  -- Low priority tasks
```

### Combined Queries

```sql
-- Urgent todo: due today or tagged urgent, not done
(deadline <= 'today' OR tags = 'urgent') AND status != 'done' AND status != 'archived'

-- Work in progress: in-progress tasks with work tag
tags = 'work' AND status = 'in-progress'

-- Recently active: incomplete tasks updated in the last 7 days
updated_at >= '-7d' AND status IN ('todo', 'in-progress')

-- Needs attention: overdue or due this week, still todo
(deadline < 'today' OR deadline BETWEEN 'today' AND '+7d') AND status = 'todo'

-- High priority engineering tasks
cf.priority > 5 AND cf.department = 'engineering' AND status != 'done'

-- Unplanned urgent tasks
deadline IS NULL AND tags = 'urgent' AND status = 'todo'
```

### With Sorting

```sql
-- Todo tasks, newest first
status = 'todo' ORDER BY created_at DESC

-- Overdue tasks, earliest deadline first
deadline < 'today' AND status != 'done' ORDER BY deadline ASC

-- Recently updated tasks
status != 'archived' ORDER BY updated_at DESC

-- High priority by update time
cf.priority > 5 ORDER BY updated_at DESC

-- All tasks alphabetically
ORDER BY title ASC
```

---

## Tips and Notes

1. **String values require quotes** — All string values must be enclosed in single quotes (`'todo'`) or double quotes (`"todo"`). Numbers do not need quotes.

2. **Field names are case-sensitive** — Always use lowercase field names: `status`, `deadline`, `created_at`, etc.

3. **Valid status values** — The built-in status values are: `todo`, `in-progress`, `pending`, `stale`, `done`, `archived`, plus the empty string `''`, which means the card is a **document** (no workflow status). Query documents with `status = ''`. Note that a document also satisfies `status != 'x'` for every `x`, so when you want tasks only, exclude it explicitly: `status != 'done' AND status != ''`.

4. **Array field behavior** — The `tags` field is an array. Use `=` to check if it contains a specific tag, `IN` to check for any of several tags, and `CONTAINS_ALL` to require all specified tags.

5. **Custom field prefix** — Always use the `cf.` prefix when querying custom fields: `cf.priority = 5`, not `priority = 5`.

6. **ORDER BY placement** — The `ORDER BY` clause must always be the last part of the query. Place all filter conditions before it.

7. **Default sort direction** — If you omit `ASC` or `DESC`, the default sort direction is `DESC` (descending).

8. **Date format** — The query engine supports ISO 8601 dates (`2024-01-15`), named expressions (`today`, `tomorrow`), and relative expressions (`-7d`, `+1m`). Relative expressions are always quoted: `'-7d'`, not `-7d`.

9. **Sortable fields** — `ORDER BY` only works with: `created_at`, `updated_at`, `deadline`, `title`. Other fields cannot be used for sorting.

10. **Empty queries** — You can use `ORDER BY` alone without any filter conditions to sort all tasks: `ORDER BY deadline ASC`.
