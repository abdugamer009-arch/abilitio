import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/stripe-success")({
  head: () => ({ meta: [{ title: "Welcome to Abilitio Premium!" }] }),
  component: StripeSuccessPage,
});

function StripeSuccessPage() {
  return (
    <PageShell>
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-24">
        <div className="glass max-w-md w-full rounded-3xl p-10 text-center glow-purple">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
            <Check className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mt-6 text-3xl font-bold gradient-text">You're in!</h1>
          <p className="mt-3 text-muted-foreground">Your subscription is active. Time to unlock your full potential.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple transition-all">
              <Sparkles className="h-4 w-4" /> Go to Dashboard
            </Link>
            <Link to="/career-assessment" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm hover:bg-secondary/50 transition-colors">
              Start Assessment
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
