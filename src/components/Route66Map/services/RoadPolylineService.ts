
export class RoadPolylineService {
  /**
   * Function to create road-like styling with multiple layers
   */
  static createRoadPolylines(map: google.maps.Map, path: google.maps.LatLngLiteral[]): google.maps.Polyline[] {
    const polylines: google.maps.Polyline[] = [];
    
    // Base road (dark asphalt)
    const baseRoad = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#2C2C2C', // Dark asphalt gray
      strokeOpacity: 1.0,
      strokeWeight: 16,
      clickable: false,
      zIndex: 1000
    });
    
    // Road surface (lighter gray)
    const roadSurface = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#4A4A4A', // Medium gray
      strokeOpacity: 1.0,
      strokeWeight: 12,
      clickable: false,
      zIndex: 1001
    });
    
    // Yellow striped center line with dashed pattern
    const centerLine = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FFD700', // Golden yellow
      strokeOpacity: 0, // Make main stroke invisible
      strokeWeight: 0, // No base stroke
      clickable: false,
      zIndex: 1002,
      icons: [{
        icon: {
          path: 'M 0,-2 0,2', // Vertical dash line
          strokeOpacity: 1.0,
          strokeColor: '#FFD700', // Bright yellow
          strokeWeight: 4, // Thick dashes for visibility
          scale: 1
        },
        offset: '0',
        repeat: '40px' // Spacing between dashes for striped effect
      }]
    });
    
    // Add all polylines to map
    baseRoad.setMap(map);
    roadSurface.setMap(map);
    centerLine.setMap(map);
    
    polylines.push(baseRoad, roadSurface, centerLine);
    
    console.log('🛣️ Created realistic road appearance with yellow striping');
    return polylines;
  }
}
