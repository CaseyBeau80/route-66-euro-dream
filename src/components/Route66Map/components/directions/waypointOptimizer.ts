export class WaypointOptimizer {
  static optimizeWaypoints(waypoints: Array<{lat: number, lng: number, description: string}>): Array<{lat: number, lng: number, description: string}> {
    if (waypoints.length <= 10) {
      // If we have 10 or fewer waypoints, use all of them
      return waypoints;
    }

    // If we have more than 10 waypoints, we need to optimize
    // Google Directions API has a limit of 8 intermediate waypoints (plus origin and destination)
    const maxWaypoints = 8; // Intermediate waypoints (excluding origin and destination)
    
    console.log(`🎯 Optimizing ${waypoints.length} waypoints to ${maxWaypoints + 2} total waypoints`);

    // Always keep the first and last waypoints
    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const intermediateWaypoints = waypoints.slice(1, -1);

    if (intermediateWaypoints.length <= maxWaypoints) {
      return waypoints;
    }

    // Select key waypoints using strategic sampling
    const optimizedIntermediate = this.selectKeyWaypoints(intermediateWaypoints, maxWaypoints);
    
    return [origin, ...optimizedIntermediate, destination];
  }

  private static selectKeyWaypoints(
    waypoints: Array<{lat: number, lng: number, description: string}>, 
    targetCount: number
  ): Array<{lat: number, lng: number, description: string}> {
    
    if (waypoints.length <= targetCount) {
      return waypoints;
    }

    // Use evenly spaced sampling to maintain route integrity
    const step = waypoints.length / targetCount;
    const selected: Array<{lat: number, lng: number, description: string}> = [];

    for (let i = 0; i < targetCount; i++) {
      const index = Math.round(i * step);
      const clampedIndex = Math.min(index, waypoints.length - 1);
      selected.push(waypoints[clampedIndex]);
    }

    // Remove duplicates while preserving order
    const unique = selected.filter((waypoint, index, arr) => 
      index === 0 || 
      (waypoint.lat !== arr[index - 1].lat || waypoint.lng !== arr[index - 1].lng)
    );

    console.log(`📍 Selected ${unique.length} key waypoints from ${waypoints.length} total`);
    return unique;
  }

  static calculateDistance(
    point1: {lat: number, lng: number}, 
    point2: {lat: number, lng: number}
  ): number {
    // Haversine formula for calculating distance between two points
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) * 
      Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
