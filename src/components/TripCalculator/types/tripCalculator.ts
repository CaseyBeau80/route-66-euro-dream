
export interface TripCalculation {
  totalDistance: number;
  totalDriveTime: number;
  dailyDistances: number[];
  numberOfDays: number;
  averageDailyDistance: number;
}

export interface TripFormData {
  startLocation: string;
  endLocation: string;
  travelDays: number;
  dailyDrivingLimit: number; // Changed from number[] to number for simplicity
  tripStartDate?: Date; // Added trip start date
  tripStyle: 'balanced' | 'destination-focused'; // New trip style option
}
