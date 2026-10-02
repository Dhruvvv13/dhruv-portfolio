import { experience } from '../../content.js';

/* ---- tile visuals: plain SVG/CSS, each driven by a field in content.js ---- */

// 7-day horizon: one cell per forecast day.
const horizon = (n) => `
  <div class="viz-horizon" aria-hidden="true">
    ${Array.from({ length: n }, (_, d) => `<span style="--d:${d}"><i></i>D${d + 1}</span>`).join('')}
  </div>`;

// Alert timeline: schematic only (no times claimed) — warning lands before the event.
const alertViz = () => `
  <div class="viz-alert" aria-hidden="true">
    <span class="viz-alert-now">Now</span>
    <span class="viz-alert-warn">Alert</span>
    <span class="viz-alert-event">Severe weather</span>
  </div>`;

// Line chart from an array of numbers; shows a "sample data" tag until sample: false.
function lineChart({ label, unit = '', values, sample }) {
  const W = 300, H = 90, min = Math.min(...values), max = Math.max(...values);
  const x = (i) => (i / (values.length - 1)) * W;
  const y = (v) => H - 6 - ((v - min) / (max - min || 1)) * (H - 12);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const last = values[values.length - 1];
  return `
    <figure class="viz-line">
      <figcaption><span class="label">${label}</span>${sample ? '<span class="viz-sample">sample data</span>' : ''}<b>${last}${unit}</b></figcaption>
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${label}: ${values[0]}${unit} to ${last}${unit}">
        <line x1="0" y1="${H - 1}" x2="${W}" y2="${H - 1}" class="viz-axis"/>
        <polygon points="0,${H} ${pts} ${W},${H}" class="viz-area"/>
        <polyline points="${pts}" class="viz-stroke" vector-effect="non-scaling-stroke"/>
      </svg>
      <div class="viz-axis-labels"><span>Epoch 1</span><span>Epoch ${values.length}</span></div>
    </figure>`;
}

// Before/after grid: schematic of gaps being filled (no counts claimed).
const GAPS = [3, 8, 9, 14, 21, 26];
const grid = (holes) => `<div class="viz-grid">${Array.from({ length: 28 }, (_, i) =>
  `<i${holes && GAPS.includes(i) ? ' class="gap"' : ''}></i>`).join('')}</div>`;
const cleanViz = () => `
  <div class="viz-clean" aria-hidden="true">
    <figure>${grid(true)}<figcaption>Raw · gaps</figcaption></figure>
    <span class="viz-clean-arrow">→</span>
    <figure>${grid(false)}<figcaption>Clean · filled</figcaption></figure>
  </div>`;

// Pipeline: ordered steps joined by arrows.
const pipeline = (steps) => `
  ${cleanViz()}
  <ol class="viz-pipe">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>`;

// Fan-in graph: each feature feeds the model.
function fanIn(features) {
  const n = features.length;
  const lines = features.map((_, i) => {
    const y = ((i + 0.5) / n) * 100;
    return `<path d="M0 ${y} C 55 ${y}, 45 50, 100 50" vector-effect="non-scaling-stroke"/>`;
  }).join('');
  return `
    <div class="viz-fan">
      <ul>${features.map((f) => `<li>${f}</li>`).join('')}</ul>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>
      <span class="viz-fan-model">Model</span>
    </div>`;
}

/* Bento tiles: the first three are a row of thirds, the rest go half-width. */
function cardHTML(card, i) {
  const wide = i >= 3 ? ' xp-card--wide' : '';
  const stat = card.stat ? `<div class="xp-stat">${card.stat}</div><div class="label">${card.label}</div>` : '';
  const viz =
    (card.horizon ? horizon(card.horizon) : '') +
    (card.visual === 'alert' ? alertViz() : '') +
    (card.chart ? lineChart(card.chart) : '') +
    (card.steps ? pipeline(card.steps) : '') +
    (card.features ? fanIn(card.features) : '');
  return `<div class="xp-card${wide}">${stat}<h4>${card.title}</h4><p>${card.text}</p>${viz ? `<div class="xp-viz">${viz}</div>` : ''}</div>`;
}

/* Types `segments` (an array of {text, cls?}) into `el` one character at a
   time with a blinking caret at the end — ported by hand from Aceternity's
   TypewriterEffectSmooth (that one's React/framer-motion; this is vanilla
   JS/CSS so it fits the rest of this section instead of pulling in a
   second React island just for one heading). */
function typewriter(el, segments, speed = 42) {
  el.innerHTML = '';
  const caret = document.createElement('span');
  caret.className = 'type-caret';
  el.appendChild(caret);

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    segments.forEach((seg) => {
      const span = document.createElement('span');
      if (seg.cls) span.className = seg.cls;
      span.textContent = seg.text;
      el.insertBefore(span, caret);
    });
    return;
  }

  const chars = segments.flatMap((seg) => [...seg.text].map((ch) => ({ ch, cls: seg.cls })));
  let i = 0;
  let span = null;
  let openCls = null;
  let spanOpen = false; // segment's cls can itself be undefined, so that alone can't signal "no span yet"
  (function tick() {
    if (i >= chars.length) return;
    const { ch, cls } = chars[i++];
    if (!spanOpen || cls !== openCls) {
      span = document.createElement('span');
      if (cls) span.className = cls;
      el.insertBefore(span, caret);
      openCls = cls;
      spanOpen = true;
    }
    span.textContent += ch;
    setTimeout(tick, speed + Math.random() * 35);
  })();
}

export function renderExperience() {
  typewriter(document.getElementById('jobRole'), [
    { text: `${experience.role} · ` },
    { text: experience.company, cls: 'xp-role-accent' },
  ]);

  const grid = document.getElementById('xpGrid');
  grid.innerHTML = experience.cards.map(cardHTML).join('');
}
