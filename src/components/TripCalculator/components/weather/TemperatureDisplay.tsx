
import React from 'react';
import { useUnits } from '@/contexts/UnitContext';

interface TemperatureDisplayProps {
  type: 'current';
  currentTemp?: number;
}

const TemperatureDisplay: React.FC<TemperatureDisplayProps> = ({ 
  type, 
  currentTemp
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

  return null;
};

export default TemperatureDisplay;
