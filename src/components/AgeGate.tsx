import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export type AgeGroup = "child" | "teen" | "adult";

const OPTIONS: { value: AgeGroup; emoji: string; label: string; sub: string }[] = [
  { value: "child", emoji: "🧒", label: "8 – 12", sub: "Explorer · Discover your strengths" },
  { value: "teen", emoji: "🧑", label: "13 – 17", sub: "Student · Careers & universities" },
  { value: "adult", emoji: "👨", label: "18+", sub: "Professional · Jobs & growth" },
];

export function AgeGate({
  onSelected,
  initial = null,
}: {
  onSelected: (group: AgeGroup) => void;
  initial?: AgeGroup | null;
}) {
  const { user } = useAuth();
  const [picked, setPicked] = useState<AgeGroup | null>(initial);
  const [saving, setSaving] = useState(false);

  async function commit(group: AgeGroup) {
    setPicked(group);
    setSaving(true);
    if (user) {
      await supabase.from("profiles").update({ age_group: group }).eq("id", user.id);
    } else if (typeof window !== "undefined") {
      localStorage.setItem("abilitio_age_group", group);
    }
    setSaving(false);
    onSelected(group);
  }

  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-xs uppercase tracking-[0.2em] text-accent">Personalize your journey</span>
      <h2 className="mt-3 text-3xl font-bold md:text-4xl gradient-text">How old are you?</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        We adapt the assessment, ABBI AI tone, and roadmap to your age group.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {OPTIONS.map((o) => {
          const active = picked === o.value;
          return (
            <button
              key={o.value}
              disabled={saving}
              onClick={() => commit(o.value)}
              className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition-all hover:-translate-y-1 ${
                active
                  ? "border-primary/60 bg-gradient-to-br from-primary/20 to-accent/15 shadow-[0_20px_60px_-20px_var(--glow)]"
                  : "border-border/60 bg-secondary/30 hover:border-primary/40"
              }`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-3xl"
                style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)" }}
              />
              <div className="relative">
                <div className="text-4xl">{o.emoji}</div>
                <div className="mt-3 text-lg font-semibold">{o.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{o.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
      {saving && <p className="mt-6 text-xs text-muted-foreground">Saving…</p>}
    </div>
  );
}
