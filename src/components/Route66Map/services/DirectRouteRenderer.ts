
import type { Route66Waypoint } from '../types/supabaseTypes';
import { RouteSmoothingService } from './routing/RouteSmoothingService';
import { PolylineCreationService } from './routing/PolylineCreationService';
import { RouteVerificationService } from './routing/RouteVerificationService';

export class DirectRouteRenderer {
  private map: google.maps.Map;
  private routePolylines: google.maps.Polyline[] = [];

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  createVisibleRoute(waypoints: Route66Waypoint[]): void {
    console.log('🛣️ DirectRouteRenderer: Creating ANTI-PING-PONG Route 66');
    
    // Clear any existing polylines first
    this.clearRoute();
    
    if (waypoints.length < 2) {
      console.warn('⚠️ DirectRouteRenderer: Need at least 2 waypoints');
      return;
    }

    // Get major stops with STRICT anti-ping-pong filtering
    const smoothedStops = RouteSmoothingService.createSmoothWestToEastRoute(waypoints);

    if (smoothedStops.length < 2) {
      console.warn('⚠️ DirectRouteRenderer: Need at least 2 smoothed stops');
      return;
    }

    console.log('🛣️ DirectRouteRenderer: Using ANTI-PING-PONG stops:', smoothedStops.map(s => `${s.name} (${s.longitude.toFixed(2)})`));

    // Create path from smoothed waypoints
    const routePath = smoothedStops.map(stop => ({
      lat: stop.latitude,
      lng: stop.longitude
    }));

    console.log('🗺️ DirectRouteRenderer: Anti-ping-pong route path:', routePath);

    // Create styled polylines
    this.routePolylines = PolylineCreationService.createRoute66Polylines(routePath, this.map);

    // Verify immediate attachment
    const isVisible = RouteVerificationService.verifyRouteVisibility(this.routePolylines, this.map);
    
    console.log('✅ DirectRouteRenderer: ANTI-PING-PONG verification:', {
      routeVisible: isVisible,
      pathLength: routePath.length,
      polylineCount: this.routePolylines.length
    });

    // Force a map refresh to ensure visibility
    setTimeout(() => {
      console.log('🔄 DirectRouteRenderer: Forcing map refresh for visibility');
      
      // Re-check and re-attach if needed
      RouteVerificationService.ensurePolylineAttachment(this.routePolylines, this.map);
      
      // Force map refresh
      RouteVerificationService.forceMapRefresh(this.map);
    }, 100);

    console.log('✅ DirectRouteRenderer: ANTI-PING-PONG Route 66 creation completed');
  }

  clearRoute(): void {
    console.log('🧹 DirectRouteRenderer: Clearing existing route');
    this.routePolylines.forEach((polyline, index) => {
      try {
        polyline.setMap(null);
        console.log(`🧹 Cleared polyline ${index + 1}`);
      } catch (error) {
        console.warn(`⚠️ Error clearing polyline ${index + 1}:`, error);
      }
    });
    this.routePolylines = [];
  }

  getPolylines(): google.maps.Polyline[] {
    return this.routePolylines;
  }

  isRouteVisible(): boolean {
    return RouteVerificationService.verifyRouteVisibility(this.routePolylines, this.map);
  }
}
