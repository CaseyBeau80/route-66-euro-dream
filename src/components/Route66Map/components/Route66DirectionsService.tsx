
import React from 'react';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

// Deprecated component - route rendering is now handled by RoutePolyline
const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  console.log('⚠️ Route66DirectionsService: Deprecated - use RoutePolyline instead');
  return null;
};

export default Route66DirectionsService;
