import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageShell } from "@/components/PageShell";
import { AbbiChat } from "@/components/AbbiChat";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/abbi")({
  head: () => ({
    meta: [
      { title: "ABBI AI — Your Premium AI Career Mentor | Abilitio" },
      {
        name: "description",
        content:
          "ABBI AI is Abilitio's premium AI career mentor. Personalized advice on careers, universities, SAT/IELTS, and self-growth based on your assessment.",
      },
    ],
  }),
  component: AbbiPage,
});

function AbbiPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { mode: "login", next: "/abbi" } });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <PageShell>
        <div className="px-6 pt-32 text-center text-sm text-muted-foreground">Loading ABBI…</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[600px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-200px] h-[700px] w-[1100px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(ellipse, oklch(0.55 0.22 295 / 0.35), transparent 60%)" }}
        />
      </div>
      <section className="px-4 pt-10 pb-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <AbbiChat />
        </div>
      </section>
    </PageShell>
  );
}
