
import React from 'react';
import { Calendar, MapPin, Clock, DollarSign } from 'lucide-react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { useUnits } from '@/contexts/UnitContext';
import { useCostEstimator } from '../hooks/useCostEstimator';
import { GoogleDistanceMatrixService } from '../services/GoogleDistanceMatrixService';

interface ItineraryCardStatsProps {
  tripPlan: TripPlan;
}

const ItineraryCardStats: React.FC<ItineraryCardStatsProps> = ({ tripPlan }) => {
  const { formatDistance } = useUnits();
  const { costEstimate } = useCostEstimator(tripPlan);

  // FIXED: Calculate drive time from Google API data only
  const totalDriveTimeHours = React.useMemo(() => {
    if (!tripPlan?.segments?.length) return 0;
    
    const total = tripPlan.segments.reduce((total, segment) => {
      const hours = segment.driveTimeHours || 0;
      return total + hours;
    }, 0);
    
    console.log('💰 ItineraryCardStats FIXED - Google API drive time:', {
      totalDriveTimeHours: total,
      segmentCount: tripPlan.segments.length,
      usingOnlyGoogleAPI: true
    });
    
    return total;
  }, [tripPlan?.segments]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  console.log('💰 ItineraryCardStats FIXED rendering with Google API data:', {
    costEstimate,
    totalDriveTimeHours,
    usingOnlyGoogleAPI: true
  });

  return (
    <section aria-labelledby="trip-overview" className="mb-6">
      <h3 id="trip-overview" className="sr-only">Trip Overview</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100" role="group" aria-label="Trip duration">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="text-sm font-medium text-blue-800">Duration</span>
          </div>
          <div className="text-2xl font-bold text-blue-900" aria-label={`${tripPlan.totalDays} days`}>
            {tripPlan.totalDays} Days
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100" role="group" aria-label="Total distance">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="text-sm font-medium text-blue-800">Distance</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {formatDistance(tripPlan.totalDistance)}
          </div>
          <div className="text-xs text-blue-700">(Google API)</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100" role="group" aria-label="Driving time">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="text-sm font-medium text-blue-800">Drive Time</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {GoogleDistanceMatrixService.formatDuration(totalDriveTimeHours)}
          </div>
          <div className="text-xs text-blue-700">(Google API)</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100" role="group" aria-label="Estimated cost">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="text-sm font-medium text-blue-800">Est. Cost</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {costEstimate ? formatCurrency(costEstimate.breakdown.totalCost) : '--'}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryCardStats;
