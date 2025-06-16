
import React from 'react';
import { Route, Clock, AlertTriangle } from 'lucide-react';
import { useUnits } from '@/contexts/UnitContext';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

interface DaySegmentCardStatsProps {
  segment: DailySegment;
  formattedDriveTime: string;
  segmentDistance: number;
  driveTimeStyle: {
    bg: string;
    text: string;
    border: string;
  };
}

const DaySegmentCardStats: React.FC<DaySegmentCardStatsProps> = ({
  segment,
  formattedDriveTime,
  segmentDistance,
  driveTimeStyle
}) => {
  const { formatDistance } = useUnits();

  // Use the formatted drive time from Google Distance Matrix API or fallback to approximation
  const displayDriveTime = formattedDriveTime || GoogleDistanceMatrixService.formatDuration(segment.driveTimeHours || 0);
  const driveTimeHours = segment.driveTimeHours || 0;

  console.log('📊 DaySegmentCardStats using Google Distance Matrix API data:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    apiDriveTime: displayDriveTime,
    driveTimeHours,
    distance: segmentDistance
  });

  return (
    <div className="flex items-center gap-4 text-sm text-route66-text-secondary">
      <div className="flex items-center gap-1">
        <Route className="h-4 w-4" />
        <span>{formatDistance(segmentDistance)}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span className={driveTimeHours > 7 ? driveTimeStyle.text : ''}>
          {displayDriveTime} driving
        </span>
      </div>
      {driveTimeHours > 7 && (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Long Drive Day</span>
        </div>
      )}
    </div>
  );
};

export default DaySegmentCardStats;
