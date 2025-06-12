
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
  console.log(`🌦 WeatherDisplayDecision FORCE RENDER for ${segmentEndCity}:`, {
    hasWeather: !!weather,
    weatherKeys: weather ? Object.keys(weather) : [],
    segmentDate: segmentDate.toISOString()
  });

  // FORCE RENDER: If we have ANY weather object, show it
  if (weather && typeof weather === 'object') {
    console.log(`✅ FORCE RENDERING weather for ${segmentEndCity}`);
    
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

  console.log(`❌ NO WEATHER OBJECT - showing fallback for ${segmentEndCity}`);
  
  return (
    <FallbackWeatherDisplay
      cityName={segmentEndCity}
      segmentDate={segmentDate}
      onRetry={onRetry}
      error={error || 'Weather data unavailable'}
      showRetryButton={!isSharedView && !isPDFExport}
    />
  );
};

export default WeatherDisplayDecision;
