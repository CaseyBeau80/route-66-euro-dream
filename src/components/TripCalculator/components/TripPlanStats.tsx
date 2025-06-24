
import React from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { MapPin, Clock, Calendar, DollarSign } from 'lucide-react';

interface TripPlanStatsProps {
  tripPlan: TripPlan;
  isCompact?: boolean;
}

const TripPlanStats: React.FC<TripPlanStatsProps> = ({ tripPlan, isCompact = false }) => {
  const statsData = [
    {
      icon: MapPin,
      label: 'Total Distance',
      value: `${Math.round(tripPlan.totalDistance)} miles`,
      color: 'text-blue-600'
    },
    {
      icon: Calendar,
      label: 'Duration',
      value: `${tripPlan.totalDays} days`,
      color: 'text-green-600'
    },
    {
      icon: Clock,
      label: 'Drive Time',
      value: `${Math.round(tripPlan.totalDrivingTime)}h`,
      color: 'text-orange-600'
    },
    {
      icon: DollarSign,
      label: 'Est. Fuel Cost',
      value: `$${Math.round(tripPlan.totalDistance * 0.20)}`,
      color: 'text-purple-600'
    }
  ];

  const gridCols = isCompact ? 'grid-cols-2' : 'grid-cols-4';
  const textSize = isCompact ? 'text-sm' : 'text-base';
  const iconSize = isCompact ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div className={`grid ${gridCols} gap-${isCompact ? '2' : '4'}`}>
      {statsData.map((stat, index) => (
        <div 
          key={index}
          className="bg-white border border-route66-border rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow"
        >
          <div className={`flex items-center justify-center mb-2`}>
            <stat.icon className={`${iconSize} ${stat.color}`} />
          </div>
          <div className={`font-semibold ${stat.color} ${textSize}`}>
            {stat.value}
          </div>
          <div className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripPlanStats;
