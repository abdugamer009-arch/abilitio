import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { getMyCareerResult, type CareerResultDTO } from "@/lib/career.functions";
import { UNIVERSITIES } from "@/lib/abbi-extras";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { Brain, Target, Sparkles, Trophy, GraduationCap, Printer, Share2, RefreshCw, TrendingUp, Lightbulb, ImageIcon } from "lucide-react";

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth", search: { mode: "login", next: "/career-results" } }); return; }
    fetchResult()
      .then(setR)
      .catch((e) => setErr(String(e?.message ?? "")))
      .finally(() => setLoaded(true));
  }, [user, loading, navigate, fetchResult]);

  if (!user) return null;
  if (err) return <PageShell><div className="px-6 pt-32 text-center text-sm text-destructive">{err}</div></PageShell>;

  // Still fetching — show a skeleton instead of a misleading empty state
  if (!loaded) {
    return (
      <PageShell>
        <section className="px-6 pt-12 pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="skeleton h-10 w-72 rounded-2xl" />
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-44 rounded-3xl" />)}
            </div>
            <div className="mt-6 skeleton h-64 rounded-3xl" />
          </div>
        </section>
      </PageShell>
    );
  }

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

  async function shareCard() {
    if (!r) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0a0a0f";
    ctx.fillRect(0, 0, 1200, 630);

    // Top gradient stripe
    const stripe = ctx.createLinearGradient(0, 0, 1200, 0);
    stripe.addColorStop(0, "rgba(128, 82, 255, 1)");
    stripe.addColorStop(1, "rgba(168, 85, 247, 1)");
    ctx.fillStyle = stripe;
    ctx.fillRect(0, 0, 1200, 6);

    // "My Career Profile" label
    ctx.fillStyle = "rgba(160,160,180,1)";
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillText("MY CAREER PROFILE · ABILITIO", 80, 80);

    // MBTI type
    ctx.font = "bold 100px system-ui, sans-serif";
    ctx.fillStyle = "rgba(128, 82, 255, 1)";
    ctx.fillText(r.personality_type ?? "—", 80, 200);

    // Cognitive tier
    ctx.font = "28px system-ui, sans-serif";
    ctx.fillStyle = "rgba(200,200,220,1)";
    ctx.fillText(`${r.cognitive_tier} · ${r.cognitive_profile} Thinker · IQ Score ${r.cognitive_score}/10`, 80, 250);

    // Divider
    ctx.fillStyle = "rgba(80,60,140,0.6)";
    ctx.fillRect(80, 278, 1040, 1);

    // Top career matches
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.fillStyle = "rgba(160,160,180,1)";
    ctx.fillText("TOP CAREER MATCHES", 80, 320);

    r.career_matches.slice(0, 3).forEach((m, i) => {
      const y = 360 + i * 56;
      // score pill background
      ctx.fillStyle = "rgba(128,82,255,0.2)";
      roundRect(ctx, 80, y - 22, 900, 44, 22);
      ctx.fill();

      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`${i + 1}.  ${m.name}`, 110, y + 6);

      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.fillStyle = "rgba(128,82,255,1)";
      ctx.fillText(`${m.score}%`, 920, y + 6);
    });

    // Branding
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillStyle = "rgba(128,82,255,0.9)";
    ctx.fillText("abilitio.app", 80, 600);

    // Border
    ctx.strokeStyle = "rgba(128,82,255,0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 1198, 628);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "abilitio-career-profile.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ files: [file], title: "My Abilitio Career Profile" }); return; } catch { /* cancelled */ }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "abilitio-career-profile.png"; a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  return (
    <PageShell>
      {/* Enhanced print CSS */}
      <style>{`
        @media print {
          nav, footer { display: none !important; }
          body, html { background: #ffffff !important; color: #000000 !important; }
          .glass { background: #ffffff !important; border: 1px solid #e0e0e0 !important; box-shadow: none !important; backdrop-filter: none !important; }
          .gradient-text { background: none !important; -webkit-text-fill-color: #6d28d9 !important; color: #6d28d9 !important; }
          section { padding-top: 1rem !important; }
          h1, h2, h3 { color: #1a1a2e !important; }
          .bg-secondary\\/30 { background: #f8f7ff !important; }
          .text-primary { color: #6d28d9 !important; }
          .border-border { border-color: #d1d5db !important; }
          .bg-primary\\/10 { background: #ede9fe !important; }
          .text-muted-foreground { color: #6b7280 !important; }
          @page { margin: 1.5cm; }
          body::after { content: "Generated by Abilitio — abilitio.app"; position: fixed; bottom: 0.5cm; right: 1cm; font-size: 9pt; color: #9ca3af; }
        }
      `}</style>

      <section className="relative px-6 pt-12 pb-20 print:pt-4">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 print:hidden" />
        <div className="relative mx-auto max-w-5xl">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4 print:hidden">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Career Intelligence Result
              </div>
              <h1 className="mt-3 text-4xl font-bold gradient-text">Your Career Profile</h1>
              <p className="text-xs text-muted-foreground">Generated {new Date(r.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={share} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary/50 transition-colors"><Share2 className="h-4 w-4" />Share</button>
              <button onClick={shareCard} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary/50 transition-colors"><ImageIcon className="h-4 w-4" />Share Card</button>
              <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary/50 transition-colors"><Printer className="h-4 w-4" />Download PDF</button>
              <Link to="/career-assessment" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:glow-purple transition-all"><RefreshCw className="h-4 w-4" />Retake</Link>
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
              <div className="text-4xl font-bold gradient-text"><CountUp value={r.cognitive_score ?? 0} decimals={(r.cognitive_score ?? 0) % 1 === 0 ? 0 : 1} />/10</div>
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
          <Reveal className="glass mt-6 block rounded-3xl p-6">
            <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">Top 15 Career Matches</h3></div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {r.career_matches.map((m) => (
                <div key={m.key} className="rounded-2xl border border-border bg-secondary/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{m.name}</div>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"><CountUp value={m.score} suffix="%" /></span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.category}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${m.score}%` }} /></div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* University majors — with expandable university intelligence */}
          <Reveal className="glass mt-6 block rounded-3xl p-6">
            <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">Top 10 University Majors</h3></div>
            <div className="mt-4 grid gap-3">
              {r.university_matches.map((m) => {
                const matchingUnis = UNIVERSITIES.filter((u) =>
                  u.majors.some((maj) =>
                    maj.toLowerCase() === m.name.toLowerCase() ||
                    m.name.toLowerCase().includes(maj.toLowerCase().split(" ")[0])
                  )
                ).slice(0, 3);

                return (
                  <details key={m.key} className="rounded-2xl border border-border bg-secondary/30 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 hover:bg-secondary/40 rounded-2xl transition-colors">
                      <div>
                        <div className="text-sm font-semibold">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.category}</div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{m.score}%</span>
                        <span className="text-lg leading-none text-muted-foreground transition-transform [[open]_&]:rotate-45">+</span>
                      </div>
                    </summary>
                    {matchingUnis.length > 0 && (
                      <div className="space-y-2 px-4 pb-4">
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground pt-1">Universities offering this major</div>
                        {matchingUnis.map((u) => (
                          <div key={u.name} className="rounded-xl border border-border/60 bg-background/40 p-3 text-xs space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-foreground">{u.name}</span>
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                u.competitiveness === "Reach" ? "bg-red-500/10 text-red-400" :
                                u.competitiveness === "Match" ? "bg-yellow-500/10 text-yellow-400" :
                                "bg-green-500/10 text-green-400"
                              }`}>{u.competitiveness}</span>
                            </div>
                            <div className="text-muted-foreground">{u.city}, {u.country}</div>
                            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-muted-foreground">
                              <span>Acceptance: <span className="text-foreground font-medium">{u.acceptance}%</span></span>
                              <span>Min SAT: <span className="text-foreground font-medium">{u.minSat}</span></span>
                              <span>Min IELTS: <span className="text-foreground font-medium">{u.minIelts}</span></span>
                            </div>
                            <div className="text-muted-foreground">Scholarship: <span className="text-foreground">{u.scholarship}</span></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </details>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover-glow">
      <div className="flex items-center gap-2 text-primary">{icon}<h3 className="text-xs font-semibold uppercase tracking-wide">{title}</h3></div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
