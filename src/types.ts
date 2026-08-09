export type Region =
  | 'London'
  | 'South East'
  | 'South West'
  | 'East of England'
  | 'Midlands'
  | 'North West'
  | 'North East'
  | 'Yorkshire'
  | 'Wales'
  | 'Scotland'
  | 'Northern Ireland';

export const REGIONS: Region[] = [
  'London',
  'South East',
  'South West',
  'East of England',
  'Midlands',
  'North West',
  'North East',
  'Yorkshire',
  'Wales',
  'Scotland',
  'Northern Ireland',
];

export type EventCategory =
  | 'Cars & Coffee'
  | 'Evening Meet'
  | 'Show & Shine'
  | 'Track Day'
  | 'Classic'
  | 'JDM'
  | 'Euro'
  | 'American'
  | 'Modified'
  | 'Supercar'
  | 'Drift'
  | 'Auction';

export const CATEGORIES: EventCategory[] = [
  'Cars & Coffee',
  'Evening Meet',
  'Show & Shine',
  'Track Day',
  'Classic',
  'JDM',
  'Euro',
  'American',
  'Modified',
  'Supercar',
  'Drift',
  'Auction',
];

export interface CarEvent {
  id: string;
  title: string;
  /** One-paragraph description shown on the detail screen. */
  description: string;
  venue: string;
  addressLine: string;
  town: string;
  postcode: string;
  region: Region;
  latitude: number;
  longitude: number;
  /** ISO 8601 local start time, e.g. "2026-08-15T18:00". */
  startsAt: string;
  /** ISO 8601 local end time. */
  endsAt: string;
  categories: EventCategory[];
  /** Entry price in GBP pence. 0 means free entry. */
  pricePence: number;
  /** Organiser or club running the meet. */
  organiser: string;
  /** Public website or socials link, if the organiser has one. */
  website?: string;
  /** Indoor/outdoor, food, toilets etc. — shown as chips. */
  facilities: string[];
  /** Recurrence note shown under the date, e.g. "Every first Sunday". */
  recurrence?: string;
  /** Whether attendees must book ahead. */
  bookingRequired: boolean;
}

export interface Filters {
  query: string;
  regions: Region[];
  categories: EventCategory[];
  freeOnly: boolean;
  /** Only show events starting within this many days. null = no limit. */
  withinDays: number | null;
}

export const EMPTY_FILTERS: Filters = {
  query: '',
  regions: [],
  categories: [],
  freeOnly: false,
  withinDays: null,
};
