
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
  console.log('🎯 WeatherDisplayDecision ENHANCED ANALYSIS for', segmentEndCity, ':', {
    hasWeather: !!weather,
    hasError: !!error,
    segmentDate: segmentDate.toISOString(),
    weatherObject: weather,
    detailedWeatherFields: weather ? {
      temperature: { value: weather.temperature, type: typeof weather.temperature, exists: weather.temperature !== undefined && weather.temperature !== null },
      highTemp: { value: weather.highTemp, type: typeof weather.highTemp, exists: weather.highTemp !== undefined && weather.highTemp !== null },
      lowTemp: { value: weather.lowTemp, type: typeof weather.lowTemp, exists: weather.lowTemp !== undefined && weather.lowTemp !== null },
      description: { value: weather.description, type: typeof weather.description, exists: weather.description !== undefined && weather.description !== null && weather.description !== '' },
      isActualForecast: weather.isActualForecast,
      allKeys: Object.keys(weather)
    } : 'NO_WEATHER_OBJECT'
  });

  // ULTRA-PERMISSIVE: If we have ANY weather object, try to display it
  if (weather) {
    console.log('✅ WEATHER DISPLAY DECISION: Weather object exists, attempting to render for', segmentEndCity);
    console.log('📊 Weather data summary:', {
      hasTemperature: !!(weather.temperature !== undefined && weather.temperature !== null),
      hasHighTemp: !!(weather.highTemp !== undefined && weather.highTemp !== null),
      hasLowTemp: !!(weather.lowTemp !== undefined && weather.lowTemp !== null),
      hasDescription: !!(weather.description !== undefined && weather.description !== null && weather.description !== ''),
      temperatureValue: weather.temperature,
      highTempValue: weather.highTemp,
      lowTempValue: weather.lowTemp,
      descriptionValue: weather.description,
      willAttemptRender: true
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

  console.log('❌ WEATHER DISPLAY DECISION: No weather object, showing fallback for', segmentEndCity, {
    reason: 'no_weather_object',
    hasError: !!error,
    errorMessage: error
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
