
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
  
  // CRITICAL FIX: Use centralized weather label service instead of local logic
  const isLiveForecast = WeatherLabelService.isLiveWeatherData(weather);
  const sourceLabel = WeatherLabelService.getWeatherSourceLabel(weather);
  const liveForecastIndicator = WeatherLabelService.getLiveForecastIndicator(weather);
  
  console.log('🔧 CENTRALIZED FIX: SimpleWeatherDisplay using WeatherLabelService for', cityName, {
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    centralizedIsLive: isLiveForecast,
    centralizedLabel: sourceLabel,
    temperature: weather.temperature,
    centralizedService: true
  });

  // CRITICAL FIX: Use centralized styling based on centralized detection
  const displayConfig = isLiveForecast ? {
    sourceLabel: '🟢 Live Weather Forecast',
    sourceColor: 'text-green-600',
    badgeText: '✨ Current live forecast',
    badgeStyle: 'bg-green-100 text-green-700',
    backgroundStyle: 'bg-gradient-to-br from-green-50 to-green-100',
    borderStyle: 'border-green-200'
  } : {
    sourceLabel: '🟡 Historical Weather Data',
    sourceColor: 'text-amber-600',
    badgeText: '📊 Based on historical patterns',
    badgeStyle: 'bg-amber-100 text-amber-700',
    backgroundStyle: 'bg-gradient-to-br from-blue-50 to-blue-100',
    borderStyle: 'border-blue-200'
  };

  console.log('🔧 CENTRALIZED FIX: Display config for', cityName, {
    isLiveForecast,
    sourceLabel: displayConfig.sourceLabel,
    badgeText: displayConfig.badgeText,
    centralizedStyling: true
  });

  return (
    <div 
      className={`${displayConfig.backgroundStyle} rounded-lg p-4 border ${displayConfig.borderStyle}`}
    >
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs p-1 rounded z-50">
          {weather.source} | {String(weather.isActualForecast)} | {isLiveForecast ? 'LIVE' : 'HIST'} | CENTRALIZED
        </div>
      )}

      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium ${displayConfig.sourceColor}`}>
          {displayConfig.sourceLabel}
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
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${displayConfig.badgeStyle}`}>
          {displayConfig.badgeText}
        </span>
      </div>

      {/* Live forecast indicator if available */}
      {liveForecastIndicator && (
        <div className="mt-1 text-center">
          <span className="text-xs text-green-600 font-medium">
            {liveForecastIndicator}
          </span>
        </div>
      )}
    </div>
  );
};

export default SimpleWeatherDisplay;
