
import React from 'react';
import { Route, Clock, AlertTriangle } from 'lucide-react';
import { useUnits } from '@/contexts/UnitContext';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { DriveTimeCalculator } from './utils/DriveTimeCalculator';

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

  // FIXED: Use DriveTimeCalculator for consistent drive time calculation
  const actualDriveTime = DriveTimeCalculator.getActualDriveTime(segment);
  const consistentFormattedTime = DriveTimeCalculator.formatDriveTime(segment);

  console.log('📊 FIXED: DaySegmentCardStats using corrected priority logic:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    drivingTime: segment.drivingTime, // Should be prioritized (correct values)
    driveTimeHours: segment.driveTimeHours, // Often incorrect defaults
    actualDriveTime,
    consistentFormattedTime,
    originalFormattedTime: formattedDriveTime
  });

  return (
    <div className="flex items-center gap-4 text-sm text-route66-text-secondary">
      <div className="flex items-center gap-1">
        <Route className="h-4 w-4" />
        <span>{formatDistance(segmentDistance)}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span className={actualDriveTime > 7 ? driveTimeStyle.text : ''}>
          {consistentFormattedTime} driving
        </span>
      </div>
      {actualDriveTime > 7 && (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Long Drive Day</span>
        </div>
      )}
    </div>
  );
};

export default DaySegmentCardStats;
