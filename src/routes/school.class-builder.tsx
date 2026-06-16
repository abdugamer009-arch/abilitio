import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { buildSpecializedClass } from "@/lib/career.functions";
import { Wand2, Loader2, Check } from "lucide-react";

export const Route = createFileRoute("/school/class-builder")({
  head: () => ({ meta: [{ title: "AI Class Builder — Abilitio" }] }),
  component: ClassBuilderPage,
});

const FOCUS_OPTIONS = [
  "Engineering","Healthcare","Business","Technology","Law","Media",
  "Architecture","Psychology","Design","Education","Science","Finance",
];

function ClassBuilderPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const build = useServerFn(buildSpecializedClass);
  const [focus, setFocus] = useState<string>("Engineering");
  const [size, setSize] = useState(20);
  const [running, setRunning] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [result, setResult] = useState<{ focus: string; students: { user_id: string; name: string; score: number }[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth", search: { mode: "login", next: "/school/class-builder" } });
  }, [user, loading, navigate]);

  async function run(save = false) {
    setRunning(true); setErr(null); setSavedId(null);
    try {
      const r = await build({ data: { focusCategory: focus, size, save } });
      setResult({ focus: r.focus, students: r.students });
      if (r.savedId) setSavedId(r.savedId);
    } catch (e: any) { setErr(String(e?.message ?? "")); }
    finally { setRunning(false); }
  }

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <Wand2 className="h-3.5 w-3.5" /> AI Class Builder
            </div>
            <h1 className="mt-3 text-3xl font-bold gradient-text">Create Specialized Class</h1>
            <p className="mt-1 text-sm text-muted-foreground">Select a focus area — Abilitio recommends the best-matched students from your school.</p>
          </header>

          <div className="glass rounded-3xl p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-xs text-muted-foreground">Focus area</label>
                <select value={focus} onChange={(e) => setFocus(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm">
                  {FOCUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Class size</label>
                <input type="number" min={1} max={60} value={size} onChange={(e) => setSize(Number(e.target.value) || 20)} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={() => run(false)} disabled={running} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:glow-purple disabled:opacity-50">
                  {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />} Build
                </button>
                <button onClick={() => run(true)} disabled={running || !result} className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary/50 disabled:opacity-50">
                  <Check className="h-4 w-4" /> Save
                </button>
              </div>
            </div>
            {err && <p className="mt-3 text-xs text-destructive">{err}</p>}
            {savedId && <p className="mt-3 text-xs text-primary">Class saved ✓</p>}
          </div>

          {result && (
            <div className="glass mt-6 rounded-3xl p-6">
              <h3 className="text-sm font-semibold">Recommended students — {result.focus} Class</h3>
              <p className="text-xs text-muted-foreground">Ranked by composite Personality + Cognitive + Interest fit.</p>
              <div className="mt-4 grid gap-2">
                {result.students.length ? result.students.map((s, i) => (
                  <div key={s.user_id} className="flex items-center justify-between rounded-2xl border border-border bg-secondary/30 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-6 text-right">{i + 1}.</span>
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{s.score}%</span>
                  </div>
                )) : <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">No students with matching profiles yet. Ask students to complete the Career Intelligence assessment.</div>}
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/school/analytics" className="text-xs text-muted-foreground underline">← Back to analytics</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
