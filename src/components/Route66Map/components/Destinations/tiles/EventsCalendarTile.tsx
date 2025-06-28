
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { getCityEventLinks } from '../../../data/cityEventLinks';
import { getEventSourceIcon, getEventSourceBadgeClass, openEventLink } from '../../../utils/eventSourceUtils';
import type { Route66Waypoint } from '../../../types/supabaseTypes';

interface EventsCalendarTileProps {
  destination: Route66Waypoint;
}

const EventsCalendarTile: React.FC<EventsCalendarTileProps> = ({ destination }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const cityName = destination.name.split(',')[0].split(' - ')[0].trim();
  const cityEventData = getCityEventLinks(cityName, destination.state);

  const handleEventSourceClick = (url: string, sourceName: string) => {
    openEventLink(url, sourceName);
  };

  return (
    <Card className="bg-amber-50 border-2 border-black hover:shadow-lg transition-all duration-200 hover:border-gray-800">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm font-bold text-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Events Calendar
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
            {cityEventData ? (
              <>
                {cityEventData.eventSources.map((source, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg p-3 border border-black hover:bg-amber-25 transition-colors cursor-pointer group"
                    onClick={() => handleEventSourceClick(source.url, source.name)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-lg flex-shrink-0 mt-0.5">
                        {getEventSourceIcon(source.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-black group-hover:text-gray-700 truncate">
                            {source.name}
                          </h4>
                          <ExternalLink className="w-3 h-3 text-black opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-full border border-black bg-amber-100 text-black`}>
                            {source.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-black leading-relaxed">
                          {source.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-amber-100 border border-black rounded-lg p-2 text-center">
                  <p className="text-xs text-black font-medium">
                    📅 Click any source above to view current events in {cityName}
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-amber-100 border border-black rounded-lg p-3 text-center">
                <Calendar className="w-8 h-8 text-black mx-auto mb-2" />
                <p className="text-xs text-black font-medium">
                  Event listings for {cityName} are being curated.
                </p>
                <p className="text-xs text-black mt-1">
                  Check back soon for local festivals, car shows, and Route 66 celebrations!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default EventsCalendarTile;
