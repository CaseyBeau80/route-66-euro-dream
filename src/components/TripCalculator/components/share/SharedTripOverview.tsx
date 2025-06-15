
import React from 'react';
import { Calendar, MapPin, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { TripPlan } from '../../services/planning/TripPlanBuilder';
import { CostEstimate } from '../../types/costEstimator';

interface SharedTripOverviewProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  costEstimate?: CostEstimate | null;
}

const SharedTripOverview: React.FC<SharedTripOverviewProps> = ({
  tripPlan,
  tripStartDate,
  costEstimate
}) => {
  console.log('🔥 UNIFIED SHARED: SharedTripOverview consistent with preview mode', {
    title: tripPlan.title,
    segments: tripPlan.segments.length,
    hasTripStartDate: !!tripStartDate,
    hasCostEstimate: !!costEstimate
  });

  const totalDistance = tripPlan.segments.reduce((sum, segment) => sum + (segment.distance || 0), 0);
  const totalDriveTime = tripPlan.segments.reduce((sum, segment) => sum + (segment.driveTimeHours || 0), 0);

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-route66">
          {tripPlan.title}
        </h1>
        <p className="text-gray-600 font-travel">
          Your complete Route 66 adventure guide
        </p>
      </div>

      {/* Trip Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6" />
            {tripPlan.totalDays || tripPlan.segments.length}
          </div>
          <div className="text-sm text-blue-700 font-medium">Days</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
            <MapPin className="w-6 h-6" />
            {Math.round(totalDistance)}
          </div>
          <div className="text-sm text-green-700 font-medium">Miles</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600 flex items-center justify-center gap-2">
            <Clock className="w-6 h-6" />
            {formatTime(totalDriveTime)}
          </div>
          <div className="text-sm text-purple-700 font-medium">Drive Time</div>
        </div>
        
        {costEstimate && (
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-2">
              <DollarSign className="w-6 h-6" />
              {costEstimate.totalCost.toLocaleString()}
            </div>
            <div className="text-sm text-orange-700 font-medium">Est. Cost</div>
          </div>
        )}
      </div>

      {/* Trip Details */}
      <div className="space-y-4">
        {tripStartDate && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Trip Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Start Date:</span> {format(tripStartDate, 'EEEE, MMMM d, yyyy')}
              </div>
              <div>
                <span className="font-medium">End Date:</span> {format(
                  new Date(tripStartDate.getTime() + (tripPlan.segments.length - 1) * 24 * 60 * 60 * 1000), 
                  'EEEE, MMMM d, yyyy'
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-700 mb-2">Route Overview</h3>
          <p className="text-sm text-blue-600">
            Start your journey in {tripPlan.segments[0]?.startCity || tripPlan.startCity} and end in{' '}
            {tripPlan.segments[tripPlan.segments.length - 1]?.endCity || tripPlan.endCity}, 
            experiencing the best of America's historic Route 66.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedTripOverview;
