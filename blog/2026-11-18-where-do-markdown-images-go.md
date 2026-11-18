---
title: "Where do the images in your markdown go? Paste once, and they are on the web, your phone and in local folders"
description: "Obsidian, Typora and VS Code keep each image as a separate file you have to place and sync. In udctl you paste it, it is referenced by id so moving the note never breaks it, it shows on your phone, and ud pull gives you plain files."
authors: [lintao]
tags: [feature, guide]
date: 2026-11-18
image: https://dl.udctl.com/features/blog/where-do-markdown-images-go/04-attachments.jpg
---

Writing in markdown is pleasant until you need a picture. In common markdown editors like Obsidian, Typora and VS Code, an image is a separate file next to the note, and where it goes is up to you:

- Obsidian lets you choose a default location for new attachments under Settings, Files & Links: the vault root, a folder you specify, the same folder as the current note, or a subfolder under it ([docs](https://obsidian.md/help/attachments)).
- Typora, when you insert a local image, refers to the image at its original path by default. To have it copied into a folder, you set that in Preferences or in the document's front matter ([docs](https://support.typora.io/Images/)).
- VS Code copies images you paste or drop from outside the workspace into the workspace, into the folder set by `markdown.copyFiles.destination`. The setting that updates links when a file is moved or renamed, `markdown.updateLinksOnFileMove.enabled`, defaults to `never` ([docs](https://code.visualstudio.com/docs/languages/markdown)).

Once that is set up, there is more to handle. Move the note and a relative path can break. Open it on your phone and the picture has to arrive through some other sync, for example Obsidian Sync, Obsidian's own paid monthly subscription ([pricing](https://obsidian.md/sync)).

This post shows how [udctl](/) (UnDercontrol) removes those steps: you paste the picture in, moving the note never breaks it, the same note on your phone already has it, and plain local files are one command away. The last section covers non-image files such as a PDF.

We made an 85-second video of this: [watch it on YouTube](https://www.youtube.com/watch?v=IkCREjc1IJ8). This post is the written version. The travel notes and photos in the screenshots are made-up demo data.

![In a typical markdown setup the picture is referenced by a relative path, and moving the note breaks the link](https://dl.udctl.com/features/blog/where-do-markdown-images-go/01-link-breaks.jpg)

<!-- truncate -->

## No folder to pick: paste it or drag it in

Editing a note in the udctl web or desktop app, take a screenshot and press Cmd+V, or drag an image file into the editor. The image is uploaded and inserted where your cursor is. Insert Image on the toolbar and Image in the slash menu work too.

You don't save a copy first, pick a folder or type a path.

![In the web editor, a pasted coastline photo and a dragged-in rice bowl photo, each under its own paragraph](https://dl.udctl.com/features/blog/where-do-markdown-images-go/02-paste.jpg)

## Move or rename the note, and the picture stays

Switch to Source Mode and the pasted image is one line:

```
![shirasu-bowl.jpg](resource://d06fdc00-e207-4042-9a06-2e45b6867bb5)
```

It points at the file by id, not by path. Move the note to another folder or change its title, and the line stays the same and the picture still shows.

![The note in Source Mode, each image a single resource:// line](https://dl.udctl.com/features/blog/where-do-markdown-images-go/03-one-line.jpg)

## You choose where the files live, and you can see them

The file itself is uploaded to your udctl server and stored where you choose: the server's own disk, or an S3 compatible bucket.

Uploaded files are not hidden away. The Attachments section on the right side of the card lists every file the note uses, and the Explorer shows them by folder, with name, size, type and modified time.

![Card details: the pictures in the note, and the same two images listed under Attachments on the right](https://dl.udctl.com/features/blog/where-do-markdown-images-go/04-attachments.jpg)

![The image file in the Explorer, with name, size, type and modified time in the preview panel](https://dl.udctl.com/features/blog/where-do-markdown-images-go/05-explorer.jpg)

## On your phone, the pictures are already there

The web app and the mobile app connect to the same udctl server, so when you open the same note on your phone, the pictures are already in it. No second upload, no cloud drive to sync.

udctl uses one markdown editor for tasks, notes, expenses and accounts, so pictures go in and show up the same way in all of them.

![The same travel note in the iOS app, with both photos and the link to the PDF itinerary](https://dl.udctl.com/features/blog/where-do-markdown-images-go/06-phone.jpg)

## Want plain files? One command pulls them to your disk

Sometimes what you want is a folder: to back it up, open it in another editor, or hand it to Claude Code, Codex, OpenCode or any terminal-based agent.

```
ud pull /travel/ --fetch-attachments
```

This pulls the notes under /travel/ to local .md files, with the pictures in an attachments folder beside them. In the text, images are referenced by file name, as `![[shirasu-bowl.jpg]]`, the same syntax Obsidian uses to embed files.

![In the terminal, ud pull brings down three .md files and two images, and ls shows the attachments folder](https://dl.udctl.com/features/blog/where-do-markdown-images-go/07-pull.jpg)

## Not only pictures: any file can go into your markdown

The local folder can be pushed back too. Put a PDF next to the note, add a line linking to it, and run `ud push`. The PDF is uploaded to the server. Back in the browser, it is a link in the note that opens a preview right there, with a download button.

When you are not in a terminal, you can upload any file in the card's Attachments, copy its reference with Copy reference, and paste it into the text.

![In the browser, the day-plan.pdf link in the note opens a PDF preview with file details](https://dl.udctl.com/features/blog/where-do-markdown-images-go/08-pdf.jpg)

## Typical scenarios

- **Travel notes**: on your computer, paste the day's photos under the matching paragraphs. Open the same note on your phone while you are out, and the pictures are there.
- **Technical notes**: paste error screenshots into a debugging log. Move the note to another folder later, and the screenshots still show in place.
- **Meeting notes with handouts**: upload the PDF from the meeting to the card's Attachments, copy its reference and paste it next to the agenda. Everyone in the meeting can open it from there.
- **Handing work to an agent**: `ud pull` a folder to your disk and the agent reads ordinary .md and image files. Files it adds go back with `ud push`.
