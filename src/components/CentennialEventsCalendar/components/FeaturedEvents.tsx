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
  
  // Prioritize Oklahoma events (Road Fest, Capital Cruise) at front
  const sortedEvents = React.useMemo(() => {
    const okEvents = events.filter(e => e.state === 'OK');
    const otherEvents = events.filter(e => e.state !== 'OK');
    return [...okEvents, ...otherEvents];
  }, [events]);

  const visibleCount = 3; // Show 3 at a time on desktop
  const maxIndex = Math.max(0, sortedEvents.length - visibleCount);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  if (sortedEvents.length === 0) return null;

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          <h3 className="text-lg font-bold text-slate-800">Featured Events</h3>
          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
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
                ? 'w-6 bg-orange-500' 
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
  const stateInfo = stateMetadata[event.state];
  const categoryInfo = categoryMetadata[event.category];
  const countdown = getCountdownText(event.dateStart);
  
  // State gradient backgrounds
  const stateGradients: Record<string, string> = {
    'IL': 'from-blue-500 to-blue-600',
    'MO': 'from-red-500 to-red-600',
    'KS': 'from-yellow-500 to-yellow-600',
    'OK': 'from-orange-500 to-orange-600',
    'TX': 'from-red-600 to-red-700',
    'NM': 'from-teal-500 to-teal-600',
    'AZ': 'from-amber-500 to-amber-600',
    'CA': 'from-yellow-400 to-yellow-500',
    'national': 'from-purple-500 to-purple-600'
  };

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] group"
    >
      <div className={`
        relative overflow-hidden rounded-xl p-4 h-full min-h-[180px]
        bg-gradient-to-br ${stateGradients[event.state]}
        text-white shadow-lg hover:shadow-xl
        transition-all duration-300 hover:scale-[1.02]
      `}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
        
        <div className="relative z-10 h-full flex flex-col">
          {/* Top badges */}
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-white/20 text-white border-0 text-xs">
              {categoryInfo.emoji} {categoryInfo.label}
            </Badge>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              {countdown}
            </span>
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

          {/* Location */}
          <p className="text-sm text-white/80 mb-auto">
            {event.location}
          </p>

          {/* Date at bottom */}
          <div className="mt-3 pt-2 border-t border-white/20">
            <p className="text-sm font-medium">
              {formatDateRange(event.dateStart, event.dateEnd)}
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
