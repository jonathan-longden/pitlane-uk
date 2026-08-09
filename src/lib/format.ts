const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Parses the local ISO strings used throughout the catalogue. */
export function parseLocal(iso: string): Date {
  return new Date(iso);
}

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Whole days from today to the given date. Negative for past dates. */
export function daysUntil(iso: string): number {
  const then = startOfDay(parseLocal(iso)).getTime();
  const now = startOfDay(new Date()).getTime();
  return Math.round((then - now) / 86_400_000);
}

/** "Tonight", "Tomorrow", "Sat 16 Aug" — whichever reads best for the distance out. */
export function formatDateLabel(iso: string): string {
  const d = parseLocal(iso);
  const diff = daysUntil(iso);
  if (diff === 0) return d.getHours() >= 16 ? 'Tonight' : 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff > 1 && diff < 7) return DAYS[d.getDay()];
  return `${DAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}

export function formatFullDate(iso: string): string {
  const d = parseLocal(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTime(iso: string): string {
  const d = parseLocal(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTime(startIso)} – ${formatTime(endIso)}`;
}

export function formatPrice(pence: number): string {
  if (pence === 0) return 'Free';
  if (pence % 100 === 0) return `£${pence / 100}`;
  return `£${(pence / 100).toFixed(2)}`;
}

export function formatDistance(km: number): string {
  const miles = km * 0.621371;
  if (miles < 0.6) return 'Under ½ mile';
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}
