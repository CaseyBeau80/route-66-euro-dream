
import React from 'react';
import { format } from 'date-fns';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Thermometer } from 'lucide-react';
import { WeatherData } from './hooks/useEdgeFunctionWeather';

interface SimpleWeatherDisplayProps {
  weather: WeatherData;
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
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    }
    if (lowerCondition.includes('snow')) {
      return <Snowflake className="h-8 w-8 text-blue-300" />;
    }
    if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-gray-500" />;
    }
    if (lowerCondition.includes('wind')) {
      return <Wind className="h-8 w-8 text-gray-600" />;
    }
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 80) return 'text-red-600';
    if (temp >= 70) return 'text-orange-600';
    if (temp >= 60) return 'text-green-600';
    if (temp >= 50) return 'text-blue-600';
    return 'text-blue-800';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getWeatherIcon(weather.condition || '')}
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {format(segmentDate, 'MMM d')}
            </div>
            <div className="text-sm text-gray-600">
              {cityName}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${getTemperatureColor(weather.temperature || 0)}`}>
            {Math.round(weather.temperature || 0)}°F
          </div>
          {weather.highTemp && weather.lowTemp && (
            <div className="text-sm text-gray-600">
              {Math.round(weather.highTemp)}° / {Math.round(weather.lowTemp)}°
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">
          {weather.condition || 'Partly Cloudy'}
        </div>
        
        {weather.humidity && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Thermometer className="h-3 w-3" />
            <span>{weather.humidity}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
