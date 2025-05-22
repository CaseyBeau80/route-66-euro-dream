
import { useEffect, useState } from 'react';
import { route66WaypointData } from './Route66Waypoints';
import BackupRoute from './BackupRoute';
import RouteChunk from './directions/RouteChunk';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [routeCalculated, setRouteCalculated] = useState<boolean | null>(null);
  const [useBackupRoute, setUseBackupRoute] = useState(false);

  // Initialize DirectionsService and DirectionsRenderer
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    setDirectionsService(new google.maps.DirectionsService());
    
    // Create a shared directions renderer with improved styling for better route visualization
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: '#DC2626', // Brighter red color for better visibility
        strokeOpacity: 1.0,     // Full opacity for better visibility
        strokeWeight: 5,        // Thicker line for better visibility
        zIndex: 10             // Higher z-index to ensure it appears above other map elements
      }
    });
    
    renderer.setMap(map);
    setDirectionsRenderer(renderer);
    
    return () => {
      if (renderer) {
        renderer.setMap(null);
      }
    };
  }, [map]);

  // Handle backup route when needed
  useEffect(() => {
    if (!map) return;
    
    // Check if direct route failed or if we explicitly need to use backup
    if (useBackupRoute || routeCalculated === false) {
      console.log("Using backup route method");
      const backupRoute = BackupRoute({ map, directionsRenderer });
      backupRoute.createBackupRoute();
    }
  }, [map, directionsRenderer, routeCalculated, useBackupRoute]);

  // If no directions service or renderer, don't render anything
  if (!directionsService || !directionsRenderer) return null;

  // Find the indices for Chicago (start of Route 66) and Santa Monica (end of Route 66)
  const chicagoIndex = route66WaypointData.findIndex(
    point => point.description?.includes("Chicago")
  );
  
  const santaMonicaIndex = route66WaypointData.findIndex(
    point => point.description?.includes("Santa Monica")
  );

  // If we couldn't find either endpoint, don't render anything
  if (chicagoIndex === -1 || santaMonicaIndex === -1) {
    console.error("Could not find Chicago or Santa Monica waypoints");
    return null;
  }
  
  return (
    <>
      <RouteChunk 
        map={map}
        directionsService={directionsService}
        directionsRenderer={directionsRenderer}
        startIndex={chicagoIndex}
        endIndex={santaMonicaIndex}
        onRouteCalculated={(success) => setRouteCalculated(success)}
      />
    </>
  );
};

export default Route66DirectionsService;
