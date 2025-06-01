export class PathInterpolationService {
  /**
   * Creates a simple linear path between waypoints (NO MORE CRAZY CURVES!)
   * @param waypoints Array of lat/lng coordinates
   * @param segmentPoints Number of interpolated points between each pair of waypoints
   * @returns Array of interpolated coordinates creating a straight-line path
   */
  static createSmoothPath(
    waypoints: google.maps.LatLngLiteral[], 
    segmentPoints: number = 20
  ): google.maps.LatLngLiteral[] {
    if (waypoints.length < 2) {
      return waypoints;
    }

    console.log(`🛣️ Creating LINEAR path with ${segmentPoints} points per segment (NO CURVES)`);
    
    const linearPath: google.maps.LatLngLiteral[] = [];
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const current = waypoints[i];
      const next = waypoints[i + 1];
      
      // Add the current waypoint
      linearPath.push(current);
      
      // Create simple linear interpolation between current and next waypoint
      for (let t = 1; t <= segmentPoints; t++) {
        const alpha = t / segmentPoints;
        const interpolated = {
          lat: current.lat + (next.lat - current.lat) * alpha,
          lng: current.lng + (next.lng - current.lng) * alpha
        };
        linearPath.push(interpolated);
      }
    }
    
    // Add the final waypoint
    linearPath.push(waypoints[waypoints.length - 1]);
    
    console.log(`✅ Generated ${linearPath.length} LINEAR interpolated points for straight Route 66`);
    return linearPath;
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

  // DEPRECATED: Removing curve-based interpolation methods that cause zigzag patterns
  // These methods are commented out to prevent accidental use
  /*
  private static catmullRomInterpolation(...) { ... }
  static createBezierPath(...) { ... }
  private static bezierInterpolation(...) { ... }
  */

  private static calculateDistance(
    point1: google.maps.LatLngLiteral,
    point2: google.maps.LatLngLiteral
  ): number {
    const dlat = point2.lat - point1.lat;
    const dlng = point2.lng - point1.lng;
    return Math.sqrt(dlat * dlat + dlng * dlng);
  }
}
