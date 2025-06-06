
import React from 'react';
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="text-center p-4 bg-route66-background-alt rounded-lg border border-route66-border">
        <div className="font-route66 text-2xl text-route66-primary">
          {Math.round(tripPlan.totalDistance)}
        </div>
        <div className="font-travel text-sm text-route66-text-secondary">Total Miles</div>
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
          {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '--'}
        </div>
        <div className="font-travel text-sm text-route66-text-secondary">Est. Total Cost</div>
      </div>
    </div>
  );
};

export default TripStatsGrid;
