
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
  const hasInfo = humidity !== undefined || windSpeed !== undefined || precipitationChance !== undefined;
  
  if (!hasInfo) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      {humidity !== undefined && (
        <div className="text-center p-2 bg-blue-100 rounded">
          <div className="font-medium text-blue-700">{humidity}%</div>
          <div className="text-xs text-blue-600">Humidity</div>
        </div>
      )}
      
      {windSpeed !== undefined && (
        <div className="text-center p-2 bg-blue-100 rounded">
          <div className="font-medium text-blue-700">{windSpeed} mph</div>
          <div className="text-xs text-blue-600">Wind</div>
        </div>
      )}
      
      {precipitationChance !== undefined && (
        <div className="text-center p-2 bg-blue-100 rounded">
          <div className="font-medium text-blue-700">{precipitationChance}%</div>
          <div className="text-xs text-blue-600">Rain</div>
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;
