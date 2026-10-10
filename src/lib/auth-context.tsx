import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/integrations/supabase/config";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let disposed = false;
    let unsubscribe = () => {};
    // Public rendering does not parse the account SDK before the first paint.
    import("@/integrations/supabase/client")
      .then(async ({ supabase }) => {
        if (disposed) return;
        const { data: sub } = supabase.auth.onAuthStateChange((_event, current) => {
          if (!disposed) {
            setSession(current);
            setLoading(false);
          }
        });
        unsubscribe = () => sub.subscription.unsubscribe();
        const { data } = await supabase.auth.getSession();
        if (!disposed) {
          setSession(data.session);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!disposed) setLoading(false);
      });
    return () => {
      disposed = true;
      unsubscribe();
    };
  }, []);

  return (
    <Ctx.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        signOut: async () => {
          if (!isSupabaseConfigured) return;
          const { supabase } = await import("@/integrations/supabase/client");
          await supabase.auth.signOut();
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
