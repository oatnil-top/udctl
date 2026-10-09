---
sidebar_position: 10.5
---

# Open With

## What "Open with" means

Every file you keep in udctl is shown by a *viewer*. A picture opens in the image
viewer, a PDF in the PDF viewer, a diagram in the diagram editor, and so on. Most of the
time udctl picks the right viewer for you automatically, based on the file's name.

Sometimes a file can be shown in more than one way, and sometimes you would rather use a
different viewer than the one udctl chose. The **Open with** control lets you see which
viewer is being used and switch to another one, the same way your computer lets you choose
which app opens a file.

> **Availability:** Open with, and everything on this page, is live now in the web app at
> [app.udctl.com](https://app.udctl.com). It is coming to the desktop app in an upcoming
> release; if your desktop app does not show the **Open with** control yet, use the web app
> or update once the next version is out.

## Switching the viewer {#switching-the-viewer}

Open any file (from the Resources page, or from a file attached to a task). In the header
above the file you will see an **Open with** button showing the name of the viewer in use,
for example *Image* or *General Diagram*.

Click it and a short menu appears:

- The viewers that can show this file, with a check mark next to the one in use. Pick
  another to switch to it right away. If more than one plugin can open this file type, each
  one is listed here as its own choice.
- **View as Text** — show the raw contents as plain text. Always available.
- **Download** — save the file to your computer. Always available.

Switching this way lasts only while you have the file open.

If a viewer or plugin cannot display a file — a damaged file, or a plugin that runs into an
error — udctl shows a short message in place of the preview instead of a blank frame, and
keeps **View as Text** and **Download** available so you can still reach the contents.

## Setting a default

If you always want a certain kind of file to open the same way, open the **Open with** menu
and choose **Always open .xyz files this way** (where `.xyz` is the file's extension). From
then on, every file with that extension opens with the viewer you picked.

The default is tied to your account, so it follows you across your devices and does not
affect anyone else. To go back to automatic, open the menu again and choose
**Clear default for .xyz**.

## Viewers built in

These file types open with a built-in viewer, with nothing to install:

- Diagrams — `.drawio` general diagrams and udctl dataflow diagrams
- Excalidraw sketches
- Images, video and audio
- PDF and Word documents
- Spreadsheets and tables
- Markdown, code and plain text
- Presentations and HTML pages

Any other file type cannot be previewed on its own yet. Instead of a blank preview, udctl
tells you no app can open it and points you to the plugin library, next to a download link,
so you can install a viewer for it.

## Adding a viewer with a plugin

A **plugin** teaches udctl how to display a file type it does not handle on its own — much
like installing an app so your operating system can open a new kind of file. Once a plugin
is installed, files of the type it handles open with it instead of just showing a download
link, and the plugin appears as a choice in the **Open with** menu.

### How a plugin is kept safe

A plugin is a single, self-contained web page (one `.html` file). udctl runs it in a
locked-down sandbox: the plugin can read and display the one file you opened, but it cannot
reach the network, cannot see your other files, and cannot touch your account or the rest of
the app.

That sandbox is strong but not perfect — a badly behaved plugin that already has your file
could still try to leak it through a couple of channels the browser does not let us close.
This is the same trade-off code editors and note apps make with their extensions. udctl
shows you exactly what a plugin can do and asks you to confirm before it installs, so the
rule is simple: **install only plugins you trust.**

### Installing a plugin

Go to **Settings → Resource plugins**. There are two ways to add one:

- **Plugin library** — browse plugins published to the official registry and install one
  with a single click. udctl downloads it, checks it against a fingerprint published in the
  registry to be sure the file was not tampered with, and installs it. When a newer version
  is published you will see an **Update** option; if a plugin is ever withdrawn from the
  library you will see a notice suggesting you uninstall it.
- **Upload your own** — choose an `.html` plugin file you already have and list the file
  extensions it should open (for example `.ipynb`), then **Install**.

Either way, udctl shows a short summary of what the plugin can do and asks you to confirm
first. More than one plugin may open the same file type: installing a second viewer for an
extension another plugin already handles is allowed, and both then appear in the **Open
with** menu for you to choose between or set one as the default.

You can remove a plugin at any time with **Uninstall** on the same settings page.
Uninstalling asks you to confirm, then deletes that plugin's own file along with it; your
own files are never touched, and cancelling leaves everything exactly as it was. Plugins you
install are yours alone — they do not change anything for your teammates.

### A ready-made example: Jupyter notebooks

The official **Jupyter Notebook Viewer** plugin renders `.ipynb` notebooks — markdown and
code cells, syntax highlighting, tables and images — read-only. It is published in the
plugin library, so the quickest way to try plugins is to open **Settings → Resource
plugins → Plugin library** and install it. Its full source is in the registry:
[ipynb-viewer in ud-registry](https://github.com/oatnil-top/ud-registry/tree/main/plugins/ipynb-viewer).

## Writing your own plugin {#writing-your-own-plugin}

A plugin is one `.html` file with everything inside it — all its scripts, styles and
images inline, because the sandbox blocks any network request. udctl hands the plugin the
file to show, and the plugin draws it.

The conversation between udctl and your plugin is three short messages. Every message
carries `udPlugin: 1` (the protocol version):

1. When your plugin has loaded and is listening, it tells udctl it is **ready**.
2. udctl sends the **file** once: its name (`fileName`) and its bytes (`bytes`, an
   `ArrayBuffer` your plugin decodes itself). This is the only thing a plugin ever
   receives — never a link, a token, or anything about your account.
3. If your plugin cannot show the file, it can report an **error** and udctl shows a
   message in its place.

A complete, working plugin is just this:

```html
<!doctype html>
<html>
  <body>
    <pre id="out">Waiting for a file…</pre>
    <script>
      // 1. Listen for the file udctl will send.
      window.addEventListener('message', function (event) {
        var msg = event.data;
        if (!msg || msg.udPlugin !== 1 || msg.type !== 'file') return;
        var text = new TextDecoder().decode(msg.bytes);
        document.getElementById('out').textContent =
          msg.fileName + '\n\n' + text;
      });
      // 2. Tell udctl we are ready to receive it.
      parent.postMessage({ udPlugin: 1, type: 'ready' }, '*');
    </script>
  </body>
</html>
```

Save that as a `.html` file, install it from **Settings → Resource plugins → Upload your
own** with the extensions you want it to open, and it will show the raw text of any matching
file. From there you can add markdown rendering, syntax highlighting, or whatever your file
type needs — as long as every library is bundled into the one file. The
[Jupyter Notebook Viewer source](https://github.com/oatnil-top/ud-registry/tree/main/plugins/ipynb-viewer)
is a full example built this way.

## The plugin registry {#the-plugin-registry}

The **registry** is a single public GitHub repository,
[oatnil-top/ud-registry](https://github.com/oatnil-top/ud-registry), that lists the plugins
anyone can install. The **Plugin library** inside udctl reads its list directly, which is
how one-click install works. Each plugin in the registry carries a fingerprint of its exact
file, and udctl verifies that fingerprint before installing, so what you install is exactly
what was published.

### Submitting your own plugin

Plugins are added to the registry by pull request:

1. Fork [oatnil-top/ud-registry](https://github.com/oatnil-top/ud-registry).
2. Add your built `.html` file under `plugins/<id>/<id>.html` and a matching entry in
   `plugins.json`.
3. Open a pull request — the template walks you through the fields to fill in.

An automated check makes sure your entry is well-formed and that the fingerprint matches the
file, and a reviewer reads the source before it is merged. Merging publishes it to the
library. The full submission steps are in the registry's
[README](https://github.com/oatnil-top/ud-registry#submitting-a-plugin).
