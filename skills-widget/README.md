# skills-widget

The portfolio's Skills section as a React + TypeScript + Tailwind + shadcn
component (a code card that types out, then reveals tech logos), built
separately from the rest of the (plain HTML/CSS/JS, no-build-step) site and
loaded as a self-contained script.

The rest of the portfolio is intentionally NOT React — only this section is.

## Rebuilding after an edit

```bash
cd skills-widget
npm install     # first time only
npm run build   # writes dist/skills-widget.js + dist/skills-widget.css
```

`index.html` at the project root links those two files directly:

```html
<link rel="stylesheet" href="skills-widget/dist/skills-widget.css">
...
<script src="skills-widget/dist/skills-widget.js"></script>
```

`dist/` is committed (unlike `node_modules/`) so the site keeps working for
anyone who doesn't run the build.

## Where things live

- `src/components/ui/code-reveal.tsx` — code-editor card that types a
  snippet, then reveals the skill logos (Framer Motion).
- `src/components/ui/dark-veil.tsx` — animated background behind the logos.
- `src/components/ui/logo-clouds-utils/logos.tsx` — the skill list and icon
  choices. Edit this file to add/remove skills.
- `src/demo.tsx` — section heading; shuffles the logos once per page load.
- `src/index.css` — Tailwind + the CSS variables that make the widget match
  the static site's palette (converted from `css/base.css`). Scoped to
  `#skills-react-root` only (Tailwind `important` selector strategy,
  preflight off) so it can never affect the rest of the page.

## Icon notes

Brand icons come from `react-icons/si` (Simple Icons). Two skills have no
brand icon there and use something else: Python uses a hand-drawn
two-tone logo (`src/components/icons/python-logo.tsx`), Matplotlib uses
`lucide-react`'s `ChartSpline`.
