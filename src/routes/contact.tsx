import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Abilitio" },
      { name: "description", content: "Get in touch with the Abilitio team. We'd love to hear from you." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <PageShell>
      <section className="px-6 pt-20 pb-12 text-center">
        <div className="text-xs uppercase tracking-widest text-accent">Contact</div>
        <h1 className="mt-3 text-4xl font-bold md:text-6xl">Let's <span className="gradient-text">talk</span></h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Questions, partnerships, or feedback — we read every message.
        </p>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-1">
            {[
              { icon: Mail, label: "Email", value: "hello@abilitio.app" },
              { icon: MessageSquare, label: "Support", value: "Reply within 24 hours" },
              { icon: MapPin, label: "Based in", value: "Lisbon · Remote" },
            ].map((c) => (
              <div key={c.label} className="glass rounded-2xl p-5">
                <c.icon className="h-4 w-4 text-accent" />
                <div className="mt-3 text-xs text-muted-foreground">{c.label}</div>
                <div className="text-sm font-medium">{c.value}</div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="glass rounded-3xl p-8 md:col-span-2"
          >
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center animate-fade-up">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent glow-purple">
                  <Send className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">Message sent</h3>
                <p className="mt-2 text-sm text-muted-foreground">We'll get back to you shortly.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Name" id="name" placeholder="Jane Doe" />
                  <Field label="Email" id="email" type="email" placeholder="jane@email.com" />
                </div>
                <Field label="Subject" id="subject" placeholder="How can we help?" />
                <div>
                  <label htmlFor="msg" className="text-xs text-muted-foreground">Message</label>
                  <textarea
                    id="msg"
                    required
                    rows={5}
                    placeholder="Tell us more…"
                    className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:glow-purple"
                >
                  Send Message <Send className="h-4 w-4" />
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function Field({ label, id, type = "text", placeholder }: { label: string; id: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-muted-foreground">{label}</label>
      <input
        id={id}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
