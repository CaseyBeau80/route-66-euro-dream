
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import PDFItineraryView from './PDFItineraryView';
import { format } from 'date-fns';
import { useUnits } from '@/contexts/UnitContext';

interface PDFContentRendererProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  exportOptions: {
    format: 'full' | 'summary' | 'route-only';
    title?: string;
    watermark?: string;
    includeQRCode: boolean;
  };
  shareUrl?: string;
}

const PDFContentRenderer: React.FC<PDFContentRendererProps> = ({
  tripPlan,
  tripStartDate,
  exportOptions,
  shareUrl
}) => {
  const { formatDistance } = useUnits();

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatStartDate = (date?: Date): string => {
    if (!date) return 'Not specified';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const tripTitle = exportOptions.title || `${tripPlan.startCity} to ${tripPlan.endCity} Route 66 Trip`;

  return (
    <div className="pdf-clean-container bg-white text-black p-6 font-sans">
      {/* PDF Header */}
      <div className="pdf-header mb-8 text-center border-b-2 border-blue-500 pb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {tripTitle}
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          {tripPlan.startCity} → {tripPlan.endCity}
        </p>
        <p className="text-sm text-gray-500">
          Generated on {format(new Date(), 'MMMM d, yyyy')}
        </p>
      </div>

      {/* Trip Overview Stats */}
      <div className="pdf-overview mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Trip Overview</h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded border">
            <div className="text-lg font-bold text-blue-600">{tripPlan.totalDays}</div>
            <div className="text-xs text-gray-600">Days</div>
            <div className="text-xs text-gray-500 mt-1">Starting {formatStartDate(tripStartDate)}</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded border">
            <div className="text-lg font-bold text-blue-600">{formatDistance(tripPlan.totalDistance)}</div>
            <div className="text-xs text-gray-600">Total Distance</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded border">
            <div className="text-lg font-bold text-blue-600">{formatTime(tripPlan.totalDrivingTime)}</div>
            <div className="text-xs text-gray-600">Drive Time</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded border">
            <div className="text-lg font-bold text-blue-600">--</div>
            <div className="text-xs text-gray-600">Est. Cost</div>
          </div>
        </div>
      </div>

      {/* Daily Itinerary */}
      <PDFItineraryView
        segments={tripPlan.segments}
        tripStartDate={tripStartDate}
        tripId={`pdf-${Date.now()}`}
        totalDays={tripPlan.totalDays}
        exportFormat={exportOptions.format}
      />

      {/* QR Code Section */}
      {exportOptions.includeQRCode && shareUrl && (
        <div className="pdf-qr-section mt-8 p-4 bg-gray-50 rounded border text-center">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">View Live Version</h3>
          <p className="text-xs text-gray-600 mb-2">Scan QR code or visit:</p>
          <p className="text-xs text-blue-600 break-all">{shareUrl}</p>
        </div>
      )}

      {/* Watermark */}
      {exportOptions.watermark && (
        <div className="pdf-watermark-text fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 text-8xl text-gray-100 font-bold pointer-events-none z-0">
          {exportOptions.watermark}
        </div>
      )}

      {/* PDF Footer */}
      <div className="pdf-footer mt-12 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Generated from Route 66 Trip Planner • {format(new Date(), 'MMMM d, yyyy')}
        </p>
        {shareUrl && (
          <p className="text-xs text-gray-400 mt-1 break-all">
            Live version: {shareUrl}
          </p>
        )}
      </div>
    </div>
  );
};

export default PDFContentRenderer;
