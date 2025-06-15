
import React from 'react';
import { Route, Clock, MapPin } from 'lucide-react';
import { DailySegment } from '../services/planning/TripPlanBuilder';

interface DaySegmentCardStatsProps {
  segment: DailySegment;
  formattedDriveTime: string;
  segmentDistance: number;
  driveTimeStyle: {
    bg: string;
    text: string;
    border: string;
  };
}

const DaySegmentCardStats: React.FC<DaySegmentCardStatsProps> = ({
  segment,
  formattedDriveTime,
  segmentDistance
}) => {
  return (
    <div className="grid grid-cols-4 gap-0 bg-white border-b border-gray-200">
      {/* Miles */}
      <div className="p-3 text-center border-r border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center mb-1">
          <Route className="h-4 w-4 text-blue-500" />
        </div>
        <div className="text-lg font-bold text-gray-800">
          {Math.round(segmentDistance)}
        </div>
        <div className="text-xs text-gray-600">miles</div>
      </div>
      
      {/* Drive Time */}
      <div className="p-3 text-center border-r border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center mb-1">
          <Clock className="h-4 w-4 text-purple-500" />
        </div>
        <div className="text-sm font-bold text-gray-800">
          {formattedDriveTime}
        </div>
        <div className="text-xs text-gray-600">drive time</div>
      </div>
      
      {/* From */}
      <div className="p-3 text-center border-r border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center mb-1">
          <MapPin className="h-4 w-4 text-red-500" />
        </div>
        <div className="text-xs font-semibold text-gray-800 uppercase">From</div>
        <div className="text-xs text-gray-600 truncate">
          {segment.startCity || 'Unknown'}
        </div>
      </div>
      
      {/* To */}
      <div className="p-3 text-center bg-gray-50">
        <div className="flex items-center justify-center mb-1">
          <MapPin className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-xs font-semibold text-gray-800 uppercase">To</div>
        <div className="text-xs text-gray-600 truncate">
          {segment.endCity}
        </div>
      </div>
    </div>
  );
};

export default DaySegmentCardStats;
