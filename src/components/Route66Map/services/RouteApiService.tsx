
import React from 'react';

interface RouteApiServiceProps {
  map: google.maps.Map;
  onRouteReady: (success: boolean, fallbackUsed: boolean) => void;
}

// Deprecated component - route rendering is now handled by RoutePolyline
const RouteApiService = ({ map, onRouteReady }: RouteApiServiceProps) => {
  console.log('⚠️ RouteApiService: Deprecated - use RoutePolyline instead');
  
  // Immediately report success to prevent blocking
  React.useEffect(() => {
    onRouteReady(true, false);
  }, [onRouteReady]);

  return null;
};

export default RouteApiService;
