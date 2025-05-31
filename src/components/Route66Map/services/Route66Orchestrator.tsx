
import React from 'react';

interface Route66OrchestratorProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// This component is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component
const Route66Orchestrator: React.FC<Route66OrchestratorProps> = ({ 
  map, 
  isMapReady 
}) => {
  console.log('⚠️ Route66Orchestrator: Component completely disabled to prevent conflicts with single Route66StaticPolyline');
  return null;
};

export default Route66Orchestrator;
