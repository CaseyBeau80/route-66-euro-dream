
import React from 'react';
import { WeatherData } from '@/components/Route66Map/components/weather/WeatherTypes';
import WeatherIcon from './WeatherIcon';
import WeatherStatusBadge from './WeatherStatusBadge';
import SeasonalReferenceCard from './SeasonalReferenceCard';
import { useUnits } from '@/contexts/UnitContext';

interface CurrentWeatherDisplayProps {
  weather: WeatherData;
  segmentDate?: Date | null;
}

const CurrentWeatherDisplay: React.FC<CurrentWeatherDisplayProps> = ({ 
  weather, 
  segmentDate 
}) => {
  const { formatSpeed } = useUnits();
  
  // Check if this is a future date (used as reference)
  const isFutureReference = segmentDate && segmentDate.getTime() > Date.now();
  
  return (
    <div className="space-y-3">
      <WeatherStatusBadge type="current" />
      
      {/* Weather Icon and Condition */}
      <div className="flex flex-col items-center gap-2 mb-4">
        <WeatherIcon iconCode={weather.icon} description={weather.description} className="h-16 w-16 text-3xl" />
        <div className="text-center">
          <div className="font-semibold text-gray-800 capitalize text-sm">{weather.description}</div>
          <div className="text-xs text-gray-600">
            {segmentDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Current Temperature with Details inside white card */}
      <div className="bg-white rounded p-4 border border-gray-200">
        <div className="text-center mb-3">
          <div className="text-2xl font-bold text-blue-600">{weather.temperature}°</div>
          <div className="text-xs text-gray-500">Current Temp</div>
        </div>
        
        {/* Weather Details inside the white card */}
        {(weather.humidity || weather.windSpeed) && (
          <div className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded p-2">
            {weather.humidity !== undefined && weather.humidity > 0 && (
              <div className="flex items-center gap-1">
                <span>💧</span>
                <span>{weather.humidity}% humidity</span>
              </div>
            )}
            {weather.windSpeed !== undefined && weather.windSpeed > 0 && (
              <div className="flex items-center gap-1">
                <span>💨</span>
                <span>{formatSpeed ? formatSpeed(weather.windSpeed) : `${weather.windSpeed} mph`} wind</span>
              </div>
            )}
          </div>
        )}
      </div>

      {isFutureReference && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <SeasonalReferenceCard 
            segmentDate={segmentDate}
            cityName={weather.cityName}
          />
        </div>
      )}
    </div>
  );
};

export default CurrentWeatherDisplay;
