
export class RouteGlobalState {
  private static polylineSegments: google.maps.Polyline[] = [];
  private static directionsRenderers: google.maps.DirectionsRenderer[] = [];
  private static markers: google.maps.Marker[] = [];
  private static routeMarkers: google.maps.Marker[] = [];
  private static smoothPolyline: google.maps.Polyline | null = null;
  private static centerLine: google.maps.Polyline | null = null;
  private static routeCreated: boolean = false;

  static addPolylineSegment(polyline: google.maps.Polyline): void {
    this.polylineSegments.push(polyline);
  }

  static addDirectionsRenderer(renderer: google.maps.DirectionsRenderer): void {
    this.directionsRenderers.push(renderer);
  }

  static addMarker(marker: google.maps.Marker): void {
    this.markers.push(marker);
  }

  static getPolylineSegments(): google.maps.Polyline[] {
    return this.polylineSegments;
  }

  static clearPolylineSegments(): void {
    this.polylineSegments.forEach(polyline => {
      polyline.setMap(null);
    });
    this.polylineSegments = [];
  }

  static getRouteMarkers(): google.maps.Marker[] {
    return this.routeMarkers;
  }

  static clearRouteMarkers(): void {
    this.routeMarkers.forEach(marker => {
      marker.setMap(null);
    });
    this.routeMarkers = [];
  }

  static getSmoothPolyline(): google.maps.Polyline | null {
    return this.smoothPolyline;
  }

  static setSmoothPolyline(polyline: google.maps.Polyline | null): void {
    this.smoothPolyline = polyline;
  }

  static getCenterLine(): google.maps.Polyline | null {
    return this.centerLine;
  }

  static setCenterLine(centerLine: google.maps.Polyline | null): void {
    this.centerLine = centerLine;
  }

  static isRouteCreated(): boolean {
    return this.routeCreated;
  }

  static setRouteCreated(created: boolean): void {
    this.routeCreated = created;
  }

  static clearAll(): void {
    console.log('🧹 RouteGlobalState: Clearing all route elements');
    
    // Clear polylines
    this.polylineSegments.forEach(polyline => {
      polyline.setMap(null);
    });
    this.polylineSegments = [];

    // Clear directions renderers
    this.directionsRenderers.forEach(renderer => {
      renderer.setMap(null);
    });
    this.directionsRenderers = [];

    // Clear markers
    this.markers.forEach(marker => {
      marker.setMap(null);
    });
    this.markers = [];

    // Clear route markers
    this.clearRouteMarkers();

    // Clear legacy polylines
    if (this.smoothPolyline) {
      this.smoothPolyline.setMap(null);
      this.smoothPolyline = null;
    }
    
    if (this.centerLine) {
      this.centerLine.setMap(null);
      this.centerLine = null;
    }

    // Reset route created flag
    this.routeCreated = false;
  }

  static getPolylineCount(): number {
    return this.polylineSegments.length;
  }

  static getRendererCount(): number {
    return this.directionsRenderers.length;
  }
}
