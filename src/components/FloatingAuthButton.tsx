import { Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export function FloatingAuthButton() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const initial =
    (user?.user_metadata?.name as string | undefined)?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  const baseClass = cn(
    "group fixed bottom-6 right-6 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full",
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
      <Link to="/dashboard" aria-label="Open dashboard" className={baseClass}>
        {glow}
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
          {initial}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to="/auth"
      search={{ mode: "login" }}
      aria-label="Sign in"
      className={baseClass}
    >
      {glow}
      <User className="h-5 w-5 text-foreground/90 transition-transform group-hover:scale-110" />
    </Link>
  );
}
