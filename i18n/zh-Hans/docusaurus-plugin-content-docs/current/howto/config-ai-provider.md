---
title: 配置 AI 提供商
sidebar_position: 1
---

# 配置 AI 提供商

了解如何为 UnderControl 添加自己的 AI 提供商，用于 AI 聊天和智能功能（如任务摘要、智能分类）。

## 前提条件

- UnderControl 账户（已注册用户，非访客）
- AI 提供商的 API 密钥（OpenAI、GitHub Models 或任何 OpenAI 兼容服务）

## 步骤

### 步骤 1：进入设置页面

点击左下角的用户名，进入设置页面。

![步骤 1：进入设置页面](https://dl.udctl.com/features/howto/config-ai-provider/1-goto-config-page.jpg)

### 步骤 2：打开 AI 配置

在设置侧边栏中，点击 **AI 配置** 选项。

![步骤 2：打开 AI 配置](https://dl.udctl.com/features/howto/config-ai-provider/2-goto-ai-config-section.jpg)

### 步骤 3：添加 AI 提供商

点击 **+ 添加提供商** 按钮，在弹窗中填写以下信息：

- **名称**：为提供商起一个便于识别的名字（例如 "Github"）
- **提供商类型**：选择提供商类型（OpenAI、Custom OpenAI-compatible 等）
- **API Key**：输入你从提供商获取的 API 密钥
- **API Base URL**：提供商的 API 端点地址（例如 `https://models.github.ai/inference`）
- **模型**：要使用的模型名称（例如 `gpt-4o`）

![步骤 3：添加 AI 提供商](https://dl.udctl.com/features/howto/config-ai-provider/3-add-ai-provider.jpg)

### 步骤 4：测试连接

点击 **Test Connection** 按钮验证 API 密钥和配置是否正确。绿色勾号表示连接成功。

![步骤 4：测试连接](https://dl.udctl.com/features/howto/config-ai-provider/4-test-connection.jpg)

### 步骤 5：设置可用范围

创建提供商后，配置其可用范围：

- **后端**（开关）：启用后，服务器端 AI 功能（如任务摘要、智能分类）将使用此提供商
- **前端**（开关）：启用后，浏览器端 AI 聊天将使用此提供商

两个开关都显示 **Available** 即为启用状态。

![步骤 5：设置可用范围](https://dl.udctl.com/features/howto/config-ai-provider/5-set-fe-be-avail.jpg)

### 步骤 6：使用 AI 聊天

打开任意任务，点击右侧的 **AI 对话** 面板。在下拉菜单中选择你刚配置的提供商，即可开始对话。

![步骤 6：使用 AI 聊天](https://dl.udctl.com/features/howto/config-ai-provider/6-chat-with-ai-using-this-provider.jpg)

## 结果

现在你已经配置好了 AI 提供商，可以：

- 在任意任务详情页使用 AI 聊天
- 获取 AI 驱动的任务摘要和建议（需启用后端）
- 在 AI 聊天下拉菜单中切换不同的提供商

## 使用技巧

- 你可以添加多个提供商，在 AI 聊天面板中随时切换
- 使用 **Custom (OpenAI-compatible)** 类型来接入 GitHub Models、Azure OpenAI 或支持 OpenAI API 格式的本地 LLM
- 如果只需要聊天功能，启用 **前端** 开关即可
- 后端 AI 功能需要同时启用后端开关

## 相关文档

- [AI 助手](/docs/features/ai-assistant)
