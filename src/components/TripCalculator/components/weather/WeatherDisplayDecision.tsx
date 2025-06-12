
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
  console.log('🎯 ENHANCED WeatherDisplayDecision for', segmentEndCity, ':', {
    hasWeather: !!weather,
    hasError: !!error
  });

  if (!weather) {
    console.log('❌ ENHANCED WeatherDisplayDecision: No weather data for', segmentEndCity);
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

  // ENHANCED: Ultra-detailed weather data analysis
  console.log('🔍 ULTRA-DETAILED WEATHER ANALYSIS for', segmentEndCity, ':', {
    isActualForecast: weather.isActualForecast,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    temperature: weather.temperature,
    description: weather.description,
    dateMatchInfoSource: weather.dateMatchInfo?.source,
    dateMatchInfoMatchType: weather.dateMatchInfo?.matchType,
    dateMatchInfoConfidence: weather.dateMatchInfo?.confidence,
    precipitationChance: weather.precipitationChance,
    windSpeed: weather.windSpeed,
    humidity: weather.humidity,
    fullWeatherObject: weather
  });

  // FORCE RENDER MODE: Always render if we have any data
  const hasAnyTemperature = !!(weather.temperature || weather.highTemp || weather.lowTemp);
  const hasAnyDescription = !!weather.description;
  const hasAnyWeatherData = hasAnyTemperature || hasAnyDescription;

  console.log('🔧 FORCE RENDER ANALYSIS for', segmentEndCity, ':', {
    hasAnyTemperature,
    hasAnyDescription,
    hasAnyWeatherData,
    FORCING_RENDER: hasAnyWeatherData,
    skipValidation: true
  });

  // FORCE RENDER: If we have ANY weather data, render it
  if (hasAnyWeatherData) {
    console.log('✅ FORCE RENDERING WeatherDataDisplay for', segmentEndCity);
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

  console.log('❌ FALLBACK: No displayable weather data for', segmentEndCity);
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
