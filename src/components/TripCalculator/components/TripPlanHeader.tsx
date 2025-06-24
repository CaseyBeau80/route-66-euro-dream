
import React from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TripPlanHeaderProps {
  tripPlan: TripPlan;
  isCompact?: boolean;
}

const TripPlanHeader: React.FC<TripPlanHeaderProps> = ({ tripPlan, isCompact = false }) => {
  const titleSize = isCompact ? 'text-xl' : 'text-2xl';
  const iconSize = isCompact ? 'h-5 w-5' : 'h-6 w-6';

  return (
    <div className={`bg-gradient-to-r from-route66-primary to-route66-secondary text-white rounded-lg p-${isCompact ? '4' : '6'} shadow-lg`}>
      <div className="flex items-center gap-3 mb-3">
        <MapPin className={`${iconSize} text-yellow-300`} />
        <h2 className={`${titleSize} font-bold`}>
          Your Route 66 Adventure
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-yellow-300">📍 From:</span>
          <span className="font-semibold">{tripPlan.startLocation}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-300">🎯 To:</span>
          <span className="font-semibold">{tripPlan.endLocation}</span>
        </div>
        {tripPlan.startDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-yellow-300" />
            <span>Starting {format(tripPlan.startDate, 'MMM d, yyyy')}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-yellow-300">⏱️ Duration:</span>
          <span className="font-semibold">{tripPlan.totalDays} days</span>
        </div>
      </div>
    </div>
  );
};

export default TripPlanHeader;
