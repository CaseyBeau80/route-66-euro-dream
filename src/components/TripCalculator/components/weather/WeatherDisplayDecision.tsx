
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
    hasError: !!error,
    weatherObject: weather
  });

  // CRITICAL FIX: Add detailed forecast object logging
  console.log('📦 Forecast object for', segmentEndCity, ':', {
    fullWeatherObject: weather,
    temperature: weather?.temperature,
    highTemp: weather?.highTemp,
    lowTemp: weather?.lowTemp,
    description: weather?.description,
    icon: weather?.icon,
    humidity: weather?.humidity,
    windSpeed: weather?.windSpeed,
    precipitationChance: weather?.precipitationChance,
    isActualForecast: weather?.isActualForecast,
    dateMatchInfo: weather?.dateMatchInfo
  });

  // CRITICAL FIX: Always render if we have ANY weather object, regardless of missing fields
  if (weather) {
    console.log('✅ FORCING RENDER: Weather object exists for', segmentEndCity, ', rendering WeatherDataDisplay with fault tolerance');
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

  // Only show fallback if we have no weather data at all
  console.log('❌ FALLBACK: No weather object for', segmentEndCity, ', showing fallback');
  return (
    <FallbackWeatherDisplay
      cityName={segmentEndCity}
      segmentDate={segmentDate}
      onRetry={onRetry}
      error={error || 'No weather data available'}
      showRetryButton={!isSharedView && !isPDFExport}
    />
  );
};

export default WeatherDisplayDecision;
