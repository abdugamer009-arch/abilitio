import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { resolveAvatarUrl } from "@/components/ProfilePhotoCard";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function FloatingAuthButton() {
  const t = useT();
  const { user, loading } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAvatarUrl(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("user_stats")
        .select("avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      const resolved = await resolveAvatarUrl(data?.avatar_url ?? null);
      if (!cancelled) setAvatarUrl(resolved);
    })();

    const channel = supabase
      .channel(`user_stats_avatar_${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_stats", filter: `user_id=eq.${user.id}` },
        async (payload) => {
          const next = (payload.new as { avatar_url?: string | null } | null)?.avatar_url ?? null;
          const resolved = await resolveAvatarUrl(next);
          setAvatarUrl(resolved);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) return null;

  const initial =
    (user?.user_metadata?.name as string | undefined)?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  const baseClass = cn(
    "group fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full",
    "border border-white/15 bg-gradient-to-br from-primary/40 to-accent/30 backdrop-blur-xl",
    "shadow-[0_10px_40px_-12px_var(--glow)] transition-all duration-300 ease-out",
    "hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_16px_50px_-10px_var(--glow)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
  );

  const glow = (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/30 opacity-60 blur-xl animate-pulse"
    />
  );

  if (user) {
    return (
      <Link to="/dashboard" aria-label={t.common.openDashboard} className={baseClass}>
        {glow}
        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground ring-1 ring-white/20">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </span>
      </Link>
    );
  }

  return (
    <Link to="/auth" search={{ mode: "login" }} aria-label={t.common.signIn} className={baseClass}>
      {glow}
      <User className="h-5 w-5 text-foreground/90 transition-transform group-hover:scale-110" />
    </Link>
  );
}
