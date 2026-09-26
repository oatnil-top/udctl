/**
 * /api/kanban — the kanban/tasks group of the behavior-first API reference.
 *
 * DATA ONLY. Rendering, shared strings and the page frame live in
 * src/components/ApiReference; a future API group is another file like this
 * one under src/pages/api/.
 *
 * TARGET CONTRACT ONLY (owner decision 2026-09-26, "只写目标的API"): every
 * path here is the target shape — /tasks/* and /boards/* prefixes, target
 * verbs. Implemented operations carry status "live" plus `today`, the path
 * that answers until the renames ship; unimplemented ones carry "draft".
 * Field shapes for live operations checked against go-backend web DTOs
 * (kanban/dto.go, todolist/dto.go) on 2026-09-26; draft shapes come from the
 * design records on ud cards 936c5276 (read side) and 2509f97b (write side),
 * merged on card f081e261.
 */
import type {ReactNode} from 'react';
import ApiReferencePage, {type ApiPageData} from '@site/src/components/ApiReference';

const DATA: ApiPageData = {
  title: {en: 'Kanban API by behavior', zh: '看板 API · 按行为组织'},
  metaDesc: {
    en: 'The udctl kanban and task HTTP API, grouped by what you are doing, with a full HTTP call for every endpoint.',
    zh: 'udctl 看板与任务 HTTP API,按用户行为组织,每个端点带完整 HTTP 调用示例。',
  },
  h1: {en: 'Kanban and tasks, by behavior', zh: '看板与任务 · 按行为看 API'},
  lead: {
    en: 'This page covers the board and task surface of the udctl API, grouped by what you are doing rather than by swagger tag. Every endpoint comes with one full HTTP call: the request in raw HTTP and curl, the response per status code.',
    zh: '这一页覆盖 udctl API 的看板与任务面,按「你想做什么」组织,不按 swagger tag 平铺。每个端点带一次完整的 HTTP 调用:请求给 HTTP 原文和 curl 两种写法,响应按状态码分开。',
  },
  groups: [
    {
      id: 'day',
      title: {en: 'Board day-to-day', zh: '看板日常'},
      blurb: {
        en: 'Reading columns, creating cards in a column, moving cards, reordering — the loop you live in.',
        zh: '看列、在列里建卡、移卡、重排 —— 每天都在做的那一圈。',
      },
      endpoints: [
        {
          id: 'column-query',
          method: 'POST',
          path: '/api/v1/boards/{boardId}/columns/{columnId}/query',
          status: 'draft',
          behavior: {en: 'See what is in a column', zh: '看某列有什么卡'},
          summary: {
            en: 'Semantic column read. You name the column and how to treat sprints; the server assembles the query — column query, board default_tags, active-sprint expansion, your ad-hoc filter, default ordering — and echoes the result as effective_query so you can see exactly what was asked.',
            zh: '语义化列读。你只说要哪一列、sprint 怎么算;查询由服务端拼装 —— 列查询、板 default_tags、active sprint 展开、你的临时过滤、缺省排序 —— 并把结果回显在 effective_query 里,你能看到实际查了什么。',
          },
          fields: [
            {name: 'sprint', type: 'string', desc: {en: '"active" (default) filters by the board\'s running sprint; "none" disables the filter; or a sprint id.', zh: '"active"(缺省)按板的进行中 sprint 过滤;"none" 不过滤;或指定 sprint id。'}},
            {name: 'filter', type: 'string', desc: {en: 'Ad-hoc filter fragment, ANDed onto the column query by the server.', zh: '临时过滤片段,服务端 AND 到列查询上。'}},
            {name: 'page / page_size', type: 'int', desc: {en: 'Per-column pagination, defaults 1 / 20.', zh: '每列独立分页,缺省 1 / 20。'}},
          ],
          errors: [
            {status: '400', desc: {en: 'Invalid filter fragment; the message points at the offending position.', zh: '过滤片段不合法,message 指到出错位置。'}},
            {status: '404', desc: {en: 'The column id is not on this board.', zh: '列 id 不在这块板上。'}},
          ],
          note: {
            en: 'Column ids come from GET /api/v1/boards/{id} (the board carries its column definitions); translating a column name to its id is the client\'s one remaining job. Until this endpoint ships, column reads go through the raw query gate below.',
            zh: '列 id 从 GET /api/v1/boards/{id} 拿(板对象带列定义);「列名翻 id」是留在客户端的唯一一件事。本端点上线前,列读走下面那扇 raw 查询门。',
          },
          request: [
            {
              label: 'HTTP',
              lang: 'text',
              code: `POST /api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/columns/col-doing/query HTTP/1.1
Host: api.oatnil.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "sprint": "active",
  "filter": "title ~ \\"callback\\"",
  "page": 1,
  "page_size": 20
}`,
            },
            {
              label: 'curl',
              lang: 'bash',
              code: `curl -s "$UD_API/api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/columns/col-doing/query" \\
  -H "Authorization: Bearer $UD_TOKEN" -H "Content-Type: application/json" \\
  -d '{"sprint":"active","filter":"title ~ \\"callback\\"","page":1,"page_size":20}'`,
            },
          ],
          responses: [
            {
              label: '200',
              lang: 'json',
              hl: '{14}',
              code: `{
  "data": [
    {
      "id": "7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10",
      "title": "Retry payment callback on timeout",
      "status": "doing",
      "tags": ["dev", "urgent"],
      "metadata": {"ud.sprint": "3f6d9a52-88a1-4f0e-b1d4-6c1f2e7a9b31", "order": 3}
    }
  ],
  "total": 2,
  "page": 1,
  "page_size": 20,
  "effective_query": "(status = 'doing') AND ('q4' IN tags) AND ud.sprint = '3f6d9a52-88a1-4f0e-b1d4-6c1f2e7a9b31' AND (title ~ \\"callback\\") ORDER BY metadata.order ASC"
}`,
            },
          ],
          legend: {
            en: 'Highlighted: computed by the server, not sent by you — this line is the assembly every client used to do itself.',
            zh: '高亮行:服务端算出来的,不是你传的 —— 这一行就是过去每个客户端各自要拼的那份查询。',
          },
        },
        {
          id: 'board-query',
          method: 'POST',
          path: '/api/v1/boards/{boardId}/query',
          status: 'live',
          today: 'POST /api/v1/kanban/boards/{boardId}/query',
          behavior: {en: 'Free query within a board', zh: '板范围自由查询'},
          summary: {
            en: 'The raw query gate, scoped to one board. You send a complete query string and the server only applies the board\'s visibility scope. Free querying is a product feature and stays; the semantic column read above absorbs only the most common shape.',
            zh: '板范围的 raw 查询门。你发一条拼好的完整查询,服务端只负责板的可见性范围。自由查询是产品能力,会一直在;上面的语义化列读只收编最常用的那一种形状。',
          },
          fields: [
            {name: 'query', type: 'string', desc: {en: 'Complete query string (same syntax as /api/v1/tasks/query).', zh: '完整查询串(语法与 /api/v1/tasks/query 相同)。'}},
            {name: 'page', type: 'int', desc: {en: '1-indexed.', zh: '从 1 开始。'}},
            {name: 'page_size', type: 'int', desc: {en: 'Items per page.', zh: '每页条数。'}},
          ],
          request: [
            {
              label: 'HTTP',
              lang: 'text',
              code: `POST /api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/query HTTP/1.1
Host: api.oatnil.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "(status = 'doing') ORDER BY metadata.order ASC",
  "page": 1,
  "page_size": 20
}`,
            },
            {
              label: 'curl',
              lang: 'bash',
              code: `curl -s "$UD_API/api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/query" \\
  -H "Authorization: Bearer $UD_TOKEN" -H "Content-Type: application/json" \\
  -d "{\\"query\\":\\"(status = 'doing') ORDER BY metadata.order ASC\\",\\"page\\":1,\\"page_size\\":20}"`,
            },
          ],
          responses: [
            {
              label: '200',
              lang: 'json',
              code: `{
  "data": [
    {
      "id": "7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10",
      "title": "Retry payment callback on timeout",
      "description": "",
      "status": "doing",
      "path": "",
      "tags": ["dev", "urgent"],
      "checkInCount": 0,
      "metadata": {"ud.sprint": "3f6d9a52-88a1-4f0e-b1d4-6c1f2e7a9b31", "order": 3},
      "created_at": "2026-09-22T08:01:44Z",
      "created_by": "9a7e5c21-1b3f-4e8a-92d6-04c8f1a7d502",
      "updated_at": "2026-09-25T10:12:03Z",
      "updated_by": "9a7e5c21-1b3f-4e8a-92d6-04c8f1a7d502"
    }
  ],
  "total": 9,
  "page": 1
}`,
            },
          ],
        },
        {
          id: 'create-in-board',
          method: 'POST',
          path: '/api/v1/boards/{boardId}/tasks',
          status: 'live',
          today: 'POST /api/v1/kanban/boards/{boardId}/tasks',
          behavior: {en: 'Create a card on a board', zh: '在板上建一张卡'},
          summary: {
            en: 'Creates a task associated with the board; the server merges the board default_tags in. Today the client decides the initial status/tags itself. The Draft column_id field changes that: name the column, and the server computes the initial values from the column\'s enter actions (your explicit fields always win).',
            zh: '在板上建卡;服务端会合并板的 default_tags。今天初值(status、tags)由客户端自己定。Draft 的 column_id 字段改变这一点:指定列,初值由服务端按列的 enter actions 计算(你显式传的字段永远优先)。',
          },
          fields: [
            {name: 'title', type: 'string', req: true, desc: {en: 'Card title.', zh: '卡标题。'}},
            {name: 'description', type: 'string', desc: {en: 'Markdown body.', zh: 'Markdown 正文。'}},
            {name: 'status', type: 'string', desc: {en: 'Initial status.', zh: '初始状态。'}},
            {name: 'tags', type: 'string[]', desc: {en: 'Merged with the board default_tags on the server.', zh: '服务端与板 default_tags 合并。'}},
            {name: 'metadata', type: 'object', desc: {en: 'Extensible keys (cf.*, ud.sprint, order, ...).', zh: '扩展键(cf.*、ud.sprint、order 等)。'}},
            {name: 'assignee / derived_from_id / linked_to_ids / resourceIds', type: 'various', desc: {en: 'Optional; see OpenAPI for exact shapes.', zh: '可选;精确形状见 OpenAPI。'}},
            {name: 'column_id', type: 'string', draft: true, desc: {en: 'Draft. Target column; the server computes initial values from its enter actions and stamps ud.sprint with the active sprint by default (send "ud.sprint": null in metadata to opt out).', zh: '契约。目标列;服务端按该列 enter actions 算初值,并默认给 ud.sprint 盖当前 active sprint 的章(metadata 里显式传 "ud.sprint": null 退出)。'}},
          ],
          request: [
            {
              label: 'HTTP',
              lang: 'text',
              code: `POST /api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/tasks HTTP/1.1
Host: api.oatnil.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Export support tickets",
  "description": "CSV and XLSX",
  "status": "todo",
  "tags": ["dev"]
}`,
            },
            {
              label: 'curl',
              lang: 'bash',
              code: `curl -s "$UD_API/api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/tasks" \\
  -H "Authorization: Bearer $UD_TOKEN" -H "Content-Type: application/json" \\
  -d '{"title":"Export support tickets","description":"CSV and XLSX","status":"todo","tags":["dev"]}'`,
            },
          ],
          responses: [
            {
              label: '201',
              lang: 'json',
              code: `{
  "id": "b7e02c4d-9a31-4f6e-8c25-d10f4a7b3e92",
  "title": "Export support tickets",
  "description": "CSV and XLSX",
  "status": "todo",
  "path": "",
  "tags": ["dev", "q4"],
  "checkInCount": 0,
  "created_at": "2026-09-26T09:14:03Z",
  "created_by": "9a7e5c21-1b3f-4e8a-92d6-04c8f1a7d502",
  "updated_at": "2026-09-26T09:14:03Z",
  "updated_by": "9a7e5c21-1b3f-4e8a-92d6-04c8f1a7d502"
}`,
            },
          ],
          legend: {
            en: 'In this sample "q4" arrived from the board default_tags — the one initial value the server already merges today.',
            zh: '示例里的 "q4" 来自板的 default_tags —— 这是今天服务端就已经在合并的那一份初值。',
          },
        },
        {
          id: 'move',
          method: 'POST',
          path: '/api/v1/boards/{boardId}/tasks/{taskId}/move',
          // Live at the target /boards/ prefix (route_table.go, epic 7619cffc);
          // the old /kanban/boards/... alias also answers during the rename
          // window. No `today` line: unlike the other board endpoints, this one's
          // target path already ships, so there is no "works today at" fallback.
          status: 'live',
          behavior: {en: 'Move a card to another column', zh: '把卡移到另一列'},
          summary: {
            en: 'Single-transaction move. The server computes merge(exit(from), enter(to)) and writes once — replacing today\'s client-side sequence of one update plus N metadata patches, which can fail halfway. dry_run: true computes without writing, for confirmation UIs.',
            zh: '单事务移卡。服务端计算 merge(exit(from), enter(to)) 一次写完 —— 取代今天客户端「1 笔更新加 N 笔 metadata PATCH、中途失败停在半路」的写法。dry_run: true 只算不写,给确认弹层当数据源。',
          },
          fields: [
            {name: 'from_column_id', type: 'string', req: true, desc: {en: 'The column you believe the card is in — the server verifies it.', zh: '你眼里卡所在的列 —— 服务端会校验。'}},
            {name: 'to_column_id', type: 'string', req: true, desc: {en: 'Target column.', zh: '目标列。'}},
            {name: 'dry_run', type: 'bool', desc: {en: 'true computes without writing; response shape is the same as 200.', zh: 'true 只算不写,响应形状同 200。'}},
          ],
          errors: [
            {status: '409', desc: {en: 'Your view is stale: the card no longer matches the source column query. The response carries the card\'s current snapshot — refresh and retry. The server never writes fields based on an outdated view.', zh: '你的视图过期了:卡已不匹配源列查询。响应带卡的当前快照 —— 刷新后重试。服务端绝不按过期视图写字段。'}},
          ],
          note: {
            en: 'The whole move is idempotent (set / add / remove are all idempotent), so replays are safe — no idempotency key needed. Not to be confused with PATCH /api/v1/tasks/{id}/move, which moves a task to a different folder path.',
            zh: '整个操作幂等(set / add / remove 都幂等),重放安全,不需要幂等 key。别与 PATCH /api/v1/tasks/{id}/move 混淆 —— 那条移动的是目录路径。',
          },
          request: [
            {
              label: 'HTTP',
              lang: 'text',
              code: `POST /api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/tasks/7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10/move HTTP/1.1
Host: api.oatnil.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "from_column_id": "col-todo",
  "to_column_id": "col-doing",
  "dry_run": false
}`,
            },
            {
              label: 'curl',
              lang: 'bash',
              code: `curl -s "$UD_API/api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/tasks/7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10/move" \\
  -H "Authorization: Bearer $UD_TOKEN" -H "Content-Type: application/json" \\
  -d '{"from_column_id":"col-todo","to_column_id":"col-doing","dry_run":false}'`,
            },
          ],
          responses: [
            {
              label: '200',
              lang: 'json',
              hl: '{8-11}',
              code: `{
  "task": {
    "id": "7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10",
    "title": "Retry payment callback on timeout",
    "status": "doing",
    "tags": ["dev", "urgent"]
  },
  "applied_actions": [
    {"op": "set", "field": "status", "from": "todo", "to": "doing"},
    {"op": "add_tags", "value": ["dev"]}
  ]
}`,
            },
            {
              label: '409',
              lang: 'json',
              code: `{
  "code": "KANBAN_TASK_NOT_IN_SOURCE_COLUMN",
  "message": "task 7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10 no longer matches the query of column col-todo",
  "task": {
    "id": "7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10",
    "status": "doing",
    "tags": ["dev", "urgent"]
  }
}`,
            },
          ],
          legend: {
            en: 'Highlighted: what the server actually did — also exactly what dry_run returns for a confirmation dialog.',
            zh: '高亮行:服务端实际做了什么 —— 也正是 dry_run 模式给确认弹层的内容。',
          },
        },
        {
          id: 'summary',
          method: 'GET',
          path: '/api/v1/boards/{boardId}/summary',
          status: 'draft',
          behavior: {en: 'Glance at the whole board', zh: '扫一眼板概览'},
          summary: {
            en: 'Per-column counts plus the first few cards of each column, in one call — no per-column paging just to see how the board stands.',
            zh: '一次调用拿到每列计数和各列前几张卡 —— 不用为了看板况逐列翻页。',
          },
          fields: [
            {name: 'sprint', type: 'string', desc: {en: 'Same semantics as the column read: "active" by default.', zh: '语义同列读端点:缺省 "active"。'}},
            {name: 'preview', type: 'int', desc: {en: 'Cards to preview per column; default 3, 0 = counts only.', zh: '每列露几张;缺省 3,0 = 只要计数。'}},
          ],
          fieldsLabel: {en: 'Query parameters', zh: '查询参数'},
          request: [
            {
              label: 'HTTP',
              lang: 'text',
              code: `GET /api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/summary?preview=2 HTTP/1.1
Host: api.oatnil.com
Authorization: Bearer <token>`,
            },
            {
              label: 'curl',
              lang: 'bash',
              code: `curl -s "$UD_API/api/v1/boards/7d55a212-30f5-4a41-a5da-b2f7f01f3bb9/summary?preview=2" \\
  -H "Authorization: Bearer $UD_TOKEN"`,
            },
          ],
          responses: [
            {
              label: '200',
              lang: 'json',
              code: `{
  "board_id": "7d55a212-30f5-4a41-a5da-b2f7f01f3bb9",
  "name": "Product launch",
  "active_sprint_id": "3f6d9a52-88a1-4f0e-b1d4-6c1f2e7a9b31",
  "columns": [
    {"column_id": "col-todo", "name": "To Do", "total": 24,
     "preview": ["Deep links broken on mobile", "Sign-up page A/B test"]},
    {"column_id": "col-doing", "name": "Doing", "total": 9,
     "preview": ["Retry payment callback on timeout", "Report export encoding bug"]},
    {"column_id": "col-done", "name": "Done", "total": 132,
     "preview": ["Login page refresh", "Notification grouping"]}
  ]
}`,
            },
          ],
        },
        {
          id: 'metadata',
          method: 'PATCH',
          path: '/api/v1/tasks/{taskId}/metadata',
          status: 'live',
          today: 'PATCH /api/v1/todolist/{taskId}/metadata',
          behavior: {en: 'Reorder in a column / assign to a sprint', zh: '列内重排 / 排进 sprint'},
          summary: {
            en: 'Patches one metadata key per call. Reordering inside a column writes "order"; putting a card into a sprint writes "ud.sprint". Removing a key (taking a card out of a sprint) is the DELETE twin: DELETE /api/v1/tasks/{taskId}/metadata/{key}.',
            zh: '一次调用改一个 metadata key。列内重排写 "order";把卡排进 sprint 写 "ud.sprint"。删 key(把卡移出 sprint)走孪生路由:DELETE /api/v1/tasks/{taskId}/metadata/{key}。',
          },
          fields: [
            {name: 'key', type: 'string', req: true, desc: {en: 'Metadata key, e.g. "order", "ud.sprint", "cf.priority".', zh: 'metadata 键,如 "order"、"ud.sprint"、"cf.priority"。'}},
            {name: 'value', type: 'any', desc: {en: 'Any JSON value. To remove the key entirely use the DELETE route, not null.', zh: '任意 JSON 值。要移除这个 key 用 DELETE 路由,不要传 null。'}},
          ],
          request: [
            {
              label: 'HTTP',
              lang: 'text',
              code: `PATCH /api/v1/tasks/7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10/metadata HTTP/1.1
Host: api.oatnil.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "order",
  "value": 12
}`,
            },
            {
              label: 'curl',
              lang: 'bash',
              code: `curl -s -X PATCH "$UD_API/api/v1/tasks/7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10/metadata" \\
  -H "Authorization: Bearer $UD_TOKEN" -H "Content-Type: application/json" \\
  -d '{"key":"order","value":12}'`,
            },
          ],
          note: {
            en: 'The 200 response is the full task object (same shape as GET /api/v1/tasks/{id}).',
            zh: '200 响应是完整任务对象(形状同 GET /api/v1/tasks/{id})。',
          },
        },
        {
          id: 'task-detail',
          method: 'GET',
          path: '/api/v1/tasks/{taskId}',
          status: 'live',
          today: 'GET | POST | DELETE /api/v1/todolist/{taskId}',
          behavior: {en: 'Open, edit, delete a card', zh: '打开、编辑、删除一张卡'},
          summary: {
            en: 'The generic task detail family: GET reads (with notes and linked items), PATCH /api/v1/tasks/{taskId} updates, DELETE soft-deletes. The update is a partial update — every field is optional and an omitted field stays unchanged; for assignee, kickoff and deadline an explicit empty string means "clear". Note the verb change in the contract: today the update answers to POST at the old path; the target verb is PATCH, which is what the semantics have been all along.',
            zh: '通用任务详情一族:GET 读(带 notes 与关联),PATCH /api/v1/tasks/{taskId} 改,DELETE 软删。更新是部分更新 —— 所有字段可选,没传的字段不动;assignee、kickoff、deadline 三个字段显式传空串表示「清除」。注意契约里的动词变化:今天更新在旧路径上应答的是 POST;目标动词是 PATCH —— 这本来就是它的语义。',
          },
          request: [
            {
              label: 'HTTP',
              lang: 'text',
              code: `PATCH /api/v1/tasks/7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10 HTTP/1.1
Host: api.oatnil.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "done",
  "deadline": ""
}`,
            },
            {
              label: 'curl',
              lang: 'bash',
              code: `curl -s -X PATCH "$UD_API/api/v1/tasks/7c2f6a1e-4b09-4d2a-9e51-2f8c3d7b9a10" \\
  -H "Authorization: Bearer $UD_TOKEN" -H "Content-Type: application/json" \\
  -d '{"status":"done","deadline":""}'`,
            },
          ],
          note: {
            en: 'This sample marks the card done and clears its deadline in one call. Full field list (title, description, status, path, tags, assignee, kickoff, deadline, derivedFromId, metadata) is in OpenAPI under updateTodolistItem.',
            zh: '这个示例一次调用把卡标记为完成并清掉截止日。完整字段表(title、description、status、path、tags、assignee、kickoff、deadline、derivedFromId、metadata)见 OpenAPI 的 updateTodolistItem。',
          },
        },
      ],
    },
    {
      id: 'sprint',
      title: {en: 'Sprint rhythm', zh: 'Sprint 节奏'},
      blurb: {
        en: 'Sprints are tasks (ud.type = sprint); membership is the ud.sprint metadata key. Reads go through the free query gate.',
        zh: 'sprint 本身是任务(ud.type = sprint);归属关系是 metadata 里的 ud.sprint 键。读走自由查询门。',
      },
      endpoints: [
        {
          id: 'global-query',
          method: 'POST',
          path: '/api/v1/tasks/query',
          status: 'live',
          today: 'POST /api/v1/todolist/query',
          behavior: {en: 'Backlog, sprint members, any free query', zh: '看 backlog、sprint 成员,任意自由查询'},
          summary: {
            en: 'The global query gate: SQL-like syntax over built-in fields, tags, ud.* and cf.* metadata. Backlog views, sprint member lists and every ad-hoc slice go through here. Free querying is a product feature and stays — the semantic endpoints above only absorb the most common shape ("give me a column").',
            zh: '全局查询门:SQL 风格语法,可查内建字段、tags、ud.* 与 cf.* metadata。backlog 视图、sprint 成员列表和一切临时切片都走这里。自由查询是产品能力,会一直在 —— 上面的语义端点只收编「按列取」这一种最常用形状。',
          },
          fields: [
            {name: 'query', type: 'string', desc: {en: 'Query string.', zh: '查询串。'}},
            {name: 'sort', type: 'object', desc: {en: 'Optional sort override; see OpenAPI (SortDTO).', zh: '可选排序;形状见 OpenAPI(SortDTO)。'}},
            {name: 'page / pageSize', type: 'int', desc: {en: 'Note the camelCase pageSize here (the board query gate uses page_size).', zh: '注意这里是驼峰 pageSize(板查询门用的是 page_size)。'}},
            {name: 'view', type: 'string', desc: {en: '"" or "full" returns the historical payload; "lite" drops description, notes and share links for card rendering.', zh: '"" 或 "full" 返回完整历史载荷;"lite" 去掉 description、notes、分享链接,给只画卡片的调用方。'}},
          ],
          request: [
            {
              label: 'HTTP',
              lang: 'text',
              code: `POST /api/v1/tasks/query HTTP/1.1
Host: api.oatnil.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "(status = 'todo') AND ('q4' IN tags) ORDER BY metadata.order ASC",
  "page": 1,
  "pageSize": 20,
  "view": "lite"
}`,
            },
            {
              label: 'curl',
              lang: 'bash',
              code: `curl -s "$UD_API/api/v1/tasks/query" \\
  -H "Authorization: Bearer $UD_TOKEN" -H "Content-Type: application/json" \\
  -d "{\\"query\\":\\"(status = 'todo') AND ('q4' IN tags) ORDER BY metadata.order ASC\\",\\"page\\":1,\\"pageSize\\":20,\\"view\\":\\"lite\\"}"`,
            },
          ],
          responses: [
            {
              label: '200',
              lang: 'json',
              code: `{
  "data": [
    {
      "id": "4de19b0c-2f6a-47d3-b8a1-9c05e2f7d614",
      "title": "Sign-up page A/B test",
      "status": "todo",
      "path": "",
      "tags": ["q4", "growth"],
      "checkInCount": 0,
      "metadata": {"order": 5},
      "created_at": "2026-09-18T02:11:09Z",
      "created_by": "9a7e5c21-1b3f-4e8a-92d6-04c8f1a7d502",
      "updated_at": "2026-09-24T11:40:52Z",
      "updated_by": "9a7e5c21-1b3f-4e8a-92d6-04c8f1a7d502"
    }
  ],
  "total": 14,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}`,
            },
          ],
          legend: {
            en: 'In "lite" view the description field is absent (not empty) — an absent description means "fetch the task to get the body", never "this card has no body".',
            zh: '"lite" 视图下 description 字段整个缺席(不是空串)—— 缺席的含义是「要正文就取任务详情」,绝不是「这卡没有正文」。',
          },
        },
        {
          id: 'close-sprint',
          method: 'POST',
          path: '/api/v1/tasks/{sprintId}/close-sprint',
          status: 'live',
          today: 'POST /api/v1/todolist/{sprintId}/close-sprint',
          behavior: {en: 'Close a sprint', zh: '完成一个 sprint'},
          summary: {
            en: 'The close ceremony in one server-side transaction: rolls unfinished members to the target, settles velocity, writes the retro note, marks the sprint done. Milestone-ordered — the sprint only flips to done after every rollover succeeded, so retries are safe.',
            zh: '完成仪式在服务端一个事务里:未完成员滚动到目标、结算 velocity、写回顾 note、把 sprint 标记为 done。里程碑有序 —— 所有滚动成功之后 sprint 才翻成 done,重试安全。',
          },
          fields: [
            {name: 'rollover', type: 'string', desc: {en: '"backlog" or an open sprint id. Omitting the field means "no choice made" — the server refuses that when unfinished members exist, instead of silently sweeping them to the backlog. An empty body is legal when the sprint is already clean.', zh: '"backlog" 或一个未关闭的 sprint id。不传表示「没有选择」—— 还有未完成员时服务端会拒绝,而不是悄悄扫进 backlog。sprint 已经干净时,空请求体是合法的。'}},
          ],
          errors: [
            {status: '400', desc: {en: 'Not a sprint task, bad rollover target, or unfinished members with no rollover chosen.', zh: '不是 sprint 任务、rollover 目标不合法,或还有未完成员却没有给 rollover。'}},
          ],
          note: {
            en: 'The close also repoints the activeSprintId of every board pointing at this sprint — to the target sprint, or cleared for a backlog close — and reports them: rotatedBoardIds are the boards it moved; skippedBoardIds are shared boards the caller cannot write, whose pointer is left for a group admin to reconcile (a view preference must not fail the close).',
            zh: 'close 同时把每一块指向这个 sprint 的板的 activeSprintId 指过去 —— 指向目标 sprint,或 backlog 关闭时清空 —— 并在响应里报告:rotatedBoardIds 是被移动的板,skippedBoardIds 是调用方无权写的分享板,其指针留给 group admin 校正(看板视图偏好不该让 close 失败)。',
          },
          request: [
            {
              label: 'HTTP',
              lang: 'text',
              code: `POST /api/v1/tasks/3f6d9a52-88a1-4f0e-b1d4-6c1f2e7a9b31/close-sprint HTTP/1.1
Host: api.oatnil.com
Authorization: Bearer <token>
Content-Type: application/json

{
  "rollover": "backlog"
}`,
            },
            {
              label: 'curl',
              lang: 'bash',
              code: `curl -s "$UD_API/api/v1/tasks/3f6d9a52-88a1-4f0e-b1d4-6c1f2e7a9b31/close-sprint" \\
  -H "Authorization: Bearer $UD_TOKEN" -H "Content-Type: application/json" \\
  -d '{"rollover":"backlog"}'`,
            },
          ],
          responses: [
            {
              label: '200',
              lang: 'json',
              hl: '{6-7}',
              code: `{
  "sprintId": "3f6d9a52-88a1-4f0e-b1d4-6c1f2e7a9b31",
  "target": "backlog",
  "completed": 11,
  "rolledOver": 4,
  "rotatedBoardIds": ["7d55a212-30f5-4a41-a5da-b2f7f01f3bb9"],
  "skippedBoardIds": [],
  "velocity": 23.5
}`,
            },
          ],
          legend: {
            en: 'Highlighted: the boards whose active-sprint pointer this close moved (rotatedBoardIds) and the ones it left for a group admin (skippedBoardIds).',
            zh: '高亮行:被这次 close 移动了 active-sprint 指针的板(rotatedBoardIds),以及留给 group admin 的板(skippedBoardIds)。',
          },
        },
      ],
    },
    {
      id: 'board',
      title: {en: 'Board lifecycle', zh: '板生命周期'},
      blurb: {
        en: 'Board CRUD and sharing; until the rename ships these answer under /api/v1/kanban/boards/*. One thing to know: PUT /api/v1/boards/{id} is the single write path for column definitions — the server materializes column actions and backfills missing column ids on every board write. Field shapes are in OpenAPI.',
        zh: '板的增删改查与分享;改名落地前这些路由在 /api/v1/kanban/boards/* 下应答。一件事值得知道:PUT /api/v1/boards/{id} 是列定义的唯一写入口 —— 每次写板,服务端都会物化列 actions 并补齐缺失的列 id。字段形状见 OpenAPI。',
      },
      endpoints: [],
      compactNavLabel: {en: 'all 8 routes', zh: '全部 8 条'},
      compact: [
        {method: 'POST', path: '/api/v1/boards', desc: {en: 'Create a board (name and board_type "private" | "shared" required; columns optional).', zh: '建板(name 与 board_type "private" | "shared" 必填;columns 可选)。'}},
        {method: 'GET', path: '/api/v1/boards', desc: {en: 'List the boards you can see.', zh: '列出你可见的板。'}},
        {method: 'GET', path: '/api/v1/boards/{id}', desc: {en: 'Get one board with its column definitions and settings.', zh: '取一块板,含列定义与设置。'}},
        {method: 'PUT', path: '/api/v1/boards/{id}', desc: {en: 'Update name, columns, default_tags, metadata — the column-definition write path.', zh: '改名字、列、default_tags、metadata —— 列定义的写路径。'}},
        {method: 'DELETE', path: '/api/v1/boards/{id}', desc: {en: 'Delete the board; its tasks are preserved.', zh: '删板;板上的卡保留。'}},
        {method: 'POST', path: '/api/v1/boards/{id}/share', desc: {en: 'Share with a group (group_id, permission "r" | "rw").', zh: '分享给 group(group_id,permission "r" | "rw")。'}},
        {method: 'DELETE', path: '/api/v1/boards/{id}/share', desc: {en: 'Remove group sharing.', zh: '取消分享。'}},
        {method: 'POST', path: '/api/v1/boards/preview-actions', desc: {en: 'Preview the column actions a query would auto-generate — read-only, used while editing columns.', zh: '预览一条列查询会物化出什么 actions —— 只读,编列时用。'}},
      ],
    },
  ],
};

export default function KanbanApiPage(): ReactNode {
  return <ApiReferencePage data={DATA} />;
}
