
import { useEffect, useState } from 'react';
import ComprehensiveRouteService from './directions/ComprehensiveRouteService';
import RouteApiService from '../services/RouteApiService';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [apiCapabilities, setApiCapabilities] = useState<{
    directionsAvailable: boolean;
    fallbackUsed: boolean;
    tested: boolean;
  }>({
    directionsAvailable: false,
    fallbackUsed: false,
    tested: false
  });

  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    
    console.log("🗺️ Initializing Route 66 directions service with API testing");
    
    // Create directions service for testing
    const service = new google.maps.DirectionsService();
    setDirectionsService(service);
  }, [map]);

  const handleApiCapabilities = (directionsAvailable: boolean, fallbackUsed: boolean) => {
    console.log(`🎯 API capabilities determined: Directions=${directionsAvailable}, Fallback=${fallbackUsed}`);
    setApiCapabilities({
      directionsAvailable,
      fallbackUsed,
      tested: true
    });
  };

  if (!map) return null;

  return (
    <>
      {/* Test API capabilities and render static fallback if needed */}
      <RouteApiService 
        map={map}
        onRouteReady={handleApiCapabilities}
      />
      
      {/* Only use comprehensive route service if Directions API is available */}
      {apiCapabilities.tested && apiCapabilities.directionsAvailable && directionsService && (
        <ComprehensiveRouteService 
          map={map}
          directionsService={directionsService}
          onRouteCalculated={(success) => {
            console.log(`🏁 Comprehensive route calculation: ${success ? 'successful' : 'failed'}`);
          }}
        />
      )}
    </>
  );
};

export default Route66DirectionsService;
