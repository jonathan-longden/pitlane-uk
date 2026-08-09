import { useCallback, useEffect, useState } from 'react';
import { eventRepository } from '../data/repository';
import type { CarEvent } from '../types';

interface EventsState {
  events: CarEvent[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Loads the catalogue through the repository. Written as if the source were
 * remote — loading and error states included — so nothing has to change here
 * when a real API is plugged in.
 */
export function useEvents(): EventsState {
  const [events, setEvents] = useState<CarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    eventRepository
      .listEvents()
      .then((result) => {
        if (!cancelled) setEvents(result);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load events. Pull down to try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { events, loading, error, reload };
}
