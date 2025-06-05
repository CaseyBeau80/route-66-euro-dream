
import React from 'react';

interface UltraSmoothRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// This component is DISABLED to prevent conflicts with DestinationCitiesRouteRenderer
const UltraSmoothRouteRenderer: React.FC<UltraSmoothRouteRendererProps> = ({ map, isMapReady }) => {
  console.log('🚫 UltraSmoothRouteRenderer: DISABLED to prevent conflicts with DestinationCitiesRouteRenderer');
  console.log('🔧 DEBUG: Using destination_cities table as single source of truth');
  
  // This renderer is disabled to prevent duplicate polylines
  // The DestinationCitiesRouteRenderer now handles all route creation
  return null;
};

export default UltraSmoothRouteRenderer;
