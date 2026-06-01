import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AuraCoin } from "./AuraCoin";
import { useAura } from "./AuraProvider";
import { useAuth } from "@/lib/auth-context";

/** Smooth count-up between balance values. */
function useAnimatedNumber(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(target);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    let raf = 0;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

export function AuraBalance({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const { wallet } = useAura();
  const animated = useAnimatedNumber(wallet?.balance ?? 0);

  if (!user) return null;

  return (
    <Link
      to="/aura"
      aria-label={`${animated} Aura Coins`}
      className="group relative inline-flex h-9 items-center gap-1.5 rounded-full border border-border/70 bg-gradient-to-br from-secondary/60 to-secondary/30 px-2.5 pr-3 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_24px_-12px_var(--glow)]"
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at 30% 50%, oklch(0.70 0.18 295 / 0.18), transparent 70%)" }}
      />
      <AuraCoin size={18} />
      <span className="relative font-semibold text-[13px] tabular-nums tracking-tight">
        {animated.toLocaleString()}
      </span>
      {!compact && (
        <span className="relative hidden text-[11px] font-medium text-muted-foreground sm:inline">
          Aura
        </span>
      )}
    </Link>
  );
}
