
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
  // IMPROVED: Enhanced date range calculation with better timezone handling
  const today = new Date()
  const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const normalizedSegmentDate = new Date(segmentDate.getFullYear(), segmentDate.getMonth(), segmentDate.getDate())
  const daysFromToday = Math.ceil((normalizedSegmentDate.getTime() - normalizedToday.getTime()) / (24 * 60 * 60 * 1000))
  const isWithinReliableRange = daysFromToday >= 0 && daysFromToday <= 5
  
  // IMPROVED: Enhanced live weather detection that matches Edge Function logic
  const isLiveWeather = weather.source === 'live_forecast' && 
                       weather.isActualForecast === true && 
                       isWithinReliableRange
  
  console.log('🌤️ IMPROVED: SimpleWeatherDisplay with enhanced validation:', {
    cityName,
    segmentDate: segmentDate.toISOString(),
    segmentDateLocal: segmentDate.toLocaleDateString(),
    normalizedToday: normalizedToday.toISOString(),
    normalizedSegmentDate: normalizedSegmentDate.toISOString(),
    daysFromToday,
    isWithinReliableRange,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    finalIsLiveWeather: isLiveWeather,
    temperature: weather.temperature,
    description: weather.description,
    improvedValidation: true,
    validationResult: isLiveWeather ? 'LIVE_FORECAST' : 'ESTIMATED_FORECAST',
    shouldShowLive: daysFromToday >= 0 && daysFromToday <= 5 ? 'YES' : 'NO'
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
        
        {/* IMPROVED: Live weather indicator with enhanced conditions */}
        {isLiveWeather && (
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">LIVE</span>
          </div>
        )}
        
        {/* IMPROVED: Estimated forecast indicator with better conditions */}
        {!isLiveWeather && isWithinReliableRange && weather.source === 'live_forecast' && (
          <div className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            <span className="text-xs font-medium">ESTIMATED</span>
          </div>
        )}
        
        {/* IMPROVED: Seasonal forecast indicator for dates outside reliable range */}
        {!isWithinReliableRange && (
          <div className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            <span className="text-xs font-medium">SEASONAL</span>
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

      {/* IMPROVED: Source information with enhanced explanations */}
      <div className="mt-3 pt-2 border-t border-blue-100">
        <div className="text-xs text-gray-500 text-center">
          {isLiveWeather ? (
            <div className="text-green-600 font-medium">
              ✅ Live forecast from OpenWeatherMap
              <div className="text-xs text-gray-500 mt-1">
                Real-time weather data for {cityName}
              </div>
            </div>
          ) : isWithinReliableRange ? (
            <div className="text-amber-600">
              🔮 Estimated forecast
              <div className="text-xs text-gray-500 mt-1">
                Based on weather patterns for {cityName}
              </div>
            </div>
          ) : (
            <div className="text-gray-600">
              📊 Seasonal weather estimate
              <div className="text-xs text-gray-500 mt-1">
                Long-range forecasts (6+ days) are seasonal estimates
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
