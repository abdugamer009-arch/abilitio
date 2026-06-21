import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createCheckoutSession } from "@/lib/stripe.functions";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Abilitio" },
      { name: "description", content: "Simple, transparent pricing for students, families, and schools." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Explorer",
    planId: null as null,
    price: "Free",
    desc: "Begin your discovery journey.",
    features: ["1 talent assessment", "Basic dashboard", "Top 3 career matches"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Student",
    planId: "student" as const,
    price: "$12",
    period: "/month",
    desc: "For ambitious students.",
    features: ["Unlimited assessments", "Full analytics suite", "All career paths", "Personal growth plan", "PDF reports"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Family",
    planId: "family" as const,
    price: "$24",
    period: "/month",
    desc: "Up to 4 family members.",
    features: ["Everything in Student", "Parent dashboard", "Comparative insights", "Priority support"],
    cta: "Choose Family",
    highlight: false,
  },
];

function PricingPage() {
  const checkoutFn = useServerFn(createCheckoutSession);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handlePlanClick(planId: "student" | "family") {
    setLoadingPlan(planId);
    setCheckoutError(null);
    try {
      const result = await checkoutFn({ data: { planId } });
      if (result.url) {
        window.location.href = result.url;
      } else {
        setCheckoutError("Payment is not configured yet — contact us to upgrade.");
      }
    } catch {
      setCheckoutError("Something went wrong. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <PageShell>
      <section className="relative px-6 pt-20 pb-12 text-center">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative animate-fade-up">
          <div className="text-xs uppercase tracking-widest text-accent">Pricing</div>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">Simple, <span className="gradient-text">honest pricing</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">No hidden fees. Cancel anytime. Schools get custom plans.</p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <Reveal className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                p.highlight ? "glass glow-purple border border-primary/40" : "glass hover-glow"
              }`}
            >
              {p.highlight && (
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
                  style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.6), transparent 70%)" }} />
              )}
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Most popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold gradient-text">{p.price}</span>
                {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_2px_8px_-2px_var(--glow)]">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {p.planId === null ? (
                <Link
                  to="/assessment"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all border border-border bg-secondary/40 hover:bg-secondary"
                >
                  {p.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handlePlanClick(p.planId!)}
                  disabled={loadingPlan !== null}
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all disabled:opacity-60 ${
                    p.highlight
                      ? "cta-sheen relative overflow-hidden bg-primary text-primary-foreground hover:glow-purple hover:-translate-y-0.5"
                      : "border border-border bg-secondary/40 hover:bg-secondary"
                  }`}
                >
                  {loadingPlan === p.planId ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {p.cta}
                </button>
              )}
            </div>
          ))}
        </Reveal>

        {checkoutError && (
          <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            {checkoutError}
          </div>
        )}

        <div className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          Looking for a school or district plan? <Link to="/contact" className="text-accent hover:underline">Get in touch</Link>.
        </div>
      </section>
    </PageShell>
  );
}
