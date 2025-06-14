
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';
import { WeatherLabelService } from './services/WeatherLabelService';

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

  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');
  
  // CRITICAL FIX: Use centralized styling service
  const styling = WeatherLabelService.getWeatherStyling(weather);
  
  console.log('🔧 CENTRALIZED FIX: SimpleWeatherDisplay using centralized styling for', cityName, {
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    centralizedIsLive: styling.isLive,
    centralizedLabel: styling.sourceLabel,
    temperature: weather.temperature,
    centralizedStyling: true
  });

  return (
    <div className={`${styling.containerStyle} rounded-lg p-4 border relative`}>
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs p-1 rounded z-50">
          <div className="font-bold">{cityName}</div>
          <div className={`font-bold ${styling.isLive ? 'text-green-400' : 'text-yellow-400'}`}>
            {styling.isLive ? '🟢 CENTRALIZED: LIVE' : '🟡 CENTRALIZED: HISTORICAL'}
          </div>
          <div>Source: {weather.source}</div>
          <div>Actual: {String(weather.isActualForecast)}</div>
          <div>Temp: {weather.temperature}°F</div>
        </div>
      )}

      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium ${styling.sourceColor}`}>
          {styling.sourceLabel}
        </span>
        <span className="text-xs text-gray-500">
          {formattedDate}
        </span>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between">
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
          <div className="text-xs text-gray-500 mt-1">
            💧 {weather.precipitationChance}% • 💨 {weather.windSpeed} mph
          </div>
        </div>
      </div>

      {/* Weather Status Badge */}
      <div className="mt-2 text-center">
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${styling.badgeStyle}`}>
          {styling.badgeText}
        </span>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
