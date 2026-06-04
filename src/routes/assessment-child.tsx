import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, Check, Sparkles, Trophy, RefreshCw } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { childQuestions, scoreChildAssessment, TRAIT_LABELS, CHILD_ROADMAP, type ChildResult } from "@/lib/assessment-child";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/assessment-child")({
  head: () => ({
    meta: [
      { title: "Discovery Quest — Abilitio" },
      { name: "description", content: "A fun, gamified assessment for explorers ages 8–12." },
    ],
  }),
  component: ChildAssessmentPage,
});

function ChildAssessmentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ChildResult | null>(null);

  // Set age_group on profile if not set
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").update({ age_group: "child" }).eq("id", user.id);
  }, [user]);

  const total = childQuestions.length;
  const q = childQuestions[step];
  const progress = ((step) / total) * 100;
  const selected = answers[q?.id];

  function select(i: number) {
    if (!q) return;
    setAnswers({ ...answers, [q.id]: i });
  }
  function next() {
    if (step === total - 1) {
      const r = scoreChildAssessment(answers);
      setResult(r);
      if (typeof window !== "undefined") {
        localStorage.setItem("abilitio_child_result", JSON.stringify(r));
      }
      return;
    }
    setStep((s) => s + 1);
  }
  function back() { setStep((s) => Math.max(0, s - 1)); }

  if (!started) {
    return (
      <PageShell>
        <section className="px-6 pt-20 pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-4xl shadow-[0_20px_60px_-20px_var(--glow)]">
              🚀
            </div>
            <h1 className="mt-8 text-4xl font-bold md:text-5xl gradient-text">Discovery Quest</h1>
            <p className="mt-4 text-muted-foreground">
              A fun 5-minute quest to discover your superpowers — your curiosity, creativity, leadership and more.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3 text-left">
              {[
                { e: "🧩", t: "20 fun questions" },
                { e: "🏆", t: "Earn badges" },
                { e: "🌟", t: "Discover strengths" },
              ].map((x) => (
                <div key={x.t} className="glass rounded-2xl p-5">
                  <div className="text-2xl">{x.e}</div>
                  <div className="mt-2 text-sm font-medium">{x.t}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStarted(true)}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5"
            >
              Start my quest <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </PageShell>
    );
  }

  if (result) {
    return <ChildResultsScreen result={result} onRestart={() => { setStarted(false); setStep(0); setAnswers({}); setResult(null); }} />;
  }

  if (!q) return null;

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Quest {step + 1} / {total}
            </span>
            <span className="rounded-full bg-secondary px-3 py-1">{Object.keys(answers).length} answered</span>
          </div>
          <div className="mb-10 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <div key={q.id} className="glass animate-fade-up rounded-3xl p-8 md:p-10">
            <div className="text-5xl">{q.emoji}</div>
            <h2 className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">{q.prompt}</h2>

            <div className="mt-8 space-y-3">
              {q.options.map((opt, i) => {
                const isSel = selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => select(i)}
                    className={`group flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm transition-all ${
                      isSel
                        ? "border-primary bg-primary/15 glow-purple"
                        : "border-border bg-secondary/40 hover:border-primary/60 hover:bg-secondary"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                      <span>{opt.label}</span>
                    </span>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${isSel ? "border-accent bg-accent text-accent-foreground" : "border-border"}`}>
                      {isSel && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button onClick={back} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:bg-secondary disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button onClick={next} disabled={selected == null} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-40">
                {step === total - 1 ? "See my results" : "Next"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ChildResultsScreen({ result, onRestart }: { result: ChildResult; onRestart: () => void }) {
  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center animate-fade-up">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-4xl shadow-[0_20px_60px_-20px_var(--glow)]">
              🏆
            </div>
            <h1 className="mt-6 text-4xl font-bold gradient-text">Your Superpowers</h1>
            <p className="mt-3 text-muted-foreground">Here are the strengths that make you you.</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {result.topTraits.map((trait, i) => {
              const label = TRAIT_LABELS[trait];
              return (
                <div key={trait} className={`glass rounded-3xl p-7 text-center ${i === 0 ? "glow-purple md:-mt-4" : ""}`}>
                  <div className="text-5xl">{label.emoji}</div>
                  <div className="mt-3 text-[10px] uppercase tracking-wider text-accent">#{i + 1} Strength</div>
                  <h3 className="mt-1 text-xl font-bold">{label.name}</h3>
                  <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                    {label.badge} badge
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12">
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.18em] text-accent">Future Directions</span>
              <h2 className="mt-2 text-2xl font-semibold">Worlds to explore</h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {result.directions.map((d) => (
                <div key={d.title} className="glass rounded-2xl p-6 transition-all hover:-translate-y-1">
                  <div className="text-3xl">{d.emoji}</div>
                  <h3 className="mt-3 font-semibold">{d.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.18em] text-accent">Your Quest Roadmap</span>
              <h2 className="mt-2 text-2xl font-semibold">Adventures for this month</h2>
              <p className="mt-2 text-sm text-muted-foreground">Complete activities to earn Aura Coins ✨</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CHILD_ROADMAP.map((m) => (
                <div key={m.title} className="glass flex items-center justify-between rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-sm font-medium">{m.title}</span>
                  </div>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">+{m.aura} ✨</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple">
              Go to my dashboard
            </Link>
            <button onClick={onRestart} className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm hover:bg-secondary">
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
