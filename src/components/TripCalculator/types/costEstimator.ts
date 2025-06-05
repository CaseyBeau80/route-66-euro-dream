
export interface CostEstimatorData {
  gasPrice: number;
  mpg: number;
  groupSize: number;
  motelBudget: 'budget' | 'mid-range' | 'luxury';
  mealBudget: 'budget' | 'mid-range' | 'fine-dining';
  includeAttractions: boolean;
  includeTolls: boolean;
}

export interface CostBreakdown {
  gasCost: number;
  accommodationCost: number;
  mealCost: number;
  attractionCost: number;
  tollCost: number;
  totalCost: number;
}

export interface CostEstimate {
  breakdown: CostBreakdown;
  perPerson: number;
  perDay: number;
}
