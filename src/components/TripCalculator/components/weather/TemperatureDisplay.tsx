
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

  console.log('🌡️ TemperatureDisplay DEBUG - Raw Props:', {
    type,
    currentTemp,
    highTemp,
    lowTemp,
    currentTempType: typeof currentTemp,
    highTempType: typeof highTemp,
    lowTempType: typeof lowTemp,
    hasFormatTemperature: !!formatTemperature
  });

  // Fallback formatting if useUnits context is not available
  const formatTemp = (temp: number) => {
    if (formatTemperature) {
      return formatTemperature(temp);
    }
    return `${Math.round(temp)}°F`;
  };

  // More lenient temperature validation - just check if it's a number
  const isValidTemp = (temp: number | undefined): temp is number => {
    const isValid = temp !== undefined && temp !== null && !isNaN(temp) && typeof temp === 'number';
    console.log('🌡️ TemperatureDisplay validation:', { temp, isValid, type: typeof temp });
    return isValid;
  };

  console.log('🌡️ TemperatureDisplay validation results:', {
    type,
    currentTempValid: isValidTemp(currentTemp),
    highTempValid: isValidTemp(highTemp),
    lowTempValid: isValidTemp(lowTemp)
  });

  if (type === 'current' && isValidTemp(currentTemp)) {
    console.log('🌡️ TemperatureDisplay: Rendering current temp:', currentTemp);
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded p-3">
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {formatTemp(currentTemp)}
        </div>
        <div className="text-xs text-gray-500">Current Temp</div>
      </div>
    );
  }

  if (type === 'range' && isValidTemp(highTemp) && isValidTemp(lowTemp)) {
    console.log('🌡️ TemperatureDisplay: Rendering range temps:', { highTemp, lowTemp });
    return (
      <div className="flex items-center justify-center gap-3 bg-white rounded p-3">
        {/* Low Temperature - moved to left */}
        <div className="text-center flex-1">
          <div className="text-xl font-bold text-blue-600">
            {formatTemp(lowTemp)}
          </div>
          <div className="text-xs text-gray-500">Low</div>
        </div>
        
        {/* Separator */}
        <div className="text-gray-300 text-lg">•</div>
        
        {/* High Temperature - moved to right */}
        <div className="text-center flex-1">
          <div className="text-xl font-bold text-red-600">
            {formatTemp(highTemp)}
          </div>
          <div className="text-xs text-gray-500">High</div>
        </div>
      </div>
    );
  }

  // Enhanced fallback display when no valid temperature data
  console.warn('⚠️ TemperatureDisplay: No valid temperature data to display', {
    type,
    currentTemp,
    highTemp,
    lowTemp,
    validCurrentTemp: isValidTemp(currentTemp),
    validHighTemp: isValidTemp(highTemp),
    validLowTemp: isValidTemp(lowTemp)
  });

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded p-3">
      <div className="text-lg text-gray-400 mb-1">--°</div>
      <div className="text-xs text-gray-500">Temperature unavailable</div>
      <div className="text-xs text-gray-400 mt-1">
        {type === 'current' ? 'Current temp data missing' : 'Temperature range data missing'}
      </div>
      <div className="text-xs text-red-500 mt-1">
        DEBUG: high={highTemp}, low={lowTemp}, current={currentTemp}
      </div>
    </div>
  );
};

export default TemperatureDisplay;
