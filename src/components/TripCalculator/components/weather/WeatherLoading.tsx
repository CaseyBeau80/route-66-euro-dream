
import React from 'react';
import { Cloud } from 'lucide-react';

const WeatherLoading: React.FC = () => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 p-2">
      <Cloud className="w-4 h-4 animate-pulse" />
      <span>Loading current weather...</span>
    </div>
  );
};

export default WeatherLoading;
