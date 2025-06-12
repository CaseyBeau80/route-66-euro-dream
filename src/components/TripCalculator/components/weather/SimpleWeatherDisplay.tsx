
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { format } from 'date-fns';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate?: Date | null;
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
  console.log('🌤️ SimpleWeatherDisplay RENDER:', {
    cityName,
    weather,
    hasTemperature: !!(weather.temperature || weather.highTemp || weather.lowTemp),
    temperature: weather.temperature,
    highTemp: weather.highTemp,
    lowTemp: weather.lowTemp
  });

  // Extract temperature with simple fallback logic
  const getTemperatureData = () => {
    // Priority: highTemp/lowTemp > temperature > fallback
    let high = 75;
    let low = 55;
    let current = 65;

    if (weather.highTemp !== undefined && weather.lowTemp !== undefined) {
      high = Math.round(weather.highTemp);
      low = Math.round(weather.lowTemp);
      current = Math.round((high + low) / 2);
    } else if (weather.temperature !== undefined) {
      current = Math.round(weather.temperature);
      high = current + 10;
      low = current - 10;
    }

    return { high, low, current };
  };

  const temps = getTemperatureData();
  const dateLabel = segmentDate ? format(segmentDate, 'EEEE, MMM d') : 'Weather';
  const description = weather.description || 'Clear conditions';
  const humidity = weather.humidity || 50;
  const windSpeed = Math.round(weather.windSpeed || 5);
  const precipChance = weather.precipitationChance || 10;
  const isLiveForecast = weather.isActualForecast === true;

  console.log('✅ SimpleWeatherDisplay FINAL DATA:', {
    cityName,
    temps,
    description,
    isLiveForecast
  });

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="font-semibold text-blue-800">{cityName}</h5>
        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
          {dateLabel}
        </span>
      </div>
      
      {/* Main Temperature Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-blue-800 mb-1">
          {temps.current}°F
        </div>
        <div className="text-sm text-blue-600 capitalize">
          {description}
        </div>
      </div>
      
      {/* Temperature Range */}
      <div className="flex justify-between items-center mb-3 px-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-700">{temps.low}°</div>
          <div className="text-xs text-blue-600">Low</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-700">{temps.high}°</div>
          <div className="text-xs text-blue-600">High</div>
        </div>
      </div>
      
      {/* Weather Details */}
      <div className="flex justify-between text-xs text-blue-600 border-t border-blue-200 pt-2">
        <span>💧 {precipChance}%</span>
        <span>💨 {windSpeed} mph</span>
        <span>💦 {humidity}%</span>
      </div>

      {/* Data Source */}
      <div className="mt-2 text-xs text-center">
        <span className={`px-2 py-1 rounded ${isLiveForecast ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {isLiveForecast ? '📡 Live forecast' : '📊 Seasonal estimate'}
        </span>
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
