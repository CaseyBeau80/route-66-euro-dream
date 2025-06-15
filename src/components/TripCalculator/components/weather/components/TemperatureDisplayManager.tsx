
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
  
  // Always prioritize high/low range display
  const shouldShowRange = React.useMemo(() => {
    return hasValidHigh && hasValidLow;
  }, [hasValidHigh, hasValidLow]);

  const shouldShowCurrent = React.useMemo(() => {
    return !shouldShowRange && hasValidCurrent;
  }, [shouldShowRange, hasValidCurrent]);

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
