
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
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
  // Use utility service to determine if this is a live forecast
  const isLiveForecast = WeatherUtilityService.isLiveForecast(weather, segmentDate);
  const daysFromToday = WeatherUtilityService.getDaysFromToday(segmentDate);
  
  console.log('🌤️ CONSISTENT: SimpleWeatherDisplay with consistent weather details:', {
    cityName,
    segmentDate: segmentDate.toISOString(),
    daysFromToday,
    isLiveForecast,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp,
    windSpeed: weather.windSpeed,
    precipitationChance: weather.precipitationChance,
    humidity: weather.humidity,
    consistentDisplay: true
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

  // Get styling configuration based on forecast type
  const styleConfig = WeatherUtilityService.getWeatherDisplayStyle(weather, segmentDate);
  
  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');

  return (
    <div className={`${styleConfig.containerClass} rounded-lg p-4 border`}>
      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">
          {styleConfig.sourceLabel}
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

      {/* CONSISTENT Weather Details Grid - Wind & Precipitation */}
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
        <div className={`inline-block text-xs px-3 py-1 rounded-full font-medium border ${styleConfig.badgeClass}`}>
          {styleConfig.badgeText}
        </div>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
