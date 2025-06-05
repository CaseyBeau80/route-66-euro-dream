
import { useState, useMemo } from 'react';
import { CostEstimatorData, CostBreakdown } from '../types/costEstimator';

interface MockTripPlan {
  totalDistance: number;
  dailySegments: Array<{
    day: number;
    distance: number;
    drivingTime: number;
  }>;
}

export const useCostEstimator = (tripPlan: MockTripPlan) => {
  const [costData, setCostData] = useState<CostEstimatorData>({
    gasPrice: 3.50,
    mpg: 25,
    groupSize: 2,
    motelBudget: 'mid-range',
    mealBudget: 'mid-range',
    includeAttractions: true,
    includeTolls: false
  });

  const costEstimate = useMemo(() => {
    if (!tripPlan || tripPlan.dailySegments.length === 0) return null;

    const totalDistance = tripPlan.totalDistance;
    const tripDays = tripPlan.dailySegments.length;

    // Gas costs
    const totalGallons = totalDistance / costData.mpg;
    const gasCost = totalGallons * costData.gasPrice;

    // Accommodation costs
    const motelRates = {
      'budget': 65,
      'mid-range': 120,
      'luxury': 250
    };
    const accommodationCost = (tripDays - 1) * motelRates[costData.motelBudget]; // -1 because last night is at destination

    // Meal costs
    const mealRates = {
      'budget': 45,
      'mid-range': 85,
      'fine-dining': 150
    };
    const mealCost = tripDays * mealRates[costData.mealBudget] * costData.groupSize;

    // Attraction costs
    const attractionCost = costData.includeAttractions ? tripDays * 30 * costData.groupSize : 0;

    // Toll costs
    const tollCost = costData.includeTolls ? tripDays * 8 : 0;

    const totalCost = gasCost + accommodationCost + mealCost + attractionCost + tollCost;

    const breakdown: CostBreakdown = {
      gasCost,
      accommodationCost,
      mealCost,
      attractionCost,
      tollCost,
      totalCost
    };

    return {
      breakdown,
      perPerson: totalCost / costData.groupSize,
      perDay: totalCost / tripDays
    };
  }, [tripPlan, costData]);

  return {
    costData,
    setCostData,
    costEstimate
  };
};
