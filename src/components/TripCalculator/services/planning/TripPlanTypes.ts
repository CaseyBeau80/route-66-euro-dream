
export interface TripPlan {
  id: string;
  title: string;
  startCity: string;
  endCity: string;
  startLocation: string;
  endLocation: string;
  startDate: Date;
  totalDays: number;
  totalDistance: number;
  totalMiles: number;
  totalDrivingTime: number;
  segments: DailySegment[];
  dailySegments: DailySegment[];
  tripStyle: string;
  stops: any[];
  lastUpdated: Date;
  stopsLimited?: boolean;
  limitMessage?: string;
}

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  distance: number;
  approximateMiles: number;
  driveTimeHours: number;
  destination: {
    city: string;
    state: string;
  };
  attractions: any[];
  recommendedStops: any[];
  weatherData: any;
  isGoogleMapsData: boolean;
}
