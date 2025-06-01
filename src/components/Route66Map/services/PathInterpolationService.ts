
export class PathInterpolationService {
  /**
   * Creates ULTRA-STRAIGHT linear path between waypoints (ABSOLUTELY NO CURVES!)
   * @param waypoints Array of lat/lng coordinates
   * @param segmentPoints Number of interpolated points between each pair of waypoints (fewer = straighter)
   * @returns Array of interpolated coordinates creating the straightest possible path
   */
  static createSmoothPath(
    waypoints: google.maps.LatLngLiteral[], 
    segmentPoints: number = 5 // Reduced for maximum straightness
  ): google.maps.LatLngLiteral[] {
    if (waypoints.length < 2) {
      return waypoints;
    }

    console.log(`🛣️ Creating ULTRA-STRAIGHT linear path with ${segmentPoints} points per segment (ZERO CURVES)`);
    
    const ultraStraightPath: google.maps.LatLngLiteral[] = [];
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const current = waypoints[i];
      const next = waypoints[i + 1];
      
      // Add the current waypoint
      ultraStraightPath.push(current);
      
      // Create ULTRA-SIMPLE linear interpolation between current and next waypoint
      for (let t = 1; t <= segmentPoints; t++) {
        const alpha = t / segmentPoints;
        const interpolated = {
          lat: current.lat + (next.lat - current.lat) * alpha,
          lng: current.lng + (next.lng - current.lng) * alpha
        };
        ultraStraightPath.push(interpolated);
      }
    }
    
    // Add the final waypoint
    ultraStraightPath.push(waypoints[waypoints.length - 1]);
    
    console.log(`✅ Generated ${ultraStraightPath.length} ULTRA-STRAIGHT interpolated points for perfectly linear Route 66`);
    return ultraStraightPath;
  }

  /**
   * Simple linear interpolation between two points - MAXIMUM STRAIGHTNESS
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

  // ALL CURVE METHODS PERMANENTLY REMOVED to prevent accidental zigzag creation
  // NO catmullRomInterpolation, NO bezierInterpolation, NO spline methods

  private static calculateDistance(
    point1: google.maps.LatLngLiteral,
    point2: google.maps.LatLngLiteral
  ): number {
    const dlat = point2.lat - point1.lat;
    const dlng = point2.lng - point1.lng;
    return Math.sqrt(dlat * dlat + dlng * dlng);
  }
}
