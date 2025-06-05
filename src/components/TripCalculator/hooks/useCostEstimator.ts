
import { useState, useMemo } from 'react';
import { CostEstimatorData, CostBreakdown, CostEstimate, DailyCosts } from '../types/costEstimator';

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
    numberOfRooms: 1,
    motelBudget: 'mid-range',
    mealBudget: 'mid-range',
    includeAttractions: true,
    includeTolls: false
  });

  const costEstimate = useMemo((): CostEstimate | null => {
    if (!tripPlan || tripPlan.dailySegments.length === 0) return null;

    const totalDistance = tripPlan.totalDistance;
    const tripDays = tripPlan.dailySegments.length;

    // Gas costs
    const totalGallons = totalDistance / costData.mpg;
    const gasCost = totalGallons * costData.gasPrice;

    // Accommodation costs (multiply by number of rooms)
    const motelRates = {
      'budget': 65,
      'mid-range': 120,
      'luxury': 250
    };
    const accommodationCost = (tripDays - 1) * motelRates[costData.motelBudget] * costData.numberOfRooms;

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

    // Create daily costs breakdown
    const dailyCosts: DailyCosts[] = tripPlan.dailySegments.map((segment, index) => {
      const dayGas = (segment.distance / costData.mpg) * costData.gasPrice;
      const dayAccommodation = index < tripPlan.dailySegments.length - 1 ? motelRates[costData.motelBudget] * costData.numberOfRooms : 0;
      const dayMeals = mealRates[costData.mealBudget] * costData.groupSize;
      const dayAttractions = costData.includeAttractions ? 30 * costData.groupSize : 0;
      const dayTolls = costData.includeTolls ? 8 : 0;

      return {
        day: segment.day,
        city: `Day ${segment.day}`,
        gas: dayGas,
        accommodation: dayAccommodation,
        meals: dayMeals,
        attractions: dayAttractions,
        tolls: dayTolls,
        dailyTotal: dayGas + dayAccommodation + dayMeals + dayAttractions + dayTolls
      };
    });

    return {
      breakdown,
      dailyCosts,
      perPersonCost: totalCost / costData.groupSize,
      averageDailyCost: totalCost / tripDays
    };
  }, [tripPlan, costData]);

  return {
    costData,
    setCostData,
    costEstimate
  };
};
