
import React from 'react';
import { WeatherData } from '@/components/Route66Map/components/weather/WeatherTypes';
import WeatherIcon from './WeatherIcon';
import WeatherStatusBadge from './WeatherStatusBadge';
import TemperatureDisplay from './TemperatureDisplay';
import WeatherStats from './WeatherStats';
import SeasonalReferenceCard from './SeasonalReferenceCard';

interface CurrentWeatherDisplayProps {
  weather: WeatherData;
  segmentDate?: Date | null;
}

const CurrentWeatherDisplay: React.FC<CurrentWeatherDisplayProps> = ({ 
  weather, 
  segmentDate 
}) => {
  // Check if this is a future date (used as reference)
  const isFutureReference = segmentDate && segmentDate.getTime() > Date.now();
  
  return (
    <div className="space-y-3">
      <WeatherStatusBadge type="current" />
      
      <div className="flex items-center gap-3">
        <WeatherIcon iconCode={weather.icon} description={weather.description} />
        <div>
          <div className="font-semibold text-gray-800 capitalize">{weather.description}</div>
          <div className="text-sm text-gray-600">
            {segmentDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      <TemperatureDisplay 
        type="current"
        currentTemp={weather.temperature}
      />

      <WeatherStats 
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
      />

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
