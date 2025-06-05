
import { RouteGlobalState } from './RouteGlobalState';
import { RouteMarkersManager } from './RouteMarkersManager';
import { RoutePolylineManager } from './RoutePolylineManager';
import { RouteCleanupManager } from './RouteCleanupManager';
import type { Route66Waypoint } from '../types/supabaseTypes';

export class RouteRenderingService {
  private markersManager: RouteMarkersManager;
  private polylineManager: RoutePolylineManager;
  private cleanupManager: RouteCleanupManager;

  constructor(private map: google.maps.Map) {
    this.markersManager = new RouteMarkersManager(map);
    this.polylineManager = new RoutePolylineManager(map);
    this.cleanupManager = new RouteCleanupManager(map, this.markersManager, this.polylineManager);
  }

  async renderRoute(waypoints: Route66Waypoint[]): Promise<void> {
    console.log('🚫 RouteRenderingService: DISABLED to prevent conflicts with DestinationCitiesRouteRenderer');
    console.log('🔧 DEBUG: Using destination_cities table as single source of truth for Route 66');
    console.log('🔧 DEBUG: This service is disabled to prevent duplicate polylines');
    
    // This service is now disabled to prevent conflicts with the destination cities route
    // The DestinationCitiesRouteRenderer is now the primary route creation service
    return;
  }
}
