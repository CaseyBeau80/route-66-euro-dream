
import React from 'react';

interface Route66PathProps {
  path: google.maps.LatLngLiteral[];
}

// This component has been completely removed to prevent route conflicts
// All route rendering is now handled by RoutePolyline component
const Route66Path: React.FC<Route66PathProps> = ({ path }) => {
  console.log('⚠️ Route66Path: Component deprecated and disabled to prevent route conflicts');
  return null;
};

export default Route66Path;
