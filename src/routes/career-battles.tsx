import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, Swords, DollarSign, GraduationCap, TrendingUp, User as UserIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { CAREER_SPECS, CAREER_BATTLES, type CareerSpec } from "@/lib/abbi-extras";

export const Route = createFileRoute("/career-battles")({
  head: () => ({ meta: [{ title: "Career Battles — Abilitio" }] }),
  component: CareerBattlesPage,
});

function CareerBattlesPage() {
  const careerKeys = Object.keys(CAREER_SPECS);
  const [a, setA] = useState(CAREER_BATTLES[0].a);
  const [b, setB] = useState(CAREER_BATTLES[0].b);
  const A = CAREER_SPECS[a]; const B = CAREER_SPECS[b];

  return (
    <PageShell>
      <section className="relative px-4 pt-16 pb-24 sm:px-6">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl">
          <header className="mb-8 text-center animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Career Battles
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Compare two career paths</h1>
            <p className="mt-2 text-sm text-muted-foreground">See salary, skills, education, demand, and personality fit side-by-side.</p>
          </header>

          {/* Quick presets */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {CAREER_BATTLES.map((bt) => (
              <button key={bt.a + bt.b} onClick={() => { setA(bt.a); setB(bt.b); }}
                className="rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
                {bt.a} vs {bt.b}
              </button>
            ))}
          </div>

          {/* Pickers */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <Picker value={a} onChange={setA} options={careerKeys} />
            <div className="flex items-center justify-center text-sm font-bold gradient-text">
              <Swords className="mr-2 h-4 w-4" /> VS
            </div>
            <Picker value={b} onChange={setB} options={careerKeys} />
          </div>

          {/* Battle */}
          <Reveal className="grid gap-5 md:grid-cols-2">
            <CareerCard c={A} accent="left" winner={A.demand >= B.demand} />
            <CareerCard c={B} accent="right" winner={B.demand > A.demand} />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function Picker({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm font-medium outline-none focus:border-primary/50">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function CareerCard({ c, winner }: { c: CareerSpec; accent: "left" | "right"; winner: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${
      winner ? "border-primary/40 bg-gradient-to-br from-primary/15 to-accent/10" : "border-border/60 bg-gradient-to-br from-secondary/40 to-background/40"
    }`}
      style={{ boxShadow: winner ? "0 16px 40px -16px oklch(0.55 0.22 295 / 0.55)" : "0 10px 30px -15px oklch(0.55 0.22 295 / 0.3)" }}>
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-3xl"
        style={{ background: `radial-gradient(circle, oklch(${winner ? "0.65 0.24 295" : "0.60 0.18 285"} / 0.6), transparent 70%)` }} />
      {winner && (
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
          <TrendingUp className="h-3 w-3" /> Higher demand
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 ring-1 ring-primary/30 text-2xl shadow-[0_4px_16px_-6px_var(--glow)]">{c.emoji}</div>
        <h3 className="text-xl font-bold">{c.name}</h3>
      </div>

      <div className="mt-5 space-y-3">
        <Row icon={DollarSign} label="Salary range" value={c.salary} />
        <Row icon={GraduationCap} label="Education" value={c.education} />
        <Row icon={UserIcon} label="Personality fit" value={c.personality} />
        <Row icon={TrendingUp} label="Future demand" value={`${c.demand}/100`} bar={c.demand} />
      </div>

      <div className="mt-5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Core skills</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {c.skills.map((s) => (
            <span key={s} className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, bar }: { icon: React.ElementType; label: string; value: string; bar?: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground"><Icon className="h-3.5 w-3.5 text-primary" /> {label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      {typeof bar === "number" && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary/60">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  );
}
