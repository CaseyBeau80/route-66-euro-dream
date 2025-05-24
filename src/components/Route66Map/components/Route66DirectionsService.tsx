
import { useEffect, useState } from 'react';
import BackupRoute from './BackupRoute';
import HistoricRouteService from './directions/HistoricRouteService';

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
    
    console.log("Initializing Historic Route 66 directions service following real highways");
    setDirectionsService(new google.maps.DirectionsService());
  }, [map]);

  // Handle backup route when needed
  useEffect(() => {
    if (!map) return;
    
    // Check if direct route failed or if we explicitly need to use backup
    if (useBackupRoute || routeCalculated === false) {
      console.log("Using backup route method for historic roads");
      const backupRoute = BackupRoute({ map, directionsRenderer: null });
      backupRoute.createBackupRoute();
    }
  }, [map, routeCalculated, useBackupRoute]);

  // If no directions service, don't render anything
  if (!directionsService) return null;

  return (
    <>
      <HistoricRouteService 
        map={map}
        directionsService={directionsService}
        onRouteCalculated={(success) => {
          console.log(`Historic Route 66 calculation result: ${success}`);
          setRouteCalculated(success);
          if (!success) {
            console.log("Historic route failed, will use backup");
            setUseBackupRoute(true);
          }
        }}
      />
    </>
  );
};

export default Route66DirectionsService;
