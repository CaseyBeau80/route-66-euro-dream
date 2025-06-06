
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFWeatherCard from './PDFWeatherCard';

interface PDFDaySegmentCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCard: React.FC<PDFDaySegmentCardProps> = ({
  segment,
  tripStartDate,
  cardIndex,
  tripId,
  exportFormat
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

  return (
    <div className="pdf-day-segment no-page-break bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      {/* Card Header */}
      <div className="pdf-card-header border-b border-gray-100 pb-3 mb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="pdf-day-badge bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                Day {segment.day}
              </span>
              <span className="text-blue-600">•</span>
              <h5 className="font-semibold text-blue-800">
                📍 {segment.endCity}
              </h5>
            </div>
            {segmentDate && (
              <p className="text-xs text-gray-600">
                📅 {format(segmentDate, 'EEEE, MMMM d')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Stats */}
      <div className="pdf-card-stats grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-600">🛣️</span>
          <span className="font-medium">{Math.round(segment.distance || segment.approximateMiles || 0)} mi</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-blue-600">⏱️</span>
          <span className="font-medium">{formatTime(segment.driveTimeHours)}</span>
        </div>
      </div>

      {/* Route Description */}
      {segment.startCity && (
        <div className="pdf-route-description text-sm text-gray-600 mb-3">
          <strong>Route:</strong> {segment.startCity} → {segment.endCity}
        </div>
      )}

      {/* Recommended Stops (Summary and Full only) */}
      {exportFormat !== 'route-only' && segment.recommendedStops && segment.recommendedStops.length > 0 && (
        <div className="pdf-recommended-stops mb-4">
          <h6 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            🏛️ Recommended Stops
          </h6>
          <ul className="space-y-1">
            {segment.recommendedStops.slice(0, exportFormat === 'summary' ? 3 : 6).map((stop, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>
                  <strong>{stop.name}</strong>
                  {stop.description && exportFormat === 'full' && (
                    <span className="text-gray-500"> - {stop.description}</span>
                  )}
                </span>
              </li>
            ))}
            {segment.recommendedStops.length > (exportFormat === 'summary' ? 3 : 6) && (
              <li className="text-xs text-gray-500 italic">
                +{segment.recommendedStops.length - (exportFormat === 'summary' ? 3 : 6)} more stops available
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Weather Section (Full and Summary formats) */}
      {exportFormat !== 'route-only' && (
        <PDFWeatherCard
          segment={segment}
          tripStartDate={tripStartDate}
          cardIndex={cardIndex}
          tripId={tripId}
        />
      )}

      {/* Drive Time Category */}
      {segment.driveTimeCategory && (
        <div className="pdf-drive-time-category mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-xs">
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

export default PDFDaySegmentCard;
