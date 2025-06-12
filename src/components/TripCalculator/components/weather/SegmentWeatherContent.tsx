
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherApiKeyHandler from './WeatherApiKeyHandler';
import WeatherStateHandler from './WeatherStateHandler';
import WeatherDisplayDecision from './WeatherDisplayDecision';
import MissingDateError from './components/MissingDateError';
import { WeatherDebugService } from './services/WeatherDebugService';

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
  // Debug logging for component render
  WeatherDebugService.logComponentRender('SegmentWeatherContent', segmentEndCity, {
    hasApiKey,
    loading,
    hasWeather: !!weather,
    error,
    retryCount,
    segmentDate: segmentDate?.toISOString(),
    isSharedView,
    isPDFExport
  });

  // Log weather data details
  if (weather) {
    WeatherDebugService.logWeatherFlow(`SegmentWeatherContent.weatherData [${segmentEndCity}]`, {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      isActualForecast: weather.isActualForecast,
      description: weather.description,
      source: weather.dateMatchInfo?.source
    });
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
        {segmentDate ? (
          <WeatherDisplayDecision
            weather={weather}
            segmentDate={segmentDate}
            segmentEndCity={segmentEndCity}
            error={error}
            onRetry={onRetry}
            isSharedView={isSharedView}
            isPDFExport={isPDFExport}
          />
        ) : (
          <MissingDateError cityName={segmentEndCity} />
        )}
      </WeatherStateHandler>
    </WeatherApiKeyHandler>
  );
};

export default SegmentWeatherContent;
