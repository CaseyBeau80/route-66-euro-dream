

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
  tripStyle: 'destination-focused' | 'balanced';
  stops: any[];
  lastUpdated: Date;
  stopsLimited?: boolean;
  limitMessage?: string;
  // Additional properties that components expect
  startCityImage?: string;
  endCityImage?: string;
  isEnriched?: boolean;
  enrichmentStatus?: {
    weatherData?: boolean;
    stopsData?: boolean;
    validationComplete?: boolean;
  };
  exportTimestamp?: number;
  originalDays?: number;
  driveTimeBalance?: DriveTimeBalance;
  summary?: {
    totalDays: number;
    totalDistance: number;
    totalDriveTime: number;
    startLocation: string;
    endLocation: string;
    tripStyle?: string;
  };
}

export interface RecommendedStop {
  stopId: string;
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category?: string;
  city_name?: string;
  state?: string;
  city?: string;
}

export interface DriveTimeCategory {
  category: 'short' | 'optimal' | 'long' | 'extreme';
  message: string;
  color?: string;
}

export interface WeatherData {
  temperature?: number;
  highTemp?: number;
  lowTemp?: number;
  description?: string;
  condition?: string;
  humidity?: number;
  windSpeed?: number;
  precipitation?: number;
  cloudCover?: number;
  isActualForecast?: boolean;
  main?: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  temp?: {
    day: number;
    min: number;
    max: number;
  };
  weather?: Array<{
    description: string;
    icon: string;
    main: string;
  }>;
  icon?: string;
  source?: string;
}

export interface DriveTimeBalance {
  isBalanced: boolean;
  averageDriveTime: number;
  variance: number;
  driveTimeRange: { min: number; max: number };
  balanceQuality: 'excellent' | 'good' | 'fair' | 'poor';
  qualityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  overallScore: number;
  suggestions: string[];
  reason: string;
}

export interface DailySegment {
  day: number;
  title: string;
  startCity: string;
  endCity: string;
  distance: number;
  approximateMiles: number;
  driveTimeHours: number;
  drivingTime?: number;
  destination: {
    city: string;
    state: string;
  };
  attractions: any[];
  recommendedStops: RecommendedStop[];
  weatherData?: WeatherData;
  weather?: WeatherData;
  isGoogleMapsData?: boolean;
  stops?: any[];
  notes?: string;
  recommendations?: string[];
  driveTimeCategory?: DriveTimeCategory;
  routeSection?: string;
  subStopTimings?: any[];
  dataAccuracy?: string;
  routeProgression?: {
    segmentNumber: number;
    progressPercentage: number;
    cumulativeDistance: number;
    totalDistance: number;
  };
  driveTimeWarning?: string;
}

