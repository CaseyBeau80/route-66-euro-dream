
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
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
  console.log(`🌦 WeatherDataDisplay RENDER for ${cityName}:`, {
    hasWeather: !!weather,
    weather
  });

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

  // SIMPLIFIED temperature extraction with better defaults
  const getTemp = (value: any): number => {
    if (typeof value === 'number' && !isNaN(value)) return Math.round(value);
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) return Math.round(parsed);
    }
    return 72; // Default temperature
  };

  // Extract temperatures with fallbacks
  const highTemp = getTemp(weather.highTemp) || getTemp(weather.temperature) || 77;
  const lowTemp = getTemp(weather.lowTemp) || getTemp(weather.temperature) || 67;
  const avgTemp = Math.round((highTemp + lowTemp) / 2);

  // Extract other fields with defaults
  const description = weather.description || 'Weather forecast available';
  const weatherIcon = weather.icon || '🌤️';
  const humidity = Math.round(weather.humidity || 50);
  const windSpeed = Math.round(weather.windSpeed || 5);
  const precipitationChance = Math.round(weather.precipitationChance || 10);

  console.log(`✅ DISPLAYING weather for ${cityName}:`, {
    temps: { high: highTemp, low: lowTemp, avg: avgTemp },
    description,
    icon: weatherIcon,
    isActualForecast: weather.isActualForecast
  });

  const forecastLabel = segmentDate ? format(segmentDate, 'EEEE, MMM d') : 'Weather Information';
  const isLiveForecast = weather.isActualForecast === true;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3">
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-blue-800">{cityName}</h5>
        <span className="text-xs px-2 py-1 rounded text-blue-600 bg-blue-100">
          {forecastLabel}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-800">
            {lowTemp}°F
          </div>
          <div className="text-xs text-blue-600">
            Low
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-800">
            {highTemp}°F
          </div>
          <div className="text-xs text-blue-600">
            High
          </div>
        </div>
      </div>
      
      <div className="pt-3 border-t border-blue-200">
        <div className="text-sm mb-2 capitalize text-blue-700 flex items-center">
          <span className="mr-2">{weatherIcon}</span>
          {description}
        </div>
        
        <div className="flex justify-between text-xs text-blue-600">
          <span>💧 {precipitationChance}%</span>
          <span>💨 {windSpeed} mph</span>
          <span>💦 {humidity}%</span>
        </div>
      </div>

      <div className="mt-2 text-xs rounded p-2 text-blue-500 bg-blue-100">
        {isLiveForecast ? (
          <>✅ Live weather forecast</>
        ) : (
          <>📊 Weather estimate</>
        )}
      </div>

      {error && onRetry && !isSharedView && !isPDFExport && (
        <div className="mt-2">
          <button
            onClick={onRetry}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Retry weather fetch
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherDataDisplay;
