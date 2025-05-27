
import React from 'react';
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
      {/* Simple static markers for Route 66 reference */}
      <StaticRoute66Path map={map} enhanced={useEnhancedStatic} />
    </>
  );
};

export default MapOverlays;
