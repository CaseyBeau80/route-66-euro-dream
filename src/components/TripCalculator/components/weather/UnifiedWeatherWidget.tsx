
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { useUnifiedWeather } from './hooks/useUnifiedWeather';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import UnifiedWeatherDisplay from './UnifiedWeatherDisplay';
import WeatherApiKeyInput from './WeatherApiKeyInput';

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
  // Calculate segment date using the same logic everywhere
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      return WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
    }

    // For shared views, try URL parameters
    if (isSharedView) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const possibleParams = ['tripStart', 'startDate', 'start_date', 'trip_start', 'tripStartDate'];
        
        for (const paramName of possibleParams) {
          const tripStartParam = urlParams.get(paramName);
          if (tripStartParam) {
            const parsedDate = new Date(tripStartParam);
            if (!isNaN(parsedDate.getTime())) {
              return WeatherUtilityService.getSegmentDate(parsedDate, segment.day);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to parse trip start date from URL:', error);
      }
    }

    // Fallback: use today
    const today = new Date();
    return new Date(today.getTime() + (segment.day - 1) * 24 * 60 * 60 * 1000);
  }, [tripStartDate, segment.day, isSharedView]);

  // Check if we have a valid API key
  const hasValidApiKey = React.useMemo(() => {
    return WeatherApiKeyManager.hasApiKey();
  }, []);

  // Use unified weather hook
  const { weather, loading, error } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    prioritizeCachedData: false,
    cachedWeather: null
  });

  console.log('🔥 UNIFIED: UnifiedWeatherWidget render:', {
    cityName: segment.endCity,
    day: segment.day,
    hasValidApiKey,
    hasWeather: !!weather,
    loading,
    error,
    segmentDate: segmentDate?.toISOString(),
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    isSharedView,
    isPDFExport,
    unifiedPath: true
  });

  // Show API key input if no valid key (but not in PDF export or shared view)
  if (!hasValidApiKey && !isPDFExport && !isSharedView) {
    return <WeatherApiKeyInput />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segment.endCity}...</span>
        </div>
      </div>
    );
  }

  // Show weather if available
  if (weather && segmentDate) {
    return (
      <UnifiedWeatherDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={segment.endCity}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Fallback
  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
      <div className="text-blue-600 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-blue-700 font-medium">Weather forecast temporarily unavailable</p>
      <p className="text-xs text-blue-600 mt-1">Check current conditions before departure</p>
      {error && <p className="text-xs text-blue-500 mt-1">{error}</p>}
    </div>
  );
};

export default UnifiedWeatherWidget;
