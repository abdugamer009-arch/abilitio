import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useMemo, useState } from "react";
import { Lock, Sparkles, Brain, Target, Activity, Trophy, Medal, Award, Heart } from "lucide-react";
import { scoreAssessment, MBTI_DESCRIPTIONS, type ScoredResult } from "@/lib/assessment";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Your Results — Abilitio" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const answers = useMemo<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = sessionStorage.getItem("assessment_answers");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, []);

  const elapsed = useMemo(() => {
    if (typeof window === "undefined") return 0;
    return Number(sessionStorage.getItem("assessment_seconds") || 0);
  }, []);

  const result: ScoredResult | null = useMemo(
    () => (Object.keys(answers).length ? scoreAssessment(answers) : null),
    [answers]
  );

  useEffect(() => {
    if (!user || !result || saved) return;
    (async () => {
      await supabase.from("assessment_results").insert({
        user_id: user.id,
        iq_score: result.iq.score,
        iq_level: result.iq.level,
        logical_score: result.iq.logical,
        analytical_score: result.iq.analytical,
        pattern_score: result.iq.pattern,
        mbti_type: result.mbti.type,
        mbti_scores: result.mbti.scores,
        interest_scores: result.interests,
        top_strengths: result.strengths,
        weaknesses: result.weaknesses,
        careers: result.careers,
        answers,
        time_seconds: elapsed,
      });
      setSaved(true);
      sessionStorage.removeItem("assessment_answers");
      sessionStorage.removeItem("assessment_seconds");
    })();
  }, [user, result, saved, answers, elapsed]);

  if (!result) {
    return (
      <PageShell>
        <section className="px-6 pt-24 pb-24">
          <div className="mx-auto max-w-xl text-center glass rounded-3xl p-10">
            <h1 className="text-2xl font-semibold">No results yet</h1>
            <p className="mt-3 text-muted-foreground">Take the full assessment to see your career matches.</p>
            <Link to="/assessment" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple">
              Start Assessment
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const showGate = !loading && !user;

  return (
    <PageShell>
      <section className="relative px-6 pt-12 pb-24">
        <div className={`mx-auto max-w-5xl transition-all duration-500 ${showGate ? "blur-lg pointer-events-none select-none" : ""}`}>
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-accent">Your Talent Profile</span>
            <h1 className="mt-2 text-4xl font-bold md:text-5xl gradient-text">{result.mbti.type} · {result.iq.level}</h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{MBTI_DESCRIPTIONS[result.mbti.type] ?? "A unique profile."}</p>
          </div>

          {/* Top row: IQ ring + Breakdown */}
          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.2fr]">
            <ScoreRing score={result.iq.score} />
            <div className="glass rounded-3xl p-8">
              <h2 className="text-lg font-semibold">Cognitive Breakdown</h2>
              <div className="mt-6 space-y-5">
                <Bar icon={<Brain className="h-4 w-4" />} label="Logical Reasoning" value={result.iq.logical} />
                <Bar icon={<Target className="h-4 w-4" />} label="Analytical Thinking" value={result.iq.analytical} />
                <Bar icon={<Activity className="h-4 w-4" />} label="Pattern Recognition" value={result.iq.pattern} />
              </div>
            </div>
          </div>

          {/* Top 3 Careers */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-center">Your Top 3 Career Matches</h2>
            <p className="text-center text-sm text-muted-foreground mt-1">Computed from your IQ, interests, and personality.</p>

            <div className="mt-8 grid gap-6 md:grid-cols-3 md:items-end">
              <CareerCard rank={2} icon={<Medal className="h-6 w-6" />} career={result.careers[1]} size="md" />
              <CareerCard rank={1} icon={<Trophy className="h-7 w-7" />} career={result.careers[0]} size="lg" />
              <CareerCard rank={3} icon={<Award className="h-6 w-6" />} career={result.careers[2]} size="sm" />
            </div>
          </div>

          {/* Strengths + MBTI */}
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="glass rounded-3xl p-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="h-5 w-5 text-accent" /> Top Strengths
              </h3>
              <ul className="mt-5 space-y-2">
                {result.strengths.map((s) => (
                  <li key={s} className="flex items-center gap-3 rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" /> {s}
                  </li>
                ))}
              </ul>
              <h4 className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">Areas to Grow</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.weaknesses.map((w) => (
                  <span key={w} className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">{w}</span>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Heart className="h-5 w-5 text-accent" /> Personality · {result.mbti.type}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{MBTI_DESCRIPTIONS[result.mbti.type] ?? ""}</p>
              <div className="mt-6 space-y-4">
                <MbtiAxis a="E" b="I" scores={result.mbti.scores} />
                <MbtiAxis a="S" b="N" scores={result.mbti.scores} />
                <MbtiAxis a="T" b="F" scores={result.mbti.scores} />
                <MbtiAxis a="J" b="P" scores={result.mbti.scores} />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple">
              Go to Dashboard
            </Link>
            <Link to="/assessment" className="rounded-full border border-border px-6 py-3 text-sm hover:bg-secondary">
              Retake Assessment
            </Link>
          </div>
        </div>

        {showGate && (
          <div className="absolute inset-0 flex items-start justify-center px-6 pt-32">
            <div className="glass animate-fade-up max-w-md rounded-3xl p-10 text-center glow-purple">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Lock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="mt-6 text-2xl font-bold">Unlock your personalized results</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Create a free account to view your full profile, top careers, and save your results.
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
          <circle cx="110" cy="110" r={radius} fill="none" stroke="url(#g)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
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
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${value}%`, transition: "width 1s ease-out" }} />
      </div>
    </div>
  );
}

function CareerCard({
  rank, icon, career, size,
}: {
  rank: number; icon: React.ReactNode;
  career: { name: string; match: number; reason: string };
  size: "lg" | "md" | "sm";
}) {
  const sz = size === "lg" ? "p-8 md:p-10" : size === "md" ? "p-7" : "p-6";
  const heading = size === "lg" ? "text-2xl" : "text-xl";
  return (
    <div className={`glass rounded-3xl ${sz} ${size === "lg" ? "glow-purple md:-mb-4" : ""} transition-all hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
          {icon}
        </div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">#{rank} Match</span>
      </div>
      <h3 className={`mt-5 font-bold ${heading}`}>{career.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{career.reason}</p>
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Match</span>
          <span className="text-2xl font-bold gradient-text">{career.match}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${career.match}%`, transition: "width 1.2s ease-out" }} />
        </div>
      </div>
    </div>
  );
}

function MbtiAxis({ a, b, scores }: { a: "E"|"S"|"T"|"J"; b: "I"|"N"|"F"|"P"; scores: Record<string, number> }) {
  const total = (scores[a] || 0) + (scores[b] || 0) || 1;
  const aPct = Math.round((scores[a] / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className={aPct >= 50 ? "font-semibold" : "text-muted-foreground"}>{a} · {aPct}%</span>
        <span className={aPct < 50 ? "font-semibold" : "text-muted-foreground"}>{b} · {100 - aPct}%</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent"
          style={{ width: `${aPct}%`, transition: "width 1s ease-out" }} />
      </div>
    </div>
  );
}
