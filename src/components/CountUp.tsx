type CountUpProps = {
  /** Actual value, visible in the first DOM paint and assistive technology. */
  value: number;
  /** Retained for existing callers; numeric content itself does not animate. */
  duration?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
};

export function CountUp({ value, decimals = 0, suffix = "", className }: CountUpProps) {
  return (
    <span className={className}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
