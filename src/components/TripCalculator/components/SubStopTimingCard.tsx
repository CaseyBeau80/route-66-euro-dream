
import React from 'react';
import { Clock, ArrowRight, MapPin } from 'lucide-react';
import { SegmentTiming } from '../services/planning/SubStopTimingCalculator';

interface SubStopTimingCardProps {
  timing: SegmentTiming;
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
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-route66-vintage-brown shadow-sm">
      {/* From Location */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <MapPin className="h-3 w-3 text-route66-vintage-brown flex-shrink-0" />
        <span className="text-xs font-semibold text-route66-vintage-brown truncate">
          {timing.fromStop.name}
        </span>
      </div>
      
      {/* Drive Info */}
      <div className="flex items-center gap-2 px-2 py-1 bg-route66-vintage-beige rounded border border-route66-tan">
        <ArrowRight className="h-3 w-3 text-route66-vintage-brown" />
        <div className="flex items-center gap-1 text-xs text-route66-vintage-brown">
          <span className="font-mono font-bold">{timing.distanceMiles}mi</span>
          <span className="text-route66-text-muted">•</span>
          <Clock className="h-3 w-3" />
          <span className="font-mono font-bold">{formatDriveTime(timing.driveTimeHours)}</span>
        </div>
      </div>
      
      {/* To Location */}
      <div className="flex items-center gap-1 flex-1 min-w-0 justify-end">
        <span className="text-xs font-semibold text-route66-vintage-brown truncate text-right">
          {timing.toStop.name}
        </span>
        <MapPin className="h-3 w-3 text-route66-vintage-brown flex-shrink-0" />
      </div>
    </div>
  );
};

export default SubStopTimingCard;
