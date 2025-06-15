
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
  // FIXED: More stable useMemo dependency and better error handling
  const totalAttractions = React.useMemo(() => {
    try {
      if (!tripPlan?.segments || !Array.isArray(tripPlan.segments)) {
        console.log('🔧 TripSummaryStats: No valid segments array found');
        return 0;
      }
      
      const count = tripPlan.segments.reduce((total, segment) => {
        if (!segment || typeof segment !== 'object') {
          console.warn('🔧 TripSummaryStats: Invalid segment found:', segment);
          return total;
        }
        const attractionCount = segment.attractions?.length || 0;
        return total + attractionCount;
      }, 0);
      
      console.log('🔧 TripSummaryStats: Calculated total attractions:', count);
      return count;
    } catch (error) {
      console.error('❌ TripSummaryStats: Error calculating attractions:', error);
      return 0;
    }
  }, [tripPlan?.segments?.length]); // FIXED: Use length instead of array reference

  console.log('📊 TripSummaryStats: Render with stable dependencies:', {
    segmentCount: tripPlan?.segments?.length || 0,
    totalAttractions,
    hasCostEstimate: !!costEstimate
  });

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      console.error('❌ TripSummaryStats: Error formatting currency:', error);
      return '--';
    }
  };

  // FIXED: Add safety checks for all calculations
  const segmentCount = tripPlan?.segments?.length || 0;
  const totalDistance = Math.round(tripPlan?.totalDistance || 0);
  const driveHours = Math.round((tripPlan?.totalDistance || 0) / 55);
  const totalCost = costEstimate?.breakdown?.totalCost;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-route66-primary">{segmentCount}</div>
        <div className="text-sm text-route66-text-secondary">Days</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-route66-primary">
          {totalDistance}
        </div>
        <div className="text-sm text-route66-text-secondary">Miles</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-route66-primary">
          {driveHours}
        </div>
        <div className="text-sm text-route66-text-secondary">Drive Hours</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-route66-primary">
          {totalCost ? formatCurrency(totalCost) : '--'}
        </div>
        <div className="text-sm text-route66-text-secondary">Est. Cost</div>
      </div>
    </div>
  );
};

export default TripSummaryStats;
