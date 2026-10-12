/** Keep an open chat from carrying an earlier UTC day's messages into a new key. */
export function appendDailyMessage<T>(
  current: readonly T[],
  message: T,
  historyDay: string,
  now: Date,
  welcome: T,
): { day: string; messages: T[] } {
  const day = now.toISOString().slice(0, 10);
  return {
    day,
    messages: [...(historyDay === day ? current : [welcome]), message].slice(-50),
  };
}
