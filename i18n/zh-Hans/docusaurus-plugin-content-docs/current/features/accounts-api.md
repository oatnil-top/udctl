---
sidebar_position: 4
---

# Developer API Reference

## Overview

The Accounts API provides RESTful endpoints for managing financial accounts in UnderControl. All endpoints require authentication via Bearer token.

## Authentication

All account endpoints require JWT authentication:

```http
Authorization: Bearer <access_token>
```

## Base URL

下面所有路径都相对于你的服务器 API 根地址 —— 常规情况就是你自己的服务器：

```
https://<your-server>/api/v1
```

本地开发：
```
http://localhost:4000/api/v1
```

如果用的是我们跑的那台试用**测试服**，根地址是 `https://api.oatnil.com/api/v1`。注意
`https://app.udctl.com` 是网页应用，不是 API：它下面的每个 API 路径都返回 404。

## Endpoints

### List User Accounts

Retrieve all accounts belonging to the authenticated user.

**Endpoint:** `GET /account`

**Response:** `200 OK`
```json
{
  "accounts": [
    {
      "id": "uuid-string",
      "owner_id": "user-uuid",
      "name": "Checking Account",
      "balance": {
        "amount": 5000.00,
        "currency": "USD"
      },
      "notes": "Primary checking",
      "tags": ["primary", "checking"],
      "off_budget": false,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:00Z"
    }
  ],
  "count": 1
}
```

### Get Account Homepage

Retrieve aggregated account data for the homepage view.

**Endpoint:** `GET /account/homepage`

**Response:** `200 OK`
```json
{
  "accountCount": 5,
  "total": 15000.00,
  "budgetTotal": 10000.00,
  "offBudgetTotal": 5000.00,
  "budgetAccounts": [
    {
      "id": "uuid-string",
      "name": "Checking",
      "balance": {
        "amount": 5000.00,
        "currency": "USD"
      },
      "off_budget": false,
      "tags": [],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:00Z"
    }
  ],
  "offBudgetAccounts": [
    {
      "id": "uuid-string",
      "name": "Investment",
      "balance": {
        "amount": 5000.00,
        "currency": "USD"
      },
      "off_budget": true,
      "tags": ["investment"],
      "created_at": "2024-01-10T09:00:00Z",
      "updated_at": "2024-01-18T11:30:00Z"
    }
  ]
}
```

### Create Account

Create a new account for the authenticated user.

**Endpoint:** `POST /account`

**Request Body:**
```json
{
  "name": "Savings Account",
  "balance": {
    "amount": 1000.00,
    "currency": "USD"
  },
  "notes": "Emergency fund",
  "off_budget": true
}
```

**Validation Rules:**
- `name`: Required, 1-100 characters
- `balance`: Required, valid Money object
- `notes`: Optional, max 500 characters
- `off_budget`: Optional, defaults to false

**Response:** `201 Created`
```json
{
  "id": "new-uuid-string",
  "owner_id": "user-uuid",
  "name": "Savings Account",
  "balance": {
    "amount": 1000.00,
    "currency": "USD"
  },
  "notes": "Emergency fund",
  "tags": [],
  "off_budget": true,
  "created_at": "2024-01-25T16:00:00Z",
  "updated_at": "2024-01-25T16:00:00Z"
}
```

### Get Account by ID

Retrieve a specific account by its ID.

**Endpoint:** `GET /account/{id}`

**Path Parameters:**
- `id`: Account UUID (required)

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "owner_id": "user-uuid",
  "name": "Checking Account",
  "balance": {
    "amount": 5000.00,
    "currency": "USD"
  },
  "notes": "Primary checking",
  "tags": ["primary", "checking"],
  "off_budget": false,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:45:00Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Account not found"
}
```

### Get Account Details with History

Retrieve account with complete history of changes.

**Endpoint:** `GET /account/{id}/details`

**Path Parameters:**
- `id`: Account UUID (required)

**Response:** `200 OK`
```json
{
  "account": {
    "id": "uuid-string",
    "owner_id": "user-uuid",
    "name": "Checking Account",
    "balance": {
      "amount": 5000.00,
      "currency": "USD"
    },
    "notes": "Primary checking",
    "tags": ["primary", "checking"],
    "off_budget": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:45:00Z"
  },
  "histories": [
    {
      "id": "history-uuid-1",
      "account_id": "uuid-string",
      "owner_id": "user-uuid",
      "name": "Checking Account",
      "balance": {
        "amount": 4500.00,
        "currency": "USD"
      },
      "notes": "Primary checking",
      "tags": ["primary", "checking"],
      "off_budget": false,
      "created_at": "2024-01-20T14:45:00Z",
      "updated_at": "2024-01-20T14:45:00Z"
    },
    {
      "id": "history-uuid-2",
      "account_id": "uuid-string",
      "owner_id": "user-uuid",
      "name": "Checking Account",
      "balance": {
        "amount": 3000.00,
        "currency": "USD"
      },
      "notes": "Primary checking",
      "tags": ["primary"],
      "off_budget": false,
      "created_at": "2024-01-18T09:00:00Z",
      "updated_at": "2024-01-18T09:00:00Z"
    }
  ]
}
```

### Update Account

Update an existing account's details.

**Endpoint:** `PUT /account/{id}`

**Path Parameters:**
- `id`: Account UUID (required)

**Request Body:**
```json
{
  "name": "Updated Account Name",
  "balance": {
    "amount": 6000.00,
    "currency": "USD"
  },
  "notes": "Updated notes",
  "off_budget": false
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "owner_id": "user-uuid",
  "name": "Updated Account Name",
  "balance": {
    "amount": 6000.00,
    "currency": "USD"
  },
  "notes": "Updated notes",
  "tags": ["primary", "checking"],
  "off_budget": false,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-25T17:00:00Z"
}
```

### Delete Account

Permanently delete an account.

**Endpoint:** `DELETE /account/{id}`

**Path Parameters:**
- `id`: Account UUID (required)

**Response:** `204 No Content`

**Error Response:** `404 Not Found`
```json
{
  "error": "Account not found"
}
```

## Data Models

### AccountResponseDTO

```typescript
interface AccountResponseDTO {
  id: string;
  owner_id: string;
  name: string;
  balance: MoneyDTO;
  notes?: string;
  tags: string[];
  off_budget: boolean;
  created_at: string;
  updated_at: string;
}
```

### MoneyDTO

```typescript
interface MoneyDTO {
  amount: number;
  currency: string;
}
```

### CreateAccountDTO

```typescript
interface CreateAccountDTO {
  name: string;           // Required, 1-100 characters
  balance: MoneyDTO;      // Required
  notes?: string;         // Optional, max 500 characters
  off_budget?: boolean;   // Optional, defaults to false
}
```

### UpdateAccountDTO

```typescript
interface UpdateAccountDTO {
  name?: string;          // Optional, 1-100 characters
  balance?: MoneyDTO;     // Optional
  notes?: string;         // Optional, max 500 characters
  off_budget?: boolean;   // Optional
}
```

### AccountHomepageResponseDTO

```typescript
interface AccountHomepageResponseDTO {
  accountCount: number;
  total: number;
  budgetTotal: number;
  offBudgetTotal: number;
  budgetAccounts: AccountResponseDTO[];
  offBudgetAccounts: AccountResponseDTO[];
}
```

### AccountDetailsResponseDTO

```typescript
interface AccountDetailsResponseDTO {
  account: AccountResponseDTO;
  histories: AccountHistoryResponseDTO[];
}
```

### AccountHistoryResponseDTO

```typescript
interface AccountHistoryResponseDTO {
  id: string;
  account_id: string;
  owner_id: string;
  name: string;
  balance: MoneyDTO;
  notes?: string;
  tags: string[];
  off_budget: boolean;
  created_at: string;
  updated_at: string;
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message",
  "code": "VALIDATION_ERROR"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied",
  "code": "ACCESS_DENIED"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute per user
- 1000 requests per hour per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706186400
```

## Examples

### cURL Examples

**List all accounts:**
```bash
curl -X GET https://<your-server>/api/v1/account \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Create a new account:**
```bash
curl -X POST https://<your-server>/api/v1/account \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Savings",
    "balance": {
      "amount": 1000.00,
      "currency": "USD"
    },
    "off_budget": true
  }'
```

**Update an account:**
```bash
curl -X PUT https://<your-server>/api/v1/account/ACCOUNT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "balance": {
      "amount": 1500.00,
      "currency": "USD"
    }
  }'
```

### JavaScript/TypeScript Example

```typescript
import { apiClient } from '@/lib/api/api-client';

// List accounts
const accounts = await apiClient.account.getUserAccounts();

// Create account
const newAccount = await apiClient.account.createAccount({
  name: "Emergency Fund",
  balance: {
    amount: 5000,
    currency: "USD"
  },
  notes: "For emergencies only",
  off_budget: true
});

// Update account
const updated = await apiClient.account.updateAccount(accountId, {
  balance: {
    amount: 5500,
    currency: "USD"
  }
});

// Delete account
await apiClient.account.deleteAccount(accountId);
```