---
title: Update the Desktop App, and Go Back
sidebar_position: 3
---

# Update the Desktop App, and Go Back

From version 0.191.0 the udctl desktop app on macOS can update itself: it downloads the new version inside the app and installs it when you restart. This page covers how that works, where the safety copy of your data is, and how to return to the previous version if an update goes wrong.

On Windows and Linux the app still opens the [download page](https://udctl.com/download) and you install the new version by hand. In-app update will be turned on there once it has been verified on each platform.

## How updating works

1. Click **Check for updates** in the title bar, or open **Settings > Software Update**. The app only checks when you click. It never checks in the background or at startup.
2. If a newer version exists, click it. The download runs inside the app and shows real progress. You can close the window; the download continues.
3. When the download is finished the app shows **Restart to update**. Nothing is installed until you click it. If workspace sessions are running, the app tells you how many a restart will end and asks first.
4. The app shuts down, replaces itself, and opens again on the new version. This can take up to a minute.

If you downloaded an update but did not restart, it is installed the next time you quit the app.

A check or a download sends no account, device or usage information. The app reads a version file and downloads the package, nothing else.

In-app update needs the app to be in your **Applications** folder. If you run it from somewhere else (straight from the disk image, for example), the button opens the download page instead.

**Download manually** in Settings always opens the download page, whatever state an update is in.

## The copy made before every update

An update can change the format of your database, and an older version cannot read the newer format. So right before installing, the app copies your database into a folder named `update-backups` inside your data directory:

```
<data directory>/update-backups/undercontrol-20261120-193045-from-v0.190.0.db
```

- The name holds the date and time of the copy and the version it was taken from.
- The two most recent copies are kept. Each one is the size of your database.
- If the copy cannot be made (the disk is full, the folder is not writable), the update is **not** installed and the app tells you why after it reopens.

The data directory is `~/Library/Application Support/undercontrol-desktop` on macOS unless you chose another folder in Settings.

The copy holds the database only. Uploaded files are not changed by an update and are not copied.

## Go back to the previous version

Do this only if the new version does not work for you. Anything you created **after** the update is not in the copy and will not be there when you go back.

1. **Quit udctl.** Make sure it is fully closed, not just the window.
2. **Get the previous version.** Its installer is at:

   ```
   https://dl.udctl.com/releases/<version>/undercontrol-desktop-<version>-arm64.dmg    (Apple silicon)
   https://dl.udctl.com/releases/<version>/undercontrol-desktop-<version>-x64.dmg      (Intel)
   ```

   Replace `<version>` with the version in the name of your copy, for example `0.190.0`. Only the two newest versions are kept online. If yours is no longer there, stop here: without the previous installer this procedure cannot be completed, and your current data is untouched.
3. **Install it** by dragging it into Applications and replacing the newer app. Do not open it yet.
4. **Put the copy in place.** In your data directory:
   - rename `undercontrol.db` to `undercontrol.db.after-update` (keep it until you are sure),
   - copy the file from `update-backups` next to it and name the copy `undercontrol.db`.
   - If the copy in `update-backups` has a companion ending in `-journal`, copy that too and name it `undercontrol.db-journal`.
5. **Open udctl.** It starts on the previous version with your data as it was before the update.

The app will offer the update again the next time you check. Skip it until a fixed version is out.
