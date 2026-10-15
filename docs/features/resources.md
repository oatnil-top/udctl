---
sidebar_position: 10
---

# Resource Management

## What are Resources?

Resources in udctl are files you upload and attach to your tasks, expenses, budgets, and accounts. Whether it's a receipt photo, a project document, or a design diagram, resources keep all your important files organized alongside the items they belong to.

## What You Can Upload

udctl accepts all file types. Common examples include:
- **Images** - Photos, screenshots, receipts (JPEG, PNG, etc.)
- **Documents** - PDFs, spreadsheets, presentations
- **Diagrams** - Drawio diagrams with in-app editing support
- **Other files** - Any file type you need to keep organized

## Main Features

### Upload Files
You can upload files in several ways:
- **Drag and drop** files directly into the upload area
- **Browse** your computer to select files
- **Paste from clipboard** using Ctrl+V (great for screenshots)
- **Upload from CLI** for terminal-based workflows

### Gallery and List Views
The Resources page gives you two ways to browse your files:
- **Gallery view** - Visual grid with thumbnails for images
- **List view** - Detailed table with file names, types, and dates

### Filtering and Search
Quickly find what you need:
- **Filter by type** - Show only images, documents, or specific resource types
- **Filter by entity** - See files attached to tasks, expenses, budgets, or accounts
- **Date range** - Find files uploaded within a specific time period
- **Search** - Search by file name or description

### Resource Inspector
Click on any resource to see its full details:
- File metadata (size, type, upload date)
- EXIF data for photos (camera info, location, dimensions)
- Which items the file is attached to
- Download link

### Attach to Items
A single file can be linked to multiple items:
- Attach a receipt to an expense
- Link a document to a task
- Connect a file to a budget or account
- Unlink files when they're no longer relevant

### Diagram Editing
udctl includes built-in support for drawio diagrams. You can create and edit diagrams directly in the app without needing external tools.

### AI Integration
For image resources, you can interact with AI to analyze the content - useful for extracting text from receipts or understanding document contents.

## CLI Commands

Upload files directly from your terminal:

```bash
# Upload a file
ud upload resource ./receipt.png

# Upload and attach to a task
ud upload resource ./design.pdf --entity-type todolist --entity-id abc123

# Upload and attach to an expense (shorthand flags)
ud upload resource ./photo.jpg -t expense -e exp-456

# Attach an existing resource to an item
ud attach resource <resource-id> --entity-type todolist --entity-id abc123
```

## Deleting and Restoring

Deleting a file moves it to the recycle bin. It leaves every list, attachment, and timeline, and you can bring it back at any time.

- **Restore**: open the Trash page in the web app, or run `ud restore file <name|id>`.
- **List the bin**: the Trash page, or `ud get file --deleted`.
- **Delete for good**: the Trash page, or `ud delete file <id> --permanent`. This also works on a file that is still live.

A file in the bin keeps counting against your storage quota, and so do its earlier versions. Only deleting it for good releases that space. A permanent delete removes the file, its thumbnail, its versions and its links to other items, and it cannot be undone.

## Storage Quotas

- **Regular users** - 1 GB total storage, 10 MB per file
- **Admin users** - Unlimited storage and file sizes

You can check your current storage usage on the Resources page, which shows a breakdown by file type.

## Tips for Success

1. **Use meaningful file names** - Name your files descriptively before uploading so they're easy to find later

2. **Attach files to items** - Link resources to the relevant tasks or expenses so everything stays connected

3. **Check your storage** - Keep an eye on your storage usage from the Resources page

4. **Use the gallery view for images** - The thumbnail grid makes it easy to visually browse photos and screenshots

5. **Bulk delete when needed** - Select multiple resources to clean up files you no longer need

## How Resources Work with Other Features

### With Tasks
Attach files to tasks as attachments, embed images in task descriptions, or add files to task notes. Shared tasks make their attached resources accessible to group members.

### With Expenses
Attach receipt photos or invoices to expenses. AI vision can automatically extract expense details from receipt images.

### With Budgets and Accounts
Link supporting documents to budgets and accounts for reference.

## Getting Started

1. **Visit the Resources page** - See all your uploaded files in one place
2. **Upload your first file** - Drag and drop or click to browse
3. **Attach it to an item** - Link the file to a relevant task or expense
4. **Explore the inspector** - Click a resource to see its full details and metadata
