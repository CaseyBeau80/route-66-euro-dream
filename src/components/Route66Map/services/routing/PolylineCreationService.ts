
export class PolylineCreationService {
  /**
   * Creates the classic Route 66 road polylines with proper styling
   */
  static createRoute66Polylines(
    routePath: google.maps.LatLngLiteral[],
    map: google.maps.Map
  ): google.maps.Polyline[] {
    console.log('🎨 PolylineCreationService: Creating styled Route 66 polylines');

    // Create road edge (darker outline) first
    const roadEdge = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#2A2A2A',
      strokeOpacity: 0.8,
      strokeWeight: 16,
      zIndex: 1000,
      clickable: false,
      editable: false,
      draggable: false,
      visible: true
    });

    // Create main road surface (asphalt gray)
    const roadSurface = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#404040',
      strokeOpacity: 0.9,
      strokeWeight: 12,
      zIndex: 1001,
      clickable: true,
      editable: false,
      draggable: false,
      visible: true
    });

    // Create yellow center line (classic Route 66)
    const centerLine = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: '#FFD700',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      zIndex: 1002,
      clickable: false,
      editable: false,
      draggable: false,
      visible: true
    });

    // Set all polylines to map
    roadEdge.setMap(map);
    roadSurface.setMap(map);
    centerLine.setMap(map);

    // Add click listener to main surface
    roadSurface.addListener('click', (event: google.maps.MapMouseEvent) => {
      console.log('🛣️ Route 66 clicked at:', event.latLng?.toString());
    });

    console.log('✅ PolylineCreationService: Route 66 polylines created successfully');

    return [roadEdge, roadSurface, centerLine];
  }
}
