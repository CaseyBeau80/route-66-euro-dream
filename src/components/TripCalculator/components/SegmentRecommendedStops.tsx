
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { getValidatedStops, isUserRelevantStop } from './utils/stopValidation';
import StopCard from './StopCard';

interface SegmentRecommendedStopsProps {
  segment: DailySegment;
}

const SegmentRecommendedStops: React.FC<SegmentRecommendedStopsProps> = ({ segment }) => {
  // Use the centralized validation logic from stopValidation.ts
  const validStops = getValidatedStops(segment);
  const userRelevantStops = validStops.filter(isUserRelevantStop);
  
  console.log('🎯 SegmentRecommendedStops filtering:', {
    segmentDay: segment.day,
    totalValidatedStops: validStops.length,
    userRelevantStops: userRelevantStops.length,
    filteredOutStops: validStops.length - userRelevantStops.length,
    userStopNames: userRelevantStops.map(s => s.name),
    filteredCategories: validStops.filter(s => !isUserRelevantStop(s)).map(s => s.category)
  });

  return (
    <div>
      <h4 className="font-travel font-bold text-route66-vintage-brown mb-2">
        Recommended Stops ({userRelevantStops.length})
      </h4>
      {userRelevantStops.length > 0 ? (
        <div className="space-y-2">
          {userRelevantStops.map((stop) => (
            <StopCard key={stop.id} stop={stop} />
          ))}
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
