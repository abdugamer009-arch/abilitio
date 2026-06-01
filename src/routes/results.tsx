import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Brain, Target, Activity, Trophy, Medal, Award, Heart, GraduationCap, MapPin } from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import { scoreAssessment, MBTI_DESCRIPTIONS, type ScoredResult } from "@/lib/assessment";
import { generateAISummary, getUniversitiesFor, buildRadarData } from "@/lib/insights";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Your Results — Abilitio" }] }),
  component: ResultsPage,
});

function ResultsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t, tCareer, tTrait, tIqLevel } = useI18n();
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
        iq_score: result.iq.score, iq_level: result.iq.level,
        logical_score: result.iq.logical, analytical_score: result.iq.analytical, pattern_score: result.iq.pattern,
        mbti_type: result.mbti.type, mbti_scores: result.mbti.scores,
        interest_scores: result.interests, top_strengths: result.strengths,
        weaknesses: result.weaknesses, careers: result.careers, answers, time_seconds: elapsed,
      });
      setSaved(true);
      sessionStorage.removeItem("assessment_answers");
      sessionStorage.removeItem("assessment_seconds");
    })();
  }, [user, result, saved, answers, elapsed]);

  useEffect(() => {
    if (!loading && !user && result) {
      navigate({ to: "/auth", search: { mode: "signup", next: "/results" } });
    }
  }, [loading, user, navigate, result]);

  if (!result) {
    return (
      <PageShell>
        <section className="px-6 pt-24 pb-24">
          <div className="mx-auto max-w-xl text-center glass rounded-3xl p-10">
            <h1 className="text-2xl font-semibold">{t.results.none}</h1>
            <p className="mt-3 text-muted-foreground">{t.results.noneBody}</p>
            <Link to="/assessment" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple">
              {t.results.startAssessment}
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  if (loading || !user) {
    return (
      <PageShell>
        <section className="px-6 pt-24 pb-24">
          <div className="mx-auto max-w-md text-center glass rounded-3xl p-10">
            <Sparkles className="mx-auto h-6 w-6 text-accent" />
            <h2 className="mt-4 text-xl font-semibold">{t.results.redirecting}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.results.redirectingBody}</p>
          </div>
        </section>
      </PageShell>
    );
  }

  const summary = generateAISummary(result);
  const universities = getUniversitiesFor(result.careers[0]?.name ?? "");
  const radarData = buildRadarData(result);

  return (
    <PageShell>
      <section className="relative px-6 pt-12 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center animate-fade-up">
            <span className="text-xs uppercase tracking-[0.2em] text-accent">{t.results.eyebrow}</span>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl gradient-text">{result.mbti.type} · {tIqLevel(result.iq.level)}</h1>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{MBTI_DESCRIPTIONS[result.mbti.type] ?? ""}</p>
          </div>


          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_1.2fr]">
            <ScoreRing score={result.iq.score} label={t.results.iqScore} />
            <div className="glass rounded-3xl p-8">
              <h2 className="text-lg font-semibold">{t.results.cognitiveBreakdown}</h2>
              <div className="mt-6 space-y-5">
                <Bar icon={<Brain className="h-4 w-4" />} label={t.results.logical} value={result.iq.logical} />
                <Bar icon={<Target className="h-4 w-4" />} label={t.results.analytical} value={result.iq.analytical} />
                <Bar icon={<Activity className="h-4 w-4" />} label={t.results.pattern} value={result.iq.pattern} />
              </div>
            </div>
          </div>

          {/* Radar chart — talent constellation */}
          <div className="mt-10 glass rounded-3xl p-8 md:p-10">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs uppercase tracking-[0.18em] text-accent">Talent Constellation</span>
                <h2 className="mt-1 text-2xl font-semibold">Your strengths, mapped</h2>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs">
                Eight ability dimensions scored from your responses. Larger area means broader profile.
              </p>
            </div>
            <div className="mt-6 h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="78%">
                  <defs>
                    <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.25} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    dataKey="value"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#radarFill)"
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-center">{t.results.topCareers}</h2>
            <p className="text-center text-sm text-muted-foreground mt-1">{t.results.topCareersSub}</p>

            <div className="mt-8 grid gap-6 md:grid-cols-3 md:items-end">
              <CareerCard rank={2} icon={<Medal className="h-6 w-6" />} career={result.careers[1]} size="md" tCareer={tCareer} matchLabel={t.results.match} />
              <CareerCard rank={1} icon={<Trophy className="h-7 w-7" />} career={result.careers[0]} size="lg" tCareer={tCareer} matchLabel={t.results.match} />
              <CareerCard rank={3} icon={<Award className="h-6 w-6" />} career={result.careers[2]} size="sm" tCareer={tCareer} matchLabel={t.results.match} />
            </div>
          </div>

          {/* University recommendations */}
          <div className="mt-12">
            <div className="text-center">
              <span className="text-xs uppercase tracking-[0.18em] text-accent">Recommended Universities</span>
              <h2 className="mt-2 text-2xl font-semibold">Places that match your trajectory</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
                Top global institutions aligned with your strongest career path — {tCareer(result.careers[0]?.name ?? "").name}.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {universities.map((u) => (
                <div key={u.name} className="glass rounded-2xl p-6 transition-all hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-accent">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-tight">{u.name}</h3>
                      <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {u.location}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">{u.focus}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="glass rounded-3xl p-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="h-5 w-5 text-accent" /> {t.results.strengths}
              </h3>
              <ul className="mt-5 space-y-2">
                {result.strengths.map((s) => (
                  <li key={s} className="flex items-center gap-3 rounded-2xl bg-secondary/40 px-4 py-3 text-sm">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" /> {tTrait(s)}
                  </li>
                ))}
              </ul>
              <h4 className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">{t.results.areasToGrow}</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.weaknesses.map((w) => (
                  <span key={w} className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">{tTrait(w)}</span>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-8">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Heart className="h-5 w-5 text-accent" /> {t.results.personality} · {result.mbti.type}
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
              {t.results.goDashboard}
            </Link>
            <Link to="/assessment" className="rounded-full border border-border px-6 py-3 text-sm hover:bg-secondary">
              {t.results.retake}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ScoreRing({ score, label }: { score: number; label: string }) {
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
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
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
  rank, icon, career, size, tCareer, matchLabel,
}: {
  rank: number; icon: React.ReactNode;
  career: { name: string; match: number; reason: string };
  size: "lg" | "md" | "sm";
  tCareer: (name: string) => { name: string; reason: string };
  matchLabel: string;
}) {
  const sz = size === "lg" ? "p-8 md:p-10" : size === "md" ? "p-7" : "p-6";
  const heading = size === "lg" ? "text-2xl" : "text-xl";
  const translated = tCareer(career.name);
  return (
    <div className={`glass rounded-3xl ${sz} ${size === "lg" ? "glow-purple md:-mb-4" : ""} transition-all hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">{icon}</div>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">#{rank} {matchLabel}</span>
      </div>
      <h3 className={`mt-5 font-bold ${heading}`}>{translated.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{translated.reason || career.reason}</p>
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{matchLabel}</span>
          <span className="text-2xl font-bold gradient-text">{career.match}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${career.match}%`, transition: "width 1.2s ease-out" }} />
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
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent" style={{ width: `${aPct}%`, transition: "width 1s ease-out" }} />
      </div>
    </div>
  );
}
