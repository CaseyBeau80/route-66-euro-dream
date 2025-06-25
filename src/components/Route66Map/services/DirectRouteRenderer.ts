
import type { Route66Waypoint } from '../types/supabaseTypes';

export class DirectRouteRenderer {
  private map: google.maps.Map;

  constructor(map: google.maps.Map) {
    this.map = map;
    console.log('🚫 DirectRouteRenderer: COMPLETELY DISABLED');
  }

  createVisibleRoute(waypoints: Route66Waypoint[]): void {
    console.log('🚫 DirectRouteRenderer: DISABLED - using AuthoritativeRoute66Renderer instead');
    console.log('🔧 This prevents conflicts with the authoritative route system');
    // This renderer is now disabled to prevent conflicts
  }

  createRoute66(waypoints: Route66Waypoint[]): void {
    console.log('🚫 DirectRouteRenderer: createRoute66 DISABLED');
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
