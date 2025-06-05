
import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { SubStopTiming } from '../services/Route66TripPlannerService';

interface SubStopTimingCardProps {
  timing: SubStopTiming;
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

const SubStopTimingCard: React.FC<SubStopTimingCardProps> = ({ timing }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-route66-vintage-beige rounded border border-route66-tan text-xs">
      <div className="flex-1 text-route66-vintage-brown font-semibold">
        {timing.fromStop.name}
      </div>
      <div className="flex items-center gap-1 text-route66-vintage-brown">
        <ArrowRight className="h-3 w-3" />
        <span className="font-mono">{timing.distanceMiles}mi</span>
        <span className="text-route66-text-muted">•</span>
        <Clock className="h-3 w-3" />
        <span className="font-mono">{formatDriveTime(timing.driveTimeHours)}</span>
      </div>
      <div className="flex-1 text-right text-route66-vintage-brown font-semibold">
        {timing.toStop.name}
      </div>
    </div>
  );
};

export default SubStopTimingCard;
