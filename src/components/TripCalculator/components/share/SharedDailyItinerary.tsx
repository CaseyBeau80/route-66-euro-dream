
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { Clock, MapPin } from 'lucide-react';
import { formatTime } from '../../utils/distanceCalculator';
import EnhancedWeatherWidget from '../weather/EnhancedWeatherWidget';

interface SharedDailyItineraryProps {
  segments: DailySegment[];
  tripStartDate?: Date;
}

const SharedDailyItinerary: React.FC<SharedDailyItineraryProps> = ({
  segments,
  tripStartDate
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Itinerary</h2>
      
      <div className="space-y-6">
        {segments.map((segment, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            {/* Day Header */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Day {segment.day}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{segment.startCity} → {segment.endCity}</span>
                </div>
              </div>
              
              <div className="text-right text-gray-600">
                <div className="flex items-center gap-2 justify-end">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(segment.driveTimeHours || 0)}</span>
                </div>
                <div className="text-sm">
                  {Math.round(segment.distance || 0)} miles
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            {tripStartDate && (
              <div className="mb-4">
                <EnhancedWeatherWidget
                  segment={segment}
                  tripStartDate={tripStartDate}
                  isSharedView={true}
                  isPDFExport={false}
                />
              </div>
            )}

            {/* Simple Route Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 text-center">
                Enjoy your drive from {segment.startCity} to {segment.endCity}! 
                <br />
                Stop along the way to explore local attractions and Route 66 landmarks.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedDailyItinerary;
