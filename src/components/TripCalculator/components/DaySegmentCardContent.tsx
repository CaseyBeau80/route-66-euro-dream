
import React from 'react';
import { DailySegment } from '../services/planning/TripPlanBuilder';
import SegmentWeatherWidget from './SegmentWeatherWidget';
import StopsEmpty from './StopsEmpty';

interface DaySegmentCardContentProps {
  segment: DailySegment;
  tripStartDate?: Date;
  driveTimeStyle: {
    bg: string;
    text: string;
    border: string;
  };
  cardIndex?: number;
  tripId?: string;
  sectionKey?: string;
}

const DaySegmentCardContent: React.FC<DaySegmentCardContentProps> = ({
  segment,
  tripStartDate
}) => {
  return (
    <div className="space-y-4">
      {/* Weather Section */}
      <div className="bg-white p-4">
        <h6 className="text-sm font-medium text-gray-700 mb-3">Weather Forecast</h6>
        <SegmentWeatherWidget
          segment={segment}
          tripStartDate={tripStartDate}
          forceExpanded={true}
        />
      </div>
      
      {/* Stops Section */}
      <div className="bg-white p-4 border-t border-gray-100">
        <h6 className="text-sm font-medium text-gray-700 mb-3">Route Stops</h6>
        <StopsEmpty />
      </div>
    </div>
  );
};

export default DaySegmentCardContent;
