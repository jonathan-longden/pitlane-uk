import type { CarEvent } from '../types';
import { seedEvents } from './seed';

/**
 * Everything the UI needs from a data source. The screens only ever talk to
 * this interface, so swapping the bundled catalogue for a hosted API is a
 * matter of writing a second implementation and changing `eventRepository`
 * below — no screen changes required.
 */
export interface EventRepository {
  listEvents(): Promise<CarEvent[]>;
  getEvent(id: string): Promise<CarEvent | null>;
}

/** Reads from the catalogue bundled into the app binary. Always available offline. */
class LocalEventRepository implements EventRepository {
  async listEvents(): Promise<CarEvent[]> {
    return [...seedEvents].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }

  async getEvent(id: string): Promise<CarEvent | null> {
    return seedEvents.find((e) => e.id === id) ?? null;
  }
}

export const eventRepository: EventRepository = new LocalEventRepository();
