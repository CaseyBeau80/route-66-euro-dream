
import React from 'react';
import { format } from 'date-fns';
import { TripPlan } from '../../services/planning/TripPlanBuilder';

interface SharedTripOverviewProps {
  tripPlan: TripPlan;
  tripStartDate?: Date;
  costEstimate?: {
    breakdown: {
      totalCost: number;
      gasCost: number;
      accommodationCost: number;
      mealCost: number;
      attractionCost: number;
      carRentalCost: number;
    };
  };
}

const SharedTripOverview: React.FC<SharedTripOverviewProps> = ({
  tripPlan,
  tripStartDate,
  costEstimate
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDriveTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  // Calculate total driving time from segments - using the same logic as the first screenshot
  const calculateTotalDrivingTime = (): number => {
    if (!tripPlan.segments || tripPlan.segments.length === 0) {
      console.log('🚗 SharedTripOverview: No segments found for driving time calculation');
      return 0;
    }

    // Use the same calculation that produced the correct "30 Drive Hours" 
    // This should be based on the total distance divided by average speed, not summing individual segments
    const totalDistance = tripPlan.totalDistance || 0;
    const averageSpeed = 55; // mph - standard Route 66 average
    const calculatedDriveTime = totalDistance / averageSpeed;

    console.log(`🚗 SharedTripOverview: Total distance: ${totalDistance} miles`);
    console.log(`🚗 SharedTripOverview: Calculated drive time: ${calculatedDriveTime} hours (${totalDistance}mi ÷ ${averageSpeed}mph)`);

    // Also log segment-based calculation for comparison
    const segmentBasedTime = tripPlan.segments.reduce((total, segment) => {
      const segmentHours = segment.driveTimeHours || segment.drivingTime || 0;
      console.log(`🚗 SharedTripOverview: Segment ${segment.day} - ${segment.startCity} to ${segment.endCity}: ${segmentHours} hours`);
      return total + segmentHours;
    }, 0);
    
    console.log(`🚗 SharedTripOverview: Segment-based total: ${segmentBasedTime} hours`);
    console.log(`🚗 SharedTripOverview: Using distance-based calculation: ${calculatedDriveTime} hours`);

    return calculatedDriveTime;
  };

  const totalDrivingTime = calculateTotalDrivingTime();

  return (
    <>
      {/* Header with RAMBLE 66 branding */}
      <div className="text-center mb-6 p-6 bg-gradient-to-r from-route66-primary to-route66-rust rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="bg-white rounded-full p-2">
            <div className="w-8 h-8 bg-route66-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">66</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-route66">RAMBLE 66</h1>
            <p className="text-xs text-route66-cream font-travel tracking-wider">ROUTE 66 TRIP PLANNER</p>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-white">
          {tripPlan.startCity} to {tripPlan.endCity} Adventure
        </h2>
      </div>

      {/* Trip Overview with Cost Integration */}
      <div className="mb-8 p-6 bg-gradient-to-r from-route66-cream to-route66-vintage-beige rounded-lg border-2 border-route66-vintage-brown">
        <h2 className="text-xl font-bold text-route66-vintage-red mb-4 font-route66 text-center">
          🛣️ YOUR ROUTE 66 JOURNEY OVERVIEW
        </h2>
        <div className={`grid gap-4 text-sm ${costEstimate ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-vintage-red text-lg font-route66">{tripPlan.totalDays}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Adventure Days</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-vintage-red text-lg font-route66">{Math.round(tripPlan.totalDistance)}</div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Historic Miles</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
            <div className="font-bold text-route66-vintage-red text-lg font-route66">
              {formatDriveTime(totalDrivingTime)}
            </div>
            <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Total Drive Time</div>
          </div>
          {costEstimate && (
            <div className="text-center p-4 bg-white rounded-lg border-2 border-route66-tan">
              <div className="font-bold text-route66-vintage-red text-lg font-route66">
                {formatCurrency(costEstimate.breakdown.totalCost)}
              </div>
              <div className="text-route66-vintage-brown text-xs mt-1 font-travel">Estimated Cost</div>
            </div>
          )}
        </div>
        
        {/* Journey Description */}
        <div className="mt-4 p-4 bg-route66-vintage-yellow rounded border border-route66-tan text-center">
          <p className="text-sm text-route66-navy font-travel">
            <strong>🗺️ Experience America's Main Street:</strong> This carefully planned itinerary takes you through 
            the heart of Route 66, featuring historic landmarks, classic diners, vintage motels, and unforgettable 
            roadside attractions that define the spirit of the open road.
          </p>
          {costEstimate && (
            <div className="mt-3 pt-3 border-t border-route66-tan">
              <p className="text-xs text-route66-vintage-brown font-travel">
                <strong>💰 Cost Breakdown:</strong> Gas {formatCurrency(costEstimate.breakdown.gasCost)} • 
                Lodging {formatCurrency(costEstimate.breakdown.accommodationCost)} • 
                Meals {formatCurrency(costEstimate.breakdown.mealCost)}
                {costEstimate.breakdown.attractionCost > 0 && ` • Attractions ${formatCurrency(costEstimate.breakdown.attractionCost)}`}
                {costEstimate.breakdown.carRentalCost > 0 && ` • Car Rental ${formatCurrency(costEstimate.breakdown.carRentalCost)}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SharedTripOverview;
