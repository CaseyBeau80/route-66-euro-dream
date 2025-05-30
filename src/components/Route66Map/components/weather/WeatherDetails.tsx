
import React from 'react';
import { Droplets, Wind } from 'lucide-react';

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ humidity, windSpeed }) => {
  return (
    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200 mb-4">
      <div className="flex items-center gap-2 bg-white rounded-md px-2 py-1">
        <Droplets className="w-4 h-4 text-blue-500" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Humidity</span>
          <span className="text-sm font-semibold text-gray-800">{humidity}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-md px-2 py-1">
        <Wind className="w-4 h-4 text-green-500" />
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Wind</span>
          <span className="text-sm font-semibold text-gray-800">{windSpeed} mph</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
