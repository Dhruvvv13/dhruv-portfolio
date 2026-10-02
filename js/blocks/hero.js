import { hero } from '../../content.js';

const $ = s => document.querySelector(s);

export function renderHero() {
  $('#mark').innerHTML = `${hero.name}<span>.</span>`;
  $('#navResume').href = hero.resume;
  $('#heroRole').textContent = hero.role;

  // Headline with one word in the serif accent.
  const h1 = $('#heroHeadline');
  h1.textContent = hero.headline;
  if (hero.accentWord) h1.innerHTML = h1.innerHTML.replace(hero.accentWord, `<span class="acc hl">${hero.accentWord}</span>`);

  const intro = $('#heroIntro');
  intro.textContent = hero.intro;
  intro.innerHTML = intro.innerHTML.replace('Dhruv', '<span class="acc hl">Dhruv</span>');
  $('#heroResume').href = hero.resume;
  $('#heroGithub').href = hero.github;
  $('#heroLinkedin').href = hero.linkedin;
}
