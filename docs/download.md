---
title: Download
description: All UnDercontrol distribution channels — desktop apps, CLI, web app, browser extension, and self-host image
---

# Download

All ways to get UnDercontrol. Humans should prefer the [Download page](/download);
this document states the same facts in a machine-readable form.

## Web app

- URL: https://ud.oatnil.com
- No installation. Visitor trial available without an account.

## Desktop app (macOS / Windows / Linux)

Desktop binaries are hosted on Cloudflare R2:

```
https://dl.udctl.com/releases/{VERSION}/{FILENAME}
```

File names per platform:

| Platform | File name |
| --- | --- |
| macOS (Apple Silicon) | `undercontrol-desktop-{VERSION}-arm64.dmg` |
| macOS (Intel) | `undercontrol-desktop-{VERSION}-x64.dmg` |
| Windows (x64) | `undercontrol-desktop-{VERSION}-setup.exe` |
| Linux (x64) | `undercontrol-desktop-{VERSION}.AppImage` |

To discover the current `{VERSION}`, fetch the auto-update metadata (plain YAML,
`version:` on the first line):

```
https://dl.udctl.com/releases/latest/latest-mac.yml
https://dl.udctl.com/releases/latest/latest.yml        # Windows
https://dl.udctl.com/releases/latest/latest-linux.yml
```

Only the most recent versions are retained on R2 — always resolve the current
version first instead of hardcoding one.

Platform notes:

- **Windows**: the installer is unsigned, so Windows shows an "unknown publisher"
  warning on first run. Click **More info → Run anyway** to continue.
- **Linux**: make the AppImage executable: `chmod +x undercontrol-desktop-{VERSION}.AppImage`.

## CLI (`ud`)

npm is the recommended channel:

```bash
npm install -g @oatnil/ud   # requires Node.js 18+
ud --version
```

Homebrew works too (macOS and Linux):

```bash
brew tap oatnil-top/ud
brew trust oatnil-top/ud   # Homebrew 6 and newer only
brew install ud
```

Docs: [CLI guide](/docs/cli) · [AI agent integration](/docs/cli-ai-integration)

## Browser extension

- [UnDercontrol Web Clipper](https://chromewebstore.google.com/detail/undercontrol-web-clipper/mckkbigikfkoeddpcbhdmpncoljoagog)
  on the Chrome Web Store — save web pages as tasks with full-page snapshots and
  video transcript extraction.

## Mobile (iOS and Android)

The native iOS app is in public beta. Join via the TestFlight link:
https://testflight.apple.com/join/st2TnaBF (requires the TestFlight app from
the App Store).

Android installs from a direct APK download, not from Google Play:
https://dl-android.udctl.com/android/0.0.20/undercontrol-0.0.20.apk
Because the file does not come from the Play Store, the first install asks where
it came from — tap **Settings → Allow from this source** and the install
continues. The APK carries the mobile app's own version number, which is
independent of the desktop version above.

Also available: the
[Apple Shortcut](https://www.icloud.com/shortcuts/4e0becebe3cd48a180940ccbd04d6fa7)
for one-tap capture, and the web app in a mobile browser.

## Self-host

Two paths, same configuration surface:

- **Docker (all-in-one)**: image `lintao0o0/undercontrol:latest` (linux/amd64 and
  linux/arm64) bundles the web app and backend in one container.
- **Bare-metal (npm)**: `npm install -g @oatnil/ud-server` — a single binary with
  the web UI compiled in (Node.js 18+; macOS/Linux/Windows). Start with
  `ud-server -host-domain http://localhost:8080 -data-path ./data`.

See the [Self-Deployment guide](/docs/self-deployment) for `docker run` / compose /
Kubernetes / bare-metal setups and the [Configuration reference](/configuration)
for all environment variables.
