
import { detailedRoute66Waypoints } from './Route66WaypointsDetailed';

interface BackupRouteProps {
  map: google.maps.Map;
  directionsRenderer: google.maps.DirectionsRenderer | null;
}

const BackupRoute = ({ map, directionsRenderer }: BackupRouteProps) => {
  // Create a detailed polyline as a backup that follows the road network better
  const createBackupRoute = () => {
    if (!map || typeof google === 'undefined') return;
    
    console.log("Creating enhanced backup polyline route following detailed waypoints");
    
    // Clear any existing renderer paths
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
    
    // Use detailed coordinates for better road following
    const coordinates = detailedRoute66Waypoints.map(point => ({
      lat: point.lat,
      lng: point.lng
    }));
    
    // Create multiple polyline segments for better road representation
    const segments = [
      coordinates.slice(0, 9),   // Illinois
      coordinates.slice(8, 18),  // Missouri
      coordinates.slice(17, 23), // Oklahoma
      coordinates.slice(22, 25), // Texas
      coordinates.slice(24, 29), // New Mexico
      coordinates.slice(28, 33), // Arizona
      coordinates.slice(32, 38)  // California
    ];

    segments.forEach((segmentCoords, index) => {
      if (segmentCoords.length < 2) return;

      // Create a polyline path with enhanced styling
      const routePath = new google.maps.Polyline({
        path: segmentCoords,
        geodesic: true,
        strokeColor: '#DC2626',
        strokeOpacity: 1.0,
        strokeWeight: 5,
        zIndex: 10,
        map: map
      });
    });
    
    // Add markers for major cities only
    detailedRoute66Waypoints
      .filter(point => point.stopover)
      .forEach(point => {
        new google.maps.Marker({
          position: { lat: point.lat, lng: point.lng },
          map: map,
          title: point.description || "Route 66 Stop",
          icon: {
            url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0RDMjYyNiIgZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCAxMS41YTIuNSAyLjUgMCAwIDEgMC01IDIuNSAyLjUgMCAwIDEgMCA1eiIvPjwvc3ZnPg==',
            scaledSize: new google.maps.Size(28, 28),
            anchor: new google.maps.Point(14, 28)
          }
        });
      });
    
    console.log("Enhanced backup route created with detailed road-following waypoints");
  };

  return {
    createBackupRoute
  };
};

export default BackupRoute;
