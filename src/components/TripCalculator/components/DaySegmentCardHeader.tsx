
import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface DaySegmentCardHeaderProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
}

const DaySegmentCardHeader: React.FC<DaySegmentCardHeaderProps> = ({
  segment,
  tripStartDate,
  cardIndex = 0
}) => {
  // Calculate the date for this segment
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    const date = new Date(tripStartDate);
    date.setDate(date.getDate() + (segment.day - 1));
    return date;
  }, [tripStartDate, segment.day]);

  return (
    <div className="space-y-3">
      {/* Blue Badge Header - Matching Preview Style */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
            Day {segment.day}
          </span>
          <span className="text-red-600">•</span>
          <h4 className="text-lg font-semibold text-gray-800">
            {segment.endCity}
          </h4>
          
          {/* Google Maps Data Indicator */}
          {segment.isGoogleMapsData && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              🗺️ Enhanced
            </span>
          )}
        </div>
        
        {/* Drive Time Warning */}
        {segment.driveTimeHours && segment.driveTimeHours > 7 && (
          <div className="flex items-center gap-1 text-orange-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">Long Drive Day</span>
          </div>
        )}
      </div>

      {/* Date Display */}
      {segmentDate && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>📅 {format(segmentDate, 'EEEE, MMMM d')}</span>
        </div>
      )}
      
      {/* Route Description */}
      <div className="text-sm text-gray-600">
        <strong>Route:</strong> {segment.startCity} → {segment.endCity}
      </div>
    </div>
  );
};

export default DaySegmentCardHeader;
