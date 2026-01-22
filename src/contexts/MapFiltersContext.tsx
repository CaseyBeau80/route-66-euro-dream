import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type MapLayerCategory = 
  | 'cities'
  | 'attractions'
  | 'hiddenGems'
  | 'driveIns'
  | 'nativeAmerican';

export interface MapFiltersState {
  cities: boolean;
  attractions: boolean;
  hiddenGems: boolean;
  driveIns: boolean;
  nativeAmerican: boolean;
}

const DEFAULT_FILTERS: MapFiltersState = {
  cities: true,
  attractions: true,
  hiddenGems: true,
  driveIns: true,
  nativeAmerican: true,
};

const STORAGE_KEY = 'route66-map-filters';

interface MapFiltersContextType {
  filters: MapFiltersState;
  toggleFilter: (category: MapLayerCategory) => void;
  showAll: () => void;
  hideAll: () => void;
  resetToDefault: () => void;
  activeCount: number;
}

const MapFiltersContext = createContext<MapFiltersContextType | undefined>(undefined);

export const MapFiltersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<MapFiltersState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new categories
        return { ...DEFAULT_FILTERS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load map filters from localStorage:', e);
    }
    return DEFAULT_FILTERS;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch (e) {
      console.warn('Failed to save map filters to localStorage:', e);
    }
  }, [filters]);

  const toggleFilter = useCallback((category: MapLayerCategory) => {
    setFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  const showAll = useCallback(() => {
    setFilters({
      cities: true,
      attractions: true,
      hiddenGems: true,
      driveIns: true,
      nativeAmerican: true,
    });
  }, []);

  const hideAll = useCallback(() => {
    setFilters({
      cities: false,
      attractions: false,
      hiddenGems: false,
      driveIns: false,
      nativeAmerican: false,
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <MapFiltersContext.Provider value={{ filters, toggleFilter, showAll, hideAll, resetToDefault, activeCount }}>
      {children}
    </MapFiltersContext.Provider>
  );
};

export const useMapFilters = (): MapFiltersContextType => {
  const context = useContext(MapFiltersContext);
  if (!context) {
    throw new Error('useMapFilters must be used within a MapFiltersProvider');
  }
  return context;
};
