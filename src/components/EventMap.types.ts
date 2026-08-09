import type { CarEvent } from '../types';

export interface EventMapProps {
  events: CarEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Centres the map here on mount when the user has shared their location. */
  initialCentre?: { latitude: number; longitude: number } | null;
  showsUserLocation: boolean;
}
