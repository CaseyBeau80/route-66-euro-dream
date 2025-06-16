
import React from 'react';
import { useUnits } from '@/contexts/UnitContext';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useCostEstimator } from '../hooks/useCostEstimator';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

interface TripStatsGridProps {
  tripPlan: TripPlan;
}

const TripStatsGrid: React.FC<TripStatsGridProps> = ({
  tripPlan
}) => {
  const { formatDistance } = useUnits();
  const { costEstimate } = useCostEstimator(tripPlan);

  // FIXED: Calculate drive time from Google API data only
  const totalDriveTimeHours = React.useMemo(() => {
    if (!tripPlan?.segments?.length) return 0;
    
    const total = tripPlan.segments.reduce((total, segment) => {
      const hours = segment.driveTimeHours || 0;
      return total + hours;
    }, 0);
    
    console.log('📊 TripStatsGrid FIXED - Google API drive time:', {
      totalDriveTimeHours: total,
      segmentCount: tripPlan.segments.length,
      usingOnlyGoogleAPI: true
    });
    
    return total;
  }, [tripPlan?.segments]);

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

  console.log('💰 TripStatsGrid FIXED rendering with Google API data:', {
    costEstimate,
    totalDriveTimeHours,
    usingOnlyGoogleAPI: true
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-route66 text-2xl text-blue-600">
          {distanceValue}
        </div>
        <div className="font-travel text-sm text-blue-700">
          Total {distanceUnit} (Google API)
        </div>
      </div>
      
      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-route66 text-2xl text-blue-600">
          {GoogleDistanceMatrixService.formatDuration(totalDriveTimeHours)}
        </div>
        <div className="font-travel text-sm text-blue-700">Drive Time (Google API)</div>
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
