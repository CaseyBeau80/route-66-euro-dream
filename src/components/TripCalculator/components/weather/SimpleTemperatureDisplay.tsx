
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface SimpleTemperatureDisplayProps {
  weather: ForecastWeatherData;
  isSharedView?: boolean;
}

const SimpleTemperatureDisplay: React.FC<SimpleTemperatureDisplayProps> = ({ 
  weather, 
  isSharedView = false 
}) => {
  // Extract temperature values with fallbacks
  const temp = weather.temperature;
  const high = weather.highTemp || temp + 5;
  const low = weather.lowTemp || temp - 5;

  // FIXED: Remove hardcoded "Hot" labels and use actual temperature ranges
  const getTemperatureLabel = (temperature: number): string => {
    if (temperature >= 90) return 'Hot';
    if (temperature >= 75) return 'Warm';
    if (temperature >= 60) return 'Mild';
    if (temperature >= 45) return 'Cool';
    return 'Cold';
  };

  const tempLabel = getTemperatureLabel(temp);
  const isLiveForecast = weather.isActualForecast === true && weather.source === 'live_forecast';

  console.log('🌡️ SimpleTemperatureDisplay rendering:', {
    cityName: weather.cityName,
    temp,
    high,
    low,
    tempLabel,
    isLiveForecast,
    isSharedView
  });

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-gray-800">
          {Math.round(temp)}°F
        </span>
        <span className={`text-xs px-2 py-1 rounded ${
          tempLabel === 'Hot' ? 'bg-red-100 text-red-700' :
          tempLabel === 'Warm' ? 'bg-orange-100 text-orange-700' :
          tempLabel === 'Mild' ? 'bg-green-100 text-green-700' :
          tempLabel === 'Cool' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {tempLabel}
        </span>
        {isLiveForecast && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            Live
          </span>
        )}
      </div>
      
      <div className="text-sm text-gray-600">
        High: {Math.round(high)}°F • Low: {Math.round(low)}°F
      </div>
    </div>
  );
};

export default SimpleTemperatureDisplay;
