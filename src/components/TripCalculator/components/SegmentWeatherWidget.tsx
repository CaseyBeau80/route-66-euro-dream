
import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, AlertTriangle } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface SegmentWeatherWidgetProps {
  segment: DailySegment;
}

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('rain') || lowerCondition.includes('storm')) {
    return <CloudRain className="h-8 w-8 text-blue-500" />;
  }
  if (lowerCondition.includes('snow') || lowerCondition.includes('blizzard')) {
    return <CloudSnow className="h-8 w-8 text-blue-300" />;
  }
  if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
    return <Cloud className="h-8 w-8 text-gray-500" />;
  }
  return <Sun className="h-8 w-8 text-yellow-500" />;
};

const getMockWeatherData = (cityName: string, dayNumber: number) => {
  // Mock weather data based on city and day
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
  const baseTemp = 70;
  const tempVariation = Math.sin(dayNumber * 0.5) * 15;
  
  return {
    condition: conditions[dayNumber % conditions.length],
    high: Math.round(baseTemp + tempVariation + 10),
    low: Math.round(baseTemp + tempVariation - 5),
    humidity: Math.round(40 + (dayNumber * 7) % 40),
    windSpeed: Math.round(5 + (dayNumber * 3) % 15)
  };
};

const SegmentWeatherWidget: React.FC<SegmentWeatherWidgetProps> = ({ segment }) => {
  const weather = getMockWeatherData(segment.endCity, segment.day);
  const isDistantFuture = segment.day > 10;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-travel font-bold text-route66-vintage-brown">
          Weather in {segment.endCity}
        </h4>
        <div className="text-xs text-route66-vintage-brown">
          Day {segment.day}
        </div>
      </div>

      {isDistantFuture ? (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded border border-yellow-200">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">Long-range forecast unavailable</p>
            <p className="text-xs">Weather forecasts are only available for the next 10 days. Check closer to your travel date.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Weather Icon and Condition */}
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="font-semibold text-gray-800">{weather.condition}</div>
              <div className="text-sm text-gray-600">Day {segment.day} of trip</div>
            </div>
          </div>

          {/* Temperature Range */}
          <div className="flex items-center justify-between bg-white rounded p-2">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{weather.high}°F</div>
              <div className="text-xs text-gray-500">High</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{weather.low}°F</div>
              <div className="text-xs text-gray-500">Low</div>
            </div>
          </div>

          {/* Additional Weather Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between bg-white rounded p-1">
              <span className="text-gray-600">Humidity:</span>
              <span className="font-semibold">{weather.humidity}%</span>
            </div>
            <div className="flex justify-between bg-white rounded p-1">
              <span className="text-gray-600">Wind:</span>
              <span className="font-semibold">{weather.windSpeed} mph</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentWeatherWidget;
