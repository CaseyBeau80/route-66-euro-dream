
import { useEffect } from 'react';

interface DirectionsRendererProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  directionsResult?: google.maps.DirectionsResult;
  options?: google.maps.DirectionsRendererOptions;
}

// This component is COMPLETELY DISABLED to prevent route conflicts
// All route rendering is now handled EXCLUSIVELY by Route66StaticPolyline component
const DirectionsRenderer = ({ 
  map, 
  directionsResult,
  options
}: DirectionsRendererProps) => {
  console.log('⚠️ DirectionsRenderer: Component COMPLETELY DISABLED to prevent multiple polylines - ONLY Route66StaticPolyline renders routes');
  
  // Return null immediately to prevent any DirectionsRenderer creation
  return null;
};

export default DirectionsRenderer;
