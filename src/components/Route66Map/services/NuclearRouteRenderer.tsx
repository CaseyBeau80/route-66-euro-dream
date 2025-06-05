
import React from 'react';

interface NuclearRouteRendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// This component is DISABLED to prevent conflicts with DestinationCitiesRouteRenderer
const NuclearRouteRenderer: React.FC<NuclearRouteRendererProps> = ({ map, isMapReady }) => {
  console.log('🚫 NuclearRouteRenderer: DISABLED to prevent conflicts with DestinationCitiesRouteRenderer');
  console.log('🔧 DEBUG: Using destination_cities table as single source of truth for Route 66');
  
  // This renderer is disabled to prevent duplicate polylines
  // The DestinationCitiesRouteRenderer now handles all route creation from destination_cities table
  return null;
};

export default NuclearRouteRenderer;
