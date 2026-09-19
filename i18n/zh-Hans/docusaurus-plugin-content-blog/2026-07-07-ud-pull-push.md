---
title: "像 git 一样管理你的任务:ud pull / push 本地双向同步"
description: ud pull 把云端的任务、笔记、附件拉成本地 Markdown 文件,ud push 把本地修改推回去。UnDercontrol server 与任意文件夹之间的 git 风格双向同步——用 Obsidian、VS Code 或任何 AI Agent 编辑。
authors: [lintao]
tags: [feature, guide]
date: 2026-07-07
---

> 一句话:`ud pull` 把云端的任务、笔记、附件拉成本地的 Markdown 文件,`ud push` 把你在本地的修改推回去。像 `git clone` 和 `git push` 一样自然。
>
> **多个仓库,一个 server,随时随地查看编辑。**

![UnDercontrol 云端与本地文件夹通过 ud pull / ud push 双向同步,本地可用 Obsidian、VS Code、AI Agent 等任意工具编辑](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/ud-pull-push/concept-1.png)

<!-- truncate -->

### 为什么要做这个功能

UnDercontrol 的核心理念一直是:**你的数据就是你的**。任务、笔记、账目、资源——所有文字内容都是纯 Markdown,不锁定在任何一款软件里。

但"能导出"还不够。开发者真正想要的是:**把这些内容当成本地文件来用**——用自己顺手的编辑器改,用 AI 工具读,还能改完再同步回去。

所以我们做了一套 git 风格的命令行同步:`ud init` / `ud pull` / `ud push` / `ud status`。没有新概念要学——如果你会用 git,你已经会用它了。

### 三条命令,和 git 一模一样的心智模型

| ud 命令 | 对应的 git | 作用 |
|---------|-----------|------|
| `ud pull /Work/Alpha/` | `git clone` | 把云端某个虚拟目录检出到当前文件夹,并绑定 |
| `ud status` | `git status` | 看本地和云端各自改了什么 |
| `ud push` | `git push` | 把本地改动推回云端 |
| `ud init /Work/Alpha/` | `git init` | 把一个已有的本地文件夹发布成云端目录 |

第一次 `ud pull /Work/Alpha/` 会把当前目录**绑定**到虚拟路径 `/Work/Alpha/`:目录里会出现一个 `.ud/` 文件夹保存同步状态(就像 `.git/`),`/Work/Alpha/` 下的内容直接落在这个文件夹里。之后再 `ud pull` 就是**增量**的——只下载变化的部分。

```bash
# 在一个空文件夹里,一步完成 init + 检出
ud pull /Work/Alpha/

# 之后随时增量拉取所有已跟踪的路径
ud pull

# 看看两边都改了什么
ud status

# 把本地改动推回去(会先列出改动清单让你确认)
ud push
```

![本地文件夹结构:一个任务是一个文件夹,index.md 是任务正文,每条笔记是独立的 .md 文件,.ud/ 保存同步状态](https://pub-35d77f83ee8a41798bb4b2e1831ac70a.r2.dev/features/blog/ud-pull-push/concept-2.png)

### 本地长什么样:任务就是文件夹,笔记就是文件

拉下来的结构完全镜像了 UnDercontrol 里的**虚拟文件夹**层级:

```
Alpha/
├── .ud/                      # 同步状态(相当于 .git/)
│   └── tracking.json
├── Design-Doc/               # 一个任务 = 一个文件夹
│   ├── index.md              # 任务正文(YAML frontmatter + 描述)
│   ├── Kickoff-notes.md      # 每条笔记 = 一个 .md 文件
│   └── Review-notes.md
├── Sprint-Plan/
│   └── index.md
└── architecture.png          # 资源 = 普通文件,按虚拟路径摆放
```

`index.md` 打开就是一份干净的 Markdown:

```markdown
---
id: 8f3c...
title: Design Doc
status: in-progress
tags: [design, alpha]
deadline: 2026-07-20
---

## 背景
这里是任务描述正文……
```

几个刻意的设计:

- **正文按原样(verbatim)保存**——包括 `resource://`、`task://`、`note://` 这些应用内链接都原封不动,做到**字节级往返**,内容不会在同步中被改写。
- **虚拟路径不写进 frontmatter**——文件夹所在的位置本身就是路径的唯一来源。想给任务换个目录?在本地把文件夹挪个位置,`ud push` 就会更新云端的路径。
- **文件名会被安全化**,原始名字存在 `.ud/tracking.json` 里,不用担心特殊字符或中文名。

### push 时,ud 会智能识别你做了什么

`ud push` 会拿工作区和 `.ud/tracking.json` 里的"上次已知状态"逐项对比,自动判断:

| 你在本地做的事 | ud push 的动作 |
|---------------|---------------|
| 新建一个任务文件夹(带 index.md),或一个散落的 `.md` | 创建任务 |
| 在任务文件夹里新加一个 `.md` | 给这个任务创建笔记 |
| 加一个非 `.md` 文件 | 上传成资源 |
| 改了 index.md / 笔记 / 资源文件 | 更新到云端 |
| 把文件/文件夹挪到别的目录 | 更新云端的虚拟路径 |
| 删除文件/文件夹 | 云端软删除(可恢复) |

也就是说,**你在本地新建一个 `My-Idea.md` 文件,`ud push` 之后它就是 UnDercontrol 里的一条任务**。反过来,在云端新建的任务,`ud pull` 之后就出现在本地。真正的双向。

### 冲突处理:和 git 一样,不会偷偷覆盖

如果同一个任务在本地和云端都被改过,`ud` 会把它标为**冲突**:

- `ud push` 默认**跳过**冲突项(提示你先 pull),或者用 `--force` 强推覆盖云端。
- `ud pull` 默认**保留本地**版本,也可以用 `--keep-remote` 让云端覆盖本地。
- 交互式运行时会**逐项**问你保留哪一版。

先 `ud status` 看清楚,再决定策略——不会有任何数据被悄悄丢掉。

### 多个仓库,一个 server,随时随地

git 的模型里,一个 origin 可以对应任意多个本地克隆。`ud` 也一样——**同一个 server 之上,你可以有任意多个本地跟踪文件夹**,各自绑定到不同的虚拟路径:

```
笔记本电脑          台式机             另一台 Mac / 服务器
~/work/alpha  →     D:\notes\alpha  →   ~/proj-x
  绑定 /Work/Alpha/    绑定 /Work/Alpha/   绑定 /Projects/proj-x/
        \                 |                    /
         \                |                   /
          ┌──────────────────────────────────┐
          │      一个 UnDercontrol server      │
          │   (虚拟文件夹 = 唯一真相来源)       │
          └──────────────────────────────────┘
```

这带来几个很实在的好处:

- **一处一个仓库,互不干扰**:`/Work/Alpha/` 和 `/Projects/proj-x/` 是两个独立的跟踪根,各有自己的 `.ud/` 状态,互不影响。你可以只 checkout 你现在关心的那一小块,而不是把整个知识库拉下来。
- **随时随地查看编辑**:任何一台设备上 `ud pull` 就是最新版,改完 `ud push` 就同步给所有人/所有端。手机上想看?打开 Web / 桌面 App 就行——**同一个 server,同一份数据**。
- **人和 AI 共用一个真相来源**:你在笔记本上用 Obsidian 改,AI Agent 在服务器上用终端 CLI 改,团队成员在 App 里改——全都汇聚到同一个 server 的同一个虚拟路径,`ud status` 随时能看清谁改了什么。

一句话:**server 是唯一真相来源,本地文件夹只是它的一个个"工作副本"**。这正是 git 二十年验证过的模型,只不过对象从代码换成了你的任务和知识库。

### 不只是任务:整个知识库都能当文件用

这一点很关键:UnDercontrol 的 Markdown 编辑器是**所有文字界面共用的**——任务、笔记、甚至账目和账户的备注,都是同一套 Markdown。所以 `ud pull` 拉下来的不是一个孤立的"待办列表导出",而是**你整个知识库的本地镜像**,可以用任何工具打开、编辑、再推回去。

### 典型场景

- **用 Obsidian / VS Code 管理任务**:`ud pull` 到你的 vault 里,享受你熟悉的编辑器、快捷键和插件,写完 `ud push`。
- **让 AI Agent 直接读写你的任务**:把同步文件夹交给 Claude Code、Codex、OpenCode 或任何终端里的 agent,它就能直接读取任务上下文、追加笔记、甚至批量创建任务——因为对它来说这些就是普通的本地 `.md` 文件。
- **代码仓库和任务放在一起**:在项目根目录 `ud init /Projects/proj-x/`,把设计文档、技术决策记录直接和代码一起版本化、一起 push。
- **离线也能写**:飞机上、地铁里照样改本地文件,联网后 `ud push` 一次性同步。
- **本地备份**:一条 `ud pull` 就是一份纯文本、可读、永不过期的全量备份。

### 三步开始用

UnDercontrol 是一个把任务、知识库和 AI agent 放在一起的工作台,支持**桌面 App** 和**自托管**——数据私有、可移植、始终属于你。

**1️⃣ 装命令行(30 秒)**

```bash
npm install -g @oatnil/ud
# 不想装?直接用 npx:
npx @oatnil/ud --help
```

**2️⃣ 拉下来,随便用什么工具改**

```bash
ud pull /Work/     # 把一个虚拟目录检出到本地
ud status          # 看看两边改了什么
ud push            # 推回去
```

**3️⃣ 拿桌面 App / 自托管你自己的 server**

想要图形界面、多端查看、或者把整个 server 跑在自己机器上?看下面的链接。

### 从这里开始

- 🏠 **官网 & 文档**:[oatnil.com](https://oatnil.com)
- 📦 **CLI 安装指南**:[oatnil.com/docs/cli](https://oatnil.com/docs/cli)
- 💻 **桌面 App & 自托管**:[udctl.com/docs/pricing](https://udctl.com/docs/pricing/)

你的数据,你的格式,你的工具。UnDercontrol 只是让它们无缝流动起来——现在就 `npm install -g @oatnil/ud` 试试。
