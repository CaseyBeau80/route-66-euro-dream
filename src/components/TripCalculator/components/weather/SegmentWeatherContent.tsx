
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherDataDisplay from './WeatherDataDisplay';
import WeatherApiKeyInput from './WeatherApiKeyInput';
import ErrorBoundary from '../ErrorBoundary';

interface SegmentWeatherContentProps {
  hasApiKey: boolean;
  loading: boolean;
  weather: ForecastWeatherData | null;
  error: string | null;
  retryCount: number;
  segmentEndCity: string;
  segmentDate: Date | null;
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
  console.log(`🌤️ SegmentWeatherContent: Rendering for ${segmentEndCity}`, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    error,
    retryCount,
    isSharedView,
    isPDFExport,
    segmentDate: segmentDate?.toISOString()
  });

  // Show API key input for non-shared views when no API key
  if (!hasApiKey && !isSharedView && !isPDFExport) {
    return (
      <WeatherApiKeyInput 
        onApiKeySet={onApiKeySet}
        cityName={segmentEndCity}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse text-gray-500 text-sm">
          Loading weather for {segmentEndCity}...
        </div>
      </div>
    );
  }

  // Enhanced logging for PDF exports
  if (isPDFExport && weather) {
    console.log(`📄 PDF WEATHER: Rendering weather content for ${segmentEndCity}`, {
      hasApiKey,
      hasWeather: !!weather,
      isActualForecast: weather.isActualForecast,
      hasDateMatchInfo: !!weather.dateMatchInfo,
      loading,
      error,
      weatherType: weather.isActualForecast ? 'live-forecast' : 'seasonal-fallback'
    });
  }

  return (
    <ErrorBoundary 
      context={`SegmentWeatherContent-${segmentEndCity}`}
      fallbackMessage="Weather information temporarily unavailable"
    >
      <WeatherDataDisplay
        weather={weather}
        segmentDate={segmentDate}
        segmentEndCity={segmentEndCity}
        isSharedView={isSharedView}
        error={error}
        retryCount={retryCount}
        isPDFExport={isPDFExport}
      />
    </ErrorBoundary>
  );
};

export default SegmentWeatherContent;
