import type { CarEvent, Filters } from '../types';
import { daysUntil } from './format';

function matchesQuery(event: CarEvent, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    event.title,
    event.venue,
    event.town,
    event.postcode,
    event.region,
    event.organiser,
    ...event.categories,
  ]
    .join(' ')
    .toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

/** Applies every active filter. Past events are always excluded. */
export function applyFilters(events: CarEvent[], filters: Filters): CarEvent[] {
  return events.filter((event) => {
    const days = daysUntil(event.startsAt);
    if (days < 0) return false;
    if (filters.withinDays !== null && days > filters.withinDays) return false;
    if (filters.freeOnly && event.pricePence > 0) return false;
    if (filters.regions.length && !filters.regions.includes(event.region)) return false;
    if (
      filters.categories.length &&
      !event.categories.some((c) => filters.categories.includes(c))
    ) {
      return false;
    }
    return matchesQuery(event, filters.query);
  });
}

/** Number of filter facets in use — drives the badge on the Filters button. */
export function activeFilterCount(filters: Filters): number {
  return (
    filters.regions.length +
    filters.categories.length +
    (filters.freeOnly ? 1 : 0) +
    (filters.withinDays !== null ? 1 : 0)
  );
}

export interface EventSection {
  title: string;
  data: CarEvent[];
}

/** Groups an already-sorted list into This week / Next week / Later buckets. */
export function groupByWhen(events: CarEvent[]): EventSection[] {
  const buckets: Record<string, CarEvent[]> = {
    'Happening soon': [],
    'This week': [],
    'Next week': [],
    'Later this month': [],
    Upcoming: [],
  };

  for (const event of events) {
    const days = daysUntil(event.startsAt);
    if (days <= 1) buckets['Happening soon'].push(event);
    else if (days <= 7) buckets['This week'].push(event);
    else if (days <= 14) buckets['Next week'].push(event);
    else if (days <= 31) buckets['Later this month'].push(event);
    else buckets.Upcoming.push(event);
  }

  return Object.entries(buckets)
    .filter(([, data]) => data.length > 0)
    .map(([title, data]) => ({ title, data }));
}
