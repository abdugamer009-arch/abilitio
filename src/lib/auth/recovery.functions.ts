import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SITE_URL } from "../constants";
let requester: ((email: string) => Promise<{ readonly accepted: true }>) | undefined;
export const requestPasswordRecovery = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ email: z.string().trim().email().max(255) }).parse(d))
  .handler(async ({ data }) => {
    if (
      process.env.PASSWORD_RECOVERY_ENABLED !== "true" ||
      !process.env.SUPABASE_URL ||
      !process.env.SUPABASE_PUBLISHABLE_KEY
    )
      throw new Error("Recovery service is not configured");
    if (!requester) {
      const { createRecoveryRequester } = await import("./recovery");
      const { createHash } = await import("node:crypto");
      const { createClient } = await import("@supabase/supabase-js");
      const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      requester = createRecoveryRequester(
        (email) =>
          client.auth.resetPasswordForEmail(email, {
            redirectTo: `${SITE_URL}/auth?mode=recovery`,
          }),
        (email) => createHash("sha256").update(email).digest("hex"),
      );
    }
    return requester(data.email);
  });
