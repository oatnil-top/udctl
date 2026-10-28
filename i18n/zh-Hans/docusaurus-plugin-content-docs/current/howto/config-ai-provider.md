---
title: 配置 AI 提供商
sidebar_position: 1
---

# 配置 AI 提供商

了解如何为 UnDercontrol 添加自己的 AI 提供商，用于 AI 聊天和智能功能（如任务摘要、智能分类）。

## 前提条件

- UnDercontrol 账户（已注册用户，非访客）
- AI 提供商的 API 密钥（OpenAI、GitHub Models 或任何 OpenAI 兼容服务）

## 步骤

### 步骤 1：进入设置页面

点击左侧栏最下方的 **设置**。

### 步骤 2：打开 AI 与模型

在设置左边那一列分组里，点击 **AI 与模型**。

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
- **前端**（开关）：启用后，浏览器端的 AI 功能(如编辑器里改写、翻译选中的文字)将使用此提供商

两个开关都显示 **Available** 即为启用状态。

![步骤 5：设置可用范围](https://dl.udctl.com/features/howto/config-ai-provider/5-set-fe-be-avail.jpg)

### 步骤 6：使用 AI 聊天

在侧栏打开 **对话**，点 **新对话**，输入问题后发送。回答来自打开了 **后端** 开关的提供商。想让 agent 加入，在同一个对话里输入 `@` 并选择它，比如 Alfred。

## 结果

现在你已经配置好了 AI 提供商，可以：

- 在对话里提问，并用 `@` 请 agent 加入
- 获取 AI 驱动的任务摘要和建议（需启用后端）
- 在任何页面用悬浮 AI 窗口(Ctrl+J)提问：它显示的是你的一条对话，就是 **对话** 里的那一条

## 使用技巧

- 你可以添加多个提供商
- 使用 **Custom (OpenAI-compatible)** 类型来接入 GitHub Models、Azure OpenAI 或支持 OpenAI API 格式的本地 LLM
- 对话(包括悬浮 AI 窗口 Ctrl+J)需要 **后端** 开关;**前端** 开关用于编辑器的 AI 操作
- 后端 AI 功能需要同时启用后端开关

## 相关文档

- [AI 助手](/docs/features/ai-assistant)
