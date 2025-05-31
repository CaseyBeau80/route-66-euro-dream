
import React from 'react';

interface SingleRouteManagerProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// This component is COMPLETELY DISABLED - replaced by NuclearRouteRenderer
const SingleRouteManager: React.FC<SingleRouteManagerProps> = ({ map, isMapReady }) => {
  console.log('⚠️ SingleRouteManager: COMPLETELY DISABLED - replaced by NuclearRouteRenderer for absolute route control');
  return null;
};

export default SingleRouteManager;
