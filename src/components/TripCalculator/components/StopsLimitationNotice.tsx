
import React from 'react';
import { AlertCircle, Info, MapPin } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanTypes';

interface StopsLimitationNoticeProps {
  tripPlan: TripPlan;
  className?: string;
}

const StopsLimitationNotice: React.FC<StopsLimitationNoticeProps> = ({ 
  tripPlan, 
  className = "" 
}) => {
  if (!tripPlan.stopsLimited || !tripPlan.limitMessage) {
    return null;
  }

  const isWarning = tripPlan.limitMessage.includes('⚠️');
  const isInfo = tripPlan.limitMessage.includes('ℹ️');

  return (
    <div className={`rounded-lg border p-4 ${
      isWarning 
        ? 'bg-amber-50 border-amber-200' 
        : isInfo 
        ? 'bg-blue-50 border-blue-200'
        : 'bg-gray-50 border-gray-200'
    } ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {isWarning ? (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          ) : isInfo ? (
            <Info className="h-5 w-5 text-blue-600" />
          ) : (
            <MapPin className="h-5 w-5 text-gray-600" />
          )}
        </div>
        <div className="flex-1">
          <h4 className={`text-sm font-semibold mb-1 ${
            isWarning 
              ? 'text-amber-800' 
              : isInfo 
              ? 'text-blue-800'
              : 'text-gray-800'
          }`}>
            Trip Optimization Notice
          </h4>
          <p className={`text-sm ${
            isWarning 
              ? 'text-amber-700' 
              : isInfo 
              ? 'text-blue-700'
              : 'text-gray-700'
          }`}>
            {tripPlan.limitMessage.replace(/^[⚠️ℹ️]\s*/, '')}
          </p>
          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Trip Focus:</span> Quality over quantity - more time to explore each destination
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopsLimitationNotice;
