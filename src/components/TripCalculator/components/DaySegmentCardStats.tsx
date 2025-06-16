
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

  // NUCLEAR FIX: ONLY use Google API data - no fallbacks or alternatives
  const googleAPIDistance = segment.distance;
  const googleAPIDriveTimeHours = segment.driveTimeHours;
  const formattedDriveTime = GoogleDistanceMatrixService.formatDuration(googleAPIDriveTimeHours);

  console.log(`🔥 NUCLEAR FIX DaySegmentCardStats Day ${segment.day} - EXCLUSIVE Google API:`, {
    segmentDay: segment.day,
    endCity: segment.endCity,
    googleAPIDistance,
    googleAPIDriveTimeHours,
    formattedDriveTime,
    usingEXCLUSIVELYGoogleAPI: true
  });

  return (
    <div className="flex items-center gap-4 text-sm text-route66-text-secondary">
      <div className="flex items-center gap-1">
        <Route className="h-4 w-4" />
        <span>{formatDistance(googleAPIDistance)} (Google API)</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span className={googleAPIDriveTimeHours > 7 ? 'text-orange-600' : ''}>
          {formattedDriveTime} (Google API)
        </span>
      </div>
      {googleAPIDriveTimeHours > 7 && (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Long Drive Day</span>
        </div>
      )}
    </div>
  );
};

export default DaySegmentCardStats;
