
import { route66WaypointData, getRoute66Coordinates } from './Route66Waypoints';

interface BackupRouteProps {
  map: google.maps.Map;
  directionsRenderer: google.maps.DirectionsRenderer | null;
}

const BackupRoute = ({ map, directionsRenderer }: BackupRouteProps) => {
  // Create a simple polyline as a backup if directions API fails
  const createBackupRoute = () => {
    if (!map || typeof google === 'undefined') return;
    
    console.log("Creating backup polyline route");
    
    // Clear any existing renderer paths
    if (directionsRenderer) {
      directionsRenderer.setMap(null);
    }
    
    // Get route coordinates
    const coordinates = getRoute66Coordinates();
    
    // Create a polyline path
    const routePath = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: '#B91C1C',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map
    });
    
    // Add markers for major cities
    route66WaypointData.filter(point => point.stopover).forEach(point => {
      new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: map,
        title: point.description || "Route 66 Waypoint",
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0I5MUMxQyIgZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCAxMS41YTIuNSAyLjUgMCAwIDEgMC01IDIuNSAyLjUgMCAwIDEgMCA1eiIvPjwvc3ZnPg==',
          scaledSize: new google.maps.Size(24, 24),
          anchor: new google.maps.Point(12, 24)
        }
      });
    });
    
    return routePath;
  };

  return {
    createBackupRoute
  };
};

export default BackupRoute;
