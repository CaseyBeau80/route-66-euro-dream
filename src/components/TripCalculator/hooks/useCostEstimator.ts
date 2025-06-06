
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
    if (!tripPlan) {
      console.log('💰 No trip plan provided to cost estimator');
      return null;
    }

    // Check for segments in either property
    const segments = tripPlan.segments || tripPlan.dailySegments || [];
    
    if (segments.length === 0) {
      console.log('💰 No segments found in trip plan');
      return null;
    }

    console.log('💰 Calculating costs for trip plan:', {
      segmentsCount: segments.length,
      totalDays: tripPlan.totalDays,
      costData
    });

    try {
      const estimate = CostCalculationService.calculateCosts(tripPlan, costData);
      console.log('💰 Cost calculation result:', estimate);
      return estimate;
    } catch (error) {
      console.error('💰 Error calculating costs:', error);
      return null;
    }
  }, [tripPlan, costData]);

  return { costData, setCostData, costEstimate };
};
