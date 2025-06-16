
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
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${!isLast ? 'mb-4' : ''}`}>
      {/* Blue Header - matching reference image */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="font-bold text-sm">{segment.day}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold">Day {segment.day}</h3>
              <p className="text-blue-100 text-sm">
                {segment.startCity} → {segment.endCity}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <MapPin className="w-4 h-4" />
              <span>{Math.round(segment.distance)} miles</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-100 mt-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(segment.driveTimeHours || segment.distance / 55)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Section */}
      {tripStartDate && (
        <div className="bg-green-50 border-b border-green-200">
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
        <div className="p-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-700 mb-3">Recommended Stops:</h4>
          <div className="space-y-2">
            {segment.attractions.slice(0, 3).map((attraction, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span>{attraction.name}</span>
              </div>
            ))}
            {segment.attractions.length > 3 && (
              <p className="text-xs text-gray-500 ml-4 mt-2">
                +{segment.attractions.length - 3} more stops available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewDayCard;
