
import { useEffect, useState } from 'react';
import ComprehensiveRouteService from './directions/ComprehensiveRouteService';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [routeCalculated, setRouteCalculated] = useState(false);

  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log("🗺️ Initializing Route 66 comprehensive directions service");
    
    // Create directions service
    const service = new google.maps.DirectionsService();
    setDirectionsService(service);
  }, [map]);

  const handleRouteCalculated = (success: boolean) => {
    setRouteCalculated(success);
    console.log(`🎯 Route 66 calculation ${success ? 'successful' : 'partially failed'}`);
  };

  if (!directionsService) return null;

  return (
    <ComprehensiveRouteService 
      map={map}
      directionsService={directionsService}
      onRouteCalculated={handleRouteCalculated}
    />
  );
};

export default Route66DirectionsService;
