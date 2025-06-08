
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import PDFDaySegmentCard from './PDFDaySegmentCard';
import PDFHeader from './PDFHeader';
import PDFFooter from './PDFFooter';

interface PDFContentRendererProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportOptions: any;
  shareUrl?: string;
}

const PDFContentRenderer: React.FC<PDFContentRendererProps> = ({
  tripPlan,
  tripStartDate,
  exportOptions,
  shareUrl
}) => {
  console.log('📄 PDFContentRenderer: Rendering PDF content with', {
    segmentsCount: tripPlan.segments?.length || 0,
    exportFormat: exportOptions.format,
    hasStartDate: !!tripStartDate
  });

  // Filter segments with enriched weather data
  const enrichedSegments = tripPlan.segments?.filter(segment => 
    segment && segment.day && segment.endCity
  ) || [];

  return (
    <div className="pdf-content bg-white min-h-screen" style={{ padding: '40px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* PDF Header with Branding */}
      <PDFHeader
        title={exportOptions.title || `Route 66 Trip: ${tripPlan.startCity} to ${tripPlan.endCity}`}
        tripPlan={tripPlan}
        tripStartDate={tripStartDate}
      />

      {/* Trip Overview */}
      <div className="pdf-trip-overview no-page-break mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Trip Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="pdf-overview-card text-center p-3 bg-white rounded border">
            <div className="font-bold text-blue-700 text-lg">{tripPlan.startCity}</div>
            <div className="text-gray-600 text-xs mt-1">Starting Point</div>
          </div>
          <div className="pdf-overview-card text-center p-3 bg-white rounded border">
            <div className="font-bold text-blue-700 text-lg">{tripPlan.endCity}</div>
            <div className="text-gray-600 text-xs mt-1">Destination</div>
          </div>
          <div className="pdf-overview-card text-center p-3 bg-white rounded border">
            <div className="font-bold text-blue-700 text-lg">{tripPlan.totalDays}</div>
            <div className="text-gray-600 text-xs mt-1">Days</div>
          </div>
          <div className="pdf-overview-card text-center p-3 bg-white rounded border">
            <div className="font-bold text-blue-700 text-lg">{Math.round(tripPlan.totalDistance)}</div>
            <div className="text-gray-600 text-xs mt-1">Miles</div>
          </div>
        </div>
      </div>

      {/* Daily Segments */}
      <div className="pdf-segments">
        <h2 className="text-xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-2">Daily Itinerary</h2>
        {enrichedSegments.map((segment, index) => (
          <PDFDaySegmentCard
            key={`day-${segment.day}`}
            segment={segment}
            tripStartDate={tripStartDate}
            cardIndex={index}
            exportFormat={exportOptions.format}
          />
        ))}
      </div>

      {/* PDF Footer */}
      <PDFFooter
        shareUrl={shareUrl}
        enrichedSegments={enrichedSegments}
        includeQRCode={exportOptions.includeQRCode}
      />

      {/* Watermark */}
      {exportOptions.watermark && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div 
            className="text-gray-200 font-bold opacity-10 transform rotate-45"
            style={{ fontSize: '120px', zIndex: 1 }}
          >
            {exportOptions.watermark}
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFContentRenderer;
