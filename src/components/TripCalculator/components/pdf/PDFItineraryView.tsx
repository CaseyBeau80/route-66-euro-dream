
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFRouteTabContent from './PDFRouteTabContent';
import PDFWeatherTabContent from './PDFWeatherTabContent';

interface PDFItineraryViewProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
  totalDays: number;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFItineraryView: React.FC<PDFItineraryViewProps> = ({
  segments,
  tripStartDate,
  tripId,
  totalDays,
  exportFormat
}) => {
  console.log('📄 PDFItineraryView render:', { segmentsCount: segments.length, exportFormat });

  if (!segments || segments.length === 0) {
    return (
      <div className="pdf-content text-center p-8">
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No Itinerary Available
        </h3>
        <p className="text-gray-500">
          There was an issue generating your trip itinerary.
        </p>
      </div>
    );
  }

  return (
    <div className="pdf-itinerary-container">
      {/* PDF Tab Headers - Visual Only */}
      <div className="pdf-tab-headers flex border-b border-gray-200 mb-6">
        <div className="pdf-tab-header active bg-blue-50 border-t-2 border-blue-500 px-4 py-2 font-medium text-blue-700">
          📍 Route & Stops
        </div>
        {exportFormat === 'full' && (
          <div className="pdf-tab-header bg-gray-50 px-4 py-2 font-medium text-gray-600">
            🌤️ Weather Forecast
          </div>
        )}
      </div>

      {/* Two-Column Layout */}
      <div className="pdf-two-column-layout">
        {/* Left Column - Route Content */}
        <div className="pdf-column-left">
          <PDFRouteTabContent
            segments={segments}
            tripStartDate={tripStartDate}
            tripId={tripId}
            exportFormat={exportFormat}
          />
        </div>

        {/* Right Column - Weather Content (Full Export Only) */}
        {exportFormat === 'full' && (
          <div className="pdf-column-right">
            <PDFWeatherTabContent
              segments={segments}
              tripStartDate={tripStartDate}
              tripId={tripId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFItineraryView;
