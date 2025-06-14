
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { DateNormalizationService } from './DateNormalizationService';
import WeatherCard from './WeatherCard';

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
  console.log('🎯 SimpleWeatherWidget: Rendering for', segment.endCity, {
    day: segment.day,
    isSharedView,
    isPDFExport,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString()
  });

  // Calculate segment date - CRITICAL: Always try to calculate for weather fetching
  const segmentDate = React.useMemo(() => {
    if (!tripStartDate) {
      console.log('🚫 SimpleWeatherWidget: No trip start date provided');
      return null;
    }
    
    try {
      const calculatedDate = DateNormalizationService.calculateSegmentDate(tripStartDate, segment.day);
      console.log('✅ SimpleWeatherWidget: Calculated segment date:', {
        city: segment.endCity,
        day: segment.day,
        calculatedDate: calculatedDate.toISOString()
      });
      return calculatedDate;
    } catch (error) {
      console.error('❌ SimpleWeatherWidget: Date calculation failed:', error);
      return null;
    }
  }, [tripStartDate, segment.day]);

  // CRITICAL FIX: Always render WeatherCard to trigger weather fetching, even in shared views
  console.log('🔧 SimpleWeatherWidget: Rendering WeatherCard with enhanced shared view support', {
    segmentEndCity: segment.endCity,
    day: segment.day,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    shouldFetchWeather: !!segmentDate // This should trigger weather fetching
  });

  return (
    <div className="weather-widget">
      <WeatherCard
        segment={segment}
        tripStartDate={tripStartDate}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    </div>
  );
};

export default SimpleWeatherWidget;
