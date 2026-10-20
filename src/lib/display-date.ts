// Construct during route-code preload, outside the transition's render work.
// Default locale, timezone and numeric fields match Date.toLocaleDateString().
const dateFormatter = new Intl.DateTimeFormat();
export function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? date.toLocaleDateString() : dateFormatter.format(date);
}
