
export class PathInterpolationService {
  /**
   * Creates a smooth curved path between waypoints using Catmull-Rom spline interpolation
   * @param waypoints Array of lat/lng coordinates
   * @param segmentPoints Number of interpolated points between each pair of waypoints
   * @returns Array of interpolated coordinates creating a smooth curve
   */
  static createSmoothPath(
    waypoints: google.maps.LatLngLiteral[], 
    segmentPoints: number = 50
  ): google.maps.LatLngLiteral[] {
    if (waypoints.length < 2) {
      return waypoints;
    }

    console.log(`🌊 Creating smooth path with ${segmentPoints} points per segment`);
    
    const smoothPath: google.maps.LatLngLiteral[] = [];
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const current = waypoints[i];
      const next = waypoints[i + 1];
      
      // Calculate control points for smooth curves
      const prev = i > 0 ? waypoints[i - 1] : current;
      const nextNext = i < waypoints.length - 2 ? waypoints[i + 2] : next;
      
      // Add the current waypoint
      smoothPath.push(current);
      
      // Interpolate between current and next waypoint
      for (let t = 1; t <= segmentPoints; t++) {
        const alpha = t / segmentPoints;
        const interpolated = this.catmullRomInterpolation(prev, current, next, nextNext, alpha);
        smoothPath.push(interpolated);
      }
    }
    
    // Add the final waypoint
    smoothPath.push(waypoints[waypoints.length - 1]);
    
    console.log(`✅ Generated ${smoothPath.length} interpolated points for smooth Route 66`);
    return smoothPath;
  }

  /**
   * Catmull-Rom spline interpolation for smooth curves
   */
  private static catmullRomInterpolation(
    p0: google.maps.LatLngLiteral,
    p1: google.maps.LatLngLiteral,
    p2: google.maps.LatLngLiteral,
    p3: google.maps.LatLngLiteral,
    t: number
  ): google.maps.LatLngLiteral {
    const t2 = t * t;
    const t3 = t2 * t;
    
    // Catmull-Rom basis functions
    const f0 = -0.5 * t3 + t2 - 0.5 * t;
    const f1 = 1.5 * t3 - 2.5 * t2 + 1;
    const f2 = -1.5 * t3 + 2 * t2 + 0.5 * t;
    const f3 = 0.5 * t3 - 0.5 * t2;
    
    return {
      lat: f0 * p0.lat + f1 * p1.lat + f2 * p2.lat + f3 * p3.lat,
      lng: f0 * p0.lng + f1 * p1.lng + f2 * p2.lng + f3 * p3.lng
    };
  }

  /**
   * Simple linear interpolation between two points
   */
  static linearInterpolate(
    start: google.maps.LatLngLiteral,
    end: google.maps.LatLngLiteral,
    steps: number
  ): google.maps.LatLngLiteral[] {
    const path: google.maps.LatLngLiteral[] = [start];
    
    for (let i = 1; i < steps; i++) {
      const ratio = i / steps;
      path.push({
        lat: start.lat + (end.lat - start.lat) * ratio,
        lng: start.lng + (end.lng - start.lng) * ratio
      });
    }
    
    path.push(end);
    return path;
  }

  /**
   * Creates a bezier curve between waypoints for extra smoothness
   */
  static createBezierPath(
    waypoints: google.maps.LatLngLiteral[],
    curveFactor: number = 0.3,
    pointsPerSegment: number = 30
  ): google.maps.LatLngLiteral[] {
    if (waypoints.length < 2) return waypoints;
    
    const smoothPath: google.maps.LatLngLiteral[] = [waypoints[0]];
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const current = waypoints[i];
      const next = waypoints[i + 1];
      
      // Calculate control points
      const distance = this.calculateDistance(current, next);
      const controlOffset = distance * curveFactor;
      
      const control1 = {
        lat: current.lat + (next.lat - current.lat) * 0.3,
        lng: current.lng + controlOffset * (Math.random() - 0.5) * 0.1
      };
      
      const control2 = {
        lat: next.lat - (next.lat - current.lat) * 0.3,
        lng: next.lng + controlOffset * (Math.random() - 0.5) * 0.1
      };
      
      // Generate bezier curve points
      for (let t = 1; t <= pointsPerSegment; t++) {
        const alpha = t / pointsPerSegment;
        const point = this.bezierInterpolation(current, control1, control2, next, alpha);
        smoothPath.push(point);
      }
    }
    
    return smoothPath;
  }

  private static bezierInterpolation(
    p0: google.maps.LatLngLiteral,
    p1: google.maps.LatLngLiteral,
    p2: google.maps.LatLngLiteral,
    p3: google.maps.LatLngLiteral,
    t: number
  ): google.maps.LatLngLiteral {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    
    return {
      lat: uuu * p0.lat + 3 * uu * t * p1.lat + 3 * u * tt * p2.lat + ttt * p3.lat,
      lng: uuu * p0.lng + 3 * uu * t * p1.lng + 3 * u * tt * p2.lng + ttt * p3.lng
    };
  }

  private static calculateDistance(
    point1: google.maps.LatLngLiteral,
    point2: google.maps.LatLngLiteral
  ): number {
    const dlat = point2.lat - point1.lat;
    const dlng = point2.lng - point1.lng;
    return Math.sqrt(dlat * dlat + dlng * dlng);
  }
}
