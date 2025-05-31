
import React from 'react';

interface StaticRoute66PathProps {
  map: google.maps.Map;
  enhanced?: boolean;
}

// This component is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component
const StaticRoute66Path = ({ map, enhanced = false }: StaticRoute66PathProps) => {
  console.log('⚠️ StaticRoute66Path: Component completely disabled to prevent conflicts with single Route66StaticPolyline');
  return null;
};

export default StaticRoute66Path;
