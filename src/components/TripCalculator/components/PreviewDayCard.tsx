
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { MapPin, Clock } from 'lucide-react';
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
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${!isLast ? 'mb-6' : ''}`}>
      {/* Header Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {segment.day}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Day {segment.day}</h3>
              <p className="text-sm text-gray-600">{segment.startCity} → {segment.endCity}</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div className="flex items-center gap-1 mb-1">
              <MapPin className="w-4 h-4" />
              <span>{Math.round(segment.distance)} miles</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(segment.driveTimeHours || segment.distance / 55)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Section */}
      {tripStartDate && segmentDate && (
        <div className="bg-green-50 border-b border-green-100">
          <div className="p-4">
            <EnhancedWeatherWidget
              segment={segment}
              tripStartDate={tripStartDate}
              isSharedView={false}
              isPDFExport={false}
            />
          </div>
        </div>
      )}

      {/* Recommended Stops Section */}
      {segment.attractions && segment.attractions.length > 0 && (
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">Recommended Stops:</h4>
          <div className="space-y-2">
            {segment.attractions.slice(0, 3).map((attraction, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span>{attraction.name}</span>
              </div>
            ))}
            {segment.attractions.length > 3 && (
              <p className="text-xs text-gray-500 ml-4 italic">
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
