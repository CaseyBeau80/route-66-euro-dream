
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface DaySegmentCardHeaderProps {
  segment: DailySegment;
  segmentDate?: Date | null;
  driveTimeStyle: {
    bg: string;
    text: string;
    border: string;
  };
}

const DaySegmentCardHeader: React.FC<DaySegmentCardHeaderProps> = ({
  segment,
  segmentDate
}) => {
  return (
    <div className="bg-blue-600 text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Day {segment.day}</h3>
          {segmentDate && (
            <p className="text-sm text-blue-100">
              {format(segmentDate, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <h4 className="text-xl font-bold">{segment.endCity}</h4>
          <p className="text-sm text-blue-100">Destination</p>
        </div>
      </div>
    </div>
  );
};

export default DaySegmentCardHeader;
