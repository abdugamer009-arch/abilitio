import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { X, ArrowLeft, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/stripe-cancel")({
  head: () => ({ meta: [{ title: "Checkout Cancelled — Abilitio" }] }),
  component: StripeCancelPage,
});

function StripeCancelPage() {
  return (
    <PageShell>
      <section className="relative flex min-h-[80vh] items-center justify-center px-6 py-24">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/5 blur-[80px]" />
        </div>
        <div className="glass relative w-full max-w-md rounded-[2rem] p-10 text-center animate-fade-up">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
            <X className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Checkout cancelled</h1>
          <p className="mt-3 text-muted-foreground">No charge was made. You can try again whenever you're ready.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/pricing"
              className="cta-sheen relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:glow-purple"
            >
              <RotateCcw className="h-4 w-4" /> Try again
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-all hover:bg-secondary/50"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
