
import React from 'react';
import { useUnits } from '@/contexts/UnitContext';

interface TemperatureDisplayProps {
  type: 'range';  // Removed 'current' type to eliminate current temperature display
  highTemp?: number;
  lowTemp?: number;
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ 
  type, 
  highTemp,
  lowTemp
}) => {
  const { formatTemperature } = useUnits();

  console.log('🌡️ TemperatureDisplay - removed current temp option:', {
    type,
    highTemp,
    lowTemp,
    onlyShowingHighLow: true
  });

  const formatTemp = (temp: number | undefined): string => {
    if (temp === undefined || temp === null || isNaN(temp)) {
      return '--°';
    }
    
    if (formatTemperature) {
      const formatted = formatTemperature(temp);
      return formatted;
    }
    
    return `${Math.round(temp)}°F`;
  };

  const isDisplayableTemp = (temp: number | undefined): boolean => {
    return temp !== undefined && 
           temp !== null && 
           typeof temp === 'number' && 
           !isNaN(temp) && 
           temp > -150 && 
           temp < 150;
  };

  // Only show temperature range, no current temperature option
  if (type === 'range') {
    const hasHigh = isDisplayableTemp(highTemp);
    const hasLow = isDisplayableTemp(lowTemp);
    
    if (hasHigh || hasLow) {
      return (
        <div className="flex items-center justify-center gap-3 bg-white rounded p-3">
          {/* Low Temperature */}
          {hasLow && (
            <div className="text-center flex-1">
              <div className="text-lg font-bold text-blue-600">
                {formatTemp(lowTemp)}
              </div>
              <div className="text-xs text-gray-500">Low</div>
            </div>
          )}
          
          {/* Separator - only show if we have both temps */}
          {hasHigh && hasLow && (
            <div className="text-gray-300 text-lg">•</div>
          )}
          
          {/* High Temperature */}
          {hasHigh && (
            <div className="text-center flex-1">
              <div className="text-lg font-bold text-red-600">
                {formatTemp(highTemp)}
              </div>
              <div className="text-xs text-gray-500">High</div>
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded p-3">
      <div className="text-lg text-gray-400 mb-1">--°</div>
      <div className="text-xs text-gray-500">Temperature data not available</div>
    </div>
  );
};

export default TemperatureDisplay;
