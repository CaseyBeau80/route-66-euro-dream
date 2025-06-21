
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { useUnifiedWeather } from './hooks/useUnifiedWeather';
import SegmentWeatherContent from './SegmentWeatherContent';

interface UnifiedWeatherWidgetProps {
  segment: DailySegment;
  tripStartDate?: Date;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const UnifiedWeatherWidget: React.FC<UnifiedWeatherWidgetProps> = ({
  segment,
  tripStartDate,
  isSharedView = false,
  isPDFExport = false
}) => {
  // FIXED: Calculate segment date properly
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    }
    return null;
  }, [tripStartDate, segment.day]);

  // FIXED: Use unified weather hook with proper error handling
  const { 
    weather, 
    loading, 
    error, 
    hasApiKey, 
    retryCount, 
    refetch 
  } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    prioritizeCachedData: isSharedView || isPDFExport,
    cachedWeather: null
  });

  console.log('🌤️ FIXED UNIFIED WEATHER:', {
    cityName: segment.endCity,
    day: segment.day,
    hasWeather: !!weather,
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    loading,
    error,
    hasApiKey,
    segmentDate: segmentDate?.toISOString(),
    isSharedView,
    isPDFExport
  });

  const handleApiKeySet = React.useCallback(() => {
    console.log('🔑 FIXED: API key set, refetching weather for', segment.endCity);
    refetch();
  }, [refetch, segment.endCity]);

  const handleTimeout = React.useCallback(() => {
    console.log('⏰ FIXED: Weather timeout for', segment.endCity);
  }, [segment.endCity]);

  const handleRetry = React.useCallback(() => {
    console.log('🔄 FIXED: Retrying weather fetch for', segment.endCity);
    refetch();
  }, [refetch, segment.endCity]);

  return (
    <SegmentWeatherContent
      hasApiKey={hasApiKey}
      loading={loading}
      weather={weather}
      error={error}
      retryCount={retryCount}
      segmentEndCity={segment.endCity}
      segmentDate={segmentDate}
      onApiKeySet={handleApiKeySet}
      onTimeout={handleTimeout}
      onRetry={handleRetry}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    />
  );
};

export default UnifiedWeatherWidget;
