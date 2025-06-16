
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

  // Use ONLY segment data - no local calculations
  const segmentDistance = segment.distance;
  const segmentDriveTimeHours = segment.driveTimeHours;
  const formattedDriveTime = GoogleDistanceMatrixService.formatDuration(segmentDriveTimeHours);

  console.log(`🎯 DaySegmentCardStats Day ${segment.day} - Using segment data only:`, {
    segmentDay: segment.day,
    endCity: segment.endCity,
    segmentDistance,
    segmentDriveTimeHours,
    formattedDriveTime,
    dataSource: 'SEGMENT_DATA_ONLY'
  });

  return (
    <div className="flex items-center gap-4 text-sm text-route66-text-secondary">
      <div className="flex items-center gap-1">
        <Route className="h-4 w-4" />
        <span>{formatDistance(segmentDistance)}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span className={segmentDriveTimeHours > 7 ? 'text-orange-600' : ''}>
          {formattedDriveTime}
        </span>
      </div>
      {segmentDriveTimeHours > 7 && (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Long Drive Day</span>
        </div>
      )}
    </div>
  );
};

export default DaySegmentCardStats;
