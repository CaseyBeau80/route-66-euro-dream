
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
  
  // FIXED: Only show range if we have DIFFERENT high/low values
  const hasValidRange = hasValidHigh && hasValidLow && temperatures.high !== temperatures.low;
  
  // For shared views, prioritize range over current, but only if range is valid
  const shouldShowRange = isSharedView ? hasValidRange : hasValidRange;
  const shouldShowCurrent = !shouldShowRange && hasValidCurrent;

  console.log('🌡️ TemperatureDisplayManager: FIXED Display decision', {
    isSharedView,
    hasValidHigh,
    hasValidLow,
    hasValidCurrent,
    hasValidRange,
    shouldShowRange,
    shouldShowCurrent,
    temperatures,
    highLowSame: temperatures.high === temperatures.low
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
