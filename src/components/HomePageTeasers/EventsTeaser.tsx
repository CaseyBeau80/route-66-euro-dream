import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useCentennialEventsWithFallback } from '@/hooks/useCentennialEvents';
import EventCard from '@/components/CentennialEventsCalendar/components/EventCard';
import EventModal from '@/components/CentennialEventsCalendar/components/EventModal';
import { CentennialEvent } from '@/data/centennialEventsData';

const EventsTeaser: React.FC = () => {
  const { events, isLoading } = useCentennialEventsWithFallback();
  const [selectedEvent, setSelectedEvent] = React.useState<CentennialEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Show up to 3 highlighted events, or first 3 if no highlights
  const featuredEvents = React.useMemo(() => {
    const highlighted = events.filter(e => e.isHighlight);
    return (highlighted.length >= 3 ? highlighted : events).slice(0, 3);
  }, [events]);

  const handleEventClick = (event: CentennialEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-[#1B60A3] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            <span>2026 Centennial Events</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            Route 66 Turns 100
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Festivals, car shows, parades, and caravans across all 8 states — don't miss the celebration of America's most famous highway.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={handleEventClick} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-[#1B60A3] hover:bg-[#155187] text-white font-special-elite px-6 py-3 rounded-sm border-2 border-[#1B60A3] shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] transition-all duration-200 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]"
          >
            See all events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedEvent(null); }} />
    </section>
  );
};

export default EventsTeaser;
