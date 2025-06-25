
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
    
    // Verify each polyline before adding
    const validPolylines = polylines.filter(polyline => {
      const isValid = polyline && polyline.getMap();
      console.log(`🔍 RouteGlobalState: Polyline validation:`, {
        exists: !!polyline,
        hasMap: !!polyline?.getMap(),
        isValid
      });
      return isValid;
    });
    
    this.polylines = [...this.polylines, ...validPolylines];
    console.log(`🌍 RouteGlobalState: Total polylines in state: ${this.polylines.length}`);
  }

  static getPolylines(): google.maps.Polyline[] {
    return this.polylines;
  }

  static getPolylineCount(): number {
    // Filter out null/invalid polylines and check if they're still on the map
    const validPolylines = this.polylines.filter(p => {
      try {
        return p && p.getMap() !== null;
      } catch (error) {
        console.warn('⚠️ RouteGlobalState: Invalid polyline found:', error);
        return false;
      }
    });
    
    console.log(`🔍 RouteGlobalState: Polyline count check: ${validPolylines.length}/${this.polylines.length} valid`);
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
    this.routeMarkers.forEach(marker => {
      try {
        marker.setMap(null);
      } catch (error) {
        console.warn('⚠️ Error removing marker:', error);
      }
    });
    this.routeMarkers = [];
  }

  static clearPolylines(): void {
    console.log('🌍 RouteGlobalState: Clearing polylines from global state');
    // Remove polylines from map
    this.polylines.forEach((polyline, index) => {
      try {
        if (polyline && polyline.getMap()) {
          polyline.setMap(null);
          console.log(`🧹 Removed polyline ${index + 1}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error removing polyline ${index + 1}:`, error);
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
    const validPolylineCount = this.polylines.filter(p => {
      try {
        return p && p.getMap() !== null;
      } catch {
        return false;
      }
    }).length;
    
    return {
      routeCreated: this.routeCreated,
      totalPolylines: this.polylines.length,
      validPolylines: validPolylineCount,
      routeMarkersCount: this.routeMarkers.length,
      lastCreationTimestamp: this.lastCreationTimestamp,
      timeSinceCreation: this.lastCreationTimestamp ? Date.now() - this.lastCreationTimestamp : 0
    };
  }
}
