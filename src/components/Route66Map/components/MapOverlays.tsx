
import React from 'react';
import StaticRoute66Path from './StaticRoute66Path';
import Route66Polyline from './Route66Polyline';

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
      {/* Route 66 polyline following historic highways */}
      <Route66Polyline map={map} />
      
      {/* Simple static markers for Route 66 reference */}
      <StaticRoute66Path map={map} enhanced={useEnhancedStatic} />
    </>
  );
};

export default MapOverlays;
