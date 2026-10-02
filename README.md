# Portfolio

## Run it
Open this folder in VS Code, then right-click `index.html` → **Open with Live Server**.
Do not double-click the file — ES modules need a server, `file://` will show a blank page.

No build step, no npm install.

## Where things live
- `content.js` — all your text. Edit this first and most often.
- `css/base.css` — colours, fonts, spacing tokens. Change `--accent` here.
- `css/layout.css` — nav, section index, page rhythm.
- `css/blocks/*.css` — one file per section.
- `js/blocks/*.js` — one module per section, each exports a `render` function.
- `js/main.js` — calls each block's render in order.

## Adding a block
1. `css/blocks/newblock.css` + a `<link>` in index.html
2. `js/blocks/newblock.js` exporting `renderNewBlock()`
3. Import and call it in `js/main.js`
4. Add the `<section id="newblock">` markup and a nav entry

## Deploy
Push to GitHub, import the repo at vercel.com. No config needed.
