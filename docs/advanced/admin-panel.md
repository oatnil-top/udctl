---
sidebar_position: 4
---

# Admin Panel

## What is the Admin Panel?

The Admin Panel is your control center for managing the entire udctl instance. From here, administrators can manage users, configure system settings, monitor background tasks, and set up integrations. It's designed for self-hosted deployments where you need full control over your system.

## Dashboard

The admin dashboard gives you a quick overview of your system:
- **User counts** - Total users, admins, regular users, and visitors
- **Content counts** - Total accounts, budgets, expenses, and tasks
- **Queue status** - Number of pending background tasks

## Main Features

### User Management
Manage all users in your system:
- **View all users** - See usernames, roles, group memberships, and last activity
- **Create users** - Add new users with a username, password, and role
- **Change roles** - Promote users to admin or change their system role
- **Assign RBAC roles** - Give users custom roles with specific permissions
- **Delete users** - Remove users (with confirmation, and you can't delete yourself)

#### System Roles

| Role | Description |
|------|-------------|
| **Admin** | Full system access and admin panel |
| **User** | Standard access to all core features |
| **Visitor** | Limited, temporary access |
| **Service** | Non-loginable accounts for system integrations |

### Role Management (RBAC)
Create and manage custom roles with fine-grained permissions:
- **System roles** - Built-in roles (admin, user, visitor) that cannot be modified
- **Custom roles** - Create roles tailored to your organization's needs
- **Permission selection** - Choose from task, expense, budget, account, file, and feature permissions
- **Assign to users** - Apply custom roles to any user

### Group Management
Oversee all groups across the system:
- **View all groups** - See group names, owners, and member counts
- **Manage members** - Add or remove members from any group
- **Create and delete groups** - Set up or remove groups as needed

### System Configuration
Configure your udctl instance across multiple categories:

#### Storage (S3/R2)
- Enable S3-compatible storage
- Set endpoint, region, bucket, and credentials
- Configure max file size
- Test your storage connection

#### Identity (OAuth)
- **GitHub OAuth** - Enable GitHub login with client ID and secret
- **Google OAuth** - Enable Google login with client ID and secret
- Configure redirect URLs for each provider

#### Integrations
- **Slack** - Set up webhook URL for notifications
- **OCR** - Configure external OCR endpoint for document processing

#### Telemetry
- Enable OpenTelemetry for monitoring
- Configure endpoint, headers, and service name

#### Scheduler
- Enable/disable the cron scheduler
- Configure visitor cleanup (schedule and retention)
- Configure backup schedule and retention

#### Security
- Set CORS allowed origins

#### General
- Configure frontend URL and host domain

Each configuration category includes a **Test** button to verify your settings work before saving.

### AI Provider Management
Configure system-level AI providers that are available to all users:
- Add providers (OpenAI, Anthropic, or OpenAI-compatible)
- Set API keys, models, and endpoints
- Toggle backend and frontend availability
- Drag-and-drop to reorder provider priority
- Test provider connectivity
- View startup-configured providers (read-only)

### Queue Task Monitoring
Monitor all background processing tasks:
- View all queued tasks across the system
- Filter by task type and status
- See task details, progress, and error messages
- Track which user triggered each task

### Backup Management
Manage database backups from the admin panel:
- Trigger manual backups
- View backup history with status and file sizes
- Download completed backups

## Tips for Success

1. **Set up OAuth early** - Configure GitHub or Google OAuth so users have convenient login options

2. **Configure S3 storage** - Set up S3-compatible storage for file uploads and backups before users start uploading

3. **Create custom roles** - If you have different user types (e.g., managers vs. team members), create roles that match their access needs

4. **Monitor the queue** - Check queue tasks periodically to catch any failed background jobs

5. **Test configurations** - Always use the Test button after changing system configuration to verify it works

6. **Regular backups** - Enable scheduled backups and verify they're completing successfully

## How the Admin Panel Works with Other Features

### With User Authentication
The admin panel manages users and roles that power the entire authentication and authorization system across udctl.

### With AI Features
System-level AI providers configured here serve as the default for users who haven't set up their own providers.

### With Collaboration
Groups and roles managed here control sharing permissions and team workspace access.

### With Backups
The admin panel is where you trigger, monitor, and download database backups.

## Getting Started

1. **Log in as admin** - Open **Settings** at the bottom of the left sidebar, then **Admin** (only admins see it)
2. **Review the dashboard** - Check system statistics and user counts
3. **Configure storage** - Set up S3 storage if you haven't already
4. **Set up OAuth** - Configure at least one OAuth provider for easy user login
5. **Create your first custom role** - Define a role that fits your team's workflow
