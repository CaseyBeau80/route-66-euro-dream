
import React from 'react';
import { Thermometer, Eye, AlertTriangle } from 'lucide-react';

interface WeatherStatusBadgeProps {
  type: 'current' | 'seasonal' | 'unavailable';
  description?: string;
  dateString?: string;
}

const WeatherStatusBadge: React.FC<WeatherStatusBadgeProps> = ({ type, description, dateString }) => {
  if (type === 'current') {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
        <Thermometer className="h-4 w-4 text-green-600" />
        <div className="text-xs text-green-800">
          <span className="font-semibold">Current conditions</span> - Live weather data
        </div>
      </div>
    );
  }

  if (type === 'seasonal') {
    return (
      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
        <Eye className="h-4 w-4 text-blue-600" />
        <div className="text-xs text-blue-800">
          <span className="font-semibold">Seasonal estimate</span> - {description}
        </div>
      </div>
    );
  }

  if (type === 'unavailable') {
    return (
      <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded border border-yellow-200">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <div className="text-sm text-yellow-800">
          <p className="font-semibold">Weather forecast unavailable</p>
          <p className="text-xs">{description}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherStatusBadge;
