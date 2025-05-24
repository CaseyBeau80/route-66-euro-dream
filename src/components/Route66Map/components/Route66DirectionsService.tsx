
import { useEffect, useState } from 'react';
import { route66WaypointData } from './Route66Waypoints';
import BackupRoute from './BackupRoute';
import MultiSegmentRoute from './directions/MultiSegmentRoute';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [routeCalculated, setRouteCalculated] = useState<boolean | null>(null);
  const [useBackupRoute, setUseBackupRoute] = useState(false);

  // Initialize DirectionsService
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log("Initializing Route 66 directions service with multi-segment approach");
    setDirectionsService(new google.maps.DirectionsService());
  }, [map]);

  // Handle backup route when needed
  useEffect(() => {
    if (!map) return;
    
    // Check if direct route failed or if we explicitly need to use backup
    if (useBackupRoute || routeCalculated === false) {
      console.log("Using backup route method");
      const backupRoute = BackupRoute({ map, directionsRenderer: null });
      backupRoute.createBackupRoute();
    }
  }, [map, routeCalculated, useBackupRoute]);

  // If no directions service, don't render anything
  if (!directionsService) return null;

  return (
    <>
      <MultiSegmentRoute 
        map={map}
        directionsService={directionsService}
        onRouteCalculated={(success) => {
          console.log(`Multi-segment route calculation result: ${success}`);
          setRouteCalculated(success);
          if (!success) {
            console.log("Multi-segment route failed, will use backup");
            setUseBackupRoute(true);
          }
        }}
      />
    </>
  );
};

export default Route66DirectionsService;
