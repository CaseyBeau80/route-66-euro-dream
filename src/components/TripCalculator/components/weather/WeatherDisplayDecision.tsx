
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherDataDisplay from './WeatherDataDisplay';

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
  console.log('🎯 WeatherDisplayDecision REFACTORED:', {
    city: segmentEndCity,
    hasWeather: !!weather,
    weather
  });

  // Always render WeatherDataDisplay - it will handle fallbacks internally
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
};

export default WeatherDisplayDecision;
