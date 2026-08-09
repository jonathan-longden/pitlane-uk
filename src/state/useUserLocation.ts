import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import type { Coords } from '../lib/geo';

type Status = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

interface UserLocationState {
  coords: Coords | null;
  status: Status;
  /** Prompts for permission if it has not been asked for yet. */
  request: () => void;
}

/**
 * Location is entirely optional — the app is fully usable without it, and we
 * never ask on first launch. Distances simply do not appear until granted.
 */
export function useUserLocation(): UserLocationState {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const load = useCallback(async (ask: boolean) => {
    try {
      const existing = await Location.getForegroundPermissionsAsync();
      let granted = existing.granted;

      if (!granted) {
        if (!ask || !existing.canAskAgain) {
          setStatus(existing.canAskAgain ? 'idle' : 'denied');
          return;
        }
        setStatus('requesting');
        granted = (await Location.requestForegroundPermissionsAsync()).granted;
      }

      if (!granted) {
        setStatus('denied');
        return;
      }

      const position = await Location.getLastKnownPositionAsync();
      const fix = position ?? (await Location.getCurrentPositionAsync({}));
      setCoords({ latitude: fix.coords.latitude, longitude: fix.coords.longitude });
      setStatus('granted');
    } catch {
      setStatus('unavailable');
    }
  }, []);

  // Pick up an already-granted permission silently on mount.
  useEffect(() => {
    load(false);
  }, [load]);

  return { coords, status, request: () => void load(true) };
}
