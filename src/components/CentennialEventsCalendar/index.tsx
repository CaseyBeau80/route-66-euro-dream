import React, { useState } from 'react';
import { Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { CentennialEvent } from '@/data/centennialEventsData';
import { useCentennialEventsWithFallback } from '@/hooks/useCentennialEvents';
import { useEventFilters } from './hooks/useEventFilters';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import FilterBar from './components/FilterBar';
import FeaturedEvents from './components/FeaturedEvents';

const CentennialEventsCalendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CentennialEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch events from database with static fallback
  const { events, isLoading, isUsingFallback } = useCentennialEventsWithFallback();

  // Use filters with fetched events
  const {
    filteredEvents,
    selectedState,
    selectedMonth,
    setSelectedState,
    setSelectedMonth,
    resetFilters,
    highlightedEvents,
    totalEventCount,
  } = useEventFilters(events);

  const handleEventClick = (event: CentennialEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section 
      className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white"
      aria-labelledby="events-calendar-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-[#1B60A3] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            <span>2026 Centennial Events</span>
          </div>
          
          <h2 
            id="events-calendar-heading"
            className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3"
          >
            Route 66 Turns 100! 🎉
          </h2>
          
          <p className="text-slate-600 max-w-2xl mx-auto mb-4">
            Year-long celebrations across all 8 states! Plan ahead for parades, festivals, 
            car shows, and more along the Mother Road.
          </p>

          {/* Pro tip callout */}
          <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-sm text-blue-800">
            <strong>💡 Plan ahead!</strong> Book accommodations early for major events like the 
            April 30 National Kickoff and June Road Fest.
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading events...</span>
          </div>
        )}

        {/* Featured Events Carousel */}
        <div className="mb-8">
          <FeaturedEvents 
            events={highlightedEvents} 
            onEventClick={handleEventClick}
          />
        </div>

        {/* Filter Bar - Combined State + Month */}
        <div className="mb-6">
          <FilterBar
            selectedState={selectedState}
            selectedMonth={selectedMonth}
            onStateChange={setSelectedState}
            onMonthChange={setSelectedMonth}
            onReset={resetFilters}
            eventCount={filteredEvents.length}
            totalCount={totalEventCount}
          />
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onClick={handleEventClick}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredEvents.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No events match your current filters.</p>
            <button
              onClick={resetFilters}
              className="text-[#1B60A3] hover:text-[#155187] font-medium"
            >
              Reset filters to see all events
            </button>
          </div>
        )}

        {/* Data source footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Events powered by Lovable Cloud • Last seeded January 19, 2026 • 
            Sourced from{' '}
            <a 
              href="https://route66centennial.org/calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1B60A3] hover:text-[#155187]"
            >
              route66centennial.org/calendar
            </a>
            {' '}•{' '}
            <a 
              href="https://route66centennial.org/calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1B60A3] hover:text-[#155187] inline-flex items-center gap-1"
            >
              View Official Calendar
              <ExternalLink className="h-3 w-3" />
            </a>
            {isUsingFallback && (
              <span className="text-amber-500 ml-2">(using cached data)</span>
            )}
          </p>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal 
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default CentennialEventsCalendar;
