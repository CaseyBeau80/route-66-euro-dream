
import React from 'react';
import { WeatherData } from './WeatherTypes';
import ThermometerIcon from './ThermometerIcon';
import WeatherDetails from './WeatherDetails';
import ForecastGrid from './ForecastGrid';

interface WeatherDisplayProps {
  weather: WeatherData;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-4 min-w-[320px] border border-blue-200">
      {/* Header with centered city name and weather icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 text-center">
          <h4 className="font-bold text-lg text-gray-800">{weather.cityName}</h4>
        </div>
        <div className="flex items-center">
          <img 
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-12 h-12"
          />
        </div>
      </div>
      
      {/* Main temperature display with gradient thermometer */}
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-3 mb-1">
          <ThermometerIcon />
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-600 font-medium">Currently</span>
            <span className="text-3xl font-bold text-gray-900">{weather.temperature}°F</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 capitalize font-medium">{weather.description}</p>
      </div>
      
      {/* Weather details */}
      <WeatherDetails humidity={weather.humidity} windSpeed={weather.windSpeed} />

      {/* 3-Day Forecast - Horizontal Layout */}
      <ForecastGrid forecast={weather.forecast || []} />
    </div>
  );
};

export default WeatherDisplay;
