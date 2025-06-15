
import React from 'react';
import { format } from 'date-fns';
import { Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

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
  cityName
}) => {
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    }
    if (lowerCondition.includes('snow')) {
      return <Snowflake className="h-6 w-6 text-blue-300" />;
    }
    if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-6 w-6 text-gray-500" />;
    }
    if (lowerCondition.includes('wind')) {
      return <Wind className="h-6 w-6 text-gray-600" />;
    }
    return <Sun className="h-6 w-6 text-yellow-500" />;
  };

  const highTemp = weather.highTemp || weather.temperature;
  const lowTemp = weather.lowTemp || weather.temperature;

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.description || '')}
          <div>
            <div className="text-sm font-medium text-gray-800">
              {format(segmentDate, 'MMM d')}
            </div>
            <div className="text-xs text-gray-600">
              {cityName}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          {/* Only show high/low temperatures, no current temperature */}
          {highTemp && lowTemp && highTemp !== lowTemp ? (
            <div className="text-lg font-bold text-gray-800">
              {Math.round(highTemp)}° / {Math.round(lowTemp)}°
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-800">
              {Math.round(highTemp || lowTemp || 0)}°F
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600 capitalize">
          {weather.description || 'Partly Cloudy'}
        </div>
        
        {weather.humidity && (
          <div className="text-xs text-gray-600">
            💧 {weather.humidity}%
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
