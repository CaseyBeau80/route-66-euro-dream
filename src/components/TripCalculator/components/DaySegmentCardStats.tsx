
import React from 'react';
import { Route, Clock, AlertTriangle } from 'lucide-react';
import { useUnits } from '@/contexts/UnitContext';
import { DailySegment } from '../services/planning/TripPlanBuilder';

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

  // FIXED: Use the same drive time calculation as TripResults (working preview)
  const drivingTime = segment.drivingTime || segment.driveTimeHours || 0;
  
  // FIXED: Use the same formatTime function as TripResults
  const formatTime = (hours?: number): string => {
    if (!hours) return 'N/A';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  const consistentFormattedTime = formatTime(drivingTime);

  console.log('📊 FIXED: DaySegmentCardStats using SAME logic as working preview:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    drivingTime: segment.drivingTime,
    driveTimeHours: segment.driveTimeHours,
    actualDriveTime: drivingTime,
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
        <span className={drivingTime > 7 ? driveTimeStyle.text : ''}>
          {consistentFormattedTime} driving
        </span>
      </div>
      {drivingTime > 7 && (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">Long Drive Day</span>
        </div>
      )}
    </div>
  );
};

export default DaySegmentCardStats;
