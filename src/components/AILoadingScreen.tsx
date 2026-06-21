import { useEffect, useState } from "react";
import { Brain, Sparkles, Target, Heart, GraduationCap, Check } from "lucide-react";

type Step = { icon: typeof Brain; label: string };

const STEPS: Step[] = [
  { icon: Brain, label: "Analyzing cognitive patterns" },
  { icon: Target, label: "Mapping strengths and abilities" },
  { icon: Heart, label: "Synthesizing personality profile" },
  { icon: GraduationCap, label: "Matching careers and universities" },
  { icon: Sparkles, label: "Composing your personal summary" },
];

export function AILoadingScreen({ onDone, durationMs = 3600 }: { onDone: () => void; durationMs?: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const per = durationMs / STEPS.length;
    const interval = setInterval(() => {
      setActive((i) => {
        if (i >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(onDone, per * 0.9);
          return i;
        }
        return i + 1;
      });
    }, per);
    return () => clearInterval(interval);
  }, [durationMs, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl animate-fade-in">
      {/* soft purple halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, color-mix(in oklab, var(--primary) 18%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-md px-6 text-center">
        {/* orbit */}
        <div className="relative mx-auto mb-10 h-28 w-28">
          <div
            className="absolute inset-0 rounded-full border border-primary/20"
            style={{ animation: "spin 6s linear infinite" }}
          />
          <div
            className="absolute inset-2 rounded-full border border-accent/30"
            style={{ animation: "spin 9s linear infinite reverse" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-accent">AI Analysis</p>
        <h2 className="mt-3 text-2xl font-semibold gradient-text">Crafting your talent profile</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Our model is reading your responses and assembling something personal.
        </p>

        <ul className="mt-10 space-y-3 text-left">
          {STEPS.map((s, i) => {
            const done = i < active;
            const current = i === active;
            const Icon = s.icon;
            return (
              <li
                key={s.label}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all duration-500 ${
                  current
                    ? "border-primary/40 bg-primary/10"
                    : done
                    ? "border-border/60 bg-secondary/40 opacity-80"
                    : "border-border/40 bg-transparent opacity-40"
                }`}
              >
                <span
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full ${
                    done
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_2px_8px_-2px_var(--glow)]"
                      : current
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {current && <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />}
                  {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </span>
                <span className={current ? "text-foreground" : "text-muted-foreground"}>{s.label}</span>
                {current && (
                  <span className="ml-auto inline-flex gap-1">
                    <Dot delay={0} />
                    <Dot delay={150} />
                    <Dot delay={300} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-accent"
      style={{ animation: `pulse 1.2s ${delay}ms ease-in-out infinite` }}
    />
  );
}
