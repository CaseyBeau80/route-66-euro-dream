
import React from 'react';

interface Route66StaticPolylineProps {
  map: google.maps.Map;
}

// This component is COMPLETELY DISABLED - replaced by SingleRouteManager
const Route66StaticPolyline: React.FC<Route66StaticPolylineProps> = ({ map }) => {
  console.log('⚠️ Route66StaticPolyline: COMPLETELY DISABLED - replaced by SingleRouteManager to prevent multiple routes');
  return null;
};

export default Route66StaticPolyline;
