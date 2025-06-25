
import type { Route66Waypoint } from '../types/supabaseTypes';

export class AuthoritativeRoute66Renderer {
  private map: google.maps.Map;
  private static instance: AuthoritativeRoute66Renderer | null = null;

  constructor(map: google.maps.Map) {
    this.map = map;
    console.log('🚫 AuthoritativeRoute66Renderer: COMPLETELY DISABLED - RoutePolyline handles everything now');
  }

  static clearAllInstances(): void {
    console.log('🚫 AuthoritativeRoute66Renderer: clearAllInstances DISABLED');
  }

  createRoute66(waypoints: Route66Waypoint[]): void {
    console.log('🚫 AuthoritativeRoute66Renderer: createRoute66 DISABLED - RoutePolyline creates the route');
  }

  clearRoute(): void {
    console.log('🚫 AuthoritativeRoute66Renderer: clearRoute DISABLED');
  }

  isVisible(): boolean {
    return false;
  }

  getPolyline(): google.maps.Polyline | null {
    return null;
  }
}
