
import React from 'react';

interface StaticRoute66ServiceProps {
  map: google.maps.Map;
  onRouteReady: (success: boolean) => void;
}

// This component is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component
const StaticRoute66Service = ({ map, onRouteReady }: StaticRoute66ServiceProps) => {
  console.log('⚠️ StaticRoute66Service: Component completely disabled to prevent conflicts with single Route66StaticPolyline');
  
  // Don't call onRouteReady to prevent interference
  return null;
};

export default StaticRoute66Service;
