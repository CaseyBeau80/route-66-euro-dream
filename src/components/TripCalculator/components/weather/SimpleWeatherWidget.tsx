
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { ShareWeatherConfigService } from '../../services/weather/ShareWeatherConfigService';
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
  console.log('🎯 FIXED: SimpleWeatherWidget rendering with enhanced shared view support', segment.endCity, {
    day: segment.day,
    isSharedView,
    isPDFExport,
    hasTripStartDate: !!tripStartDate,
    tripStartDate: tripStartDate?.toISOString()
  });

  // FIXED: Enhanced shared view API key detection
  const weatherConfig = React.useMemo(() => {
    if (isSharedView || isPDFExport) {
      const config = ShareWeatherConfigService.getShareWeatherConfig();
      console.log('🔑 FIXED: Shared view weather config for', segment.endCity, {
        hasApiKey: config.hasApiKey,
        canFetchLiveWeather: config.canFetchLiveWeather,
        apiKeySource: config.apiKeySource,
        keyLength: config.detectionDetails?.keyLength
      });
      return config;
    }
    return null;
  }, [isSharedView, isPDFExport, segment.endCity]);

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
            console.log('✅ FIXED: Using trip start date from URL params:', parsedDate.toISOString());
            return parsedDate;
          }
        }
      } catch (error) {
        console.warn('⚠️ FIXED: Failed to parse trip start date from URL:', error);
      }
      
      // CENTRALIZED: Fallback to current date for shared views
      const fallbackDate = new Date();
      console.log('🔄 FIXED: Using current date as fallback for shared view:', fallbackDate.toISOString());
      return fallbackDate;
    }
    
    return tripStartDate || null;
  }, [tripStartDate, isSharedView]);

  // CENTRALIZED: Calculate segment date using utility service
  const segmentDate = React.useMemo(() => {
    const calculatedDate = WeatherUtilityService.getSegmentDate(effectiveTripStartDate, segment.day);
    console.log('✅ FIXED: Calculated segment date for shared view:', {
      city: segment.endCity,
      day: segment.day,
      calculatedDate: calculatedDate?.toISOString(),
      usingFallback: isSharedView && !tripStartDate,
      isSharedView,
      hasWeatherConfig: !!weatherConfig
    });
    return calculatedDate;
  }, [effectiveTripStartDate, segment.day]);

  // FIXED: Log weather configuration for shared views
  React.useEffect(() => {
    if ((isSharedView || isPDFExport) && weatherConfig) {
      console.log('🔧 FIXED: Weather configuration active for shared view:', {
        city: segment.endCity,
        hasApiKey: weatherConfig.hasApiKey,
        canFetchLiveWeather: weatherConfig.canFetchLiveWeather,
        apiKeySource: weatherConfig.apiKeySource,
        shouldAttemptLiveWeather: ShareWeatherConfigService.shouldAttemptLiveWeather(),
        statusMessage: ShareWeatherConfigService.getWeatherStatusMessage(weatherConfig)
      });
    }
  }, [isSharedView, isPDFExport, weatherConfig, segment.endCity]);

  // FIXED: Always render WeatherCard to ensure weather fetching with enhanced shared view support
  console.log('🔧 FIXED: Rendering WeatherCard with enhanced shared view API key support', {
    segmentEndCity: segment.endCity,
    day: segment.day,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    canFetchLiveWeather: weatherConfig?.canFetchLiveWeather || false,
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
