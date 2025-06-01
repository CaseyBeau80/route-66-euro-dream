
import type { Route66Waypoint } from '../types/supabaseTypes';

export class PathInterpolationService {
  // Generate smooth curved path between waypoints for idealized route
  generateIdealizedCurvePath(
    start: Route66Waypoint,
    end: Route66Waypoint,
    prevWaypoint?: Route66Waypoint,
    nextWaypoint?: Route66Waypoint
  ): google.maps.LatLngLiteral[] {
    const startPoint = { lat: start.latitude, lng: start.longitude };
    const endPoint = { lat: end.latitude, lng: end.longitude };
    
    // Create smooth, natural highway curves
    return this.generateSmoothHighwayCurve(startPoint, endPoint, prevWaypoint, nextWaypoint);
  }

  private generateSmoothHighwayCurve(
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    prevWaypoint?: Route66Waypoint,
    nextWaypoint?: Route66Waypoint
  ): google.maps.LatLngLiteral[] {
    const points: google.maps.LatLngLiteral[] = [];
    
    // Calculate distance to determine curve intensity and point density
    const distance = this.calculateDistance(start, end);
    const numPoints = Math.max(30, Math.floor(distance * 60)); // Adaptive point density
    const curveIntensity = Math.min(distance * 0.2, 1.0); // Adaptive curve intensity
    
    // Calculate control points for natural curves
    const control1 = this.calculateSmartControlPoint(start, end, 0.3, curveIntensity, prevWaypoint);
    const control2 = this.calculateSmartControlPoint(start, end, 0.7, curveIntensity, nextWaypoint);
    
    // Generate smooth bezier curve points
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const point = this.cubicBezier(t, start, control1, control2, end);
      points.push(point);
    }
    
    return points;
  }

  private calculateSmartControlPoint(
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    ratio: number,
    curveIntensity: number,
    referenceWaypoint?: Route66Waypoint
  ): google.maps.LatLngLiteral {
    // Base position along the direct line
    const baseLat = start.lat + (end.lat - start.lat) * ratio;
    const baseLng = start.lng + (end.lng - start.lng) * ratio;
    
    // Calculate perpendicular offset for natural highway curves
    const perpLat = -(end.lng - start.lng) * curveIntensity;
    const perpLng = (end.lat - start.lat) * curveIntensity;
    
    // Add slight randomness for natural variation
    const randomFactor = 0.2;
    const randomLat = (Math.random() - 0.5) * randomFactor * curveIntensity;
    const randomLng = (Math.random() - 0.5) * randomFactor * curveIntensity;
    
    // Influence from reference waypoint for smoother transitions
    let refInfluenceLat = 0;
    let refInfluenceLng = 0;
    
    if (referenceWaypoint) {
      const refInfluence = 0.15 * curveIntensity;
      refInfluenceLat = (referenceWaypoint.latitude - baseLat) * refInfluence;
      refInfluenceLng = (referenceWaypoint.longitude - baseLng) * refInfluence;
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

    // Cubic bezier formula for smooth curves
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

  // Legacy method for backward compatibility
  generateWindyPath(
    start: Route66Waypoint,
    end: Route66Waypoint,
    prevCity?: Route66Waypoint,
    nextCity?: Route66Waypoint
  ): google.maps.LatLngLiteral[] {
    return this.generateIdealizedCurvePath(start, end, prevCity, nextCity);
  }

  // Legacy method for backward compatibility
  generateHighwayAwareInterpolation(
    waypoints: Route66Waypoint[],
    segmentIndex: number
  ): google.maps.LatLngLiteral[] {
    if (segmentIndex >= waypoints.length - 1) return [];
    
    const current = waypoints[segmentIndex];
    const next = waypoints[segmentIndex + 1];
    const prev = segmentIndex > 0 ? waypoints[segmentIndex - 1] : undefined;
    const following = segmentIndex < waypoints.length - 2 ? waypoints[segmentIndex + 2] : undefined;
    
    return this.generateIdealizedCurvePath(current, next, prev, following);
  }
}
