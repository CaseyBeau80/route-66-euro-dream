
import React from 'react';
import { DailySegment } from '../../../services/planning/TripPlanBuilder';
import CompactWeatherDisplay from './CompactWeatherDisplay';

interface SegmentWeatherCardProps {
  segment: DailySegment;
  tripStartDate: Date;
}

const SegmentWeatherCard: React.FC<SegmentWeatherCardProps> = ({
  segment,
  tripStartDate
}) => {
  console.log('🔧 REFACTORED: SegmentWeatherCard using CompactWeatherDisplay for', segment.endCity);

  return (
    <CompactWeatherDisplay
      segment={segment}
      tripStartDate={tripStartDate}
    />
  );
};

export default SegmentWeatherCard;
