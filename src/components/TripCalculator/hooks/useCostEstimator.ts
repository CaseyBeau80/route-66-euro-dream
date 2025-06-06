
import { useState, useMemo } from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { CostEstimatorData, CostEstimate } from '../types/costEstimator';
import { CostCalculationService } from '../services/CostCalculationService';

export const useCostEstimator = (tripPlan?: TripPlan) => {
  const [costData, setCostData] = useState<CostEstimatorData>({
    gasPrice: 3.50,
    mpg: 25,
    groupSize: 2,
    numberOfRooms: 1,
    motelBudget: 'mid-range',
    mealBudget: 'mid-range',
    includeAttractions: true,
    includeTolls: true,
    includeCarRental: false,
    carRentalType: 'compact'
  });

  const costEstimate = useMemo(() => {
    if (!tripPlan || !tripPlan.segments || tripPlan.segments.length === 0) {
      return null;
    }

    console.log('💰 Calculating costs for trip plan:', tripPlan);
    return CostCalculationService.calculateCosts(tripPlan, costData);
  }, [tripPlan, costData]);

  return { costData, setCostData, costEstimate };
};
