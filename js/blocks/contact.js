import { hero, contact } from '../../content.js';

export function renderContact() {
  const c = document.getElementById('closing');
  c.textContent = contact.closing;
  if (contact.closingAccent)
    c.innerHTML = c.innerHTML.replace(contact.closingAccent, `<span class="acc">${contact.closingAccent}</span>`);
  document.getElementById('contactBlurb').textContent = contact.blurb;
  document.getElementById('mail').href = 'mailto:' + hero.email;
  document.getElementById('footResume').href   = hero.resume;
  document.getElementById('footGithub').href   = hero.github;
  document.getElementById('footLinkedin').href = hero.linkedin;
  document.getElementById('footLine').textContent =
    `${hero.status} · ${hero.place} · ${hero.email} · © ${new Date().getFullYear()} ${hero.name}`;
}
