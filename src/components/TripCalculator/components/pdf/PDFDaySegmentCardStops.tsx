
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

interface PDFDaySegmentCardStopsProps {
  segment: DailySegment;
  exportFormat: 'full' | 'summary' | 'route-only';
}

// Stub implementation - recommendation system removed
const PDFDaySegmentCardStops: React.FC<PDFDaySegmentCardStopsProps> = ({
  segment,
  exportFormat
}) => {
  console.log('🚫 PDFDaySegmentCardStops: Stops system disabled');
  
  // Return nothing - stops functionality completely removed
  return null;
};

export default PDFDaySegmentCardStops;
