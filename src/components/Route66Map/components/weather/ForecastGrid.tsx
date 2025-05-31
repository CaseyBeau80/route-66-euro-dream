
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
    <div className="space-y-2 w-full">
      {showHeader && (
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-3 h-3 text-orange-600" />
          <h5 className="font-semibold text-xs text-orange-900">3-Day Forecast</h5>
        </div>
      )}
      <div className="grid grid-cols-3 gap-1 w-full">
        {forecast.map((day, index) => {
          console.log(`🔍 ForecastGrid: Processing day ${index}:`, day);
          const { dayLabel, dateLabel } = getDayAndDateLabels(index);
          console.log(`🔍 ForecastGrid: Day ${index} - Day: ${dayLabel}, Date: ${dateLabel}`);
          
          return (
            <div key={index} className="flex flex-col items-center bg-gray-100 rounded-lg px-2 py-3 min-h-[120px] border border-gray-200 shadow-sm flex-1 max-w-none">
              {/* High temperature - large and prominent */}
              <div className="text-xl font-bold text-gray-800 mb-1">
                {day.temperature.high}°
              </div>
              
              {/* Low temperature - smaller and muted */}
              <div className="text-sm text-gray-600 mb-2">
                {day.temperature.low}°
              </div>
              
              {/* Weather icon */}
              <div className="mb-2">
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className="w-8 h-8"
                />
              </div>
              
              {/* Precipitation chance */}
              <div className="text-sm text-blue-600 font-medium mb-2">
                {day.precipitationChance || '0'}%
              </div>
              
              {/* Day of week */}
              <div className="text-sm font-medium text-gray-800 mb-1">
                {dayLabel}
              </div>
              
              {/* Date */}
              <div className="text-sm text-gray-600">
                {dateLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to get day and date labels based on index
const getDayAndDateLabels = (index: number): { dayLabel: string; dateLabel: string } => {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + index);
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayLabel = dayNames[targetDate.getDay()];
  
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const dateLabel = `${month}/${day}`;
  
  return { dayLabel, dateLabel };
};

export default ForecastGrid;
