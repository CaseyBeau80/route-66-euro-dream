
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import WeatherStatusBadge from './WeatherStatusBadge';
import WeatherIcon from './WeatherIcon';
import { useUnits } from '@/contexts/UnitContext';

interface LiveWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date | null;
  daysFromNow: number | null;
}

const LiveWeatherDisplay: React.FC<LiveWeatherDisplayProps> = ({
  weather,
  segmentDate,
  daysFromNow
}) => {
  const { formatSpeed } = useUnits();

  const weatherType = weather.isActualForecast ? 'forecast' : 'current';
  
  const displayDateString = segmentDate ? segmentDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    timeZone: 'UTC'
  }) : '';

  return (
    <div className="space-y-3">
      <WeatherStatusBadge 
        type={weatherType} 
        daysFromNow={daysFromNow || undefined}
      />
      
      {/* Weather Description and Date */}
      <div className="text-center mb-4">
        <div className="font-semibold text-gray-800 capitalize text-sm">{weather.description}</div>
        <div className="text-xs text-gray-600">
          🔹 Forecast for {displayDateString}
        </div>
      </div>

      {/* Enhanced Temperature Layout */}
      {weather.isActualForecast && weather.highTemp !== undefined && weather.lowTemp !== undefined ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-center gap-3 md:gap-4">
            {/* Humidity */}
            {(weather.humidity !== undefined && weather.humidity > 0) || (weather.precipitationChance !== undefined && weather.precipitationChance > 0) ? (
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">💧</span>
                <div className="text-xs font-medium text-blue-600">
                  {weather.precipitationChance !== undefined && weather.precipitationChance > 0 
                    ? `${weather.precipitationChance}%` 
                    : `${weather.humidity}%`}
                </div>
              </div>
            ) : null}
            
            {/* Low Temperature */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-lg font-bold text-blue-600">{weather.lowTemp}°</div>
              <div className="text-xs text-gray-500">Low</div>
            </div>
            
            {/* Weather Icon */}
            <div className="flex flex-col items-center gap-1">
              <WeatherIcon iconCode={weather.icon} description={weather.description} className="h-8 w-8 text-2xl" />
              <div className="text-xs text-gray-500">Now</div>
            </div>
            
            {/* High Temperature */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-lg font-bold text-red-600">{weather.highTemp}°</div>
              <div className="text-xs text-gray-500">High</div>
            </div>
            
            {/* Wind Speed */}
            {weather.windSpeed !== undefined && weather.windSpeed > 0 && (
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg">💨</span>
                <div className="text-xs font-medium text-gray-600">
                  {formatSpeed ? formatSpeed(weather.windSpeed) : `${weather.windSpeed} mph`}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Fallback for current temperature
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-center gap-4 mb-3">
            <WeatherIcon iconCode={weather.icon} description={weather.description} className="h-12 w-12" />
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weather.temperature}°</div>
              <div className="text-xs text-gray-500">Current</div>
            </div>
          </div>
          
          {/* Inline Weather Details */}
          {(weather.humidity || weather.windSpeed || weather.precipitationChance) && (
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
              {weather.precipitationChance !== undefined && weather.precipitationChance > 0 && (
                <div className="flex items-center gap-1">
                  <span>💧</span>
                  <span>{weather.precipitationChance}%</span>
                </div>
              )}
              {!weather.precipitationChance && weather.humidity !== undefined && weather.humidity > 0 && (
                <div className="flex items-center gap-1">
                  <span>💧</span>
                  <span>{weather.humidity}%</span>
                </div>
              )}
              {weather.windSpeed !== undefined && weather.windSpeed > 0 && (
                <div className="flex items-center gap-1">
                  <span>💨</span>
                  <span>{formatSpeed ? formatSpeed(weather.windSpeed) : `${weather.windSpeed} mph`}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!weather.isActualForecast && daysFromNow && daysFromNow <= 5 && (
        <div className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
          ⚠️ Showing current conditions as reference. Actual forecast not available for this date.
        </div>
      )}
    </div>
  );
};

export default LiveWeatherDisplay;
