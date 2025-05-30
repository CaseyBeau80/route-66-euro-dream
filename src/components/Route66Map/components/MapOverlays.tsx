
import React from 'react';
import StaticRoute66Path from './StaticRoute66Path';
import GeoJSONRoute66Map from './GeoJSONRoute66Map';

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
      {/* Route 66 GeoJSON layer with accurate road data */}
      <GeoJSONRoute66Map map={map} />
      
      {/* Simple static markers for Route 66 reference */}
      <StaticRoute66Path map={map} enhanced={useEnhancedStatic} />
    </>
  );
};

export default MapOverlays;
