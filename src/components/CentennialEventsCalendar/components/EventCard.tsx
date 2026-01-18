import React from 'react';
import { Calendar, MapPin, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CentennialEvent, stateMetadata, categoryMetadata } from '@/data/centennialEventsData';
import { getCountdownText, isEventSoon, formatDateRange } from '../utils/eventCalendarHelpers';
import GuinnessBadge from './GuinnessBadge';

interface EventCardProps {
  event: CentennialEvent;
  onClick: (event: CentennialEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const countdown = getCountdownText(event.dateStart);
  const isSoon = isEventSoon(event.dateStart);
  const stateInfo = stateMetadata[event.state];
  const categoryInfo = categoryMetadata[event.category];
  
  // State color mapping for border
  const stateColorMap: Record<string, string> = {
    'IL': 'border-l-blue-500',
    'MO': 'border-l-red-500',
    'KS': 'border-l-yellow-500',
    'OK': 'border-l-orange-500',
    'TX': 'border-l-red-600',
    'NM': 'border-l-teal-500',
    'AZ': 'border-l-amber-600',
    'CA': 'border-l-yellow-400',
    'national': 'border-l-purple-600'
  };

  return (
    <Card 
      className={`group overflow-hidden bg-white/95 backdrop-blur-sm border-2 border-slate-200 hover:border-orange-400 cursor-pointer relative border-l-4 ${stateColorMap[event.state]} shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1`}
      onClick={() => onClick(event)}
      role="button"
      tabIndex={0}
      aria-label={`${event.title} on ${event.dateDisplay} in ${event.location}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(event);
        }
      }}
    >
      {/* Highlight glow for featured events */}
      {event.isHighlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-transparent pointer-events-none" />
      )}
      
      {/* Header with badges */}
      <div className="bg-gradient-to-r from-slate-50 to-orange-50/50 p-3 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* State badge */}
          <Badge 
            variant="secondary" 
            className={`${stateInfo.color} text-white text-xs font-bold`}
          >
            {event.state === 'national' ? '🌎 NATIONAL' : stateInfo.name}
          </Badge>
          
          {/* Countdown badge */}
          <Badge 
            variant={isSoon ? "default" : "outline"}
            className={isSoon ? "bg-green-500 text-white animate-pulse" : ""}
          >
            <Clock className="h-3 w-3 mr-1" />
            {countdown}
          </Badge>
        </div>
        
        {/* Category */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
          <span>{categoryInfo.emoji}</span>
          <span>{categoryInfo.label}</span>
        </div>
        
        {/* Title */}
        <h3 className="font-bold text-base text-slate-800 group-hover:text-orange-700 transition-colors duration-300 line-clamp-2">
          {event.title}
        </h3>
      </div>

      <CardContent className="p-3 space-y-2">
        {/* Guinness Badge */}
        {event.guinnessAttempt && (
          <GuinnessBadge size="sm" />
        )}
        
        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
          <span className="font-medium">{formatDateRange(event.dateStart, event.dateEnd)}</span>
        </div>
        
        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <span>{event.location}</span>
            {event.venue && (
              <span className="block text-xs text-slate-500">{event.venue}</span>
            )}
          </div>
        </div>
        
        {/* Description preview */}
        <p className="text-xs text-slate-500 line-clamp-2">
          {event.description}
        </p>
        
        {/* View details link */}
        <div className="flex items-center gap-1 text-xs text-orange-600 group-hover:text-orange-700 font-medium pt-1">
          <span>View details</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
