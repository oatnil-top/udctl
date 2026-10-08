---
title: Configure AI Provider
sidebar_position: 1
---

# Configure AI Provider

Learn how to add your own AI provider to udctl for AI chat and smart features like task summaries and intelligent categorization.

## Prerequisites

- An udctl account (registered user, not visitor)
- An API key from an AI provider (OpenAI, GitHub Models, or any OpenAI-compatible service)

## Steps

### Step 1: Go to Settings

Click your username at the bottom-left corner of the sidebar to open the Settings page.

![Step 1: Go to Settings](https://dl.udctl.com/features/howto/config-ai-provider/1-goto-config-page.jpg)

### Step 2: Open AI Configuration

In the settings sidebar, click the **AI Configuration** section.

![Step 2: Open AI Configuration](https://dl.udctl.com/features/howto/config-ai-provider/2-goto-ai-config-section.jpg)

### Step 3: Add an AI Provider

Click the **+ Add Provider** button. In the dialog, fill in:

- **Name**: A friendly name for the provider (e.g., "Github")
- **Provider Type**: Select the provider type (OpenAI, Custom OpenAI-compatible, etc.)
- **API Key**: Your API key from the provider
- **API Base URL**: The provider's API endpoint (e.g., `https://models.github.ai/inference`)
- **Model**: The model to use (e.g., `gpt-4o`)

![Step 3: Add AI Provider](https://dl.udctl.com/features/howto/config-ai-provider/3-add-ai-provider.jpg)

### Step 4: Test the Connection

Click the **Test Connection** button to verify your API key and configuration are correct. A green checkmark confirms the connection is successful.

![Step 4: Test Connection](https://dl.udctl.com/features/howto/config-ai-provider/4-test-connection.jpg)

### Step 5: Set Availability

After creating the provider, configure where it can be used:

- **Backend** (toggle): Enable for server-side AI features such as task summaries and smart categorization
- **Frontend** (toggle): Enable for browser-side AI chat

Both toggles will show **Available** when enabled.

![Step 5: Set Availability](https://dl.udctl.com/features/howto/config-ai-provider/5-set-fe-be-avail.jpg)

### Step 6: Chat with AI

Open any task and click the **AI Chat** panel on the right side. Select your newly configured provider from the dropdown menu to start a conversation.

![Step 6: Chat with AI](https://dl.udctl.com/features/howto/config-ai-provider/6-chat-with-ai-using-this-provider.jpg)

## Result

You now have a fully configured AI provider. You can:

- Use AI chat from any task's detail page
- Get AI-powered task summaries and suggestions (if backend is enabled)
- Switch between multiple providers in the AI chat dropdown

## Tips

- You can add multiple providers and switch between them in the AI chat panel
- Use **Custom (OpenAI-compatible)** provider type for services like GitHub Models, Azure OpenAI, or local LLMs that support the OpenAI API format
- If you only need chat features, enabling just the **Frontend** toggle is sufficient
- Backend AI features require the provider to be enabled on the backend toggle

## Related

- [AI Assistant](/docs/features/ai-assistant)
