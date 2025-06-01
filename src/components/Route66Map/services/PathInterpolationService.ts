
import type { Route66Waypoint } from '../types/supabaseTypes';

export class PathInterpolationService {
  generateWindyPath(
    start: Route66Waypoint,
    end: Route66Waypoint,
    prevCity?: Route66Waypoint,
    nextCity?: Route66Waypoint
  ): google.maps.LatLngLiteral[] {
    const startPoint = { lat: start.latitude, lng: start.longitude };
    const endPoint = { lat: end.latitude, lng: end.longitude };
    
    // Create more realistic highway curves
    return this.generateHighwayCurve(startPoint, endPoint, prevCity, nextCity);
  }

  private generateHighwayCurve(
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    prevCity?: Route66Waypoint,
    nextCity?: Route66Waypoint
  ): google.maps.LatLngLiteral[] {
    const points: google.maps.LatLngLiteral[] = [];
    const numPoints = 50; // Smooth curve with many points
    
    // Calculate control points for highway-like curves
    const control1 = this.calculateControlPoint(start, end, 0.25, prevCity);
    const control2 = this.calculateControlPoint(start, end, 0.75, nextCity);
    
    // Generate bezier curve points
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const point = this.cubicBezier(t, start, control1, control2, end);
      points.push(point);
    }
    
    return points;
  }

  private calculateControlPoint(
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    ratio: number,
    referenceCity?: Route66Waypoint
  ): google.maps.LatLngLiteral {
    const baseLat = start.lat + (end.lat - start.lat) * ratio;
    const baseLng = start.lng + (end.lng - start.lng) * ratio;
    
    // Add curve variation to simulate highway routing
    let curveFactor = 0.1;
    
    // Adjust curve based on distance (longer segments need more curve)
    const distance = Math.sqrt(
      Math.pow(end.lat - start.lat, 2) + Math.pow(end.lng - start.lng, 2)
    );
    curveFactor *= Math.min(distance * 2, 0.3);
    
    // Add perpendicular offset for natural highway curve
    const perpLat = -(end.lng - start.lng) * curveFactor;
    const perpLng = (end.lat - start.lat) * curveFactor;
    
    return {
      lat: baseLat + perpLat,
      lng: baseLng + perpLng
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

  // Alternative method for highway-following interpolation
  generateHighwayAwareInterpolation(
    waypoints: Route66Waypoint[],
    segmentIndex: number
  ): google.maps.LatLngLiteral[] {
    if (segmentIndex >= waypoints.length - 1) return [];
    
    const current = waypoints[segmentIndex];
    const next = waypoints[segmentIndex + 1];
    const prev = segmentIndex > 0 ? waypoints[segmentIndex - 1] : undefined;
    const following = segmentIndex < waypoints.length - 2 ? waypoints[segmentIndex + 2] : undefined;
    
    return this.generateWindyPath(current, next, prev, following);
  }
}
