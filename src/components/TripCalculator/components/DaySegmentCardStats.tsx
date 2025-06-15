
import React from 'react';
import { Route, Clock, MapPin } from 'lucide-react';
import { useUnits } from '@/contexts/UnitContext';
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
  const { formatDistance } = useUnits();

  return (
    <div className="grid grid-cols-4 gap-0 bg-white border-l border-r border-gray-200">
      {/* Miles */}
      <div className="p-4 text-center border-r border-gray-200">
        <div className="flex items-center justify-center mb-2">
          <Route className="h-5 w-5 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-blue-600">
          {Math.round(segmentDistance)}
        </div>
        <div className="text-xs text-gray-600 font-medium">Miles</div>
      </div>
      
      {/* Drive Time */}
      <div className="p-4 text-center border-r border-gray-200">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-5 w-5 text-purple-500" />
        </div>
        <div className="text-lg font-bold text-purple-600">
          {formattedDriveTime}
        </div>
        <div className="text-xs text-gray-600 font-medium">Drive Time</div>
      </div>
      
      {/* From */}
      <div className="p-4 text-center border-r border-gray-200">
        <div className="flex items-center justify-center mb-2">
          <MapPin className="h-5 w-5 text-red-500" />
        </div>
        <div className="text-sm font-bold text-gray-800">From</div>
        <div className="text-xs text-gray-600 font-medium">
          {segment.startCity || 'Unknown'}
        </div>
      </div>
      
      {/* To */}
      <div className="p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <MapPin className="h-5 w-5 text-green-500" />
        </div>
        <div className="text-sm font-bold text-gray-800">To</div>
        <div className="text-xs text-gray-600 font-medium">
          {segment.endCity}
        </div>
      </div>
    </div>
  );
};

export default DaySegmentCardStats;
