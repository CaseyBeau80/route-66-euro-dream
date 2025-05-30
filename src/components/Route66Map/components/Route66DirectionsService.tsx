
import React from 'react';

interface Route66DirectionsServiceProps {
  map: google.maps.Map;
}

const Route66DirectionsService = ({ map }: Route66DirectionsServiceProps) => {
  // This service is now deprecated in favor of SimpleRoute66Service
  // to prevent conflicts and ensure single source of truth for route rendering
  console.log('⚠️ Route66DirectionsService: Deprecated - using SimpleRoute66Service instead');
  
  return null;
};

export default Route66DirectionsService;
