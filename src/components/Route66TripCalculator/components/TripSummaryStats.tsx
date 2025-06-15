
import React from 'react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { Calendar, Clock, Route, MapPin } from 'lucide-react';

interface TripSummaryStatsProps {
  tripPlan: TripPlan;
  costEstimate?: {
    breakdown: {
      totalCost: number;
    };
  };
}

const TripSummaryStats: React.FC<TripSummaryStatsProps> = ({
  tripPlan,
  costEstimate
}) => {
  // FIXED: Proper attractions count calculation
  const totalAttractions = React.useMemo(() => {
    if (!tripPlan.segments) return 0;
    
    return tripPlan.segments.reduce((total, segment) => {
      const attractionCount = segment.attractions?.length || 0;
      return total + attractionCount;
    }, 0);
  }, [tripPlan.segments]);

  console.log('📊 TripSummaryStats: Calculating attractions count:', {
    segmentCount: tripPlan.segments?.length || 0,
    totalAttractions,
    segmentBreakdown: tripPlan.segments?.map(s => ({
      city: s.endCity,
      attractionCount: s.attractions?.length || 0
    }))
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-route66-primary">{tripPlan.segments?.length || 0}</div>
        <div className="text-sm text-route66-text-secondary">Days</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-route66-primary">
          {Math.round(tripPlan.totalDistance || 0)}
        </div>
        <div className="text-sm text-route66-text-secondary">Miles</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-route66-primary">
          {Math.round((tripPlan.totalDistance || 0) / 55)}
        </div>
        <div className="text-sm text-route66-text-secondary">Drive Hours</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-route66-primary">
          {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '--'}
        </div>
        <div className="text-sm text-route66-text-secondary">Est. Cost</div>
      </div>
    </div>
  );
};

export default TripSummaryStats;
