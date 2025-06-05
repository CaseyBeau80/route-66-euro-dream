
import React from 'react';
import { Route } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SubStopTimingCard from './SubStopTimingCard';

interface SegmentRouteProgressionProps {
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

const SegmentRouteProgression: React.FC<SegmentRouteProgressionProps> = ({ segment }) => {
  const hasValidTimings = segment.subStopTimings && Array.isArray(segment.subStopTimings) && segment.subStopTimings.length > 0;

  return (
    <div>
      {/* Route Progression - Show drive times between stops */}
      {hasValidTimings ? (
        <div>
          <h4 className="font-travel font-bold text-route66-vintage-brown mb-2 text-sm flex items-center gap-1">
            <Route className="h-4 w-4" />
            Route Progression ({segment.subStopTimings.length} segments)
          </h4>
          <div className="space-y-1">
            {segment.subStopTimings.map((timing, index) => (
              <SubStopTimingCard 
                key={`timing-${segment.day}-${index}-${timing.fromStop.id}-${timing.toStop.id}`} 
                timing={timing} 
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-route66-vintage-yellow rounded border border-route66-vintage-brown">
          <div className="flex items-center gap-2 text-sm text-route66-vintage-brown">
            <Route className="h-4 w-4" />
            <span className="font-travel font-bold">Direct Route:</span>
            <span>{segment.startCity} → {segment.endCity}</span>
            <span className="text-route66-text-muted">•</span>
            <span>{formatDriveTime(segment.driveTimeHours)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentRouteProgression;
