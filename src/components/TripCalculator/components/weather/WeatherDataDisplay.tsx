
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import WeatherDisplayDecision from './WeatherDisplayDecision';
import { WeatherTypeDetector } from './utils/WeatherTypeDetector';

interface WeatherDataDisplayProps {
  weather: ForecastWeatherData | null;
  segmentDate?: Date | null;
  cityName: string;
  error: string | null;
  onRetry: () => void;
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
  console.log('🎯 WeatherDataDisplay: Enhanced component render:', {
    city: cityName,
    hasWeather: !!weather,
    weather: weather ? {
      source: weather.source,
      isActualForecast: weather.isActualForecast,
      hasTemperature: !!(weather.temperature || weather.highTemp || weather.lowTemp)
    } : null,
    segmentDate: segmentDate?.toISOString(),
    error,
    isSharedView,
    isPDFExport
  });

  // FIXED: Always validate weather type consistency using centralized detector
  if (weather && segmentDate) {
    WeatherTypeDetector.validateWeatherTypeConsistency(weather, `WeatherDataDisplay-${cityName}`, segmentDate);
  }

  // Show error state if no weather and there's an error
  if (!weather && error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-800 font-medium mb-2">
          Weather data unavailable
        </div>
        <div className="text-sm text-red-600 mb-3">
          {error}
        </div>
        {!isSharedView && !isPDFExport && (
          <button
            onClick={onRetry}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  // Show placeholder if no weather data
  if (!weather) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <div className="text-gray-600 font-medium mb-2">
          Weather forecast
        </div>
        <div className="text-sm text-gray-500">
          Weather information for {cityName}
        </div>
      </div>
    );
  }

  // FIXED: Use centralized decision logic and pass segmentDate consistently
  if (segmentDate) {
    return (
      <WeatherDisplayDecision
        weather={weather}
        segmentDate={segmentDate}
        segmentEndCity={cityName}
        error={error}
        onRetry={onRetry}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // Fallback to simple display without date
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
