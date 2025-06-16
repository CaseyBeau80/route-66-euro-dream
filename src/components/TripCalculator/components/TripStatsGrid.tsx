
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

  // Use ONLY segment data - no local calculations
  const totalDriveTimeHours = React.useMemo(() => {
    if (!tripPlan?.segments?.length) return 0;
    
    const total = tripPlan.segments.reduce((total, segment) => {
      return total + segment.driveTimeHours; // Use segment data only
    }, 0);
    
    console.log('🎯 TripStatsGrid - Using segment data only:', {
      totalDriveTimeHours: total,
      segmentCount: tripPlan.segments.length,
      dataSource: 'SEGMENT_DATA_ONLY'
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

  console.log('🎯 TripStatsGrid rendering with segment data only:', {
    costEstimate,
    totalDriveTimeHours,
    dataSource: 'SEGMENT_DATA_ONLY'
  });

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
          {GoogleDistanceMatrixService.formatDuration(totalDriveTimeHours)}
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
