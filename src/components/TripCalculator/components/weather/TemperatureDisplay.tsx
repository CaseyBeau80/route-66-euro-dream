
import React from 'react';
import { useUnits } from '@/contexts/UnitContext';

interface TemperatureDisplayProps {
  type: 'current' | 'range';
  currentTemp?: number;
  highTemp?: number;
  lowTemp?: number;
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ 
  type, 
  currentTemp,
  highTemp,
  lowTemp
}) => {
  const { formatTemperature } = useUnits();

  console.log('🌡️ TemperatureDisplay SIMPLIFIED - Raw Props:', {
    type,
    currentTemp,
    highTemp,
    lowTemp,
    currentTempType: typeof currentTemp,
    highTempType: typeof highTemp,
    lowTempType: typeof lowTemp
  });

  // Simplified formatting function
  const formatTemp = (temp: number | undefined): string => {
    if (temp === undefined || temp === null || isNaN(temp)) {
      return '--°';
    }
    
    if (formatTemperature) {
      return formatTemperature(temp);
    }
    return `${Math.round(temp)}°F`;
  };

  // More lenient validation - just check if it's a reasonable number
  const isDisplayableTemp = (temp: number | undefined): boolean => {
    return temp !== undefined && 
           temp !== null && 
           typeof temp === 'number' && 
           !isNaN(temp) && 
           temp > -150 && 
           temp < 150;
  };

  console.log('🌡️ TemperatureDisplay validation results:', {
    type,
    currentTempValid: isDisplayableTemp(currentTemp),
    highTempValid: isDisplayableTemp(highTemp),
    lowTempValid: isDisplayableTemp(lowTemp),
    willShowCurrent: type === 'current' && isDisplayableTemp(currentTemp),
    willShowRange: type === 'range' && (isDisplayableTemp(highTemp) || isDisplayableTemp(lowTemp))
  });

  if (type === 'current' && isDisplayableTemp(currentTemp)) {
    console.log('✅ TemperatureDisplay: Rendering current temp:', currentTemp);
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded p-3">
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {formatTemp(currentTemp)}
        </div>
        <div className="text-xs text-gray-500">Current Temp</div>
      </div>
    );
  }

  if (type === 'range') {
    const hasHigh = isDisplayableTemp(highTemp);
    const hasLow = isDisplayableTemp(lowTemp);
    
    console.log('🌡️ TemperatureDisplay: Range display check:', {
      hasHigh,
      hasLow,
      highTemp,
      lowTemp,
      willShow: hasHigh || hasLow
    });

    if (hasHigh || hasLow) {
      console.log('✅ TemperatureDisplay: Rendering range temps');
      return (
        <div className="flex items-center justify-center gap-3 bg-white rounded p-3">
          {/* Low Temperature */}
          {hasLow && (
            <div className="text-center flex-1">
              <div className="text-xl font-bold text-blue-600">
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
              <div className="text-xl font-bold text-red-600">
                {formatTemp(highTemp)}
              </div>
              <div className="text-xs text-gray-500">High</div>
            </div>
          )}
        </div>
      );
    }
  }

  // Fallback display - simplified
  console.warn('❌ TemperatureDisplay: No valid temperature data to display');

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded p-3">
      <div className="text-lg text-gray-400 mb-1">--°</div>
      <div className="text-xs text-gray-500">Temperature unavailable</div>
    </div>
  );
};

export default TemperatureDisplay;
