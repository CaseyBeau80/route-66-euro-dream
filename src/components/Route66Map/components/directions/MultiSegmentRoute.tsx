
import React from 'react';

interface MultiSegmentRouteProps {
  map: google.maps.Map;
  directionsService: google.maps.DirectionsService;
  onRouteCalculated?: (success: boolean) => void;
}

// This component is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component
const MultiSegmentRoute = ({ 
  map, 
  directionsService,
  onRouteCalculated 
}: MultiSegmentRouteProps) => {
  console.log('⚠️ MultiSegmentRoute: Component completely disabled to prevent conflicts with single Route66StaticPolyline');
  
  // Don't call onRouteCalculated to prevent interference
  return null;
};

export default MultiSegmentRoute;
