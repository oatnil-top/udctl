---
title: CLI Reference
description: Complete command reference for the udctl CLI tool
sidebar_position: 4
---

# CLI Reference

The udctl CLI (`ud`) is a command-line tool for managing tasks from the terminal. It supports both direct commands and an interactive TUI mode with vim-style keybindings.

## Installation

### npm (Recommended)

```bash
# Global install
npm install -g @oatnil/ud

# Or run directly without installing
npx @oatnil/ud --help
```

### Homebrew (macOS/Linux)

```bash
brew tap oatnil-top/ud
# Homebrew 6 and newer only; older versions have no `trust`
brew trust oatnil-top/ud
brew install ud
```

Homebrew 6 refuses to load a formula from a third-party tap until you trust it,
and reports it as an error rather than a prompt.

### Manual Download

Download the appropriate version for your platform:

| Platform | Filename |
|----------|----------|
| macOS (Apple Silicon) | `ud_x.x.x_darwin_arm64.tar.gz` |
| macOS (Intel) | `ud_x.x.x_darwin_amd64.tar.gz` |
| Linux (x64) | `ud_x.x.x_linux_amd64.tar.gz` |
| Linux (ARM64) | `ud_x.x.x_linux_arm64.tar.gz` |
| Windows | `ud_x.x.x_windows_amd64.zip` |

**macOS / Linux:**

```bash
# Extract
tar -xzf ud_x.x.x_darwin_arm64.tar.gz

# Move to PATH
sudo mv ud /usr/local/bin/ud

# Verify
ud --version
```

**Windows:**

1. Extract the `.zip` file
2. Move `ud.exe` to a directory in your PATH
3. Or add the extracted directory to your system PATH

---

## Authentication

### Login

```bash
ud login
```

You'll be prompted for:
- **Username**: Your account email
- **Password**: Your account password

The server URL comes from the active context (or the `--api-url` flag). To log in to a specific server and save it as a named context in one step, use `--api-url` with `--name/-n`:

```bash
# Your own server — the usual case. Use its URL, including the port if it has one.
ud login --api-url https://ud.example.com -n personal

# The udctl desktop app runs a backend on your own machine:
ud login --api-url http://localhost:8888 -n desktop
```

No server yet and just want to try udctl? Point at `https://api.oatnil.com` — a
**test server** we run for trying the product, not a hosting plan, so don't keep real work
there. Sign up for it at [app.udctl.com](https://app.udctl.com) first:

```bash
ud login --api-url https://api.oatnil.com -n trial
```

`https://app.udctl.com` serves the web app only — passing it to `--api-url` fails with
`status 404`. The API host is `https://api.oatnil.com`.

You can also pass credentials non-interactively with `-u/--username` and `-p/--password`. Credentials are saved to `~/.config/ud/config.yaml`.

### Multi-Context Support

The CLI supports kubectl-style contexts for managing multiple accounts. See [CLI Multi-Context Authentication](./cli-auth-context.md) for details.

```bash
# List contexts
ud config get-contexts

# Switch context
ud config use-context work

# Login to specific context
ud login --context work --api-url https://ud.company.com
```

---

## Resource Commands (kubectl-style)

The CLI supports kubectl-style top-level verbs for managing resources. These are the **recommended** way to interact with resources.

### Get Resources

```bash
ud get task [id] [--status <status>]
```

Display one or many tasks in a table format.

**Options:**
- `--status`: Filter by status (`todo`, `in-progress`, `pending`, `stale`, `done`, `archived`). Documents (status `""`) cannot be selected with this flag — an empty value reads as "no filter"; use `ud query "status = ''"` instead.

**Examples:**
```bash
# List all tasks
ud get task

# List only todo tasks
ud get task --status todo

# Show a single task in table format
ud get task abc123
```

### Describe Resource

```bash
ud describe task <id>
```

Show detailed information about a specific task, including title, description, status, tags, deadline, timestamps, linked tasks, attachments, and notes.

**Examples:**
```bash
# View full task details
ud describe task abc123

# Using short prefix
ud describe task 3de
```

:::tip Short ID Support
All commands that accept a task ID support **prefix matching**. You can use the 8-character short IDs shown in `get task` output, or even shorter prefixes as long as they're unique.

```bash
# Full short ID from list
ud describe task 3de9f82b
# Shorter prefix (if unique)
ud describe task 3de
# Full UUID also works
ud describe task 3de9f82b-fc49-4e84-b288-9ae3174f69ae
```

If a prefix matches multiple tasks, you'll see an error listing the matches:
```
Error: ambiguous ID prefix '3' matches 2 tasks:
  3de9f82b (Task title one)
  3fbf7c24 (Task title two)
Please use a longer prefix
```
:::

### Apply Resource from File

```bash
# .md for tasks/notes, .yaml for other resources
ud apply -f <file>
# Read from stdin (auto-detects format)
ud apply -f -
```

Create or update resources declaratively from files (kubectl-style). Supports all resource types:

| Format | Resources | Auto-detection |
|--------|-----------|----------------|
| `.md` | Task (default), Note (when `task_id` in frontmatter) | `task_id` present → Note |
| `.yaml` / `.yml` | Board, Budget, Account, Expense, Income | `kind` field in YAML |

**Quick examples:**
```bash
# Task
echo '---
title: New Task
status: todo
---
Description here.' | ud apply -f -

# Note (auto-detected by task_id)
echo '---
task_id: abc123
---
Progress update.' | ud apply -f -

# Board (YAML)
ud apply -f board.yaml

# Multi-document YAML (multiple resources in one file)
ud apply -f setup.yaml
```

For the full schema reference, all supported fields, and YAML resource format details, see the [Apply & Resource Schema](./cli-apply-schema.md) guide.

### Delete Resource

```bash
ud delete task <id>
```

Delete a task by ID.

**Examples:**
```bash
ud delete task abc123
ud delete task 3de9f82b
```

---

## Working with Tasks

The `ud` CLI is kubectl-style: there is no `ud task create/done/edit` subcommand. Instead, you create, update, and change task state declaratively with `ud apply`.

### Create a Task

Pipe a markdown document (YAML frontmatter + body) to `ud apply -f -`. With **no `id`** in the frontmatter, this creates a new task:

```bash
cat <<'EOF' | ud apply -f -
---
title: Fix login bug
status: todo
tags: [backend, urgent]
---
Update the auth middleware to handle expired refresh tokens.
EOF
```

You can also apply a file directly:

```bash
ud apply -f task.md
```

If `title` is omitted, it's derived from the first line of the body (or the filename). See the [Apply & Resource Schema](./cli-apply-schema.md) guide for all fields.

### Update a Task / Change Status

To update an existing task — including marking it done — apply the same document **with the `id`** present. Set `status: done` to complete it:

```bash
cat <<'EOF' | ud apply -f -
---
id: abc123
status: done
---
EOF
```

A convenient round-trip is to export a task, edit it, and re-apply it:

```bash
# Export the task in apply-compatible format
ud describe task abc123 -o apply > task.md

# ...edit task.md in your editor...

# Re-apply the changes
ud apply -f task.md
```

You can also edit tasks interactively in the [TUI](#tui-mode) (`ud` or `ud tui`).

### Link Tasks

```bash
# Bidirectional peer link
ud link task abc123 def456

# Make one a subtask of another
ud link task parent123 child456 --subtask

# Set the parent of a task
ud link task child123 parent456 --parent
```

### Query Tasks

```bash
ud query "<query>" [flags]
```

Query tasks using SQL-like syntax.

**Flags:**
- `--page`: Page number (default: 1)
- `--limit`: Items per page (default: 50)
- `--sort`: Sort field (`title`, `deadline`, `created_at`, `updated_at`)
- `--order`: Sort direction (`asc`, `desc`)

**Examples:**
```bash
# Find todo tasks
ud query "status = 'todo'"

# Search by title
ud query "title ILIKE '%api%'"

# Find tasks due this week
ud query "deadline BETWEEN 'today' AND '+7d'"

# Find tagged tasks
ud query "tags = 'urgent'"

# Complex query
ud query "(status = 'todo' OR status = 'in-progress') AND deadline <= 'today'"
```

---

## Notes

Notes let you add comments, progress updates, and context to tasks. They're useful for tracking work history and AI agent collaboration. Like tasks, notes are managed with `ud apply` — a markdown document is detected as a **note** when its frontmatter contains a `task_id`.

### Add a Note

```bash
cat <<'EOF' | ud apply -f -
---
task_id: abc123
---
✓ Auth middleware done
EOF
```

Or apply a file that has `task_id` in its frontmatter:

```bash
ud apply -f progress.md
```

To update an existing note, include its `note_id` in the frontmatter alongside `task_id`.

### List Notes

```bash
ud get notes --task <task-id>
# short flag
ud get notes -t <task-id>
```

### Delete a Note

```bash
ud delete note <note-id>
```

**Example:**
```bash
ud delete note 4223db11
```

### AI Agent Workflow

Notes enable seamless collaboration between humans and AI agents. For how Claude Code, Cursor, and Codex drive `ud` as an [AI agent CLI](./cli-ai-integration.md) — including the built-in skills that teach them these commands — see that guide.

```bash
# AI creates a task from a plan (no id = create)
cat <<'EOF' | ud apply -f -
---
title: Add user authentication
status: in-progress
---
JWT-based auth with refresh tokens.
EOF
# Created task: abc12345

# AI reads the task for context
ud describe task abc123

# AI logs progress via notes (task_id = note)
cat <<'EOF' | ud apply -f -
---
task_id: abc123
---
✓ Completed step 1: Database schema
EOF

# AI reports a blocker
cat <<'EOF' | ud apply -f -
---
task_id: abc123
---
⚠️ Blocked: Need API key for external service
EOF

# Once unblocked, AI completes the task (id + status = update)
cat <<'EOF' | ud apply -f -
---
id: abc123
status: done
---
EOF
```

---

## File Upload & Attachment Commands

Upload files as resources and optionally attach them to entities like tasks or expenses. Files are uploaded via presigned URLs directly to cloud storage.

### Upload a File

```bash
ud upload resource <file-path> [flags]
```

Upload a file as a resource. Optionally attach it to an entity in a single step.

**Flags:**
- `-t, --entity-type`: Entity type to attach to (e.g., `todolist`, `expense`)
- `-e, --entity-id`: Entity ID to attach to (supports prefix matching for tasks)

**Examples:**
```bash
# Upload a standalone file
ud upload resource ./receipt.png

# Upload and attach to a task
ud upload resource ./design.pdf --entity-type todolist --entity-id abc123

# Short flags
ud upload resource ./photo.jpg -t todolist -e abc123

# Upload a document to a task (partial ID)
ud upload resource ./notes.txt -t todolist -e 3de
```

**Output:**
```
Uploading ./receipt.png...
Uploaded: receipt.png
  ID:   2a2e542e-0711-4e7f-aafb-09a432e71860
  Type: image
  Size: 102.4 KB
  MIME: image/png
```

:::tip MIME Type Detection
The CLI automatically detects MIME types from file extensions. Common mappings:
- Images: `.png`, `.jpg`, `.gif`, `.webp`, `.svg` → `image`
- Documents: `.pdf`, `.doc`, `.docx`, `.txt`, `.csv` → `document`
- Diagrams: `.drawio`, `.drawio.png` → `diagram`
- Other: all other extensions → `other`
:::

### Attach Existing Resource

```bash
ud attach resource <resource-id> --entity-type <type> --entity-id <id>
```

Link an already-uploaded resource to an entity. Both `--entity-type` and `--entity-id` are required.

**Flags:**
- `-t, --entity-type`: Entity type (required)
- `-e, --entity-id`: Entity ID (required, supports prefix matching for tasks)

**Supported entity types:**
| Entity Type | Description |
|-------------|-------------|
| `todolist` | Tasks |
| `expense` | Expenses |
| `budget` | Budgets |
| `account` | Accounts |

**Examples:**
```bash
# Attach resource to a task
ud attach resource 2a2e542e-0711-4e7f-aafb-09a432e71860 -t todolist -e abc123

# Attach to an expense
ud attach resource 2a2e542e -t expense -e def456
```

### Download a Resource

To download a resource, use `ud get entity` to retrieve the presigned download URL, then download with `curl`:

```bash
# Get resource details (includes presigned download URL)
ud get entity 2a2e542e-0711-4e7f-aafb-09a432e71860

# Download using the presigned URL from the response
curl -o receipt.png "https://storage.example.com/...?signature=..."
```

### Upload Workflow Example

A typical workflow for attaching files to tasks:

```bash
# 1. Find the task
ud get task --status in-progress

# 2. Upload and attach a file
ud upload resource ./screenshot.png -t todolist -e 3de9f82b

# 3. Verify the attachment
ud describe task 3de9f82b
# Shows: [2a2e542e] screenshot.png (image/png, 102.4 KB)

# 4. Later, download the file
ud get entity 2a2e542e
# Copy the presignedUrl from the output
curl -o screenshot.png "<presigned-url>"
```

---

## TUI Mode

Run `ud` without arguments to enter the interactive terminal UI.

### List View Keybindings

| Key | Action |
|-----|--------|
| `j` / `k` | Move down/up |
| `gg` | Jump to top |
| `G` | Jump to bottom |
| `Enter` | View task details |
| `i` | Create new task |
| `e` | Edit task (uses $EDITOR) |
| `x` | Toggle task status |
| `dd` | Delete task |
| `/` | Search |
| `n` / `N` | Next/previous search result |
| `r` | Refresh list |
| `f` | Open file picker |
| `q` | Quit |
| `?` | Show help |

### Detail View Keybindings

| Key | Action |
|-----|--------|
| `j` / `k` | Scroll content |
| `x` | Toggle task status |
| `e` | Edit task |
| `dd` | Delete task |
| `Esc` / `q` | Return to list |

### File Picker

Press `f` in list view to open an fzf-like file picker:
- Fuzzy search files in current directory
- Select file to create task
- First line = title, rest = description
- Binary files are skipped

---

## Configuration Commands

### View Configuration

```bash
ud config view
```

Shows the full configuration with tokens partially masked.

### List Contexts

```bash
ud config get-contexts
```

### Switch Context

```bash
ud config use-context <name>
```

### Show Current Context

```bash
ud config current-context
```

### Create/Update Context

```bash
ud config set-context <name> [flags]
```

**Flags:**
- `--api-url`: API server URL
- `--api-key`: API key (for CI/CD)

### Delete Context

```bash
ud config delete-context <name>
```

### Rename Context

```bash
ud config rename-context <old-name> <new-name>
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `UD_CONTEXT` | Override current context |
| `UD_API_URL` | Override API URL |
| `UD_API_KEY` | Override API key |
| `UD_TOKEN` | Override auth token |
| `EDITOR` | Editor used by the TUI when editing a task |

**Examples:**
```bash
# Use different context for one command
UD_CONTEXT=staging ud get task

# Override API URL
UD_API_URL=http://localhost:4000 ud get task

# Set editor
export EDITOR=vim
```

---

## Common Workflows

### AI Agent Integration

Create `.claude/instructions.md` or `.cursorrules` in your project:

```markdown
# Task Management

Use udctl CLI to manage project tasks:

- List tasks: `ud get task`
- View task details: `ud describe task <id>`
- Create or update a task: `ud apply -f -` (no `id` = create, `id` = update)
- Complete a task: apply the task with `status: done`
- Add a progress note: `ud apply -f -` with `task_id` in the frontmatter
- Delete a task: `ud delete task <id>`

Before implementing features, check related tasks for context.
```

### Batch Updates with Apply

Create a template file and apply to multiple tasks:

```bash
# Create status update template for each task
for id in abc123 def456 ghi789; do
  echo "---
id: $id
status: done
---" | ud apply -f -
done
```

### Export and Edit Workflow

```bash
# View task, copy content
ud describe task abc123

# Create markdown file with updates (include id for update)
cat > update.md << 'EOF'
---
id: abc123
title: Updated Title
status: in-progress
tags:
  - reviewed
  - approved
---

Updated description with new requirements.
EOF

# Apply changes
ud apply -f update.md
```

---

## Troubleshooting

### Login Failed

**Problem:** `API error: Invalid credentials`

**Solutions:**
1. Verify username and password
2. Check server URL is correct
3. Try logging in via web to verify account

### Connection Timeout

**Problem:** `connection timeout`

**Solutions:**
1. Check network connection
2. Verify server URL is accessible
3. Check firewall settings

### Token Expired

**Problem:** `API error: Token expired`

**Solution:** Run `ud login` to re-authenticate.

### Editor Not Working

**Problem:** Editing a task in the TUI has no effect

**Solution:** Set the `EDITOR` environment variable:
```bash
# or nano, code, etc.
export EDITOR=vim
```

### Invalid Status Error

**Problem:** `API error: An unexpected error occurred` when using `apply`

**Solution:** Ensure status is one of: `todo`, `in-progress`, `pending`, `stale`, `done`, `archived`, or `""` (the empty string, which makes the card a document)

### Context Not Found

**Problem:** `context "work" not found`

**Solution:** Create the context first:
```bash
ud config set-context work --api-url https://ud.company.com
ud login --context work
```
