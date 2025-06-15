
import React from 'react';

interface RecommendedStopsDisplayProps {
  stops?: any[];
  segmentDay?: number;
  endCity?: string;
}

// Stub component - completely disabled
const RecommendedStopsDisplay: React.FC<RecommendedStopsDisplayProps> = () => {
  console.log('🚫 RecommendedStopsDisplay: Component disabled');
  return null;
};

export default RecommendedStopsDisplay;
