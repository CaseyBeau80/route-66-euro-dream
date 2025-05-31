
import React from 'react';
import { WeatherData } from './WeatherTypes';
import ForecastGrid from './ForecastGrid';

interface WeatherDisplayProps {
  weather: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  console.log('🌤️ WeatherDisplay: Rendering with weather data:', weather);
  console.log('🌤️ WeatherDisplay: Forecast data:', weather.forecast);
  
  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-lg p-4 w-full border-2 border-orange-300 overflow-hidden">
      {/* Header with centered city name only */}
      <div className="text-center mb-4">
        <h4 className="font-bold text-lg text-orange-900">{weather.cityName}</h4>
      </div>

      {/* Integrated 3-Day Forecast */}
      <ForecastGrid forecast={weather.forecast || []} showHeader={true} />
    </div>
  );
};

export default WeatherDisplay;
