
export interface RouteSegment {
  start: number;
  end: number;
  highway: string;
  description: string;
  waypoints: Array<{lat: number, lng: number, description: string}>;
}

export interface ComprehensiveRouteServiceProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  onRouteCalculated?: (success: boolean) => void;
}

export interface RouteCalculationResult {
  successfulSegments: number;
  totalSegments: number;
  successRate: number;
}
