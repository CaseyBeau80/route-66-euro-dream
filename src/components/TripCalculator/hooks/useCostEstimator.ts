
import { useState, useMemo } from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { CostEstimatorData, CostEstimate } from '../types/costEstimator';

export interface CostData {
  groupSize: number;
  hotelBudget: number;
  gasPrice: number;
  carMpg: number;
  foodBudget: number;
  activityBudget: number;
  // Additional properties to match CostEstimatorData
  mpg: number;
  numberOfRooms: number;
  motelBudget: 'budget' | 'mid-range' | 'luxury';
  mealBudget: 'budget' | 'mid-range' | 'fine-dining';
  includeAttractions: boolean;
  includeTolls: boolean;
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
    activityBudget: 30,
    // Additional properties
    mpg: 25,
    numberOfRooms: 1,
    motelBudget: 'mid-range',
    mealBudget: 'mid-range',
    includeAttractions: true,
    includeTolls: true
  });

  // Convert TripPlan to MockTripPlan for compatibility
  const mockTripPlan: MockTripPlan = useMemo(() => {
    if (!tripPlan?.segments) {
      return {
        totalDistance: 0,
        totalDays: 0,
        dailySegments: [],
        driveTimeBalance: {
          averageDriveTime: 0,
          balanceQuality: 'good'
        }
      };
    }

    return {
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
    };
  }, [tripPlan]);

  const costEstimate = useMemo(() => {
    if (!mockTripPlan || mockTripPlan.totalDays === 0) return null;

    const gasoline = (mockTripPlan.totalDistance / costData.carMpg) * costData.gasPrice;
    const hotels = (mockTripPlan.totalDays - 1) * costData.hotelBudget;
    const food = mockTripPlan.totalDays * costData.foodBudget * costData.groupSize;
    const activities = mockTripPlan.totalDays * costData.activityBudget * costData.groupSize;

    const totalCost = gasoline + hotels + food + activities;
    const perPersonCost = totalCost / costData.groupSize;

    // Create proper CostEstimate structure
    const estimate: CostEstimate = {
      breakdown: {
        gasCost: Math.round(gasoline),
        accommodationCost: Math.round(hotels),
        mealCost: Math.round(food),
        attractionCost: Math.round(activities),
        tollCost: 0,
        totalCost: Math.round(totalCost)
      },
      dailyCosts: mockTripPlan.dailySegments.map((segment, index) => ({
        day: segment.day,
        city: `Day ${segment.day}`,
        gas: Math.round(gasoline / mockTripPlan.totalDays),
        accommodation: index < mockTripPlan.totalDays - 1 ? costData.hotelBudget : 0,
        meals: costData.foodBudget * costData.groupSize,
        attractions: costData.activityBudget * costData.groupSize,
        tolls: 0,
        dailyTotal: Math.round((gasoline / mockTripPlan.totalDays) + 
                              (index < mockTripPlan.totalDays - 1 ? costData.hotelBudget : 0) + 
                              (costData.foodBudget * costData.groupSize) + 
                              (costData.activityBudget * costData.groupSize))
      })),
      perPersonCost: Math.round(perPersonCost),
      averageDailyCost: Math.round(totalCost / mockTripPlan.totalDays)
    };

    return estimate;
  }, [mockTripPlan, costData]);

  return { costData, setCostData, costEstimate };
};
