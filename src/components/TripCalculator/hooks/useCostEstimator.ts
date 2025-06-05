
import { useState, useMemo } from 'react';
import { CostEstimatorData, CostEstimate } from '../types/costEstimator';
import { CostCalculationService } from '../services/CostCalculationService';
import { TripPlan } from '../services/planning/TripPlanBuilder';

export const useCostEstimator = (tripPlan?: TripPlan) => {
  const [costData, setCostData] = useState<CostEstimatorData>({
    gasPrice: 3.50,
    mpg: 25,
    motelBudget: 'mid-range',
    mealBudget: 'mid-range',
    includeAttractions: true,
    includeTolls: true,
    groupSize: 2
  });

  const costEstimate = useMemo((): CostEstimate | null => {
    if (!tripPlan) return null;
    
    try {
      return CostCalculationService.calculateCosts(tripPlan, costData);
    } catch (error) {
      console.error('Error calculating costs:', error);
      return null;
    }
  }, [tripPlan, costData]);

  return {
    costData,
    setCostData,
    costEstimate
  };
};
