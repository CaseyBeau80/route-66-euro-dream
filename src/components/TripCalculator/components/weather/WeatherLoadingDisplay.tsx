
import React from 'react';
import { DateNormalizationService } from './DateNormalizationService';

interface WeatherLoadingDisplayProps {
  cityName: string;
  isSharedView?: boolean;
}

const WeatherLoadingDisplay: React.FC<WeatherLoadingDisplayProps> = ({
  cityName,
  isSharedView = false
}) => {
  return (
    <div className="bg-blue-50 rounded border border-blue-200 p-3 text-center">
      <div className="text-sm text-blue-600 mb-2">
        🌤️ Getting weather for {cityName}...
      </div>
      <div className="text-xs text-blue-500">
        Checking forecast data...
      </div>
    </div>
  );
};

export default WeatherLoadingDisplay;
