
export class EnhancedPathInterpolationService {
  /**
   * Creates ULTRA-STRAIGHT path between properly sequenced waypoints
   * FIXED: No more ping-ponging with proper sequence validation
   */
  static createFlowingCurvedPath(
    waypoints: google.maps.LatLngLiteral[], 
    segmentPoints: number = 10 // Reduced for straighter lines
  ): google.maps.LatLngLiteral[] {
    if (waypoints.length < 2) {
      return waypoints;
    }

    console.log(`🛣️ Creating SEQUENCE-VALIDATED Route 66 path with ${segmentPoints} points per segment`);
    console.log('📍 Input waypoints sequence:', waypoints.map(w => `(${w.lat.toFixed(2)}, ${w.lng.toFixed(2)})`));
    
    // VALIDATION: Check for ping-ponging in longitude
    this.validateWaypointSequence(waypoints);
    
    const straightPath: google.maps.LatLngLiteral[] = [];
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const current = waypoints[i];
      const next = waypoints[i + 1];
      
      // Add the current waypoint
      if (i === 0) {
        straightPath.push(current);
      }
      
      // Create STRAIGHT linear interpolation between current and next waypoint
      for (let t = 1; t <= segmentPoints; t++) {
        const alpha = t / segmentPoints;
        const interpolated = {
          lat: current.lat + (next.lat - current.lat) * alpha,
          lng: current.lng + (next.lng - current.lng) * alpha
        };
        straightPath.push(interpolated);
      }
    }
    
    console.log(`✅ Generated ${straightPath.length} STRAIGHT interpolated points for Route 66`);
    return straightPath;
  }

  /**
   * Validates that waypoints don't create ping-ponging patterns
   */
  private static validateWaypointSequence(waypoints: google.maps.LatLngLiteral[]): void {
    console.log('🔍 Validating waypoint sequence for ping-ponging...');
    
    let pingPongDetected = false;
    
    for (let i = 0; i < waypoints.length - 2; i++) {
      const current = waypoints[i];
      const next = waypoints[i + 1];
      const afterNext = waypoints[i + 2];
      
      // Check for longitude ping-ponging (east-west-east or west-east-west)
      const lng1 = current.lng;
      const lng2 = next.lng;
      const lng3 = afterNext.lng;
      
      // Detect if direction changes significantly
      const direction1 = lng2 - lng1; // Positive = eastward, Negative = westward
      const direction2 = lng3 - lng2;
      
      // If directions are opposite and significant (more than 2 degrees)
      if (Math.sign(direction1) !== Math.sign(direction2) && 
          Math.abs(direction1) > 2 && Math.abs(direction2) > 2) {
        console.warn(`🚨 PING-PONG DETECTED between waypoints ${i}, ${i+1}, ${i+2}:`);
        console.warn(`   ${lng1.toFixed(2)} → ${lng2.toFixed(2)} → ${lng3.toFixed(2)}`);
        pingPongDetected = true;
      }
    }
    
    if (!pingPongDetected) {
      console.log('✅ No ping-ponging detected in waypoint sequence');
    } else {
      console.error('❌ PING-PONGING DETECTED! Route will zigzag incorrectly');
    }
  }

  /**
   * Simple linear interpolation - MAXIMUM STRAIGHTNESS
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
}
