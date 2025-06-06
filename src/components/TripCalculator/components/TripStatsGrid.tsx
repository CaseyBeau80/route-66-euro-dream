
import React from 'react';
import { useUnits } from '@/contexts/UnitContext';
import { TripPlan } from '../services/planning/TripPlanBuilder';

interface TripStatsGridProps {
  tripPlan: TripPlan;
  costEstimate: any;
  formatTime: (hours: number) => string;
  formatCurrency: (amount: number) => string;
}

const TripStatsGrid: React.FC<TripStatsGridProps> = ({
  tripPlan,
  costEstimate,
  formatTime,
  formatCurrency
}) => {
  const { formatDistance } = useUnits();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
        <div className="font-route66 text-2xl text-route66-primary">
          {distanceValue}
        </div>
        <div className="font-travel text-sm text-route66-text-secondary">
          Total {distanceUnit}
        </div>
      </div>
      
      <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
        <div className="font-route66 text-2xl text-route66-primary">
          {formatTime(tripPlan.totalDrivingTime)}
        </div>
        <div className="font-travel text-sm text-route66-text-secondary">Drive Time</div>
      </div>
      
      <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
        <div className="font-route66 text-2xl text-route66-primary">
          {tripPlan.segments.length}
        </div>
        <div className="font-travel text-sm text-route66-text-secondary">Days</div>
      </div>
      
      <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
        <div className="font-route66 text-2xl text-route66-primary">
          {costEstimate ? formatCurrencyNoCents(costEstimate.breakdown.totalCost) : '--'}
        </div>
        <div className="font-travel text-sm text-route66-text-secondary">Est. Total Cost</div>
      </div>
    </div>
  );
};

export default TripStatsGrid;
