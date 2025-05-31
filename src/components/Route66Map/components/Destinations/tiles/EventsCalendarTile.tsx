
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import type { Route66Waypoint } from '../../../types/supabaseTypes';

interface EventsCalendarTileProps {
  destination: Route66Waypoint;
}

const EventsCalendarTile: React.FC<EventsCalendarTileProps> = ({ destination }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cityName = destination.name.split(',')[0].split(' - ')[0].trim();

  const mockEvents = [
    {
      title: "Route 66 Car Show",
      date: "June 15-17",
      description: "Classic car enthusiasts gather for a weekend celebration"
    },
    {
      title: "Historic Downtown Festival",
      date: "July 4th",
      description: "Independence Day celebration with local vendors and music"
    },
    {
      title: "Mother Road Heritage Day",
      date: "August 12",
      description: "Celebrating the history and culture of Route 66"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 hover:shadow-lg transition-all duration-200">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm font-bold text-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Events
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {mockEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-lg p-2 border border-blue-200">
                <div className="flex items-start gap-2 mb-1">
                  <MapPin className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-blue-900">{event.title}</h4>
                    <p className="text-xs text-blue-600 font-medium">{event.date}</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed ml-5">{event.description}</p>
              </div>
            ))}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-600 italic">More events coming soon for {cityName}!</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default EventsCalendarTile;
