---
title: API 参考
description: udctl 后端 HTTP API 的完整 OpenAPI(Swagger 2.0)规范
sidebar_position: 9
---

# API 参考

udctl 后端提供 REST API,其完整的机器可读规范发布在这里:

- **在线阅读:** [oatnil.com/api/](pathname:///api/)
- **原始规范文件:** [oatnil.com/api/openapi.json](pathname:///api/openapi.json)

## 更想按行为看?

OpenAPI 渲染是 400 个操作的平铺。对已经重写过的那部分 API 面,我们提供**按行为组织的
参考**:端点按「你想做什么」分组,每条带完整 HTTP 调用(请求给 HTTP 原文与 curl,响应按
状态码分开),只发布了契约、尚未实现的端点标 Draft。

- [看板与任务 · 按行为看 API](/api/kanban)

后续的组会陆续出现在那里;其余端点仍由下面的 OpenAPI 文件完整描述。

原始文件是一份 Swagger 2.0(OpenAPI 2.0)JSON 文档,覆盖 **303 个路径 / 400 个操作 /
438 个数据模型** —— 服务端注册的全部路由,包括 Web 端和桌面端自己在用的那些。

## Base URL {#base-url}

| 实例 | Base URL |
| --- | --- |
| 官方托管 | `https://api.oatnil.com` |
| 自部署 | 你自己部署的地址 —— 见[自部署](./self-deployment.md) |

规范里写的 `host: localhost:8888` 是代码生成器的开发默认值,不是真实端点,请替换成上表中的地址。

## 认证

几乎所有路由都需要 JWT bearer token:

```
Authorization: Bearer <access_token>
```

通过 `POST /auth/v2/login` 获取,通过 `POST /auth/refresh-token` 刷新。规范中对应
`BearerAuth` 安全定义。少数路由是公开的(登录、注册、刷新 token、health、version)。

## 给 agent 使用

原始 JSON 以静态文件方式提供,agent 可以直接抓取:

```
https://udctl.com/api/openapi.json
```

任何 OpenAPI 工具(Postman、Insomnia、`openapi-generator`、Swagger Editor)也可以直接
指向这个 URL 加载。

## 出处与新鲜度

发布的文件与源码仓库中的 `go-backend/docs/swagger.json` 逐字节相同,由
[swaggo/swag](https://github.com/swaggo/swag) 从 handler 注解生成。

后端变更后,重新生成并复制过来即可更新:

```bash
cd go-backend
swag init -g cmd/server/main.go -d ./ -o docs --parseDependency --parseInternal
cp docs/swagger.json ../docusaurus-opensource/static/api/openapi.json
```

同时更新本文和英文版中引用的数量统计。

:::note 为什么发布在这里,而不是直接读线上服务
运行中的服务在 `/swagger/index.html` 提供了 Swagger UI,但它的 `/swagger/doc.json`
返回 200 且响应体为空:生成的 docs 包只在 `//go:build dev` 下被 import
(`go-backend/cmd/server/swagger_dev.go`),而发布版二进制用 `-tags prod` 构建,
因此二进制里根本没有编入任何规范。本页是它的替代发布位置。
:::
