# MINIMAP — fantia_auto_renamer (hand this + the relevant source files to any model)

## What this is
A browser extension (Manifest V2) that renames files downloaded from
Fantia (fantia.jp, a Japanese creator-fanclub site) so the saved
filename includes the fanclub owner's name. **This is third-party
code, not a house build**: authored by `mmduser1` (MIT license), forked
into the org as-is. Comments and the options UI are in Japanese.
Version 0.0.3 (manifest.json + package.json). No README.

## How it works
1. `background.js` watches `*://fantia.jp/posts/*/download/*` via
   `chrome.webRequest`. On the redirect response it grabs the real
   file URL from the `location` header, cancels the browser's own
   download, and messages the content script.
2. `content_scripts/down.js` scrapes the fanclub owner name from the
   page (`.fanclub-name`) and sends it back, sanitized
   (`convertSafeFileName` maps forbidden filename chars to full-width
   equivalents, plus `~` and `.`).
3. `background.js` extracts the original title from the file URL
   (the part after `file/<digits>/<9 chars>`, before `?Key-Pair`),
   builds the filename per the saved format setting, and starts the
   download with `chrome.downloads.download` (`conflictAction:
   "prompt"`, `saveAs: true`).

## Layout map
- `manifest.json` — MV2, permissions: tabs, activeTab, downloads,
  storage, webRequest + webRequestBlocking, `*://fantia.jp/*`.
- `background.js` — webRequest interception + download restart.
- `content_scripts/down.js` — page scrape (`.fanclub-name`) + filename
  sanitizer + HTML unescape.
- `options/options.html` — filename-format picker (Japanese UI):
  type1 `username - title`, type2 `[username] title`, type3 `title`.
- `options/options.js` — saves/loads the format in `chrome.storage.local`
  (`filename` key). `options/options.css` — options styling.
- `package.json` — name/version 0.0.3, devDeps `bestzip` +
  `sinon-chrome`; build script zips the extension.
- `LICENSE` — MIT (mmduser1).

## How to build and run it
```bash
npm install
npm run build    # bestzip → IwaraSourceDownloader_chrome.zip (see Gotchas)
```
Load the folder (or the zip) as an unpacked extension in a
Chromium/Firefox browser. No tests are wired up despite `sinon-chrome`
in devDeps.

## Gotchas
- **The build script's zip name is a copy-paste leftover**:
  `IwaraSourceDownloader_chrome.zip` — it also references an `icons/`
  directory that does not exist in the repo, so the build as written
  will fail or produce a zip without icons.
- **Manifest V2**: `webRequestBlocking` + background scripts are MV2
  APIs. Modern Chrome (MV3-only since 2024) will not run this
  unmodified; Firefox still supports MV2. Any modernization means an
  MV3 rewrite (declarativeNetRequest cannot read redirect headers the
  same way — the core interception trick would need rethinking).
- The title extraction regex assumes Fantia's CDN URL shape
  (`file/<digits>/<9-char token>` + `?Key-Pair` query). If Fantia
  changes its URL scheme, the rename breaks silently (title becomes
  garbage or the split throws).
- `down.js` assumes `.fanclub-name` exists on the page; a Fantia
  redesign breaks the owner-name scrape the same way.
- No README, no tests, no CI. The repo is the fork as imported.

## Current state
Version 0.0.3, as imported from mmduser1. No house builds, no build
number file. Dormant third-party utility — document, don't assume
active development.
