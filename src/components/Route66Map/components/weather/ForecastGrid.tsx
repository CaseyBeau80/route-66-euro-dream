
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
    return (
      <div className="text-center text-gray-500 py-4">
        <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No forecast data available</p>
      </div>
    );
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
          console.log(`🔍 ForecastGrid: Rendering day ${index}:`, day);
          const { dayLabel, dateLabel } = getDayAndDateLabels(index);
          console.log(`🔍 ForecastGrid: Day ${index} - Day: ${dayLabel}, Date: ${dateLabel}`);
          
          // Validate weather icon
          const weatherIconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
          console.log(`🌤️ Weather icon URL for day ${index}:`, weatherIconUrl);
          
          return (
            <div key={index} className="flex flex-col items-center bg-gradient-to-b from-white to-gray-50 rounded-lg px-2 py-3 min-h-[140px] border border-gray-300 shadow-sm flex-1 max-w-none hover:shadow-md transition-shadow">
              {/* Day of week - moved to top */}
              <div className="text-sm font-bold text-gray-900 mb-1">
                {dayLabel}
              </div>
              
              {/* Date - smaller, under day */}
              <div className="text-xs text-gray-600 mb-2">
                {dateLabel}
              </div>
              
              {/* Weather icon with error handling */}
              <div className="mb-2 flex items-center justify-center h-10">
                <img 
                  src={weatherIconUrl}
                  alt={day.description}
                  className="w-10 h-10"
                  onError={(e) => {
                    console.error(`❌ Failed to load weather icon for day ${index}:`, weatherIconUrl);
                    e.currentTarget.style.display = 'none';
                  }}
                  onLoad={() => {
                    console.log(`✅ Successfully loaded weather icon for day ${index}`);
                  }}
                />
              </div>
              
              {/* High temperature - large and prominent */}
              <div className="text-lg font-bold text-gray-800 mb-1">
                {day.temperature.high}°
              </div>
              
              {/* Low temperature - smaller and muted */}
              <div className="text-sm text-gray-600 mb-2">
                {day.temperature.low}°
              </div>
              
              {/* Precipitation chance */}
              <div className="text-xs text-blue-600 font-medium mb-1">
                {day.precipitationChance || '0'}%
              </div>
              
              {/* Weather description - truncated */}
              <div className="text-xs text-gray-500 text-center leading-tight">
                {day.description}
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
  
  let dayLabel: string;
  if (index === 0) {
    dayLabel = 'Today';
  } else if (index === 1) {
    dayLabel = 'Tomorrow';
  } else {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayLabel = dayNames[targetDate.getDay()];
  }
  
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  const dateLabel = `${month}/${day}`;
  
  console.log(`📅 Generated labels for day ${index}: ${dayLabel} ${dateLabel}`);
  
  return { dayLabel, dateLabel };
};

export default ForecastGrid;
