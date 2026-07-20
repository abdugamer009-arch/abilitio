import { useEffect, useState } from "react";
import { Brain, Sparkles, Target, Heart, GraduationCap, Check } from "lucide-react";
import { useT } from "@/lib/i18n";

// Icons for the five analysis steps; the labels come from i18n (t.aiLoading.steps).
const STEP_ICONS = [Brain, Target, Heart, GraduationCap, Sparkles] as const;

export function AILoadingScreen({
  onDone,
  durationMs = 3600,
}: {
  onDone: () => void;
  durationMs?: number;
}) {
  const t = useT();
  const [active, setActive] = useState(0);
  const steps = t.aiLoading.steps.map((label, i) => ({ icon: STEP_ICONS[i], label }));

  useEffect(() => {
    const per = durationMs / STEP_ICONS.length;
    const interval = setInterval(() => {
      setActive((i) => {
        if (i >= STEP_ICONS.length - 1) {
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
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_8px_28px_-8px_var(--glow)]">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
              <span
                className="absolute -inset-1 -z-10 rounded-2xl opacity-40 blur-md"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)",
                }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-accent">{t.aiLoading.eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold gradient-text">{t.aiLoading.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.aiLoading.subtitle}</p>

        <ul className="mt-10 space-y-3 text-left">
          {steps.map((s, i) => {
            const done = i < active;
            const current = i === active;
            const Icon = s.icon;
            return (
              <li
                key={s.label}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all duration-500 ${
                  current
                    ? "border-primary/40 bg-gradient-to-r from-primary/12 to-accent/8 shadow-[0_2px_12px_-4px_var(--glow)]"
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
                  {current && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                  )}
                  {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </span>
                <span className={current ? "text-foreground" : "text-muted-foreground"}>
                  {s.label}
                </span>
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
