
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
    </div>
  );
};

export default PDFRouteTabContent;
