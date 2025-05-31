
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cloud } from 'lucide-react';
import { WeatherData } from './WeatherTypes';
import ForecastGrid from './ForecastGrid';

interface CollapsibleWeatherDisplayProps {
  weather: WeatherData;
}

const CollapsibleWeatherDisplay: React.FC<CollapsibleWeatherDisplayProps> = ({ weather }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    console.log('🔄 CollapsibleWeatherDisplay: Toggling expanded state', !isExpanded);
    setIsExpanded(!isExpanded);
  };

  console.log('🌤️ CollapsibleWeatherDisplay: Rendering with weather data:', weather);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg border border-blue-200 min-w-[280px]">
      {/* Header with weather icon, "Weather" title and expand/collapse button */}
      <div 
        className="p-3 cursor-pointer hover:bg-blue-50 transition-colors rounded-lg flex items-center justify-between"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          <h4 className="font-bold text-lg text-gray-800">Weather</h4>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600" />
        )}
      </div>

      {/* Expanded content - show forecast */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-blue-200">
          <div className="pt-3">
            <ForecastGrid forecast={weather.forecast || []} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleWeatherDisplay;
