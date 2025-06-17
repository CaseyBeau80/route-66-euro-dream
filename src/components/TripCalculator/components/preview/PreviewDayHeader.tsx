
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface PreviewDayHeaderProps {
  day: number;
  segmentDate?: Date;
}

const PreviewDayHeader: React.FC<PreviewDayHeaderProps> = ({ day, segmentDate }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
        {day}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-1">
          Day {day}
        </h3>
        {segmentDate && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">
              {format(segmentDate, 'EEEE, MMMM do, yyyy')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewDayHeader;
