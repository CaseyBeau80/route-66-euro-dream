
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherDataDisplay from './WeatherDataDisplay';
import FallbackWeatherDisplay from './FallbackWeatherDisplay';

interface WeatherDisplayDecisionProps {
  weather: ForecastWeatherData | null;
  segmentDate: Date;
  segmentEndCity: string;
  error: string | null;
  onRetry: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const WeatherDisplayDecision: React.FC<WeatherDisplayDecisionProps> = ({
  weather,
  segmentDate,
  segmentEndCity,
  error,
  onRetry,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🎯 WeatherDisplayDecision for', segmentEndCity, ':', {
    hasWeather: !!weather,
    hasError: !!error
  });

  if (!weather) {
    return (
      <FallbackWeatherDisplay
        cityName={segmentEndCity}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error={error || 'No weather data available'}
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // Check for any displayable data
  const hasAnyTemperature = !!(weather.temperature || weather.highTemp || weather.lowTemp);
  const hasAnyDescription = !!weather.description;
  const hasMinimalData = hasAnyTemperature || hasAnyDescription;

  console.log('🔍 Weather data check for', segmentEndCity, ':', {
    hasAnyTemperature,
    hasAnyDescription,
    hasMinimalData
  });

  if (hasMinimalData) {
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

  return (
    <FallbackWeatherDisplay
      cityName={segmentEndCity}
      segmentDate={segmentDate}
      onRetry={onRetry}
      error="Weather data incomplete"
      showRetryButton={!isSharedView && !isPDFExport}
    />
  );
};

export default WeatherDisplayDecision;
