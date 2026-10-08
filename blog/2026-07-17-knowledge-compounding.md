---
title: "Growing with UnDercontrol: Time Compounds, and So Does Knowledge"
description: "I studied architecture, switched to software, and moved to Singapore. The one constant was writing things down — through Joplin, Obsidian, and finally a tool I built myself. On the compound interest of knowledge."
authors: [lintao]
tags: [story]
date: 2026-07-17
image: https://dl.udctl.com/features/blog/knowledge-compounding/concept-1.png
---

![The compounding curve of knowledge](https://dl.udctl.com/features/blog/knowledge-compounding/concept-1.png)

I studied architecture. Then I switched careers and became a programmer. Later I left everything familiar behind and moved to Singapore, where I now work as a fullstack / DevOps engineer.

<!-- truncate -->

### Career switchers know what "accumulation" really means

Switching careers means starting from zero: no four years of CS coursework to lean on — every concept had to be chewed through on my own. That's when I picked up a habit: write down every pitfall I hit, every concept that finally clicked, every config I got working. Not out of diligence — out of fear. If I didn't write it down today, I'd pay for it again tomorrow.

Looking back, that habit is the highest-return investment I've ever made. It carried me through the career switch, through job changes, through moving countries, and eventually through building my own product. Knowledge, like money, compounds — but only if you have an account for it to grow in.

Over the years, my "account" changed three times: Joplin → Obsidian → UnDercontrol. Each migration wasn't chasing something shiny — it was my understanding of *how knowledge should work* leveling up.

![Two journeys, one habit](https://dl.udctl.com/features/blog/knowledge-compounding/concept-2.png)

### The Joplin era: get things written down (Collect)

My first stop was Joplin. Open source, free, Markdown, encrypted sync — for someone just getting serious about notes, it solved the most important problem: **making "write it down" actually happen**.

My early study notes, interview prep, and debugging logs from the career-switch years all piled up there.

But over time, the notes felt like drawers: easy to put things in, but every note lived in isolation. The notes themselves sat inside the app's database; finding things meant folders and keyword search; there were no real connections between notes. The knowledge was stored — but it just lay there. It didn't appreciate.

### The Obsidian era: connect the knowledge (Connect)

So I moved to Obsidian: plain local Markdown files, bidirectional links, a knowledge graph, a rich plugin ecosystem.

This was a genuine upgrade. For the first time, my notes went from "a pile of files" to "a network" — writing something new naturally pulled old notes in. My vault passed a thousand notes in this era, and I could feel the accumulated weight supporting me in retrospectives, in writing, in technical decisions.

The career switch and the move abroad — the two biggest jumps of my life — were both backed by the same body of notes. That was the first time "the compound interest of knowledge" stopped being a platitude for me.

But the deeper the accumulation, the more visible the cracks:

- **My knowledge was locked in a local folder.** The classic scene: debugging a nasty issue at the office, I suddenly remember — I've hit this exact pit before, and the fix is written up in detail... in Obsidian, on my computer at home. End of story. I can't sync my entire vault onto every machine I touch.
- **The graph is a beautiful lie.** Mention `[[some concept]]` anywhere in a note and it enters the graph. A throwaway reference and a carefully built relationship get equal-weight edges. The more nodes, the prettier the graph — and the less it actually tells you.
- **Attachments scattered everywhere.** Architecture diagrams, flowcharts, PDFs spread across assets folders; move a folder and the links break.
- **Every sync option hurts somewhere.** Paid sync still needs a client installed; Syncthing can't go on a work machine; Git sync is technically possible and experientially miserable.

What I needed was simple: **a web page. Log in, full editing, knowledge available anywhere.**

### UnDercontrol: make knowledge callable (Compound)

No tool on the market was shaped quite like what I wanted, so I decided to build one. It's also an experiment: how far can one person, plus AI, take a product?

UnDercontrol is my answer to every crack from the first two eras:

- **Available anywhere**: log in from any browser; plus a CLI and a desktop app, with `ud pull / ud push` syncing tasks to local Markdown files bidirectionally — the convenience of the web *and* the reassurance of local files.
- **Links I build explicitly**: only deliberately created relationships (peer / parent-child) enter the knowledge graph. Every edge means something. High signal, low noise.
- **Centralized resources**: images, PDFs, and attachments stay attached to their context, but you can browse, search, and reuse them all in one unified library.
- **Not just tasks**: UnDercontrol's Markdown editor is shared across every text surface — tasks, notes, finance records, documents, all the same editing experience. A task can be a document, a decision record, a blog draft.
- **AI-native**: the knowledge base is open to AI. Claude Code, Codex, OpenCode, or any terminal-based agent can read and write the same knowledge through the CLI. In fact, the post you're reading right now was written by an AI agent inside an UnDercontrol task, drawing on my past notes.

This is the third stage of compounding: knowledge is no longer just *stored* or *connected* — it can be **called**. By future me, and by the AI working on my behalf.

### Time compounds into strength

From architectural drawings to code, from China to Singapore, from Joplin to Obsidian to building my own tool — the career changed, the city changed, the software changed. The habit didn't: **write down what you figured out today**.

The essence of compounding isn't the rate of return. It's not stopping. The point of a tool is to make "not stopping" easy enough.

For me, UnDercontrol is both a product and the container for that habit. I use it every day to manage my tasks, notes, and finances — and to manage the building of UnDercontrol itself. I grow with it, and it remembers everything that time has laid down.

If you've migrated through Joplin, Obsidian, and a dozen other tools — if you also believe knowledge compounds — come try [UnDercontrol](https://oatnil.com).
