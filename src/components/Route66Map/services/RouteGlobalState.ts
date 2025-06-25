
export class RouteGlobalState {
  private static routeCreated: boolean = false;
  private static polylines: google.maps.Polyline[] = [];
  private static routeMarkers: google.maps.Marker[] = [];
  private static lastCreationTimestamp: number = 0;

  static setRouteCreated(created: boolean): void {
    console.log(`🌍 RouteGlobalState: Route created status changed to ${created}`);
    this.routeCreated = created;
    if (created) {
      this.lastCreationTimestamp = Date.now();
    }
  }

  static isRouteCreated(): boolean {
    return this.routeCreated;
  }

  static getLastCreationTimestamp(): number {
    return this.lastCreationTimestamp;
  }

  static addPolylines(polylines: google.maps.Polyline[]): void {
    console.log(`🌍 RouteGlobalState: Adding ${polylines.length} polylines to global state`);
    this.polylines = [...this.polylines, ...polylines];
  }

  static getPolylines(): google.maps.Polyline[] {
    return this.polylines;
  }

  static getPolylineCount(): number {
    // Filter out null/invalid polylines
    const validPolylines = this.polylines.filter(p => p && p.getMap());
    return validPolylines.length;
  }

  static addRouteMarker(marker: google.maps.Marker): void {
    this.routeMarkers.push(marker);
  }

  static getRouteMarkers(): google.maps.Marker[] {
    return this.routeMarkers;
  }

  static clearRouteMarkers(): void {
    console.log('🌍 RouteGlobalState: Clearing route markers');
    this.routeMarkers = [];
  }

  static clearPolylines(): void {
    console.log('🌍 RouteGlobalState: Clearing polylines from global state');
    // Remove polylines from map
    this.polylines.forEach(polyline => {
      try {
        if (polyline && polyline.getMap()) {
          polyline.setMap(null);
        }
      } catch (error) {
        console.warn('⚠️ Error removing polyline:', error);
      }
    });
    this.polylines = [];
  }

  static clearAll(): void {
    console.log('🌍 RouteGlobalState: Complete reset');
    this.clearPolylines();
    this.clearRouteMarkers();
    this.routeCreated = false;
    this.lastCreationTimestamp = 0;
  }

  static getDebugInfo(): object {
    return {
      routeCreated: this.routeCreated,
      polylinesCount: this.getPolylineCount(),
      routeMarkersCount: this.routeMarkers.length,
      lastCreationTimestamp: this.lastCreationTimestamp,
      timeSinceCreation: this.lastCreationTimestamp ? Date.now() - this.lastCreationTimestamp : 0
    };
  }
}
