
import React from 'react';
import { WeatherData } from './WeatherTypes';
import ForecastGrid from './ForecastGrid';

interface WeatherDisplayProps {
  weather: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-4 min-w-[320px] border border-blue-200">
      {/* Header with centered city name only */}
      <div className="text-center mb-4">
        <h4 className="font-bold text-lg text-gray-800">{weather.cityName}</h4>
      </div>

      {/* 3-Day Forecast - Horizontal Layout */}
      <ForecastGrid forecast={weather.forecast || []} />
    </div>
  );
};

export default WeatherDisplay;
