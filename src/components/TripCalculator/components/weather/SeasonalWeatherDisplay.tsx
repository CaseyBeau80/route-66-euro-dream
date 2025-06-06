
import React from 'react';
import { useUnits } from '@/contexts/UnitContext';
import WeatherIcon from './WeatherIcon';
import WeatherStatusBadge from './WeatherStatusBadge';
import TemperatureDisplay from './TemperatureDisplay';
import WeatherStats from './WeatherStats';
import { getSeasonalWeatherData } from './SeasonalWeatherService';

interface SeasonalWeatherDisplayProps {
  segmentDate: Date;
  cityName: string;
}

const SeasonalWeatherDisplay: React.FC<SeasonalWeatherDisplayProps> = ({ 
  segmentDate, 
  cityName 
}) => {
  const { formatSpeed } = useUnits();
  const seasonalData = getSeasonalWeatherData(cityName, segmentDate.getMonth() + 1);
  
  return (
    <div className="space-y-3">
      <WeatherStatusBadge 
        type="seasonal" 
        description={`Typical ${segmentDate.toLocaleDateString('en-US', { month: 'long' })} weather`}
      />
      
      <div className="flex items-center gap-3">
        <WeatherIcon description={seasonalData.condition} />
        <div>
          <div className="font-semibold text-gray-800">{seasonalData.condition}</div>
          <div className="text-sm text-gray-600">
            {segmentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      <TemperatureDisplay 
        type="range"
        highTemp={seasonalData.high}
        lowTemp={seasonalData.low}
      />

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between bg-white rounded p-1">
          <span className="text-gray-600">
            {seasonalData.humidity >= 50 ? 'Humidity:' : 'Avg Humidity:'}
          </span>
          <span className="font-semibold">{seasonalData.humidity}%</span>
        </div>
        <div className="flex justify-between bg-white rounded p-1">
          <span className="text-gray-600">
            {seasonalData.windSpeed >= 15 ? 'Wind:' : 'Avg Wind:'}
          </span>
          <span className="font-semibold">{formatSpeed(seasonalData.windSpeed)}</span>
        </div>
      </div>
    </div>
  );
};

export default SeasonalWeatherDisplay;
