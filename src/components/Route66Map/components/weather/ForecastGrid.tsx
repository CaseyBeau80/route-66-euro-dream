
import React from 'react';
import { Calendar } from 'lucide-react';
import { ForecastDay } from './WeatherTypes';

interface ForecastGridProps {
  forecast: ForecastDay[];
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  console.log('🔍 ForecastGrid: Received forecast data:', forecast);
  
  if (!forecast || forecast.length === 0) {
    console.log('⚠️ ForecastGrid: No forecast data available');
    return null;
  }

  return (
    <div className="border-t border-blue-200 pt-3">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h5 className="font-semibold text-sm text-gray-800">3-Day Forecast</h5>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {forecast.map((day, index) => {
          console.log(`🔍 ForecastGrid: Processing day ${index}:`, day);
          const dayLabel = getDayLabel(index);
          console.log(`🔍 ForecastGrid: Day ${index} - Label: ${dayLabel}`);
          
          return (
            <div key={index} className="flex flex-col items-center bg-gray-50 rounded-lg px-2 py-3 min-h-[100px]">
              {/* Day label at top */}
              <div className="text-xs font-medium text-gray-700 mb-1">
                {dayLabel}
              </div>
              
              {/* Weather icon */}
              <div className="mb-1">
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-8 h-8"
                />
              </div>
              
              {/* High temperature - larger and prominent */}
              <div className="text-lg font-bold text-gray-900 mb-1">
                {day.temperature.high}°
              </div>
              
              {/* Low temperature - smaller and muted */}
              <div className="text-xs text-gray-500">
                {day.temperature.low}°
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to get day label based on index
const getDayLabel = (index: number): string => {
  if (index === 0) {
    return 'Today';
  } else if (index === 1) {
    return 'Tomorrow';
  } else if (index === 2) {
    return 'Next Day';
  }
  return `Day ${index + 1}`;
};

export default ForecastGrid;
