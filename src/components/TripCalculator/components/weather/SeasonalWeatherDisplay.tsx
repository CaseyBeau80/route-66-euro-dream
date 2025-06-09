
import React from 'react';

interface SeasonalWeatherDisplayProps {
  segmentDate: Date;
  cityName: string;
  compact?: boolean;
}

const SeasonalWeatherDisplay: React.FC<SeasonalWeatherDisplayProps> = ({ 
  segmentDate, 
  cityName,
  compact = false
}) => {
  const getSeasonalInfo = (date: Date, city: string) => {
    // Validate the date
    if (!date || isNaN(date.getTime())) {
      console.warn('⚠️ SeasonalWeatherDisplay: Invalid date provided', date);
      // Return default seasonal info for current month as fallback
      const currentDate = new Date();
      return getSeasonForDate(currentDate);
    }

    return getSeasonForDate(date);
  };

  const getSeasonForDate = (date: Date) => {
    const month = date.getMonth(); // 0-11
    
    // Define seasons based on meteorological calendar
    let season: string;
    let tempRange: { low: number; high: number };
    let description: string;
    let icon: string;
    
    // Spring: March-May
    if (month >= 2 && month <= 4) {
      season = "Spring";
      tempRange = { low: 45, high: 75 };
      description = "Mild temperatures with variable weather";
      icon = "🌸";
    }
    // Summer: June-August  
    else if (month >= 5 && month <= 7) {
      season = "Summer";
      tempRange = { low: 65, high: 95 };
      description = "Hot and dry conditions";
      icon = "☀️";
    }
    // Fall: September-November
    else if (month >= 8 && month <= 10) {
      season = "Fall";
      tempRange = { low: 50, high: 80 };
      description = "Pleasant temperatures with clear skies";
      icon = "🍂";
    }
    // Winter: December-February
    else {
      season = "Winter";
      tempRange = { low: 30, high: 60 };
      description = "Cool temperatures, generally dry";
      icon = "❄️";
    }
    
    return { season, tempRange, description, icon };
  };

  // Handle invalid date gracefully
  if (!segmentDate || isNaN(segmentDate.getTime())) {
    console.warn('⚠️ SeasonalWeatherDisplay: No valid date provided for', cityName);
    
    if (compact) {
      return (
        <div className="text-sm text-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🌤️</span>
            <span className="font-medium">Weather Information</span>
          </div>
          <p className="text-xs text-gray-600">Date not available for weather forecast</p>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🌤️</span>
          <div>
            <h4 className="font-semibold text-gray-800">Weather Information</h4>
            <p className="text-sm text-gray-600">Date not available for seasonal forecast</p>
          </div>
        </div>
      </div>
    );
  }

  const seasonalInfo = getSeasonalInfo(segmentDate, cityName);
  
  if (compact) {
    return (
      <div className="text-sm text-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{seasonalInfo.icon}</span>
          <span className="font-medium">{seasonalInfo.season} Weather</span>
        </div>
        <p className="text-xs text-gray-600 mb-2">{seasonalInfo.description}</p>
        <div className="flex items-center gap-4 text-xs">
          <span>High: <strong>{seasonalInfo.tempRange.high}°F</strong></span>
          <span>Low: <strong>{seasonalInfo.tempRange.low}°F</strong></span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{seasonalInfo.icon}</span>
        <div>
          <h4 className="font-semibold text-gray-800">{seasonalInfo.season} Weather in {cityName}</h4>
          <p className="text-sm text-gray-600">{seasonalInfo.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-500 mb-1">{seasonalInfo.tempRange.high}°F</div>
          <div className="text-xs text-gray-600">Expected High</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-500 mb-1">{seasonalInfo.tempRange.low}°F</div>
          <div className="text-xs text-gray-600">Expected Low</div>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
        <strong>Note:</strong> This is seasonal weather information. For live forecasts, visit the trip planner with an API key.
      </div>
    </div>
  );
};

export default SeasonalWeatherDisplay;
