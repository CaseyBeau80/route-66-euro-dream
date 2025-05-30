
import React from 'react';
import { Calendar } from 'lucide-react';
import { ForecastDay } from './WeatherTypes';

interface ForecastGridProps {
  forecast: ForecastDay[];
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-blue-200 pt-3">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h5 className="font-semibold text-sm text-gray-800">2-Day Forecast</h5>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center bg-white rounded-md px-2 py-3">
            <p className="text-xs font-medium text-gray-800 mb-1">{day.date}</p>
            <img 
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className="w-8 h-8 mb-1"
            />
            <p className="text-xs text-gray-500 capitalize text-center mb-2">{day.description}</p>
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-gray-900">{day.temperature.high}°</span>
              <span className="text-xs text-gray-500">{day.temperature.low}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastGrid;
