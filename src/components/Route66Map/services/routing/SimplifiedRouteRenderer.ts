
import type { Route66Waypoint } from '../../types/supabaseTypes';

export class SimplifiedRouteRenderer {
  private map: google.maps.Map;

  constructor(map: google.maps.Map) {
    this.map = map;
    console.log('🚫 SimplifiedRouteRenderer: COMPLETELY DISABLED - AuthoritativeRoute66Renderer is now the ONLY route system');
  }

  createRoute66(waypoints: Route66Waypoint[]): void {
    console.log('🚫 SimplifiedRouteRenderer: DISABLED - All route creation now handled by AuthoritativeRoute66Renderer');
    // This renderer is now completely disabled to prevent conflicts
  }

  clearRoute(): void {
    console.log('🚫 SimplifiedRouteRenderer: DISABLED - No cleanup needed');
  }

  getPolylines(): google.maps.Polyline[] {
    return [];
  }

  isVisible(): boolean {
    return false;
  }
}
