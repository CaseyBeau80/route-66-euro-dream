
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { LiveWeatherDetectionService } from './services/LiveWeatherDetectionService';

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
  // UNIFIED: Use the exact same detection logic
  const isLiveForecast = LiveWeatherDetectionService.isLiveWeatherForecast(weather);
  
  console.log('🌤️ UNIFIED: SimpleWeatherDisplay with unified detection:', {
    cityName,
    segmentDate: segmentDate.toISOString(),
    isLiveForecast,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    temperature: weather.temperature,
    unifiedLogic: true
  });

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '⛅';
  };

  // UNIFIED: Use the exact same styling logic
  const containerClass = isLiveForecast 
    ? "bg-green-100 border-green-200"
    : "bg-yellow-100 border-yellow-200";
    
  const badgeClass = isLiveForecast
    ? "bg-green-100 text-green-700 border-green-200"
    : "bg-yellow-100 text-yellow-700 border-yellow-200";

  const sourceLabel = isLiveForecast ? '🟢 Live Weather Forecast' : '🟡 Historical Weather Data';
  const badgeText = isLiveForecast ? '✨ Live weather forecast' : '📊 Historical weather patterns';
  
  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  return (
    <div className={`${containerClass} rounded-lg p-4 border`}>
      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">
          {sourceLabel}
        </span>
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{weatherIcon}</div>
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
        </div>
      </div>

      {/* Weather Details Grid - Wind & Precipitation */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-2 bg-white bg-opacity-50 rounded border">
          <div className="text-lg">💧</div>
          <div className="text-sm font-semibold text-gray-800">
            {weather.precipitationChance || 0}%
          </div>
          <div className="text-xs text-gray-600">Rain</div>
        </div>
        
        <div className="text-center p-2 bg-white bg-opacity-50 rounded border">
          <div className="text-lg">💨</div>
          <div className="text-sm font-semibold text-gray-800">
            {Math.round(weather.windSpeed || 0)} mph
          </div>
          <div className="text-xs text-gray-600">Wind</div>
        </div>
        
        <div className="text-center p-2 bg-white bg-opacity-50 rounded border">
          <div className="text-lg">💦</div>
          <div className="text-sm font-semibold text-gray-800">
            {weather.humidity || 0}%
          </div>
          <div className="text-xs text-gray-600">Humidity</div>
        </div>
      </div>

      {/* Weather Status Badge */}
      <div className="text-center">
        <div className={`inline-block text-xs px-3 py-1 rounded-full font-medium border ${badgeClass}`}>
          {badgeText}
        </div>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
