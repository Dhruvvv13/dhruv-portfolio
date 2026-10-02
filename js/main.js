/* Entry point. Each block renders itself from content.js. */
import { renderHero }       from './blocks/hero.js';
import { renderExperience } from './blocks/experience.js';
import { renderAwards }     from './blocks/awards.js';
import { renderProjects }   from './blocks/projects.js';
import { renderSkills }     from './blocks/skills.js';
import { renderContact }    from './blocks/contact.js';
import { startScrollSpy }   from './blocks/nav.js';

renderHero();
renderExperience();
renderAwards();
renderProjects();
renderSkills();
renderContact();

startScrollSpy(['top','projects','experience','skills','awards','contact']);
