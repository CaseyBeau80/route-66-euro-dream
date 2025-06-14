
import React from 'react';
import { format } from 'date-fns';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface SerializedWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date;
  cityName: string;
}

const SerializedWeatherDisplay: React.FC<SerializedWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName
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
  const formattedDate = segmentDate ? format(segmentDate, 'EEEE, MMM d') : '';

  // Determine if this is live or historical data
  const isLiveData = weather.isActualForecast || weather.source === 'live_forecast';

  return (
    <div className={`rounded-lg p-4 border-2 ${
      isLiveData 
        ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' 
        : 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-bold ${
          isLiveData ? 'text-green-800' : 'text-amber-800'
        }`}>
          {isLiveData ? '🟢 Live Weather Forecast' : '🟡 Historical Weather Data'}
        </span>
        {formattedDate && (
          <span className="text-xs text-gray-500">{formattedDate}</span>
        )}
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
          isLiveData 
            ? 'bg-green-100 text-green-800 border-green-300' 
            : 'bg-amber-100 text-amber-800 border-amber-300'
        }`}>
          {isLiveData ? '✨ Live forecast data' : '📊 Historical weather pattern'}
        </span>
      </div>
    </div>
  );
};

export default SerializedWeatherDisplay;
