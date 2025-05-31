
import { RouteGlobalState } from './RouteGlobalState';
import { RouteMarkersManager } from './RouteMarkersManager';
import { RoutePolylineManager } from './RoutePolylineManager';

export class RouteCleanupManager {
  constructor(
    private map: google.maps.Map,
    private markersManager: RouteMarkersManager,
    private polylineManager: RoutePolylineManager
  ) {}

  performNuclearCleanup(): void {
    console.log('🧹 RouteCleanupManager: Performing nuclear cleanup of existing route');
    
    // Clean up polylines
    this.polylineManager.cleanupPolylines();

    // Clean up markers
    this.markersManager.cleanupMarkers();

    // Reset global state
    RouteGlobalState.setRouteCreated(false);
  }
}
