
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
  
  // Return simple travel message instead of recommendations
  return (
    <div className="text-center py-3">
      <p className="text-sm text-gray-600">
        Enjoy your drive from {segment.startCity} to {segment.endCity}! 
        <br />
        Stop along the way to explore local attractions and Route 66 landmarks.
      </p>
    </div>
  );
};

export default PDFDaySegmentCardStops;
