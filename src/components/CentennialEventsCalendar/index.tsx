import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Loader2, ChevronDown } from 'lucide-react';
import { CentennialEvent } from '@/data/centennialEventsData';
import { useCentennialEventsWithFallback } from '@/hooks/useCentennialEvents';
import { useEventFilters } from './hooks/useEventFilters';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import FilterBar from './components/FilterBar';
import FeaturedEvents from './components/FeaturedEvents';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 12;

const CentennialEventsCalendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CentennialEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch events from database with static fallback
  const {
    events,
    isLoading,
    isUsingFallback
  } = useCentennialEventsWithFallback();

  // Use filters with fetched events
  const {
    filteredEvents,
    selectedState,
    selectedMonth,
    selectedCategory,
    setSelectedState,
    setSelectedMonth,
    setSelectedCategory,
    resetFilters,
    highlightedEvents,
    totalEventCount
  } = useEventFilters(events);
  const handleEventClick = (event: CentennialEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Computed values for pagination
  const displayedEvents = filteredEvents.slice(0, visibleCount);
  const hasMoreEvents = visibleCount < filteredEvents.length;
  const remainingCount = filteredEvents.length - visibleCount;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedState, selectedMonth, selectedCategory]);

  // Smooth scroll to button after loading more
  useEffect(() => {
    if (visibleCount > ITEMS_PER_PAGE && loadMoreRef.current) {
      loadMoreRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [visibleCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  };

  return <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white" aria-labelledby="events-calendar-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-[#1B60A3] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            <span>2026 Centennial Events</span>
          </div>
          
          <h2 id="events-calendar-heading" className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            Route 66 Events Calendar
          </h2>
          
          <p className="text-slate-600 max-w-2xl mx-auto mb-4">
            Discover centennial celebrations, festivals, and car shows across all 8 states
          </p>

          {/* Pro tip callout */}
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-800">
            <strong>💡 Plan ahead!</strong> Book accommodations early for major events like the 
            April 30 National Kickoff and June Road Fest.
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && <div className="flex items-center justify-center gap-2 text-slate-500 mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading events...</span>
          </div>}

        {/* Featured Events Carousel */}
        <div className="mb-8">
          <FeaturedEvents events={highlightedEvents} onEventClick={handleEventClick} />
        </div>

        {/* Filter Bar - Combined State + Month */}
        <div className="mb-6">
          <FilterBar selectedState={selectedState} selectedMonth={selectedMonth} selectedCategory={selectedCategory} onStateChange={setSelectedState} onMonthChange={setSelectedMonth} onCategoryChange={setSelectedCategory} onReset={resetFilters} eventCount={filteredEvents.length} totalCount={totalEventCount} />
        </div>

        {/* Events Grid with aria-live for screen readers */}
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          aria-live="polite"
          aria-atomic="false"
        >
          {displayedEvents.map(event => <EventCard key={event.id} event={event} onClick={handleEventClick} />)}
        </div>

        {/* See More Button */}
        {hasMoreEvents && (
          <div ref={loadMoreRef} className="flex flex-col items-center mt-8 gap-2">
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              variant="outline"
              size="lg"
              className="bg-white hover:bg-blue-50 border-[#1B60A3] text-[#1B60A3] hover:text-[#155187] font-medium px-8 py-3 disabled:opacity-70"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  See More Events
                </>
              )}
            </Button>
            <p className="text-sm text-slate-500">
              {remainingCount} more event{remainingCount !== 1 ? 's' : ''} to explore
            </p>
          </div>
        )}

        {/* Empty state */}
        {filteredEvents.length === 0 && !isLoading && <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No events match your current filters.</p>
            <button onClick={resetFilters} className="text-[#1B60A3] hover:text-[#155187] font-medium">
              Reset filters to see all events
            </button>
          </div>}

        {/* Data source footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            
            {isUsingFallback && <span className="text-amber-500 ml-2">(using cached data)</span>}
          </p>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>;
};
export default CentennialEventsCalendar;