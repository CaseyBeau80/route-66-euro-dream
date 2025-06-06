
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import PDFDaySegmentCard from './PDFDaySegmentCard';

interface PDFRouteTabContentProps {
  segments: DailySegment[];
  tripStartDate?: Date;
  tripId?: string;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFRouteTabContent: React.FC<PDFRouteTabContentProps> = ({
  segments,
  tripStartDate,
  tripId,
  exportFormat
}) => {
  return (
    <div className="pdf-route-content space-y-4">
      <div className="mb-4">
        <h4 className="pdf-section-header text-sm font-medium text-blue-800 uppercase tracking-wider">
          Daily Route & Attractions
        </h4>
      </div>

      {segments.map((segment, index) => (
        <PDFDaySegmentCard
          key={`pdf-route-segment-${segment.day}-${segment.endCity}-${index}`}
          segment={segment}
          tripStartDate={tripStartDate}
          cardIndex={index}
          tripId={tripId}
          exportFormat={exportFormat}
        />
      ))}

      {/* PDF Legend */}
      <div className="pdf-legend mt-6 p-3 bg-gray-50 border border-gray-200 rounded">
        <h5 className="text-xs font-semibold text-gray-700 mb-2">Icon Legend:</h5>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div>📍 Destination City</div>
          <div>🛣️ Route Distance</div>
          <div>⏱️ Drive Time</div>
          <div>🏛️ Historic Sites</div>
          <div>🍔 Dining</div>
          <div>⛽ Gas Stations</div>
        </div>
      </div>
    </div>
  );
};

export default PDFRouteTabContent;
