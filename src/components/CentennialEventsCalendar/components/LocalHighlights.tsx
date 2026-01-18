import React from 'react';
import { MapPin, Car, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CentennialEvent, centennialEvents } from '@/data/centennialEventsData';
import { getCountdownText, formatDateRange } from '../utils/eventCalendarHelpers';
import GuinnessBadge from './GuinnessBadge';

interface LocalHighlightsProps {
  onEventClick: (event: CentennialEvent) => void;
}

const LocalHighlights: React.FC<LocalHighlightsProps> = ({ onEventClick }) => {
  // Get Oklahoma events sorted by date
  const oklahomaEvents = React.useMemo(() => {
    return centennialEvents
      .filter(e => e.state === 'OK')
      .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime());
  }, []);

  // Highlight the top events
  const topEvents = oklahomaEvents.filter(e => 
    e.id === 'ok-road-fest' || 
    e.id === 'ok-capital-cruise' || 
    e.id === 'ok-tulsa-anniversary'
  );

  const otherEvents = oklahomaEvents.filter(e => 
    e.id !== 'ok-road-fest' && 
    e.id !== 'ok-capital-cruise' && 
    e.id !== 'ok-tulsa-anniversary'
  );

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border-2 border-orange-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800">Oklahoma Highlights</h3>
          <p className="text-sm text-slate-600">Perfect for Tulsa-area road trips!</p>
        </div>
        <Badge className="ml-auto bg-orange-500 text-white">
          {oklahomaEvents.length} events
        </Badge>
      </div>

      {/* Top Featured Events */}
      <div className="space-y-3 mb-4">
        {topEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => onEventClick(event)}
            className="w-full text-left bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] border border-orange-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {/* Guinness badge */}
                {event.guinnessAttempt && (
                  <div className="mb-1.5">
                    <GuinnessBadge size="sm" />
                  </div>
                )}
                
                {/* Title with star for highlights */}
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                  <h4 className="font-bold text-slate-800">{event.title}</h4>
                </div>
                
                {/* Location */}
                <p className="text-sm text-slate-600 flex items-center gap-1 mt-0.5">
                  <Car className="h-3 w-3" />
                  {event.location}
                  {event.venue && <span className="text-slate-400">• {event.venue}</span>}
                </p>
              </div>
              
              {/* Date & countdown */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-orange-600">
                  {formatDateRange(event.dateStart, event.dateEnd)}
                </p>
                <Badge variant="outline" className="text-xs mt-1">
                  {getCountdownText(event.dateStart)}
                </Badge>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Other Oklahoma Events */}
      {otherEvents.length > 0 && (
        <>
          <h4 className="text-sm font-semibold text-slate-600 mb-2">More Oklahoma Events</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {otherEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className="text-left bg-white/70 rounded-lg p-2.5 hover:bg-white transition-colors border border-orange-100/50"
              >
                <p className="font-medium text-sm text-slate-800 line-clamp-1">{event.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">{event.location}</span>
                  <span className="text-xs text-orange-600 font-medium">
                    {formatDateRange(event.dateStart, event.dateEnd)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Pro tip */}
      <div className="mt-4 p-3 bg-orange-100/50 rounded-lg border border-orange-200">
        <p className="text-xs text-orange-800">
          <strong>💡 Pro Tip:</strong> The AAA Route 66 Road Fest and Capital Cruise in Tulsa are 
          signature national events—book accommodations early! The Capital Cruise is an official 
          Guinness World Records™ attempt.
        </p>
      </div>
    </div>
  );
};

export default LocalHighlights;
