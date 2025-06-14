
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
  console.log('🔧 FIXED: SegmentWeatherContent with stable shared view logic for', segmentEndCity, {
    hasApiKey,
    loading,
    hasWeather: Boolean(weather),
    weatherSource: weather?.source,
    isActualForecast: weather?.isActualForecast,
    error,
    isSharedView,
    isPDFExport,
    hasSegmentDate: Boolean(segmentDate),
    retryCount
  });

  WeatherDebugService.logComponentRender('SegmentWeatherContent', segmentEndCity, {
    hasApiKey,
    loading,
    hasWeather: Boolean(weather),
    error,
    retryCount,
    segmentDate: segmentDate?.toISOString()
  });

  // Show loading state
  if (loading) {
    console.log('🔄 FIXED: Showing loading state for', segmentEndCity);
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segmentEndCity}...</span>
        </div>
      </div>
    );
  }

  // FIXED: ALWAYS display weather data if available (regardless of view type)
  if (weather) {
    console.log(`✅ FIXED: Displaying weather data for ${segmentEndCity}`, {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      temperature: weather.temperature,
      viewType: isSharedView ? 'shared' : 'regular',
      isLiveForecast: weather.isActualForecast === true && weather.source === 'live_forecast'
    });
    
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

  // For shared views without weather data and no date - show basic message
  if ((isSharedView || isPDFExport) && !segmentDate) {
    console.log(`🚫 FIXED: Shared view without date for ${segmentEndCity}`);
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-2xl mb-1">⛅</div>
        <p className="text-xs text-amber-700 font-medium">Check weather before departure</p>
      </div>
    );
  }

  // FIXED: For shared views with date but no weather - show fallback immediately (NO AUTO-RETRY)
  if ((isSharedView || isPDFExport) && segmentDate && !weather && !loading) {
    console.log(`🌱 FIXED: Shared view showing fallback weather for ${segmentEndCity} - no auto-retry`);
    
    return (
      <SeasonalWeatherFallback 
        segmentDate={segmentDate}
        cityName={segmentEndCity}
        compact={true}
      />
    );
  }

  // Regular view without API key
  if (!hasApiKey && !isSharedView && !isPDFExport) {
    console.log(`🔑 FIXED: Showing API key input for ${segmentEndCity}`);
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

  // Regular view with error or no weather
  console.log(`⚠️ FIXED: Showing error/retry state for ${segmentEndCity}`, {
    error,
    retryCount,
    hasApiKey,
    isSharedView
  });
  
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
