import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CentennialEvent, stateMetadata, categoryMetadata } from '@/data/centennialEventsData';
import { getCountdownText, formatDateRange } from '../utils/eventCalendarHelpers';
import GuinnessBadge from './GuinnessBadge';

interface FeaturedEventsProps {
  events: CentennialEvent[];
  onEventClick: (event: CentennialEvent) => void;
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ events, onEventClick }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  // Pure chronological sort - no state prioritization
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => 
      new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()
    );
  }, [events]);

  const visibleCount = 3; // Show 3 at a time on desktop
  const totalPages = Math.ceil(sortedEvents.length / visibleCount);
  const maxIndex = Math.max(0, (totalPages - 1) * visibleCount);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - visibleCount));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + visibleCount));
  };

  if (sortedEvents.length === 0) return null;

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-[#1B60A3] fill-[#1B60A3]" />
          <h3 className="text-lg font-bold text-slate-800">Featured Events</h3>
          <Badge variant="secondary" className="bg-blue-100 text-[#1B60A3]">
            {sortedEvents.length} highlights
          </Badge>
        </div>
        
        {/* Navigation arrows */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="h-8 w-8"
            aria-label="Previous featured events"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="h-8 w-8"
            aria-label="Next featured events"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Featured cards carousel */}
      <div className="overflow-hidden">
        <div 
          className="flex gap-4 transition-transform duration-300"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
        >
          {sortedEvents.map((event) => (
            <FeaturedEventCard 
              key={event.id} 
              event={event} 
              onClick={() => onEventClick(event)}
            />
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: Math.ceil(sortedEvents.length / visibleCount) }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i * visibleCount)}
            className={`h-2 rounded-full transition-all ${
              Math.floor(currentIndex / visibleCount) === i 
                ? 'w-6 bg-[#1B60A3]' 
                : 'w-2 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to featured events page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Individual featured event card
interface FeaturedEventCardProps {
  event: CentennialEvent;
  onClick: () => void;
}

const FeaturedEventCard: React.FC<FeaturedEventCardProps> = ({ event, onClick }) => {
  const stateInfo = stateMetadata[event.state] || { name: event.state, order: 99, color: 'bg-slate-500' };
  const categoryInfo = categoryMetadata[event.category] || { emoji: '📅', label: 'Event' };
  const countdown = getCountdownText(event.dateStart);
  
  // State gradient backgrounds (cool blue/gray palette - equal treatment for all states)
  const stateGradients: Record<string, string> = {
    'IL': 'from-blue-500 to-blue-600',
    'MO': 'from-slate-500 to-slate-600',
    'KS': 'from-sky-400 to-sky-500',
    'OK': 'from-[#1B60A3] to-[#155187]',
    'TX': 'from-slate-600 to-slate-700',
    'NM': 'from-cyan-500 to-cyan-600',
    'AZ': 'from-indigo-500 to-indigo-600',
    'CA': 'from-sky-300 to-sky-400',
    'national': 'from-indigo-600 to-indigo-700'
  };

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] group"
    >
      <div className={`
        relative overflow-hidden rounded-xl p-4 h-full min-h-[180px]
        bg-gradient-to-br ${stateGradients[event.state]}
        text-white shadow-lg hover:shadow-xl hover:shadow-[#1B60A3]/20
        transition-all duration-300 hover:scale-[1.02]
      `}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Top badge */}
          <div className="flex items-center mb-2">
            <Badge className="bg-white/20 text-white border-0 text-xs">
              {categoryInfo.emoji} {categoryInfo.label}
            </Badge>
          </div>

          {/* Guinness badge if applicable */}
          {event.guinnessAttempt && (
            <div className="mb-2">
              <GuinnessBadge size="sm" />
            </div>
          )}

          {/* Title */}
          <h4 className="font-bold text-base mb-1 line-clamp-2 group-hover:underline">
            {event.title}
          </h4>

          {/* Location with state */}
          <p className="text-sm text-white/80 mb-auto">
            {event.location}
            {event.state !== 'national' && (
              <span className="ml-1 text-white/60">({stateInfo.name})</span>
            )}
          </p>

          {/* Date at bottom */}
          <div className="mt-3 pt-2 border-t border-white/20">
            <p className="text-sm font-medium">
              {event.dateDisplay || formatDateRange(event.dateStart, event.dateEnd)}
            </p>
          </div>

          {/* State indicator */}
          <div className="absolute bottom-3 right-3 text-2xl opacity-30">
            {event.state === 'national' ? '🌎' : '🛣️'}
          </div>
        </div>
      </div>
    </button>
  );
};

export default FeaturedEvents;
