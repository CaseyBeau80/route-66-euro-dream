
import React from 'react';
import { Route, Clock, MapPin, AlertTriangle } from 'lucide-react';
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

  const stats = [
    {
      icon: Route,
      label: 'Distance',
      value: formatDistance(segmentDistance),
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      label: 'Drive Time',
      value: `${formattedDriveTime} driving`,
      color: segment.driveTimeHours > 7 ? 'text-orange-600' : 'text-green-600'
    },
    {
      icon: MapPin,
      label: 'Start',
      value: segment.startCity || 'Unknown',
      color: 'text-gray-600'
    },
    {
      icon: MapPin,
      label: 'End',
      value: segment.endCity,
      color: 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg p-3 text-center shadow-sm">
            <div className="flex items-center justify-center mb-2">
              <IconComponent className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-xs text-gray-500 font-medium mb-1">
              {stat.label}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {stat.value}
            </div>
          </div>
        );
      })}
      
      {segment.driveTimeHours > 7 && (
        <div className="col-span-2 md:col-span-4 mt-2">
          <div className="flex items-center justify-center gap-2 text-orange-600 bg-orange-50 rounded-lg p-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-medium">Long Drive Day - Consider breaking this up</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySegmentCardStats;
