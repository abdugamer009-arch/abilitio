import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Check, Sparkles, ArrowRight, BarChart2 } from "lucide-react";

export const Route = createFileRoute("/stripe-success")({
  head: () => ({ meta: [{ title: "Welcome to Abilitio Premium!" }] }),
  component: StripeSuccessPage,
});

function StripeSuccessPage() {
  return (
    <PageShell>
      <section className="relative flex min-h-[80vh] items-center justify-center px-6 py-24">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[100px]" />
          <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-accent/6 blur-[80px]" />
        </div>

        <div className="glass relative w-full max-w-md rounded-[2rem] p-10 text-center animate-fade-up">
          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" style={{ animationDuration: "2s" }} />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_-8px_var(--glow)]">
              <Check className="h-9 w-9 text-primary-foreground" strokeWidth={3} />
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-bold gradient-text">You're in!</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Your subscription is active. Your full talent profile and unlimited assessments are ready.
          </p>

          <div className="mt-8 grid gap-3 text-left">
            {[
              "Unlimited career assessments",
              "Full analytics & growth plan",
              "PDF reports & shareable cards",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_2px_8px_-2px_var(--glow)]">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/dashboard"
              className="cta-sheen relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="h-4 w-4" /> Go to Dashboard
            </Link>
            <Link
              to="/career-assessment"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-medium text-primary transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/15"
            >
              <BarChart2 className="h-4 w-4" /> Start Assessment <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
