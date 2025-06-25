
/**
 * Global state manager to prevent multiple Route 66 polylines
 * NUCLEAR VERSION - Aggressively prevents any duplicate polylines
 */
class RouteGlobalStateManager {
  private static instance: RouteGlobalStateManager;
  private routeCreated = false;
  private activePolylines: google.maps.Polyline[] = [];
  private activeMap: google.maps.Map | null = null;
  private routeMarkers: google.maps.Marker[] = [];
  private cleanupCallbacks: (() => void)[] = [];

  static getInstance(): RouteGlobalStateManager {
    if (!RouteGlobalStateManager.instance) {
      RouteGlobalStateManager.instance = new RouteGlobalStateManager();
    }
    return RouteGlobalStateManager.instance;
  }

  setRouteCreated(created: boolean): void {
    this.routeCreated = created;
    console.log('🛡️ RouteGlobalState: Route created status set to', created);
  }

  isRouteCreated(): boolean {
    return this.routeCreated;
  }

  // NUCLEAR CLEANUP - Remove ALL polylines from the map
  nuclearCleanup(): void {
    console.log('☢️ NUCLEAR CLEANUP: Removing ALL polylines from map');
    
    // Clear tracked polylines
    this.activePolylines.forEach((polyline, index) => {
      try {
        polyline.setMap(null);
        console.log(`☢️ Cleared tracked polyline ${index + 1}`);
      } catch (error) {
        console.warn(`⚠️ Error clearing tracked polyline ${index + 1}:`, error);
      }
    });
    
    // Execute all cleanup callbacks
    this.cleanupCallbacks.forEach((callback, index) => {
      try {
        callback();
        console.log(`☢️ Executed cleanup callback ${index + 1}`);
      } catch (error) {
        console.warn(`⚠️ Error in cleanup callback ${index + 1}:`, error);
      }
    });
    
    // Clear all tracking arrays
    this.activePolylines = [];
    this.cleanupCallbacks = [];
    this.routeCreated = false;
    
    console.log('☢️ NUCLEAR CLEANUP COMPLETE - All polylines should be removed');
  }

  addPolylines(polylines: google.maps.Polyline[]): void {
    // Clear existing polylines before adding new ones to ensure only one exists
    this.activePolylines.forEach(polyline => {
      try {
        polyline.setMap(null);
      } catch (error) {
        console.warn('⚠️ Error clearing existing polyline:', error);
      }
    });
    
    this.activePolylines = [...polylines];
    console.log('📍 RouteGlobalState: Replaced with', polylines.length, 'polylines. Total:', this.activePolylines.length);
  }

  addCleanupCallback(callback: () => void): void {
    this.cleanupCallbacks.push(callback);
  }

  clearAllPolylines(): void {
    this.nuclearCleanup();
  }

  clearAll(): void {
    this.nuclearCleanup();
    this.clearRouteMarkers();
  }

  getPolylineCount(): number {
    return this.activePolylines.length;
  }

  getRouteMarkers(): google.maps.Marker[] {
    return this.routeMarkers;
  }

  clearRouteMarkers(): void {
    console.log('🧹 RouteGlobalState: Clearing all route markers');
    this.routeMarkers.forEach((marker, index) => {
      try {
        marker.setMap(null);
        console.log(`✅ Cleared marker ${index + 1}`);
      } catch (error) {
        console.warn(`⚠️ Error clearing marker ${index + 1}:`, error);
      }
    });
    this.routeMarkers = [];
  }

  addRouteMarker(marker: google.maps.Marker): void {
    this.routeMarkers.push(marker);
  }

  setActiveMap(map: google.maps.Map | null): void {
    this.activeMap = map;
  }

  getActiveMap(): google.maps.Map | null {
    return this.activeMap;
  }

  reset(): void {
    this.nuclearCleanup();
    this.activeMap = null;
    console.log('🔄 RouteGlobalState: Complete nuclear reset');
  }
}

export const RouteGlobalState = RouteGlobalStateManager.getInstance();
