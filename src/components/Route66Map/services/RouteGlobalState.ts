
/**
 * Global state manager to prevent multiple Route 66 polylines
 */
class RouteGlobalStateManager {
  private static instance: RouteGlobalStateManager;
  private routeCreated = false;
  private activePolylines: google.maps.Polyline[] = [];
  private activeMap: google.maps.Map | null = null;
  private routeMarkers: google.maps.Marker[] = [];

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

  addPolylines(polylines: google.maps.Polyline[]): void {
    this.activePolylines = [...this.activePolylines, ...polylines];
    console.log('📍 RouteGlobalState: Added', polylines.length, 'polylines. Total:', this.activePolylines.length);
  }

  clearAllPolylines(): void {
    console.log('🧹 RouteGlobalState: Clearing all', this.activePolylines.length, 'polylines');
    
    this.activePolylines.forEach((polyline, index) => {
      try {
        polyline.setMap(null);
        console.log(`✅ Cleared polyline ${index + 1}`);
      } catch (error) {
        console.warn(`⚠️ Error clearing polyline ${index + 1}:`, error);
      }
    });
    
    this.activePolylines = [];
    this.routeCreated = false;
  }

  // Missing methods that other components need
  clearAll(): void {
    this.clearAllPolylines();
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
    this.clearAll();
    this.activeMap = null;
    console.log('🔄 RouteGlobalState: Complete reset');
  }
}

export const RouteGlobalState = RouteGlobalStateManager.getInstance();
