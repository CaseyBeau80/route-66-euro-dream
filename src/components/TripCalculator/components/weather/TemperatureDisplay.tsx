
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

  console.log('🌡️ TemperatureDisplay ENHANCED DEBUG - Raw Props:', {
    type,
    currentTemp,
    highTemp,
    lowTemp,
    currentTempType: typeof currentTemp,
    highTempType: typeof highTemp,
    lowTempType: typeof lowTemp,
    currentTempIsNaN: currentTemp !== undefined ? isNaN(currentTemp as number) : 'undefined',
    highTempIsNaN: highTemp !== undefined ? isNaN(highTemp as number) : 'undefined',
    lowTempIsNaN: lowTemp !== undefined ? isNaN(lowTemp as number) : 'undefined'
  });

  // Enhanced formatting function
  const formatTemp = (temp: number | undefined): string => {
    console.log('🌡️ TemperatureDisplay formatTemp called with:', { temp, type: typeof temp });
    
    if (temp === undefined || temp === null || isNaN(temp)) {
      console.log('🌡️ TemperatureDisplay formatTemp: Invalid temperature, returning --°');
      return '--°';
    }
    
    if (formatTemperature) {
      const formatted = formatTemperature(temp);
      console.log('🌡️ TemperatureDisplay formatTemp: Using unit context:', formatted);
      return formatted;
    }
    
    const defaultFormatted = `${Math.round(temp)}°F`;
    console.log('🌡️ TemperatureDisplay formatTemp: Using default format:', defaultFormatted);
    return defaultFormatted;
  };

  // Enhanced validation - check for actual numbers
  const isDisplayableTemp = (temp: number | undefined): boolean => {
    const isValid = temp !== undefined && 
                   temp !== null && 
                   typeof temp === 'number' && 
                   !isNaN(temp) && 
                   temp > -150 && 
                   temp < 150;
    
    console.log('🌡️ TemperatureDisplay isDisplayableTemp:', { 
      temp, 
      isValid,
      checks: {
        notUndefined: temp !== undefined,
        notNull: temp !== null,
        isNumber: typeof temp === 'number',
        notNaN: temp !== undefined ? !isNaN(temp as number) : false,
        inRange: temp !== undefined && temp > -150 && temp < 150
      }
    });
    
    return isValid;
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

  // Enhanced fallback display with more information
  console.warn('❌ TemperatureDisplay: No valid temperature data to display');
  console.warn('❌ TemperatureDisplay: Debug info:', {
    type,
    providedTemps: { currentTemp, highTemp, lowTemp },
    validationResults: {
      current: isDisplayableTemp(currentTemp),
      high: isDisplayableTemp(highTemp),
      low: isDisplayableTemp(lowTemp)
    }
  });

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded p-3">
      <div className="text-lg text-gray-400 mb-1">--°</div>
      <div className="text-xs text-gray-500">Temperature data not available</div>
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-red-500 mt-1">
          Debug: current={String(currentTemp)}, high={String(highTemp)}, low={String(lowTemp)}
        </div>
      )}
    </div>
  );
};

export default TemperatureDisplay;
