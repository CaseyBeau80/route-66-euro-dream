
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

  // NUCLEAR FIX: Calculate drive time from EXCLUSIVE Google API data
  const totalGoogleAPIDriveTimeHours = React.useMemo(() => {
    if (!tripPlan?.segments?.length) return 0;
    
    const total = tripPlan.segments.reduce((total, segment) => {
      const hours = segment.driveTimeHours; // EXCLUSIVE Google API data
      return total + hours;
    }, 0);
    
    console.log('🔥 NUCLEAR FIX TripStatsGrid - EXCLUSIVE Google API drive time:', {
      totalGoogleAPIDriveTimeHours: total,
      segmentCount: tripPlan.segments.length,
      usingEXCLUSIVELYGoogleAPI: true
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

  console.log('🔥 NUCLEAR FIX TripStatsGrid rendering with EXCLUSIVE Google API data:', {
    costEstimate,
    totalGoogleAPIDriveTimeHours,
    usingEXCLUSIVELYGoogleAPI: true
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
          {GoogleDistanceMatrixService.formatDuration(totalGoogleAPIDriveTimeHours)}
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
