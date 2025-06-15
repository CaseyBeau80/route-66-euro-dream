
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';

interface PDFDaySegmentCardStopsProps {
  segment: DailySegment;
  exportFormat: 'full' | 'summary' | 'route-only';
}

// Simple stub component - no stops displayed
const PDFDaySegmentCardStops: React.FC<PDFDaySegmentCardStopsProps> = ({
  segment,
  exportFormat
}) => {
  console.log('🚫 PDFDaySegmentCardStops: Stops system disabled');
  
  // Return null to not render anything
  return null;
};

export default PDFDaySegmentCardStops;
