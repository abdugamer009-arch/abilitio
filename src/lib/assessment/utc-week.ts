export function isInCurrentUtcWeek(timestamp: string, now = new Date()): boolean {
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  const value = Date.parse(timestamp);
  return value >= start.getTime() && value <= now.getTime();
}
