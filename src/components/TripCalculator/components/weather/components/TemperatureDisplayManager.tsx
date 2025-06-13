
import React from 'react';
import TemperatureDisplay from '../TemperatureDisplay';
import { TemperatureValidation } from '../utils/TemperatureValidation';

interface TemperatureDisplayManagerProps {
  temperatures: {
    current: number;
    high: number;
    low: number;
  };
  isSharedView?: boolean;
}

const TemperatureDisplayManager: React.FC<TemperatureDisplayManagerProps> = ({
  temperatures,
  isSharedView = false
}) => {
  const hasValidHigh = TemperatureValidation.isValidTemperature(temperatures.high);
  const hasValidLow = TemperatureValidation.isValidTemperature(temperatures.low);
  const hasValidCurrent = TemperatureValidation.isValidTemperature(temperatures.current);
  
  // For shared views, show range if we have high OR low, otherwise show current
  const shouldShowRange = isSharedView ? (hasValidHigh || hasValidLow) : false;
  const shouldShowCurrent = !shouldShowRange && hasValidCurrent;

  console.log('🌡️ TemperatureDisplayManager: Display decision', {
    isSharedView,
    hasValidHigh,
    hasValidLow,
    hasValidCurrent,
    shouldShowRange,
    shouldShowCurrent,
    temperatures
  });

  if (shouldShowRange) {
    return (
      <TemperatureDisplay
        type="range"
        highTemp={temperatures.high}
        lowTemp={temperatures.low}
      />
    );
  }
  
  if (shouldShowCurrent) {
    return (
      <TemperatureDisplay
        type="current"
        currentTemp={temperatures.current}
      />
    );
  }

  return null;
};

export default TemperatureDisplayManager;
