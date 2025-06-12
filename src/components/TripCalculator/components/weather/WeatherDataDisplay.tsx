
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import FallbackWeatherDisplay from './FallbackWeatherDisplay';

interface WeatherDataDisplayProps {
  weather: ForecastWeatherData | null;
  segmentDate?: Date | null;
  cityName: string;
  error?: string | null;
  onRetry?: () => void;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({ 
  weather, 
  segmentDate,
  cityName,
  error,
  onRetry,
  isSharedView = false,
  isPDFExport = false
}) => {
  console.log('🌤️ WeatherDataDisplay REFACTORED RENDER:', {
    cityName,
    hasWeather: !!weather,
    weatherData: weather
  });

  // If no weather data, show fallback
  if (!weather) {
    console.log(`❌ WeatherDataDisplay: No weather data for ${cityName}`);
    return (
      <FallbackWeatherDisplay
        cityName={cityName}
        segmentDate={segmentDate}
        onRetry={onRetry}
        error={error || 'No weather data'}
        showRetryButton={!isSharedView && !isPDFExport}
      />
    );
  }

  // Use simplified weather display
  return (
    <SimpleWeatherDisplay
      weather={weather}
      segmentDate={segmentDate}
      cityName={cityName}
      isSharedView={isSharedView}
      isPDFExport={isPDFExport}
    />
  );
};

export default WeatherDataDisplay;
