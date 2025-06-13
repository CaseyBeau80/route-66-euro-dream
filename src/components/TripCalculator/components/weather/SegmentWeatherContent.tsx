
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
  console.log('🌤️ SegmentWeatherContent FIXED VERSION for', segmentEndCity, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    error,
    retryCount,
    isSharedView,
    isPDFExport,
    hasSegmentDate: !!segmentDate
  });

  WeatherDebugService.logComponentRender('SegmentWeatherContent', segmentEndCity, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    error,
    retryCount,
    segmentDate: segmentDate?.toISOString()
  });

  // FIXED: For shared views, still try to fetch weather if API key exists
  // Only fall back to seasonal if no API key AND no weather data
  if ((isSharedView || isPDFExport) && !hasApiKey && !weather && !loading) {
    if (segmentDate) {
      console.log(`🌱 No API key in shared view - showing seasonal fallback for ${segmentEndCity}`);
      return (
        <SeasonalWeatherFallback 
          segmentDate={segmentDate}
          cityName={segmentEndCity}
          compact={true}
        />
      );
    }
    
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
        <div className="text-gray-400 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-gray-600">Weather information not available</p>
      </div>
    );
  }

  // For regular views without API key, show the API key input
  if (!hasApiKey && !isSharedView && !isPDFExport) {
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

  // Show loading state
  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Loading weather for {segmentEndCity}...</span>
        </div>
      </div>
    );
  }

  // If we have weather data, display it
  if (weather) {
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

  // FIXED: Only show seasonal fallback as last resort in shared views
  if ((isSharedView || isPDFExport) && segmentDate) {
    console.log(`🌱 Final fallback - showing seasonal fallback for ${segmentEndCity} in shared view`);
    return (
      <SeasonalWeatherFallback 
        segmentDate={segmentDate}
        cityName={segmentEndCity}
        compact={true}
      />
    );
  }

  // Regular view with error - show retry option
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
