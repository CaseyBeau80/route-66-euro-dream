
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

  // EXACT PREVIEW FORM LOGIC: Use the exact same calculation as preview form
  const miles = segment.approximateMiles || segment.distance || 0;
  const hours = miles / 60; // Same calculation as preview form
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  const previewFormDriveTime = minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  const driveTimeHours = hours;

  console.log('📊 EXACT PREVIEW FORM: DaySegmentCardStats using exact preview form logic:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    approximateMiles: segment.approximateMiles,
    distance: segment.distance,
    previewFormDriveTime,
    exactPreviewFormLogic: true
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
          {previewFormDriveTime} driving
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
