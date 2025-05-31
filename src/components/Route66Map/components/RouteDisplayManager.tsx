
import React from 'react';

interface RouteDisplayManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// This component is COMPLETELY DISABLED - replaced by SingleRouteManager
const RouteDisplayManager: React.FC<RouteDisplayManagerProps> = ({ map, isMapReady }) => {
  console.log('⚠️ RouteDisplayManager: COMPLETELY DISABLED - replaced by SingleRouteManager to prevent multiple routes');
  return null;
};

export default RouteDisplayManager;
