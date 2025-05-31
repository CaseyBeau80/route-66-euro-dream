
import React from 'react';

interface MapOverlaysProps {
  map: google.maps.Map;
  useEnhancedStatic?: boolean;
}

// Deprecated component - route rendering is now handled by RoutePolyline
const MapOverlays: React.FC<MapOverlaysProps> = ({ 
  map, 
  useEnhancedStatic = false 
}) => {
  console.log('⚠️ MapOverlays: Deprecated - use RoutePolyline instead');
  return null;
};

export default MapOverlays;
