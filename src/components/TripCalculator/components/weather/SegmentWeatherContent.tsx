
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherApiKeyInput from '@/components/Route66Map/components/weather/SimpleWeatherApiKeyInput';
import WeatherDataDisplay from './WeatherDataDisplay';
import { WeatherDebugService } from './services/WeatherDebugService';
import { WeatherTypeDetector } from './utils/WeatherTypeDetector';

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
  console.log('🌤️ SegmentWeatherContent render for', segmentEndCity, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    error,
    retryCount,
    isSharedView,
    isPDFExport,
    weatherData: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      isActualForecast: weather.isActualForecast
    } : null
  });

  WeatherDebugService.logComponentRender('SegmentWeatherContent', segmentEndCity, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    error,
    retryCount,
    segmentDate: segmentDate?.toISOString()
  });

  // For shared views, show a different message when no API key is available
  if (!hasApiKey) {
    if (isSharedView || isPDFExport) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-center">
            <div className="text-blue-600 text-sm font-medium mb-2">
              🌤️ Weather Information
            </div>
            <div className="text-blue-700 text-sm">
              Current weather conditions for {segmentEndCity}
            </div>
            <div className="text-xs text-blue-600 mt-2">
              Live weather forecasts are available when viewing this trip with an API key configured.
            </div>
          </div>
        </div>
      );
    }

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

  return (
    <div className="space-y-3">
      <WeatherDataDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={segmentEndCity}
        error={error}
        onRetry={onRetry}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />

      {/* Retry section for errors - hide in shared/PDF views */}
      {error && retryCount < 3 && !isSharedView && !isPDFExport && (
        <div className="mt-2 text-center">
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
