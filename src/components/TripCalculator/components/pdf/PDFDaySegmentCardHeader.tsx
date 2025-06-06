
import React from 'react';
import { format } from 'date-fns';

interface PDFDaySegmentCardHeaderProps {
  day: number;
  endCity: string;
  segmentDate: Date | null;
}

const PDFDaySegmentCardHeader: React.FC<PDFDaySegmentCardHeaderProps> = ({
  day,
  endCity,
  segmentDate
}) => {
  return (
    <div className="pdf-card-header border-b border-gray-100 pb-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="pdf-day-badge bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
              Day {day}
            </span>
            <span className="text-blue-600">•</span>
            <h5 className="font-semibold text-blue-800 text-lg">
              📍 {endCity}
            </h5>
          </div>
          {segmentDate && (
            <p className="text-sm text-gray-600">
              📅 {format(segmentDate, 'EEEE, MMMM d')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFDaySegmentCardHeader;
