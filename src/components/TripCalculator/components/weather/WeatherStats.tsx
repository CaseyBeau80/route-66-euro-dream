
import React from 'react';
import { useUnits } from '@/contexts/UnitContext';

interface WeatherStatsProps {
  humidity?: number;
  windSpeed?: number;
  precipitationChance?: number;
}

const WeatherStats: React.FC<WeatherStatsProps> = ({ humidity, windSpeed, precipitationChance }) => {
  const { formatSpeed } = useUnits();

  if (!humidity && !windSpeed && !precipitationChance) {
    return null;
  }

  return (
    <div className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded p-2">
      {precipitationChance !== undefined && precipitationChance > 0 && (
        <div className="flex items-center gap-1">
          <span>💧</span>
          <span>{precipitationChance}% rain</span>
        </div>
      )}
      {!precipitationChance && humidity !== undefined && humidity > 0 && (
        <div className="flex items-center gap-1">
          <span>💧</span>
          <span>{humidity}% humidity</span>
        </div>
      )}
      {windSpeed !== undefined && windSpeed > 0 && (
        <div className="flex items-center gap-1">
          <span>💨</span>
          <span>{formatSpeed ? formatSpeed(windSpeed) : `${windSpeed} mph`} wind</span>
        </div>
      )}
    </div>
  );
};

export default WeatherStats;
