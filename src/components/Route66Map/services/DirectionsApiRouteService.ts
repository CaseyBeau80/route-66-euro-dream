
import { RouteGlobalState } from './RouteGlobalState';
import { PolylineStylesConfig } from './PolylineStylesConfig';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class DirectionsApiRouteService {
  private directionsService: google.maps.DirectionsService;
  private map: google.maps.Map;
  private renderers: google.maps.DirectionsRenderer[] = [];

  constructor(map: google.maps.Map) {
    this.map = map;
    this.directionsService = new google.maps.DirectionsService();
  }

  async createRealisticRoute66(majorStops: Route66Waypoint[]): Promise<void> {
    console.log('🛣️ Creating realistic Route 66 using Google Directions API');
    
    // Clear any existing routes
    this.clearExistingRoutes();
    
    // Define Route 66 highway segments with proper priorities
    const route66Segments = this.defineRoute66Segments(majorStops);
    
    // Process each segment with Directions API
    for (const segment of route66Segments) {
      await this.processSegment(segment);
    }
  }

  private defineRoute66Segments(majorStops: Route66Waypoint[]) {
    const segments = [];
    
    for (let i = 0; i < majorStops.length - 1; i++) {
      const start = majorStops[i];
      const end = majorStops[i + 1];
      
      // Determine the primary highway for this segment
      const highway = this.determineHighwayForSegment(start, end);
      
      segments.push({
        start,
        end,
        highway,
        avoidHighways: false, // We WANT to use highways for Route 66
        preferredRoute: this.getPreferredRouteOptions(highway)
      });
    }
    
    return segments;
  }

  private determineHighwayForSegment(start: Route66Waypoint, end: Route66Waypoint): string {
    // Determine highway based on geographic location
    const startLng = start.longitude;
    const endLng = end.longitude;
    
    if (startLng > -90) return 'I-55'; // Illinois
    if (startLng > -94.5) return 'I-44'; // Missouri
    if (startLng > -103) return 'I-44/I-40'; // Oklahoma
    if (startLng > -106) return 'I-40'; // Texas/New Mexico
    if (startLng > -114) return 'I-40'; // Arizona
    return 'I-40/I-15'; // California
  }

  private getPreferredRouteOptions(highway: string) {
    return {
      avoidHighways: false,
      avoidTolls: false,
      avoidFerries: true,
      region: 'US',
      // Prioritize the specific highways
      transitOptions: undefined,
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: google.maps.TrafficModel.BEST_GUESS
      }
    };
  }

  private async processSegment(segment: any): Promise<void> {
    return new Promise((resolve) => {
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(segment.start.latitude, segment.start.longitude),
        destination: new google.maps.LatLng(segment.end.latitude, segment.end.longitude),
        travelMode: google.maps.TravelMode.DRIVING,
        ...segment.preferredRoute,
        waypoints: [], // Keep it simple for now
        optimizeWaypoints: false
      };

      console.log(`🚗 Calculating route: ${segment.start.name} → ${segment.end.name} via ${segment.highway}`);

      this.directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          console.log(`✅ Route calculated successfully: ${segment.start.name} → ${segment.end.name}`);
          this.renderSegmentRoute(result, segment);
        } else {
          console.warn(`⚠️ Route calculation failed for ${segment.start.name} → ${segment.end.name} (${status})`);
          // Fallback to straight line with curves
          this.createFallbackRoute(segment);
        }
        resolve();
      });
    });
  }

  private renderSegmentRoute(result: google.maps.DirectionsResult, segment: any): void {
    // Create a custom renderer for Route 66 styling
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true, // We handle markers separately
      preserveViewport: true,
      polylineOptions: {
        strokeColor: '#2C1810', // Asphalt color
        strokeOpacity: 0.9,
        strokeWeight: 8,
        zIndex: 50
      }
    });

    renderer.setMap(this.map);
    renderer.setDirections(result);
    this.renderers.push(renderer);

    // Add yellow center line for authentic Route 66 look
    this.addCenterLine(result);

    // Store in global state for cleanup
    RouteGlobalState.addDirectionsRenderer(renderer);
  }

  private addCenterLine(result: google.maps.DirectionsResult): void {
    const route = result.routes[0];
    if (!route) return;

    const path: google.maps.LatLng[] = [];
    
    // Extract all points from the route
    route.legs.forEach(leg => {
      leg.steps.forEach(step => {
        if (step.path) {
          path.push(...step.path);
        }
      });
    });

    // Create yellow center line
    const centerLine = new google.maps.Polyline({
      path: path,
      strokeColor: '#FFD700', // Bright yellow
      strokeOpacity: 1.0,
      strokeWeight: 2,
      zIndex: 100,
      map: this.map
    });

    RouteGlobalState.addPolylineSegment(centerLine);
  }

  private createFallbackRoute(segment: any): void {
    console.log(`🛣️ Creating fallback curved route: ${segment.start.name} → ${segment.end.name}`);
    
    // Create a curved path between points
    const path = this.generateCurvedPath(
      { lat: segment.start.latitude, lng: segment.start.longitude },
      { lat: segment.end.latitude, lng: segment.end.longitude }
    );

    // Main route
    const mainPolyline = new google.maps.Polyline({
      path: path,
      strokeColor: '#2C1810',
      strokeOpacity: 0.9,
      strokeWeight: 8,
      zIndex: 50,
      map: this.map
    });

    // Yellow center line
    const centerLine = new google.maps.Polyline({
      path: path,
      strokeColor: '#FFD700',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      zIndex: 100,
      map: this.map
    });

    RouteGlobalState.addPolylineSegment(mainPolyline);
    RouteGlobalState.addPolylineSegment(centerLine);
  }

  private generateCurvedPath(start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral): google.maps.LatLngLiteral[] {
    const path: google.maps.LatLngLiteral[] = [];
    const steps = 20;
    
    // Calculate control points for a natural curve
    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;
    
    // Add slight curve variation based on direction
    const latOffset = (end.lng - start.lng) * 0.1;
    const lngOffset = (end.lat - start.lat) * 0.1;
    
    const control1 = {
      lat: start.lat + latOffset * 0.3,
      lng: start.lng + lngOffset * 0.3
    };
    
    const control2 = {
      lat: end.lat - latOffset * 0.3,
      lng: end.lng - lngOffset * 0.3
    };

    // Generate bezier curve points
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point = this.calculateBezierPoint(t, start, control1, control2, end);
      path.push(point);
    }

    return path;
  }

  private calculateBezierPoint(
    t: number,
    p0: google.maps.LatLngLiteral,
    p1: google.maps.LatLngLiteral,
    p2: google.maps.LatLngLiteral,
    p3: google.maps.LatLngLiteral
  ): google.maps.LatLngLiteral {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    const lat = uuu * p0.lat + 3 * uu * t * p1.lat + 3 * u * tt * p2.lat + ttt * p3.lat;
    const lng = uuu * p0.lng + 3 * uu * t * p1.lng + 3 * u * tt * p2.lng + ttt * p3.lng;

    return { lat, lng };
  }

  private clearExistingRoutes(): void {
    // Clear existing renderers
    this.renderers.forEach(renderer => {
      renderer.setMap(null);
    });
    this.renderers = [];
    
    // Clear global state
    RouteGlobalState.clearAll();
  }
}
