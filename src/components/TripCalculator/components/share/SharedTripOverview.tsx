
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
              {formatDriveTime(tripPlan.totalDrivingTime || 0)}
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
