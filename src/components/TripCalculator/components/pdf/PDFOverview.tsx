
import React from 'react';
import { format } from 'date-fns';
import { TripPlan } from '../../services/planning/TripPlanBuilder';

interface PDFOverviewProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  weatherLoading: boolean;
  weatherLoadingTimeout: boolean;
}

const PDFOverview: React.FC<PDFOverviewProps> = ({
  tripPlan,
  tripStartDate,
  weatherLoading,
  weatherLoadingTimeout
}) => {
  const formatDistance = (miles: number): string => {
    return `${Math.round(miles)} mi`;
  };

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatStartDate = (date?: Date): string => {
    if (!date) return 'Not specified';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Weather service status for display
  const getWeatherServiceStatus = () => {
    if (weatherLoading) return '⏳';
    if (weatherLoadingTimeout) return '📊';
    return '🌤️';
  };

  const getWeatherStatusText = () => {
    if (weatherLoading) return 'Loading';
    if (weatherLoadingTimeout) return 'Estimates';
    return 'Available';
  };

  return (
    <div className="pdf-overview mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Trip Overview</h2>
      <div className="grid grid-cols-4 gap-4 mb-6 w-full">
        <div className="text-center p-4 bg-gray-50 rounded border">
          <div className="text-xl font-bold text-blue-600">{tripPlan.totalDays}</div>
          <div className="text-sm text-gray-600">Days</div>
          <div className="text-sm text-gray-500 mt-1">Starting {formatStartDate(tripStartDate)}</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded border">
          <div className="text-xl font-bold text-blue-600">{formatDistance(tripPlan.totalDistance)}</div>
          <div className="text-sm text-gray-600">Total Distance</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded border">
          <div className="text-xl font-bold text-blue-600">{formatTime(tripPlan.totalDrivingTime)}</div>
          <div className="text-sm text-gray-600">Drive Time</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded border">
          <div className="text-xl font-bold text-blue-600">{getWeatherServiceStatus()}</div>
          <div className="text-sm text-gray-600">
            Weather {getWeatherStatusText()}
          </div>
          {weatherLoadingTimeout && (
            <div className="text-xs text-gray-500 mt-1">Seasonal data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFOverview;
