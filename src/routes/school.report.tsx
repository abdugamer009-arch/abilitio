import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { getPrincipalDashboard, type PrincipalDashboardDTO } from "@/lib/schools/schools.functions";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/school/report")({
  head: () => ({
    meta: [{ title: "School Report — Abilitio" }, { name: "robots", content: "noindex, follow" }],
  }),
  component: SchoolReportPage,
});

function SchoolReportPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchDashboard = useServerFn(getPrincipalDashboard);
  const [data, setData] = useState<PrincipalDashboardDTO | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "login", next: "/school/report" } });
      return;
    }
    fetchDashboard()
      .then(setData)
      .catch(() => navigate({ to: "/school/dashboard" }));
  }, [user, loading, navigate, fetchDashboard]);

  if (!data)
    return (
      <div
        className="mx-auto max-w-4xl px-10 py-12"
        aria-busy="true"
        aria-label="Loading school report"
      >
        <div className="skeleton h-8 w-64 rounded-xl" />
        <div className="skeleton mt-6 h-40 rounded-2xl" />
        <div className="skeleton mt-4 h-40 rounded-2xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-900 print:bg-white">
      <style>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
      <div className="mx-auto max-w-4xl px-10 py-12">
        <div className="no-print mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/school/dashboard" })}
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Back to dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </button>
        </div>

        <header className="border-b border-slate-200 pb-6">
          <div className="text-xs uppercase tracking-widest text-purple-600">
            Abilitio · School Report
          </div>
          <h1 className="mt-2 text-3xl font-bold">{data.school.name}</h1>
          <div className="mt-1 text-sm text-slate-500">
            {data.school.city}
            {data.school.city && data.school.country ? ", " : ""}
            {data.school.country} · Code <span className="font-mono">{data.school.code}</span>
          </div>
        </header>

        <section className="mt-8 grid grid-cols-4 gap-4">
          <Stat label="Students" value={data.totals.students} />
          <Stat label="Classes" value={data.totals.classes} />
          <Stat label="Completed" value={data.totals.completed} />
          <Stat label="Completion" value={`${data.totals.completionRate}%`} />
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Talent Distribution</h2>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                <th className="py-2">Orientation</th>
                <th>Students</th>
              </tr>
            </thead>
            <tbody>
              {data.bucketDistribution.map((b) => (
                <tr key={b.bucket} className="border-b border-slate-100">
                  <td className="py-2">{b.label}</td>
                  <td>{b.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Class Composition</h2>
          {data.classBreakdown.map((c) => (
            <div key={c.classId} className="mt-4 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Class {c.className}</div>
                <div className="text-xs text-slate-500">{c.total} students</div>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                {c.buckets
                  .filter((b) => b.count > 0)
                  .map((b) => (
                    <div key={b.bucket} className="rounded-md bg-slate-50 px-2 py-1.5">
                      <div className="text-slate-500">{b.label}</div>
                      <div className="font-semibold">{b.count}</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-semibold">Strategic AI Recommendations</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {data.insights.map((i, idx) => (
              <li key={idx} className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2">
                {i}
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
          Generated by Abilitio · {new Date().toLocaleDateString()}
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-purple-700">{value}</div>
    </div>
  );
}
