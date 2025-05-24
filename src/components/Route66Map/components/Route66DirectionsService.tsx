
import { useEffect, useState } from 'react';
import BackupRoute from './BackupRoute';
import RealHighwayRoute from './directions/RealHighwayRoute';

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
    
    console.log("Initializing Route 66 directions service for REAL highway following");
    setDirectionsService(new google.maps.DirectionsService());
  }, [map]);

  // Handle backup route when needed
  useEffect(() => {
    if (!map) return;
    
    if (useBackupRoute || routeCalculated === false) {
      console.log("Using backup route for areas where directions failed");
      const backupRoute = BackupRoute({ map, directionsRenderer: null });
      backupRoute.createBackupRoute();
    }
  }, [map, routeCalculated, useBackupRoute]);

  if (!directionsService) return null;

  return (
    <>
      <RealHighwayRoute 
        map={map}
        directionsService={directionsService}
        onRouteCalculated={(success) => {
          console.log(`Real highway route calculation result: ${success}`);
          setRouteCalculated(success);
          if (!success) {
            console.log("Highway route mostly failed, using backup");
            setUseBackupRoute(true);
          }
        }}
      />
    </>
  );
};

export default Route66DirectionsService;
