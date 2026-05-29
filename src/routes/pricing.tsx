import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Check } from "lucide-react";

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
    price: "Free",
    desc: "Begin your discovery journey.",
    features: ["1 talent assessment", "Basic dashboard", "Top 3 career matches"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Student",
    price: "$12",
    period: "/month",
    desc: "For ambitious students.",
    features: ["Unlimited assessments", "Full analytics suite", "All career paths", "Personal growth plan", "PDF reports"],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Family",
    price: "$24",
    period: "/month",
    desc: "Up to 4 family members.",
    features: ["Everything in Student", "Parent dashboard", "Comparative insights", "Priority support"],
    cta: "Choose Family",
    highlight: false,
  },
];

function PricingPage() {
  return (
    <PageShell>
      <section className="px-6 pt-20 pb-12 text-center">
        <div className="text-xs uppercase tracking-widest text-accent">Pricing</div>
        <h1 className="mt-3 text-4xl font-bold md:text-6xl">Simple, <span className="gradient-text">honest pricing</span></h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">No hidden fees. Cancel anytime. Schools get custom plans.</p>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-8 ${
                p.highlight ? "glass glow-purple border border-primary/40" : "glass"
              }`}
            >
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
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/20">
                      <Check className="h-2.5 w-2.5 text-accent" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/assessment"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:glow-purple"
                    : "border border-border bg-secondary/40 hover:bg-secondary"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
          Looking for a school or district plan? <Link to="/contact" className="text-accent hover:underline">Get in touch</Link>.
        </div>
      </section>
    </PageShell>
  );
}
