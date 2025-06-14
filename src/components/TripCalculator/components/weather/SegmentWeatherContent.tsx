
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';
import WeatherDataDisplay from './WeatherDataDisplay';
import SeasonalWeatherFallback from './components/SeasonalWeatherFallback';
import { WeatherDebugService } from './services/WeatherDebugService';

interface SegmentWeatherContentProps {
  hasApiKey: boolean;
  loading: boolean;
  weather: ForecastWeatherData | null;
  error: string | null;
  retryCount: number;
  segmentEndCity: string;
  segmentDate?: Date | null;
  onApiKeySet: () => void;
  onTimeout: () => void;
  onRetry: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SegmentWeatherContent: React.FC<SegmentWeatherContentProps> = ({
  hasApiKey,
  loading,
  weather,
  error,
  retryCount,
  segmentEndCity,
  segmentDate,
  onApiKeySet,
  onTimeout,
  onRetry,
  isSharedView = false,
  isPDFExport = false
}) => {
  // PLAN IMPLEMENTATION: Enhanced logging for weather data flow
  console.log('🌤️ PLAN: SegmentWeatherContent enhanced flow analysis for', segmentEndCity, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    weatherType: weather ? (weather.isActualForecast ? 'LIVE_FORECAST' : 'HISTORICAL') : 'NONE',
    error,
    isSharedView,
    isPDFExport,
    hasSegmentDate: !!segmentDate,
    retryCount,
    planImplementation: 'enhanced_logging_and_flow_control'
  });

  if (weather) {
    console.log('🌤️ PLAN: Weather data details for', segmentEndCity, {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      isActualForecast: weather.isActualForecast,
      source: weather.source,
      matchedForecastDay: !!weather.matchedForecastDay,
      planImplementation: 'weather_data_inspection'
    });
  }

  WeatherDebugService.logComponentRender('SegmentWeatherContent', segmentEndCity, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    error,
    retryCount,
    segmentDate: segmentDate?.toISOString()
  });

  // PLAN IMPLEMENTATION: Show loading state first - no changes to this logic
  if (loading) {
    console.log('🌤️ PLAN: Showing loading state for', segmentEndCity);
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segmentEndCity}...</span>
        </div>
      </div>
    );
  }

  // PLAN IMPLEMENTATION: If we have weather data, ALWAYS display it (highest priority)
  if (weather) {
    console.log(`🎯 PLAN: Using actual weather data for ${segmentEndCity} - PRIORITY DISPLAY`);
    return (
      <WeatherDataDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={segmentEndCity}
        error={error}
        onRetry={onRetry}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // PLAN IMPLEMENTATION: Enhanced shared view logic - prevent premature exits
  if (isSharedView || isPDFExport) {
    console.log(`🌱 PLAN: Shared view handling for ${segmentEndCity}`, {
      hasSegmentDate: !!segmentDate,
      hasApiKey,
      weatherFetchAttempted: !loading,
      willShowSeasonalFallback: !!segmentDate,
      planImplementation: 'enhanced_shared_view_logic'
    });

    // PLAN: For shared views, show seasonal fallback if we have a date but no weather
    if (segmentDate) {
      console.log(`🌱 PLAN: Using seasonal fallback for ${segmentEndCity} in shared view`);
      return (
        <SeasonalWeatherFallback 
          segmentDate={segmentDate}
          cityName={segmentEndCity}
          compact={true}
        />
      );
    }

    // PLAN: Only show "not available" if we absolutely have no date
    console.log(`🚫 PLAN: No date available for ${segmentEndCity} in shared view`);
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
        <div className="text-gray-400 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-gray-600">Weather information not available</p>
      </div>
    );
  }

  // For regular views without API key, show the API key input
  if (!hasApiKey && !isSharedView && !isPDFExport) {
    console.log(`🔑 PLAN: Showing API key input for ${segmentEndCity} in regular view`);
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600 mb-2">
          Weather forecast requires an API key
        </div>
        <SimpleWeatherApiKeyInput 
          onApiKeySet={onApiKeySet}
          cityName={segmentEndCity}
        />
      </div>
    );
  }

  // Regular view with error - show retry option
  console.log(`⚠️ PLAN: Showing error state for ${segmentEndCity} in regular view`);
  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded p-3">
        <div className="text-amber-800 text-sm">
          Weather information temporarily unavailable
        </div>
        {error && (
          <div className="text-xs text-amber-600 mt-1">{error}</div>
        )}
      </div>

      {retryCount < 3 && !isSharedView && !isPDFExport && (
        <div className="text-center">
          <button
            onClick={onRetry}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Retry weather fetch
          </button>
        </div>
      )}
    </div>
  );
};

export default SegmentWeatherContent;
