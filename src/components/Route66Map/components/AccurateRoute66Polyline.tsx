
import React from 'react';

interface AccurateRoute66PolylineProps {
  map: google.maps.Map;
  isMapReady: boolean;
}

// This component is COMPLETELY DISABLED to prevent multiple polylines
// All route rendering is now handled EXCLUSIVELY by SingleRouteManager
const AccurateRoute66Polyline: React.FC<AccurateRoute66PolylineProps> = ({ map, isMapReady }) => {
  console.log('⚠️ AccurateRoute66Polyline: COMPLETELY DISABLED - replaced by SingleRouteManager to prevent multiple routes');
  return null;
};

export default AccurateRoute66Polyline;
