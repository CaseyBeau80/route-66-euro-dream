
import React from 'react';

interface MapOverlaysProps {
  map: google.maps.Map;
  useEnhancedStatic?: boolean;
}

const MapOverlays: React.FC<MapOverlaysProps> = ({ 
  map, 
  useEnhancedStatic = false 
}) => {
  // This component is now simplified - route rendering is handled by SimpleRoute66Service
  // This prevents conflicts between multiple route implementations
  console.log('🎯 MapOverlays: Route rendering delegated to SimpleRoute66Service');
  
  return null;
};

export default MapOverlays;
