import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { registerSchool, type SchoolDTO } from "@/lib/schools/schools.functions";
import { Copy, Check, GraduationCap, Loader2 } from "lucide-react";
import { track, AnalyticsEvent } from "@/lib/analytics";

export const Route = createFileRoute("/school/register")({
  head: () => ({
    meta: [
      { title: "Register your school — Abilitio" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: SchoolRegisterPage,
});

function SchoolRegisterPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const register = useServerFn(registerSchool);
  const [form, setForm] = useState({
    name: "",
    principalName: "",
    email: "",
    phone: "",
    students: "",
    city: "",
    country: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [school, setSchool] = useState<SchoolDTO | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user)
      navigate({ to: "/auth", search: { mode: "login", next: "/school/register" } });
  }, [user, loading, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const res = await register({
        data: {
          name: form.name,
          principalName: form.principalName,
          email: form.email,
          phone: form.phone,
          students: Number(form.students) || 0,
          city: form.city,
          country: form.country,
        },
      });
      setSchool(res.school);
      track(AnalyticsEvent.SchoolRegistered);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to register school.");
    } finally {
      setSubmitting(false);
    }
  }

  if (school) {
    return (
      <PageShell>
        <section className="px-6 pt-24 pb-24">
          <div className="mx-auto max-w-xl">
            <div className="glass rounded-3xl p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground glow-purple">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h1 className="mt-5 text-2xl font-bold gradient-text">School registered</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Share this code with your students so they can join.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary/50 px-5 py-4">
                <span className="font-mono text-xl tracking-widest">{school.code}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(school.code);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"
                  aria-label="Copy code"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Link
                to="/school/dashboard"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple"
              >
                Go to principal dashboard
              </Link>
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="px-6 pt-20 pb-24">
        <div className="mx-auto max-w-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold gradient-text">Register your school</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your school's principal account on Abilitio.
            </p>
          </div>
          <form onSubmit={submit} className="glass mt-8 space-y-3 rounded-3xl p-7">
            <Field
              label="School Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <Field
              label="Principal Name"
              value={form.principalName}
              onChange={(v) => setForm({ ...form, principalName: v })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="School Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="City"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
              />
              <Field
                label="Country"
                value={form.country}
                onChange={(v) => setForm({ ...form, country: v })}
              />
            </div>
            <Field
              label="Number of Students (estimate)"
              type="number"
              value={form.students}
              onChange={(v) => setForm({ ...form, students: v })}
            />
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
              Register school
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-2.5 text-sm outline-none transition-all focus:border-primary focus:bg-secondary focus:shadow-[0_0_0_4px_var(--glow)]"
      />
    </label>
  );
}
