
import React from 'react';
import { SeasonalWeatherGenerator } from '../SeasonalWeatherGenerator';

interface SeasonalWeatherFallbackProps {
  segmentDate: Date;
  cityName: string;
  compact?: boolean;
}

const SeasonalWeatherFallback: React.FC<SeasonalWeatherFallbackProps> = ({
  segmentDate,
  cityName,
  compact = false
}) => {
  const month = segmentDate.getMonth();
  const temperature = SeasonalWeatherGenerator.getSeasonalTemperature(month);
  const description = SeasonalWeatherGenerator.getSeasonalDescription(month);
  const icon = SeasonalWeatherGenerator.getSeasonalIcon(month);

  console.log('🌱 FALLBACK: SeasonalWeatherFallback rendering for', cityName, {
    month,
    temperature,
    description,
    isCompact: compact
  });

  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-center">
        <div className="text-amber-600 text-xl mb-1">
          {icon?.includes('01') ? '☀️' : 
           icon?.includes('02') ? '⛅' : 
           icon?.includes('03') ? '☁️' : '🌤️'}
        </div>
        <div className="text-sm font-medium text-amber-800">
          ~{Math.round(temperature)}°F
        </div>
        <div className="text-xs text-amber-700 capitalize">
          {description}
        </div>
        <div className="text-xs text-amber-600 mt-1">
          Seasonal Estimate
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="text-3xl">
          {icon?.includes('01') ? '☀️' : 
           icon?.includes('02') ? '⛅' : 
           icon?.includes('03') ? '☁️' : '🌤️'}
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold text-gray-800 capitalize">
            {description}
          </div>
          <div className="text-sm text-gray-600">
            Seasonal Weather Estimate
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-800">
          {Math.round(temperature)}°F
        </span>
        <div className="text-sm text-gray-600">
          Typical for {new Date().toLocaleDateString('en-US', { month: 'long' })}
        </div>
      </div>
    </div>
  );
};

export default SeasonalWeatherFallback;
