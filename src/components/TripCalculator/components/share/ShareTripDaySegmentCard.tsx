
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from '../SegmentWeatherWidget';

interface ShareTripDaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
}

const ShareTripDaySegmentCard: React.FC<ShareTripDaySegmentCardProps> = ({
  segment,
  tripStartDate
}) => {
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
    : null;

  const formatTime = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  const distance = segment.distance || segment.approximateMiles || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 break-inside-avoid">
      {/* Day Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
          Day {segment.day}
        </span>
        <span className="text-red-600">•</span>
        <h4 className="text-lg font-semibold text-gray-800">
          {segment.endCity}
        </h4>
      </div>

      {/* Date */}
      {segmentDate && (
        <p className="text-sm text-gray-600 mb-3">
          📅 {format(segmentDate, 'EEEE, MMMM d')}
        </p>
      )}
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">🗺️</span>
          <span>{Math.round(distance)} mi</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-600">⏱️</span>
          <span>{formatTime(segment.driveTimeHours || 0)}</span>
        </div>
      </div>
      
      {/* Route */}
      <div className="text-sm text-gray-600 mb-3">
        <strong>Route:</strong> {segment.startCity} → {segment.endCity}
      </div>

      {/* Weather Widget */}
      <div className="mb-3">
        <SegmentWeatherWidget
          segment={segment}
          tripStartDate={tripStartDate}
          forceExpanded={false}
          isCollapsible={false}
        />
      </div>

      {/* Recommended Stops */}
      {segment.recommendedStops && segment.recommendedStops.length > 0 && (
        <div className="mb-3">
          <h6 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            🏛️ Recommended Stops ({segment.recommendedStops.length} total)
          </h6>
          <ul className="space-y-1">
            {segment.recommendedStops.slice(0, 3).map((stop, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>{stop.name}</strong></span>
              </li>
            ))}
            {segment.recommendedStops.length > 3 && (
              <li className="text-sm text-gray-500 italic">
                ... and {segment.recommendedStops.length - 3} more stops
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Drive Time Category */}
      {segment.driveTimeCategory && segment.driveTimeHours > 6 && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Driving intensity:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              segment.driveTimeCategory.category === 'short' ? 'bg-green-100 text-green-700' :
              segment.driveTimeCategory.category === 'optimal' ? 'bg-blue-100 text-blue-700' :
              segment.driveTimeCategory.category === 'long' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {segment.driveTimeCategory.message}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareTripDaySegmentCard;
