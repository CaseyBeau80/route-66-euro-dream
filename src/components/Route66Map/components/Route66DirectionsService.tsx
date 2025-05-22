
import { useEffect, useState, useCallback } from 'react';
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
        strokeWeight: 5,        // Thicker line
        zIndex: 10              // Ensure it appears on top
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

  // Calculate route between Chicago and Santa Monica
  const calculateChicagoToSantaMonicaRoute = useCallback(() => {
    // Find Chicago and Santa Monica waypoints
    const chicagoWaypoint = route66WaypointData.find(
      point => point.description?.includes("Chicago")
    );
    
    const santaMonicaWaypoint = route66WaypointData.find(
      point => point.description?.includes("Santa Monica")
    );

    if (!chicagoWaypoint || !santaMonicaWaypoint) {
      console.error("Could not find Chicago or Santa Monica waypoints");
      setRouteCalculated(false);
      return;
    }

    // Get intermediate cities as waypoints for an accurate historic route
    // Using fewer waypoints to ensure we stay within Google Maps API limits
    // and create a more visible continuous route
    const waypoints = route66WaypointData
      .filter(point => point.stopover)  // Only include major stops
      .filter(point => 
        !point.description?.includes("Chicago") && 
        !point.description?.includes("Santa Monica")
      ) // Exclude origin and destination
      .map(point => ({
        location: point.description || new google.maps.LatLng(point.lat, point.lng),
        stopover: true
      }));

    return {
      origin: chicagoWaypoint,
      destination: santaMonicaWaypoint,
      waypoints
    };
  }, []);

  // If no directions service or renderer, don't render anything
  if (!directionsService || !directionsRenderer) return null;

  // Get route data
  const routeData = calculateChicagoToSantaMonicaRoute();
  
  if (!routeData) return null;
  
  return (
    <>
      <RouteChunk 
        map={map}
        directionsService={directionsService}
        directionsRenderer={directionsRenderer}
        origin={routeData.origin}
        destination={routeData.destination}
        waypoints={routeData.waypoints}
        onRouteCalculated={(success) => setRouteCalculated(success)}
      />
    </>
  );
};

export default Route66DirectionsService;
