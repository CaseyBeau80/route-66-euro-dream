
import React from 'react';
import { useUnits } from '@/contexts/UnitContext';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useCostEstimator } from '../hooks/useCostEstimator';

interface TripStatsGridProps {
  tripPlan: TripPlan;
  formatTime: (hours: number) => string;
}

const TripStatsGrid: React.FC<TripStatsGridProps> = ({
  tripPlan,
  formatTime
}) => {
  const { formatDistance } = useUnits();
  const { costEstimate } = useCostEstimator(tripPlan);

  const formatCurrencyNoCents = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Extract distance value and unit separately for better display
  const distanceDisplay = formatDistance(tripPlan.totalDistance);
  const [distanceValue, distanceUnit] = distanceDisplay.split(' ');

  console.log('💰 TripStatsGrid rendering with cost estimate:', costEstimate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-route66 text-2xl text-blue-600">
          {distanceValue}
        </div>
        <div className="font-travel text-sm text-blue-700">
          Total {distanceUnit}
        </div>
      </div>
      
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-route66 text-2xl text-blue-600">
          {formatTime(tripPlan.totalDrivingTime)}
        </div>
        <div className="font-travel text-sm text-blue-700">Drive Time</div>
      </div>
      
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-route66 text-2xl text-blue-600">
          {tripPlan.segments?.length || tripPlan.totalDays}
        </div>
        <div className="font-travel text-sm text-blue-700">Days</div>
      </div>
      
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-route66 text-2xl text-blue-600">
          {costEstimate ? formatCurrencyNoCents(costEstimate.breakdown.totalCost) : '--'}
        </div>
        <div className="font-travel text-sm text-blue-700">Est. Total Cost</div>
      </div>
    </div>
  );
};

export default TripStatsGrid;
