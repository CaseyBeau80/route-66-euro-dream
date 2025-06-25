
import React from 'react';

interface DestinationCitiesRoute66RendererProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

const DestinationCitiesRoute66Renderer: React.FC<DestinationCitiesRoute66RendererProps> = ({
  map,
  isMapReady
}) => {
  console.log('🚫 DestinationCitiesRoute66Renderer: DISABLED to prevent conflicts with RoutePolyline');
  console.log('🔧 DEBUG: RoutePolyline component is now handling all route creation');
  
  // This renderer is disabled to prevent conflicts with the main RoutePolyline component
  // The RoutePolyline component now handles all route creation from waypoints data
  return null;
};

export default DestinationCitiesRoute66Renderer;
