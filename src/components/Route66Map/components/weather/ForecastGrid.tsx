
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
    <div className="space-y-2">
      {showHeader && (
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-3 h-3 text-orange-600" />
          <h5 className="font-semibold text-xs text-orange-900">3-Day Forecast</h5>
        </div>
      )}
      <div className="grid grid-cols-3 gap-2">
        {forecast.map((day, index) => {
          console.log(`🔍 ForecastGrid: Processing day ${index}:`, day);
          const dayLabel = getDayLabel(index);
          console.log(`🔍 ForecastGrid: Day ${index} - Label: ${dayLabel}`);
          
          return (
            <div key={index} className="flex flex-col items-center bg-gradient-to-b from-orange-50 to-orange-100 rounded-lg px-1 py-2 min-h-[90px] border border-orange-300 shadow-sm">
              {/* Day label at top - smaller font */}
              <div className="text-xs font-bold text-orange-800 mb-1 uppercase tracking-wide">
                {dayLabel}
              </div>
              
              {/* Weather icon - smaller */}
              <div className="mb-1">
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-8 h-8"
                />
              </div>
              
              {/* High temperature - smaller and prominent */}
              <div className="text-sm font-black text-orange-900 mb-1">
                {day.temperature.high}°
              </div>
              
              {/* Low temperature - smaller and muted */}
              <div className="text-xs text-orange-700 font-semibold">
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
