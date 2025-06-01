
export class RouteGlobalState {
  private static polylineSegments: google.maps.Polyline[] = [];
  private static directionsRenderers: google.maps.DirectionsRenderer[] = [];
  private static markers: google.maps.Marker[] = [];

  static addPolylineSegment(polyline: google.maps.Polyline): void {
    this.polylineSegments.push(polyline);
  }

  static addDirectionsRenderer(renderer: google.maps.DirectionsRenderer): void {
    this.directionsRenderers.push(renderer);
  }

  static addMarker(marker: google.maps.Marker): void {
    this.markers.push(marker);
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
  }

  static getPolylineCount(): number {
    return this.polylineSegments.length;
  }

  static getRendererCount(): number {
    return this.directionsRenderers.length;
  }
}
