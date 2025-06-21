
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, Route } from 'lucide-react';
import SegmentWeatherWidget from '../SegmentWeatherWidget';

interface SharedDailyItineraryProps {
  segments: DailySegment[];
  tripStartDate?: Date;
}

const SharedDailyItinerary: React.FC<SharedDailyItineraryProps> = ({
  segments,
  tripStartDate
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Daily Itinerary
      </h2>
      
      <div className="space-y-4">
        {segments.map((segment, index) => (
          <Card key={index} className="p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
                  {segment.day}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Day {segment.day}
                  </h3>
                  <p className="text-gray-600">
                    {segment.startCity} → {segment.endCity}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 md:mt-0">
                <div className="flex items-center gap-1">
                  <Route className="w-4 h-4" />
                  {Math.round(segment.distance || segment.approximateMiles || 0)} miles
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {segment.driveTimeHours ? 
                    `${Math.round(segment.driveTimeHours * 10) / 10}h` :
                    `${Math.round((segment.distance || segment.approximateMiles || 0) / 55 * 10) / 10}h`
                  }
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="mb-4">
              <SegmentWeatherWidget 
                segment={segment} 
                tripStartDate={tripStartDate}
                isSharedView={true}
              />
            </div>

            {/* Attractions */}
            {segment.attractions && segment.attractions.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  Recommended Stops:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {segment.attractions.map((attraction: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="font-medium">{attraction.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SharedDailyItinerary;
