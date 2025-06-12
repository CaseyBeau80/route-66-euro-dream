
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherApiKeyHandler from './WeatherApiKeyHandler';
import WeatherStateHandler from './WeatherStateHandler';
import WeatherDisplayDecision from './WeatherDisplayDecision';
import { WeatherDataDebugger } from './WeatherDataDebugger';

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
  console.log('🚨 CRITICAL SegmentWeatherContent ANALYSIS for', segmentEndCity, ':', {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    hasError: !!error,
    hasSegmentDate: !!segmentDate,
    segmentDate: segmentDate?.toISOString(),
    retryCount,
    weatherSummary: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      isActualForecast: weather.isActualForecast
    } : null
  });

  // Enhanced weather data analysis if available
  if (weather) {
    WeatherDataDebugger.debugWeatherFieldsForUser(segmentEndCity, weather, 'SEGMENT_CONTENT');
  }

  return (
    <WeatherApiKeyHandler
      hasApiKey={hasApiKey}
      segmentEndCity={segmentEndCity}
      onApiKeySet={onApiKeySet}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    >
      <WeatherStateHandler
        loading={loading}
        retryCount={retryCount}
        error={error}
        segmentEndCity={segmentEndCity}
        segmentDate={segmentDate}
        onRetry={onRetry}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      >
        {segmentDate && (
          <WeatherDisplayDecision
            weather={weather}
            segmentDate={segmentDate}
            segmentEndCity={segmentEndCity}
            error={error}
            onRetry={onRetry}
            isSharedView={isSharedView}
            isPDFExport={isPDFExport}
          />
        )}
      </WeatherStateHandler>
    </WeatherApiKeyHandler>
  );
};

export default SegmentWeatherContent;
