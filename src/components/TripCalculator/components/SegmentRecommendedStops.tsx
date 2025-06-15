
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface SegmentRecommendedStopsProps {
  segment: DailySegment;
  tripStartDate?: Date;
}

// Stub component - completely disabled
const SegmentRecommendedStops: React.FC<SegmentRecommendedStopsProps> = () => {
  console.log('🚫 SegmentRecommendedStops: Component disabled');
  return null;
};

export default SegmentRecommendedStops;
