
import React from 'react';
import TemperatureDisplay from '../TemperatureDisplay';

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
  // Helper function to validate individual temperature values
  const isValidTemperature = (temp: number): boolean => {
    return !isNaN(temp) && temp > -150 && temp < 150;
  };

  const hasValidHigh = isValidTemperature(temperatures.high);
  const hasValidLow = isValidTemperature(temperatures.low);
  const hasValidCurrent = isValidTemperature(temperatures.current);
  
  // PLAN IMPLEMENTATION: Enhanced stable display logic with comprehensive logging
  const shouldShowRange = React.useMemo(() => {
    console.log('🌡️ PLAN: Enhanced TemperatureDisplayManager analysis', {
      isSharedView,
      temperatures,
      hasValidHigh,
      hasValidLow,
      hasValidCurrent,
      planImplementation: 'enhanced_temperature_analysis'
    });

    if (isSharedView) {
      // PLAN: For shared views: ALWAYS prioritize range if we have ANY high/low data
      const shouldShow = hasValidHigh || hasValidLow;
      console.log('🌡️ PLAN: Shared view range decision:', {
        shouldShow,
        reason: 'prioritize_any_highlow_in_shared_view',
        planImplementation: 'shared_view_priority'
      });
      return shouldShow;
    } else {
      // PLAN: For regular views: show range only if we have DIFFERENT high/low values
      const shouldShow = hasValidHigh && hasValidLow && temperatures.high !== temperatures.low;
      console.log('🌡️ PLAN: Regular view range decision:', {
        shouldShow,
        reason: 'require_different_highlow_in_regular_view',
        highLowSame: temperatures.high === temperatures.low,
        planImplementation: 'regular_view_logic'
      });
      return shouldShow;
    }
  }, [isSharedView, hasValidHigh, hasValidLow, temperatures.high, temperatures.low, hasValidCurrent]);

  console.log('🌡️ PLAN: Enhanced TemperatureDisplayManager final decision', {
    isSharedView,
    shouldShowRange,
    temperatures,
    hasValidHigh,
    hasValidLow,
    hasValidCurrent,
    planImplementation: 'enhanced_final_decision'
  });

  if (shouldShowRange) {
    console.log('🌡️ PLAN: Rendering temperature range display');
    return (
      <TemperatureDisplay
        type="range"
        highTemp={temperatures.high}
        lowTemp={temperatures.low}
      />
    );
  }

  console.log('🌡️ PLAN: No temperature display - no valid data available');
  return null;
};

export default TemperatureDisplayManager;
