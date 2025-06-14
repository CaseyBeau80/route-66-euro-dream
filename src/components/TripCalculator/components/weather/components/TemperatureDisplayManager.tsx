
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
  
  // FIXED: Stable display logic - prevent flickering
  const shouldShowRange = React.useMemo(() => {
    if (isSharedView) {
      // For shared views: ALWAYS prioritize range if we have ANY high/low data
      return hasValidHigh || hasValidLow;
    } else {
      // For regular views: show range only if we have DIFFERENT high/low values
      return hasValidHigh && hasValidLow && temperatures.high !== temperatures.low;
    }
  }, [isSharedView, hasValidHigh, hasValidLow, temperatures.high, temperatures.low]);

  const shouldShowCurrent = React.useMemo(() => {
    return !isSharedView && !shouldShowRange && hasValidCurrent;
  }, [isSharedView, shouldShowRange, hasValidCurrent]);

  console.log('🌡️ FIXED: TemperatureDisplayManager stable decision', {
    isSharedView,
    shouldShowRange,
    shouldShowCurrent,
    temperatures,
    hasValidHigh,
    hasValidLow,
    hasValidCurrent,
    preventFlickering: true
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
