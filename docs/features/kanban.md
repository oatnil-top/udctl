---
sidebar_position: 9
---

# Kanban Boards

## What are Kanban Boards?

Kanban Boards give you a visual, column-based way to manage your tasks. Each column represents a stage of work, and you move tasks between columns by dragging and dropping. When a task moves to a new column, its status updates automatically - no extra clicks needed.

## Board Types

### All Tasks Board
Every user starts with a built-in "All Tasks" board that shows all your tasks in eleven columns, left to right:
- **Awaiting Decision** - Open tasks tagged `awaiting-decision`: they wait for you to decide. Most recently updated first.
- **Follow-up** - Open tasks tagged `follow-up`: someone has to chase them. Earliest deadline first.
- **Recent Created** - Every task, newest first, whatever its status
- **Recent Updated** - Every task, most recently changed first, whatever its status
- **Draft** - Tasks tagged `draft`
- **Todo** - Tasks ready to start
- **In Progress** - Tasks you're actively working on
- **Pending** - Tasks waiting on something
- **Stale** - Tasks that haven't been touched recently
- **Done** - Completed tasks
- **Archived** - Tasks filed away

"Open" means not done and not archived. Dragging a card into Awaiting Decision or Follow-up adds that column's tag, and dragging it out removes the tag; the card's status does not change. Moving a card from Awaiting Decision to Follow-up therefore swaps one tag for the other. Recent Created and Recent Updated have no filter, only a sort order, so dropping a card on them changes nothing. From the CLI, read a column with `ud get task --board __system_all_tasks__ --column Follow-up`.

The columns of this board are fixed. This board always appears first in your board selector and cannot be deleted.

### Private Boards
Create custom boards for specific projects or workflows. Private boards are only visible to you and can show all your tasks filtered through custom column configurations.

### Shared Boards
Share a board with a group for team collaboration. Shared boards only show tasks that belong to the board's group, making them ideal for team projects where everyone needs visibility into the work.

## Creating a Board

1. Open the board selector and click "Create Board"
2. Give your board a name (like "Sprint 12" or "Home Renovation")
3. Optionally set default tags that will be auto-applied to tasks created on this board
4. Your board is created with four columns split by status: **To Do**, **In Progress**, **Pending** and **Done**. Dragging a card into one of them sets the card to that status.

The Awaiting Decision and Follow-up columns are not part of a new board; they live on the All Tasks board. To have one on your own board, add a column with the query `tags = 'follow-up'` (or `tags = 'awaiting-decision'`). Boards you created earlier keep their columns.

## Working with Columns

### How Columns Work
Each column has a filter condition that determines which tasks appear in it. For example, a "Todo" column filters for `status = 'todo'`, so only tasks with that status show up there.

### Customizing Columns
You can configure each column with:
- **Name** - The column header (like "Ready for Review" or "Blocked")
- **Filter condition** - A query that determines which tasks belong in this column
- **Automatic actions** - What happens when a task enters or leaves the column

### Automatic Actions
This is where kanban boards become powerful. When you drag a task into a column, the board can automatically:
- **Set the status** - Moving to the "Done" column marks the task as done
- **Add tags** - Moving to a column can auto-tag the task
- **Update custom fields** - Change any custom field value based on column placement

Actions are auto-generated from your column's filter condition, so they stay in sync. You can also add manual actions for more complex workflows.

## Drag and Drop

Moving tasks between columns is as simple as dragging a card:
1. Click and hold a task card
2. Drag it to the target column
3. Drop it - the task's status, tags, or custom fields update automatically
4. The change happens instantly in your task list too

Drag and drop works with both mouse and keyboard for full accessibility.

## Creating Tasks on a Board

You can create tasks directly from a kanban board:
1. Click the add button on any column
2. Enter the task details
3. The task is automatically assigned to the board's group (for shared boards) and gets any default tags

## Filtering Within a Board

Even within a board, you can narrow down what you see:
- **Tag filter** - Show only cards with specific tags
- **Search** - Filter cards by title text

## Sharing a Board

To collaborate with others:
1. Open the board settings
2. Click "Share"
3. Select the group to share with
4. Group members can now see the board and interact with task cards

:::info
When you share a board, only tasks belonging to the board's group are visible. Team members can view and move cards based on their permissions.
:::

## Tips for Success

1. **Start with the All Tasks board** - Get familiar with the kanban view before creating custom boards
2. **Design columns around your workflow** - Not every board needs status columns; try columns like "This Week", "Next Week", "Backlog"
3. **Use shared boards for teams** - They keep everyone aligned on project status without extra meetings
4. **Keep columns manageable** - Too many cards in one column means it's time to break things down or archive completed work
5. **Let actions do the work** - Configure column actions so dragging a card handles all the bookkeeping automatically

## How Kanban Boards Work with Other Features

### With Tasks
Kanban cards are your tasks - the board is a visual layer on top of the task system. Any change you make on the board is reflected in your task list, and vice versa.

### With Collaboration
Shared boards use the group system for access control. The board creator acts as the group admin, and group members can view and interact with the board.

### With Tags and Custom Fields
Columns can filter on tags and custom fields, and automatic actions can modify them. This lets you build sophisticated workflows that go beyond simple status tracking.

## Getting Started

1. **Open the All Tasks board** - See your existing tasks laid out in kanban columns
2. **Drag a task** - Move a task from "Todo" to "In Progress" and watch the status update
3. **Create a custom board** - Set up a board for a specific project with columns that match your workflow
4. **Share with your team** - Invite collaborators by sharing the board with a group
