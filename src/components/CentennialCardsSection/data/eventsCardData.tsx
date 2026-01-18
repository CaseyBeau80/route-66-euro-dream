import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { CentennialCardData } from './types';
import { getUpcomingEvents, formatDateRange, getCountdownText } from '@/components/CentennialEventsCalendar/utils/eventCalendarHelpers';

// Dynamic content that shows next 2-3 upcoming events
const UpcomingEventsPreview: React.FC = () => {
  const upcomingEvents = getUpcomingEvents(3);
  
  return (
    <div className="text-center space-y-3 relative" aria-label="Upcoming Route 66 centennial events">
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-300 min-h-[140px] flex flex-col justify-center relative overflow-hidden">
        {/* Large background calendar emoji */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none" aria-hidden="true">
          <div className="text-8xl scale-[2.5] transform -rotate-12">
            📅
          </div>
        </div>
        
        {/* Content with enhanced visibility */}
        <div className="relative z-20">
          <div className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">
            Coming Up Next
          </div>
          
          {/* Show first 2 upcoming events */}
          <div className="space-y-1.5">
            {upcomingEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="text-xs text-orange-800">
                <div className="font-semibold truncate">{event.title}</div>
                <div className="flex items-center justify-center gap-2 text-orange-600">
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {getCountdownText(event.dateStart)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-2.5 w-2.5" />
                    {event.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Event count */}
          <div className="mt-2 text-xs text-orange-500">
            35+ events across 8 states
          </div>
        </div>
      </div>
    </div>
  );
};

export const eventsCardData: CentennialCardData = {
  id: 'events',
  title: '2026 Events Calendar',
  subtitle: (
    <span className="flex items-center gap-1">
      <span>🎉</span>
      <span>Celebrations Across the Route</span>
    </span>
  ),
  description: 'Browse parades, festivals, car shows, and centennial celebrations happening in all 8 Route 66 states throughout 2026.',
  icon: <Calendar className="h-6 w-6" />,
  route: '#events-calendar',
  accentColor: 'border-l-orange-500',
  buttonText: 'View Events Calendar',
  sparkleColor: 'text-orange-400',
  content: <UpcomingEventsPreview />
};
