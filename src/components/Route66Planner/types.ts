
export interface PlannerFormData {
  startDate: string;
  startCity: string;
  endCity: string;
  planningType: 'duration' | 'daily';
  tripDuration: number;
  dailyHours: number;
  dailyMiles: number;
}

export interface DestinationCity {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  description?: string;
  image_url?: string;
}

export interface DaySegment {
  day: number;
  date: string;
  startCity: DestinationCity;
  endCity: DestinationCity;
  distance: number;
  drivingTime: string;
  attractions: Attraction[];
  weatherForecast?: string;
  funFact?: string;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  city_name: string;
  state: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  category?: string;
}

export interface TripItinerary {
  id: string;
  startDate: string;
  totalDays: number;
  totalDistance: number;
  totalDrivingTime: string;
  dailySegments: DaySegment[];
  route: google.maps.LatLngLiteral[];
  shareUrl?: string;
}
