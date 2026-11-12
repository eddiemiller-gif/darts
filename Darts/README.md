# VFW Darts League Desk

A browser-based editor for the seven tabs in the Fall 2026 Week 7 darts workbook, with Excel export that preserves the original workbook package and updates edited cells.

## Use locally

Open **VFW Darts League Desk.html** in a browser. It is self-contained and works without a server or internet connection. Draft changes are stored in the current browser when storage is available. Use **Export Excel** to keep a workbook copy.

## Serve the website

Serve the `dist` directory with any static web server. `dist/index.html` is the entry point. No backend is required. Drafts are browser-local, not shared between users.

## Development

Requires Node.js 24 or later.

```sh
npm ci
node build-local.cjs
node verify.cjs
node verify-local.cjs
```

The build script bundles `dist` into the standalone HTML file. Tests check the seven entry tabs and exported OOXML package, including preservation of formulas, styles, and merged cells. Excel recalculates formulas when opening an exported workbook. The website displays original cached formula values outside its live standings totals. Tabs remain independent, matching the source workbook.

The supplied workbook includes player names and telephone numbers. Both the static site assets and standalone HTML contain this data; repository access determines who can read it.
