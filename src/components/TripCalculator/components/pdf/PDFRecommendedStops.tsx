
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

interface PDFRecommendedStopsProps {
  segment: DailySegment;
  exportFormat: 'full' | 'summary' | 'route-only';
}

// Stub component - recommendation system removed
const PDFRecommendedStops: React.FC<PDFRecommendedStopsProps> = ({
  segment,
  exportFormat
}) => {
  console.log('🚫 PDFRecommendedStops: Recommendation system disabled');
  return null;
};

export default PDFRecommendedStops;
