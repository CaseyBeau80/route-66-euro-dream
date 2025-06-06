
export interface CostEstimatorData {
  gasPrice: number;
  mpg: number;
  groupSize: number;
  numberOfRooms: number;
  motelBudget: 'budget' | 'mid-range' | 'luxury';
  mealBudget: 'budget' | 'mid-range' | 'luxury';
  includeAttractions: boolean;
  includeTolls: boolean;
  includeCarRental: boolean;
  carRentalType: 'compact' | 'mid-size' | 'full-size' | 'suv';
}

export interface CostBreakdown {
  gasCost: number;
  accommodationCost: number;
  mealCost: number;
  attractionCost: number;
  tollCost: number;
  carRentalCost: number;
  totalCost: number;
}

export interface CostEstimate {
  breakdown: CostBreakdown;
  perPersonCost: number;
  dailyAverageCost: number;
}
