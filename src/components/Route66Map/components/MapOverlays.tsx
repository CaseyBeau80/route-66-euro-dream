
import React from 'react';
import StaticRoute66Path from './StaticRoute66Path';
import Route66StaticPolyline from './Route66StaticPolyline';

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
      {/* Main Route 66 polyline with highway markers */}
      <Route66StaticPolyline map={map} />
      
      {/* Simple static markers for Route 66 reference */}
      <StaticRoute66Path map={map} enhanced={useEnhancedStatic} />
    </>
  );
};

export default MapOverlays;
