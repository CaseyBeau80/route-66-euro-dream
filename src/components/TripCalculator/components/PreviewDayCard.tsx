
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { MapPin, Clock, Route } from 'lucide-react';
import { format, addDays } from 'date-fns';
import EnhancedWeatherWidget from './weather/EnhancedWeatherWidget';

interface PreviewDayCardProps {
  segment: DailySegment;
  dayIndex: number;
  tripStartDate?: Date;
  isLast: boolean;
}

const PreviewDayCard: React.FC<PreviewDayCardProps> = ({
  segment,
  dayIndex,
  tripStartDate,
  isLast
}) => {
  const segmentDate = tripStartDate ? 
    addDays(tripStartDate, dayIndex) : 
    undefined;

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className={`p-6 ${!isLast ? 'border-b border-gray-200' : ''}`}>
      {/* Day Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
            {segment.day}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Day {segment.day}</h3>
            <p className="text-sm text-gray-600">
              {segment.startCity} → {segment.endCity}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Route className="w-4 h-4" />
            {Math.round(segment.distance)} miles
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTime(segment.driveTimeHours || segment.distance / 55)}
          </div>
        </div>
      </div>

      {/* Weather Section - Matching Preview Style */}
      {tripStartDate && (
        <div className="mb-4">
          <EnhancedWeatherWidget
            segment={segment}
            tripStartDate={tripStartDate}
            isSharedView={false}
            isPDFExport={false}
          />
        </div>
      )}

      {/* Recommended Stops */}
      {segment.attractions && segment.attractions.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Recommended Stops:</h4>
          <div className="space-y-1">
            {segment.attractions.slice(0, 3).map((attraction, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span>{attraction.name}</span>
              </div>
            ))}
            {segment.attractions.length > 3 && (
              <p className="text-xs text-gray-500 ml-4">
                +{segment.attractions.length - 3} more stops
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewDayCard;
