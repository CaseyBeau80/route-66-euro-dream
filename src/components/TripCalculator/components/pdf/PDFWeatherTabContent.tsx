
import React from 'react';
import { format } from 'date-fns';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFCollapsibleWeatherCard from './PDFCollapsibleWeatherCard';

interface PDFWeatherTabContentProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
}

const PDFWeatherTabContent: React.FC<PDFWeatherTabContentProps> = ({
  segments,
  tripStartDate,
  tripId
}) => {
  if (!tripStartDate) {
    return (
      <div className="pdf-weather-content">
        <div className="mb-4">
          <h4 className="pdf-section-header text-sm font-medium text-blue-800 uppercase tracking-wider">
            Weather Forecast
          </h4>
        </div>
        
        <div className="bg-gray-50 rounded p-4 text-center">
          <p className="text-gray-600 text-sm">
            Weather forecast requires a trip start date
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-weather-content space-y-3">
      <div className="mb-4">
        <h4 className="pdf-section-header text-sm font-medium text-blue-800 uppercase tracking-wider">
          Daily Weather Forecast
        </h4>
        <p className="text-xs text-gray-500 mt-1">
          Starting {format(tripStartDate, 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {segments.map((segment, index) => (
        <PDFCollapsibleWeatherCard
          key={`pdf-weather-segment-${segment.day}-${segment.endCity}-${index}`}
          segment={segment}
          tripStartDate={tripStartDate}
          cardIndex={index}
          tripId={tripId}
        />
      ))}
    </div>
  );
};

export default PDFWeatherTabContent;
