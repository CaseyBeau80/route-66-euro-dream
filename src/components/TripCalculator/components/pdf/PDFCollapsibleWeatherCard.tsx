
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

interface PDFCollapsibleWeatherCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
}

const PDFCollapsibleWeatherCard: React.FC<PDFCollapsibleWeatherCardProps> = ({
  segment,
  tripStartDate
}) => {
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className="pdf-weather-card bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 break-inside-avoid">
      {/* Weather Card Header */}
      <div className="pdf-weather-header flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            Day {segment.day}
          </span>
          <span className="text-blue-600">•</span>
          <h6 className="text-sm font-semibold text-blue-800">
            {segment.endCity}
          </h6>
        </div>
        
        {segmentDate && (
          <div className="text-xs text-blue-600">
            📅 {format(segmentDate, 'MMM d')}
          </div>
        )}
      </div>

      {/* Weather Content Placeholder */}
      <div className="pdf-weather-content bg-white rounded p-2 text-center">
        <div className="text-sm text-gray-600">
          🌤️ Weather information
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Detailed forecast available in live version
        </div>
      </div>

      {/* Seasonal Info */}
      {segmentDate && (
        <div className="pdf-seasonal-info mt-2 text-xs text-blue-700">
          <strong>Season:</strong> {
            segmentDate.getMonth() >= 2 && segmentDate.getMonth() <= 4 ? 'Spring' :
            segmentDate.getMonth() >= 5 && segmentDate.getMonth() <= 7 ? 'Summer' :
            segmentDate.getMonth() >= 8 && segmentDate.getMonth() <= 10 ? 'Fall' : 'Winter'
          } - Check live weather before departure
        </div>
      )}
    </div>
  );
};

export default PDFCollapsibleWeatherCard;
