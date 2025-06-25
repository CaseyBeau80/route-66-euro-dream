
import React from 'react';
import type { Route66Waypoint } from '../types/supabaseTypes';

interface RoutePolylineProps {
  map: google.maps.Map;
  waypoints: Route66Waypoint[];
}

// This component is COMPLETELY DISABLED to prevent conflicts with SimpleRoute66Polyline
const RoutePolyline: React.FC<RoutePolylineProps> = ({ map, waypoints }) => {
  console.log('🚫 RoutePolyline: COMPLETELY DISABLED - SimpleRoute66Polyline handles everything now');
  return null;
};

export default RoutePolyline;
