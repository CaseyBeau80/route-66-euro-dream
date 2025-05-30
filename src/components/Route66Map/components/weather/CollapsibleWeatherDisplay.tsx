
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { WeatherData } from './WeatherTypes';
import ThermometerIcon from './ThermometerIcon';
import WeatherDetails from './WeatherDetails';
import ForecastGrid from './ForecastGrid';

interface CollapsibleWeatherDisplayProps {
  weather: WeatherData;
}

const CollapsibleWeatherDisplay: React.FC<CollapsibleWeatherDisplayProps> = ({ weather }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg border border-blue-200 min-w-[280px]">
      {/* Compact header - always visible */}
      <div 
        className="p-3 cursor-pointer hover:bg-blue-50 transition-colors rounded-lg"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-10 h-10"
            />
            <div>
              <h4 className="font-bold text-lg text-gray-800">{weather.cityName}</h4>
              <div className="flex items-center gap-2">
                <ThermometerIcon />
                <span className="text-2xl font-bold text-gray-900">{weather.temperature}°F</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm text-gray-600 capitalize mb-1">{weather.description}</p>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-blue-200">
          <div className="pt-3">
            <WeatherDetails humidity={weather.humidity} windSpeed={weather.windSpeed} />
            <ForecastGrid forecast={weather.forecast || []} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleWeatherDisplay;
