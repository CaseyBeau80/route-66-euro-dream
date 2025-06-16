
import React from 'react';
import { TripPlan } from '../../TripCalculator/services/planning/TripPlanBuilder';
import { GoogleDistanceMatrixService } from '../../TripCalculator/services/GoogleDistanceMatrixService';

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
  // FIXED: Calculate total drive time from Google API data only
  const totalDriveTimeHours = React.useMemo(() => {
    try {
      if (!tripPlan?.segments || !Array.isArray(tripPlan.segments)) {
        console.log('🔧 TripSummaryStats FIXED: No valid segments array found');
        return 0;
      }
      
      const totalHours = tripPlan.segments.reduce((total, segment) => {
        if (!segment || typeof segment !== 'object') {
          console.warn('🔧 TripSummaryStats FIXED: Invalid segment found:', segment);
          return total;
        }
        const hours = segment.driveTimeHours || 0;
        return total + hours;
      }, 0);
      
      console.log('🔧 TripSummaryStats FIXED: Calculated Google API drive time:', {
        totalHours,
        segmentCount: tripPlan.segments.length,
        usingOnlyGoogleAPI: true
      });
      return totalHours;
    } catch (error) {
      console.error('❌ TripSummaryStats FIXED: Error calculating drive time:', error);
      return 0;
    }
  }, [tripPlan?.segments]);

  const totalAttractions = React.useMemo(() => {
    try {
      if (!tripPlan?.segments || !Array.isArray(tripPlan.segments)) {
        console.log('🔧 TripSummaryStats FIXED: No valid segments array found');
        return 0;
      }
      
      const count = tripPlan.segments.reduce((total, segment) => {
        if (!segment || typeof segment !== 'object') {
          console.warn('🔧 TripSummaryStats FIXED: Invalid segment found:', segment);
          return total;
        }
        const attractionCount = segment.attractions?.length || 0;
        return total + attractionCount;
      }, 0);
      
      console.log('🔧 TripSummaryStats FIXED: Calculated total attractions:', count);
      return count;
    } catch (error) {
      console.error('❌ TripSummaryStats FIXED: Error calculating attractions:', error);
      return 0;
    }
  }, [tripPlan?.segments?.length]);

  console.log('📊 TripSummaryStats FIXED: Render with Google API data:', {
    segmentCount: tripPlan?.segments?.length || 0,
    totalAttractions,
    totalDriveTimeHours,
    hasCostEstimate: !!costEstimate,
    usingOnlyGoogleAPI: true
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
      console.error('❌ TripSummaryStats FIXED: Error formatting currency:', error);
      return '--';
    }
  };

  // FIXED: Use Google API data only
  const segmentCount = tripPlan?.segments?.length || 0;
  const totalDistance = Math.round(tripPlan?.totalDistance || 0);
  const formattedDriveTime = GoogleDistanceMatrixService.formatDuration(totalDriveTimeHours);
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
        <div className="text-sm text-route66-text-secondary">Miles (Google API)</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-route66-primary">
          {formattedDriveTime}
        </div>
        <div className="text-sm text-route66-text-secondary">Drive Time (Google API)</div>
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
