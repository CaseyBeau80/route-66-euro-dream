
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentNearbyAttractions from './SegmentNearbyAttractions';
import ErrorBoundary from './ErrorBoundary';

interface SegmentRecommendedStopsProps {
  segment: DailySegment;
}

const SegmentRecommendedStops: React.FC<SegmentRecommendedStopsProps> = ({ segment }) => {
  console.log('🎯 SegmentRecommendedStops now using SegmentNearbyAttractions:', {
    segmentDay: segment.day,
    endCity: segment.endCity
  });

  return (
    <ErrorBoundary context={`SegmentRecommendedStops-Day${segment.day}`}>
      <div>
        <h4 className="font-travel font-bold text-route66-vintage-brown mb-2">
          Attractions & Hidden Gems
        </h4>
        
        {/* Use the new SegmentNearbyAttractions component with limit of 3 */}
        <SegmentNearbyAttractions segment={segment} maxAttractions={3} />
      </div>
    </ErrorBoundary>
  );
};

export default SegmentRecommendedStops;
