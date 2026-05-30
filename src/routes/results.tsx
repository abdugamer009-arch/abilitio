import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useMemo, useState } from "react";
import { Lock, Sparkles, Brain, Target, Activity } from "lucide-react";
import { scoreAnswers } from "@/lib/iq-questions";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Your IQ Results — Abilitio" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);

  const answers = useMemo<(number | null)[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = sessionStorage.getItem("iq_answers");
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }, []);

  const result = useMemo(() => (answers.length ? scoreAnswers(answers) : null), [answers]);

  // Save to DB once logged in
  useEffect(() => {
    if (!user || !result || saved) return;
    (async () => {
      await supabase.from("iq_results").insert({
        user_id: user.id,
        score: result.score,
        level: result.level,
        logical_score: result.logical,
        analytical_score: result.analytical,
        pattern_score: result.pattern,
        correct_count: result.correct,
        total_questions: 10,
        time_seconds: 0,
        answers,
      });
      setSaved(true);
      sessionStorage.removeItem("iq_answers");
    })();
  }, [user, result, saved, answers]);

  if (!result) {
    return (
      <PageShell>
        <section className="px-6 pt-24 pb-24">
          <div className="mx-auto max-w-xl text-center glass rounded-3xl p-10">
            <h1 className="text-2xl font-semibold">No results yet</h1>
            <p className="mt-3 text-muted-foreground">Take the test to see your IQ profile.</p>
            <Link to="/iq-test" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple">
              Take the test
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const showGate = !loading && !user && !revealed;

  return (
    <PageShell>
      <section className="relative px-6 pt-12 pb-24">
        <div className={`mx-auto max-w-4xl transition-all duration-500 ${showGate ? "blur-lg pointer-events-none select-none" : ""}`}>
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-accent">Your IQ Profile</span>
            <h1 className="mt-2 text-4xl font-bold md:text-5xl gradient-text">{result.level}</h1>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.2fr]">
            <ScoreRing score={result.score} />
            <div className="glass rounded-3xl p-8">
              <h2 className="text-lg font-semibold">Performance Breakdown</h2>
              <div className="mt-6 space-y-5">
                <Bar icon={<Brain className="h-4 w-4" />} label="Logical Reasoning" value={result.logical} />
                <Bar icon={<Target className="h-4 w-4" />} label="Analytical Thinking" value={result.analytical} />
                <Bar icon={<Activity className="h-4 w-4" />} label="Pattern Recognition" value={result.pattern} />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/dashboard" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:glow-purple">
                  Go to Dashboard
                </Link>
                <Link to="/iq-test" className="rounded-full border border-border px-5 py-2.5 text-sm hover:bg-secondary">
                  Retake test
                </Link>
              </div>
            </div>
          </div>
        </div>

        {showGate && (
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="glass animate-fade-up max-w-md rounded-3xl p-10 text-center glow-purple">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Lock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Unlock your IQ results</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Create a free account to view your full breakdown and save your results.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => navigate({ to: "/auth", search: { mode: "signup", next: "/results" } })}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple"
                >
                  <Sparkles className="h-4 w-4" /> Create account
                </button>
                <button
                  onClick={() => navigate({ to: "/auth", search: { mode: "login", next: "/results" } })}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Already have an account? Log in
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}


function ScoreRing({ score }: { score: number }) {
  const max = 160;
  const pct = Math.min(1, Math.max(0, (score - 70) / (max - 70)));
  const radius = 90;
  const circ = 2 * Math.PI * radius;
  const dash = circ * pct;
  return (
    <div className="glass flex flex-col items-center justify-center rounded-3xl p-8 glow-purple">
      <div className="relative h-56 w-56">
        <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
          <circle cx="110" cy="110" r={radius} fill="none" stroke="var(--secondary)" strokeWidth="14" />
          <circle
            cx="110" cy="110" r={radius} fill="none"
            stroke="url(#g)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)" }}
          />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold">{score}</span>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">IQ Score</span>
        </div>
      </div>
    </div>
  );
}

function Bar({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 text-muted-foreground">{icon} {label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${value}%`, transition: "width 1s ease-out" }}
        />
      </div>
    </div>
  );
}
