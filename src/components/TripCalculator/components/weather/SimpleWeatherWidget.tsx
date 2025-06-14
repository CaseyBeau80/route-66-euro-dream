
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
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
  console.log('🎯 CENTRALIZED: SimpleWeatherWidget rendering for', segment.endCity, {
    day: segment.day,
    isSharedView,
    isPDFExport,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString()
  });

  // CENTRALIZED: Enhanced date handling for shared views
  const effectiveTripStartDate = React.useMemo(() => {
    // Try to get trip start date from URL query params if in shared view
    if (isSharedView && !tripStartDate) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tripStartParam = urlParams.get('tripStart') || urlParams.get('startDate');
        
        if (tripStartParam) {
          const parsedDate = new Date(tripStartParam);
          if (!isNaN(parsedDate.getTime())) {
            console.log('✅ CENTRALIZED: Using trip start date from URL params:', parsedDate.toISOString());
            return parsedDate;
          }
        }
      } catch (error) {
        console.warn('⚠️ CENTRALIZED: Failed to parse trip start date from URL:', error);
      }
      
      // CENTRALIZED: Fallback to current date for shared views
      const fallbackDate = new Date();
      console.log('🔄 CENTRALIZED: Using current date as fallback for shared view:', fallbackDate.toISOString());
      return fallbackDate;
    }
    
    return tripStartDate || null;
  }, [tripStartDate, isSharedView]);

  // CENTRALIZED: Calculate segment date using utility service
  const segmentDate = React.useMemo(() => {
    const calculatedDate = WeatherUtilityService.getSegmentDate(effectiveTripStartDate, segment.day);
    console.log('✅ CENTRALIZED: Calculated segment date:', {
      city: segment.endCity,
      day: segment.day,
      calculatedDate: calculatedDate?.toISOString(),
      usingFallback: isSharedView && !tripStartDate
    });
    return calculatedDate;
  }, [effectiveTripStartDate, segment.day]);

  // CENTRALIZED: Always render WeatherCard to ensure weather fetching
  console.log('🔧 CENTRALIZED: Rendering WeatherCard with enhanced shared view support', {
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
