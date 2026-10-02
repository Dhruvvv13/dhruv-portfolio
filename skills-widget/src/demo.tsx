import CodeReveal from '@/components/ui/code-reveal';
import { LOGOS, type LogoDef } from '@/components/ui/logo-clouds-utils/logos';

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  // Fisher–Yates: each remaining slot swaps with a uniformly random earlier
  // (or same) one, so every ordering is equally likely.
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Shuffled once when the module loads (i.e. once per page load) rather than
// per-render, so the order doesn't jump around on every re-render but does
// differ between visits/refreshes.
const shuffledLogos: LogoDef[] = shuffle(LOGOS);

export default function SkillsHero() {
  return (
    <div className="w-full bg-background px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-foreground">
          Skills &amp; Technologies
        </p>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          The skills and technologies I've recently been working with
        </p>
      </div>

      <div className="mt-10 sm:mt-12">
        <CodeReveal logos={shuffledLogos} />
      </div>
    </div>
  );
}
