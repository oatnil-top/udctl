---
sidebar_position: 1
---

# Scheduled Jobs

## What are Scheduled Jobs?

Scheduled Jobs let you automate recurring work in udctl. Instead of manually creating the same tasks every day or week, you set up a job once and it runs automatically on your chosen schedule. You can also use AI-powered summary jobs that analyze your tasks and generate digest reports.

## Job Types

### Task Creation Jobs
Automatically create tasks on a schedule. Perfect for:
- **Daily standup notes** - A fresh task every morning for your daily log
- **Weekly reviews** - A task each week to review progress
- **Monthly reports** - Recurring reminders to prepare monthly summaries
- **Any repeating work** - Anything you do on a regular cycle

### AI Task Summary Jobs
Query your existing tasks and let AI generate a summary:
1. You define which tasks to include (using a query filter)
2. The AI analyzes those tasks and writes a summary
3. A new task is created with the AI-generated content
4. Referenced tasks are linked in the summary

This is great for automated weekly digests, project status reports, or sprint summaries.

### Conversation Message Jobs
Post a message into a conversation on a schedule, as if you had typed it there. This is how a standing task lives in a conversation: the morning review, a weekly check-in, anything you would otherwise ask by hand at the same time every day.

- **The same conversation every run** (the default): name the conversation's card. Each run adds to the same thread, so the agent answers with everything said there before, and you reply to it in the same place.
- **A new conversation every run**: turn on *new each run* instead of naming a card. Each run opens a conversation titled with the job's name and the date, for jobs whose history would only make one thread grow without end.

The message mentions the agent you pick and asks your prompt. It is then answered exactly like a message you typed: an agent that can run on the **server** answers with no machine of yours online, and you can name where it runs (`server`, `daemon`, or one machine) the same way you would in a mention. Leave the agent out to mention no one. The job checks when you save it that the conversation, the agent and the runtime are all reachable, and refuses with the reason if not.

A run counts as successful once the message is in the conversation. The answer appears in the conversation, not in the run history; if the agent's machine is offline, the conversation says so and offers the server instead.

## Creating a Scheduled Job

You have three ways to create a job:

### From a Template
Choose from four preset templates to get started quickly:
- **Daily Notes** - Creates a task every day for journaling or standups
- **Weekly Review** - Creates a weekly review task
- **Weekly AI Summary** - AI-generated task summary each week
- **Monthly Report** - Monthly reporting task

### With AI Generation
Describe what you want in plain language (like "Create a task every weekday at 9am for standup notes") and AI will generate the job configuration for you.

### Manual Configuration
Build the job from scratch:
1. Set a **name** and **description**
2. Choose the **job type** (task creation or AI summary)
3. Configure the **schedule** using presets or a custom CRON expression
4. Set your **timezone**
5. Configure the **task template** with title, description, tags, and deadline

## Scheduling

### Preset Schedules
Quick options for common patterns:
- Every day
- Every weekday (Monday through Friday)
- Every week
- Every month

### Custom CRON Expressions
For precise control, use standard 5-field CRON expressions:
- `0 9 * * MON-FRI` - Every weekday at 9:00 AM
- `0 18 * * FRI` - Every Friday at 6:00 PM
- `0 0 1 * *` - First day of every month at midnight

All schedules respect your configured timezone.

## Template Variables

Make your auto-created tasks dynamic with template variables in titles and descriptions:

| Variable | What it shows | Example |
|----------|---------------|---------|
| `{{date}}` | Current date | 2025-03-15 |
| `{{week}}` | ISO week number | 11 |
| `{{month}}` | Month name | March |
| `{{year}}` | Year | 2025 |
| `{{dow}}` | Day of week | Saturday |
| `{{ai_title}}` | AI-generated title | Weekly Summary |

**Example title**: `Standup Notes - {{date}} ({{dow}})` produces "Standup Notes - 2025-03-15 (Saturday)"

## Deadlines

Set relative deadlines for auto-created tasks:
- `+1d` - Due one day after creation
- `+7d` - Due one week after creation
- `end_of_week` - Due at the end of the current week
- `end_of_month` - Due at the end of the current month

## Managing Jobs

### Enable and Disable
Toggle jobs on and off without deleting them. A disabled job keeps its configuration and history but won't run until re-enabled.

### Run Now
Need a task created immediately? Click "Run Now" to execute any job on demand without waiting for the next scheduled time.

### Duplicate
Found a job configuration you like? Duplicate it and tweak the copy for a different use case.

### Run History
Every job execution is tracked with:
- **Status** - Success, failed, or timed out
- **Duration** - How long the job took to run
- **Results** - What was created or any error details
- **Expandable details** - Full execution information

## Tips for Success

1. **Start with templates** - The preset templates cover the most common use cases and are easy to customize
2. **Use template variables** - Dynamic titles like `Weekly Review - Week {{week}}` make it easy to identify tasks later
3. **Set reasonable deadlines** - Relative deadlines keep auto-created tasks actionable
4. **Review run history** - Check that your jobs are running successfully, especially after creating new ones
5. **Try AI summaries** - They're a great way to get automated project digests without any manual effort

## How Scheduled Jobs Work with Other Features

### With Tasks
Task creation jobs produce regular tasks that appear in your task list, kanban boards, and all other views. They work exactly like manually created tasks.

### With AI Features
AI summary jobs use the AI assistant to analyze your tasks and generate meaningful summaries, combining automation with intelligent content creation.

## Getting Started

1. **Go to Scheduled Jobs**: click **Settings** at the bottom of the left sidebar, then **Automation → Scheduled Jobs**
2. **Create a job from a template** - Try "Daily Notes" to see how it works
3. **Click Run Now** to test your job immediately
4. **Check your task list** - The auto-created task appears just like any other task
5. **Customize** - Edit the job to adjust the schedule, title template, or tags to fit your workflow
