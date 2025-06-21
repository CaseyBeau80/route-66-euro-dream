
import React from 'react';
import { TripPlan } from '../../services/planning/TripPlanTypes';
import { CostEstimate } from '../../hooks/useCostEstimator';
import { MapPin, Calendar, Clock, Route, DollarSign } from 'lucide-react';

interface SharedTripOverviewProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  costEstimate?: CostEstimate;
}

const SharedTripOverview: React.FC<SharedTripOverviewProps> = ({
  tripPlan,
  tripStartDate,
  costEstimate
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const segments = tripPlan.segments || [];
  const startCity = segments[0]?.startCity || tripPlan.startCity || 'Start';
  const endCity = segments[segments.length - 1]?.endCity || tripPlan.endCity || 'End';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-6">
        <div className="flex justify-center items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Route className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {tripPlan.title}
          </h1>
        </div>
        
        <p className="text-lg text-gray-600 mb-4">
          {startCity} to {endCity}
        </p>
        
        {tripStartDate && (
          <div className="flex justify-center items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Starting {tripStartDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        )}
      </div>

      {/* Trip Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-3xl font-bold text-blue-700 mb-1">
            {segments.length}
          </div>
          <div className="text-sm text-blue-600 font-medium">Days</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-3xl font-bold text-green-700 mb-1">
            {Math.round(tripPlan.totalDistance || tripPlan.totalMiles || 0)}
          </div>
          <div className="text-sm text-green-600 font-medium">Miles</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-3xl font-bold text-purple-700 mb-1">
            {Math.round(tripPlan.totalDrivingTime || ((tripPlan.totalDistance || tripPlan.totalMiles || 0) / 55))}
          </div>
          <div className="text-sm text-purple-600 font-medium">Drive Hours</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-3xl font-bold text-orange-700 mb-1">
            {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '--'}
          </div>
          <div className="text-sm text-orange-600 font-medium">Est. Cost</div>
        </div>
      </div>

      {/* Trip Description */}
      {tripPlan.description && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Trip</h3>
          <p className="text-gray-700 leading-relaxed">{tripPlan.description}</p>
        </div>
      )}
    </div>
  );
};

export default SharedTripOverview;
