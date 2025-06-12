
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
  console.log('🚨 ENHANCED SegmentWeatherContent for', segmentEndCity, ':', {
    segmentDate: segmentDate?.toISOString(),
    hasApiKey,
    loading,
    hasWeather: !!weather,
    hasError: !!error,
    retryCount
  });

  // Enhanced weather data analysis if available
  if (weather) {
    console.log('🔍 ENHANCED Weather data analysis for', segmentEndCity, ':', {
      hasTemperature: !!weather.temperature,
      hasHighTemp: !!weather.highTemp,
      hasLowTemp: !!weather.lowTemp,
      hasDescription: !!weather.description,
      isActualForecast: weather.isActualForecast,
      dateMatchInfo: weather.dateMatchInfo
    });

    // Log the specific fields the user requested
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
        <WeatherDisplayDecision
          weather={weather}
          segmentDate={segmentDate!}
          segmentEndCity={segmentEndCity}
          error={error}
          onRetry={onRetry}
          isSharedView={isSharedView}
          isPDFExport={isPDFExport}
        />
      </WeatherStateHandler>
    </WeatherApiKeyHandler>
  );
};

export default SegmentWeatherContent;
