
export class EnhancedPathInterpolationService {
  /**
   * Creates smooth, flowing curves between waypoints using Catmull-Rom spline interpolation
   * @param waypoints Array of lat/lng coordinates
   * @param segmentPoints Number of interpolated points between each pair of waypoints
   * @returns Array of interpolated coordinates creating smooth curves
   */
  static createFlowingCurvedPath(
    waypoints: google.maps.LatLngLiteral[], 
    segmentPoints: number = 25 // Increased for smoother curves
  ): google.maps.LatLngLiteral[] {
    if (waypoints.length < 2) {
      return waypoints;
    }

    console.log(`🛣️ Creating FLOWING CURVED Route 66 path with ${segmentPoints} points per segment`);
    
    const smoothPath: google.maps.LatLngLiteral[] = [];
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      // Get control points for Catmull-Rom spline
      const p0 = i > 0 ? waypoints[i - 1] : waypoints[i];
      const p1 = waypoints[i];
      const p2 = waypoints[i + 1];
      const p3 = i < waypoints.length - 2 ? waypoints[i + 2] : waypoints[i + 1];
      
      // Add the current waypoint (except for the first iteration to avoid duplicates)
      if (i === 0) {
        smoothPath.push(p1);
      }
      
      // Create smooth interpolation between current and next waypoint
      for (let t = 1; t <= segmentPoints; t++) {
        const alpha = t / segmentPoints;
        const interpolated = this.catmullRomInterpolate(p0, p1, p2, p3, alpha);
        smoothPath.push(interpolated);
      }
    }
    
    console.log(`✅ Generated ${smoothPath.length} smooth curved points for flowing Route 66`);
    return smoothPath;
  }

  /**
   * Catmull-Rom spline interpolation for smooth curves
   */
  private static catmullRomInterpolate(
    p0: google.maps.LatLngLiteral,
    p1: google.maps.LatLngLiteral,
    p2: google.maps.LatLngLiteral,
    p3: google.maps.LatLngLiteral,
    t: number
  ): google.maps.LatLngLiteral {
    const t2 = t * t;
    const t3 = t2 * t;

    const lat = 0.5 * (
      (2 * p1.lat) +
      (-p0.lat + p2.lat) * t +
      (2 * p0.lat - 5 * p1.lat + 4 * p2.lat - p3.lat) * t2 +
      (-p0.lat + 3 * p1.lat - 3 * p2.lat + p3.lat) * t3
    );

    const lng = 0.5 * (
      (2 * p1.lng) +
      (-p0.lng + p2.lng) * t +
      (2 * p0.lng - 5 * p1.lng + 4 * p2.lng - p3.lng) * t2 +
      (-p0.lng + 3 * p1.lng - 3 * p2.lng + p3.lng) * t3
    );

    return { lat, lng };
  }

  /**
   * Enhanced bezier curve interpolation for even smoother transitions
   */
  static createBezierPath(
    waypoints: google.maps.LatLngLiteral[],
    tension: number = 0.4
  ): google.maps.LatLngLiteral[] {
    if (waypoints.length < 2) return waypoints;

    const path: google.maps.LatLngLiteral[] = [waypoints[0]];
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const current = waypoints[i];
      const next = waypoints[i + 1];
      
      // Calculate control points
      const dx = next.lng - current.lng;
      const dy = next.lat - current.lat;
      
      const cp1 = {
        lat: current.lat + dy * tension,
        lng: current.lng + dx * tension
      };
      
      const cp2 = {
        lat: next.lat - dy * tension,
        lng: next.lng - dx * tension
      };
      
      // Create bezier curve
      for (let t = 0.1; t <= 1; t += 0.05) {
        const bezierPoint = this.cubicBezier(current, cp1, cp2, next, t);
        path.push(bezierPoint);
      }
    }
    
    return path;
  }

  private static cubicBezier(
    p0: google.maps.LatLngLiteral,
    p1: google.maps.LatLngLiteral,
    p2: google.maps.LatLngLiteral,
    p3: google.maps.LatLngLiteral,
    t: number
  ): google.maps.LatLngLiteral {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      lat: mt3 * p0.lat + 3 * mt2 * t * p1.lat + 3 * mt * t2 * p2.lat + t3 * p3.lat,
      lng: mt3 * p0.lng + 3 * mt2 * t * p1.lng + 3 * mt * t2 * p2.lng + t3 * p3.lng
    };
  }
}
