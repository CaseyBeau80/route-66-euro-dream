
import React from 'react';

interface MapOverlaysProps {
  map: google.maps.Map;
  useEnhancedStatic?: boolean;
}

// This component has been completely removed to prevent route conflicts
// All route rendering is now handled by RoutePolyline component
const MapOverlays: React.FC<MapOverlaysProps> = ({ 
  map, 
  useEnhancedStatic = false 
}) => {
  console.log('⚠️ MapOverlays: Component deprecated and disabled to prevent route conflicts');
  return null;
};

export default MapOverlays;
