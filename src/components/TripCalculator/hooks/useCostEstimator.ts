
import { useState, useMemo } from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';

export interface CostData {
  groupSize: number;
  hotelBudget: number;
  gasPrice: number;
  carMpg: number;
  foodBudget: number;
  activityBudget: number;
}

export interface CostEstimate {
  totalCost: number;
  gasoline: number;
  hotels: number;
  food: number;
  activities: number;
  perPersonCost: number;
}

// Mock interface for compatibility
interface MockTripPlan {
  totalDistance: number;
  totalDays: number;
  dailySegments: Array<{
    day: number;
    approximateMiles: number;
    driveTimeHours: number;
  }>;
  driveTimeBalance: {
    averageDriveTime: number;
    balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

export const useCostEstimator = (tripPlan: TripPlan) => {
  const [costData, setCostData] = useState<CostData>({
    groupSize: 2,
    hotelBudget: 120,
    gasPrice: 3.50,
    carMpg: 25,
    foodBudget: 50,
    activityBudget: 30
  });

  // Convert TripPlan to MockTripPlan for compatibility
  const mockTripPlan: MockTripPlan = useMemo(() => ({
    totalDistance: tripPlan.totalDistance,
    totalDays: tripPlan.totalDays,
    dailySegments: tripPlan.segments.map(segment => ({
      day: segment.day,
      approximateMiles: segment.approximateMiles,
      driveTimeHours: segment.driveTimeHours
    })),
    driveTimeBalance: {
      averageDriveTime: tripPlan.driveTimeBalance?.averageDriveTime || 6,
      balanceQuality: tripPlan.driveTimeBalance?.balanceQuality || 'good'
    }
  }), [tripPlan]);

  const costEstimate = useMemo(() => {
    if (!mockTripPlan) return null;

    const gasoline = (mockTripPlan.totalDistance / costData.carMpg) * costData.gasPrice;
    const hotels = (mockTripPlan.totalDays - 1) * costData.hotelBudget; // Assume hotel for all nights except last
    const food = mockTripPlan.totalDays * costData.foodBudget * costData.groupSize;
    const activities = mockTripPlan.totalDays * costData.activityBudget * costData.groupSize;

    const totalCost = gasoline + hotels + food + activities;
    const perPersonCost = totalCost / costData.groupSize;

    return {
      totalCost,
      gasoline,
      hotels,
      food,
      activities,
      perPersonCost
    };
  }, [mockTripPlan, costData]);

  return { costData, setCostData, costEstimate };
};
