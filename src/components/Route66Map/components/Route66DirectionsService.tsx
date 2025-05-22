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
  const [isChunk1Success, setIsChunk1Success] = useState<boolean | null>(null);
  const [isChunk2Success, setIsChunk2Success] = useState<boolean | null>(null);
  const [useBackupRoute, setUseBackupRoute] = useState(false);

  // Initialize DirectionsService and DirectionsRenderer
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    setDirectionsService(new google.maps.DirectionsService());
    
    // Create a shared directions renderer for better route visualization
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: '#B91C1C', // Deep red color for Route 66
        strokeOpacity: 0.8,
        strokeWeight: 4
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
    
    // Check if both chunks failed or if we explicitly need to use backup
    if (useBackupRoute || (isChunk1Success === false && isChunk2Success === false)) {
      console.log("Using backup route method");
      const backupRoute = BackupRoute({ map, directionsRenderer });
      backupRoute.createBackupRoute();
    }
  }, [map, directionsRenderer, isChunk1Success, isChunk2Success, useBackupRoute]);

  // Calculate optimal chunk size based on waypoint length
  // Google Maps API limits 25 waypoints per request (23 + origin + destination)
  const calculateOptimalChunks = useCallback(() => {
    const MAX_WAYPOINTS_PER_REQUEST = 23; // Google's limit minus origin/destination
    const totalWaypoints = route66WaypointData.length;
    
    // If we have fewer than max waypoints, just use one chunk
    if (totalWaypoints <= MAX_WAYPOINTS_PER_REQUEST + 2) {
      return [{ start: 0, end: totalWaypoints - 1 }];
    }
    
    // Otherwise divide into optimal chunks
    const numChunks = Math.ceil(totalWaypoints / MAX_WAYPOINTS_PER_REQUEST);
    const chunks = [];
    
    for (let i = 0; i < numChunks; i++) {
      const start = i === 0 ? 0 : i * MAX_WAYPOINTS_PER_REQUEST - 1;
      const end = Math.min((i + 1) * MAX_WAYPOINTS_PER_REQUEST, totalWaypoints - 1);
      chunks.push({ start, end });
    }
    
    return chunks;
  }, []);

  // If no directions service or renderer, don't render anything
  if (!directionsService || !directionsRenderer) return null;

  // Get optimal chunks for route calculation
  const chunks = calculateOptimalChunks();
  
  return (
    <>
      {chunks.map((chunk, index) => (
        <RouteChunk 
          key={`chunk-${index}`}
          map={map}
          directionsService={directionsService}
          directionsRenderer={directionsRenderer}
          startIndex={chunk.start}
          endIndex={chunk.end}
          onRouteCalculated={(success) => {
            if (index === 0) setIsChunk1Success(success);
            if (index === 1) setIsChunk2Success(success);
          }}
        />
      ))}
    </>
  );
};

export default Route66DirectionsService;
