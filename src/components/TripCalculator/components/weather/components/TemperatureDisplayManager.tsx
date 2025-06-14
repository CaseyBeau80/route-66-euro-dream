
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
  
  // FIXED: For shared views, ALWAYS prioritize range display if we have ANY high/low data
  // Even if high === low, we show it as a range in shared views
  const hasAnyRangeData = hasValidHigh || hasValidLow;
  
  // For shared views: show range if ANY range data exists, never show current
  // For regular views: show range only if we have DIFFERENT high/low values
  const shouldShowRange = isSharedView ? hasAnyRangeData : (hasValidHigh && hasValidLow && temperatures.high !== temperatures.low);
  const shouldShowCurrent = !isSharedView && !shouldShowRange && hasValidCurrent;

  console.log('🌡️ TemperatureDisplayManager: PLAN IMPLEMENTATION Display decision', {
    isSharedView,
    hasValidHigh,
    hasValidLow,
    hasValidCurrent,
    hasAnyRangeData,
    shouldShowRange,
    shouldShowCurrent,
    temperatures,
    planImplementation: 'prioritize_range_in_shared_views'
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
