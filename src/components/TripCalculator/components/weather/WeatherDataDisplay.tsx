
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import WeatherIcon from './WeatherIcon';

interface WeatherDataDisplayProps {
  weather: ForecastWeatherData | null;
  segmentDate: Date;
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
  console.log('🎯 WeatherDataDisplay: Rendering for', cityName, {
    hasWeather: !!weather,
    weather: weather ? {
      temperature: weather.temperature,
      source: weather.source,
      isActualForecast: weather.isActualForecast
    } : null,
    error,
    isSharedView,
    isPDFExport
  });

  // Show error state with retry option
  if (error && !weather) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-3">
        <div className="text-red-600 text-sm font-medium mb-1">Weather Error</div>
        <div className="text-red-700 text-xs mb-2">{error}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  // Show weather data if available
  if (weather) {
    const isLiveData = weather.isActualForecast && weather.source === 'live_forecast';
    const formattedDate = format(segmentDate, 'EEEE, MMM d');

    return (
      <div className={`rounded-lg p-4 border-2 ${
        isLiveData 
          ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' 
          : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-bold ${
            isLiveData ? 'text-green-800' : 'text-blue-800'
          }`}>
            {isLiveData ? '🟢 Live Weather Forecast' : '🔵 Weather Forecast'}
          </span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        {/* Weather Content */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon iconCode={weather.icon} className="w-8 h-8" />
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {Math.round(weather.temperature)}°F
              </div>
              <div className="text-sm text-gray-600 capitalize">
                {weather.description}
              </div>
            </div>
          </div>

          <div className="text-right">
            {weather.highTemp && weather.lowTemp && (
              <div className="text-sm text-gray-600">
                H: {Math.round(weather.highTemp)}° L: {Math.round(weather.lowTemp)}°
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-2 text-center">
          <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${
            isLiveData 
              ? 'bg-green-100 text-green-800 border-green-300' 
              : 'bg-blue-100 text-blue-800 border-blue-300'
          }`}>
            {isLiveData ? '✨ Current forecast data' : '📊 Weather forecast'}
          </span>
        </div>
      </div>
    );
  }

  // Fallback for no weather data
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
      <div className="text-gray-400 text-2xl mb-1">🌤️</div>
      <p className="text-xs text-gray-600">Weather information not available</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default WeatherDataDisplay;
