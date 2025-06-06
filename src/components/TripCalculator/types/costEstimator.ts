
export interface CostEstimatorData {
  gasPrice: number;
  mpg: number;
  groupSize: number;
  numberOfRooms: number;
  motelBudget: 'budget' | 'mid-range' | 'luxury';
  mealBudget: 'budget' | 'mid-range' | 'fine-dining';
  includeAttractions: boolean;
  includeTolls: boolean;
  includeCarRental: boolean;
  carRentalType: 'economy' | 'compact' | 'mid-size' | 'full-size' | 'suv' | 'luxury';
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

export interface DailyCosts {
  day: number;
  city: string;
  gas: number;
  accommodation: number;
  meals: number;
  attractions: number;
  tolls: number;
  carRental: number;
  dailyTotal: number;
}

export interface CostEstimate {
  breakdown: CostBreakdown;
  dailyCosts: DailyCosts[];
  perPersonCost: number;
  averageDailyCost: number;
}
