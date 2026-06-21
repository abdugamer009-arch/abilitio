import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { X } from "lucide-react";

export const Route = createFileRoute("/stripe-cancel")({
  head: () => ({ meta: [{ title: "Checkout Cancelled — Abilitio" }] }),
  component: StripeCancelPage,
});

function StripeCancelPage() {
  return (
    <PageShell>
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-24">
        <div className="glass max-w-md w-full rounded-3xl p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <X className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Checkout cancelled</h1>
          <p className="mt-3 text-muted-foreground">No charge was made. You can try again anytime.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/pricing" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple transition-all">
              Back to Pricing
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm hover:bg-secondary/50 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
