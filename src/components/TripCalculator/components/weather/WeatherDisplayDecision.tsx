
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
  console.log('🎯 WeatherDisplayDecision CRITICAL ANALYSIS for', segmentEndCity, ':', {
    hasWeather: !!weather,
    hasError: !!error,
    hasAnyDisplayableData: weather && (weather.temperature || weather.highTemp || weather.lowTemp || weather.description),
    weatherFields: weather ? {
      temperature: weather.temperature,
      highTemp: weather.highTemp,
      lowTemp: weather.lowTemp,
      description: weather.description,
      isActualForecast: weather.isActualForecast
    } : null,
    decision: 'Will determine...'
  });

  // CRITICAL FIX: Always try to display weather if we have ANY usable data
  if (weather) {
    const hasDisplayableData = !!(
      weather.temperature || 
      weather.highTemp || 
      weather.lowTemp || 
      weather.description
    );

    if (hasDisplayableData) {
      console.log('✅ WEATHER DISPLAY DECISION: Rendering weather data for', segmentEndCity);
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
    } else {
      console.log('⚠️ Weather data exists but no displayable fields for', segmentEndCity);
    }
  }

  console.log('❌ WEATHER DISPLAY DECISION: Showing fallback for', segmentEndCity, {
    reason: !weather ? 'no_weather_data' : 'no_displayable_fields'
  });

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
