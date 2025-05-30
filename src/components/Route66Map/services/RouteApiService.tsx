
import React from 'react';

interface RouteApiServiceProps {
  map: google.maps.Map;
  onRouteReady: (success: boolean, fallbackUsed: boolean) => void;
}

const RouteApiService = ({ map, onRouteReady }: RouteApiServiceProps) => {
  // This service is now simplified - API testing and route rendering
  // is handled by SimpleRoute66Service to prevent conflicts
  console.log('⚠️ RouteApiService: Deprecated - using SimpleRoute66Service instead');
  
  // Immediately report success to prevent blocking
  React.useEffect(() => {
    onRouteReady(true, false);
  }, [onRouteReady]);

  return null;
};

export default RouteApiService;
