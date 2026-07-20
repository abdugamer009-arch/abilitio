import { Shield } from "lucide-react";
import { useT } from "@/lib/i18n";

export function AdminBadge({ className = "" }: { className?: string }) {
  const t = useT();
  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full border border-primary/40 bg-gradient-to-r from-primary/25 via-accent/20 to-primary/25 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-primary shadow-[0_0_10px_-3px_var(--glow)] " +
        className
      }
    >
      <Shield className="h-2.5 w-2.5" />
      {t.common.admin}
    </span>
  );
}
