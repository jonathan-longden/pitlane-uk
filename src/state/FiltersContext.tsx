import React, { createContext, useContext, useMemo, useState } from 'react';
import { EMPTY_FILTERS, type Filters } from '../types';

interface FiltersContextValue {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  patch: (changes: Partial<Filters>) => void;
  reset: () => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

/**
 * Filter state lives above the tab navigator so the map and the list always
 * show the same set of events.
 */
export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const value = useMemo<FiltersContextValue>(
    () => ({
      filters,
      setFilters,
      patch: (changes) => setFilters((f) => ({ ...f, ...changes })),
      reset: () => setFilters(EMPTY_FILTERS),
    }),
    [filters],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): FiltersContextValue {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used inside a FiltersProvider');
  return ctx;
}
