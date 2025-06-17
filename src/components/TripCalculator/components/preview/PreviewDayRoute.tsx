
import React from 'react';
import { MapPin } from 'lucide-react';

interface PreviewDayRouteProps {
  startCity: string;
  endCity: string;
  distance: number;
}

const PreviewDayRoute: React.FC<PreviewDayRouteProps> = ({ startCity, endCity, distance }) => {
  return (
    <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <div className="flex-1">
        <div className="font-semibold text-gray-800">
          {startCity} → {endCity}
        </div>
        <div className="text-sm text-gray-600">
          Route 66 • {Math.round(distance)} miles
        </div>
      </div>
    </div>
  );
};

export default PreviewDayRoute;
