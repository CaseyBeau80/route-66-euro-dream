
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
  // ENHANCED DEBUG LOGGING for June 12 issue
  console.log(`🌦 WeatherDisplayDecision FORECAST DEBUG for ${segmentEndCity}:`, {
    hasWeather: !!weather,
    segmentDate: segmentDate.toISOString(),
    forecastObject: weather,
    specificFields: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      icon: weather.icon,
      isActualForecast: weather.isActualForecast,
      cityName: weather.cityName
    } : null,
    hasError: !!error,
    error,
    isJune12Debug: segmentDate.toDateString().includes('Jun 12')
  });

  // Check if we have ANY displayable weather data
  const hasDisplayableData = weather && (
    weather.temperature !== undefined ||
    weather.highTemp !== undefined ||
    weather.lowTemp !== undefined ||
    weather.description ||
    weather.icon
  );

  if (hasDisplayableData) {
    console.log(`✅ RENDERING WeatherDataDisplay for ${segmentEndCity} - has displayable data:`, {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      icon: weather.icon,
      isActualForecast: weather.isActualForecast
    });
    
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

  console.log(`❌ NO DISPLAYABLE DATA - showing fallback for ${segmentEndCity}:`, {
    hasWeather: !!weather,
    weatherFields: weather ? Object.keys(weather) : [],
    reason: 'no_displayable_fields'
  });
  
  return (
    <FallbackWeatherDisplay
      cityName={segmentEndCity}
      segmentDate={segmentDate}
      onRetry={onRetry}
      error={error || 'Weather data incomplete'}
      showRetryButton={!isSharedView && !isPDFExport}
    />
  );
};

export default WeatherDisplayDecision;
