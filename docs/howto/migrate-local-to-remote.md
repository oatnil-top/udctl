---
title: Migrate Local Data to Remote Server
sidebar_position: 2
---

# Migrate Local Data to Remote Server

Learn how to migrate your data from a local udctl desktop instance (Personal tier with SQLite) to a remote server, enabling cross-device access and sync.

## Prerequisites

- udctl desktop app with local data you want to migrate
- A remote udctl server deployed and accessible (see [Docker Compose deployment](/docs/self-deployment))
- The `ud` CLI installed on your machine ([CLI documentation](/docs/cli))
- Accounts on both the local and remote servers

## Overview

When using udctl desktop with the Personal tier, your data is stored in a local SQLite database. If you want to access your data from multiple devices (e.g., laptop and phone), you need to migrate your data to a remote server.

The `ud migrate` command fetches data from one server (source) and creates it in another (target), automatically handling ID remapping for cross-references like expense-to-budget links.

## Steps

### Step 1: Install the CLI

Check if the `ud` CLI is already installed:

```bash
ud --version
```

If not installed, you can install it via any of these methods:

- **Desktop app**: Open **Settings → Account** and click the **Install** button in the CLI configuration section
- **Other install methods**: See the [CLI download page](https://udctl.com/download#cli)

For full CLI documentation, see the [CLI Tool](/docs/cli) page.

### Step 2: Set Up Contexts

The CLI uses "contexts" to manage connections to different servers. You need to set up two contexts: one for your local instance and one for the remote server.

**Log in to your local instance:**

```bash
ud login --name local --api-url http://localhost:4000
```

**Log in to your remote server:**

```bash
ud login --name remote --api-url https://your-server.example.com
```

Verify both contexts are configured:

```bash
ud config get-contexts
```

You should see both `local` and `remote` listed.

### Step 3: Run a Dry Run

Before migrating, run a dry run to see what will be migrated without making any changes:

```bash
ud migrate --from local --to remote --dry-run
```

This shows the count of entities that would be migrated:

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

### Step 4: Run the Migration

Once you're satisfied with the dry run, execute the actual migration:

```bash
ud migrate --from local --to remote
```

The command migrates entities in dependency order:

1. **Accounts** and **Budgets** (no dependencies)
2. **Expenses** and **Incomes** (reference accounts/budgets)
3. **Tasks** with notes and links
4. **Boards**, **Saved queries**, and **Task views**

Cross-references (e.g., an expense linked to a budget) are automatically remapped using the new IDs from the target server.

### Step 5: Verify the Migration

Log in to your remote server through the web browser and verify your data is present. Check a few tasks, expenses, and budgets to make sure everything looks correct.

## Advanced: User Mapping

If your local and remote accounts have different user IDs (for example, if you registered with different emails), you can provide a user mapping file:

**Create a `user-map.yaml` file:**

```yaml
users:
  "local-user-uuid-here": "remote-user-uuid-here"
```

**Run the migration with the user map:**

```bash
ud migrate --from local --to remote --user-map user-map.yaml
```

To find your user IDs, check the profile/settings page on each instance.

## Advanced: Selective Migration

You can migrate specific entity types only:

```bash
# Migrate only tasks and expenses
ud migrate --from local --to remote --entities tasks,expenses

# Migrate only financial data
ud migrate --from local --to remote --entities accounts,budgets,expenses,incomes
```

Available entity types: `accounts`, `budgets`, `expenses`, `incomes`, `tasks`, `boards`, `saved-queries`, `task-views`

## Tips

- Always run `--dry-run` first to preview what will be migrated
- The migration creates new data on the target server — it does not delete anything from the source
- If migration is interrupted, you can safely re-run it (duplicate detection may vary by entity type)
- After migration, you can switch your desktop app to point to the remote server for ongoing use

## Related

- [CLI Tool](/docs/cli)
- [Docker Compose Deployment](/docs/self-deployment)
