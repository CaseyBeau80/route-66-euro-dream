
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFRouteTabContent from './PDFRouteTabContent';

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
    <div className="pdf-itinerary-container bg-gray-50 min-h-screen p-6">
      {/* Main Container - Match In-App Styling */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        
        {/* Trip Overview Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Route 66 Itinerary</h2>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>📅 {totalDays} days</span>
            <span>📍 {segments.length} destinations</span>
            <span>🛣️ {Math.round(segments.reduce((total, seg) => total + (seg.distance || seg.approximateMiles || 0), 0))} miles</span>
          </div>
        </div>

        {/* PDF Tab Headers - Visual Only (Match In-App Style) */}
        <div className="pdf-tab-headers border-b border-gray-200 mb-6">
          <div className="flex space-x-0">
            <div className="pdf-tab-header active bg-blue-50 border-t-2 border-blue-500 px-6 py-3 font-medium text-blue-700 rounded-t-lg">
              📍 Route & Stops
              {exportFormat !== 'route-only' && ' + Weather'}
            </div>
          </div>
        </div>

        {/* Daily Segments Content */}
        <div className="pdf-content">
          <PDFRouteTabContent
            segments={segments}
            tripStartDate={tripStartDate}
            tripId={tripId}
            exportFormat={exportFormat}
          />
        </div>

        {/* PDF Legend */}
        <div className="pdf-legend mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg no-page-break">
          <h5 className="text-sm font-semibold text-gray-700 mb-3">Legend & Icons:</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>Destination City</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛣️</span>
              <span>Route Distance</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>Drive Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏛️</span>
              <span>Historic Sites</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🌤️</span>
              <span>Weather Info</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>Date</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFItineraryView;
