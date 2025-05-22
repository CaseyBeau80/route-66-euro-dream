
import { useEffect, useState } from 'react';
import { route66WaypointData } from './Route66Waypoints';
import BackupRoute from './BackupRoute';
import RouteChunk from './directions/RouteChunk';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [isChunk1Success, setIsChunk1Success] = useState<boolean | null>(null);
  const [isChunk2Success, setIsChunk2Success] = useState<boolean | null>(null);
  const [useBackupRoute, setUseBackupRoute] = useState(false);

  // Initialize DirectionsService
  useEffect(() => {
    if (!map) return;
    setDirectionsService(new google.maps.DirectionsService());
  }, [map]);

  // Handle backup route when needed
  useEffect(() => {
    if (!map) return;
    
    // Check if both chunks failed or if we explicitly need to use backup
    if (useBackupRoute || (isChunk1Success === false && isChunk2Success === false)) {
      const backupRoute = BackupRoute({ map, directionsRenderer: null });
      backupRoute.createBackupRoute();
    }
  }, [map, isChunk1Success, isChunk2Success, useBackupRoute]);

  // Break route calculation into chunks
  const chunkDivision = Math.floor(route66WaypointData.length / 2);
  
  // If no directions service, don't render anything
  if (!directionsService) return null;

  return (
    <>
      <RouteChunk 
        map={map}
        directionsService={directionsService}
        startIndex={0}
        endIndex={chunkDivision}
        onRouteCalculated={(success) => setIsChunk1Success(success)}
      />
      <RouteChunk 
        map={map}
        directionsService={directionsService}
        startIndex={chunkDivision}
        endIndex={route66WaypointData.length - 1}
        onRouteCalculated={(success) => setIsChunk2Success(success)}
      />
    </>
  );
};

export default Route66DirectionsService;
