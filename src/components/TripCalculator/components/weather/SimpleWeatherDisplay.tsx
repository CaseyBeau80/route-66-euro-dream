
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from './services/WeatherUtilityService';

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
  // FIXED: Use the working detection logic from shared components
  const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;
  const styling = WeatherUtilityService.getWeatherDisplayStyle(weather, segmentDate);

  console.log('🌤️ FIXED: SimpleWeatherDisplay render:', {
    cityName,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveForecast,
    temperature: weather.temperature,
    styling: styling.sourceLabel
  });

  return (
    <div className={`rounded-lg p-3 border ${styling.containerClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌤️</span>
          <div>
            <h4 className="font-medium text-gray-800 text-sm">
              {cityName}
            </h4>
            <p className="text-xs text-gray-600">
              {segmentDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">
            {weather.temperature}°F
          </div>
          <div className="text-xs text-gray-600">
            {weather.highTemp}° / {weather.lowTemp}°
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
        <div>💨 {weather.windSpeed} mph</div>
        <div>💧 {weather.precipitationChance}%</div>
        <div>💦 {weather.humidity}%</div>
        <div>☁️ {weather.description}</div>
      </div>

      <div className={`text-xs px-2 py-1 rounded border ${styling.badgeClass}`}>
        {styling.sourceLabel}
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
