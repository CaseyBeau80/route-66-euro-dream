
import { useState, useMemo } from 'react';
import { TripPlan } from '../services/planning/TripPlanBuilder';
import { CostEstimatorData, CostEstimate } from '../types/costEstimator';

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
  const [costData, setCostData] = useState<CostEstimatorData>({
    gasPrice: 3.50,
    mpg: 25,
    groupSize: 2,
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

    const gasoline = (mockTripPlan.totalDistance / costData.mpg) * costData.gasPrice;
    const hotels = (mockTripPlan.totalDays - 1) * 120; // Default hotel cost
    const food = mockTripPlan.totalDays * 85 * costData.groupSize; // Default meal cost
    const activities = mockTripPlan.totalDays * 30 * costData.groupSize; // Default activity cost

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
        accommodation: index < mockTripPlan.totalDays - 1 ? 120 : 0,
        meals: 85 * costData.groupSize,
        attractions: 30 * costData.groupSize,
        tolls: 0,
        dailyTotal: Math.round((gasoline / mockTripPlan.totalDays) + 
                              (index < mockTripPlan.totalDays - 1 ? 120 : 0) + 
                              (85 * costData.groupSize) + 
                              (30 * costData.groupSize))
      })),
      perPersonCost: Math.round(perPersonCost),
      averageDailyCost: Math.round(totalCost / mockTripPlan.totalDays)
    };

    return estimate;
  }, [mockTripPlan, costData]);

  return { costData, setCostData, costEstimate };
};
