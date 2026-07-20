import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, MapPin, Award, Sparkles, Search, Filter } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { GlowBlob } from "@/components/GlowBlob";
import { FloatingShapes } from "@/components/FloatingShapes";
import {
  UNIVERSITIES,
  COUNTRIES,
  MAJORS,
  checkEligibility,
  type University,
  type Eligibility,
} from "@/lib/abbi/abbi-extras";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/universities")({
  head: () => ({
    meta: [
      { title: "University Explorer — Abilitio" },
      {
        name: "description",
        content:
          "Find universities that match your scores and goals. Filter by SAT, IELTS, country, and major to see your fit and scholarships.",
      },
    ],
  }),
  component: UniversitiesPage,
});

function UniversitiesPage() {
  const t = useT();
  const { user } = useAuth();
  const [sat, setSat] = useState<number | "">("");
  const [ielts, setIelts] = useState<number | "">("");
  const [country, setCountry] = useState<string>("");
  const [major, setMajor] = useState<string>("");
  const [prefilled, setPrefilled] = useState(false);

  // Prefill from the SAT / IELTS scores saved in the dashboard (once).
  useEffect(() => {
    if (!user || prefilled) return;
    supabase
      .from("user_stats")
      .select("sat_score, ielts_band")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setPrefilled(true);
        if (!data) return;
        setSat((prev) => (prev === "" && data.sat_score != null ? data.sat_score : prev));
        setIelts((prev) => (prev === "" && data.ielts_band != null ? data.ielts_band : prev));
      });
  }, [user, prefilled]);

  const filtered = useMemo(() => {
    const satN = sat === "" ? null : Number(sat);
    const ieltsN = ielts === "" ? null : Number(ielts);
    // Fit derives from the same eligibility check the badge uses, so the
    // number and the chip on a card can never contradict each other.
    const fitRank = { eligible: 100, close: 60, below: 20, unknown: 50 } as const;
    return UNIVERSITIES.filter((u) => {
      if (country && u.country !== country) return false;
      if (major && !u.majors.includes(major)) return false;
      return true;
    })
      .map((u) => {
        const elig = checkEligibility(u, satN, ieltsN);
        return { u, fit: fitRank[elig], elig };
      })
      .sort((a, b) => b.fit - a.fit || a.u.minSat - b.u.minSat);
  }, [sat, ielts, country, major]);

  return (
    <PageShell>
      <section className="relative px-4 pt-16 pb-24 sm:px-6">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <FloatingShapes />
        <div className="relative mx-auto max-w-6xl">
          <header className="mb-8 text-center animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="h-3 w-3" /> {t.uniPage.badge}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.uniPage.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.uniPage.subtitle}</p>
          </header>

          {/* Filters */}
          <div className="glass mb-8 rounded-3xl p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FilterField label={t.uniPage.satScore} icon={Search}>
                <input
                  type="number"
                  min={400}
                  max={1600}
                  value={sat}
                  onChange={(e) => setSat(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 1350"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                />
              </FilterField>
              <FilterField label={t.uniPage.ieltsBand} icon={Search}>
                <input
                  type="number"
                  min={4}
                  max={9}
                  step={0.5}
                  value={ielts}
                  onChange={(e) => setIelts(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="e.g. 7.0"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                />
              </FilterField>
              <FilterField label={t.uniPage.country} icon={MapPin}>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="">{t.uniPage.anyCountry}</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FilterField>
              <FilterField label={t.uniPage.intendedMajor} icon={Filter}>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="">{t.uniPage.anyMajor}</option>
                  {MAJORS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </FilterField>
            </div>
          </div>

          {/* Results */}
          <Reveal className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(({ u, fit, elig }) => (
              <UniCard key={u.name} u={u} fit={fit} major={major} elig={elig} />
            ))}
          </Reveal>
          {filtered.length === 0 && (
            <p className="mt-12 text-center text-sm text-muted-foreground">{t.uniPage.noMatches}</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function FilterField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-2xl border border-border/60 bg-secondary/30 px-4 py-3">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      {children}
    </label>
  );
}

function UniCard({
  u,
  fit,
  major,
  elig,
}: {
  u: University;
  fit: number;
  major: string;
  elig: Eligibility;
}) {
  const t = useT();
  const compLabel: Record<University["competitiveness"], string> = {
    Reach: t.uniPage.reach,
    Match: t.uniPage.match,
    Safety: t.uniPage.safety,
  };
  const compColor =
    u.competitiveness === "Reach"
      ? "from-pink-500/30 to-primary/30 text-primary"
      : u.competitiveness === "Match"
        ? "from-primary/30 to-accent/30 text-primary"
        : "from-emerald-500/20 to-primary/20 text-emerald-300";
  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/40 to-background/40 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40"
      style={{ boxShadow: "0 10px 30px -15px oklch(0.55 0.22 295 / 0.4)" }}
    >
      <GlowBlob className="-right-12 -top-12 h-36 w-36 opacity-30 blur-3xl" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_6px_20px_-8px_var(--glow)] transition-transform duration-300 group-hover:scale-105">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="flex items-center gap-1.5">
          {elig !== "unknown" && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                elig === "eligible"
                  ? "border-green-500/40 bg-green-500/15 text-green-400"
                  : elig === "close"
                    ? "border-yellow-500/40 bg-yellow-500/15 text-yellow-400"
                    : "border-red-500/40 bg-red-500/15 text-red-400"
              }`}
            >
              {elig === "eligible"
                ? t.uniPage.eligible
                : elig === "close"
                  ? t.uniPage.close
                  : t.uniPage.belowMin}
            </span>
          )}
          <span
            className={`rounded-full bg-gradient-to-br ${compColor} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider`}
          >
            {compLabel[u.competitiveness]}
          </span>
        </span>
      </div>
      <h3 className="relative mt-4 text-lg font-semibold leading-tight">{u.name}</h3>
      <div className="relative mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" /> {u.city}, {u.country}
      </div>

      <div className="relative mt-4 grid grid-cols-2 gap-2 text-[11px]">
        <Stat label={t.uniPage.minSat} value={u.minSat.toString()} />
        <Stat label={t.uniPage.minIelts} value={u.minIelts.toString()} />
        <Stat label={t.uniPage.acceptance} value={`${u.acceptance}%`} />
        <Stat label={t.uniPage.fit} value={elig === "unknown" ? "—" : `${fit}%`} highlight />
      </div>

      <div className="relative mt-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {t.uniPage.topMajors}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {u.majors.slice(0, 4).map((m) => (
            <span
              key={m}
              className={`rounded-full border px-2 py-0.5 text-[10px] ${
                major === m
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border/60 bg-secondary/50 text-muted-foreground"
              }`}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-[11px]">
        <Award className="h-3.5 w-3.5 text-primary" />
        <span className="text-muted-foreground">{u.scholarship}</span>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/30 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-sm font-semibold tabular-nums ${highlight ? "gradient-text" : ""}`}>
        {value}
      </div>
    </div>
  );
}
