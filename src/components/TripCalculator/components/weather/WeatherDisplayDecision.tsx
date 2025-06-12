
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherDataDisplay from './WeatherDataDisplay';
import FallbackWeatherDisplay from './FallbackWeatherDisplay';

interface WeatherDisplayDecisionProps {
  weather: ForecastWeatherData | null;
  segmentDate: Date | null;
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
  console.log(`🌦 WeatherDisplayDecision ENHANCED LOGIC for ${segmentEndCity}:`, {
    hasWeather: !!weather,
    hasSegmentDate: !!segmentDate,
    weatherKeys: weather ? Object.keys(weather) : [],
    segmentDate: segmentDate?.toISOString(),
    decision: 'Will evaluate based on weather data availability'
  });

  // ENHANCED: Handle missing segmentDate more gracefully
  if (!segmentDate) {
    console.log(`⚠️ Missing segment date for ${segmentEndCity} - showing informational fallback`);
    return (
      <FallbackWeatherDisplay
        cityName={segmentEndCity}
        segmentDate={null}
        onRetry={onRetry}
        error="Set a trip start date to see weather forecasts"
        showRetryButton={false}
      />
    );
  }

  // ENHANCED: More permissive weather data validation
  if (weather && typeof weather === 'object') {
    // Check if we have any meaningful weather data
    const hasTemperatureData = weather.temperature !== undefined || 
                              weather.highTemp !== undefined || 
                              weather.lowTemp !== undefined;
    
    const hasDescriptiveData = weather.description || 
                              weather.icon;
    
    const hasAnyUsefulData = hasTemperatureData || hasDescriptiveData || weather.isActualForecast;
    
    if (hasAnyUsefulData) {
      console.log(`✅ ENHANCED VALIDATION PASSED for ${segmentEndCity}:`, {
        hasTemperatureData,
        hasDescriptiveData,
        isActualForecast: weather.isActualForecast,
        decision: 'showing_weather_display'
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
  }

  console.log(`❌ NO VALID WEATHER DATA - showing fallback for ${segmentEndCity}`, {
    hasWeather: !!weather,
    weatherType: typeof weather,
    hasSegmentDate: !!segmentDate
  });
  
  return (
    <FallbackWeatherDisplay
      cityName={segmentEndCity}
      segmentDate={segmentDate}
      onRetry={onRetry}
      error={error || 'Weather data temporarily unavailable'}
      showRetryButton={!isSharedView && !isPDFExport}
    />
  );
};

export default WeatherDisplayDecision;
