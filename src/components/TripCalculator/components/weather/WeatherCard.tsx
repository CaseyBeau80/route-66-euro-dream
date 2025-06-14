
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import SimpleWeatherWidget from './SimpleWeatherWidget';

interface WeatherCardProps {
  segment: DailySegment;
  tripStartDate?: Date | null;
  isSharedView?: boolean;
  isPDFExport?: boolean;
  cardIndex?: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🔧 UNIFIED: WeatherCard simplified render for', segment.endCity, {
    hasApiKey: 'handled-by-widget',
    isSharedView,
    isPDFExport,
    hasSegmentDate: 'handled-by-widget',
    unifiedFlow: true
  });

  return (
    <SimpleWeatherWidget
      segment={segment}
      tripStartDate={tripStartDate || undefined}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    />
  );
};

export default WeatherCard;
