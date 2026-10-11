import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireData } from "../db-read";

/** All principal tools use the same latest-owned school; existing schools remain intact. */
export async function loadOwnedSchool(client: SupabaseClient<Database>, userId: string) {
  const school = requireData(
    await client
      .from("schools")
      .select("*")
      .eq("owner_user_id", userId)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle(),
  );
  if (!school) throw new Error("not_principal");
  return school;
}
