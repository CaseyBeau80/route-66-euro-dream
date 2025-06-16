
import React from 'react';
import { Route, Clock, AlertTriangle } from 'lucide-react';
import { useUnits } from '@/contexts/UnitContext';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

interface DaySegmentCardStatsProps {
  segment: DailySegment;
}

const DaySegmentCardStats: React.FC<DaySegmentCardStatsProps> = ({
  segment
}) => {
  const { formatDistance } = useUnits();

  // Use Google Distance Matrix API data directly from segment
  const apiDistance = segment.distance || 0;
  const apiDriveTimeHours = segment.driveTimeHours || 0;
  const formattedDriveTime = GoogleDistanceMatrixService.formatDuration(apiDriveTimeHours);

  console.log(`📊 DaySegmentCardStats Day ${segment.day} using Google API data:`, {
    segmentDay: segment.day,
    endCity: segment.endCity,
    apiDistance,
    apiDriveTimeHours,
    formattedDriveTime
  });

  return (
    <div className="flex items-center gap-4 text-sm text-route66-text-secondary">
      <div className="flex items-center gap-1">
        <Route className="h-4 w-4" />
        <span>{formatDistance(apiDistance)}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span className={apiDriveTimeHours > 7 ? 'text-orange-600' : ''}>
          {formattedDriveTime} driving (Google API)
        </span>
      </div>
      {apiDriveTimeHours > 7 && (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Long Drive Day</span>
        </div>
      )}
    </div>
  );
};

export default DaySegmentCardStats;
