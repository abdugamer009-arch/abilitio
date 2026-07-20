import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { GlowBlob } from "@/components/GlowBlob";
import { useT } from "@/lib/i18n";

export type AgeGroup = "child" | "teen" | "adult";

const OPTION_META: { value: AgeGroup; emoji: string; label: string }[] = [
  { value: "child", emoji: "🧒", label: "8 – 12" },
  { value: "teen", emoji: "🧑", label: "13 – 17" },
  { value: "adult", emoji: "👨", label: "18+" },
];

export function AgeGate({
  onSelected,
  initial = null,
}: {
  onSelected: (group: AgeGroup) => void;
  initial?: AgeGroup | null;
}) {
  const { user } = useAuth();
  const t = useT();
  const subs: Record<AgeGroup, string> = {
    child: t.ageGate.childSub,
    teen: t.ageGate.teenSub,
    adult: t.ageGate.adultSub,
  };
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
      <span className="text-xs uppercase tracking-[0.2em] text-accent">{t.ageGate.eyebrow}</span>
      <h2 className="mt-3 text-3xl font-bold md:text-4xl gradient-text">{t.ageGate.title}</h2>
      <p className="mt-3 text-sm text-muted-foreground">{t.ageGate.subtitle}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {OPTION_META.map((o) => {
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
              <GlowBlob className="-right-10 -top-10 h-32 w-32 opacity-50 blur-3xl" alpha={0.5} />
              <div className="relative">
                <div className="text-4xl">{o.emoji}</div>
                <div className="mt-3 text-lg font-semibold">{o.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{subs[o.value]}</div>
              </div>
            </button>
          );
        })}
      </div>
      {saving && <p className="mt-6 text-xs text-muted-foreground">{t.ageGate.saving}</p>}
    </div>
  );
}
