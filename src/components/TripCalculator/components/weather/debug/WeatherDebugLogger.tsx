
import React from 'react';

interface WeatherDebugLoggerProps {
  componentName: string;
  segmentDay: number;
  segmentEndCity: string;
  data: Record<string, any>;
  isEnabled?: boolean;
}

const WeatherDebugLogger: React.FC<WeatherDebugLoggerProps> = ({
  componentName,
  segmentDay,
  segmentEndCity,
  data,
  isEnabled = process.env.NODE_ENV === 'development'
}) => {
  React.useEffect(() => {
    if (!isEnabled) return;
    
    console.log(`🚨 [DEBUG] ${componentName} - Day ${segmentDay} - ${segmentEndCity}`, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }, [componentName, segmentDay, segmentEndCity, data, isEnabled]);

  return null;
};

export default WeatherDebugLogger;
