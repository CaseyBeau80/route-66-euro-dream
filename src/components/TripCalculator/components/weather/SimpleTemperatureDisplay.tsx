
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
  const getTemperatureLabel = (temp: number): string => {
    if (temp >= 90) return 'Hot';
    if (temp >= 80) return 'Warm';
    if (temp >= 70) return 'Pleasant';
    if (temp >= 60) return 'Mild';
    if (temp >= 50) return 'Cool';
    return 'Cold';
  };

  const high = weather.highTemp || weather.temperature;
  const low = weather.lowTemp || weather.temperature;
  
  console.log('🌡️ CENTRALIZED: SimpleTemperatureDisplay rendering:', {
    cityName: weather.cityName,
    high,
    low,
    highTempLabel: getTemperatureLabel(high),
    isLiveForecast: false,
    isSharedView
  });

  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl font-bold text-gray-800">
        {Math.round(weather.temperature)}°F
      </div>
      
      {high !== low && (
        <div className="text-sm text-gray-600">
          H: {Math.round(high)}° L: {Math.round(low)}°
        </div>
      )}
      
      <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
        {getTemperatureLabel(high)}
      </div>
    </div>
  );
};

export default SimpleTemperatureDisplay;
