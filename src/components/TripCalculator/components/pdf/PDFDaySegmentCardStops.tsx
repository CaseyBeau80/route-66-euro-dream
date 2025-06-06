
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';

interface PDFDaySegmentCardStopsProps {
  segment: DailySegment;
  exportFormat: 'full' | 'summary' | 'route-only';
}

const PDFDaySegmentCardStops: React.FC<PDFDaySegmentCardStopsProps> = ({
  segment,
  exportFormat
}) => {
  if (exportFormat === 'route-only' || !segment.recommendedStops || segment.recommendedStops.length === 0) {
    return null;
  }

  return (
    <div className="pdf-recommended-stops mb-4">
      <h6 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        🏛️ Recommended Stops ({segment.recommendedStops.length} total)
      </h6>
      <ul className="space-y-2">
        {segment.recommendedStops.map((stop, index) => (
          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>
              <strong>{stop.name}</strong>
              {stop.description && exportFormat === 'full' && (
                <span className="text-gray-500"> - {stop.description}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PDFDaySegmentCardStops;
