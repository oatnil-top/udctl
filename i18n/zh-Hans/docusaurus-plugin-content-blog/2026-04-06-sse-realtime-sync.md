---
title: 基于 Server-Sent Events 的多端实时同步
description: UnDercontrol 如何通过 Server-Sent Events 与事件驱动架构，在浏览器标签页、桌面端和移动端之间保持任务与财务数据的实时同步。
authors: [lintao]
tags: [feature]
date: 2026-04-06
---

如果你同时在浏览器标签页、桌面应用和手机上打开了 UnDercontrol，你自然希望它们保持同步。在一个地方添加任务，其他地方应该立即显示，无需刷新页面。记录一笔支出，预算应该在所有端实时更新。

这种实时同步听起来简单，但一旦考虑到重连、离线状态以及长连接的资源开销，复杂度就会迅速上升。以下是 UnDercontrol 的处理方式。

## 为什么选择 Server-Sent Events

WebSocket 是实时功能的常见选择，但它有额外的开销——双向连接、自定义协议处理，以及两端更高的实现复杂度。在 UnDercontrol 中，数据更新的流向几乎完全是单向的：服务端向客户端推送变更。这与 Server-Sent Events（SSE）完美契合。SSE 是所有现代浏览器内置支持的标准 HTTP 机制。

SSE 基于普通 HTTP 实现持久连接，浏览器规范内置自动重连能力，除了运行实例所用的 Go 后端外，不需要任何额外基础设施。这让自托管模式保持简洁。

## 工作原理

打开 UnDercontrol 时，前端会向后端建立一条 SSE 连接。你的会话被注册到一个按用户维护的连接中枢——该结构追踪你账户下所有活跃连接，涵盖各个标签页、设备以及 Electron 桌面应用。当数据发生变化（任务被更新、支出被记录、文件被重命名），后端会向内部异步事件总线发布一个事件，该事件随即广播到你用户 ID 下注册的所有连接。

这意味着你在手机上记录一笔支出，浏览器标签页会在毫秒内感知到。无需轮询，无需手动刷新。

![Task list view — changes sync in real-time across all connected clients](https://dl.udctl.com/features/blog/sse-realtime-sync/task-list.png)

连接的生命周期经过精心管理。连接最长保持 30 分钟，到期后会自动重连。这可以防止长时间运行的实例出现资源泄漏，同时与有自身超时规则的负载均衡器和反向代理友好兼容。如果连接因任何原因断开——网络抖动、设备休眠唤醒、代理超时——客户端会使用指数退避策略自动重连。初始延迟较短，随后逐步增加，避免短暂离线的设备在恢复上线时瞬间冲击服务器。

## 客户端的智能缓存更新

收到事件是一回事，知道如何处理又是另一回事。UnDercontrol 并不会在 SSE 事件到达时盲目地重新拉取全量数据。前端采用差量缓存更新策略：识别哪些内容发生了变化，在本地 Zustand store 中找到对应条目，仅更新该条记录。

例如，某个任务的状态从"进行中"变为"已完成"，事件只携带该任务的最新状态。客户端将其合并到现有缓存中，列表以新状态重新渲染，其余内容保持不变。

这让界面保持流畅，避免了那种因频繁全量请求而带来的突兀刷新感。

![Kanban board with live status updates pushed via SSE](https://dl.udctl.com/features/blog/sse-realtime-sync/kanban-board.png)

## 乐观更新与服务端协调

SSE 与 UnDercontrol 的乐观更新模型协同工作。本地做出变更时，界面立即响应——无需等待，无需加载动画。写入操作在后台发送到服务端。成功后，服务端发布一个 SSE 事件，传播到你的其他客户端。若操作失败，本地状态回滚，并显示错误提示。

最终效果是：主设备感觉即时响应，其他设备保持一致。服务端是唯一的数据来源，SSE 是让各端与之保持同步的机制。

## 你能直接感受到的好处

在两个浏览器标签页中打开同一个 UnDercontrol 实例，在其中一个标签页做出修改，另一个标签页无需任何操作即可看到变更。当你在一块屏幕上查看预算概览、在另一块屏幕上记录交易时，这一特性尤为实用。

![Budget overview — expense changes propagate instantly to all open views](https://dl.udctl.com/features/blog/sse-realtime-sync/budget-overview.png)

Electron 桌面应用同样参与这套同步机制。通过 CLI 或 Chrome 扩展所做的变更，也会通过 SSE 传播到当前打开的所有端。整个多平台体验的基础，正是这一层同步机制的可靠运行。

## 亲自体验

这一切运行在你自己的硬件上。没有云依赖，没有第三方同步服务，数据始终在你的掌控之中。SSE 端点是标准 UnDercontrol 后端的一部分。

如果你还没有部署 UnDercontrol，自部署指南介绍了如何在几分钟内通过 Docker 完成启动。如果你已经在运行实例，同步功能已经处于激活状态——打开第二个标签页，亲眼看看效果。

部署说明和配置选项请参阅[文档](https://undercontrol.dev/docs)。
