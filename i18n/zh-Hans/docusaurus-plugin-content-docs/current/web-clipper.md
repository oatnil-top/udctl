---
title: "Web Clipper Chrome 扩展:把网页存进 udctl"
description: 一个 Chrome 扩展:把任意网页存成带完整页面快照的 udctl 任务,或者不用登录就把正文复制成干净的 Markdown。
sidebar_position: 8
---

# Web Clipper Chrome 扩展

网页剪藏工具(web clipper)是一类浏览器扩展:把当前网页或你关心的那部分抓下来,存到一个以后找得到的地方。udctl 的 Web Clipper 做两件事:

- **Copy Markdown**:把当前页面的正文提取成干净的 Markdown 放进剪贴板。不用登录、不用账号、不连服务器,粘到任何 AI 对话或编辑器里都行。
- **Save Page**:把网页存成一条 udctl 任务,并把完整页面的 HTML 快照附在任务上,存在你自己的 udctl 服务器里。

## 什么是网页剪藏,这个有什么不同

多数剪藏扩展(比如 Evernote 和 Notion 的)把页面存进它们自家的笔记本或工作区,而且你得先有那边的账号。udctl Web Clipper 有两处不一样:

- Copy Markdown 不需要任何账号。这是大多数人装它的原因,它从不和服务器通信。
- Save Page 把剪藏存成一条**任务**,不是笔记,而且存在你自己运行的服务器上。快照是一个自包含的 HTML 文件挂在那条任务上,原网页改了或者没了它照样能读,你的 AI agent 也能像读别的附件一样通过任务读到它。

「把一篇文章复制给 AI」这个用例在博客[一键把网页变成干净的 Markdown,直接喂给 AI](/zh-Hans/blog/2026/07/11/web-clipper/)里走了一遍。

## 功能特点

- **Copy Markdown** — 一键把正文复制成 Markdown(Readability + Turndown 提取,导航、广告、侧栏自动去掉)
- **一键保存** — 点击扩展图标,编辑标题,保存整个页面
- **完整快照** — 使用 [SingleFile](https://github.com/gildas-lormeau/SingleFile) 将页面捕获为单个 HTML 文件
- **自动附件** — HTML 快照作为资源附件关联到新创建的任务
- **自定义标题** — 保存前可编辑任务标题(默认为页面标题)
- **API Key 认证** — Save Page 用你的 udctl API Key 安全连接;Copy Markdown 不需要 Key

## 安装

直接从 [Chrome 网上应用店](https://chromewebstore.google.com/detail/undercontrol-web-clipper/mckkbigikfkoeddpcbhdmpncoljoagog) 安装：

1. 访问 Chrome 网上应用店的 [udctl Web Clipper](https://chromewebstore.google.com/detail/undercontrol-web-clipper/mckkbigikfkoeddpcbhdmpncoljoagog) 页面
2. 点击 **添加至 Chrome**
3. 在弹窗中点击 **添加扩展程序** 确认

扩展图标将出现在 Chrome 工具栏中。

## 配置

### 第一步：获取 API Key

1. 登录 udctl Web 应用
2. 进入 **设置** → **API Keys**
3. 点击 **创建 API Key** — 密钥以 `ak_` 开头
4. 复制密钥（仅显示一次）

> 查看 [API Keys 文档](/docs/advanced/api-keys) 了解 API Key 管理详情。

### 第二步：配置扩展

1. 点击 Chrome 工具栏中的 udctl 图标
2. 输入你的 **API URL** —— 你自己的服务器，例如 `https://ud.example.com`（用测试服的话是 `https://api.oatnil.com`；`https://ud.oatnil.com` 是网页应用，不是 API）
3. 输入你的 **API Key**（以 `ak_` 开头）
4. 点击 **Test** 验证连接
5. 应显示 "Connected as [你的用户名]"
6. 点击 **Save**

## 使用方法

### 保存页面

1. 浏览到你想保存的网页
2. 点击工具栏中的 udctl 图标
3. 根据需要编辑任务标题（默认为页面标题）
4. 点击 **Save Page**
5. 等待捕获完成 — 成功后弹窗自动关闭

保存的页面将作为新任务出现在你的 udctl 任务列表中。完整的 HTML 页面快照作为资源附件。

### 管理设置

- **Settings** — 点击底部的 Settings 链接修改 API URL 或 API Key
- **Test** — 保存前验证连接
- **Clear** — 清除所有配置，重新开始

## 工作原理

1. 点击 **Save Page** 时，扩展将 SingleFile 库注入当前标签页
2. SingleFile 将整个页面（HTML、CSS、图片、字体）捕获为一个自包含的 HTML 文件
3. 扩展通过 [资源 API](/docs/features/resources) 将 HTML 文件上传到你的 udctl 服务器
4. 创建一个新任务，HTML 文件作为资源附件

## 限制

- 无法捕获 Chrome 内部页面（`chrome://`、`chrome-extension://`）
- 内容非常复杂的页面可能需要最多 2 分钟
- HTML 快照是时间点捕获 — 如果原始页面发生变化，快照不会更新

## 故障排除

### "Invalid API key"

- 确认密钥以 `ak_` 开头
- 从 Web 应用的设置 → API Keys 重新生成密钥
- 确认 API URL 正确

### "Cannot reach server"

- 检查网络连接
- 确认 API URL（末尾不要有斜杠）
- 确保服务器正在运行且可访问

### 捕获失败或超时

- 包含大量媒体内容的页面需要更长时间
- 尝试在捕获前刷新页面
- Chrome 内部页面无法捕获

### "Invalid format" 错误

- 通常表示服务器版本过旧
- 将 udctl 后端更新到最新版本

## 开源信息

Web Clipper **浏览器扩展**采用 **AGPL-3.0** 许可证开源,因为它集成了 [SingleFile](https://github.com/gildas-lormeau/SingleFile) 库。这只适用于扩展本身,udctl 平台是闭源的。

- 源代码：[github.com/oatnil-top/ud-chrome-extension](https://github.com/oatnil-top/ud-chrome-extension)
- 许可证：AGPL-3.0
