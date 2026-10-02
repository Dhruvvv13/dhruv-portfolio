import './index.css';
import { createRoot } from 'react-dom/client';
import SkillsHero from './demo';

const el = document.getElementById('skills-react-root');
if (el) {
  createRoot(el).render(<SkillsHero />);
}
