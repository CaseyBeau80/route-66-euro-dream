
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

  console.log('🌡️ TemperatureDisplay rendering:', {
    type,
    currentTemp,
    highTemp,
    lowTemp,
    hasFormatTemperature: !!formatTemperature
  });

  // Fallback formatting if useUnits context is not available
  const formatTemp = (temp: number) => {
    if (formatTemperature) {
      return formatTemperature(temp);
    }
    return `${Math.round(temp)}°F`;
  };

  if (type === 'current' && currentTemp !== undefined && !isNaN(currentTemp)) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded p-3">
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {formatTemp(currentTemp)}
        </div>
        <div className="text-xs text-gray-500">Current Temp</div>
      </div>
    );
  }

  if (type === 'range' && highTemp !== undefined && lowTemp !== undefined && 
      !isNaN(highTemp) && !isNaN(lowTemp)) {
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

  // Fallback display when no valid temperature data
  console.warn('⚠️ TemperatureDisplay: No valid temperature data to display');
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 rounded p-3">
      <div className="text-lg text-gray-400 mb-1">--°</div>
      <div className="text-xs text-gray-500">Temperature unavailable</div>
    </div>
  );
};

export default TemperatureDisplay;
