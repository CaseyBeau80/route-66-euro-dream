
import React from 'react';
import { Route } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SubStopTimingCard from './SubStopTimingCard';

interface SegmentRouteProgressionProps {
  segment: DailySegment;
}

const SegmentRouteProgression: React.FC<SegmentRouteProgressionProps> = ({ segment }) => {
  const hasValidTimings = segment.subStopTimings && Array.isArray(segment.subStopTimings) && segment.subStopTimings.length > 0;

  // Only show route progression if there are actual sub-stop timings
  if (!hasValidTimings) {
    return null;
  }

  return (
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
  );
};

export default SegmentRouteProgression;
