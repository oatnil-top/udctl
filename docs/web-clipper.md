---
title: "Web Clipper for Chrome: Save Pages to udctl"
description: A Chrome extension that saves any web page as a udctl task with a full-page snapshot, or copies the article as clean Markdown with no login needed.
sidebar_position: 8
---

# Web Clipper for Chrome

A web clipper is a browser extension that captures a web page, or the part of it you care about, and files it somewhere you can find again. The udctl Web Clipper for Chrome does two things:

- **Copy Markdown**: extracts the article on the current page into clean Markdown on your clipboard. No login, no account, no server. Paste it into any AI chat or editor.
- **Save Page**: creates a udctl task from the page and attaches a full-page HTML snapshot to it, on your own udctl server.

## What is a web clipper, and how is this one different?

Most clippers, such as the Evernote and Notion extensions, save the page into that product's notebook or workspace, and you need an account there to use them. The udctl Web Clipper differs in two ways:

- Copy Markdown works without any account. It is the feature most people install it for, and it never talks to a server.
- Save Page files the clip as a **task**, not a note, on a server you run. The snapshot is a single self-contained HTML file attached to that task, so it stays readable when the original page changes or disappears, and your AI agents can read it through the task like any other attachment.

One use case, copying an article for an AI chat, is walked through in the blog post [Turn any web page into clean Markdown for your AI](/blog/2026/07/11/web-clipper/).

## Features

- **Copy Markdown** — One click, the article content lands on your clipboard as Markdown (Readability + Turndown; navigation, ads and sidebars are stripped)
- **One-click save** — Click the extension icon, edit the title, and save
- **Full-page snapshot** — Captures the entire page as a single HTML file using [SingleFile](https://github.com/gildas-lormeau/SingleFile)
- **Auto-attachment** — The HTML snapshot is attached as a resource to the newly created task
- **Custom title** — Edit the task title before saving (defaults to the page title)
- **API Key auth** — Save Page connects securely using your udctl API key; Copy Markdown needs no key

## Installation

Install directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/undercontrol-web-clipper/mckkbigikfkoeddpcbhdmpncoljoagog):

1. Visit the [udctl Web Clipper](https://chromewebstore.google.com/detail/undercontrol-web-clipper/mckkbigikfkoeddpcbhdmpncoljoagog) page on the Chrome Web Store
2. Click **Add to Chrome**
3. Confirm by clicking **Add extension**

The extension icon will appear in the Chrome toolbar.

## Configuration

### Step 1: Get an API Key

1. Log in to the udctl web app
2. Go to **Settings** → **API Keys**
3. Click **Create API Key** — the key starts with `ak_`
4. Copy the key (it's only shown once)

> See the [API Keys documentation](/docs/advanced/api-keys) for details on managing API keys.

### Step 2: Configure the Extension

1. Click the udctl icon in the Chrome toolbar
2. Enter your **API URL** — your own server, e.g. `https://ud.example.com` (or `https://api.oatnil.com` if you are on the test server; `https://ud.oatnil.com` is the web app, not the API)
3. Enter your **API Key** (starts with `ak_`)
4. Click **Test** to verify the connection
5. You should see "Connected as [your username]"
6. Click **Save**

## Usage

### Saving a Page

1. Navigate to the web page you want to save
2. Click the udctl icon in the toolbar
3. Edit the task title if desired (pre-filled with the page title)
4. Click **Save Page**
5. Wait for the capture to complete — the popup auto-closes on success

The saved page appears as a new task in your udctl task list. The full-page HTML snapshot is attached as a resource.

### Managing Settings

- **Settings** — Click the Settings link at the bottom to change API URL or API Key
- **Test** — Verify your connection before saving
- **Clear** — Remove all configuration and start fresh

## How It Works

1. When you click **Save Page**, the extension injects the SingleFile library into the current tab
2. SingleFile captures the entire page (HTML, CSS, images, fonts) into a single self-contained HTML file
3. The extension uploads the HTML file to your udctl server via the [Resource API](/docs/features/resources)
4. A new task is created with the HTML file attached as a resource

## Limitations

- Cannot capture Chrome internal pages (`chrome://`, `chrome-extension://`)
- Very complex pages with heavy dynamic content may take up to 2 minutes
- The HTML snapshot is a point-in-time capture — it won't update if the original page changes

## Troubleshooting

### "Invalid API key"

- Verify the key starts with `ak_`
- Regenerate the key from Settings → API Keys in the web app
- Make sure the API URL is correct

### "Cannot reach server"

- Check your network connection
- Verify the API URL (no trailing slash)
- Ensure your server is running and accessible

### Capture fails or times out

- Some pages with heavy media content take longer
- Try refreshing the page before capturing
- Chrome internal pages cannot be captured

### "Invalid format" error

- This usually means the server version is outdated
- Update your udctl backend to the latest version

## Open Source

The Web Clipper **browser extension** is open source under the **AGPL-3.0** license, as it incorporates the [SingleFile](https://github.com/gildas-lormeau/SingleFile) library. This applies to the extension only — the udctl platform itself is proprietary.

- Source code: [github.com/oatnil-top/ud-chrome-extension](https://github.com/oatnil-top/ud-chrome-extension)
- License: AGPL-3.0 (extension only)
