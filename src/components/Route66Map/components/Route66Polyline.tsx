
import React from 'react';

interface Route66PolylineProps {
  map: google.maps.Map;
}

// This component has been completely removed to prevent route conflicts
// All route rendering is now handled by RoutePolyline component
const Route66Polyline: React.FC<Route66PolylineProps> = ({ map }) => {
  console.log('⚠️ Route66Polyline: Component deprecated and disabled to prevent route conflicts');
  return null;
};

export default Route66Polyline;
