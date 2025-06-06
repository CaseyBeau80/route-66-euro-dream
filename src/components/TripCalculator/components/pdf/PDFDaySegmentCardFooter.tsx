
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';

interface PDFDaySegmentCardFooterProps {
  segment: DailySegment;
}

const PDFDaySegmentCardFooter: React.FC<PDFDaySegmentCardFooterProps> = ({
  segment
}) => {
  if (!segment.driveTimeCategory) {
    return null;
  }

  return (
    <div className="pdf-drive-time-category mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Driving intensity:</span>
        <span className={`px-3 py-1 rounded text-sm font-medium ${
          segment.driveTimeCategory.category === 'short' ? 'bg-green-100 text-green-700' :
          segment.driveTimeCategory.category === 'optimal' ? 'bg-blue-100 text-blue-700' :
          segment.driveTimeCategory.category === 'long' ? 'bg-orange-100 text-orange-700' :
          'bg-red-100 text-red-700'
        }`}>
          {segment.driveTimeCategory.message}
        </span>
      </div>
    </div>
  );
};

export default PDFDaySegmentCardFooter;
