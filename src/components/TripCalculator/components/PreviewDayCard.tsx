
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
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${!isLast ? 'mb-4' : ''}`}>
      {/* Blue Header - matching second screenshot */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Day {segment.day}</h3>
            <p className="text-blue-100 text-sm">
              {segmentDate ? format(segmentDate, 'EEEE, MMMM d, yyyy') : `Day ${segment.day}`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{segment.endCity}</div>
            <div className="text-blue-100 text-sm">Destination</div>
          </div>
        </div>
      </div>

      {/* Stats Section - matching the organized layout */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="font-bold text-lg">{Math.round(segment.distance)}</span>
            </div>
            <div className="text-xs text-gray-600">Miles</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-bold text-lg">
                {formatTime(segment.driveTimeHours || segment.distance / 55)}
              </span>
            </div>
            <div className="text-xs text-gray-600">Drive Time</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Route className="w-4 h-4" />
              <span className="font-bold text-lg">To</span>
            </div>
            <div className="text-xs text-gray-600">{segment.endCity}</div>
          </div>
        </div>

        {/* From/To information */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">📍 From</span>
              <span className="font-medium">{segment.startCity}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">🏁 To</span>
              <span className="font-medium">{segment.endCity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Section */}
      {tripStartDate && (
        <div className="p-4 border-b">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            🌤️ Weather Forecast for {segment.endCity}
          </h4>
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
        <div className="p-4">
          <h4 className="font-medium text-gray-700 mb-3">Recommended Stops:</h4>
          <div className="space-y-2">
            {segment.attractions.slice(0, 3).map((attraction, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
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
