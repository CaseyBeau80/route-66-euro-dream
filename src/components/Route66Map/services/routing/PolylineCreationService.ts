
export class PolylineCreationService {
  /**
   * SIMPLIFIED: Creates a single, highly visible Route 66 polyline
   */
  static createRoute66Polylines(
    routePath: google.maps.LatLngLiteral[],
    map: google.maps.Map
  ): google.maps.Polyline[] {
    console.log('🎨 PolylineCreationService: SIMPLIFIED single polyline creation');

    // Create single, highly visible polyline
    const routePolyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#DC2626', // Bright red
      strokeOpacity: 0.8,
      strokeWeight: 6,
      zIndex: 1000,
      clickable: true,
      editable: false,
      draggable: false,
      visible: true,
      map: map
    });

    // Add click listener
    routePolyline.addListener('click', (event: google.maps.MapMouseEvent) => {
      console.log('🛣️ Route 66 clicked at:', event.latLng?.toString());
    });

    console.log('✅ PolylineCreationService: Single polyline created successfully');

    return [routePolyline];
  }
}
