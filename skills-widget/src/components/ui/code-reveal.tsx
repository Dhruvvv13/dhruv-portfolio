import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LOGOS, type LogoDef } from "@/components/ui/logo-clouds-utils/logos";
import DarkVeil from "@/components/ui/dark-veil";

/**
 * A code-editor-styled card that types out a snippet character by character
 * (GitHub-dark-ish syntax colors), then cross-fades into the actual skill
 * logos inside the same box and stays there — a one-shot reveal per page
 * load, not a loop. Not based on a pasted reference; built from a
 * screenshot of a static code-block card, so the typing/reveal mechanics
 * here are original.
 */

type TokenType = "keyword" | "string" | "fn" | "comment" | "plain";
interface Token {
  text: string;
  type: TokenType;
}

const TOKEN_CLASS: Record<TokenType, string> = {
  keyword: "text-[#ff7b72]",
  string: "text-[#a5d6ff]",
  fn: "text-[#d2a8ff]",
  comment: "text-[#8b949e]",
  plain: "text-[#c9d1d9]",
};

const t = (text: string, type: TokenType = "plain"): Token => ({ text, type });

const CODE_TOKENS: Token[] = [
  t("const", "keyword"), t(" skills = [\n"),
  t("  "), t('"Python"', "string"), t(", "), t('"PyTorch"', "string"), t(", "), t('"TensorFlow"', "string"), t(",\n"),
  t("  "), t('"OpenCV"', "string"), t(", "), t('"Git"', "string"), t(", "), t('"MongoDB"', "string"), t(",\n"),
  t("];\n\n"),
  t("function", "keyword"), t(" "), t("build", "fn"), t("(skills) {\n"),
  t("  "), t("return", "keyword"), t(" skills.map("), t("showLogo", "fn"), t(");\n"),
  t("}\n\n"),
  t("build", "fn"), t("(skills); "), t("// rendering skills...", "comment"),
];

const CODE_TEXT = CODE_TOKENS.map((tok) => tok.text).join("");
const CODE_LENGTH = CODE_TEXT.length;

type Phase = "typing" | "holdCode" | "logos";

function TypedCode({ shown }: { shown: number }) {
  const nodes: React.ReactNode[] = [];
  let consumed = 0;
  for (let i = 0; i < CODE_TOKENS.length; i++) {
    if (consumed >= shown) break;
    const tok = CODE_TOKENS[i];
    const slice = tok.text.slice(0, shown - consumed);
    if (slice) nodes.push(
      <span key={i} className={TOKEN_CLASS[tok.type]}>{slice}</span>,
    );
    consumed += tok.text.length;
  }
  return <>{nodes}</>;
}

export interface CodeRevealProps {
  logos?: LogoDef[];
  filename?: string;
  language?: string;
  className?: string;
}

export default function CodeReveal({
  logos = LOGOS,
  filename = "skills.js",
  language = "JavaScript",
  className,
}: CodeRevealProps) {
  const reduceMotion = React.useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const [phase, setPhase] = React.useState<Phase>(reduceMotion ? "logos" : "typing");
  const [shown, setShown] = React.useState(reduceMotion ? CODE_LENGTH : 0);

  React.useEffect(() => {
    if (reduceMotion) return; // static: code fully typed once, logos shown, no loop

    let raf = 0;
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      let last = performance.now();
      let acc = 0;
      const CHARS_PER_SEC = 34;
      const step = (now: number) => {
        acc += ((now - last) / 1000) * CHARS_PER_SEC;
        last = now;
        if (acc >= 1) {
          const add = Math.floor(acc);
          acc -= add;
          setShown((s) => Math.min(CODE_LENGTH, s + add));
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    } else if (phase === "holdCode") {
      timeout = setTimeout(() => setPhase("logos"), 900);
    }
    // "logos" is terminal: once revealed, it stays until the page reloads
    // rather than looping back to retyping.

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
    };
  }, [phase, reduceMotion]);

  React.useEffect(() => {
    if (!reduceMotion && phase === "typing" && shown >= CODE_LENGTH) {
      setPhase("holdCode");
    }
  }, [shown, phase, reduceMotion]);

  const showingLogos = phase === "logos";

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl",
        className,
      )}
    >
      {/* macOS-style title bar: traffic-light window controls pinned left,
          filename centered — the classic "code screenshot" look. */}
      <div className="relative flex items-center border-b border-border/60 bg-white/[0.02] px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#FF5F56]" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <span className="h-3 w-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5">
          <span className="rounded-md bg-foreground/10 px-2.5 py-1 text-xs font-semibold text-foreground">
            {language}
          </span>
          <span className="text-sm text-muted-foreground">{filename}</span>
        </div>
      </div>

      <div className="relative min-h-[22rem] overflow-hidden bg-background/40 sm:min-h-[26rem]">
        <AnimatePresence mode="wait">
          {!showingLogos ? (
            <motion.pre
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 whitespace-pre-wrap p-6 font-mono text-sm leading-relaxed sm:p-8 sm:text-base"
            >
              <TypedCode shown={shown} />
              <span
                className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-foreground/70"
                aria-hidden="true"
              />
            </motion.pre>
          ) : (
            <motion.div
              key="logos"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: reduceMotion ? 0 : 0.4 }}
              // absolute + inset-0 (rather than h-full) so this actually
              // fills the box's full min-height and centers within it —
              // a `h-full` child of an auto-height parent resolves to
              // `auto` per spec, which is why logos previously only took
              // up as much height as they needed and left blank space
              // below instead of filling/centering in the box.
              className="absolute inset-0 overflow-hidden"
            >
              <DarkVeil
                hueShift={0}
                noiseIntensity={0}
                scanlineIntensity={0}
                speed={0.5}
                scanlineFrequency={0}
                warpAmount={0}
                className="absolute inset-0 h-full w-full"
              />
              <div className="relative z-10 flex h-full flex-wrap items-center justify-center gap-x-8 gap-y-8 p-6 sm:p-8">
                {logos.map((logo, i) => (
                  <motion.div
                    key={logo.name}
                    initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                    }
                    className="flex w-16 flex-col items-center gap-2"
                  >
                    <logo.Icon
                      className="h-8 w-8"
                      style={logo.color ? { color: logo.color } : undefined}
                    />
                    <span className="whitespace-nowrap text-[11px] font-medium text-muted-foreground">
                      {logo.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
