
import React from 'react';
import { DailySegment } from '../../services/planning/TripPlanBuilder';
import { WeatherUtilityService } from './services/WeatherUtilityService';
import { useUnifiedWeather } from './hooks/useUnifiedWeather';
import WeatherDisplayDecision from './WeatherDisplayDecision';
import { WeatherApiKeyManager } from '@/components/Route66Map/services/weather/WeatherApiKeyManager';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';

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
  const [refreshKey, setRefreshKey] = React.useState(0);

  // Calculate segment date
  const segmentDate = React.useMemo(() => {
    if (tripStartDate) {
      const calculatedDate = WeatherUtilityService.getSegmentDate(tripStartDate, segment.day);
      console.log('🔧 UnifiedWeatherWidget: Calculated segment date:', {
        cityName: segment.endCity,
        tripStartDate: tripStartDate.toISOString(),
        segmentDay: segment.day,
        calculatedDate: calculatedDate?.toISOString()
      });
      return calculatedDate;
    }
    return null;
  }, [tripStartDate, segment.day]);

  // Check API key availability
  const hasApiKey = React.useMemo(() => {
    const keyExists = WeatherApiKeyManager.hasApiKey();
    console.log('🔧 UnifiedWeatherWidget: API key check:', {
      cityName: segment.endCity,
      hasApiKey: keyExists
    });
    return keyExists;
  }, [refreshKey]);

  // Use unified weather hook
  const { weather, loading, error, refetch } = useUnifiedWeather({
    cityName: segment.endCity,
    segmentDate,
    segmentDay: segment.day,
    prioritizeCachedData: false,
    cachedWeather: null
  });

  console.log('🔧 UnifiedWeatherWidget: Render state:', {
    cityName: segment.endCity,
    segmentDay: segment.day,
    hasSegmentDate: !!segmentDate,
    hasApiKey,
    hasWeather: !!weather,
    loading,
    error,
    isSharedView,
    isPDFExport
  });

  const handleRetry = () => {
    console.log('🔄 UnifiedWeatherWidget: Retrying weather fetch for', segment.endCity);
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const handleApiKeySet = () => {
    console.log('🔑 UnifiedWeatherWidget: API key set, refreshing for', segment.endCity);
    setRefreshKey(prev => prev + 1);
  };

  // Show API key input for regular views without API key
  if (!isSharedView && !isPDFExport && !hasApiKey) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-2">
          🌤️ Weather forecast requires an API key
        </div>
        <SimpleWeatherApiKeyInput 
          onApiKeySet={handleApiKeySet}
          cityName={segment.endCity}
        />
      </div>
    );
  }

  // Show loading state
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

  // Show weather if available and we have a valid date
  if (weather && segmentDate) {
    return (
      <WeatherDisplayDecision
        weather={weather}
        segmentDate={segmentDate}
        segmentEndCity={segment.endCity}
        error={error}
        onRetry={handleRetry}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Fallback for shared/PDF views without weather
  if ((isSharedView || isPDFExport) && segmentDate) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-center">
        <div className="text-yellow-600 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-yellow-700 font-medium">Weather forecast temporarily unavailable</p>
        <p className="text-xs text-yellow-600 mt-1">Check current conditions before departure</p>
        {error && <p className="text-xs text-yellow-500 mt-1">{error}</p>}
      </div>
    );
  }

  // Fallback for views without valid date
  if (!segmentDate) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Weather forecast needs trip date</p>
        <p className="text-xs text-amber-600 mt-1">Set a trip start date for accurate forecast</p>
      </div>
    );
  }

  // Final fallback
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available</p>
      <button
        onClick={handleRetry}
        className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
      >
        Retry
      </button>
    </div>
  );
};

export default UnifiedWeatherWidget;
