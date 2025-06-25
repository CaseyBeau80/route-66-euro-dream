
import type { Route66Waypoint } from '../types/supabaseTypes';

export class DirectRouteRenderer {
  private map: google.maps.Map;

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  createVisibleRoute(waypoints: Route66Waypoint[]): void {
    console.log('🚫 DirectRouteRenderer: DISABLED - using SimplifiedRouteRenderer instead');
    console.log('🔧 This prevents conflicts with the new simplified route system');
    // This renderer is now disabled to prevent conflicts
  }

  clearRoute(): void {
    console.log('🚫 DirectRouteRenderer: DISABLED - no cleanup needed');
  }

  getPolylines(): google.maps.Polyline[] {
    return [];
  }

  isRouteVisible(): boolean {
    return false;
  }
}
