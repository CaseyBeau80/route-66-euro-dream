
import React from 'react';
import Route66DirectionsService from './Route66DirectionsService';
import StaticRoute66Path from './StaticRoute66Path';

interface MapOverlaysProps {
  map: google.maps.Map;
  useEnhancedStatic?: boolean;
}

const MapOverlays: React.FC<MapOverlaysProps> = ({ 
  map, 
  useEnhancedStatic = false 
}) => {
  return (
    <>
      {/* Primary route service with API capability testing */}
      <Route66DirectionsService map={map} />
      
      {/* Enhanced static markers for additional context */}
      <StaticRoute66Path map={map} enhanced={useEnhancedStatic} />
    </>
  );
};

export default MapOverlays;
