
import React from 'react';
import { Badge } from '@/components/ui/badge';
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
    <div className="bg-blue-600 text-white p-4 rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 font-medium">
            Day {segment.day}
          </Badge>
          <h4 className="text-lg font-semibold">
            {segment.endCity}
          </h4>
        </div>
        
        {segmentDate && (
          <div className="flex items-center gap-2 text-blue-100">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">
              {format(segmentDate, 'EEE, MMM d')}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <h5 className="text-sm text-blue-100 font-medium">
          {segment.startCity} → {segment.endCity}
        </h5>
      </div>
    </div>
  );
};

export default DaySegmentCardHeader;
