
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WeatherErrorProps {
  error: string;
}

const WeatherError: React.FC<WeatherErrorProps> = ({ error }) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 rounded border border-red-200">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <div className="text-sm text-red-800">
        <p className="font-semibold">Weather unavailable</p>
        <p className="text-xs">{error}</p>
      </div>
    </div>
  );
};

export default WeatherError;
