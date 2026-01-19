import { useState, useMemo, useCallback } from 'react';
import { CentennialEvent, EventState, EventCategory } from '@/data/centennialEventsData';

export type SortType = 'date' | 'state' | 'category';

interface UseEventFiltersReturn {
  filteredEvents: CentennialEvent[];
  selectedState: EventState | 'all';
  selectedMonth: number | 'all'; // 0-11 for months, 'all' for all
  selectedCategory: EventCategory | 'all';
  sortType: SortType;
  setSelectedState: (state: EventState | 'all') => void;
  setSelectedMonth: (month: number | 'all') => void;
  setSelectedCategory: (category: EventCategory | 'all') => void;
  setSortType: (type: SortType) => void;
  resetFilters: () => void;
  getEventCountByState: (state: EventState) => number;
  getEventCountByMonth: (month: number) => number;
  highlightedEvents: CentennialEvent[];
  totalEventCount: number;
}

export const useEventFilters = (events: CentennialEvent[]): UseEventFiltersReturn => {
  // Default to showing all events
  const [selectedState, setSelectedState] = useState<EventState | 'all'>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [sortType, setSortType] = useState<SortType>('date');

  // Sort events chronologically by default
  const sortEvents = useCallback((eventsToSort: CentennialEvent[]): CentennialEvent[] => {
    return [...eventsToSort].sort((a, b) => {
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

  // Filter events based on current filters - COMBINABLE state + month + category
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Apply state filter
    if (selectedState !== 'all') {
      filtered = filtered.filter(e => e.state === selectedState);
    }

    // Apply month filter (combinable with state)
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(e => {
        const eventMonth = new Date(e.dateStart).getMonth();
        return eventMonth === selectedMonth;
      });
    }

    // Apply category filter (combinable with state and month)
    // Case-insensitive comparison to handle DB categories like "Runs" vs "runs"
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => 
        e.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return sortEvents(filtered);
  }, [events, selectedState, selectedMonth, selectedCategory, sortEvents]);

  // Get highlighted/featured events - pure chronological sort
  const highlightedEvents = useMemo(() => {
    return events
      .filter(e => e.isHighlight)
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
  }, [events]);

  // Get event count by state
  const getEventCountByState = useCallback((state: EventState): number => {
    return events.filter(e => e.state === state).length;
  }, [events]);

  // Get event count by month
  const getEventCountByMonth = useCallback((month: number): number => {
    return events.filter(e => {
      const eventMonth = new Date(e.dateStart).getMonth();
      return eventMonth === month;
    }).length;
  }, [events]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSelectedState('all');
    setSelectedMonth('all');
    setSelectedCategory('all');
    setSortType('date');
  }, []);

  return {
    filteredEvents,
    selectedState,
    selectedMonth,
    selectedCategory,
    sortType,
    setSelectedState,
    setSelectedMonth,
    setSelectedCategory,
    setSortType,
    resetFilters,
    getEventCountByState,
    getEventCountByMonth,
    highlightedEvents,
    totalEventCount: events.length,
  };
};
