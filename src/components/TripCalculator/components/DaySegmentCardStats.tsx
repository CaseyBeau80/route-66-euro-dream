
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

  // PREVIEW FORM LOGIC: Use exact same calculation as preview form
  const getPreviewFormDriveTime = (): string => {
    const miles = segment.approximateMiles || segment.distance || 0;
    const hours = miles / 60; // Same calculation as preview form
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes > 0) {
      return `${wholeHours}h ${minutes}m`;
    }
    return `${wholeHours}h`;
  };

  const previewFormTime = getPreviewFormDriveTime();
  const driveTimeHours = (segment.approximateMiles || segment.distance || 0) / 60;

  console.log('📊 PREVIEW FORM: DaySegmentCardStats using PREVIEW FORM logic:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    approximateMiles: segment.approximateMiles,
    distance: segment.distance,
    previewFormTime,
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
        <span className={driveTimeHours > 7 ? driveTimeStyle.text : ''}>
          {previewFormTime} driving
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
