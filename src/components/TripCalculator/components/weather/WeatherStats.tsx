
import React from 'react';

interface WeatherStatsProps {
  humidity: number;
  windSpeed: number;
}

const WeatherStats: React.FC<WeatherStatsProps> = ({ humidity, windSpeed }) => {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="flex justify-between bg-white rounded p-1">
        <span className="text-gray-600">
          {humidity >= 50 ? 'Humidity:' : 'Avg Humidity:'}
        </span>
        <span className="font-semibold">{humidity}%</span>
      </div>
      <div className="flex justify-between bg-white rounded p-1">
        <span className="text-gray-600">
          {windSpeed >= 15 ? 'Wind:' : 'Avg Wind:'}
        </span>
        <span className="font-semibold">{windSpeed} mph</span>
      </div>
    </div>
  );
};

export default WeatherStats;
