
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface WeatherFallbackDisplayProps {
  weather: ForecastWeatherData;
  cityName: string;
  showDebugFooter?: boolean;
}

const WeatherFallbackDisplay: React.FC<WeatherFallbackDisplayProps> = ({
  weather,
  cityName,
  showDebugFooter = false
}) => {
  const isLocationError = weather.dateMatchInfo?.source?.includes('location_error');
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-blue-900">{cityName} Weather</h4>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          Historical
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold text-blue-900">
          {Math.round(weather.temperature)}°F
        </div>
        <div className="flex-1">
          <div className="text-sm text-blue-800">{weather.description}</div>
          <div className="text-xs text-blue-600">
            H: {Math.round(weather.highTemp || weather.temperature)}° 
            L: {Math.round(weather.lowTemp || weather.temperature)}°
          </div>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-blue-600 flex items-center gap-2">
        <span>💧 {weather.precipitationChance}%</span>
        <span>💨 {weather.windSpeed} mph</span>
        <span>💧 {weather.humidity}%</span>
      </div>
      
      {showDebugFooter && isLocationError && (
        <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-500">
          source: fallback_historical_due_to_location_error
        </div>
      )}
    </div>
  );
};

export default WeatherFallbackDisplay;
