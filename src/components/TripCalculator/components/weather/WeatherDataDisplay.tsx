
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import SeasonalWeatherFallback from './components/SeasonalWeatherFallback';
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
  console.log('🎯 WeatherDataDisplay rendering for', cityName, {
    hasWeather: !!weather,
    hasSegmentDate: !!segmentDate,
    isSharedView,
    isPDFExport,
    weatherType: weather ? WeatherTypeDetector.detectWeatherType(weather) : null
  });

  // If we have valid weather data, display it
  if (weather && segmentDate) {
    const weatherType = WeatherTypeDetector.detectWeatherType(weather);
    
    // For shared views, if weather is historical/fallback, use our enhanced seasonal display
    if ((isSharedView || isPDFExport) && weatherType.isHistoricalData && !weatherType.isLiveForecast) {
      console.log(`🌱 Using enhanced seasonal display for ${cityName} in shared view`);
      return (
        <SeasonalWeatherFallback 
          segmentDate={segmentDate}
          cityName={cityName}
          compact={true}
        />
      );
    }

    // Use the regular weather display for live forecasts or non-shared views
    return (
      <SimpleWeatherDisplay
        weather={weather}
        segmentDate={segmentDate}
        cityName={cityName}
        isSharedView={isSharedView}
        isPDFExport={isPDFExport}
      />
    );
  }

  // No weather data available
  if (isSharedView || isPDFExport) {
    // For shared views, show seasonal fallback if we have a date
    if (segmentDate) {
      console.log(`🌱 No weather data, showing seasonal fallback for ${cityName} in shared view`);
      return (
        <SeasonalWeatherFallback 
          segmentDate={segmentDate}
          cityName={cityName}
          compact={true}
        />
      );
    }

    // No date available in shared view
    return (
      <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
        <div className="text-gray-400 text-2xl mb-1">🌤️</div>
        <p className="text-xs text-gray-600">Weather information not available</p>
      </div>
    );
  }

  // Regular view - show error state
  return (
    <div className="bg-amber-50 border border-amber-200 rounded p-3">
      <div className="text-amber-800 text-sm">
        Weather information temporarily unavailable
      </div>
      {error && (
        <div className="text-xs text-amber-600 mt-1">{error}</div>
      )}
      <div className="mt-2 text-center">
        <button
          onClick={onRetry}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default WeatherDataDisplay;
