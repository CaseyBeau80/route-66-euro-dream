
import React from 'react';
import { useUnits } from '@/contexts/UnitContext';

interface WeatherStatsProps {
  humidity?: number;
  windSpeed?: number;
  precipitationChance?: number;
  layout?: 'inline' | 'card';
}

const WeatherStats: React.FC<WeatherStatsProps> = ({ 
  humidity, 
  windSpeed, 
  precipitationChance,
  layout = 'card'
}) => {
  const { formatSpeed } = useUnits();

  if (!humidity && !windSpeed && !precipitationChance) {
    return null;
  }

  const statsContent = (
    <>
      {precipitationChance !== undefined && precipitationChance > 0 && (
        <div className="flex items-center gap-1">
          <span>💧</span>
          <span>{precipitationChance}%{layout === 'inline' ? '' : ' rain'}</span>
        </div>
      )}
      {!precipitationChance && humidity !== undefined && humidity > 0 && (
        <div className="flex items-center gap-1">
          <span>💧</span>
          <span>{humidity}%{layout === 'inline' ? '' : ' humidity'}</span>
        </div>
      )}
      {windSpeed !== undefined && windSpeed > 0 && (
        <div className="flex items-center gap-1">
          <span>💨</span>
          <span>{formatSpeed ? formatSpeed(windSpeed) : `${windSpeed} mph`}{layout === 'inline' ? '' : ' wind'}</span>
        </div>
      )}
    </>
  );

  if (layout === 'inline') {
    return (
      <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
        {statsContent}
      </div>
    );
  }

  return (
    <div className="flex justify-between text-sm text-gray-600 bg-gray-50 rounded p-2">
      {statsContent}
    </div>
  );
};

export default WeatherStats;
