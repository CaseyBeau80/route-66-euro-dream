
export interface CostEstimatorData {
  gasPrice: number;
  mpg: number;
  motelBudget: 'budget' | 'mid-range' | 'luxury';
  mealBudget: 'budget' | 'mid-range' | 'fine-dining';
  includeAttractions: boolean;
  includeTolls: boolean;
  groupSize: number;
}

export interface CostBreakdown {
  gasCosts: number;
  accommodationCosts: number;
  mealCosts: number;
  attractionCosts: number;
  tollCosts: number;
  totalCost: number;
}

export interface DailyCosts {
  day: number;
  city: string;
  gas: number;
  accommodation: number;
  meals: number;
  attractions: number;
  tolls: number;
  dailyTotal: number;
}

export interface CostEstimate {
  breakdown: CostBreakdown;
  dailyCosts: DailyCosts[];
  perPersonCost: number;
  averageDailyCost: number;
}
