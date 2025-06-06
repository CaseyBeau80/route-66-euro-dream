
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import { useOptimizedValidation } from '../hooks/useOptimizedValidation';
import StopCard from './StopCard';

interface SegmentRecommendedStopsProps {
  segment: DailySegment;
}

const SegmentRecommendedStops: React.FC<SegmentRecommendedStopsProps> = ({ segment }) => {
  // Use optimized validation to prevent multiple validation calls
  const { validStops, userRelevantStops, isValid } = useOptimizedValidation(segment);
  
  console.log('🎯 SegmentRecommendedStops filtering:', {
    segmentDay: segment.day,
    isValid,
    totalValidatedStops: validStops.length,
    userRelevantStops: userRelevantStops.length,
    filteredOutStops: validStops.length - userRelevantStops.length,
    userStopNames: userRelevantStops.map(s => s.name),
    filteredCategories: validStops.filter(s => !userRelevantStops.includes(s)).map(s => s.category)
  });

  if (!isValid) {
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-sm text-red-600">
          Unable to load stops due to invalid segment data
        </p>
      </div>
    );
  }

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
