
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
    
    // Create a polyline path with enhanced styling for better visibility
    const routePath = new google.maps.Polyline({
      path: coordinates,
      geodesic: true,
      strokeColor: '#DC2626', // Brighter red color for better visibility
      strokeOpacity: 1.0,     // Full opacity
      strokeWeight: 5,        // Thicker line
      zIndex: 10,            // Higher z-index
      map: map
    });
    
    // Add markers for major cities
    route66WaypointData.filter(point => point.stopover).forEach(point => {
      new google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        map: map,
        title: point.description || "Route 66 Waypoint",
        icon: {
          url: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI0RDMjYyNiIgZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCAxMS41YTIuNSAyLjUgMCAwIDEgMC01IDIuNSAyLjUgMCAwIDEgMCA1eiIvPjwvc3ZnPg==',
          scaledSize: new google.maps.Size(28, 28),  // Slightly larger for better visibility
          anchor: new google.maps.Point(14, 28)
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
