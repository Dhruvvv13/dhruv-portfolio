import { projects } from '../../content.js';

/* Studied split: media on one side, story + two numbers + buttons on the other,
   alternating sides. No image yet → the headline metric fills a tinted panel. */
export function renderProjects() {
  document.getElementById('projList').innerHTML = projects.map((p, i) => `
    <article class="proj">
      <div class="proj-media" style="--tint:var(--color-tint-${(i % 2) + 1})">
        ${p.image
          ? `<img src="${p.image}" alt="${p.imageAlt || p.name}" width="1200" height="675" loading="lazy">`
          : `<div class="proj-panel"><span class="acc">${p.metric.value}</span><span class="label">${p.metric.label}</span></div>`}
      </div>
      <div class="proj-body">
        <ul class="tags">${p.tags.split(' · ').map(t => `<li>${t}</li>`).join('')}</ul>
        <h3>${p.name}</h3>
        <p>${p.blurb}</p>
        <dl class="proj-stats">
          ${[p.metric, p.metric2].filter(Boolean).map(m => `<div><dt>${m.value}</dt><dd>${m.label.toLowerCase()}</dd></div>`).join('')}
        </dl>
        <p class="label">${p.stack}</p>
        <div class="proj-actions">
          ${p.code ? `<a class="btn btn-dark" href="${p.code}" target="_blank" rel="noopener">View code ↗</a>` : ''}
          <a class="btn btn-outline" href="#contact">Ask me about it</a>
        </div>
      </div>
    </article>`).join('');
}
