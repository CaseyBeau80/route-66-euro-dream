
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class RouteSmoothingService {
  /**
   * SIMPLIFIED: Just sort by sequence_order - no complex filtering
   */
  static createSmoothWestToEastRoute(waypoints: Route66Waypoint[]): Route66Waypoint[] {
    console.log('🔄 SIMPLIFIED: Using sequence_order for Route 66 ordering');
    
    // Filter major stops and sort by sequence_order
    const majorStops = waypoints
      .filter(wp => wp.is_major_stop === true)
      .sort((a, b) => a.sequence_order - b.sequence_order);
    
    console.log('📍 Major stops in sequence order:', majorStops.map(s => `${s.sequence_order}. ${s.name}, ${s.state}`));
    
    return majorStops;
  }

  /**
   * LEGACY: Keep for compatibility but use simplified approach
   */
  private static applyStrictAntiPingPongFilter(sortedStops: Route66Waypoint[]): Route66Waypoint[] {
    console.log('🔄 SIMPLIFIED: No ping-pong filtering needed with sequence_order');
    return sortedStops;
  }

  /**
   * LEGACY: Keep for compatibility
   */
  private static selectEvenlySpacedStops(stops: Route66Waypoint[], targetCount: number): Route66Waypoint[] {
    console.log('🔄 SIMPLIFIED: No spacing needed with sequence_order');
    return stops;
  }
}
