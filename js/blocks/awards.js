import { awards, awardStats } from '../../content.js';

export function renderAwards() {
  document.getElementById('awardStats').innerHTML = awardStats.map(s =>
    `<div><b>${s.value}</b><span>${s.label}</span></div>`).join('');

  document.getElementById('awardList').innerHTML = awards.map(a => `
    <li>
      <span class="yr">${a.year}</span>
      <div>
        <strong><span class="rank">${a.rank}</span> · ${a.event}</strong>
        <span class="note">${a.note}${a.cred ? ` <a href="${a.cred}" target="_blank" rel="noopener">Credential →</a>` : ''}</span>
      </div>
    </li>`).join('');
}
