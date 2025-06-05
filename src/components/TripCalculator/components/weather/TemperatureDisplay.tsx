
import React from 'react';

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
  if (type === 'current' && currentTemp !== undefined) {
    return (
      <div className="flex items-center justify-center bg-white rounded p-2">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{currentTemp}°F</div>
          <div className="text-xs text-gray-500">Current Temp</div>
        </div>
      </div>
    );
  }

  if (type === 'range' && highTemp !== undefined && lowTemp !== undefined) {
    return (
      <div className="flex items-center justify-between bg-white rounded p-2">
        <div className="text-center">
          <div className="text-lg font-bold text-red-600">{highTemp}°F</div>
          <div className="text-xs text-gray-500">Typical High</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">{lowTemp}°F</div>
          <div className="text-xs text-gray-500">Typical Low</div>
        </div>
      </div>
    );
  }

  return null;
};

export default TemperatureDisplay;
