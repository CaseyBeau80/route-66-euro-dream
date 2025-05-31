
import React from 'react';

interface RouteApiServiceProps {
  map: google.maps.Map;
  onRouteReady: (success: boolean, fallbackUsed: boolean) => void;
}

// This component is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component
const RouteApiService = ({ map, onRouteReady }: RouteApiServiceProps) => {
  console.log('⚠️ RouteApiService: Component completely disabled to prevent route conflicts');
  
  // Don't call onRouteReady to prevent interference with the main route system
  return null;
};

export default RouteApiService;
