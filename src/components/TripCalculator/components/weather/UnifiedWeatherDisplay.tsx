
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';

interface UnifiedWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
  isSharedView?: boolean;
  isPDFExport?: boolean;
}

const UnifiedWeatherDisplay: React.FC<UnifiedWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName,
  isSharedView = false,
  isPDFExport = false
}) => {
  // Determine if this is live weather data
  const isLiveWeather = weather.source === 'live_forecast' && weather.isActualForecast === true;
  
  console.log('🎯 UNIFIED DISPLAY: Rendering weather for', cityName, {
    source: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveWeather,
    temperature: weather.temperature,
    finalClassification: isLiveWeather ? 'LIVE WEATHER' : 'HISTORICAL DATA'
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

  const weatherIcon = getWeatherIcon(weather.icon);
  const formattedDate = format(segmentDate, 'EEEE, MMM d');
  
  // Style based on whether it's live or historical
  const displayConfig = isLiveWeather ? {
    sourceLabel: '🟢 Live Weather Forecast',
    sourceColor: 'text-green-600',
    badgeText: '✨ Current live forecast',
    badgeStyle: 'bg-green-100 text-green-700 border-green-200',
    containerStyle: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
  } : {
    sourceLabel: '🟡 Historical Weather Data',
    sourceColor: 'text-amber-600', 
    badgeText: '📊 Based on historical patterns',
    badgeStyle: 'bg-amber-100 text-amber-700 border-amber-200',
    containerStyle: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
  };

  return (
    <div className={`${displayConfig.containerStyle} rounded-lg p-4 border relative`}>
      {/* Debug info overlay in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-90 text-white text-xs p-2 rounded z-50">
          <div className="font-bold mb-1">{cityName}</div>
          <div className={`font-bold ${isLiveWeather ? 'text-green-400' : 'text-yellow-400'}`}>
            {isLiveWeather ? '🟢 LIVE WEATHER' : '🟡 HISTORICAL'}
          </div>
          <div>Source: {weather.source}</div>
          <div>Actual: {String(weather.isActualForecast)}</div>
          <div>Temp: {weather.temperature}°F</div>
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
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${displayConfig.badgeStyle}`}>
          {displayConfig.badgeText}
        </span>
      </div>
    </div>
  );
};

export default UnifiedWeatherDisplay;
