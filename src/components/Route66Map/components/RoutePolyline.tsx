
import React from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

// This component is completely disabled to prevent route conflicts
// All route rendering is now handled by Route66StaticPolyline component with single polyline
const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  console.log('⚠️ RoutePolyline: Component completely disabled to prevent conflicts with single Route66StaticPolyline');
  return null;
};

export default RoutePolyline;
