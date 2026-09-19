---
sidebar_position: 3
---

# API Keys

## What are API Keys?

API keys give you programmatic access to the udctl API. Use them to connect the CLI, build integrations, or automate workflows - all without sharing your password. Each key has its own set of permissions and expiration, so you stay in control.

:::info
API keys require a licensed deployment. The **Personal** tier does not include them; every
licensed band does — **Small team** (free license), **Team**, and **Unlimited**. See the
[Pricing](/docs/pricing) page.
:::

## Main Features

### Create Keys with Scoped Permissions
Each API key gets a specific subset of your permissions. You choose exactly what the key can do:
- **Task permissions** - Read, create, update, or delete tasks
- **Expense permissions** - Read, create, update, delete, or export expenses
- **Budget permissions** - Read, create, update, or delete budgets
- **Account permissions** - Read, create, update, or delete accounts
- **File permissions** - Read, upload, or delete files
- **Feature permissions** - AI features, advanced search, sharing, and more

A key can never have more permissions than your own account.

### Configurable Expiration
Set how long each key is valid:

| Option | Duration |
|--------|----------|
| 1 hour | Quick, temporary access |
| 1 day | Short-term use |
| 7 days | Weekly tasks |
| 30 days | Monthly cycles |
| 90 days | Quarterly review |
| 1 year | Long-term integrations |
| Never | No expiration |

### Secure by Design
- **One-time display** - The full key is shown only when you create it. Copy it right away because you won't be able to see it again.
- **Hashed storage** - Keys are stored as secure hashes, never in plaintext
- **Immediate revocation** - Delete a key and it stops working instantly
- **Last-used tracking** - See when each key was last used

## How to Create an API Key

1. Go to your **Profile** page
2. Find the **API Key Management** section
3. Click **Create API Key**
4. Enter a descriptive name (e.g., "CLI Access" or "CI/CD Pipeline")
5. Select the permissions this key should have
6. Choose an expiration period
7. Click create and **copy the key immediately**

:::tip
Give your keys descriptive names like "MacBook CLI" or "GitHub Actions" so you can easily identify them later.
:::

## Using API Keys

### With the CLI
Store your API key in the CLI configuration:

```yaml
# ~/.config/ud/config.yaml
contexts:
  - name: work
    apiUrl: http://your-server:8889
    apiKey: ak_...
```

Verify it's working:
```bash
ud config get-contexts
# Shows "(api-key)" for API key contexts
```

### With HTTP Requests
Use the key as a Bearer token in the Authorization header:

```
Authorization: Bearer ak_your_key_here
```

The key works with any API endpoint that your key's permissions allow.

## Managing Your Keys

### Viewing Keys
Your Profile page shows all your API keys with:
- Key name
- Assigned permissions (shown as badges)
- Creation date
- Last used date
- Expiration status

### Revoking Keys
To revoke a key:
1. Find the key in your API Key Management section
2. Click **Delete**
3. Confirm the deletion

The key stops working immediately. This cannot be undone - you'll need to create a new key if you need access again.

## Tips for Success

1. **Use descriptive names** - Name keys after their purpose so you know which to revoke if needed

2. **Minimize permissions** - Only grant the permissions each key actually needs. A CI/CD key that only creates tasks doesn't need expense permissions

3. **Set expiration** - Use the shortest expiration that makes sense for your use case. Rotate long-lived keys periodically

4. **Copy immediately** - The full key is shown only once at creation. Copy it to a secure location right away

5. **Revoke unused keys** - Regularly review your keys and delete any you're no longer using

## How API Keys Work with Other Features

### With the CLI
The CLI uses API keys for authentication, allowing you to manage tasks, expenses, and other items from your terminal without interactive login.

### With Permissions
API keys use the same permission system as regular authentication. The permissions you select at creation determine exactly what the key can access.

### With All API Endpoints
API keys work with any endpoint that the key's permissions cover - tasks, expenses, budgets, accounts, files, and AI features.

## Getting Started

1. **Go to your Profile** - Find the API Key Management section
2. **Create your first key** - Give it a name, select permissions, and set an expiration
3. **Copy the key** - Save it securely (you won't see it again)
4. **Test it out** - Use it with the CLI or make an API call to verify it works
