
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
  // COMPREHENSIVE DEBUG LOGGING
  console.log(`🔍 WeatherDisplayDecision DEBUG for ${segmentEndCity}:`, {
    hasWeather: !!weather,
    weather: weather,
    weatherFields: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      icon: weather.icon,
      isActualForecast: weather.isActualForecast,
      cityName: weather.cityName,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      precipitationChance: weather.precipitationChance
    } : null,
    segmentDate: segmentDate.toISOString(),
    hasError: !!error,
    error
  });

  // FORCE RENDER if we have ANY weather object
  if (weather) {
    console.log(`✅ RENDERING WeatherDataDisplay for ${segmentEndCity} with weather data:`, weather);
    
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

  console.log(`❌ NO WEATHER DATA - showing fallback for ${segmentEndCity}`);
  
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
