
import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface DaySegmentCardHeaderProps {
  segment: DailySegment;
  tripStartDate?: Date;
  cardIndex?: number;
  isCompact?: boolean;
}

const DaySegmentCardHeader: React.FC<DaySegmentCardHeaderProps> = ({
  segment,
  tripStartDate,
  cardIndex = 0,
  isCompact = false
}) => {
  // Calculate the date for this segment
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) return undefined;
    const date = new Date(tripStartDate);
    date.setDate(date.getDate() + (segment.day - 1));
    return date;
  }, [tripStartDate, segment.day]);

  const headerPadding = isCompact ? 'p-3' : 'p-4';
  const titleSize = isCompact ? 'text-base' : 'text-lg';
  const textSize = isCompact ? 'text-xs' : 'text-sm';

  return (
    <div className={`${headerPadding} bg-gradient-to-r from-route66-primary to-route66-secondary text-white rounded-t-lg`}>
      <div className="space-y-3">
        {/* Blue Badge Header - Matching Preview Style */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
              Day {segment.day}
            </span>
            <span className="text-yellow-300">•</span>
            <h4 className={`${titleSize} font-semibold text-white`}>
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
            <div className="flex items-center gap-1 text-yellow-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Long Drive Day</span>
            </div>
          )}
        </div>

        {/* Date Display */}
        {segmentDate && (
          <div className={`flex items-center gap-2 ${textSize} text-blue-100`}>
            <Calendar className="h-4 w-4" />
            <span>📅 {format(segmentDate, 'EEEE, MMMM d')}</span>
          </div>
        )}
        
        {/* Route Description */}
        <div className={`${textSize} text-blue-100`}>
          <strong>Route:</strong> {segment.startCity} → {segment.endCity}
        </div>
      </div>
    </div>
  );
};

export default DaySegmentCardHeader;
