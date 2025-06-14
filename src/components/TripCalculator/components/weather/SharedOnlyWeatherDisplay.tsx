
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';

interface SharedOnlyWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
}

const SharedOnlyWeatherDisplay: React.FC<SharedOnlyWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName
}) => {
  // EXPLICIT: Force live weather check - make it bulletproof
  const isLiveForecast = weather.source === 'live_forecast' && weather.isActualForecast === true;

  console.log('🔥 SHARED ONLY DISPLAY DEBUG: Detailed check:', {
    cityName,
    weatherSource: weather.source,
    isActualForecast: weather.isActualForecast,
    isLiveForecast,
    temperature: weather.temperature,
    shouldShowGreen: isLiveForecast,
    weatherObject: weather
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
  
  // FORCE GREEN STYLING for live weather
  if (isLiveForecast) {
    console.log('🟢 SHARED ONLY DISPLAY: FORCING GREEN STYLING for', cityName);
    
    return (
      <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 relative">
        {/* Weather Source Indicator */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-green-700">
            🟢 Live Weather Forecast
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
              <div className="text-2xl font-bold text-gray-900">
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
          <span className="inline-block text-xs px-2 py-1 rounded-full font-medium border bg-green-100 text-green-800 border-green-200">
            ✨ Current live forecast
          </span>
        </div>
      </div>
    );
  }

  // Fallback for historical weather
  console.log('🟡 SHARED ONLY DISPLAY: Using historical styling for', cityName);
  
  return (
    <div className="bg-amber-100 border border-amber-200 text-amber-800 rounded-lg p-4 relative">
      {/* Weather Source Indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-amber-700">
          🟡 Historical Weather Data
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
            <div className="text-2xl font-bold text-gray-900">
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
        <span className="inline-block text-xs px-2 py-1 rounded-full font-medium border bg-amber-100 text-amber-800 border-amber-200">
          📊 Based on historical patterns
        </span>
      </div>
    </div>
  );
};

export default SharedOnlyWeatherDisplay;
