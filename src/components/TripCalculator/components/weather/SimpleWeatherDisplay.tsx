
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
  
  // CRITICAL FIX: Explicit live weather detection with detailed logging
  const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;
  
  console.log('🔧 CRITICAL FIX: SimpleWeatherDisplay live detection:', {
    cityName,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    sourceCheck: weather.source === 'live_forecast',
    forecastCheck: weather.isActualForecast === true,
    finalIsLiveForecast: isLiveForecast,
    temperature: weather.temperature,
    timestamp: new Date().toISOString()
  });

  // Force re-render key to ensure fresh display
  const displayKey = `weather-${cityName}-${isLiveForecast ? 'live' : 'historical'}-${Date.now()}`;

  // CRITICAL FIX: Corrected display configuration logic
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

  console.log('🔧 CRITICAL FIX: Display config applied:', {
    cityName,
    isLiveForecast,
    sourceLabel: displayConfig.sourceLabel,
    badgeText: displayConfig.badgeText,
    displayKey
  });

  return (
    <div 
      key={displayKey}
      className={`${displayConfig.backgroundStyle} rounded-lg p-4 border ${displayConfig.borderStyle}`}
    >
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs p-1 rounded z-50">
          {weather.source} | {String(weather.isActualForecast)} | {isLiveForecast ? 'LIVE' : 'HIST'}
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
    </div>
  );
};

export default SimpleWeatherDisplay;
