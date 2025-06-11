
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

  if (type === 'current' && currentTemp !== undefined) {
    return (
      <div className="flex flex-col items-center justify-center bg-white rounded p-3">
        <div className="text-2xl font-bold text-blue-600 mb-1">{formatTemperature(currentTemp)}</div>
        <div className="text-xs text-gray-500">Current Temp</div>
      </div>
    );
  }

  if (type === 'range' && highTemp !== undefined && lowTemp !== undefined) {
    return (
      <div className="flex items-center justify-center gap-3 bg-white rounded p-3">
        {/* Low Temperature - moved to left */}
        <div className="text-center flex-1">
          <div className="text-xl font-bold text-blue-600">{formatTemperature(lowTemp)}</div>
          <div className="text-xs text-gray-500">Low</div>
        </div>
        
        {/* Separator */}
        <div className="text-gray-300 text-lg">•</div>
        
        {/* High Temperature - moved to right */}
        <div className="text-center flex-1">
          <div className="text-xl font-bold text-red-600">{formatTemperature(highTemp)}</div>
          <div className="text-xs text-gray-500">High</div>
        </div>
      </div>
    );
  }

  return null;
};

export default TemperatureDisplay;
