
import React from 'react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';
import { WeatherUtilityService } from './services/WeatherUtilityService';

interface SimpleTemperatureDisplayProps {
  weather: ForecastWeatherData;
  isSharedView?: boolean;
  segmentDate?: Date | null;
}

const SimpleTemperatureDisplay: React.FC<SimpleTemperatureDisplayProps> = ({ 
  weather, 
  isSharedView = false,
  segmentDate = null
}) => {
  // Extract temperature values with fallbacks
  const high = weather.highTemp || weather.temperature + 5;
  const low = weather.lowTemp || weather.temperature - 5;

  // CENTRALIZED: Remove hardcoded "Hot" labels and use actual temperature ranges
  const getTemperatureLabel = (temperature: number): string => {
    if (temperature >= 90) return 'Hot';
    if (temperature >= 75) return 'Warm';
    if (temperature >= 60) return 'Mild';
    if (temperature >= 45) return 'Cool';
    return 'Cold';
  };

  const highTempLabel = getTemperatureLabel(high);
  
  // CENTRALIZED: Use WeatherUtilityService for live forecast detection
  const isLiveForecast = React.useMemo(() => {
    return WeatherUtilityService.isLiveForecast(weather, segmentDate);
  }, [weather, segmentDate]);

  console.log('🌡️ CENTRALIZED: SimpleTemperatureDisplay rendering:', {
    cityName: weather.cityName,
    high,
    low,
    highTempLabel,
    isLiveForecast,
    isSharedView
  });

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-1 rounded ${
          highTempLabel === 'Hot' ? 'bg-red-100 text-red-700' :
          highTempLabel === 'Warm' ? 'bg-orange-100 text-orange-700' :
          highTempLabel === 'Mild' ? 'bg-green-100 text-green-700' :
          highTempLabel === 'Cool' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {highTempLabel}
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
