
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
        <h5 className="font-semibold text-sm text-gray-800">2-Day Forecast</h5>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {forecast.map((day, index) => {
          console.log(`🔍 ForecastGrid: Processing day ${index}:`, day);
          const formattedDate = formatDateFromForecast(day.date);
          const dayLabel = getDayLabel(index);
          console.log(`🔍 ForecastGrid: Day ${index} - Label: ${dayLabel}, Date: ${formattedDate}`);
          
          return (
            <div key={index} className="flex flex-col items-center bg-gray-50 rounded-lg px-3 py-4 min-h-[120px]">
              {/* Day label at top */}
              <div className="text-sm font-medium text-gray-700 mb-2">
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
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {day.temperature.high}°
              </div>
              
              {/* Low temperature - smaller and muted */}
              <div className="text-sm text-gray-500">
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
    return 'Tomorrow';
  } else if (index === 1) {
    return 'Day After';
  }
  return `Day ${index + 1}`;
};

// Helper function to format date from forecast data
const formatDateFromForecast = (dateString: string): string => {
  console.log('🔍 formatDateFromForecast: Input dateString:', dateString);
  
  try {
    // Parse the date string that comes in format "Sat, May 31"
    const parts = dateString.split(', ');
    console.log('🔍 formatDateFromForecast: Split parts:', parts);
    
    if (parts.length >= 2) {
      const monthDay = parts[1]; // "May 31"
      const [monthName, day] = monthDay.split(' ');
      console.log('🔍 formatDateFromForecast: Month:', monthName, 'Day:', day);
      
      // Convert month name to number
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthNumber = monthNames.indexOf(monthName) + 1;
      console.log('🔍 formatDateFromForecast: Month number:', monthNumber);
      
      if (monthNumber > 0) {
        const result = `${monthNumber}/${day}`;
        console.log('🔍 formatDateFromForecast: Final result:', result);
        return result;
      }
    }
    
    // Fallback: if parsing fails, try to extract numbers
    const dateMatch = dateString.match(/(\d+)/g);
    if (dateMatch && dateMatch.length >= 2) {
      const fallbackResult = `${dateMatch[0]}/${dateMatch[1]}`;
      console.log('🔍 formatDateFromForecast: Fallback result:', fallbackResult);
      return fallbackResult;
    }
    
    // Final fallback
    console.log('🔍 formatDateFromForecast: Using original string as final fallback');
    return dateString;
  } catch (error) {
    console.error('❌ formatDateFromForecast: Error formatting forecast date:', error);
    return dateString;
  }
};

export default ForecastGrid;
