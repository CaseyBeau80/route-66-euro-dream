import { useState, useMemo, useCallback } from 'react';
import { CentennialEvent, EventState, EventCategory, centennialEvents } from '@/data/centennialEventsData';

export type FilterType = 'all' | 'state' | 'month' | 'local';
export type SortType = 'date' | 'state' | 'category';

interface UseEventFiltersReturn {
  filteredEvents: CentennialEvent[];
  selectedState: EventState | 'all';
  selectedMonth: number | 'all'; // 0-11 for months, 'all' for all
  filterType: FilterType;
  sortType: SortType;
  setSelectedState: (state: EventState | 'all') => void;
  setSelectedMonth: (month: number | 'all') => void;
  setFilterType: (type: FilterType) => void;
  setSortType: (type: SortType) => void;
  resetFilters: () => void;
  getEventCountByState: (state: EventState) => number;
  getEventCountByMonth: (month: number) => number;
  highlightedEvents: CentennialEvent[];
  localEvents: CentennialEvent[]; // Oklahoma events
}

export const useEventFilters = (): UseEventFiltersReturn => {
  // Default to Oklahoma for local focus
  const [selectedState, setSelectedState] = useState<EventState | 'all'>('OK');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<FilterType>('local');
  const [sortType, setSortType] = useState<SortType>('date');

  // Sort events chronologically by default
  const sortEvents = useCallback((events: CentennialEvent[]): CentennialEvent[] => {
    return [...events].sort((a, b) => {
      switch (sortType) {
        case 'date':
          return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
        case 'state':
          return a.state.localeCompare(b.state);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime();
      }
    });
  }, [sortType]);

  // Filter events based on current filters
  const filteredEvents = useMemo(() => {
    let events = [...centennialEvents];

    // Apply state filter
    if (filterType === 'state' && selectedState !== 'all') {
      events = events.filter(e => e.state === selectedState);
    }

    // Apply month filter
    if (filterType === 'month' && selectedMonth !== 'all') {
      events = events.filter(e => {
        const eventMonth = new Date(e.dateStart).getMonth();
        return eventMonth === selectedMonth;
      });
    }

    // Apply local (Oklahoma) filter
    if (filterType === 'local') {
      events = events.filter(e => e.state === 'OK');
    }

    return sortEvents(events);
  }, [selectedState, selectedMonth, filterType, sortType, sortEvents]);

  // Get highlighted/featured events
  const highlightedEvents = useMemo(() => {
    return centennialEvents
      .filter(e => e.isHighlight)
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
  }, []);

  // Get Oklahoma events for local highlights
  const localEvents = useMemo(() => {
    return centennialEvents
      .filter(e => e.state === 'OK')
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
  }, []);

  // Get event count by state
  const getEventCountByState = useCallback((state: EventState): number => {
    return centennialEvents.filter(e => e.state === state).length;
  }, []);

  // Get event count by month
  const getEventCountByMonth = useCallback((month: number): number => {
    return centennialEvents.filter(e => {
      const eventMonth = new Date(e.dateStart).getMonth();
      return eventMonth === month;
    }).length;
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSelectedState('all');
    setSelectedMonth('all');
    setFilterType('all');
    setSortType('date');
  }, []);

  return {
    filteredEvents,
    selectedState,
    selectedMonth,
    filterType,
    sortType,
    setSelectedState,
    setSelectedMonth,
    setFilterType,
    setSortType,
    resetFilters,
    getEventCountByState,
    getEventCountByMonth,
    highlightedEvents,
    localEvents
  };
};
