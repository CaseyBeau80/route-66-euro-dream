
import React from 'react';

interface SimpleTemperatureDisplayProps {
  weather: {
    temperature?: number;
    highTemp?: number;
    lowTemp?: number;
  };
  isSharedView?: boolean;
}

const SimpleTemperatureDisplay: React.FC<SimpleTemperatureDisplayProps> = ({
  weather,
  isSharedView = false
}) => {
  const hasHigh = typeof weather.highTemp === 'number' && !isNaN(weather.highTemp);
  const hasLow = typeof weather.lowTemp === 'number' && !isNaN(weather.lowTemp);
  const hasCurrent = typeof weather.temperature === 'number' && !isNaN(weather.temperature);

  // In shared view, prefer high/low if available
  if (isSharedView && (hasHigh || hasLow)) {
    return (
      <div className="text-2xl font-bold text-blue-600">
        {hasHigh && hasLow ? (
          <span>{Math.round(weather.highTemp!)}° / {Math.round(weather.lowTemp!)}°</span>
        ) : hasHigh ? (
          <span>High {Math.round(weather.highTemp!)}°</span>
        ) : (
          <span>Low {Math.round(weather.lowTemp!)}°</span>
        )}
      </div>
    );
  }

  // Fallback to current temperature
  if (hasCurrent) {
    return (
      <div className="text-2xl font-bold text-blue-600">
        {Math.round(weather.temperature!)}°F
      </div>
    );
  }

  return null;
};

export default SimpleTemperatureDisplay;
