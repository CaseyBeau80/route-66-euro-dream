
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

  // PLAN IMPLEMENTATION: Enhanced date handling for shared views
  const effectiveTripStartDate = React.useMemo(() => {
    // Try to get trip start date from URL query params if in shared view
    if (isSharedView && !tripStartDate) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tripStartParam = urlParams.get('tripStart') || urlParams.get('startDate');
        
        if (tripStartParam) {
          const parsedDate = new Date(tripStartParam);
          if (!isNaN(parsedDate.getTime())) {
            console.log('✅ SimpleWeatherWidget: Using trip start date from URL params:', parsedDate.toISOString());
            return parsedDate;
          }
        }
      } catch (error) {
        console.warn('⚠️ SimpleWeatherWidget: Failed to parse trip start date from URL:', error);
      }
      
      // PLAN REQUIREMENT: Fallback to current date for shared views
      const fallbackDate = new Date();
      console.log('🔄 SimpleWeatherWidget: Using current date as fallback for shared view:', fallbackDate.toISOString());
      return fallbackDate;
    }
    
    return tripStartDate || null;
  }, [tripStartDate, isSharedView]);

  // Calculate segment date - CRITICAL: Always try to calculate for weather fetching
  const segmentDate = React.useMemo(() => {
    if (!effectiveTripStartDate) {
      console.log('🚫 SimpleWeatherWidget: No effective trip start date available');
      return null;
    }
    
    try {
      const calculatedDate = DateNormalizationService.calculateSegmentDate(effectiveTripStartDate, segment.day);
      console.log('✅ SimpleWeatherWidget: Calculated segment date:', {
        city: segment.endCity,
        day: segment.day,
        calculatedDate: calculatedDate.toISOString(),
        usingFallback: isSharedView && !tripStartDate
      });
      return calculatedDate;
    } catch (error) {
      console.error('❌ SimpleWeatherWidget: Date calculation failed:', error);
      return null;
    }
  }, [effectiveTripStartDate, segment.day]);

  // PLAN IMPLEMENTATION: Always render WeatherCard to ensure weather fetching
  console.log('🔧 SimpleWeatherWidget: Rendering WeatherCard with enhanced shared view support', {
    segmentEndCity: segment.endCity,
    day: segment.day,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    usingFallbackDate: isSharedView && !tripStartDate,
    shouldFetchWeather: !!segmentDate
  });

  return (
    <div className="weather-widget">
      <WeatherCard
        segment={segment}
        tripStartDate={effectiveTripStartDate}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    </div>
  );
};

export default SimpleWeatherWidget;
