
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import StopCard from './StopCard';

interface SegmentRecommendedStopsProps {
  segment: DailySegment;
}

const SegmentRecommendedStops: React.FC<SegmentRecommendedStopsProps> = ({ segment }) => {
  return (
    <div>
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-2">
        Recommended Stops ({segment.recommendedStops.length})
      </h4>
      {segment.recommendedStops.length > 0 ? (
        <div className="space-y-2">
          {segment.recommendedStops.slice(0, 3).map((stop) => (
            <StopCard key={stop.id} stop={stop} />
          ))}
          {segment.recommendedStops.length > 3 && (
            <div className="text-xs text-route66-vintage-brown italic">
              +{segment.recommendedStops.length - 3} more stops (view in detailed breakdown)
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-route66-vintage-brown italic">
          Direct drive - no specific stops planned for this segment
        </p>
      )}
    </div>
  );
};

export default SegmentRecommendedStops;
