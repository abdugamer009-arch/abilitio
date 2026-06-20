import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { getMyCareerResult, type CareerResultDTO } from "@/lib/career.functions";
import { Brain, Target, Sparkles, Trophy, GraduationCap, Printer, Share2, RefreshCw, TrendingUp, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/career-results")({
  head: () => ({ meta: [{ title: "Your Career Profile — Abilitio" }] }),
  component: CareerResultsPage,
});

function CareerResultsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchResult = useServerFn(getMyCareerResult);
  const [r, setR] = useState<CareerResultDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth", search: { mode: "login", next: "/career-results" } }); return; }
    fetchResult().then(setR).catch((e) => setErr(String(e?.message ?? "")));
  }, [user, loading, navigate, fetchResult]);

  if (!user) return null;
  if (err) return <PageShell><div className="px-6 pt-32 text-center text-sm text-destructive">{err}</div></PageShell>;
  if (!r) {
    return (
      <PageShell>
        <div className="px-6 pt-32 text-center">
          <p className="text-sm text-muted-foreground">No career assessment yet.</p>
          <Link to="/career-assessment" className="mt-4 inline-flex rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground hover:glow-purple">Take the assessment</Link>
        </div>
      </PageShell>
    );
  }

  async function share() {
    const url = `${window.location.origin}/career-results`;
    if (navigator.share) { try { await navigator.share({ title: "My Abilitio Career Profile", url }); return; } catch { /* user cancelled share dialog */ } }
    await navigator.clipboard.writeText(url);
    alert("Link copied");
  }

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-20 print:pt-4">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4 print:hidden">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Career Intelligence Result
              </div>
              <h1 className="mt-3 text-4xl font-bold gradient-text">Your Career Profile</h1>
              <p className="text-xs text-muted-foreground">Generated {new Date(r.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={share} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary/50"><Share2 className="h-4 w-4" />Share</button>
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary/50"><Printer className="h-4 w-4" />Download PDF</button>
              <Link to="/career-assessment" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:glow-purple"><RefreshCw className="h-4 w-4" />Retake</Link>
            </div>
          </header>

          {/* Top: personality + cognitive + interests */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card icon={<Brain className="h-4 w-4" />} title="Personality Type">
              <div className="text-4xl font-bold gradient-text">{r.personality_type}</div>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li><span className="text-foreground/80">Work:</span> {r.work_style}</li>
                <li><span className="text-foreground/80">Leadership:</span> {r.leadership_style}</li>
                <li><span className="text-foreground/80">Learning:</span> {r.learning_style}</li>
                <li><span className="text-foreground/80">Team:</span> {r.team_style}</li>
              </ul>
            </Card>
            <Card icon={<Target className="h-4 w-4" />} title="Cognitive Profile">
              <div className="text-4xl font-bold gradient-text">{r.cognitive_score}/10</div>
              <div className="mt-2 text-sm font-medium">{r.cognitive_tier}</div>
              <div className="text-xs text-muted-foreground">{r.cognitive_profile} Thinker</div>
            </Card>
            <Card icon={<Sparkles className="h-4 w-4" />} title="Top Interests">
              <ul className="space-y-1.5 text-sm">
                {r.interests.slice(0, 6).map((i) => (
                  <li key={i.key} className="flex items-center justify-between">
                    <span className="capitalize">{i.key}</span>
                    <div className="h-1.5 w-24 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(i.weight * 100)}%` }} /></div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Strengths / improvements / skills */}
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card icon={<TrendingUp className="h-4 w-4" />} title="Top Strengths">
              <ul className="space-y-1.5 text-sm">{r.strengths.map((s) => <li key={s}>· {s}</li>)}</ul>
            </Card>
            <Card icon={<Lightbulb className="h-4 w-4" />} title="Areas to Improve">
              <ul className="space-y-1.5 text-sm">{r.improvements.map((s) => <li key={s}>· {s}</li>)}</ul>
            </Card>
            <Card icon={<Sparkles className="h-4 w-4" />} title="Skills to Develop">
              <ul className="space-y-1.5 text-sm">{r.recommended_skills.map((s) => <li key={s}>· {s}</li>)}</ul>
            </Card>
          </div>

          {/* Career matches */}
          <div className="glass mt-6 rounded-3xl p-6">
            <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">Top 15 Career Matches</h3></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {r.career_matches.map((m) => (
                <div key={m.key} className="rounded-2xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{m.name}</div>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{m.score}%</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.category}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${m.score}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* University majors */}
          <div className="glass mt-6 rounded-3xl p-6">
            <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">Top 10 University Majors</h3></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {r.university_matches.map((m) => (
                <div key={m.key} className="flex items-center justify-between rounded-2xl border border-border bg-secondary/30 p-4">
                  <div>
                    <div className="text-sm font-semibold">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.category}</div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{m.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 text-primary">{icon}<h3 className="text-xs font-semibold uppercase tracking-wide">{title}</h3></div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
