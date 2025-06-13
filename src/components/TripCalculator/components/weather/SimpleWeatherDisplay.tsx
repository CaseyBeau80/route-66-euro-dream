
import React from 'react';
import { format } from 'date-fns';
import { Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';
import { ForecastWeatherData } from '@/components/Route66Map/services/weather/WeatherForecastService';

interface SimpleWeatherDisplayProps {
  weather: ForecastWeatherData;
  segmentDate: Date;
  cityName: string;
}

const getWeatherIcon = (description: string) => {
  const desc = description.toLowerCase();
  if (desc.includes('rain') || desc.includes('storm')) return CloudRain;
  if (desc.includes('snow')) return CloudSnow;
  if (desc.includes('cloud')) return Cloud;
  return Sun;
};

const SimpleWeatherDisplay: React.FC<SimpleWeatherDisplayProps> = ({
  weather,
  segmentDate,
  cityName
}) => {
  const IconComponent = getWeatherIcon(weather.description);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent className="h-6 w-6 text-blue-600" />
          <span className="font-medium text-blue-900">{weather.temperature}°F</span>
        </div>
        <span className="text-sm text-blue-700">
          {format(segmentDate, 'MMM d')}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-blue-600">High:</span>
          <span className="text-blue-900 font-medium">{weather.highTemp}°F</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-600">Low:</span>
          <span className="text-blue-900 font-medium">{weather.lowTemp}°F</span>
        </div>
        <p className="text-sm text-blue-700 capitalize mt-2">
          {weather.description}
        </p>
        
        {!weather.isActualForecast && (
          <p className="text-xs text-blue-500 italic mt-2">
            Historical average data
          </p>
        )}
      </div>
    </div>
  );
};

export default SimpleWeatherDisplay;
