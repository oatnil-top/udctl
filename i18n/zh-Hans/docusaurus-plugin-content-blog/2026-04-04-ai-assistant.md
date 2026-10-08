---
title: UnDercontrol 的 AI 工作流——从收据到记录，只需几秒
description: 了解 UnDercontrol 的 AI 助手如何将照片、文字和语音转化为结构化的支出与任务记录，以及如何通过 Apple Shortcuts 实现一键录入。
authors: [lintao]
tags: [feature]
date: 2026-04-04
---

个人财务和任务管理中最让人头疼的环节，往往不是做决策，而是录入数据。吃完午饭，手里拿着一张收据，却要打开 app、一路点开表单、输入金额、选择分类、再点保存。这样的操作每天要重复无数次——每杯咖啡、每次打车、每趟买菜——日积月累，就成了真实存在的摩擦。

UnDercontrol 的 AI 助手正是为了消除这种摩擦而设计的。下面介绍它在实际使用中的具体表现。

![AI assistant chat interface for logging expenses and creating tasks](https://dl.udctl.com/features/blog/ai-assistant/ai-chat.png)

![UnDercontrol dashboard — AI assistant integrates across all features](https://dl.udctl.com/features/blog/ai-assistant/dashboard.png)

## 拍张收据，跳过表单

最直接实用的 AI 功能是收据扫描。新建支出时，你可以上传一张照片——拖拽、从剪贴板粘贴或选择文件均可。AI 会读取图片，自动提取金额、货币、商家名称、日期，并给出一个建议分类。

它能处理揉皱的收据、倾斜的角度和不同格式的小票，表现相当稳定。有一个实用技巧值得记住：光线比摆放角度更重要。在充足光线下拍摄的清晰照片，几乎都能正确解析；而在昏暗餐厅里拍的模糊照片，则很可能识别失败。

你也可以一次批量上传多张收据，非常适合出差回来或积压了一周账单的情况。

## 文字输入，快速记账

并不是每笔支出都有收据。对于这类情况，直接用自然语言描述就好：

- "面馆吃午饭，18 美元"
- "从机场打车回家，34 欧元"
- "Figma 月订阅，15 美元"

AI 会将描述解析成填好各字段的结构化支出记录，比逐个点选表单快得多，在手机上尤其明显。

同样的方式也适用于任务。不需要填写任务表单，直接描述要做的事：

- "跟会计确认一季度税务的后续事宜"
- "在周五之前给 Sarah 买生日礼物"
- "调研自托管备份方案"

UnDercontrol 会根据描述生成结构化任务，包括标题、可推断的相关标签以及描述内容。你检查一遍，改掉不准确的地方，保存即可。

![Task list — AI can create and manage tasks from text or voice input](https://dl.udctl.com/features/blog/ai-assistant/task-list.png)

## 自然语言查询

当系统中积累了一定数量的任务和支出后，你可以用日常语言直接提问。比如"显示逾期任务"或"本周有什么待办"，这些问题会被转化为查询条件并返回匹配结果。这不是什么魔法——对于简单直接的问题效果最好——但它确实省去了记忆 UnDercontrol 查询语法的麻烦。

## Apple Shortcuts 集成

在 iOS 和 macOS 上，UnDercontrol 提供了 Apple Shortcuts，可以将 AI 功能接入系统的分享菜单和快捷指令自动化。实际好处就是：在设备上任意位置，一键即可完成录入。

最实用的一个快捷指令：用相机拍一张照片，运行该指令，收据就会作为支出记录保存下来，全程无需打开 app。你也可以分享文字内容——复制的邮件片段、一条消息、一条备忘录——直接从中创建任务。

快捷指令可在你的 UnDercontrol 实例的订阅/下载页面获取。

## 自带 AI 服务商

UnDercontrol 不绑定任何单一 AI 后端。你可以接入自己的 API key，来源可以是 OpenAI、Anthropic，或任何兼容 OpenAI 接口的服务。如果你希望所有计算都在本地完成、不依赖任何外部 API，也可以通过 Ollama 或 LM Studio 接入本地模型。

配置过程很简单：进入个人资料设置，找到 AI Providers 部分，添加服务商和 API key，选择模型，测试连接。你可以添加多个服务商并设置优先级，列表中第一个可用的服务商会被实际调用。

如果你运行的是多人共享的 UnDercontrol 实例，管理员还可以配置系统级服务商，供所有用户使用——对于家庭服务器或小型团队来说非常方便。

## 使用注意事项

AI 提取的准确率很高，但并非完美。保存之前，务必快速检查一下解析结果，尤其是金额和日期字段。如果收据上的合计金额在视觉上与小计行很接近，解析器可能会混淆。花两秒钟确认一下，远比事后追查一笔记错的账要省力得多。

对于文字输入，描述越具体，结果越准确。"咖啡"比"登机前在机场喝的咖啡，6.50 美元"更难分类。

## 开始使用

如果你已经在运行 UnDercontrol，前往个人资料设置，添加一个 AI 服务商。下次记录支出时，试着上传一张收据——工作流上的差异会立刻显现出来。

如果你还没有部署 UnDercontrol，自托管指南涵盖了从 Docker 部署到配置的全部内容：[UnDercontrol 文档](https://undercontrol.dev/docs/intro)。
