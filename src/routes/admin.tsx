import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Shield, Users, Brain, Sparkles, TrendingUp, Crown, Ban, Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";
import {
  checkIsAdmin,
  getAdminAnalytics,
  getAdminUsers,
  adminSetBan,
  type AdminAnalytics,
  type AdminUserRow,
} from "@/lib/admin/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — Abilitio" }, { name: "robots", content: "noindex, follow" }],
  }),
  component: AdminDashboardPage,
});

const PURPLE = [
  "oklch(0.65 0.24 295)",
  "oklch(0.75 0.18 320)",
  "oklch(0.55 0.22 280)",
  "oklch(0.70 0.20 310)",
  "oklch(0.62 0.20 270)",
  "oklch(0.78 0.14 300)",
  "oklch(0.50 0.20 290)",
  "oklch(0.68 0.22 330)",
];

function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const checkFn = useServerFn(checkIsAdmin);
  const analyticsFn = useServerFn(getAdminAnalytics);
  const usersFn = useServerFn(getAdminUsers);
  const banFn = useServerFn(adminSetBan);

  const [ready, setReady] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "login", next: "/admin" } });
      return;
    }
    (async () => {
      try {
        const { isAdmin } = await checkFn();
        if (!isAdmin) {
          setForbidden(true);
          setReady(true);
          return;
        }
        const [a, u] = await Promise.all([analyticsFn(), usersFn()]);
        setAnalytics(a);
        setUsers(u);
        setReady(true);
      } catch {
        setForbidden(true);
        setReady(true);
      }
    })();
  }, [user, loading, navigate, checkFn, analyticsFn, usersFn]);

  async function refreshUsers() {
    const u = await usersFn();
    setUsers(u);
  }

  async function handleBan(target: string, banned: boolean) {
    setBusy(target);
    try {
      await banFn({ data: { target, banned } });
      await refreshUsers();
    } finally {
      setBusy(null);
    }
  }

  if (loading || !ready) {
    return (
      <PageShell>
        <div className="px-6 pt-32 text-center text-sm text-muted-foreground">
          Loading admin dashboard…
        </div>
      </PageShell>
    );
  }

  if (forbidden) {
    return (
      <PageShell>
        <section className="px-6 pt-24 pb-24">
          <div className="mx-auto max-w-md glass rounded-3xl p-10 text-center">
            <Shield className="mx-auto h-10 w-10 text-primary" />
            <h1 className="mt-4 text-2xl font-semibold">Admin only</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't have permission to view this page.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:glow-purple"
            >
              Go home
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  const filtered = users.filter((u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return u.email.toLowerCase().includes(q) || `${u.name} ${u.surname}`.toLowerCase().includes(q);
  });

  return (
    <PageShell>
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[600px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-200px] h-[700px] w-[1100px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background: "radial-gradient(ellipse, oklch(0.55 0.22 295 / 0.35), transparent 60%)",
          }}
        />
      </div>
      <section className="px-4 pt-10 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Founder-level analytics & user management
              </p>
            </div>
          </div>

          {analytics && (
            <>
              {/* Founder analytics */}
              <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Engagement
              </h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Users} label="Daily Active Users" value={analytics.dau} />
                <StatCard icon={Users} label="Weekly Active Users" value={analytics.wau} />
                <StatCard icon={Users} label="Monthly Active Users" value={analytics.mau} />
                <StatCard
                  icon={TrendingUp}
                  label="Most Popular Career"
                  valueText={analytics.popularCareers[0]?.name ?? "—"}
                />
              </div>

              <h2 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Platform
              </h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Users} label="Total Users" value={analytics.totalUsers} />
                <StatCard
                  icon={Brain}
                  label="Completed Assessments"
                  value={analytics.completedAssessments}
                />
                <StatCard
                  icon={TrendingUp}
                  label="New This Week"
                  value={analytics.newUsersThisWeek}
                />
                <StatCard
                  icon={TrendingUp}
                  label="New This Month"
                  value={analytics.newUsersThisMonth}
                />
                <StatCard
                  icon={Sparkles}
                  label="Most Active Community"
                  valueText={analytics.mostActiveCommunity?.name ?? "—"}
                  hint={
                    analytics.mostActiveCommunity
                      ? `${analytics.mostActiveCommunity.messageCount} msgs`
                      : undefined
                  }
                />
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <GlassChart title="Signups — last 7 days">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={analytics.weeklySignups}>
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="day"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                      />
                      <YAxis
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="oklch(0.65 0.24 295)"
                        strokeWidth={3}
                        dot={{ fill: "oklch(0.65 0.24 295)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </GlassChart>

                <GlassChart title="Most popular careers">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={analytics.popularCareers}
                      layout="vertical"
                      margin={{ left: 80 }}
                    >
                      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        type="number"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        allowDecimals={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                        }}
                      />
                      <Bar dataKey="count" fill="oklch(0.65 0.24 295)" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </GlassChart>

                <GlassChart title="Personality types distribution">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={analytics.popularMbti}
                        dataKey="count"
                        nameKey="type"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {analytics.popularMbti.map((_, i) => (
                          <Cell key={i} fill={PURPLE[i % PURPLE.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </GlassChart>
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">User management</h2>
                  <input
                    placeholder="Search by name or email"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="rounded-full border border-border/60 bg-secondary/30 px-4 py-2 text-sm outline-none focus:border-primary/40"
                  />
                </div>
                <div className="mt-4 overflow-x-auto rounded-3xl border border-border/60 bg-secondary/20 backdrop-blur-xl">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead className="border-b border-border/40 text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Joined</th>
                        <th className="px-4 py-3 text-left">Age</th>
                        <th className="px-4 py-3 text-left">Assessment</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u) => (
                        <tr
                          key={u.id}
                          className={`border-b border-border/30 ${u.is_banned ? "opacity-60" : ""}`}
                        >
                          <td className="px-4 py-3 font-medium">
                            {u.name || u.surname ? `${u.name} ${u.surname}`.trim() : "—"}
                            {u.is_banned && (
                              <span className="ml-2 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] text-destructive">
                                banned
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{u.age_group ?? "—"}</td>
                          <td className="px-4 py-3">
                            {u.has_assessment ? (
                              <span className="inline-flex items-center gap-1 text-accent">
                                <Check className="h-3 w-3" /> done
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1">
                              <IconBtn
                                title={u.is_banned ? "Unban" : "Ban"}
                                onClick={() => handleBan(u.id, !u.is_banned)}
                                disabled={busy === u.id}
                                danger={!u.is_banned}
                              >
                                <Ban className="h-3.5 w-3.5" />
                              </IconBtn>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  valueText,
  hint,
}: {
  icon: any;
  label: string;
  value?: number;
  valueText?: string;
  hint?: string;
}) {
  const display = valueText ?? (typeof value === "number" ? value.toLocaleString() : "—");
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/40 to-background/40 p-5 backdrop-blur-xl"
      style={{ boxShadow: "0 10px 30px -15px oklch(0.55 0.22 295 / 0.4)" }}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl"
        style={{
          background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.5), transparent 70%)",
        }}
      />
      <div className="relative">
        <Icon className="h-4 w-4 text-primary" />
        <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div
          className="mt-1 truncate text-2xl font-bold tabular-nums gradient-text"
          title={display}
        >
          {display}
        </div>
        {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
      </div>
    </div>
  );
}

function GlassChart({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-3xl border border-border/60 bg-secondary/20 p-6 backdrop-blur-xl"
      style={{ boxShadow: "0 10px 30px -15px oklch(0.55 0.22 295 / 0.3)" }}
    >
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:-translate-y-0.5 disabled:opacity-40 ${
        danger
          ? "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "border-border/60 bg-secondary/40 hover:bg-secondary"
      }`}
    >
      {children}
    </button>
  );
}
