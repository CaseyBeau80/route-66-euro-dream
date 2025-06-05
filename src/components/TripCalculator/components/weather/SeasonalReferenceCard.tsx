
import React from 'react';
import { Calendar, Info } from 'lucide-react';
import { getSeasonalWeatherData } from './SeasonalWeatherService';

interface SeasonalReferenceCardProps {
  segmentDate: Date;
  cityName: string;
}

const SeasonalReferenceCard: React.FC<SeasonalReferenceCardProps> = ({ 
  segmentDate, 
  cityName 
}) => {
  const seasonalData = getSeasonalWeatherData(cityName, segmentDate.getMonth() + 1);
  const monthName = segmentDate.toLocaleDateString('en-US', { month: 'long' });
  
  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
      <div className="flex items-start gap-2 mb-2">
        <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-blue-900 text-sm">
            Typical {monthName} Weather
          </div>
          <div className="text-xs text-blue-700">
            What you can usually expect during this time of year
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-800">
            {seasonalData.high}°F
          </div>
          <div className="text-xs text-blue-600">Typical High</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-800">
            {seasonalData.low}°F
          </div>
          <div className="text-xs text-blue-600">Typical Low</div>
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <div className="text-sm font-medium text-blue-800">
          {seasonalData.condition}
        </div>
      </div>
      
      <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
        <Info className="h-3 w-3" />
        <span>Historical averages for this region</span>
      </div>
    </div>
  );
};

export default SeasonalReferenceCard;
