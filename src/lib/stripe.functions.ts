import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const Stripe = (await import("stripe")).default;
  return new Stripe(key, { apiVersion: "2025-01-27.acacia" as const });
}

const PRICE_IDS = {
  student: process.env.STRIPE_PRICE_STUDENT ?? "price_student_placeholder",
  family:  process.env.STRIPE_PRICE_FAMILY  ?? "price_family_placeholder",
};

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ planId: z.enum(["student", "family"]) }).parse(d))
  .handler(async ({ data, context }) => {
    const stripe = await getStripe();
    if (!stripe) return { url: null as string | null, error: "not_configured" as const };

    const origin = process.env.SITE_URL ?? "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: PRICE_IDS[data.planId], quantity: 1 }],
      customer_email: context.claims?.email as string | undefined,
      success_url: `${origin}/stripe-success`,
      cancel_url:  `${origin}/pricing`,
      metadata: { userId: context.userId, plan: data.planId },
    });

    return { url: session.url, error: null };
  });
