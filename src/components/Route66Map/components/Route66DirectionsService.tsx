
import React from 'react';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

// This component has been completely removed to prevent route conflicts
// All route rendering is now handled by RoutePolyline component
const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  console.log('⚠️ Route66DirectionsService: Component deprecated and disabled to prevent route conflicts');
  return null;
};

export default Route66DirectionsService;
