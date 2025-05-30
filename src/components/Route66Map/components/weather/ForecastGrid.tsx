
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
                {getDayLabel(index)}
              </div>
              <div className="text-sm text-gray-500">
                {formatDateFromForecast(day.date)}
              </div>
            </div>
          </div>
        ))}
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
  // The date comes from WeatherDataProcessor in format like "Sat, May 31"
  // We need to extract just the month and day part
  try {
    // Parse the date string that comes in format "Sat, May 31"
    const parts = dateString.split(', ');
    if (parts.length >= 2) {
      const monthDay = parts[1]; // "May 31"
      const [monthName, day] = monthDay.split(' ');
      
      // Convert month name to number
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthNumber = monthNames.indexOf(monthName) + 1;
      
      if (monthNumber > 0) {
        return `${monthNumber}/${day}`;
      }
    }
    
    // Fallback: if parsing fails, try to extract numbers
    const dateMatch = dateString.match(/(\d+)/g);
    if (dateMatch && dateMatch.length >= 2) {
      return `${dateMatch[0]}/${dateMatch[1]}`;
    }
    
    // Final fallback
    return dateString;
  } catch (error) {
    console.error('Error formatting forecast date:', error);
    return dateString;
  }
};

export default ForecastGrid;
