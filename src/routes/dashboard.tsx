import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { Brain, Calendar, LogOut, User as UserIcon, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Abilitio" }] }),
  component: DashboardPage,
});

type Result = {
  id: string;
  score: number;
  level: string;
  logical_score: number;
  analytical_score: number;
  pattern_score: number;
  created_at: string;
};

type Profile = { name: string; surname: string };

function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "login", next: "/dashboard" } });
      return;
    }
    (async () => {
      const [{ data: p }, { data: r }] = await Promise.all([
        supabase.from("profiles").select("name, surname").eq("id", user.id).maybeSingle(),
        supabase.from("iq_results").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setProfile(p ?? null);
      setResults((r as Result[]) ?? []);
      setBusy(false);
    })();
  }, [user, loading, navigate]);

  if (loading || busy) {
    return (
      <PageShell>
        <div className="px-6 pt-24 text-center text-sm text-muted-foreground">Loading your dashboard…</div>
      </PageShell>
    );
  }

  const latest = results[0];
  const best = results.reduce((m, r) => (r.score > m ? r.score : m), 0);
  const fullName = `${profile?.name ?? ""} ${profile?.surname ?? ""}`.trim() || user?.email;

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent glow-purple">
                <UserIcon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{fullName}</h1>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={async () => { await signOut(); navigate({ to: "/" }); }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Stat label="Latest IQ" value={latest ? String(latest.score) : "—"} hint={latest?.level ?? "Take the test"} />
            <Stat label="Best Score" value={best ? String(best) : "—"} hint="All-time high" />
            <Stat label="Tests Taken" value={String(results.length)} hint="Keep training" />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="glass rounded-3xl p-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Brain className="h-5 w-5 text-accent" /> Latest breakdown
              </h2>
              {latest ? (
                <div className="mt-6 space-y-4">
                  <Row label="Logical Reasoning" value={latest.logical_score} />
                  <Row label="Analytical Thinking" value={latest.analytical_score} />
                  <Row label="Pattern Recognition" value={latest.pattern_score} />
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">No results yet.</p>
              )}
              <Link
                to="/iq-test"
                className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:glow-purple"
              >
                {results.length ? "Retake test" : "Start your first test"}
              </Link>
            </div>

            <div className="glass rounded-3xl p-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="h-5 w-5 text-accent" /> Test history
              </h2>
              {results.length === 0 ? (
                <p className="mt-4 text-sm text-muted-foreground">No test history yet.</p>
              ) : (
                <ul className="mt-6 space-y-3">
                  {results.map((r) => (
                    <li key={r.id} className="flex items-center justify-between rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-medium">{r.score} · {r.level}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 text-4xl font-bold gradient-text">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
