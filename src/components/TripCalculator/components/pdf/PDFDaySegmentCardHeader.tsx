
import React from 'react';
import { format } from 'date-fns';

interface PDFDaySegmentCardHeaderProps {
  day: number;
  endCity: string;
  segmentDate?: Date | null;
}

const PDFDaySegmentCardHeader: React.FC<PDFDaySegmentCardHeaderProps> = ({
  day,
  endCity,
  segmentDate
}) => {
  return (
    <div className="pdf-day-header flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
          {day}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Day {day}</h3>
          <p className="text-sm text-gray-600">Destination: {endCity}</p>
        </div>
      </div>
      
      {segmentDate && (
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">
            📅 {format(segmentDate, 'EEEE')}
          </p>
          <p className="text-xs text-gray-500">
            {format(segmentDate, 'MMM d, yyyy')}
          </p>
        </div>
      )}
    </div>
  );
};

export default PDFDaySegmentCardHeader;
