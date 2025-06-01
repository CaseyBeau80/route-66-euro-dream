
import { RouteGlobalState } from './RouteGlobalState';
import { PolylineStylesConfig } from './PolylineStylesConfig';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class IdealizedRoute66Renderer {
  private map: google.maps.Map;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  async createIdealizedRoute66(majorStops: Route66Waypoint[]): Promise<void> {
    console.log('🛣️ Creating idealized curvy Route 66 polyline');
    
    // Clear any existing routes
    RouteGlobalState.clearAll();
    
    if (majorStops.length < 2) {
      console.warn('⚠️ Not enough major stops for route rendering');
      return;
    }

    // Generate the complete idealized path
    const completePath = this.generateIdealizedPath(majorStops);
    
    // Create the main asphalt road polyline
    const mainPolyline = new google.maps.Polyline({
      path: completePath,
      ...PolylineStylesConfig.getMainPolylineOptions()
    });
    
    mainPolyline.setMap(this.map);
    RouteGlobalState.addPolylineSegment(mainPolyline);

    // Create the yellow center line
    const centerLine = new google.maps.Polyline({
      path: completePath,
      ...PolylineStylesConfig.getCenterLineOptions()
    });
    
    centerLine.setMap(this.map);
    RouteGlobalState.addPolylineSegment(centerLine);

    console.log(`✅ Idealized Route 66 created with ${completePath.length} path points`);
    RouteGlobalState.setRouteCreated(true);
  }

  private generateIdealizedPath(majorStops: Route66Waypoint[]): google.maps.LatLngLiteral[] {
    const completePath: google.maps.LatLngLiteral[] = [];
    
    for (let i = 0; i < majorStops.length - 1; i++) {
      const start = majorStops[i];
      const end = majorStops[i + 1];
      
      // Generate curved segment between these two stops
      const segmentPath = this.generateCurvedSegment(
        start, 
        end, 
        i > 0 ? majorStops[i - 1] : null,
        i < majorStops.length - 2 ? majorStops[i + 2] : null
      );
      
      // Add segment to complete path (avoid duplicating waypoints)
      if (i === 0) {
        completePath.push(...segmentPath);
      } else {
        completePath.push(...segmentPath.slice(1)); // Skip first point to avoid duplication
      }
    }
    
    return completePath;
  }

  private generateCurvedSegment(
    start: Route66Waypoint,
    end: Route66Waypoint,
    prev: Route66Waypoint | null,
    next: Route66Waypoint | null
  ): google.maps.LatLngLiteral[] {
    const startPoint = { lat: start.latitude, lng: start.longitude };
    const endPoint = { lat: end.latitude, lng: end.longitude };
    
    // Calculate distance for curve intensity
    const distance = this.calculateDistance(startPoint, endPoint);
    const curveIntensity = Math.min(distance * 0.15, 0.8); // Adaptive curve based on distance
    
    // Generate control points for natural highway curves
    const control1 = this.calculateControlPoint(startPoint, endPoint, 0.25, curveIntensity, prev);
    const control2 = this.calculateControlPoint(startPoint, endPoint, 0.75, curveIntensity, next);
    
    // Generate smooth bezier curve with appropriate point density
    const numPoints = Math.max(20, Math.floor(distance * 50)); // More points for longer segments
    const segmentPath: google.maps.LatLngLiteral[] = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const point = this.cubicBezier(t, startPoint, control1, control2, endPoint);
      segmentPath.push(point);
    }
    
    return segmentPath;
  }

  private calculateControlPoint(
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    ratio: number,
    curveIntensity: number,
    reference: Route66Waypoint | null
  ): google.maps.LatLngLiteral {
    // Base position along the line
    const baseLat = start.lat + (end.lat - start.lat) * ratio;
    const baseLng = start.lng + (end.lng - start.lng) * ratio;
    
    // Calculate perpendicular offset for natural curves
    const perpLat = -(end.lng - start.lng) * curveIntensity;
    const perpLng = (end.lat - start.lat) * curveIntensity;
    
    // Add some randomness for natural variation
    const randomFactor = 0.3;
    const randomLat = (Math.random() - 0.5) * randomFactor * curveIntensity;
    const randomLng = (Math.random() - 0.5) * randomFactor * curveIntensity;
    
    // Influence from reference point for smoother transitions
    let refInfluenceLat = 0;
    let refInfluenceLng = 0;
    
    if (reference) {
      const refInfluence = 0.1 * curveIntensity;
      refInfluenceLat = (reference.latitude - baseLat) * refInfluence;
      refInfluenceLng = (reference.longitude - baseLng) * refInfluence;
    }
    
    return {
      lat: baseLat + perpLat + randomLat + refInfluenceLat,
      lng: baseLng + perpLng + randomLng + refInfluenceLng
    };
  }

  private cubicBezier(
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

    // Cubic bezier formula
    const lat = uuu * p0.lat + 3 * uu * t * p1.lat + 3 * u * tt * p2.lat + ttt * p3.lat;
    const lng = uuu * p0.lng + 3 * uu * t * p1.lng + 3 * u * tt * p2.lng + ttt * p3.lng;

    return { lat, lng };
  }

  private calculateDistance(
    point1: google.maps.LatLngLiteral,
    point2: google.maps.LatLngLiteral
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
