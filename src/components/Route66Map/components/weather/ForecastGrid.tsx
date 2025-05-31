
import React from 'react';
import { Calendar } from 'lucide-react';
import { ForecastDay } from './WeatherTypes';

interface ForecastGridProps {
  forecast: ForecastDay[];
  showHeader?: boolean;
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast, showHeader = false }) => {
  console.log('🔍 ForecastGrid: Received forecast data:', forecast);
  
  if (!forecast || forecast.length === 0) {
    console.log('⚠️ ForecastGrid: No forecast data available');
    return null;
  }

  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-orange-600" />
          <h5 className="font-semibold text-sm text-orange-900">3-Day Forecast</h5>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        {forecast.map((day, index) => {
          console.log(`🔍 ForecastGrid: Processing day ${index}:`, day);
          const dayLabel = getDayLabel(index);
          console.log(`🔍 ForecastGrid: Day ${index} - Label: ${dayLabel}`);
          
          return (
            <div key={index} className="flex flex-col items-center bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg px-2 py-3 min-h-[110px] border border-orange-300 shadow-sm">
              {/* Day label at top */}
              <div className="text-xs font-bold text-orange-800 mb-2 uppercase tracking-wide">
                {dayLabel}
              </div>
              
              {/* Weather icon */}
              <div className="mb-2">
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-10 h-10"
                />
              </div>
              
              {/* High temperature - larger and prominent */}
              <div className="text-lg font-black text-orange-900 mb-1">
                {day.temperature.high}°
              </div>
              
              {/* Low temperature - smaller and muted */}
              <div className="text-sm text-orange-700 font-semibold">
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
