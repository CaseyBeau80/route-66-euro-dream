
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
      <div className="grid grid-cols-2 gap-3">
        {forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center bg-gray-100 rounded-2xl px-4 py-6 min-h-[180px]">
            {/* High temperature */}
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {day.temperature.high}°
            </div>
            
            {/* Low temperature */}
            <div className="text-lg text-gray-500 mb-4">
              {day.temperature.low}°
            </div>
            
            {/* Weather icon */}
            <div className="mb-4">
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="w-12 h-12"
              />
            </div>
            
            {/* Day label */}
            <div className="text-center">
              <div className="text-base font-semibold text-gray-900 mb-1">
                {index === 0 ? 'Tomorrow' : getDayAfterTomorrow()}
              </div>
              <div className="text-sm text-gray-500">
                {formatDateShort(day.date)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get "Day After" label
const getDayAfterTomorrow = (): string => {
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  return dayAfter.toLocaleDateString('en-US', { weekday: 'short' });
};

// Helper function to format date as M/D
const formatDateShort = (dateString: string): string => {
  // Parse the date string and format it as M/D
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  
  // Since we're showing tomorrow and day after, format accordingly
  return tomorrow.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
};

export default ForecastGrid;
