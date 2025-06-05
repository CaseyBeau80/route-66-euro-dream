
import React from 'react';
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

      <WeatherStats 
        humidity={seasonalData.humidity}
        windSpeed={seasonalData.windSpeed}
      />
    </div>
  );
};

export default SeasonalWeatherDisplay;
