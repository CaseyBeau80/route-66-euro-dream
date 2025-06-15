
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import CompactWeatherDisplay from './components/CompactWeatherDisplay';

interface SimpleWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SimpleWeatherWidget: React.FC<SimpleWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🔧 REFACTORED: SimpleWeatherWidget now using CompactWeatherDisplay for', segment.endCity);

  return (
    <CompactWeatherDisplay
      segment={segment}
      tripStartDate={tripStartDate}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    />
  );
};

export default SimpleWeatherWidget;
