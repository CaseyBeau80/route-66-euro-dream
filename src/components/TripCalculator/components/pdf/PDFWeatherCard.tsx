
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from '../SegmentWeatherWidget';

interface PDFWeatherCardProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  tripId?: string;
}

const PDFWeatherCard: React.FC<PDFWeatherCardProps> = ({
  segment,
  tripStartDate,
  cardIndex,
  tripId
}) => {
  const segmentDate = tripStartDate 
    ? new Date(tripStartDate.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000)
    : null;

  return (
    <div className="pdf-weather-card mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-blue-600">🌤️</span>
        <h6 className="text-sm font-semibold text-blue-800">Weather Forecast</h6>
        {segmentDate && (
          <span className="text-xs text-blue-600">
            {segmentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
      
      <div className="pdf-weather-content">
        <SegmentWeatherWidget
          segment={segment}
          tripStartDate={tripStartDate}
          cardIndex={cardIndex}
          tripId={tripId}
          sectionKey="pdf-weather"
          forceExpanded={true}
          isCollapsible={false}
        />
      </div>
    </div>
  );
};

export default PDFWeatherCard;
