
import React from 'react';
import { MapPin, Clock, AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface SegmentStatsProps {
  segment: DailySegment;
}

const formatDriveTime = (hours: number): string => {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes}m`;
  }
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
};

const SegmentStats: React.FC<SegmentStatsProps> = ({ segment }) => {
  const isLongDriveDay = segment.approximateMiles > 500;

  return (
    <div className="flex items-center gap-4 text-sm text-route66-vintage-brown">
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4" />
        <span>{segment.approximateMiles} miles</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>~{formatDriveTime(segment.driveTimeHours)} total</span>
      </div>
      {isLongDriveDay && (
        <div className="flex items-center gap-1 text-orange-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs">Long Drive Day</span>
        </div>
      )}
    </div>
  );
};

export default SegmentStats;
