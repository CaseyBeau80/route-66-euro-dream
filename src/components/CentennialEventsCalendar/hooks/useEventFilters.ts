import { useState, useMemo, useCallback } from 'react';
import { CentennialEvent, EventState, EventCategory } from '@/data/centennialEventsData';
import { safeParseDate } from '../utils/eventCalendarHelpers';
export type SortType = 'date' | 'state' | 'category';

/**
 * Helper for consistent date comparison using safeParseDate.
 * Avoids inconsistent browser parsing and timezone issues.
 * Invalid dates are pushed to the end of sorted lists.
 */
const compareDates = (aDate: string, bDate: string): number => {
  const dateA = safeParseDate(aDate);
  const dateB = safeParseDate(bDate);
  if (!dateA && !dateB) return 0;  // Both invalid: keep relative order
  if (!dateA) return 1;             // Push invalid A to end
  if (!dateB) return -1;            // Push invalid B to end
  return dateA.getTime() - dateB.getTime();
};

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

  // Filter out past events - only show upcoming/current events
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    return events.filter(e => {
      // Use dateEnd if available (for multi-day events), otherwise use dateStart
      const eventDate = safeParseDate(e.dateEnd || e.dateStart);
      if (!eventDate) return true; // Keep events with unparseable dates
      return eventDate >= today;
    });
  }, [events]);

  // Sort events - default is chronological (soonest first)
  const sortEvents = useCallback((eventsToSort: CentennialEvent[]): CentennialEvent[] => {
    return [...eventsToSort].sort((a, b) => {
      switch (sortType) {
        case 'state':
          return a.state.localeCompare(b.state);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          // Date sort is the default behavior
          return compareDates(a.dateStart, b.dateStart);
      }
    });
  }, [sortType]);

  // Filter events based on current filters - COMBINABLE state + month + category
  const filteredEvents = useMemo(() => {
    let filtered = [...upcomingEvents];

    // Apply state filter
    if (selectedState !== 'all') {
      filtered = filtered.filter(e => e.state === selectedState);
    }

    // Apply month filter (combinable with state)
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(e => {
        const parsedDate = safeParseDate(e.dateStart);
        const eventMonth = parsedDate ? parsedDate.getMonth() : -1;
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
  }, [upcomingEvents, selectedState, selectedMonth, selectedCategory, sortEvents]);

  // Get highlighted/featured events - chronological sort (soonest first)
  const highlightedEvents = useMemo(() => {
    return upcomingEvents
      .filter(e => e.isHighlight)
      .sort((a, b) => compareDates(a.dateStart, b.dateStart));
  }, [upcomingEvents]);

  // Get event count by state (only upcoming events)
  const getEventCountByState = useCallback((state: EventState): number => {
    return upcomingEvents.filter(e => e.state === state).length;
  }, [upcomingEvents]);

  // Get event count by month (only upcoming events)
  const getEventCountByMonth = useCallback((month: number): number => {
    return upcomingEvents.filter(e => {
      const parsedDate = safeParseDate(e.dateStart);
      const eventMonth = parsedDate ? parsedDate.getMonth() : -1;
      return eventMonth === month;
    }).length;
  }, [upcomingEvents]);

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
    totalEventCount: upcomingEvents.length,
  };
};
