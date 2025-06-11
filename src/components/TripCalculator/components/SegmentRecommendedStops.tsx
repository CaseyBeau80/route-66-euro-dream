
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface SegmentRecommendedStopsProps {
  segment: DailySegment;
}

// DEPRECATED: This component has been replaced by SegmentNearbyAttractions
// to prevent duplication of attraction lists
const SegmentRecommendedStops: React.FC<SegmentRecommendedStopsProps> = ({ segment }) => {
  console.warn('⚠️ SegmentRecommendedStops is DEPRECATED and should not be used. Use SegmentNearbyAttractions instead.');
  console.log('🚨 SegmentRecommendedStops rendered - this should NOT happen:', {
    segmentDay: segment.day,
    endCity: segment.endCity,
    stackTrace: new Error().stack
  });

  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-700 font-medium">
        ⚠️ Deprecated Component
      </p>
      <p className="text-xs text-yellow-600 mt-1">
        SegmentRecommendedStops is deprecated to prevent attraction duplication. 
        This should be replaced with SegmentNearbyAttractions.
      </p>
    </div>
  );
};

export default SegmentRecommendedStops;
