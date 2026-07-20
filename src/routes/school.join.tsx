import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { joinSchool } from "@/lib/schools/schools.functions";
import { Loader2, Users } from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/school/join")({
  head: () => ({
    meta: [
      { title: "Join your school — Abilitio" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: SchoolJoinPage,
});

function SchoolJoinPage() {
  const t = useT();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const join = useServerFn(joinSchool);
  const [code, setCode] = useState("");
  const [className, setClassName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user)
      navigate({ to: "/auth", search: { mode: "login", next: "/school/join" } });
  }, [user, loading, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      await join({ data: { code, className } });
      navigate({ to: "/dashboard" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      setErr(
        msg.includes("invalid_code")
          ? t.schoolJoin.codeNotFound
          : msg.includes("invalid_class")
            ? t.schoolJoin.classInvalid
            : msg || t.schoolJoin.failed,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell>
      <section className="px-6 pt-24 pb-24">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground glow-purple">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="mt-5 text-3xl font-bold gradient-text">{t.schoolJoin.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.schoolJoin.subtitle}</p>
          </div>
          <form onSubmit={submit} className="glass mt-8 space-y-3 rounded-3xl p-7">
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">
                {t.schoolJoin.codeLabel}
              </span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                placeholder="NVS-2026-A1B2"
                className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 font-mono text-sm uppercase tracking-widest outline-none focus:border-primary focus:bg-secondary"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">
                {t.schoolJoin.classLabel}
              </span>
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value.toUpperCase())}
                required
                maxLength={16}
                placeholder="9A"
                className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm uppercase outline-none focus:border-primary focus:bg-secondary"
              />
            </label>
            {err && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {err}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:glow-purple disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t.schoolJoin.joinBtn}
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
