
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const SimpleWeatherDisplay: React.FC<SimpleWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  const isLiveWeather = weather.source === 'live_forecast' && weather.isActualForecast === true;
  
  console.log('🌤️ LIVE WEATHER: SimpleWeatherDisplay rendering:', {
    cityName,
    temperature: weather.temperature,
    source: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveWeather,
    description: weather.description
  });

  return (
    <div className="weather-display bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-lg p-4">
      {/* Header with city and date */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">
            {cityName}
          </h4>
          <p className="text-xs text-gray-600">
            {format(segmentDate, 'EEEE, MMM d')}
          </p>
        </div>
        
        {/* Live weather indicator */}
        {isLiveWeather && (
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">LIVE</span>
          </div>
        )}
        
        {/* Fallback weather indicator */}
        {!isLiveWeather && (
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            <span className="text-xs font-medium">ESTIMATE</span>
          </div>
        )}
      </div>

      {/* Main weather info */}
      <div className="flex items-center justify-between">
        {/* Temperature and description */}
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">
              {weather.temperature}°F
            </div>
            {weather.highTemp && weather.lowTemp && (
              <div className="text-xs text-gray-600">
                H: {weather.highTemp}° L: {weather.lowTemp}°
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700 capitalize mb-1">
              {weather.description}
            </div>
            
            {/* Weather details */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              {weather.humidity && (
                <div>💧 {weather.humidity}%</div>
              )}
              {weather.windSpeed && (
                <div>💨 {weather.windSpeed} mph</div>
              )}
              {weather.precipitationChance > 0 && (
                <div>☔ {weather.precipitationChance}%</div>
              )}
            </div>
          </div>
        </div>

        {/* Weather icon */}
        {weather.icon && (
          <div className="text-4xl">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-16 h-16"
              onError={(e) => {
                // Fallback to emoji if icon fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling!.textContent = isLiveWeather ? '🌤️' : '📊';
              }}
            />
            <div className="text-center text-2xl" style={{ display: 'none' }}>🌤️</div>
          </div>
        )}
      </div>

      {/* Source information */}
      <div className="mt-3 pt-2 border-t border-blue-100">
        <div className="text-xs text-gray-500 text-center">
          {isLiveWeather ? (
            <span className="text-green-600 font-medium">
              ✅ Live forecast from OpenWeatherMap
            </span>
          ) : (
            <span className="text-yellow-600">
              📊 Seasonal weather estimate
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
