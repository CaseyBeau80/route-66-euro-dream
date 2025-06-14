
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
  
  // Determine if this is live forecast data
  const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;
  
  console.log('🌤️ SimpleWeatherDisplay render:', {
    cityName,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveForecast,
    temperature: weather.temperature
  });

  return (
    <div className={`rounded-lg p-4 border-2 ${
      isLiveForecast 
        ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' 
        : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-bold ${
          isLiveForecast ? 'text-green-800' : 'text-blue-800'
        }`}>
          {isLiveForecast ? '🟢 Live Weather Forecast' : '🔵 Weather Forecast'}
        </span>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      {/* Weather Content */}
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

      {/* Status Badge */}
      <div className="mt-2 text-center">
        <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium border ${
          isLiveForecast 
            ? 'bg-green-100 text-green-800 border-green-300' 
            : 'bg-blue-100 text-blue-800 border-blue-300'
        }`}>
          {isLiveForecast ? '✨ Current forecast data' : '📊 Weather forecast'}
        </span>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
