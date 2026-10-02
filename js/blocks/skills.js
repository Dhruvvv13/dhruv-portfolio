import { skills } from '../../content.js';
import { ICONS } from './skill-icons.js';

const logo = (name) => ICONS[name] ? `<span class="skill-logo" aria-hidden="true">${ICONS[name]}</span>` : '';

export function renderSkills() {
  document.getElementById('skillGrid').innerHTML = skills.map(s => `
    <div class="skill-card">
      <span class="skill-mark" aria-hidden="true">${ICONS[s.items[0]] || ''}</span>
      <h3>${s.group}</h3>
      <ul class="skill-list">${s.items.map(i => `<li>${logo(i)}<span>${i}</span></li>`).join('')}</ul>
      ${s.used ? `<p class="label">${s.used}</p>` : ''}
    </div>`).join('');
}
