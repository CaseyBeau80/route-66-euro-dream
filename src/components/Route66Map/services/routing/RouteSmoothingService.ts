
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class RouteSmoothingService {
  /**
   * Creates a perfectly smooth west-to-east route by eliminating ALL ping-ponging
   */
  static createSmoothWestToEastRoute(waypoints: Route66Waypoint[]): Route66Waypoint[] {
    console.log('🚫 ANTI-PING-PONG: Creating perfectly smooth west-to-east route');
    
    // Filter to major stops only first
    const majorStops = waypoints.filter(wp => wp.is_major_stop);
    
    // Sort by longitude (west to east) - ignore sequence_order as it may be causing ping-pong
    const westToEastSorted = majorStops.sort((a, b) => a.longitude - b.longitude);
    
    console.log('📍 All major stops west-to-east:', westToEastSorted.map(s => `${s.name} (${s.longitude.toFixed(2)})`));
    
    // Apply strict anti-ping-pong filtering
    const smoothRoute = this.applyStrictAntiPingPongFilter(westToEastSorted);
    
    console.log('✅ ANTI-PING-PONG: Final smooth route:', smoothRoute.map(s => `${s.name} (${s.longitude.toFixed(2)})`));
    
    return smoothRoute;
  }

  /**
   * Applies strict filtering to prevent ANY backtracking
   */
  private static applyStrictAntiPingPongFilter(sortedStops: Route66Waypoint[]): Route66Waypoint[] {
    if (sortedStops.length <= 2) return sortedStops;
    
    console.log('🔍 ANTI-PING-PONG: Applying strict backtracking prevention');
    
    const smoothStops: Route66Waypoint[] = [sortedStops[0]]; // Always include first stop
    let lastLongitude = sortedStops[0].longitude;
    
    // Only include stops that continue the eastward progression
    for (let i = 1; i < sortedStops.length; i++) {
      const currentStop = sortedStops[i];
      
      // Only add if it's definitely east of the last added stop
      if (currentStop.longitude > lastLongitude + 0.1) { // 0.1 degree buffer to prevent tiny ping-pongs
        smoothStops.push(currentStop);
        lastLongitude = currentStop.longitude;
        console.log(`✅ Added ${currentStop.name} (${currentStop.longitude.toFixed(2)}) - continuing eastward`);
      } else {
        console.log(`🚫 Skipped ${currentStop.name} (${currentStop.longitude.toFixed(2)}) - would cause backtrack from ${lastLongitude.toFixed(2)}`);
      }
    }
    
    // If we have too few stops, space them out more evenly
    if (smoothStops.length < 8) {
      return this.selectEvenlySpacedStops(smoothStops, Math.min(10, sortedStops.length));
    }
    
    return smoothStops;
  }

  /**
   * Selects evenly spaced stops for a smoother route
   */
  private static selectEvenlySpacedStops(stops: Route66Waypoint[], targetCount: number): Route66Waypoint[] {
    if (stops.length <= targetCount) return stops;
    
    const result: Route66Waypoint[] = [stops[0]]; // Always include first
    
    const step = Math.floor(stops.length / (targetCount - 1));
    for (let i = step; i < stops.length - 1; i += step) {
      result.push(stops[i]);
    }
    
    result.push(stops[stops.length - 1]); // Always include last
    
    console.log('📏 Selected evenly spaced stops:', result.map(s => `${s.name} (${s.longitude.toFixed(2)})`));
    
    return result;
  }
}
