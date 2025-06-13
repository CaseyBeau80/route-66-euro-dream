
import React from 'react';

interface WeatherInfoProps {
  humidity?: number;
  windSpeed?: number;
  precipitationChance?: number;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({
  humidity,
  windSpeed,
  precipitationChance
}) => {
  if (!humidity && !windSpeed && precipitationChance === undefined) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2 text-sm text-blue-700">
      {humidity && (
        <div className="text-center">
          <div className="font-medium">{humidity}%</div>
          <div className="text-xs text-blue-600">Humidity</div>
        </div>
      )}
      
      {windSpeed && (
        <div className="text-center">
          <div className="font-medium">{Math.round(windSpeed)} mph</div>
          <div className="text-xs text-blue-600">Wind</div>
        </div>
      )}
      
      {precipitationChance !== undefined && (
        <div className="text-center">
          <div className="font-medium">{precipitationChance}%</div>
          <div className="text-xs text-blue-600">Rain</div>
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;
