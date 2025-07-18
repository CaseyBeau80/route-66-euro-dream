
export class PolylineCreationService {
  /**
   * COMPLETELY DISABLED: All route creation now handled by AuthoritativeRoute66Renderer
   */
  static createRoute66Polylines(
    routePath: google.maps.LatLngLiteral[],
    map: google.maps.Map
  ): google.maps.Polyline[] {
    console.log('🚫 PolylineCreationService: COMPLETELY DISABLED - AuthoritativeRoute66Renderer is now the ONLY route system');
    return [];
  }

  static createPolyline(
    path: google.maps.LatLngLiteral[],
    map: google.maps.Map,
    options?: any
  ): google.maps.Polyline | null {
    console.log('🚫 PolylineCreationService: createPolyline DISABLED');
    return null;
  }

  static createSegmentedPolylines(
    path: google.maps.LatLngLiteral[],
    map: google.maps.Map
  ): google.maps.Polyline[] {
    console.log('🚫 PolylineCreationService: createSegmentedPolylines DISABLED');
    return [];
  }
}
