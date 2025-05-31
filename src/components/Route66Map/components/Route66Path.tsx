
import React from 'react';

interface Route66PathProps {
  path: google.maps.LatLngLiteral[];
}

// Deprecated component - route rendering is now handled by RoutePolyline
const Route66Path: React.FC<Route66PathProps> = ({ path }) => {
  console.log('⚠️ Route66Path: Deprecated component - use RoutePolyline instead');
  return null;
};

export default Route66Path;
